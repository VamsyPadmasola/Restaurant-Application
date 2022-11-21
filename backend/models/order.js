const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    price: {
        type: Number,
        trim: true,
        required: true
    },
    details: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Menu'
            },
            itemName: {
                type: String,
                trim: true
            },
            quantity: Number
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Delivery',
        required: false
    },
    street1: {
        type: String,
        trim: true,
        required: true
    },
    street2: {
        type: String,
        trim: true,
        required: true
    },
    city: {
        type: String,
        trim: true,
        required: true
    },
    state: {
        type: String,
        trim: true,
        required: true
    },
    contact: {
        type: Number,
        trim: true,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["Confirmed", "Preparing", "Shipped", "Delivered"]
    }
}, { timestamps: true });

orderSchema.index({ name: "text" })

module.exports = mongoose.model("Order", orderSchema)