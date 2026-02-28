const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = require("./user.schema");
const adminSchema = require("../admins/admin.schema");
const sellerSchema = require("../sellers/seller.schema");

const signAccessToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      email: user.email,
      roles: user.roles,
    },
    process.env.JWT_SECRETE || "dev-secret",
    { expiresIn: process.env.JWT_EXPIRE || "30d" }
  );

const toAuthUser = (user) => ({
  userId: user._id,
  name: user.name,
  email: user.email,
  roles: user.roles,
});

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "name, email and password are required" });
    }

    const existing = await userSchema.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await userSchema.create({
      name,
      email,
      password: hashPassword,
      roles: ["buyer"],
    });

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        roles: user.roles,
      },
      process.env.JWT_SECRETE || "dev-secret",
      { expiresIn: process.env.JWT_EXPIRE || "30d" }
    );

    return res.status(201).json({
      success: true,
      data: {
        accessToken: token,
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
          roles: user.roles,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (user.roles.includes("admin")) {
      return res.status(403).json({
        success: false,
        message: "Admin account must use /auth/admin/login",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        roles: user.roles,
      },
      process.env.JWT_SECRETE || "dev-secret",
      { expiresIn: process.env.JWT_EXPIRE || "30d" }
    );

    return res.status(200).json({
      success: true,
      message: "login Successfully",
      data: {
        accessToken: token,
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
          roles: user.roles,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.roles.includes("admin")) {
      return res.status(403).json({ success: false, message: "Access denied. Admin only." });
    }

    const admin = await adminSchema.findOne({ user: user._id, isActive: true });
    if (!admin) {
      return res.status(403).json({ success: false, message: "Admin account not active" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        roles: user.roles,
        adminRole: admin.role,
        permissions: admin.permissions || [],
      },
      process.env.JWT_SECRETE || "dev-secret",
      { expiresIn: process.env.JWT_EXPIRE || "30d" }
    );

    admin.lastLogin = new Date();
    await admin.save();

    return res.status(200).json({
      success: true,
      data: {
        accessToken: token,
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          adminRole: admin.role,
          permissions: admin.permissions || [],
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const upgradeToSeller = async (req, res) => {
  try {
    const userId = req.userData?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      storeName,
      storeDescription,
      contactPhone,
      businessAddress,
      paymentDetails,
      idNumber,
    } = req.body || {};

    if (!storeName || typeof storeName !== "string" || !storeName.trim()) {
      return res.status(400).json({ success: false, message: "storeName is required" });
    }
    if (!contactPhone || typeof contactPhone !== "string" || !contactPhone.trim()) {
      return res.status(400).json({ success: false, message: "contactPhone is required" });
    }
    if (!paymentDetails || typeof paymentDetails !== "string" || !paymentDetails.trim()) {
      return res.status(400).json({ success: false, message: "paymentDetails is required" });
    }
    if (!idNumber || typeof idNumber !== "string" || !idNumber.trim()) {
      return res.status(400).json({ success: false, message: "idNumber is required" });
    }

    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const trimmedStoreName = storeName.trim();
    const trimmedDescription =
      typeof storeDescription === "string" ? storeDescription.trim() : "";
    const normalizedPayload = {
      storeName: trimmedStoreName,
      contactPhone: contactPhone.trim(),
      businessAddress: typeof businessAddress === "string" ? businessAddress.trim() : "",
      paymentDetails: paymentDetails.trim(),
      idNumber: idNumber.trim(),
      verificationNotes: trimmedDescription,
    };

    let sellerApplication = await sellerSchema.findOne({ user: user._id });

    if (!sellerApplication) {
      sellerApplication = await sellerSchema.create({
        user: user._id,
        ...normalizedPayload,
        status: "pending",
      });
      return res.status(200).json({
        success: true,
        message: "Seller application submitted. Waiting for admin approval.",
        data: {
          user: toAuthUser(user),
          sellerApplication,
        },
      });
    }

    if (sellerApplication.status === "approved") {
      const roles = Array.isArray(user.roles) ? user.roles : [];
      if (!roles.includes("seller")) {
        user.roles = [...new Set([...roles, "seller"])];
        await user.save();
      }
      const accessToken = signAccessToken(user);
      return res.status(200).json({
        success: true,
        message: "Seller account already approved.",
        data: {
          accessToken,
          user: toAuthUser(user),
          sellerApplication,
        },
      });
    }

    sellerApplication.storeName = normalizedPayload.storeName;
    sellerApplication.contactPhone = normalizedPayload.contactPhone;
    sellerApplication.businessAddress = normalizedPayload.businessAddress;
    sellerApplication.paymentDetails = normalizedPayload.paymentDetails;
    sellerApplication.idNumber = normalizedPayload.idNumber;
    sellerApplication.verificationNotes = normalizedPayload.verificationNotes;

    if (sellerApplication.status === "rejected") {
      sellerApplication.status = "pending";
    }

    await sellerApplication.save();

    return res.status(200).json({
      success: true,
      message:
        sellerApplication.status === "pending"
          ? "Seller application submitted. Waiting for admin approval."
          : "Seller application updated.",
      data: {
        user: toAuthUser(user),
        sellerApplication,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getSellerApplicationStatus = async (req, res) => {
  try {
    const userId = req.userData?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const sellerApplication = await sellerSchema.findOne({ user: user._id });

    if (!sellerApplication) {
      return res.status(200).json({
        success: true,
        data: {
          user: toAuthUser(user),
          sellerApplication: null,
        },
      });
    }

    let roleChanged = false;
    const currentRoles = Array.isArray(user.roles) ? user.roles : [];
    if (sellerApplication.status === "approved" && !currentRoles.includes("seller")) {
      user.roles = [...new Set([...currentRoles, "seller"])];
      await user.save();
      roleChanged = true;
    }

    const responseData = {
      user: toAuthUser(user),
      sellerApplication,
    };

    if (roleChanged) {
      responseData.accessToken = signAccessToken(user);
    }

    return res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  adminLogin,
  upgradeToSeller,
  getSellerApplicationStatus,
};

