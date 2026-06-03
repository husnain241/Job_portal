const nodemailer = require('nodemailer');
const { email: emailConfig } = require('../config/env');

// A transporter is the "email sender" — it holds your email credentials
// and knows HOW to send emails (which server, which port)
const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  // secure: false means we use STARTTLS (standard for port 587)
  secure: false,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass,
  },
});

// sendEmail is an async function that sends one email
// It accepts an options object: { to, subject, html }
const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: emailConfig.from, // who it's from
    to,                     // who it's going to
    subject,                // email subject line
    html,                   // HTML content of the email
  };

  // transporter.sendMail() actually sends the email
  // We await it because sending takes time
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;