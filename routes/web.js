const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');

//UserController
router.get('/getAllUser' , UserController.getAllUser)
router.post('/userInsert' , UserController.userInsert)

module.exports = router