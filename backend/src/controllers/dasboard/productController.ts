// controllers/dashboard/productController.ts
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { IncomingForm } from 'formidable'; // Schimbă importul aici
import { v2 as cloudinary } from 'cloudinary';
import { responseReturn } from '../../utils/response';
import productModel from '../../models/productModel';
import dashboardController from './dashboardController';


// Interfaces
interface ProductRequest extends Request {
  id?: string;
}

interface ProductData {
  sellerId: string;
  name: string;
  slug: string;
  shopName: string;
  category: string;
  description: string;
  stock: number;
  price: number;
  discount: number;
  images: string[];
  brand: string;
}

interface ProductDocument {
  _id: Types.ObjectId;
  sellerId: string;
  name: string;
  slug: string;
  shopName: string;
  category: string;
  description: string;
  stock: number;
  price: number;
  discount: number;
  images: string[];
  brand: string;
  createdAt: Date;
}

interface UpdateProductBody {
  name: string;
  description: string;
  stock: number;
  price: number;
  discount: number;
  brand: string;
  productId: string;
}

class ProductController {
  
  add_product = async (req: ProductRequest, res: Response): Promise<void> => {
    const { id } = req;
    const form = new IncomingForm({ multiples: true }); // Folosește direct IncomingForm

    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        responseReturn(res, 400, { error: 'Error parsing form data' });
        return;
      }

      try {
        // Extract and normalize fields
        let { name, category, description, stock, price, discount, shopName, brand } = fields;
        let { images } = files;

        // Handle array fields (formidable can return arrays)
        if (Array.isArray(name)) name = name[0];
        if (Array.isArray(category)) category = category[0];
        if (Array.isArray(description)) description = description[0];
        if (Array.isArray(shopName)) shopName = shopName[0];
        if (Array.isArray(brand)) brand = brand[0];
        if (Array.isArray(stock)) stock = stock[0];
        if (Array.isArray(price)) price = price[0];
        if (Array.isArray(discount)) discount = discount[0];

        // Trim and validate strings
        name = typeof name === "string" ? name.trim() : "";
        category = typeof category === "string" ? category.trim() : "";
        description = typeof description === "string" ? description.trim() : "";
        shopName = typeof shopName === "string" ? shopName.trim() : "";
        brand = typeof brand === "string" ? brand.trim() : "";

        // Validation
        if (!name || !category || !description || !shopName || !brand) {
          responseReturn(res, 400, { error: 'All required fields must be provided' });
          return;
        }

        if (!stock || !price) {
          responseReturn(res, 400, { error: 'Stock and price are required' });
          return;
        }

        if (!images) {
          responseReturn(res, 400, { error: 'At least one image is required' });
          return;
        }

        const slug = name.split(' ').join('-').toLowerCase().replace(/\//g, '');

        cloudinary.config({
          cloud_name: process.env.cloud_name as string,
          api_key: process.env.api_key as string,
          api_secret: process.env.api_secret as string,
          secure: true
        });

        let allImageUrl: string[] = [];

        // Ensure images is an array
        if (!Array.isArray(images)) {
          images = [images];
        }

        // Upload images to Cloudinary
        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.uploader.upload(images[i].filepath, { 
            folder: 'products',
            quality: 'auto',
            fetch_format: 'auto'
          });
          allImageUrl.push(result.url);
        }

        const productData: ProductData = {
          sellerId: id || '',
          name,
          slug,
          shopName,
          category,
          description,
          stock: parseInt(stock as string) || 0,
          price: parseInt(price as string) || 0,
          discount: parseInt(discount as string) || 0,
          images: allImageUrl,
          brand
        };

        await productModel.create(productData);
        
        responseReturn(res, 201, { message: 'Product Added Successfully' });
      } catch (error) {
        console.error('Add product error:', (error as Error).message);
        responseReturn(res, 500, { error: 'Failed to add product' });
      }
    });
  }

  products_get = async (req: ProductRequest, res: Response): Promise<void> => {
    const { page, searchValue, parPage } = req.query;
    const { id } = req;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(parPage as string) || 10;
    const skipPage = limitNum * (pageNum - 1);

    try {
      let products: ProductDocument[];
      let totalProduct: number;

      if (searchValue && typeof searchValue === 'string') {
        products = await productModel.find({
          $text: { $search: searchValue },
          sellerId: id
        }).skip(skipPage).limit(limitNum).sort({ createdAt: -1 }) as any;
        
        totalProduct = await productModel.find({
          $text: { $search: searchValue },
          sellerId: id
        }).countDocuments();
      } else {
        products = await productModel.find({ sellerId: id })
          .skip(skipPage)
          .limit(limitNum)
          .sort({ createdAt: -1 }) as any;
          
        totalProduct = await productModel.find({ sellerId: id }).countDocuments();
      }
      
      responseReturn(res, 200, { products, totalProduct });
    } catch (error) {
      console.error('Get products error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Failed to fetch products' });
    }
  }

  product_get = async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.params;
    
    if (!productId) {
      responseReturn(res, 400, { error: 'Product ID is required' });
      return;
    }

    try {
      const product = await productModel.findById(productId) as any;
      
      if (!product) {
        responseReturn(res, 404, { error: 'Product not found' });
        return;
      }
      
      responseReturn(res, 200, { product });
    } catch (error) {
      console.error('Get product error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Failed to fetch product' });
    }
  }

  product_update = async (req: Request, res: Response): Promise<void> => {
    const { name, description, stock, price, discount, brand, productId } = req.body as UpdateProductBody;
    
    if (!productId) {
      responseReturn(res, 400, { error: 'Product ID is required' });
      return;
    }

    if (!name?.trim()) {
      responseReturn(res, 400, { error: 'Product name is required' });
      return;
    }

    const trimmedName = name.trim();
    const slug = trimmedName.split(' ').join('-').toLowerCase().replace(/\//g, '');

    try {
      const updateData = {
        name: trimmedName,
        description: description?.trim() || '',
        stock: Number(stock) || 0,
        price: Number(price) || 0,
        discount: Number(discount) || 0,
        brand: brand?.trim() || '',
        slug
      };

      await productModel.findByIdAndUpdate(productId, updateData);
      const product = await productModel.findById(productId) as any;
      
      if (!product) {
        responseReturn(res, 404, { error: 'Product not found after update' });
        return;
      }
      
      responseReturn(res, 200, { product, message: 'Product Updated Successfully' });
    } catch (error) {
      console.error('Update product error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Failed to update product' });
    }
  }

  product_image_update = async (req: Request, res: Response): Promise<void> => {
    const form = new IncomingForm({ multiples: false }); // Folosește direct IncomingForm

    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        responseReturn(res, 400, { error: 'Error parsing form data' });
        return;
      }

      try {
        const { oldImage, productId } = fields;
        const { newImage } = files;

        if (!productId || !oldImage || !newImage) {
          responseReturn(res, 400, { error: 'Product ID, old image URL, and new image are required' });
          return;
        }

        cloudinary.config({
          cloud_name: process.env.cloud_name as string,
          api_key: process.env.api_key as string,
          api_secret: process.env.api_secret as string,
          secure: true
        });

        const result = await cloudinary.uploader.upload(newImage.filepath, { 
          folder: 'products',
          quality: 'auto',
          fetch_format: 'auto'
        });

        if (!result || !result.url) {
          responseReturn(res, 500, { error: 'Image upload failed' });
          return;
        }

        const product = await productModel.findById(productId) as any;
        if (!product) {
          responseReturn(res, 404, { error: 'Product not found' });
          return;
        }
        
        const images = [...product.images];
        const imageIndex = images.findIndex((img: string) => img === oldImage);
        
        if (imageIndex === -1) {
          responseReturn(res, 404, { error: 'Old image not found in product' });
          return;
        }
        
        images[imageIndex] = result.url;
        await productModel.findByIdAndUpdate(productId, { images });

        const updatedProduct = await productModel.findById(productId) as any;
        responseReturn(res, 200, { product: updatedProduct, message: 'Product Image Updated Successfully' });
      } catch (error) {
        console.error('Update product image error:', (error as Error).message);
        responseReturn(res, 500, { error: 'Failed to update product image' });
      }
    });
  }

  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const productId = req.params.id;
      
      if (!productId) {
        responseReturn(res, 400, { error: 'Product ID is required' });
        return;
      }

      const product = await productModel.findById(productId) as any;

      if (!product) {
        responseReturn(res, 404, { error: 'Product not found' });
        return;
      }

      cloudinary.config({
        cloud_name: process.env.cloud_name as string,
        api_key: process.env.api_key as string,
        api_secret: process.env.api_secret as string,
        secure: true,
      });

      // Delete images from Cloudinary
      const imageDeletionPromises = product.images.map(async (imageUrl: string) => {
        try {
          const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
          return await cloudinary.uploader.destroy(`products/${publicId}`);
        } catch (error) {
          console.error('Failed to delete image from Cloudinary:', error);
          return null;
        }
      });
      
      await Promise.all(imageDeletionPromises);

      // Delete product from database
      await productModel.findByIdAndDelete(productId);

      // Delete associated banners
      try {
        await dashboardController.deleteBanners(productId);
      } catch (error) {
        console.error('Failed to delete banners:', error);
        // Continue execution even if banner deletion fails
      }

      responseReturn(res, 200, { message: 'Product deleted successfully' });
    } catch (error) {
      console.error(`Error deleting product with id ${req.params.id}:`, error);
      responseReturn(res, 500, { error: 'Failed to delete product' });
    }
  }
}

export default new ProductController();
