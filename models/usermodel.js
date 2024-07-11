const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require("jsonwebtoken")
const crypto=require('crypto')
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"please enter your name"],
        unique:[true,"this username is used before"],
        maxLength:[30,"cannot exceed more than 30 characters"],
        minLength:[4,"name should have more than 5 characters"]
    },
    email:{
        type:String,
        required:[true,"please enter your email"],
        unique:[true,"this email is used before"],
        validate:[validator.isEmail,"please enter a valid email"]
    }
    ,password:{
        type:String,
        required:[true,"please enter your password"],
        minLength:[8,"password shuld be greate than 8 characters"],
        select:false,


    },
    resetpasswordtoken:String,
    resetpasswordexpire:Date,
})
userSchema.pre('save',async function (next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
})
//jwt token
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES})
}
//compare opassword
userSchema.methods.comparePassword=async function(password){
    return await  bcrypt.compare(password,this.password);
}
// generate password reset token
userSchema.methods.getResetPasswordToken=function(){
// generating token 
const resetToken=crypto.randomBytes(20).toString("hex"); 
//hashing and add to users schema
this.resetpasswordtoken=crypto.createHash("sha256").update(resetToken).digest("hex");
this.resetpasswordexpire=Date.now()+15*60*1000;
return resetToken;
}

module.exports=mongoose.model("user",userSchema)