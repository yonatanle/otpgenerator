/**
 * To run this test you will need to choose one of the following options
 * 
 * Command for sending OTP: node test.js send
 * Command for checking OTP: node test.js check
 * 
 */
const axios = require('axios');
const prompt = require('prompt-sync')({sigint: true});

async function sendPostRequest(url, data) {
    try {
        const response = await axios.post(url, data);

        if (response.status !== 200) {
            throw new Error('HTTP error! status: ' + response.status);
        }

        return response;
    } catch (error) {
        console.error('Error sending POST request:', error.response.data.message);
        return null;
    }
}

async function testGenerateOtp() {
    const url = "http://localhost:5000/api/otp/generate-otp";
    const email = prompt("Insert email for test: ");
    const data = { email }; // Construct data object correctly

    try {
        const response = await sendPostRequest(url, data);
        if(response && response.status == 200) {
            console.log('Response.message:', response.data.message, "Status:", response.status);
        }
        if (response && response.data.message === "OTP sent successfully" && response.status === 200) {
            console.log("Test Generating OTP success [V]");
        } else {
            console.log("Test Generating OTP FAILED [X]");
        }
    } catch (error) {
        console.error('Error:', error);
        console.log("Test Generating OTP FAILED [X]");
    }
}

async function testCheckOtp() {
  const url = "http://localhost:5000/api/otp/check-otp";
  const email = prompt("Insert email for test: ");
  const password = prompt("Insert password: ");
  const data = { email, password }; // Construct data object correctly

  try {
      const response = await sendPostRequest(url, data);
      if(response && response.status == 200) {
          console.log(response && 'Response.message:', response.data.message, "Status::", response.status);
      }
      if (response && response.data.message === "OTP is correct!" && response.status === 200) {
          console.log("Test Checking OTP success [V]");
      } else {
          console.log("Test Checking OTP FAILED [X]");
      }
  } catch (error) {
      console.error('Error:', error);
      console.log("Test Checking OTP FAILED [X]");
  }
}


if(process.argv.length == 2) {
  console.log("Command for sending OTP: node test.js send");
  console.log("Command for checking OTP: node test.js check");
  return;
}
if(process.argv[2] === "send") {
  testGenerateOtp();
} else if(process.argv[2] === "check") {
  testCheckOtp();
} else {
  console.log("Command for sending OTP: node test.js send");
  console.log("Command for checking OTP: node test.js check");
  return;
}
