const express = require("express");
const {
  registerUser,
  loginUser,
  adminLogin,
  upgradeToSeller,
  getSellerApplicationStatus,
} = require("./user.controller");
const { validateUser } = require("../../middleware/validate_user");

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/admin/login", adminLogin);
authRouter.put("/upgrade-to-seller", validateUser, upgradeToSeller);
authRouter.get("/seller-application", validateUser, getSellerApplicationStatus);

module.exports = { authRouter };

