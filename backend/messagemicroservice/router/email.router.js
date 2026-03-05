const express = require('express');
const {
  sendOTP,
  verifyOTP,
  sendWelcome,
  sendLoginAlert,
  sendSellerApproval,
} = require('../controller/email.controller');


const  emailRouter = express.Router();
emailRouter.route('/send-otp').post(sendOTP);
emailRouter.route('/verify-otp').post(verifyOTP);
emailRouter.route('/welcome').post(sendWelcome);
emailRouter.route('/login-alert').post(sendLoginAlert);
emailRouter.route('/seller-approval').post(sendSellerApproval);

module.exports = {emailRouter};
