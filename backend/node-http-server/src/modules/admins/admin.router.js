const express = require("express");
const {
  create,
  list,
  getAnalytics,
  getPlatformAnalytics,
  getPendingSellers,
  approveSellerApplication,
  rejectSellerApplication,
  getDisputes,
  getById,
  updateById,
  removeById,
} = require("./admin.controller.js");
const { adminAuth } = require("../../middleware/admin_auth");

const adminRouter = express.Router();

adminRouter.use(adminAuth);

adminRouter.post("/", create);
adminRouter.get("/", list);
adminRouter.get("/analytics", getAnalytics);
adminRouter.get("/platform-analytics", getPlatformAnalytics);
adminRouter.get("/pending-sellers", getPendingSellers);
adminRouter.patch("/pending-sellers/:sellerId/approve", approveSellerApplication);
adminRouter.patch("/pending-sellers/:sellerId/reject", rejectSellerApplication);
adminRouter.get("/disputes", getDisputes);
adminRouter.get("/:id", getById);
adminRouter.patch("/:id", updateById);
adminRouter.delete("/:id", removeById);

module.exports = { adminRouter };

