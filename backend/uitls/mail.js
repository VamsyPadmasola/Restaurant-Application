const nodemailer = require("nodemailer")
exports.generateOTP = (otp_length = 6) => {
    //generate a 6digit otp 
    let OTP = "";
    for (let i = 1; i <= otp_length; i++)
        OTP += Math.round(Math.random() * 9)
    return OTP;
}

exports.generateMailTransporter = () =>
    nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'theeatery81@gmail.com',
            pass: 'hrihlyhlsaitbbch'
        },
        port: 465,
        host: 'smtp.gmail.com'
    });