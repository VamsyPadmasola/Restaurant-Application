const { isValidObjectId } = require("mongoose");
const nodemon = require("nodemon");
const Delivery = require("../models/delivery");
const { formatDelivery, sendError } = require("../uitls/helper");

exports.createDelivery = async (req, res) => {
    const { name, gender, contact } = req.body;
    const delivery = new Delivery({ name, gender, contact })

    await delivery.save()
    res.status(201).json({ actor: formatDelivery(delivery) })
}

exports.getDelivery = async (req, res) => {
    const delivery = await Delivery.find({})
        .sort({ createdAt: -1 });

    const profiles = delivery.map((agent) => formatDelivery(agent))
    res.json({
        profiles,
    })
}

exports.updateDelivery = async (req, res) => {
    const { name, contact, gender } = req.body;
    const { deliveryId } = req.params

    if (!isValidObjectId(deliveryId))
        return sendError(res, 'Invalid request!')

    const delivery = await Delivery.findById(deliveryId)
    if (!delivery)
        return sendError(res, 'Invalid request, record not found!')

    delivery.name = name
    delivery.contact = contact
    delivery.gender = gender

    await delivery.save()
    res.status(201).json({ delivery: formatDelivery(delivery) })
}

exports.removeDelivery = async (req, res) => {
    const { deliveryId } = req.params

    if (!isValidObjectId(deliveryId))
        return sendError(res, 'Invalid request!')
    const delivery = await Delivery.findById(deliveryId)
    if (!delivery)
        return sendError(res, 'Invalid request, record not found!')

    await Delivery.findByIdAndDelete(deliveryId)
    res.json({ message: "Delivery removed Successfully!" })
}

exports.searchDelivery = async (req, res) => {
    const { name } = req.query

    if (!name.trim()) return sendError(res, 'Invalid Request')
    const result = await Delivery.find({ name: { $regex: name, $options: 'i' } })

    const agents = result.map(agent => formatDelivery(agent))
    res.json({ results: agents })
}