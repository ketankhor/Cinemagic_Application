require('./connection');
const { default: mongoose } = require('mongoose');
const moongose=require('mongoose');
const reviewSchema= new mongoose.Schema({
    review:{
        type:String,
        required:[true,"movie review can't be empty"],
        trim:true
    },
    movie:{
        id:{
            type:String,
            required:[true,"movie not specified"],
            trim:true,
            
        }
    },
    user:{
        id:{
            type:String,
            required:[true,"user not specified"],
            trim:true
        
        },
        userName:{
            type:String,
            required:[true,"user not specified"],
            trim:true,
        
        }
    },
    timestamp:{
       type:Date,
       default:Date.now
        
    }

});


const Review=moongose.model('review',reviewSchema);
module.exports=Review