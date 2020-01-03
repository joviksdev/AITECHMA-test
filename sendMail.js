const nodemailer = require('nodemailer');

module.exports = (name, email, password) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'toch.emeo@gmail.com',
      pass: '************'
    }
  });

  const mailOptions = {
    from: 'toch.emeo@gmail.com',
    to: email,
    subject: 'Generated password from Node.js Server',
    text: `
        Hello ${name}!

        Your password is ${password}.
      `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending mail occur', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
