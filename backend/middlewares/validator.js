const { check, validationResult } = require('express-validator');
const { isValidObjectId } = require('mongoose');
const genres = require('../uitls/genres');

exports.userValidator = [
    check('name').trim().not().isEmpty().withMessage('Name is missing!'),
    check('email').normalizeEmail().isEmail().withMessage('Email is Invalid'),
    check('password').trim().not().isEmpty().withMessage('Password is missing!')
        .isLength({ min: 8, max: 20 }).withMessage("Password must be 8 to 20 characters long!"),
];

exports.validatePassword = [
    check('newPassword').trim().not().isEmpty().withMessage('Password is missing!')
];

exports.signInValidator = [
    check('email').normalizeEmail().isEmail().withMessage('Email is Invalid'),
    check('password').trim().not().isEmpty().withMessage('Password is missing!')
];

exports.actorInfoValidator = [
    check('name').trim().not().isEmpty().withMessage('Name is missing!'),
    check('about').trim().not().isEmpty().withMessage('About is a required field!'),
    check('gender').trim().not().isEmpty().withMessage('Gender is a required field!'),
];

exports.chefInfoValidator = [
    check('name').trim().not().isEmpty().withMessage('Name is missing!'),
    check('about').trim().not().isEmpty().withMessage('About is a required field!'),
    check('gender').trim().not().isEmpty().withMessage('Gender is a required field!'),
];

exports.deliveryInfoValidator = [
    check('name').trim().not().isEmpty().withMessage('Name is missing!'),
    check('contact').not().isEmpty().withMessage('Contact is a required field!'),
    check('gender').trim().not().isEmpty().withMessage('Gender is a required field!'),
];

exports.menuInfoValidator = [
    check('name').trim().not().isEmpty().withMessage('Item name is missing!'),
    check('description').trim().not().isEmpty().withMessage('Description is a required field!'),
    check('type').trim().not().isEmpty().withMessage('Item type is a required field!'),
    check('price').trim().not().isEmpty().withMessage('Item price is a required field!'),
];

exports.validateMovie = [
    check('title').trim().not().isEmpty().withMessage('Movie title is missing!'),
    check('storyLine').trim().not().isEmpty().withMessage('Story line is a required field!'),
    check('releaseDate').isDate().withMessage('Release Date is a required field!'),
    check('language').trim().not().isEmpty().withMessage('Movie language is missing!'),
    check('status').isIn(["public", "private"]).withMessage('Movie status must be public or private'),
    check('type').trim().not().isEmpty().withMessage('Movie type is a required field!'),
    check('genres').isArray().withMessage('Genres must be an array of strings.').
        custom((value) => {
            for (let g of value) {
                if (!genres.includes(g)) throw Error('Invalid genres!')
            }
            return true;
        }),
    check('tags').isArray({ min: 1 }).withMessage('Tags must be an array of strings!')
        .custom((tags) => {
            for (let tag of tags) {
                if (typeof tag !== 'string') throw Error('Invalid tags!')
            }
            return true;
        }),
    check('cast').isArray().withMessage('Cast must be an array of Objects.').
        custom((cast) => {
            for (let c of cast) {
                if (!isValidObjectId(c.actor)) throw Error('Invalid Cast id inside cast.')
                if (!c.roleAs?.trim()) throw Error('Role as is missing inside cast.')
                if (typeof c.leadActor !== 'boolean') throw Error('Only accepted boolean value inside lead actor inside cast.')
            }
            return true;
        }),

    // check('poster').custom((_, {req}) => {
    //     if(!req.file) throw Error ('Poster file is missing.')
    //     return true;
    // })

]

exports.validateTrailer = check('trailer').isObject().withMessage('Trailer info must be an object with url and public_ic')
    .custom(({ url, public_id }) => {
        try {
            const result = new url(url)
            if (!result.protocol.includes('http')) throw Error('Trailer url is invalid!')

            const arr = url.split('/')

            const publicId = arr[arr.length - 1].split('.')[0];

            if (publicId !== public_id)
                throw Error('Trailer Public Id is invalid.')

            return true;
        } catch (e) {
            throw Error('Trailer url is invalid!')
        }

    })

exports.validate = (req, res, next) => {
    const error = validationResult(req).array();
    if (error.length) {
        return res.json({ error: error[0].msg });
    }

    next();
}

exports.validateRating = check(
    "rating",
    "Rating must be a number between 0 and 10"
).isFloat({ min: 0, max: 10 })

