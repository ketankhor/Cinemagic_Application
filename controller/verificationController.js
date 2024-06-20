const emailVerificationModel=require('../model/emailVerificationModel');
const User = require('../model/userModel');
const { v4: uuidv4 } = require('uuid');
const emailSender=require('../util/emailsender');
const { catchAsync } = require('../util/catchAsync');
exports.sendVerificationEmail =catchAsync(async (req, res, next) => {
    // console.log(req.user)
    const {_id,email}=req.body;
    const verificationId = uuidv4()
    const URL = `http://127.0.0.1:3000/api/user/verify/${_id}/${verificationId}`;
    // console.log(verificationId)
    const emailVerification = await emailVerificationModel.findOne({ userId: _id })
    if (emailVerification)
        await emailVerificationModel.findByIdAndUpdate(emailVerification._id, {
            userId: _id,
            verificationId: verificationId,
            expiresAt: Date.now() + 10800000
        })
    else
        await emailVerificationModel.create({
            userId: _id,
            verificationId: verificationId,
            expiresAt: Date.now() + 10800000
        })
    await emailSender.sendMail(email, URL)
    res.status(200).json({
        status:'pending',
        email,
        _id,
        message:'email successfully send'
    })
})

exports.verifyEmail = catchAsync( async (req, res, next) => {
    const { id, verificationId } = req.params;
    if (!id || !verificationId) return res.status(400).send('bad request');
    const verification = await emailVerificationModel.findOne({ userId: id });
    if (!verification) return res.status(400).send('bad request');
    if (verification.expiresAt <= Date.now()) {
        await emailVerificationModel.findByIdAndDelete(verification._id);
        return res.status(401).send('your verification link is expired.')
    }
    let user = null;
    if (verification.verificationId === verificationId){
        user = await User.findByIdAndUpdate(id, {
            verified: true
        },{new:true});
        await emailVerificationModel.findByIdAndDelete(verification._id);
    return res.status(200).send('email successfully verified');

    }
    else
        res.status(404).send('bad request');
})

exports.userExist=async(req,res,next)=>{

    const {_id,email}=req.body

    const user= await User.findById(_id)
    // console.log(user)
    if(user && user.email===email)
        req.user=user;
    else{
        return res.status(404).json({
            status:'fail',
            message:'user not exist'
        })
    }
    next();

}