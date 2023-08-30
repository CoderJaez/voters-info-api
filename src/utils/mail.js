const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "class.oqrpi@gmail.com",
    pass: "cstnrondykkvopjg",
  },
});

const sendEmail = (email, title, message) => {
  const mailOptions = {
    from: "class.oqrpi@gmail.com",
    to: email,
    subject: title,
    text: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) console.log(error);
    else console.log("Email sent: ", info.response);
  });
};

module.exports = sendEmail;
