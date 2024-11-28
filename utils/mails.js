const transporter = require('../config/mail');
exports.sendMail= async (username,email,subject,message)=> {
  let info = await transporter.sendMail({
    from: '"Info" info@anzaacademy.com', // sender address
    to:`${username},${email}`, // list of receivers
    subject:subject, // Subject line
    text:message, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
};