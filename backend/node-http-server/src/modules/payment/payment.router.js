const express = require('express');
const { validateUser } = require('../../middleware/validate_user');
const { initializePayment, verifyPayment } = require('./payment.controller');

const paymentRouter = express.Router();

paymentRouter.route('/initialize').post(validateUser,initializePayment);
paymentRouter.route("/verify/:reference").get(verifyPayment);

module.exports = {paymentRouter};