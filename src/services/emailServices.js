require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  family: 4, // force IPv4 — avoids ECONNREFUSED on IPv6 address
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
  tls: {
    rejectUnauthorized: false, // temp fix for "self-signed certificate in chain" (network/antivirus SSL inspection)
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend-Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
    const subject = "Welcome to Our Platform ";

    const text = `Hi ${name},

Welcome to our platform! Your account has been created successfully.

We're excited to have you with us.

Thanks,
The Team`;

    const html = `
        <h2>Welcome, ${name}! </h2>
        <p>Your account has been <strong>created successfully</strong>.</p>
        <p>We're excited to have you on our platform.</p>
        <p>If you have any questions, feel free to contact us.</p>
        <br>
        <p>Thanks,</p>
        <p><strong>The Team</strong></p>
    `;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = { sendRegistrationEmail };