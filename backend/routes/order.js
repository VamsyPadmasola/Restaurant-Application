const express = require('express');
const { getOrders, createOrder } = require('../controllers/order');
const { isAdmin, isAuth } = require('../middlewares/auth');
const { validate } = require('../models/order');
const router = express.Router()

router.post(
    '/create',
    isAuth,
    validate,
    createOrder
);

router.get('/orders', isAuth, isAdmin, getOrders)
module.exports = router; 
