const UserModel = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require("cloudinary").v2
cloudinary.config({ 
  cloud_name: 'dmtgrirpq', 
  api_key: '755746793887993', 
  api_secret: 'bOhK96pOw-iGkZpa2lJTnmh0qwY' 
})

class UserController {
    static getAllUser = async (req , res) => {
        try {
            const data = await UserModel.find()
            res.status(200).json({success:true , data})
        }catch (err) {
            console.log(err)
            return res.status(500).json({ "status": "error", "message": error.message });
        }
    }
    static getSingleUser = async (req , res) => {
        try {
            const data = await UserModel.findById(req.params.id)
            res.status(200).json({success: true , data})
        }catch (err) {
            console.log(err)
            return res.status(500).json({ "status": "error", "message": error.message });
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
            return res.status(500).json({ "status": "error", "message": error.message });
        }
    }
    static loginUser = async (req, res) => {
        try {
            // console.log(req.body)
            const { email, password } = req.body
            // console.log(password)
            if (email && password) {
                const user = await UserModel.findOne({ email: email })
                // console.log(user)
                if (user != null) {
                    const isMatched = await bcrypt.compare(password, user.password)
                    if ((user.email === email) && isMatched) {
                        //generate jwt token
                        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
                        // console.log(token)
                        res.cookie('token', token)
                        res.status(201).json({ status: "success", message: "Login successfully with web token 😃🍻", token, user });
                    } else {
                        res.status(401).json({ status: "failed", message: "'Email and Password is not valid !😓" });
                    }
                } else {
                    res.status(401).json({ status: "failed", message: "'You are not registered user😓" });
                }
            } else {
                res.status(401).json({ status: "failed", message: "'All Fields are required 😓" });
            }
        } catch (err) {
            console.log(err)
            return res.status(500).json({ "status": "error", "message": error.message });
        }
    }
    static logOut = async (req, res) => {
        try {
            res.cookie("token", null, {
                expires: new Date(Date.now()),
                httpOnly: true,
            });

            res.status(200).json({success: true,message: "Logged Out"});
        } catch (error) {
            console.log(error)
            return res.status(500).json({ "status": "error", "message": error.message });
        }
    }
    static updatePassword = async (req, res) => {
        // console.log(req.user)
        try {
            const { oldPassword, newPassword, confirmPassword } = req.body

            if (oldPassword && newPassword && confirmPassword) {
                const user = await UserModel.findById(req.user.id);
                const isMatch = await bcrypt.compare(oldPassword, user.password)
                //const isPasswordMatched = await userModel.comparePassword(req.body.oldPassword);
                if (!isMatch) {
                    res.status(400).json({ "status": "failed", "message": "Old password is incorrect" })
                } else {
                    if (newPassword !== confirmPassword) {
                        res.status(400)
                            .json({ "status": "failed", "message": "password does not match" })
                    } else {
                        const salt = await bcrypt.genSalt(10)
                        const newHashPassword = await bcrypt.hash(newPassword, salt)
                        //console.log(req.user)
                        await UserModel.findByIdAndUpdate(req.user.id, { $set: { password: newHashPassword } })
                        res.status(200)
                            .json({ "status": "success", "message": "Password changed succesfully" })
                    }
                }
            } else {
                res.status(400)
                    .json({ "status": "failed", "message": "All Fields are Required" })
            }
        } catch (err) {
            return res.status(500).json({ "status": "error", "message": error.message });
        }
    }
    static updateProfile = async (req, res) => {
        try {
            // console.log(req)
            // Check if user exists
            const user = await UserModel.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ "status": "error", "message": "User not found" });
            }
    
            let data = {
                name: req.body.name,
                email: req.body.email
            };
            // console.log(req.files)
    
            if (req.files) {
                // Destroy the old image on Cloudinary
                if (user.image && user.image.public_id) {
                    await cloudinary.uploader.destroy(user.image.public_id);
                }
    
                // Upload the new image to Cloudinary
                const file = req.files.image
                const myimage = await cloudinary.uploader.upload(file.tempFilePath , {
                    folder: 'projectAPI'
                })
    
                data.image = {
                    public_id: myimage.public_id,
                    url: myimage.secure_url
                };
            }
    
            // Update user profile
            const updateUserProfile = await UserModel.findByIdAndUpdate(req.user.id, data, { new: true });
    
            return res.status(200).json({
                "status": "success",
                "updateUserProfile": updateUserProfile
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ "status": "error", "message": error.message });
        }
    };
    static getUserDetail = async (req, res) => {
        try {
            //   console.log(req.user);
            const user = await UserModel.findById(req.user.id);

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ "status": "error", "message": error.message });
        }
    }
    static deleteUser = async (req, res) => {
        try {
            const data = await UserModel.findByIdAndDelete(req.params.id)
            res
                .status(200)
                .json({ status: "success", message: "User deleted successfully 😃🍻" });
        } catch (err) {
            console.log(err)
            return res.status(500).json({ "status": "error", "message": error.message });
        }
    }
}

module.exports = UserController;