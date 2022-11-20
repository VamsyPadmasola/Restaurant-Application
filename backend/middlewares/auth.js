const jwt = require('jsonwebtoken')
const { sendError } = require('../uitls/helper.js');
const User = require('../models/user.js');

exports.isAuth = async(req, res, next) => {
    const token = req.headers?.authorization

    if(!token) return sendError(res, 'Invalid token')
    const jwttoken = token.split('Bearer ')[1]

    if(!jwttoken) return sendError(res, 'Invalid token')
    const decode = jwt.verify(jwttoken, process.env.JWT_SECRET)
    const { userId } = decode

    const user = await User.findById(userId)
    
    if(!user) return sendError(res, 'Invalid token user not found',404)

    req.user = user;
    next()
}

exports.isAdmin = async(req, res, next) => {
    const {user} = req
    if(user.role !== 'admin') return sendError(res, 'Unauthorized access!')
    next()
}