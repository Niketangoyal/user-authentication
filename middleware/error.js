const ErrorHandler=require('../utils/errorHandler.js')
const { CastError } = require('mongoose');
module.exports=(err,req,res,next)=>{
err.statusCode=err.statusCode||500;
err.message=err.message||"Internal server error";
//wrong mongodb id error

if (err instanceof CastError) {
    // Handle CastError (invalid ObjectId)
   err=new ErrorHandler("invalid id ",400)
  }
  //mongoose duplicate key error
  if(err.code===11000){
    const message=err.message
    err=new ErrorHandler(message,404)
  }
  //wrong json web token
  if(err.name=="JsonWebTokenError"){
    const message=`Json Web Token is Invalid , try again`
    err=new ErrorHandler(message,404)
  }
  // json expire error
  if(err.name=="TokenExpireError"){
    const message=`Json Web Token is Expire , try again`
    err=new ErrorHandler(message,404)
  }
res.status(err.statusCode).json({
    success:false,
    error:err.message,
    
})

}