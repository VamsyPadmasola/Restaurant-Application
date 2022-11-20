const { isValidObjectId } = require("mongoose");
const Movie = require("../models/movie");
const Review = require("../models/review");
const { post } = require("../routes/review");
const { sendError, averageRatingPipeline, getAverageRatings } = require("../uitls/helper");

exports.addReview = async (req, res) => {
    const { movieId } = req.params
    const { content, rating } = req.body
    const userId = req.user._id

    if (!req.user.isVerified) return sendError(res, "Please verify your email first!")

    if (!isValidObjectId(movieId)) return sendError(res, 'Invalid Movie!')

    const movie = await Movie.findOne({ _id: movieId, status: 'public' })
    if (!movie) return sendError(res, 'Movie Not found!', 404)

    const isAlreadyReviewed = await Review.findOne({ owner: userId, parentMovie: movie._id })
    if (isAlreadyReviewed)
        return sendError(res, 'Invalid request, review is already there!')

    //create and update review
    const newReview = new Review({
        owner: userId,
        parentMovie: movie._id,
        content,
        rating
    })

    //updating review for movie
    movie.reviews.push(newReview._id)
    await movie.save()

    //saving new review
    await newReview.save()

    const reviews = await getAverageRatings(movie._id)
    res.json({
        message: 'Your review has been added!',
        reviews: reviews
    })
};

exports.updateReview = async (req, res) => {
    const { reviewId } = req.params
    const { content, rating } = req.body
    const userId = req.user._id

    if (!isValidObjectId(reviewId)) return sendError(res, 'Invalid Review ID!')

    const review = await Review.findOne({ owner: userId, _id: reviewId })
    if (!review) return sendError(res, 'Review not found!', 404)

    review.content = content
    review.rating = rating

    await review.save()

    res.json({ message: 'Your review has been updated!' })
};

exports.removeReview = async (req, res) => {
    const { reviewId } = req.params
    const userId = req.user._id

    if (!isValidObjectId(reviewId)) return sendError(res, 'Invalid Review ID!')

    const review = await Review.findOne({ owner: userId, _id: reviewId })
    if (!review) return sendError(res, 'Review not found!', 404)

    const movie = await Movie.findById(review.parentMovie).select('reviews')
    movie.reviews = movie.reviews.filter((rId) => rId.toString() !== reviewId);

    await Review.findByIdAndDelete(reviewId)

    await movie.save()

    res.json({ message: "Review Removed successfully" })
};

exports.getReviewsByMovie = async (req, res) => {
    const { movieId } = req.params

    if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie ID!")

    const movie = await Movie.findById(movieId).populate({
        path: 'reviews',
        populate: {
            path: 'owner',
            select: 'name'
        },
    }).select('reviews title')

    const reviews = movie.reviews.map(review => {
        const { owner, content, rating, _id: reviewId } = review
        const { name, _id: ownerId } = owner
        return {
            id: reviewId,
            owner: {
                id: ownerId,
                name
            },
            content: content,
            rating: rating
        }
    })

    res.json({ movie: { reviews, title: movie.title } });
}

