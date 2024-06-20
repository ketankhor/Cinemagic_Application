const AppError=require('../util/appError')
const handleDuplicateFieldsDB = err => {
    console.log(err)
    let values = [];
    for (let v in err.keyValue) {
        values.push(v);
    }
    
    let message = `duplicate field : ${values}`;
    return new AppError(message, 404);
}

const handleCastErrorDB = err => {
    let message = `Invalid ${err.path} : ${err.value}`

    return new AppError(message, 404);
}

const handleValidationError = err => {
    let errors = Object.values(err.errors).map(el => el.message);
    console.log(errors)
    let message = ` ${errors.join('. ')}`;
    return new AppError(message, 404);
}
const handleJWTError = () => new AppError('Token Invalid', 400)
const handleJWTTokenExpireError = () => new AppError('Token expired, login in again', 400)

module.exports = (err, req, res, next) => {
    err.status = err.status || 500;
    let error = Object.create(err);

        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicateFieldsDB(error);
        if (err.name === 'ValidationError') error = handleValidationError(error);
        if (err.name === 'JsonWebTokenError') error = handleJWTError();
        if (err.name === 'TokenExpiredError') error = handleJWTTokenExpireError();
    res.status(error.status).json({
        status:'error',
        message:error.message
    })
}