require('./connection')
const mongoose=require('mongoose');

const emailVerificationSchema=new mongoose.Schema({
    userId:String,
    verificationId:String,
    expiresAt:Date
})

const emailVerificationModel=mongoose.model('emailVerification',emailVerificationSchema);
module.exports=emailVerificationModel