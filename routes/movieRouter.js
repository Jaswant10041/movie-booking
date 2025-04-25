const movieRouter=require('express').Router();
const movieController=require('../controllers/movieController');
movieRouter.get('/',movieController.getMovies);
movieRouter.get('/search/:moviename',movieController.findMovieByName);
movieRouter.post('/:moviename/add',movieController.bookMovie);
module.exports=movieRouter;