const Order = require("../models/order")
const Movie = require("../models/movie")
const Chef = require("../models/chef")
const User = require("../models/user")
const Delivery = require("../models/delivery")

const { topRatedMoviesPipeline, getAverageRatings } = require("../uitls/helper")

exports.getAppInfo = async (req, res) => {
    const orderCount = await Order.countDocuments()
    const userCount = await User.countDocuments()
    const chefCount = await Chef.countDocuments()
    const deliveryCount = await Delivery.countDocuments()

    const staffCount = deliveryCount + chefCount

    res.json({ appInfo: { orderCount, userCount, staffCount } })
}

exports.getMostRated = async (req, res) => {
    const movies = await Movie.aggregate(topRatedMoviesPipeline())

    const mapMovies = async (m) => {
        const reviews = await getAverageRatings(m._id)

        return {
            id: m._id,
            title: m.title,
            reviews: { ...reviews }
        }
    }
    const topRatedMovies = await Promise.all(movies.map(mapMovies))

    res.json({ movies: topRatedMovies })
}