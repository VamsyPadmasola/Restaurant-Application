const express = require('express');
const jwt = require('jsonwebtoken')
const { userValidator, validate, signInValidator, validatePassword } = require('../middlewares/validator.js');
const {create, verifyEmail, resendEmailVerification, forgetPassword, sendResetPasswordTokenStatus, resetPassword, signIn} = require('../controllers/user');
const { isValidPasswordResetToken } = require('../middlewares/user');
const { isAuth } = require('../middlewares/auth.js');
const router = express.Router()

router.post("/create",userValidator, validate, create);
router.post("/signin",signInValidator, validate, signIn);

router.post("/verify-email", verifyEmail);
router.post("/resend-verify-email",resendEmailVerification)
router.post("/forget-password",forgetPassword)
router.post("/verify-password-reset-token",isValidPasswordResetToken, sendResetPasswordTokenStatus)
router.post("/reset-password",validatePassword, validate, isValidPasswordResetToken, resetPassword)


router.get('/is-auth',isAuth, (req, res) => {
    const {user} = req;
    res.json({user : {id : user._id, name : user.name, email: user.email,isVerified : user.isVerified, role : user.role}})
})

module.exports = router; 
