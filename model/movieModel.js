require('./connection');
const mongoose=require('mongoose')
const MoviesSchema=new mongoose.Schema({
    id:{
        type:Number,
        unique:true
    },
    title:{
        type:String,
        required:true
    },
    posterURL:{
        type:String,
        required:true
    },
    imdbId:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:[true,'category required']
    }
})

const Movie=mongoose.model('movie',MoviesSchema)

module.exports=Movie;