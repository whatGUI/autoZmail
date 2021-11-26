const nodemailer = require("nodemailer");
const { dateformat } = require('../utils/dateformat');

async function sendEmail(emailConfig, zipstream) {
  
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.email,
      pass: emailConfig.password
    },
    secure: emailConfig.secure // true for 465, false for other ports
  });
  // get current date and time
  const currentDate = dateformat()
  // send mail with defined transport object
  await transporter.sendMail({
    from: emailConfig.email, // sender address
    to: emailConfig.to, // list of receivers
    subject: emailConfig.subject, // Subject line
    text: emailConfig.text, // plain text body
    // html: "<b>Hello world?</b>", // html body
    attachments: [{   // stream as an attachment
      filename: `${currentDate}.zip`,
      content: zipstream
    },]
  });
}

module.exports = { sendEmail }