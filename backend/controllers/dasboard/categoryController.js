//controllers/dasboard/categoryController.js
const formidable = require("formidable");
const { responseReturn } = require("../../utiles/response")
const cloudinary = require('cloudinary').v2;
const categoryModel = require('../../models/categoryModel')

class categoryController{

  add_category = async (req, res) => {
    //console.log("Received request to add category");

    const form = new formidable.IncomingForm();
    form.parse(req, async(err,fields,files)=>{
      if (err) {
        console.error("Error parsing form data:", err);
        responseReturn(res, 404,{ error : 'something went wrong'})
      } else {

        //console.log("Fields:", fields);
        //console.log("Files:", files);

        let {name} = fields
        let {image} = files

        if (Array.isArray(name)) {
          name = name[0];  
        }
        
        if (typeof name === 'string') {
          name = name.trim();
        } else {
          //console.error("The name is not a valid string. Skipping trim.");
          return responseReturn(res, 400, { error: 'Invalid name format' });
        }
        
        const slug = name.split(' ').join('-');

        cloudinary.config({
          cloud_name: process.env.cloud_name,
          api_key: process.env.api_key,
          api_secret: process.env.api_secret,
          secure: true
        })

        try {

          //const result = await cloudinary.uploader.upload(image.filepath, { folder: 'categorys'})
          let filePath = Array.isArray(image) ? image[0].filepath : image.filepath;
          const result = await cloudinary.uploader.upload(filePath, { folder: 'categorys' });
          //console.log("File path for upload:", image.filepath);
          //console.log("Cloudinary upload result:", result);
          //console.log("Cloudinary upload categorys:", result);


          

          if (result) {
            const category = await categoryModel.create({
              name,
              slug,
              image: result.url
            })
            responseReturn(res, 201,{ category,message : 'Category Added Successfully'})
          } else {
            //console.error("Cloudinary upload failed");
            responseReturn(res, 404,{ error : 'Image Upload File'})
          }
        } catch (error) {
          //console.error("Error uploading image to Cloudinary:", error);
          responseReturn(res, 500,{ error : 'Internal Server Error'})
        }
      }
    })
  }

  // end method

  get_category = async (req, res) => {
    const {page,searchValue, parPage} = req.query 
    //console.log("Received request to get categories with parameters:", { page, searchValue, parPage });

    try {
      let skipPage = ''
      if (parPage && page) {
        skipPage = parseInt(parPage) * (parseInt(page) - 1)
        console.log("Calculated skipPage:", skipPage);
      }

      if (searchValue && page && parPage) { 
        //console.log("Searching with value:", searchValue);
        const categorys = await categoryModel.find({
          $text: { $search: searchValue }
        }).skip(skipPage).limit(parPage).sort({ createdAt: -1})
        const totalCategory = await categoryModel.find({
          $text: { $search: searchValue }
        }).countDocuments()
        responseReturn(res, 200,{categorys,totalCategory})
      } else if(searchValue === '' && page && parPage) {
        //console.log("Getting paginated categories without search value.");

        const categorys = await categoryModel.find({ }).skip(skipPage).limit(parPage).sort({ createdAt: -1})
        const totalCategory = await categoryModel.find({ }).countDocuments()
        responseReturn(res, 200,{categorys,totalCategory}) 
      } else { 
        //console.log("Getting all categories.");

        const categorys = await categoryModel.find({ }).sort({ createdAt: -1})
        const totalCategory = await categoryModel.find({ }).countDocuments()
        responseReturn(res, 200,{categorys,totalCategory})
      }
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  }

  // end method 
  update_category = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return responseReturn(res, 404, { error: 'Something went wrong' });
        }

        let { name } = fields;
        let { image } = files;
        const { id } = req.params;

       // Category name processing
        if (Array.isArray(name)) {
            name = name[0];
        }
        if (typeof name === 'string') {
            name = name.trim();
        } else {
            return responseReturn(res, 400, { error: 'Invalid name format' });
        }

        const slug = name.split(' ').join('-');

        try {
            // Retrieve the existing category from the database
            const existingCategory = await categoryModel.findById(id);
            if (!existingCategory) {
                return responseReturn(res, 404, { error: 'Category not found' });
            }

            let result = null;

            // If there is a new image, delete the old image and upload the new image
            if (image) {
                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true
                });

                // Delete the old image from Cloudinary
                const imageUrl = existingCategory.image;
                if (imageUrl) {
                    const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
                    await cloudinary.uploader.destroy(`categorys/${publicId}`);
                }

                // Upload the new image
                const filePath = Array.isArray(image) ? image[0].filepath : image.filepath;
                result = await cloudinary.uploader.upload(filePath, { folder: 'categorys' });
            }

            // Prepare the update data
            const updateData = { name, slug };
            if (result) {
                updateData.image = result.url;
            }

            /// Update the category in the database
            const updatedCategory = await categoryModel.findByIdAndUpdate(id, updateData, { new: true });
            responseReturn(res, 200, { category: updatedCategory, message: 'Category updated successfully' });
        } catch (error) {
            console.error("Error during category update:", error);
            responseReturn(res, 500, { error: 'Internal Server Error' });
        }
    });
};



  

  // end method

  deleteCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
  
      // Retrieve category details:
      const category = await categoryModel.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      // Configure Cloudinary (if necessary):
      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true
      });
  
      // Extract image public ID (if image exists):
      const imageUrl = category.image;
      const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
  
      // Delete image from Cloudinary (if image exists):
      try {
        await cloudinary.uploader.destroy(`categorys/${publicId}`);
      } catch (error) {
        console.error(`Error deleting image from Cloudinary:`, error);
      }
      
  
      // Delete category from database:
      await categoryModel.findByIdAndDelete(categoryId);
  
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error(`Error deleting category with id ${req.params.id}:`, error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  // end method
}

module.exports = new categoryController()