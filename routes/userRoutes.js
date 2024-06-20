const express=require('express')
const router=express.Router();
const userController =require('../controller/userController')
const verificationController =require('../controller/verificationController')

router
    .post('/register',userController.register)
    .post('/login',userController.isVerified,userController.isLogin,userController.login)
    .get('/logout',userController.logout)
    .post('/verify',verificationController.userExist,verificationController.sendVerificationEmail)
    .get('/verify/:id/:verificationId',verificationController.verifyEmail)

module.exports=router;
