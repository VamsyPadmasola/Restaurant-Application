const mongoose = require("mongoose")

const chefSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    about: {
        type: String,
        trim: true,
        required: true,
    },
    gender: {
        type: String,
        trim: true,
        required: true,
    }
}, { timestamps: true });

chefSchema.index({ name: "text" })

module.exports = mongoose.model("Chef", chefSchema)