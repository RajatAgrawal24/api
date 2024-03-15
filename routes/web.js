const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const {CheckUserAuth} = require('../middleware/auth')

//UserController
router.get('/getAllUser' , UserController.getAllUser)
router.post('/userInsert' , UserController.userInsert)
router.post('/loginUser' , UserController.loginUser)
router.get('/logOut' , UserController.logOut)
router.post('/updatePassword' ,CheckUserAuth , UserController.updatePassword)

module.exports = router