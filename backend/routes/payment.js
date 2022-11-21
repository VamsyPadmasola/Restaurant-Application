const express = require('express');
const Razorpay = require('razorpay')
const crypto = require('crypto');
const router = require('./actor');
const { sendError } = require('../uitls/helper');

router.post("/orders", async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY,
            key_secret: process.env.RAZORPAY_SECRET
        })

        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            // reciept: crypto.randomBytes(10).toString('hex')
        }

        instance.orders.create(options, (error, order) => {
            if (error)
                return sendError(res, error)
            return res.status(200).json({ data: order })
        })
    }
    catch (error) {
        return sendError(res, 'Internal Server Error')
    }
})


router.post("/verify", async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
        const sign = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex")

        if (razorpay_signature === expectedSign)
            return res.json({ message: "Payment Verified Successfully" })
        else
            return sendError(res, "nvalid Signature sent", "400")
    } catch (error) {
        return sendError(res, 'Internal Server Error')
    }
})
module.exports = router; 
