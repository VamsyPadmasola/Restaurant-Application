const { sendError, formatActor, relatedMovieAggragation, getAverageRatings, topRatedMoviesPipeline } = require("../uitls/helper");
const cloudinary = require("../cloud")
const Movie = require('../models/movie');
const Review = require("../models/review");
const { isValidObjectId } = require("mongoose");

exports.uploadTrailer = async (req, res) => {
    const { file } = req;
    if (!file)
        return sendError(res, "Video file is missing!")
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(file.path, { resource_type: 'video' })

    res.status(201).json({
        url: url,
        public_id: public_id
    })
}

exports.createMovie = async (req, res) => {
    const { file, body } = req
    const {
        title,
        storyLine,
        director,
        releaseDate,
        status,
        type,
        genres,
        tags,
        cast,
        writers,
        trailer,
        reviews,
        language
    } = body;

    const newMovie = new Movie({
        title,
        storyLine,
        releaseDate,
        status,
        type,
        genres,
        tags,
        cast,
        trailer,
        reviews,
        language
    })

    if (director) {
        if (!isValidObjectId(director)) return sendError(res, 'Invalid Director id!')
        newMovie.director = director;
    }
    if (writers) {
        for (let writer of writers) {
            if (!isValidObjectId(writer)) return sendError(res, 'Invalid Writer id!')
        }

        newMovie.writers = writers;
    }

    //uploading poster
    if (file) {
        const { secure_url: url, public_id, responsive_breakpoints } = await cloudinary.uploader.upload(
            file.path,
            {
                transformation: {
                    width: 1280,
                    height: 720
                },
                responsive_breakpoints: {
                    create_derived: true,
                    max_width: 640,
                    max_images: 3
                }
            });


        const poster = { url, public_id, responsive: [] }
        const { breakpoints } = responsive_breakpoints[0];
        if (breakpoints.length) {
            for (let imgObj of breakpoints) {
                const { secure_url } = imgObj
                poster.responsive.push(secure_url)
            }
        }
        newMovie.poster = poster;
    }

    await newMovie.save();
    res.status(201).json({
        movie: {
            id: newMovie._id,
            title,
        }
    })

}

exports.updateMovieWithoutPoster = async (req, res) => {
    const { movieId } = req.params

    if (!isValidObjectId(movieId)) return sendError(res, 'Invalid movie id');

    const movie = await Movie.findById(movieId);
    if (!movie) return sendError(res, 'Movie not found!', 404)

    const {
        title,
        storyLine,
        director,
        releaseDate,
        status,
        type,
        genres,
        tags,
        cast,
        writers,
        trailer,
        reviews,
        language
    } = req.body;

    movie.title = title;
    movie.storyLine = storyLine;
    movie.tags = tags;
    movie.releaseDate = releaseDate;
    movie.status = status;
    movie.type = type;
    movie.genres = genres;
    movie.cast = cast;
    movie.trailer = trailer;
    movie.language = language;

    if (director) {
        if (!isValidObjectId(director)) return sendError(res, 'Invalid Director id!')
        movie.director = director;
    }
    if (writers) {
        for (let writer of writers) {
            if (!isValidObjectId(writer)) return sendError(res, 'Invalid Writer id!')
        }

        movie.writers = writers;
    }

    await movie.save();

    res.json({ message: 'Movie is updated!', movie })

}

exports.updateMovie = async (req, res) => {
    const { movieId } = req.params
    const { file } = req
    if (!isValidObjectId(movieId)) return sendError(res, 'Invalid movie id');

    // if (!req.file) return sendError(res, 'Movie poster is missing!')

    const movie = await Movie.findById(movieId);
    if (!movie) return sendError(res, 'Movie not found!', 404)


    const {
        title,
        storyLine,
        director,
        releaseDate,
        status,
        type,
        genres,
        tags,
        cast,
        writers,
        trailer,
        reviews,
        language
    } = req.body;

    movie.title = title;
    movie.storyLine = storyLine;
    movie.tags = tags;
    movie.releaseDate = releaseDate;
    movie.status = status;
    movie.type = type;
    movie.genres = genres;
    movie.cast = cast;
    movie.language = language;

    if (director) {
        if (!isValidObjectId(director)) return sendError(res, 'Invalid Director id!')
        movie.director = director;
    }
    if (writers) {
        for (let writer of writers) {
            if (!isValidObjectId(writer)) return sendError(res, 'Invalid Writer id!')
        }

        movie.writers = writers;
    }

    //update poster
    if (file) {
        //Removing poster from cloud if exists

        const posterId = movie.poster?.public_id
        if (posterId) {
            const { result } = await cloudinary.uploader.destroy(posterId);
            if (result !== 'ok') {
                console.log(result);
                return sendError(res, 'Could not update poster at the moment!')
            }
        }

        const { secure_url: url, public_id, responsive_breakpoints } = await cloudinary.uploader.upload(
            req.file.path,
            {
                transformation: {
                    width: 1280,
                    height: 720
                },
                responsive_breakpoints: {
                    create_derived: true,
                    max_width: 640,
                    max_images: 3
                }
            });

        const poster = { url, public_id, responsive: [] }
        const { breakpoints } = responsive_breakpoints[0];
        if (breakpoints.length) {
            for (let imgObj of breakpoints) {
                const { secure_url } = imgObj
                poster.responsive.push(secure_url)
            }
        }
        movie.poster = poster;

    }

    await movie.save();

    res.json({
        message: 'Movie is updated!', movie: {
            id: movie._id,
            title: movie.title,
            poster: movie.poster?.url,
            genres: movie.genres,
            status: movie.status
        }
    })

}

exports.removeMovie = async (req, res) => {
    const { movieId } = req.params

    if (!isValidObjectId(movieId)) return sendError(res, 'Invalid movie id');

    const movie = await Movie.findById(movieId);
    if (!movie) return sendError(res, 'Movie not found!', 404)

    //check if there is poster or nor
    //if yes then remove from cloudindary

    const posterId = movie.poster?.public_id
    if (posterId) {
        const { result } = await cloudinary.uploader.destroy(posterId);
        if (result != 'ok')
            return sendError(res, 'Could not remove poster from the cloud!')
    }

    const trailerId = movie.trailer?.public_id
    if (!trailerId) return sendError(res, 'Could not find trailer in the cloud!')

    const { result } = await cloudinary.uploader.destroy(trailerId, { resource_type: 'video' });
    if (result != 'ok')
        return sendError(res, 'Could not remove poster from the cloud!')

    await Movie.findByIdAndDelete(movieId);

    res.json({ message: 'Movie removed successfully!' })



}

exports.getMovies = async (req, res) => {
    const { pageNo = 0, limit = 10 } = req.query

    const movies = await Movie.find({})
        .sort({ createdAt: -1 })
        .skip(parseInt(pageNo) * parseInt(limit))
        .limit(parseInt(limit))

    const results = movies.map(movie => ({
        id: movie._id,
        title: movie.title,
        poster: movie.poster?.url,
        responsivePosters: movie.poster?.responsive,
        genres: movie.genres,
        status: movie.status
    }))

    res.json({
        movies: results
    })
}

exports.getMovieForUpdate = async (req, res) => {
    const { movieId } = req.params

    if (!isValidObjectId(movieId)) return sendError(res, 'Id is invalid')

    const movie = await Movie.findById(movieId).populate('director writers cast.actor')
    res.json({
        movie: {
            id: movie._id,
            title: movie.title,
            storyLine: movie.storyLine,
            poster: movie.poster?.url,
            releaseDate: movie.releaseDate,
            status: movie.status,
            type: movie.type,
            language: movie.language,
            genres: movie.genres,
            tags: movie.tags,
            director: formatActor(movie.director),
            writers: movie.writers.map(writer => formatActor(writer)),
            cast: movie.cast.map(c => {
                return {
                    id: c.id,
                    profile: formatActor(c.actor),
                    roleAs: c.roleAs,
                    leadActor: c.leadActor
                }
            })
        }
    })
}

exports.searchMovies = async (req, res) => {
    const { title } = req.query
    if (!title.trim()) return sendError(res, 'Invalid request!')
    const movies = await Movie.find({ title: { $regex: title, $options: 'i' } })
    res.json({
        results: movies.map(movie => {
            return {
                id: movie._id,
                title: movie.title,
                poster: movie.poster?.url,
                genres: movie.genres,
                status: movie.status
            }
        })
    })
}

exports.getLatestUploads = async (req, res) => {
    const { limit = 5 } = req.query
    const results = await Movie.find({ status: 'public' }).sort("-createdAt").limit(parseInt(limit))

    const movies = results.map(m => {
        return {
            id: m._id,
            title: m.title,
            poster: m.poster?.url,
            responsivePosters: m.poster?.responsivePosters,
            trailer: m.trailer?.url,
            storyLine: m.storyLine,
        }
    })

    res.json({ movies })
}
exports.getSingleMovie = async (req, res) => {
    const { movieId } = req.params
    if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie ID!")

    const movie = await Movie.findById(movieId).populate('director writers cast.actor')

    // const [aggregatedResponse] = await Review.aggregate(averageRatingPipeline(movie._id))

    // const reviews = {};

    // if (aggregatedResponse) {
    //     const { ratingAvg, reviewCount } = aggregatedResponse
    //     reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1)
    //     reviews.reviewCount = reviewCount
    // }

    const reviews = await getAverageRatings(movie._id)

    const { _id: id, title, storyLine, cast, writers, director,
        releaseDate, genres, tags, language, poster, trailer, type } = movie

    res.json({
        movie: {
            id,
            title,
            storyLine,
            releaseDate,
            genres,
            tags,
            language,
            type,
            poster: poster?.url,
            trailer: trailer?.url,
            cast: cast.map(c => ({
                profile: {
                    name: c.actor.name,
                    id: c.actor._id,
                    avatar: c.actor?.avatar?.url
                },
                leadActor: c.leadActor,
                roleAs: c.roleAs
            })),
            writers: writers.map(w => ({
                id: w._id,
                name: w.name
            })),
            director: {
                id: director._id,
                name: director.name
            },
            reviews: { ...reviews }
        }
    })
}

exports.getRelatedMovies = async (req, res) => {
    const { movieId } = req.params
    if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie ID!")

    const movie = await Movie.findById(movieId)

    const movies = await Movie.aggregate(relatedMovieAggragation(movie.tags, movie._id))

    const mapMovies = async (m) => {
        const reviews = await getAverageRatings(m._id)
        return {
            id: m._id,
            title: m.title,
            poster: m.poster,
            responsivePosters: m.poster?.responsivePosters,
            reviews: { ...reviews }
        }
    }

    const relatedMovies = await Promise.all(
        movies.map(mapMovies)

    )
    res.json({ movies: relatedMovies })

}

exports.getTopRatedMovies = async (req, res) => {
    const { type = 'Film' } = req.query

    const movies = await Movie.aggregate(topRatedMoviesPipeline(type))

    const mapMovies = async (m) => {
        const reviews = await getAverageRatings(m._id)

        return {
            id: m._id,
            title: m.title,
            poster: m.poster,
            responsivePosters: m.responsivePosters,
            reviews: { ...reviews }
        }
    }
    const topRatedMovies = await Promise.all(movies.map(mapMovies))

    res.json({ movies: topRatedMovies })
}

exports.searchPublicMovies = async (req, res) => {
    const { title } = req.query
    if (!title.trim()) return sendError(res, 'Invalid request!')
    const movies = await Movie.find({ title: { $regex: title, $options: 'i' }, status: 'public' })

    const mapMovies = async (m) => {
        const reviews = await getAverageRatings(m._id)

        return {
            id: m._id,
            title: m.title,
            poster: m.poster?.url,
            responsivePosters: m.poster?.responsivePosters,
            reviews: { ...reviews }
        }
    }
    const results = await Promise.all(movies.map(mapMovies))


    res.json({
        results,
    })
}