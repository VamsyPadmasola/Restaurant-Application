const mongoose = require("mongoose")

const deliverySchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    contact: {
        type: Number,
        trim: true,
        required: true,
    },
    gender: {
        type: String,
        trim: true,
        required: true,
    }
}, { timestamps: true });

deliverySchema.index({ name: "text" })

module.exports = mongoose.model("Delivery", deliverySchema)