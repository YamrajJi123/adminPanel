const jwt=require('jsonwebtoken')
const admin = require('../Model/adminModel')
const message=require('../help/message')
const response=require('../help/response')

exports.auth=async(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(' ')[1];
        const auth=jwt.verify(token, process.env.JWT_SECRET);
        req.currentUser=auth.id
        const findProfile=await admin.findOne({_id:auth.id})
        if(findProfile){
            next();
        }else{
            response.unAuthorizedResponse(res,message.UNAUTHORIZED)
        }
    }catch{
        response.unAuthorizedResponse(res,message.UNAUTHORIZED)
    }
}