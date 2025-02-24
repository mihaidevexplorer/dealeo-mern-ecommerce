//controllers/dasboard/productController.js
const formidable = require("formidable");
const { responseReturn } = require("../../utiles/response")
const cloudinary = require('cloudinary').v2;
const productModel = require('../../models/productModel')
const dashboardController = require('./dashboardController');
 
class productController{

    add_product = async(req,res) => {
        //console.log('Product ID from Wishlist:', id);

        const {id} = req;
        const form = new formidable.IncomingForm({ multiples: true });

        form.parse(req, async(err, field, files) => {
            let {name, category,description, stock,price, discount,shopName,brand} = field;
            let {images} = files;

          
            if (Array.isArray(name)) name = name[0];
            if (Array.isArray(category)) category = category[0];
            if (Array.isArray(description)) description = description[0];
            if (Array.isArray(shopName)) shopName = shopName[0];
            if (Array.isArray(brand)) brand = brand[0];

            name = typeof name === "string" ? name.trim() : "";
            category = typeof category === "string" ? category.trim() : "";
            description = typeof description === "string" ? description.trim() : "";
            shopName = typeof shopName === "string" ? shopName.trim() : "";
            brand = typeof brand === "string" ? brand.trim() : "";

            name = name.trim()
            const slug = name.split(' ').join('-')

            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            })

            try {
                let allImageUrl = [];

                if (!Array.isArray(images)) {
                    images = [images]; 
                } 

                for (let i = 0; i < images.length; i++) {
                    const result = await cloudinary.uploader.upload(images[i].filepath, {folder: 'products'});
                    allImageUrl.push(result.url);
                }

                const slug = name.split(' ').join('-').toLowerCase().replace(/\//g, ''); 


                await productModel.create({
                    sellerId: id,
                    name,
                    slug,
                    shopName,
                    category: category.trim(),
                    description: description.trim(),
                    stock: parseInt(stock),
                    price: parseInt(price),
                    discount: parseInt(discount),
                    images: allImageUrl,
                    brand: brand.trim()  
                })
                responseReturn(res, 201,{ message : 'Product Added Successfully'})
                
            } catch (error) {
                responseReturn(res, 500,{ error : error.message})
            }
 
        })
         
    }

    /// end method 

    products_get = async (req, res) => {
        const {page,searchValue, parPage} = req.query 
        const {id} = req;

       const skipPage = parseInt(parPage) * (parseInt(page) - 1)

        try {

            if (searchValue) {
                const products = await productModel.find({
                    $text: { $search: searchValue },
                    sellerId: id
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1})
                const totalProduct = await productModel.find({
                    $text: { $search: searchValue },
                    sellerId: id
                }).countDocuments()
                responseReturn(res, 200,{products,totalProduct})
            } else {
                const products = await productModel.find({ sellerId:id }).skip(skipPage).limit(parPage).sort({ createdAt: -1})
            const totalProduct = await productModel.find({ sellerId:id }).countDocuments()
            responseReturn(res, 200,{products,totalProduct}) 
            }
            
        } catch (error) {
            console.log(error.message)
        } 

    }

    // End Method 

    product_get = async (req, res) => {
        const { productId } = req.params;
        try {
            const product = await productModel.findById(productId)
            responseReturn(res, 200,{product})
        } catch (error) {
            console.log(error.message)
        }
    }
    // End Method 

    product_update = async (req, res) => {
        let {name, description, stock,price, discount,brand,productId} = req.body;
        name = name.trim()
        //const slug = name.split(' ').join('-')
        const slug = name.split(' ').join('-').toLowerCase().replace(/\//g, ''); 

        try {
            await productModel.findByIdAndUpdate(productId, {
                name, description, stock,price, discount,brand,productId, slug
            })
            const product = await productModel.findById(productId)
            responseReturn(res, 200,{product, message : 'Product Updated Successfully'})
        } catch (error) {
            responseReturn(res, 500,{ error : error.message })
        }


    } 

  // End Method 

  product_image_update = async(req,res) => {
    const form = new formidable.IncomingForm({ multiples: true });

    form.parse(req, async (err, field, files) => {
        const {oldImage,productId} = field;
        const { newImage } = files

        if (err) {
            responseReturn(res, 400,{ error : err.message })
        }else{
            try {

                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true
                })

                const result = await cloudinary.uploader.upload(newImage.filepath, { folder: 'products'})

                if (result) {
                    let {images} = await productModel.findById(productId)
                    const index = images.findIndex(img => img === oldImage) 
                    images[index] = result.url;
                    await productModel.findByIdAndUpdate(productId,{images}) 

                    const product = await productModel.findById(productId)
                    responseReturn(res, 200,{product, message : 'Product Image Updated Successfully'})

                } else {
                    responseReturn(res, 404,{ error : 'Image Upload Failed'})
                }

                
            } catch (error) {
                responseReturn(res, 404,{ error : error.message })
            }
        }

 

    })
  }
  // End Method 

  //Delete Product
  deleteProduct = async (req, res) => {
    try {
      //Retrieve product details:  
      const productId = req.params.id;
      const product = await productModel.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      //Configure Cloudinary (if necessary):
      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true,
      });
  
      //Delete associated images from Cloudinary:
      const imageDeletionPromises = product.images.map(async (imageUrl) => {
        const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
        return cloudinary.uploader.destroy(`products/${publicId}`);
      });
      await Promise.all(imageDeletionPromises);
  
      // Delete product from database:
      await productModel.findByIdAndDelete(productId);

      // Call the method from dashboardController to delete the associated banners:
      await dashboardController.deleteBanners(productId);

  
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error(`Error deleting product with id ${req.params.id}:`, error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  



}

module.exports = new productController()