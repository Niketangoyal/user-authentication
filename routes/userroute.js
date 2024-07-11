const express=require("express")
const router=express.Router()
const {registerUser,loginuser,logOut,forgotPassword}=require("../controllers/usercontroller.js")
router.route('/register').post(registerUser)
router.route('/login').post(loginuser);
router.route('/logout').get(logOut);
router.route('/password/forgot').post(forgotPassword);



module.exports=router