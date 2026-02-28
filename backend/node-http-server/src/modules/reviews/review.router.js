const express = require("express");
const {
  create,
  list,
  getById,
  updateById,
  removeById,
} = require("./review.controller.js");

const reviewRouter = express.Router();

reviewRouter.post("/", create);
reviewRouter.get("/", list);
reviewRouter.get("/:id", getById);
reviewRouter.patch("/:id", updateById);
reviewRouter.delete("/:id", removeById);

module.exports = { reviewRouter };

