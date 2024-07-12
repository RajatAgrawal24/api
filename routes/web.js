const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const CategoryController = require('../controllers/CategoryController');
const ProductController = require('../controllers/ProductController');
const SliderController = require('../controllers/SliderController');
const PaymentController = require('../controllers/PaymentController');
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

//PaymentController
router.post('/payment/process', PaymentController.processPayment)
router.get('/stripeapiKey', PaymentController.sendStripeApiKey)


//OrderController
router.post('/order/create',CheckUserAuth, OrderController.newOrder)
router.get('/order/getSingleOrder/:id',CheckUserAuth, OrderController.getSingleOrder)
router.get('/order/myOrder',CheckUserAuth, OrderController.myOrder)
router.get('/order/getAllOrders',CheckUserAuth, OrderController.getAllOrders)
router.get('/order/deleteOrder/:id', CheckUserAuth,OrderController.deleteOrder)

module.exports = router