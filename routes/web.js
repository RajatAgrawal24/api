const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
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

module.exports = router