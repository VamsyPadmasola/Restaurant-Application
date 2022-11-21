const express = require('express');
const { createDelivery, updateDelivery, removeDelivery, searchDelivery, getDelivery } = require('../controllers/delivery');
const { isAuth, isAdmin } = require('../middlewares/auth');
const { deliveryInfoValidator } = require('../middlewares/validator');
const { validate } = require('../models/delivery');

const router = express.Router()

router.post(
    '/create',
    isAuth,
    isAdmin,
    deliveryInfoValidator,
    validate,
    createDelivery
);

router.post(
    "/update/:deliveryId",
    isAuth,
    isAdmin,
    deliveryInfoValidator,
    validate,
    updateDelivery
);

router.delete('/:deliveryId', isAuth, isAdmin, removeDelivery)
router.get('/search', isAuth, isAdmin, searchDelivery)
router.get('/deliverys', isAuth, isAdmin, getDelivery)
module.exports = router; 
