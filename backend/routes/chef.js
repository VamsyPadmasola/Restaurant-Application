const express = require('express');
const { createChef, getChefs, updateChef, removeChef, searchChef } = require('../controllers/chef');
const { isAdmin, isAuth } = require('../middlewares/auth');
const { chefInfoValidator } = require('../middlewares/validator');
const { validate } = require('../models/chef');
// const { actorInfoValidator, validate } = require('../middlewares/validator');
const router = express.Router()

router.post(
    '/create',
    isAuth,
    isAdmin,
    chefInfoValidator,
    validate,
    createChef
);

router.post(
    "/update/:chefId",
    isAuth,
    isAdmin,
    chefInfoValidator,
    validate,
    updateChef
);

router.delete('/:chefId', isAuth, isAdmin, removeChef)
router.get('/search', isAuth, isAdmin, searchChef)
router.get('/chefs', isAuth, isAdmin, getChefs)
module.exports = router; 
