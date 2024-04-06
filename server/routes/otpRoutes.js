const express = require('express');
const router = express.Router();

const otpUtils = require("../otpUtils");

module.exports = function(db) {
// Handle POST request to generate OTP
  router.post("/generate-otp", async (req, res) => {
    const { email } = req.body;
    console.log("generate-otp");
    try {
      if (!email) {
        throw new Error("Email is required");
      }
      if (!otpUtils.isValidEmail(email)) {
        throw new Error(`Email is ${email} is not a valid email`);
      }
      
      // Send OTP to user's email
      await otpUtils.sendOtp(db, email);
      console.log("OTP sent successfully");
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error generating OTP:", error.message);
      res.status(500).json({ message: error.message });
    }
  });

  // Handle POST request to check OTP
  router.post("/check-otp", async (req, res) => {
    const { email, password } = req.body;
    console.log("check-otp");
    console.log("email:", email);
    console.log("password:", password);
    try {
      if (!email) {
        throw new Error("Email is required");
      }
      if (!otpUtils.isValidEmail(email)) {
        throw new Error(`Email is ${email} is not a valid email`);
      }
      if (!password) {
        throw new Error("Password is required");
      }
      const otpIsCorrect = await otpUtils.checkOtp(db, email, password);
      if (otpIsCorrect) {
        res.status(200).json({ message: 'OTP is correct!' });
      } else {
        res.status(400).json({ message: 'Incorrect OTP or expired' });
      }

    } catch (error) {
      console.error("Error checking OTP:", error.message);
      res.status(500).json({ message: error.message });
    }
  });

  console.log("return router");
  return router;
};