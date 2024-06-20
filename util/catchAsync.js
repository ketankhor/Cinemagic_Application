exports.catchAsync=callback=>{
    return async(req,res,next)=>{
        callback(req,res,next).catch(next)
    }
}