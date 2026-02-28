const express = require("express");
const {
  create,
  list,
  getById,
  updateById,
  removeById,
} = require("./product.controller.js");

const productRouter = express.Router();

productRouter.post("/", create);
productRouter.get("/", list);
productRouter.get("/:id", getById);
productRouter.patch("/:id", updateById);
productRouter.delete("/:id", removeById);

module.exports = { productRouter };

