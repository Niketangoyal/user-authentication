const User=require("../models/usermodel");
const sendtoken = require("../utils/jwttoken.js");
const sendEmail=require('../utils/sendEmail.js')
const ErrorHandler=require("../utils/errorHandler")

exports.registerUser=async(req,res,next)=>{
    try{

        const {username,email,password}=req.body;
        const user=await User.create({username,email,password})
        sendtoken(user,200,res);
    }
    catch(err){
        next(err)
    }
}
exports.loginuser=async(req,res,next)=>{
    try{

        const {username,password}=req.body;
        //checking if user has given password and email both 
    if(!username || !password){
        return next(new ErrorHandler("please enter username and password",400))
    }
        const user=await User.findOne({username}).select("+password");
        if(!user){
            return next(new ErrorHandler("invalid username or password",401))
        }
        const isPasswordMatches=await  user.comparePassword(password);
        if(!isPasswordMatches){
            return next(new ErrorHandler("invalid username or password",401))
        }
        
        sendtoken(user,200,res);
    }
    catch(err){
        next(err)
    }
}

//log out
exports.logOut=async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    ,httpOnly:true})
    res.status(200).json({
        success:true,
        message:"logged out successfully"
    })
}

// forgot password
exports.forgotPassword=(async(req,res,next)=>{
    try{

        const user=await User.findOne({email:req.body.email})
        if(!user){
            return next(new ErrorHandler("user not found"),404)
            
        }
        //get reset password token
        const resetToken= user.getResetPasswordToken();
        await user.save({validateBeforeSave:false});
    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    const message=`Your password reset token is :- \n\n ${resetPasswordUrl}\n\n  if you have not requested this email then please ignore it `
    try {
        await sendEmail({
            email:user.email,
            subject:`Account Password Recovery`,
            message,
        });
        res.status(200).json({
            success:true,message:`email send to ${user.email} sucessfully`
        })
    } catch (error) {
        user.resetpasswordtoken=undefined;
        user.resetpasswordexpire=undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message),500)
    }
    
}
catch(err){
    next(err)
}
})