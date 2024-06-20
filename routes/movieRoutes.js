const express=require('express')
const router=express.Router();
const movieController=require('../controller/movieController');
const userController=require('../controller/userController')
router.get('/',movieController.getMovies)

router
    .route('/:id')
    .get(userController.protect,movieController.getMovieById)
    .post(userController.protect,movieController.postReview)
    .delete(userController.protect,movieController.deleteReview)

module.exports=router;
