const nodemailer = require("nodemailer");
const { Verification_Email_Template, Welcome_Email_Template } = require("./EmailTemplate");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "megha.new.acc@gmail.com",
    pass: "woev azvs ecxa cntu",
  },
});

const sendVerificationCode = async (email, verification) => {
  try {
    const response = await transporter.sendMail({
      from: '"Ecommerce" <megha.new.acc@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Verification code", // Subject line
      text: `Verify your email`, // plain text body
      html: Verification_Email_Template.replace("{verificationCode}", verification), // html body
    });
    console.log('Email sent successfully', response);
  } catch (error) {
    console.log(error);
  }
};

const welcomeEmail = async (email, name) => {
    try {
      const response = await transporter.sendMail({
        from: '"Hawala" <megha.new.acc@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Welcome Email", // Subject line
        text: "Welcome Email", // plain text body
        html: Welcome_Email_Template.replace("{name}", name), // html body
      });
      console.log('Email sent successfully', response);
    } catch (error) {
      console.log(error);
    }
  };

module.exports = { sendVerificationCode, welcomeEmail };
