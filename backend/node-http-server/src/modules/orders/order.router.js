const express = require("express");
const {
  create,
  list,
  getById,
  updateById,
  removeById,
} = require("./order.controller.js");

const orderRouter = express.Router();

orderRouter.post("/", create);
orderRouter.get("/", list);
orderRouter.get("/:id", getById);
orderRouter.patch("/:id", updateById);
orderRouter.delete("/:id", removeById);

module.exports = { orderRouter };

