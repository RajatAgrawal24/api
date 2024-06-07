const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const CategoryController = require('../controllers/CategoryController');
const ProductController = require('../controllers/ProductController');
const SliderController = require('../controllers/SliderController');
const {CheckUserAuth} = require('../middleware/auth')

//UserController
router.get('/getAllUser' , UserController.getAllUser)
router.get('/admin/getUser/:id', UserController.getSingleUser)
router.post('/userInsert' , UserController.userInsert)
router.post('/loginUser' , UserController.loginUser)
router.get('/logOut' , UserController.logOut)
router.post('/updatePassword' ,CheckUserAuth , UserController.updatePassword)
router.post('/updateProfile', CheckUserAuth, UserController.updateProfile)
router.get('/me', CheckUserAuth, UserController.getUserDetail)
router.delete('/admin/deleteUser/:id', UserController.deleteUser)

//CategoryController
router.get('/getAllCategories', CategoryController.display);
router.post('/insertCategory', CategoryController.insert);
router.get('/getCategory/:id', CategoryController.view);
router.put('/updateCategory/:id', CategoryController.update);
router.delete('/deleteCategory/:id', CategoryController.delete);

//ProductController
router.get('/products', ProductController.getAllProducts)
router.get('/getProductDetail/:id', ProductController.getProductDetail)
router.get('/product/getAdminProduct', ProductController.getAdminProduct)
router.delete('/product/deleteProduct/:id', ProductController.deleteProduct)
router.post('/product/createProduct', ProductController.createProduct)
router.post('/product/updateProduct/:id', ProductController.updateProduct)

//SliderController
router.get('/slider', SliderController.display)
router.post('/insertSlider', SliderController.insert)
router.get('/viewSlider/:id', SliderController.view)
router.post('/updateSlider/:id', SliderController.update)
router.delete('/deleteSlider/:id', SliderController.delete)

module.exports = router