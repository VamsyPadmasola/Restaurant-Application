const express = require('express');
const { createMenuItem, getMenu, searchMenu, removeMenuItem, updateMenuItem } = require('../controllers/menu');
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

router.post(
    "/update/:itemId",
    isAuth,
    isAdmin,
    uploadImage.single("image"),
    menuInfoValidator,
    validate,
    updateMenuItem
);

router.delete('/:menuId', isAuth, isAdmin, removeMenuItem)
router.get('/search', isAuth, isAdmin, searchMenu)
// router.get('/latest-uploads', isAuth, isAdmin, getLatestActors)
router.get('/items', getMenu)
// router.get('/single/:id', getSingleActor)
module.exports = router; 
