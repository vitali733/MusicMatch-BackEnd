const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.PASS,
  },
});

// Define a function to send the email verification link
const sendEmailVerificationLink = async (email, token) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Account verifizieren',
      html: `<a href="http://localhost:4000/verify?token=${token}">Registrierung abschließen</a>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmailVerificationLink;
