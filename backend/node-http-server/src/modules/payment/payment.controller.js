const paymentSchema = require("../payment/payment.schema");
const orderSchema = require("../orders/order.schema");
const paystack = require("paystack-api")(process.env.PSSECRETE);

const initializePayment = async (req, res) => {
  try {
    const userId = req.userData?.userId;
    const email = req.userData?.email;
    const { orderId, callbackUrl } = req.body || {};

    if (!userId || !email) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required",
      });
    }

    const order = await orderSchema.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (String(order.buyer) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "You can only pay for your own order",
      });
    }

    const orderTotal = Number(order?.summary?.total || 0);
    if (!Number.isFinite(orderTotal) || orderTotal <= 0) {
      return res.status(400).json({
        success: false,
        message: "Order total must be greater than zero",
      });
    }

    const amountInKobo = Math.round(orderTotal * 100);
    const reference = `ORD-${order._id}-${Date.now()}`;

    const payment = await paymentSchema.create({
      user: userId,
      order: order._id,
      amount: amountInKobo,
      reference,
    });

    const payload = {
      email,
      amount: amountInKobo,
      reference,
    };

    if (typeof callbackUrl === "string" && callbackUrl.trim()) {
      payload.callback_url = callbackUrl.trim();
    }

    const paystackResponse = await paystack.transaction.initialize(payload);
    order.paymentReference = reference;
    await order.save();

    return res.status(200).json({
      success: true,
      authorization_url: paystackResponse?.data?.authorization_url,
      reference,
      paymentId: payment._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "reference is required",
      });
    }

    const verify = await paystack.transaction.verify(reference);
    const gatewayStatus = String(verify?.data?.status || "").toLowerCase();
    const gatewaySuccess = verify?.status === true && gatewayStatus === "success";

    if (!gatewaySuccess) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const payment = await paymentSchema.findOne({ reference });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    payment.status = "success";
    await payment.save();

    const order = await orderSchema.findById(payment.order);
    if (order) {
      if (order.status === "pending") {
        order.status = "processing";
      }
      if (!order.paymentReference) {
        order.paymentReference = reference;
      }
      await order.save();
    }

    return res.status(200).json({
      success: true,
      data: {
        reference,
        paymentStatus: payment.status,
        orderId: order?._id || null,
        orderStatus: order?.status || null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { initializePayment, verifyPayment };
