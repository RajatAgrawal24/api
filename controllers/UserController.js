const UserModel = require('../models/User')

const cloudinary = require("cloudinary").v2
cloudinary.config({ 
  cloud_name: 'dmtgrirpq', 
  api_key: '755746793887993', 
  api_secret: 'bOhK96pOw-iGkZpa2lJTnmh0qwY' 
});

const bcrypt = require('bcrypt');

class UserController {
    static getAllUser = async (req , res) => {
        try {
            res.send("Welcome")
        }catch (err) {
            console.log(err)
        }
    }

    static userInsert = async (req, res) => {
        try{
            //To upload Image on Cloud
            // console.log(req.files.image)
            const file = req.files.image
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath , {
                folder: 'projectAPI'
            })
            // console.log(imageUpload)

            const {name,email,password,confirmPassword} = req.body;
            const user = await UserModel.findOne({email: email})
            // console.log(user)
            if(user){
                res.status(401).json({status: 'failed' , message:"Email already exists"})
            }else{
                if(name && email && password && confirmPassword){
                    if(password == confirmPassword){
                        const hashPassword = await bcrypt.hash(password,10);
                        const result = new UserModel({
                            name:name,
                            email:email,
                            password:hashPassword,
                            image:{
                                public_id:imageUpload.public_id,
                                url:imageUpload.secure_url
                            }
                        })
                        //To save data
                        await result.save();
            
                        //To redirect to login page
                        res.status(201).json({status: 'success' , message:"Registration Successful."})
                    }else{
                        res.status(401).json({status: 'failed' , message:"Password & Confirm Password must be Same."})
                    }
                }else{
                    res.status(401).json({status: 'failed' , message:"All Fields are Required."})
                }
            }
        }catch(err){
            console.log(err);
        }
    }
}

module.exports = UserController;