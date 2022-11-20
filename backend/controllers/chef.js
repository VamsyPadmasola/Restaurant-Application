const { isValidObjectId } = require("mongoose");
const nodemon = require("nodemon");
const Chef = require("../models/chef");
const { formatChef, sendError } = require("../uitls/helper");

exports.createChef = async (req, res) => {
    const { name, about, gender } = req.body;
    const chef = new Chef({ name, about, gender })

    await chef.save()
    res.status(201).json({ actor: formatChef(chef) })
}

exports.getChefs = async (req, res) => {
    const chefs = await Chef.find({})
        .sort({ createdAt: -1 });

    const profiles = chefs.map((chef) => formatChef(chef))
    res.json({
        profiles,
    })
}

exports.updateChef = async (req, res) => {
    const { name, about, gender } = req.body;
    const { chefId } = req.params

    // console.log(req.body)
    // return
    if (!isValidObjectId(chefId))
        return sendError(res, 'Invalid request!')

    const chef = await Chef.findById(chefId)
    if (!chef)
        return sendError(res, 'Invalid request, record not found!')

    chef.name = name
    chef.about = about
    chef.gender = gender

    await chef.save()
    res.status(201).json({ chef: formatChef(chef) })
}

exports.removeChef = async (req, res) => {
    const { chefId } = req.params

    if (!isValidObjectId(chefId))
        return sendError(res, 'Invalid request!')
    const chef = await Chef.findById(chefId)
    if (!chef)
        return sendError(res, 'Invalid request, record not found!')

    await Chef.findByIdAndDelete(chefId)
    res.json({ message: "Chef removed Successfully!" })
}

exports.searchChef = async (req, res) => {
    const { name } = req.query

    if (!name.trim()) return sendError(res, 'Invalid Request')
    const result = await Chef.find({ name: { $regex: name, $options: 'i' } })

    const chefs = result.map(chef => formatChef(chef))
    res.json({ results: chefs })
}