const User = require('../model/userModel')
const jwt = require('jsonwebtoken');
const { catchAsync } = require('../util/catchAsync');
const AppError = require('../util/appError');


const getToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
})
const verify = token => jwt.verify(token, process.env.JWT_SECRET)

exports.register = catchAsync(async (req, res, next) => {
    let { userName, name, email, password } = req.body;
    const user = await User.create({ userName, name, email, password });
    return res.status(200).json({
        status: 'success',
        user: {
            _id: user._id,
            email: user.email
        },
        message: 'verify email to continue '
    })
})

exports.login = catchAsync(async (req, res, next) => {

    let user = req.user;
    let { password } = req.body
    if (!user) return next(new AppError('Invalid email or password', 404))
    let result = await user.comparePassword(password, user.password);
    if (!result) return next(new AppError('Invalid email or password', 404));

    let token = getToken(user._id);
    res.cookie('token', 'Bearer ' + token, { maxage: new Date(Date.now() + 90000), path: "/" })
    res.status(200).json({
        status: 'success',
        message: 'login successfull',
        user: {
            _id: user._id,
            email: user.email,
            username:user.userName
        }

    })

})
exports.logout = (req, res) => {
    res.cookie('token', null, { maxAge: 0 })
    res.status(200).json({
        status: 'success',
        message: 'logout successfully'
    })
}
exports.protect = catchAsync(async (req, res, next) => {

    const token = req.cookies?.token;
    // console.log(token)
    if (!token) return next(new AppError('login to continue ', 401))
    const { id } = verify(token.split(' ')[1])
    // console.log(id,token.split(' ')[1])
    if (!id) return next(new AppError('login to continue ', 401))
    req.user = await User.findById(id);
    console.log(req.user)
    next()
})

exports.isLogin = (req, res, next) => {

    const token = req.cookies?.token;
    if (token) return res.status(200).json({
        status: 'fail',
        message: "you already log in"
    })
    next()
}

exports.isVerified = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email, password);
    
    let user = (await User.find({email}))[0];
    console.log(user)
    if (!user) {
        res.status(404).json({
            status: 'fail',
            message: "user not found"
        });
    } else if (!user.verified) {
        res.status(404).json({
            status: 'pending',
            message: "user not verified",
            user:{
                _id:user._id,
                email:user.email
            }
        });
    } else {
        req.user = user
        next()
    }

})



