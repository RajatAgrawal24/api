const productModel = require('../models/Product')
const cloudinary = require("cloudinary").v2
cloudinary.config({ 
  cloud_name: 'dmtgrirpq', 
  api_key: '755746793887993', 
  api_secret: 'bOhK96pOw-iGkZpa2lJTnmh0qwY' 
})

class ProductController {
    static getAllProducts = async(req,res) => {
        try{
            const allProducts = await productModel.find()
            res.status(200).json({
                success: true,
                allProducts
            })
        }catch(err){
            res.send(err)
        }
    }
    static getProductDetail = async(req,res) => {
        try{
            const productDetail = await productModel.findById(req.params.id)
            res.status(200).json({
                success: true,
                productDetail
            })
        }catch(err){
            res.send(err)
        }
    }
    static getAdminProduct = async(req,res) => {
        try{
            const data = await productModel.find()
            res.status(200).json({
                success: true,
                data
            })
        }catch(err){
            res.send(err)
        }
    }
    static deleteProduct = async(req,res) => {
        try{
            const data = await productModel.findByIdAndDelete(req.params.id)
            res
            .status(200)
            .send({ status: "success", message: "Product deleted successfully 😃🍻"});
        }catch(err){
            res.send(err)
        }
    }
    static createProduct = async(req,res) => {
        try{
            // console.log(req.body)
            // console.log(req.files)
            const file = req.files.images
            const myCloud = await cloudinary.uploader.upload(file.tempFilePath,{
                folder : 'projectAPI'
            })

            const {name, description, price, stock, rating, category} = req.body
            const data = new productModel({
                name: name,
                description: description,
                price: price,
                stock: stock,
                rating: rating,
                category: category,
                images: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },
            })
            const insertedData = await data.save()
            console.log(insertedData);
            res
            .status(201)
            .json({ status: "success", message: "Product added Successfully 😃🍻",insertedData});
        }catch(err){
            res.send(err)
        }
    }
    static updateProduct = async (req, res) => {
        try {
            //console.log(req.body)
            if (req.file) {
                const product = await productModel.findById(req.params.id);
                const image_id = product.images.public_id;
                await cloudinary.uploader.destroy(image_id);

                const file = req.files.image;
                const myimage = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: "projectAPI",
                });
                var data = {
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    stock: req.body.stock,
                    rating: req.body.rating,
                    category: req.body.category,
                    images: {
                        public_id: myimage.public_id,
                        url: myimage.secure_url,
                    },
                };
            } else {
                var data = {
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    stock: req.body.stock,
                    rating: req.body.rating,
                    category: req.body.category,
                };
            }

            const updateproductprofile = await productModel.findByIdAndUpdate(req.params.id,data);
            res.status(200).json({success: true,updateproductprofile,});
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = ProductController