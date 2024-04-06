const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());

// Send OTP to user's email
async function sendOTP(email, otp) {
  console.log("Sending email");
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: 'testapi2026@gmail.com',
        pass: 'hfsqjqzphsqttmwb',
      },
      
    });

    const mailOptions = {
      from: "testapi2026@gmail.com",
      to: email,
      subject: "Your One-Time Passcode",
      text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully");
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
}

module.exports.sendOTP = sendOTP;
