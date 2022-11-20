const { isValidObjectId } = require("mongoose");
const nodemon = require("nodemon");
const Actor = require("../models/actor");
const { sendError, uploadImagetoCloud, formatActor, uploadImageToCloud } = require("../uitls/helper");
const cloudinary = require("../cloud/index");
const actor = require("../models/actor");

exports.createActor = async (req, res) => {
    const { name, about, gender } = req.body;
    const { file } = req

    const newActor = new Actor({ name, about, gender })
    if (file) {
        const { url, public_id } = await uploadImageToCloud(file.path)
        newActor.avatar = { url, public_id: public_id }
    }
    await newActor.save()
    res.status(201).json({ actor: formatActor(newActor) })
}

exports.updateActor = async (req, res) => {
    const { name, about, gender } = req.body;
    const { file } = req
    const { actorId } = req.params
    if (!isValidObjectId(actorId))
        return sendError(res, 'Invalid request!')
    const actor = await Actor.findById(actorId)
    if (!actor)
        return sendError(res, 'Invalid request, record not found!')

    const public_id = actor.avatar?.public_id
    if (public_id && file) {
        const { result } = await cloudinary.uploader.destroy(public_id)
        if (result !== 'ok')
            return sendError(res, 'Could not remove image from the cloud.')
    }

    if (file) {
        const { url, public_id } = await uploadImageToCloud(file.path)
        actor.avatar = { url: url, public_id: public_id }
    }

    actor.name = name,
        actor.email = about,
        actor.gender = gender

    await actor.save()
    res.status(201).json({ actor: formatActor(actor) })
}

exports.removeActor = async (req, res) => {
    const { actorId } = req.params
    if (!isValidObjectId(actorId))
        return sendError(res, 'Invalid request!')
    const actor = await Actor.findById(actorId)
    if (!actor)
        return sendError(res, 'Invalid request, record not found!')

    const public_id = actor.avatar?.public_id
    if (public_id) {
        const { result } = await cloudinary.uploader.destroy(public_id)
        if (result !== 'ok')
            return sendError(res, 'Could not remove image from the cloud.')
    }

    await Actor.findByIdAndDelete(actorId)
    res.json({ message: "Record removed Successfully!" })
}

exports.searchActor = async (req, res) => {
    const { name } = req.query

    if (!name.trim()) return sendError(res, 'Invalid Request')
    // const result = await Actor.find({ $text: { $search: `"${query.name}"` } })
    const result = await Actor.find({ name: { $regex: name, $options: 'i' } })

    const actors = result.map(actor => formatActor(actor))
    res.json({ results: actors })
}

exports.getLatestActors = async (req, res) => {
    const result = await Actor.find().sort({ createdAt: '-1' }).limit(12)
    const actors = result.map(actor => formatActor(actor))
    res.json(actors)
}

exports.getSingleActor = async (req, res) => {
    const { id } = req.params
    if (!isValidObjectId(id))
        return sendError(res, 'Invalid request!')
    const actor = await Actor.findById(id)
    if (!actor)
        return sendError(res, 'Invalid request, record not found!', 404)
    res.json({ actor: formatActor(actor) })
}

exports.getActors = async (req, res) => {
    const { pageNo = 0, limit = 10 } = req.query;

    const actors = await Actor.find({})
        .sort({ createdAt: -1 })
        .skip(parseInt(pageNo) * parseInt(limit))
        .limit(parseInt(limit));

    const profiles = actors.map((actor) => formatActor(actor))
    res.json({
        profiles,
    })
}

exports.updateActor = async (req, res) => {
    const { name, about, gender } = req.body;
    const { file } = req
    const { actorId } = req.params

    if (!isValidObjectId(actorId))
        return sendError(res, 'Invalid request!')
    const actor = await Actor.findById(actorId)
    if (!actor)
        return sendError(res, 'Invalid request, record not found!')

    const public_id = actor.avatar?.public_id

    if (public_id) {
        const { result } = await cloudinary.uploader.destroy(public_id)
        if (result !== 'ok')
            return sendError(res, 'Could not remove image from the cloud.')
    }

    if (file) {
        const { url: url, public_id } = await uploadImageToCloud(file.path)
        actor.avatar = { url: url, public_id: public_id }
    }

    actor.name = name,
        actor.email = about,
        actor.gender = gender

    await actor.save()
    res.status(201).json({ actor: formatActor(actor) })
}