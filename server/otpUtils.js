
const bcrypt = require('bcrypt');

const otpTable = require('./database/otp_table');
const emailSender = require('./emailSender');
const cities = require("./citiesDictionary");
const weather = require("./weatherService");

const lifetime = 5;

// Function to generate OTP based on weather temperatures
async function generateOTP(temps) {
    return temps
      .map((temp) => {
        console.log(`int=${temp}`);
        const formattedTemp =
          Math.abs(temp) < 10 ? `0${Math.abs(temp)}` : Math.abs(temp);
        return formattedTemp.toString();
      })
      .join("");
}

// Function to hash the password using bcrypt
function cryptPassword(password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
     if (err) 
       return callback(err);
 
     bcrypt.hash(password, salt, function(err, hash) {
       if (err) {
         return callback(err);
       }
       callback(null, hash); // Pass the hash as a string
     });
   });
 };

 // Function to compare plain password with hashed password
async function comparePassword(plainPass, hashword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {   
            if (err) {
                reject(err);
            } else {
                resolve(isPasswordMatch);
            }
        });
    });
}

//function to save details in the database
async function saveOtp(db, email, passw) {
    var expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + lifetime);
    console.log("Expiration date ", expirationDate);
    cryptPassword(passw, (err, hashPass) => {
        if (err) {
            console.error('Error hashing password:', err.message);
            return;
        }
        otpTable.insertOrUpdate(db, email, hashPass, expirationDate);
    });
}   

//function to send otp to user's email
async function sendOtp(db, email) {
    console.log("into generate-otp");
    try {
      // Send OTP to user's email
      const randomCities = await cities.getRandomCities();
      console.log("Randomly selected cities:", randomCities);
      const temperatures = await weather.getTemperatures(randomCities); 
      const otp = await generateOTP(temperatures);

      console.log(`Sending  mail with otp ${otp}`);
      await emailSender.sendOTP(email, otp);
      await saveOtp(db, email, otp);
      console.log("OTP sent successfully");
    } catch (error) {
      console.error("Error generating OTP:", error.message);
    }
}

// function to check if otp is correct
async function checkOtp(db, email, password) {
    console.log("into checkOtp");
    try {
        return new Promise((resolve, reject) => {
                otpTable.fetch(db, email, async (err, row) => { 
                console.log("into fetch checkOtp");
                if (err) {
                    const msg = `Error fetching row: ${err.message}`; 
                    console.error(msg);
                    reject(new Error(err.message));
                }
                if (row) {
                    console.log('Found row:', row);
                    console.log("Correct hashpass:", row.passw, "Plain input password:", password);
                    try {
                        const isPasswordOk = await comparePassword(password, row.passw); 
                        if (isPasswordOk) {
                            const now = new Date().getTime();
                            console.log("Password is Ok", "Expiration:", row.otpExpiration, "Now:", now);
                            if (row.otpExpiration > now) {
                                otpTable.remove(db, email);
                                console.log("Password is OK for email", email);
                                resolve(true);
                            } else {
                                const msg = `Password expired for email ${email}`; 
                                console.log(msg);
                                resolve(false);
                            }
                        } else {
                            const msg = `Incorrect OTP for email ${email}`; 
                            console.log(msg);
                            resolve(false);
                        }
                    } catch (error) {
                        console.error("Error comparing passwords:", error.message);
                        reject(new Error("Error comparing passwords: " + error.message));
                    }
                } else {
                    const msg = `No row found with the given email ${email}`; 
                    console.log(msg);
                    resolve(false);
                }
            });
        });
    } catch (error) {
        console.error("Error checking OTP:", error.message);
        throw new Error("Error checking OTP: " + error.message);
    }
}

function isValidEmail(email) {
    // Regular expression for validating email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

module.exports.sendOtp = sendOtp;
module.exports.checkOtp = checkOtp;
module.exports.isValidEmail = isValidEmail;
