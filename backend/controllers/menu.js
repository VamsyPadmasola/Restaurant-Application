const { isValidObjectId } = require("mongoose");
const nodemon = require("nodemon");
const Menu = require("../models/menu");
const { sendError, uploadImagetoCloud, formatActor, uploadImageToCloud, formatMenuItem } = require("../uitls/helper");
const cloudinary = require("../cloud/index");
const menu = require("../models/menu");

exports.createMenuItem = async (req, res) => {
    const { name, description, type, price } = req.body;
    const { file } = req

    const newMenuItem = new Menu({ name, description, type, price })
    if (file) {
        const { url, public_id } = await uploadImageToCloud(file.path)
        newMenuItem.image = { url, public_id: public_id }
    }
    await newMenuItem.save()
    res.status(201).json({ menu: formatMenuItem(newMenuItem) })
}

exports.searchMenu = async (req, res) => {
    const { name } = req.query

    if (!name.trim()) return sendError(res, 'Invalid Request')

    const result = await Menu.find({ name: { $regex: name, $options: 'i' } })

    const menuitems = result.map(item => formatMenuItem(item))
    res.json({ results: menuitems })
}

// exports.updateActor = async (req, res) => {
//     const { name, about, gender } = req.body;
//     const { file } = req
//     const { actorId } = req.params
//     if (!isValidObjectId(actorId))
//         return sendError(res, 'Invalid request!')
//     const actor = await Actor.findById(actorId)
//     if (!actor)
//         return sendError(res, 'Invalid request, record not found!')

//     const public_id = actor.avatar?.public_id
//     if (public_id && file) {
//         const { result } = await cloudinary.uploader.destroy(public_id)
//         if (result !== 'ok')
//             return sendError(res, 'Could not remove image from the cloud.')
//     }

//     if (file) {
//         const { url, public_id } = await uploadImageToCloud(file.path)
//         actor.avatar = { url: url, public_id: public_id }
//     }

//     actor.name = name,
//         actor.email = about,
//         actor.gender = gender

//     await actor.save()
//     res.status(201).json({ actor: formatActor(actor) })
// }

exports.removeMenuItem = async (req, res) => {
    const { menuId } = req.params
    if (!isValidObjectId(menuId))
        return sendError(res, 'Invalid request!')
    const item = await Menu.findById(menuId)
    if (!item)
        return sendError(res, 'Invalid request, record not found!')

    const public_id = item.image?.public_id
    if (public_id) {
        const { result } = await cloudinary.uploader.destroy(public_id)
        if (result !== 'ok')
            return sendError(res, 'Could not remove image from the cloud.')
    }

    await Menu.findByIdAndDelete(item)
    res.json({ message: "Item removed Successfully!" })
}
exports.getMenu = async (req, res) => {
    const { pageNo = 0, limit = 10 } = req.query;

    const menu = await Menu.find({})
        .sort({ createdAt: -1 })
        .skip(parseInt(pageNo) * parseInt(limit))
        .limit(parseInt(limit));

    const items = menu.map((item) => formatMenuItem(item))
    res.json({
        items,
    })
}

exports.updateMenuItem = async (req, res) => {
    const { name, description, type, price } = req.body;
    const { file } = req
    const { itemId } = req.params

    if (!isValidObjectId(itemId))
        return sendError(res, 'Invalid request!')
    const item = await Menu.findById(itemId)
    if (!item)
        return sendError(res, 'Invalid request, record not found!')

    const public_id = item.image?.public_id

    // if (public_id) {
    //     const { result } = await cloudinary.uploader.destroy(public_id)
    //     if (result !== 'ok')
    //         return sendError(res, 'Could not remove image from the cloud.')
    // }

    if (file) {
        const { url: url, public_id } = await uploadImageToCloud(file.path)
        item.image = { url: url, public_id: public_id }
    }

    item.name = name
    item.description = description
    item.type = type
    item.price = price


    await item.save()
    res.status(201).json({ item: formatMenuItem(item) })
}