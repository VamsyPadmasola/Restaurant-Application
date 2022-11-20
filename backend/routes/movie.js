const express = require('express');
const { uploadTrailer, createMovie, removeMovie, getMovies, getMovieForUpdate, updateMovie, searchMovies, getLatestUploads, getTopRatedMovies, searchPublicMovies } = require('../controllers/movie');
const { getSingleMovie, getRelatedMovies } = require('../controllers/movie');
const { isAuth, isAdmin } = require('../middlewares/auth');
const { parseData } = require('../middlewares/helper');
const { uploadVideo, uploadImage } = require('../middlewares/multer');
const { validateMovie, validateTrailer } = require('../middlewares/validator');
const { validate, remove } = require('../models/movie');
const router = express.Router()

router.post(
    '/upload-trailer',
    isAuth,
    isAdmin,
    uploadVideo.single('video'),
    uploadTrailer
);
router.post(
    '/create',
    isAuth,
    isAdmin,
    uploadImage.single('poster'),
    parseData,
    validateMovie,
    validateTrailer,
    validate,
    createMovie
);
// router.patch(
//     '/update-movie-without-poster/:movieId',
//     isAuth,
//     isAdmin,
//     // parseData,
//     validateMovie,
//     validate,
//     updateMovieWithoutPoster
// );
router.patch(
    '/update/:movieId',
    isAuth,
    isAdmin,
    uploadImage.single('poster'),
    parseData,
    validateMovie,
    validate,
    updateMovie
);

router.delete('/:movieId', isAuth, isAdmin, removeMovie)
router.get('/movies', isAuth, isAdmin, getMovies)
router.get('/for-update/:movieId', isAuth, isAdmin, getMovieForUpdate)
router.get('/search', isAuth, isAdmin, searchMovies)

//for Normal Users
router.get('/latest-uploads', getLatestUploads)
router.get('/single/:movieId', getSingleMovie)
router.get('/related/:movieId', getRelatedMovies)
router.get('/top-rated', getTopRatedMovies)
router.get('/search-public', searchPublicMovies)

module.exports = router; 
