const CategoryModel = require('../models/Category');
const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
  cloud_name: 'dmtgrirpq', 
  api_key: '755746793887993', 
  api_secret: 'bOhK96pOw-iGkZpa2lJTnmh0qwY' 
});

class CategoryController {
  static display = async (req, res) => {
    try {
      const categories = await CategoryModel.find();
      res.status(200).json({
        success: true,
        categories
      });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  static insert = async (req, res) => {
    try {
      const file = req.files.image
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath , {
          folder: 'projectAPI'
      })

      const { name , description } = req.body;
      const newCategory = new CategoryModel({
        name:name,
        image:{
            public_id:imageUpload.public_id,
            url:imageUpload.secure_url
        },
        description: description
      });
      await newCategory.save();
      res.status(201).json(newCategory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  static view = async (req, res) => {
    const { id } = req.params;
    try {
      const category = await CategoryModel.findById(id);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  static update = async (req, res) => {
    const { id } = req.params;
    try {
      if (req.file) {
        const product = await productModel.findById(id);
        const image_id = product.images.public_id;
        await cloudinary.uploader.destroy(image_id);

        const file = req.files.image;
        const myimage = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "projectAPI",
        });
        var data = {
          name: req.body.name,
          description: req.body.description,
          images: {
              public_id: myimage.public_id,
              url: myimage.secure_url,
          },
        };
      } else {
        var data = {
          name: req.body.name,
          description: req.body.description,
        };
      }

      const updatedCategory = await CategoryModel.findByIdAndUpdate(id, data);
      if (updatedCategory) {
        res.status(200).json({success:true,updatedCategory});
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  static delete = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedCategory = await CategoryModel.findByIdAndDelete(id);
      if (deletedCategory) {
        res.status(200).json({ message: 'Category deleted successfully' });
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = CategoryController;
