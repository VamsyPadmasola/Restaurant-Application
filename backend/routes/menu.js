const express = require('express');
const { createMenuItem, getMenu } = require('../controllers/menu');
const { isAdmin, isAuth } = require('../middlewares/auth');
const { uploadImage } = require('../middlewares/multer');
const { menuInfoValidator, validate } = require('../middlewares/validator');
const router = express.Router()

router.post(
    '/create',
    isAuth,
    isAdmin,
    uploadImage.single('image'),
    menuInfoValidator,
    validate,
    createMenuItem
);

// router.post(
//     "/update/:actorId",
//     isAuth,
//     isAdmin,
//     uploadImage.single("avatar"),
//     actorInfoValidator,
//     validate,
//     updateActor
// );

// router.delete('/:actorId', isAuth, isAdmin, removeActor)
// router.get('/search', isAuth, isAdmin, searchActor)
// router.get('/latest-uploads', isAuth, isAdmin, getLatestActors)
router.get('/items', getMenu)
// router.get('/single/:id', getSingleActor)
module.exports = router; 
