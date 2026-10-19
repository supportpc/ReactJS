const nodemailer = require("nodemailer");

const sendGmail = nodemailer.createTransport({
  host: "us2.smtp.mailhostbox.com",
  port: 587,
  secure: false,
  pool: true,
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSWORD,
  },

  tls: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },

  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 30000,
});

module.exports = sendGmail;



const mailOptions = {
  from: `"Purchase Junction" <${process.env.GMAIL_ADDRESS}>`,
  to: email,
  subject: 'Purchase Junction Verification Code',
  html: message
}

sendGmail.sendMail(mailOptions, function (err, info) {
  if (err) {
    console.log(err);
    return res.status(500).send({ message: "Verification email could not be sent" });
  } else {
    res.status(200).json({
      success: true,
      data: secureCode
    });
  }
})


// FOR GOOGLE GAMIL
// const nodemailer = require('nodemailer');

// const sendGmail = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true, // true for port 465 (SSL)
//   pool: true,   // Keeps connections open for multiple OTP requests
//   auth: {
//     user: process.env.EMAIL_ADDRESS, // Must be supportnustechacademy@gmail.com
//     pass: process.env.EMAIL_PASSWORD  // Your 16-digit App Password
//   }
// });

// module.exports = sendGmail;
// const message = getSimpleOTPEmailTemplate({
//   userName: user.name || user.email.split('@')[0],
//   otp: otp,
//   expiryMinutes: 10
// });

// await sendGmail.sendMail({
//   from: `"NUSTECH Academy" <${process.env.EMAIL_ADDRESS}>`,
//   to: user.email,
//   subject: "Login OTP",
//   html: message,
//   headers: {
//     'X-Entity-Ref-ID': Date.now().toString(),
//     'Precedence': 'bulk'
//   }
// });