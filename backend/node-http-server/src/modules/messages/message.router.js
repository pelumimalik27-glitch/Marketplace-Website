const express = require("express");
const {
  create,
  list,
  getById,
  updateById,
  removeById,
} = require("./message.controller.js");

const messageRouter = express.Router();

messageRouter.post("/", create);
messageRouter.get("/", list);
messageRouter.get("/:id", getById);
messageRouter.patch("/:id", updateById);
messageRouter.delete("/:id", removeById);

module.exports = { messageRouter };

