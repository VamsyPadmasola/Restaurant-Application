const { sendError, formatActor, relatedMovieAggragation, getAverageRatings, topRatedMoviesPipeline } = require("../uitls/helper");
const cloudinary = require("../cloud")
const { isValidObjectId } = require("mongoose");
const Order = require("../models/order");

exports.createOrder = async (req, res) => {
    const { body } = req
    const {
        street1,
        street2,
        city,
        state,
        status,
        contact,
        details,
        owner,
        price
    } = body;

    const newOrder = new Order({
        street1,
        street2,
        city,
        state,
        status,
        contact,
        details,
        owner,
        price
    })

    await newOrder.save();
    res.status(201).json({
        order: {
            id: newOrder._id,
        }
    })

}

exports.getOrders = async (req, res) => {
    const orders = await Order.find({})
        .sort({ createdAt: -1 })
        .limit(parseInt(5));

    const results = orders.map(order => ({
        id: order._id,
        details: order.details,
        street1: order.street1,
        street2: order.street2,
        city: order.city,
        state: order.state,
        status: order.status,
        contact: order.contact,
        price: order.price,
        owner: order.owner
    }))

    res.json({
        results,
    })
}

