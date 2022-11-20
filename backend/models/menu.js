const mongoose = require("mongoose")

const menuSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    type: {
        type: String,
        trim: true,
        required: true,
    },
    price: {
        type: Number,
        trim: true,
        required: true,
    },
    image: {
        type: Object,
        url: String,
        public_id: String
    },
}, { timestamps: true });

menuSchema.index({ name: "text" })

module.exports = mongoose.model("Menu", menuSchema)