//src\controllers\dasboard\dashboardController.ts
import { Request, Response } from 'express';
import { responseReturn } from "../../utils/response";
import myShopWallet from '../../models/myShopWallet';
import productModel from '../../models/productModel';
import customerOrder from '../../models/customerOrder';
import sellerModel from '../../models/sellerModel';
import adminSellerMessage from '../../models/chat/adminSellerMessage';
import sellerWallet from '../../models/sellerWallet';
import authOrder from '../../models/authOrder';
import sellerCustomerMessage from '../../models/chat/sellerCustomerMessage';
import bannerModel from '../../models/bannerModel';
import { Types } from 'mongoose';
import cloudinary from 'cloudinary';
import formidable from 'formidable';




// Definim interfețe pentru formidable fields și files
interface FormidableFields {
    productId?: string | string[];
    [key: string]: string | string[] | undefined;
}

interface FormidableBannerFile {
    filepath: string;
    originalFilename?: string;
    mimetype?: string;
    size: number;
    [key: string]: any;
}

interface FormidableFiles {
    mainban?: FormidableBannerFile | FormidableBannerFile[];
    [key: string]: FormidableBannerFile | FormidableBannerFile[] | undefined;
}

class DashboardController {
    get_admin_dashboard_data = async (req: Request, res: Response): Promise<void> => {
        const { id } = req;
        try {
            const totalSale = await myShopWallet.aggregate([
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$amount' }
                    }
                }
            ]);
            const totalProduct = await productModel.find({}).countDocuments();
            const totalOrder = await customerOrder.find({}).countDocuments();
            const totalSeller = await sellerModel.find({}).countDocuments();
            const messages = await adminSellerMessage.find({}).limit(3);
            const recentOrders = await customerOrder.find({}).limit(5);
            responseReturn(res, 200, {
                totalProduct,
                totalOrder,
                totalSeller,
                messages,
                recentOrders,
                totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
            });
        } catch (error) {
            console.log((error as Error).message);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    }

    get_seller_dashboard_data = async (req: Request, res: Response): Promise<void> => {
        const { id } = req;
        
        if (!id) {
            responseReturn(res, 401, { error: 'Unauthorized' });
            return;
        }

        try {
            const totalSale = await sellerWallet.aggregate([
                {
                    $match: {
                        sellerId: {
                            $eq: id
                        }
                    }
                }, {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$amount' }
                    }
                }
            ]);

            const totalProduct = await productModel.find({
                sellerId: new Types.ObjectId(id)
            }).countDocuments();

            const totalOrder = await authOrder.find({
                sellerId: new Types.ObjectId(id)
            }).countDocuments();

            const totalPendingOrder = await authOrder.find({
                $and: [
                    {
                        sellerId: {
                            $eq: new Types.ObjectId(id)
                        }
                    },
                    {
                        delivery_status: {
                            $eq: 'pending'
                        }
                    }
                ]
            }).countDocuments();

            const messages = await sellerCustomerMessage.find({
                $or: [
                    {
                        senderId: {
                            $eq: id
                        }
                    }, {
                        receverId: {
                            $eq: id
                        }
                    }
                ]
            }).limit(3);

            const recentOrders = await authOrder.find({
                sellerId: new Types.ObjectId(id)
            }).limit(5);

            responseReturn(res, 200, {
                totalProduct,
                totalOrder,
                totalPendingOrder,
                messages,
                recentOrders,
                totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
            });
        } catch (error) {
            console.log((error as Error).message);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    }

    add_banner = async (req: Request, res: Response): Promise<void> => {
        const form = new formidable.IncomingForm({ multiples: true });
        
        form.parse(req, async (err: any, fields: any, files: any) => {
            if (err) {
                responseReturn(res, 500, { error: "Form parsing error" });
                return;
            }

            // Accesăm fields și files cu verificări de siguranță
            const productId = Array.isArray(fields.productId) ? fields.productId[0] : fields.productId;
            const mainban = files.mainban;

            if (!productId) {
                responseReturn(res, 400, { error: "Product ID is required" });
                return;
            }

            if (!mainban) {
                responseReturn(res, 400, { error: "Banner image is required" });
                return;
            }

            cloudinary.v2.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            });

            try {
                const product = await productModel.findById(productId);
                if (!product) {
                    responseReturn(res, 404, { error: "Product not found" });
                    return;
                }
                const { slug } = product;
                
                // Handle the case where mainban can be an array or a single file
                const mainbanFile = Array.isArray(mainban) ? mainban[0] : mainban;
                const result = await cloudinary.v2.uploader.upload(mainbanFile.filepath, { folder: 'banners' });
                
                const banner = await bannerModel.create({
                    productId,
                    banner: result.url,
                    link: slug
                });
                
                responseReturn(res, 200, { banner, message: "Banner Add Success" });
            } catch (error) {
                responseReturn(res, 500, { error: (error as Error).message });
            }
        });
    }

    get_banner = async (req: Request, res: Response): Promise<void> => {
        const { productId } = req.params;
        try {
            const banner = await bannerModel.findOne({ productId: new Types.ObjectId(productId) });
            responseReturn(res, 200, { banner });
        } catch (error) {
            responseReturn(res, 500, { error: (error as Error).message });
        }
    }

    update_banner = async (req: Request, res: Response): Promise<void> => {
        const { bannerId } = req.params;
        const form = new formidable.IncomingForm({});

        form.parse(req, async (err: any, fields: any, files: any) => {
            if (err) {
                responseReturn(res, 500, { error: "Form parsing error" });
                return;
            }

            const mainban = files.mainban;

            if (!mainban) {
                responseReturn(res, 400, { error: "Banner image is required" });
                return;
            }

            cloudinary.v2.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            });

            try {
                let banner = await bannerModel.findById(bannerId);
                if (!banner) {
                    responseReturn(res, 404, { error: "Banner not found" });
                    return;
                }
                
                // Corectăm logica pentru a trata banner.banner ca string
                const bannerUrl = banner.banner;
                const urlParts = bannerUrl.split('/');
                const filename = urlParts[urlParts.length - 1];
                const imageName = filename.split('.')[0];
                await cloudinary.v2.uploader.destroy(`banners/${imageName}`);

                // Handle the case where mainban can be an array or a single file
                const mainbanFile = Array.isArray(mainban) ? mainban[0] : mainban;
                const result = await cloudinary.v2.uploader.upload(mainbanFile.filepath, { folder: 'banners' });

                await bannerModel.findByIdAndUpdate(bannerId, {
                    banner: result.url
                });

                banner = await bannerModel.findById(bannerId);
                responseReturn(res, 200, { banner, message: "Banner Updated Success" });
            } catch (error) {
                responseReturn(res, 500, { error: (error as Error).message });
            }
        });
    }

    get_banners = async (req: Request, res: Response): Promise<void> => {
        try {
            const banners = await bannerModel.aggregate([
                {
                    $sample: {
                        size: 5
                    }
                }
            ]);
            responseReturn(res, 200, { banners });
        } catch (error) {
            responseReturn(res, 500, { error: (error as Error).message });
        }
    }

    deleteBanners = async (productId: string): Promise<void> => {
        try {
            // Găsește toate bannerele asociate produsului:
            const banners = await bannerModel.find({ productId });

            if (!banners.length) {
                console.log(`No banners found for productId: ${productId}`);
                return;
            }

            // Configurează Cloudinary:
            cloudinary.v2.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true,
            });

            // Șterge imaginile din Cloudinary:
            const bannerDeletionPromises = banners.map(async (banner) => {
                const bannerPublicId = banner.banner.split('/').slice(-1)[0].split('.')[0];
                return cloudinary.v2.uploader.destroy(`banners/${bannerPublicId}`);
            });
            await Promise.all(bannerDeletionPromises);

            // Șterge bannerele din baza de date:
            await bannerModel.deleteMany({ productId });
            console.log(`Banners associated with productId: ${productId} have been deleted.`);
        } catch (error) {
            console.error(`Error deleting banners for productId: ${productId}`, error);
            throw error; // Răspândește eroarea pentru a fi tratată de apelant.
        }
    }
}

export default new DashboardController();