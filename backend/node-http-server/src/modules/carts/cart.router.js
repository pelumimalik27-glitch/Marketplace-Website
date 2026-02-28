const express = require("express");
const {
  create,
  list,
  getById,
  updateById,
  removeById,
} = require("./cart.controller.js");

const cartRouter = express.Router();

cartRouter.post("/", create);
cartRouter.get("/", list);
cartRouter.get("/:id", getById);
cartRouter.patch("/:id", updateById);
cartRouter.delete("/:id", removeById);

module.exports = { cartRouter };

