const Movie = require('../model/movieModel');
const Review = require("../model/reviewModel");
const User = require('../model/userModel');
const AppError = require('../util/appError');
const { catchAsync } = require('../util/catchAsync');

exports.getMovies = catchAsync(async (req, res, next) => {
    const category=req.query.category||'family'
    let movies = await Movie.find({category});
    res.status(200).json({
        status: 'success',
        length: movies.length,
        movies
    })
})

exports.getMovieById = catchAsync(async (req, res, next) => {
    let id = req.params.id;
    let { category, review } = req.query;
    
    if (!id || !category) return res.status(404).json({message:'select movie'});
    let [movie] = await Movie.find({ id }).where({ category });
    let reviews=[];
    let data;
    
    let user;
    if (review) {
        data = await Review.find({
            movie: { id: movie._id.toString() }
        }).select('-__v -movie');
        try{
        for await(let review of data){
            const {id}=review.user;
            const user=await User.findById(id)
            const r= {
                _id:review._id,
                review:review.review,
                user:{
                    userName:user.userName,
                    name:user.name
                },
                timstamp:review.timestamp
            };
            reviews.push(r);
        }
    }catch(err){console.log(err)}
       
        console.log(reviews)
    }
    console.log('ok')
    
    res.status(200).json({
        status: 'success',
        movie,
        reviews

    })
});

exports.postReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { review } = req.body;
    if (!id || !review) return next(new AppError('review not specified', 400));
    const movie = await Movie.exists({ _id: id });

    if (!movie) return next(new AppError('movie not exist', 400));
    const movieId=movie._id.toString();
    const userId=req.user._id.toString();
    
    const oldReview= await Review.findOne({
        'user.id': userId,
        'movie.id': movieId
      })

    let newReview;
    if(oldReview){
        newReview=await Review.findByIdAndUpdate(oldReview._id,{
            review:review
        },{new:true}) ; 
    }else{
        newReview = await Review.create({
                review: review,
                movie: { id:movieId },
                user: { id: userId, userName: req.user.userName }
            });
    }
  
    res.status(200).json({
        status: 'success',
        message: 'review successfully post',
        review: newReview,
        user: req.user
    })
})

exports.deleteReview=catchAsync(async(req,res,next)=>{
    const {id}=req.params;
    const review=await Review.findByIdAndDelete(id,{new:true})
    if(review)
        res.status(200).json({
            status:'success',
            review,
            message:'review deleted'
    })
    else{
        res.status(404).json({
            status:'fail',
            message:'bad request'
        })
    }
})

