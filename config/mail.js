// jshint esversion:8
const nodemailer = require("nodemailer");

  // Generate test SMTP service account from ethereal.email

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "mail.anzaacademy.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "info@anzaacademy.com", // generated ethereal user
      pass: "Anza@2030", // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });
module.exports = transporter;