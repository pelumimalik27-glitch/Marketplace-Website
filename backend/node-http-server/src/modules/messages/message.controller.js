const mongoose = require("mongoose");
const messageSchema = require("./message.schema.js");
const conversationSchema = require("../conversations/conversation.schema");
const { emitToUsers } = require("../../lib/socket");

const asObjectId = (value) => {
  const text = String(value || "").trim();
  if (!mongoose.Types.ObjectId.isValid(text)) return null;
  return new mongoose.Types.ObjectId(text);
};

const ensureConversationMember = async (conversationId = "", userId = "") => {
  const conversationObjectId = asObjectId(conversationId);
  const userObjectId = asObjectId(userId);
  if (!conversationObjectId || !userObjectId) return null;

  return conversationSchema.findOne({
    _id: conversationObjectId,
    participants: userObjectId,
  });
};

const serializeMessage = (doc = {}) => {
  const raw = typeof doc?.toObject === "function" ? doc.toObject() : doc;
  return {
    ...raw,
    conversationId: String(raw?.conversationId || ""),
    senderId: String(raw?.senderId || ""),
  };
};

const create = async (req, res) => {
  try {
    const userId = req.userData?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const senderObjectId = asObjectId(userId);
    if (!senderObjectId) {
      return res.status(401).json({ success: false, message: "Invalid authenticated user" });
    }

    const conversationId = String(req.body?.conversationId || "").trim();
    const content = String(req.body?.content || "").trim();
    if (!conversationId || !content) {
      return res.status(400).json({
        success: false,
        message: "conversationId and content are required",
      });
    }

    const conversation = await ensureConversationMember(conversationId, userId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found for this user",
      });
    }

    const doc = await messageSchema.create({
      conversationId: conversation._id,
      senderId: senderObjectId,
      content,
    });

    conversation.lastMessage = content;
    await conversation.save();

    const payload = serializeMessage(doc);
    emitToUsers(
      (conversation.participants || []).map((participant) => String(participant)),
      "chat:message",
      {
        message: payload,
        conversationId: String(conversation._id),
      }
    );

    emitToUsers(
      (conversation.participants || []).map((participant) => String(participant)),
      "chat:conversation",
      {
        conversation: {
          _id: String(conversation._id),
          participants: conversation.participants,
          lastMessage: conversation.lastMessage,
          updatedAt: conversation.updatedAt,
          createdAt: conversation.createdAt,
        },
      }
    );

    return res.status(201).json({ success: true, data: payload });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const list = async (req, res) => {
  try {
    const userId = req.userData?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const conversationId = String(req.query?.conversationId || "").trim();

    if (conversationId) {
      const conversation = await ensureConversationMember(conversationId, userId);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found for this user",
        });
      }

      const docs = await messageSchema
        .find({ conversationId: conversation._id })
        .sort("createdAt")
        .lean();
      return res.status(200).json({ success: true, data: docs.map(serializeMessage) });
    }

    const conversations = await conversationSchema
      .find({ participants: asObjectId(userId) })
      .select("_id")
      .lean();
    const conversationIds = conversations.map((item) => item._id);

    const docs = await messageSchema
      .find({ conversationId: { $in: conversationIds } })
      .sort("-createdAt")
      .lean();
    return res.status(200).json({ success: true, data: docs.map(serializeMessage) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const userId = req.userData?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const doc = await messageSchema.findById(req.params.id).lean();
    if (!doc) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    const conversation = await ensureConversationMember(doc.conversationId, userId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    return res.status(200).json({ success: true, data: serializeMessage(doc) });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateById = async (req, res) => {
  try {
    const userId = req.userData?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const existing = await messageSchema.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    const conversation = await ensureConversationMember(existing.conversationId, userId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    const payload = {};
    if (typeof req.body?.isRead === "boolean") {
      payload.isRead = req.body.isRead;
    }
    if (String(existing.senderId) === String(userId) && typeof req.body?.content === "string") {
      payload.content = req.body.content.trim();
    }

    const doc = await messageSchema.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ success: true, data: serializeMessage(doc) });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const removeById = async (req, res) => {
  try {
    const userId = req.userData?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const doc = await messageSchema.findOneAndDelete({
      _id: req.params.id,
      senderId: asObjectId(userId),
    });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    return res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  create,
  list,
  getById,
  updateById,
  removeById,
};
