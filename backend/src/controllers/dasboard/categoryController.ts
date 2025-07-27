// src\controllers\dasboard\categoryController.ts
import { Request, Response } from 'express';
import formidable, { Fields, Files, File } from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import categoryModel from '../../models/categoryModel';
import { responseReturn } from '../../utils/response';




interface CategoryQuery {
  page?: string;
  searchValue?: string;
  parPage?: string;
}

class CategoryController {
  public add_category = async (req: Request, res: Response): Promise<void> => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err: any, fields: Fields, files: Files) => {
      if (err) {
        responseReturn(res, 404, { error: 'Something went wrong' });
        return;
      }

      // Validare și extragere name
      let name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      if (typeof name !== 'string' || !name) {
        responseReturn(res, 400, { error: 'Invalid name format' });
        return;
      }

      name = name.trim();
      const slug = name.split(' ').join('-');

      // Validare imagine
      const rawImage = files.image;
      const imageFile = Array.isArray(rawImage) ? rawImage[0] : rawImage;

      if (!imageFile || typeof imageFile !== 'object' || !('filepath' in imageFile)) {
        responseReturn(res, 400, { error: 'Image is required' });
        return;
      }

      cloudinary.config({
        cloud_name: process.env.cloud_name!,
        api_key: process.env.api_key!,
        api_secret: process.env.api_secret!,
        secure: true
      });

      try {
        const result = await cloudinary.uploader.upload(imageFile.filepath, {
          folder: 'categorys'
        });

        const category = await categoryModel.create({
          name,
          slug,
          image: result.url
        });

        responseReturn(res, 201, { category, message: 'Category added successfully' });
      } catch (error) {
        console.error('Error creating category:', error);
        responseReturn(res, 500, { error: 'Internal Server Error' });
      }
    });
  };

  public get_category = async (req: Request<{}, {}, {}, CategoryQuery>, res: Response): Promise<void> => {
    const { page, searchValue, parPage } = req.query;

    try {
      let skipPage = 0;
      if (parPage && page) {
        skipPage = parseInt(parPage) * (parseInt(page) - 1);
      }

      if (searchValue && searchValue.trim() !== '' && page && parPage) {
        const categorys = await categoryModel.find({
          $text: { $search: searchValue }
        })
          .skip(skipPage)
          .limit(parseInt(parPage))
          .sort({ createdAt: -1 });

        const totalCategory = await categoryModel.find({
          $text: { $search: searchValue }
        }).countDocuments();

        responseReturn(res, 200, { categorys, totalCategory });
      } else if (page && parPage) {
        const categorys = await categoryModel.find({})
          .skip(skipPage)
          .limit(parseInt(parPage))
          .sort({ createdAt: -1 });

        const totalCategory = await categoryModel.find({}).countDocuments();

        responseReturn(res, 200, { categorys, totalCategory });
      } else {
        const categorys = await categoryModel.find({}).sort({ createdAt: -1 });
        const totalCategory = await categoryModel.find({}).countDocuments();

        responseReturn(res, 200, { categorys, totalCategory });
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error.message);
      responseReturn(res, 500, { error: 'Internal Server Error' });
    }
  };

  public update_category = async (req: Request, res: Response): Promise<void> => {
    const form = new formidable.IncomingForm();
    
    form.parse(req, async (err: any, fields: Fields, files: Files) => {
      if (err) {
        responseReturn(res, 404, { error: 'Something went wrong' });
        return;
      }

      // Extragere și validare name
      let name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      if (typeof name !== 'string' || !name) {
        responseReturn(res, 400, { error: 'Invalid name format' });
        return;
      }

      name = name.trim();
      const slug = name.split(' ').join('-');
      const { id } = req.params;

      try {
        const existingCategory = await categoryModel.findById(id);
        if (!existingCategory) {
          responseReturn(res, 404, { error: 'Category not found' });
          return;
        }

        let result = null;
        const imageFile = files.image;

        if (imageFile) {
          cloudinary.config({
            cloud_name: process.env.cloud_name!,
            api_key: process.env.api_key!,
            api_secret: process.env.api_secret!,
            secure: true
          });

          // Șterge imaginea veche
          const imageUrl = existingCategory.image;
          if (imageUrl) {
            const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
            try {
              await cloudinary.uploader.destroy(`categorys/${publicId}`);
            } catch (deleteError) {
              console.error('Error deleting old image:', deleteError);
            }
          }

          // Upload imaginea nouă
          const uploadFile = Array.isArray(imageFile) ? imageFile[0] : imageFile as File;
          if (uploadFile && uploadFile.filepath) {
            result = await cloudinary.uploader.upload(uploadFile.filepath, {
              folder: 'categorys'
            });
          }
        }

        const updateData: any = { name, slug };
        if (result) {
          updateData.image = result.url;
        }

        const updatedCategory = await categoryModel.findByIdAndUpdate(id, updateData, { new: true });
        responseReturn(res, 200, { category: updatedCategory, message: 'Category updated successfully' });
      } catch (error) {
        console.error('Error during category update:', error);
        responseReturn(res, 500, { error: 'Internal Server Error' });
      }
    });
  };

  public deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoryId = req.params.id;
      const category = await categoryModel.findById(categoryId);
      
      if (!category) {
        responseReturn(res, 404, { message: 'Category not found' });
        return;
      }

      cloudinary.config({
        cloud_name: process.env.cloud_name!,
        api_key: process.env.api_key!,
        api_secret: process.env.api_secret!,
        secure: true
      });

      // Șterge imaginea din Cloudinary
      const imageUrl = category.image;
      if (imageUrl) {
        const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
        try {
          await cloudinary.uploader.destroy(`categorys/${publicId}`);
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error);
        }
      }

      await categoryModel.findByIdAndDelete(categoryId);
      responseReturn(res, 200, { message: 'Category deleted successfully' });
    } catch (error) {
      console.error(`Error deleting category with id ${req.params.id}:`, error);
      responseReturn(res, 500, { message: 'Internal Server Error' });
    }
  };
}

export default new CategoryController();