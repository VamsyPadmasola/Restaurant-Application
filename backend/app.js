const express = require('express');
const { errorHandler } = require('./middlewares/error');
require('express-async-errors')
const userRouter = require('./routes/user')
const actorRouter = require('./routes/actor')
const paymentRouter = require('./routes/payment')
const chefRouter = require('./routes/chef')
const movieRouter = require('./routes/movie')
const reviewRouter = require('./routes/review')
const menuRouter = require('./routes/menu')
const orderRouter = require('./routes/order')
const adminRouter = require('./routes/admin')
const deliveryRouter = require('./routes/delivery')
const cors = require('cors');
const { handleNotFound } = require('./uitls/helper');
require("dotenv").config();
require('./db/index.js');

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/user', userRouter)
app.use('/api/chef', chefRouter)
app.use('/api/actor', actorRouter)
app.use('/api/menu', menuRouter)
app.use('/api/movie', movieRouter)
app.use('/api/review', reviewRouter)
app.use('/api/admin', adminRouter)
app.use('/api/delivery', deliveryRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/order', orderRouter)

app.use("/*", handleNotFound)



app.use(errorHandler)
// app.post("/sign-in",
// //middleware function
// (req, res, next) => {
//     //you can add ypu logic here if logic matches then next will be executed else not
//     //Function to decide call next function or not
//     const {email, password} = req.body;
//     if(!email || !password) return res.json({error : "email/password is missing!"})
//     next()
// },
//controller function
// (req, res) => {
//     res.send('<h1>Hello I am from your about backend server</h1>')
// };

app.listen(8000, () => {
    console.log("Port is Listening on 8000")
})