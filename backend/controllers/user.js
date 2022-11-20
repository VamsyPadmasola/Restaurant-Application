const jwt = require("jsonwebtoken")
const User = require("../models/user")
const EmailVerificationToken = require("../models/emailVerificationToken");
const PasswordResetToken = require("../models/passwordResetToken");
const { isValidObjectId } = require("mongoose");
const { generateOTP, generateMailTransporter } = require("../uitls/mail");
const { sendError, generateRandomByte } = require("../uitls/helper");
const user = require("../models/user");

exports.create = async (req, res) => {
    const { name, email, password } = req.body

    const oldUser = await User.findOne({ email })

    if (oldUser) return sendError(res, "This email is already in use.");

    const newUser = new User({ name: name, email: email, password: password });
    await newUser.save()

    let OTP = generateOTP();

    //store inside database
    const newEmailVerificationtoken = new EmailVerificationToken({
        owner: newUser._id,
        token: OTP
    });

    await newEmailVerificationtoken.save();
    //send to user

    var transport = generateMailTransporter();
    console.log(newUser)
    transport.sendMail({
        from: 'cinemaaareview1@gmail.com',
        to: newUser.email,
        subject: "Email Verification",
        html: `
            <p> Your Verification OTP is </p>
            <h1> ${OTP}</h1>
        `

    })

    res.status(201).json({
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        },
        message: "Please verify your email. OTP has been sent to your email account!."
    });
};

exports.verifyEmail = async (req, res) => {
    const { userId, OTP } = req.body;
    if (!isValidObjectId(userId))
        return sendError(res, "Inavlid user!")

    const user = await User.findById(userId)
    if (!user)
        return sendError(res, "user not found!", 404)
    if (user.isVerified)
        return sendError(res, "user is already verified.")

    const token = await EmailVerificationToken.findOne({ owner: userId })
    if (!token)
        return sendError(res, "token not found!")

    const isMatched = await token.compareToken(OTP);
    if (!isMatched)
        return sendError(res, "Please enter a valid OTP.")

    user.isVerified = true;
    await user.save();

    await EmailVerificationToken.findByIdAndDelete(token._id);

    var transport = generateMailTransporter();

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: user.email,
        subject: "Welcome Email",
        html: `
            <h1>Welcome to our app and thanks for choosing us.</h1>
        `
    })
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
    res.json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            token: jwtToken,
            isVerified: user.isVerified,
            role: user.role
        },
        message: "Your email is successfully  verified."
    })

}

exports.resendEmailVerification = async (req, res) => {
    const { userId } = req.body;

    const user = await User.findById(userId)
    if (!user)
        return sendError(res, "user not found!", 404)
    if (user.isVerified)
        return sendError(res, "user is already verified.")

    const alreadyHasToken = await EmailVerificationToken.findOne({ owner: userId })
    if (alreadyHasToken)
        return sendError(res, "Only after one hour you can request for another token!")


    //generate a 6digit otp 
    let OTP = generateOTP();

    const newEmailVerificationtoken = new EmailVerificationToken({
        owner: userId,
        token: OTP
    });

    await newEmailVerificationtoken.save();
    //send to user

    const transport = generateMailTransporter();

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: user.email,
        subject: "Email Verification",
        html: `
            <p> Your Verification OTP is </p>
            <h1> ${OTP}</h1>
        `

    })

    res.status(201).json({ message: "Please verify your email. New OTP has been sent to your email account!." });

}

exports.forgetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email)
        return sendError(res, "email is missing!")
    const user = await User.findOne({ email })
    if (!user)
        return sendError(res, "user not found!", 404)

    const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id })

    if (alreadyHasToken)
        return sendError(res, "Only after One hour you can request for another token")

    const token = await generateRandomByte();
    const newPasswordResetToken = await PasswordResetToken({ owner: user._id, token });
    await newPasswordResetToken.save()

    const resetPasswordUrl = `http://localhost:3000/auth/reset-password?token=${token}&id=${user._id}`;

    const transport = generateMailTransporter();

    transport.sendMail({
        from: "security@reviewapp.com",
        to: user.email,
        subject: "Email verification",
        html: `
            <p>Click here to reset your password</p>
            <a href = '${resetPasswordUrl}'>Change Password</a>
        `
    })
    res.json({
        message: "Reset Password Link is sent to your Email Address."
    })

}

exports.sendResetPasswordTokenStatus = (req, res) => {
    res.json({ valid: true })
}

exports.resetPassword = async (req, res) => {
    const { newPassword, userId } = req.body;

    const user = await User.findById(userId);
    const isMatched = await user.comparePassword(newPassword)

    if (isMatched)
        return sendError(res, "The new password must be different from the old one!");

    user.password = newPassword;
    await user.save();

    await PasswordResetToken.findByIdAndDelete(req.resetToken._id)

    const transport = generateMailTransporter();

    transport.sendMail({
        from: "security@reviewapp.com",
        to: user.email,
        subject: "Password Reset Successfully",
        html: `
            <h1>Password reset successfully</h1>
            <p>Now you can use your new password</p>
        `
    })
    res.json({
        message: "Password reset successfully, now you can use your new password"
    })
}

exports.signIn = async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email })
    if (!user) return sendError(res, 'Email/Password Mismatch');

    const isMatched = await user.comparePassword(password)
    if (!isMatched) return sendError(res, 'Email/Password Mismatch');

    const { _id, name, isVerified, role } = user;

    const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET)

    res.json(
        {
            user:
            {
                id: _id, name,
                email,
                role,
                token: jwtToken, isVerified,
                role
            }
        })

}
