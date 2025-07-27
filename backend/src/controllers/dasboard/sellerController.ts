
// controllers/dashboard/sellerController.ts
import { Request, Response } from 'express';
import * as formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import { responseReturn } from '../../utils/response';
import sellerModel from '../../models/sellerModel';


// Interfaces
interface QueryParams {
  page?: string;
  searchValue?: string;
  parPage?: string;
}

interface SellerStatusUpdateBody {
  sellerId: string;
  status: 'pending' | 'active' | 'deactive' | 'rejected';
}

interface SellerDocument {
  _id: string;
  status: string;
  createdAt: Date;
  [key: string]: any;
}

class SellerController {
  request_seller_get = async (req: Request, res: Response): Promise<void> => {
    const { page, searchValue, parPage } = req.query as QueryParams;
    const skipPage = parseInt(parPage || '0') * (parseInt(page || '1') - 1);

    try {
      if (searchValue) {
        // Implementation for search functionality can be added here
      } else {
        const sellers = await sellerModel.find({ status: 'pending' })
          .skip(skipPage)
          .limit(parseInt(parPage || '0'))
          .sort({ createdAt: -1 });
          
        const totalSeller = await sellerModel.find({ status: 'pending' }).countDocuments();
        responseReturn(res, 200, { sellers, totalSeller });
      }
    } catch (error) {
      responseReturn(res, 500, { error: (error as Error).message });
    }
  }

  get_seller = async (req: Request, res: Response): Promise<void> => {
    const { sellerId } = req.params;
    try {
      const seller = await sellerModel.findById(sellerId);
      responseReturn(res, 200, { seller });
    } catch (error) {
      responseReturn(res, 500, { error: (error as Error).message });
    }
  }

  seller_status_update = async (req: Request, res: Response): Promise<void> => {
    const { sellerId, status } = req.body as SellerStatusUpdateBody;
    try {
      await sellerModel.findByIdAndUpdate(sellerId, { status });
      const seller = await sellerModel.findById(sellerId);
      responseReturn(res, 200, { seller, message: 'Seller Status Updated Successfully' });
    } catch (error) {
      responseReturn(res, 500, { error: (error as Error).message });
    }
  }

  get_active_sellers = async (req: Request, res: Response): Promise<void> => {
    let { page, searchValue, parPage } = req.query as QueryParams;
    const pageNum = parseInt(page || '1');
    const parPageNum = parseInt(parPage || '0');

    const skipPage = parPageNum * (pageNum - 1);

    try {
      if (searchValue) {
        const sellers = await sellerModel.find({
          $text: { $search: searchValue },
          status: 'active'
        })
          .skip(skipPage)
          .limit(parPageNum)
          .sort({ createdAt: -1 });

        const totalSeller = await sellerModel.find({
          $text: { $search: searchValue },
          status: 'active'
        }).countDocuments();
        
        responseReturn(res, 200, { totalSeller, sellers });
      } else {
        const sellers = await sellerModel.find({ 
          status: 'active' 
        })
          .skip(skipPage)
          .limit(parPageNum)
          .sort({ createdAt: -1 });

        const totalSeller = await sellerModel.find({ 
          status: 'active' 
        }).countDocuments();
        
        responseReturn(res, 200, { totalSeller, sellers });
      }
    } catch (error) {
      console.log('active seller get ' + (error as Error).message);
      responseReturn(res, 500, { error: (error as Error).message });
    }
  }
}

export default new SellerController();