const nodemailer = require('nodemailer');
const userSchema = require('../controller/user.schema');

const otpStorage = new Map();
const normalizeEmail = (value = '') => String(value).trim().toLowerCase();

let transporter = null;
let mailConfigError = null;

const initializeTransporter = () => {
  try {
    if (!process.env.EMAIL || !process.env.EMAILSECRET) {
      mailConfigError = 'EMAIL or EMAILSECRET is missing in messagemicroservice .env';
      console.log(mailConfigError);
      return;
    }

    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILSECRET,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 90000,
      greetingTimeout: 30000,
      socketTimeout: 90000,
    });

    console.log('Email transporter created successfully');
    console.log(`Using email: ${process.env.EMAIL}`);

    transporter.verify((error) => {
      if (error) {
        mailConfigError = `Email configuration failed: ${error.message}`;
        console.log(mailConfigError);
        return;
      }

      mailConfigError = null;
      console.log('Email server connected successfully');
    });
  } catch (error) {
    mailConfigError = error?.message || 'Email configuration failed';
    console.log('Email configuration test failed', mailConfigError);
  }
};

initializeTransporter();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeOTP(email, otp) {
  const key = normalizeEmail(email);
  const expirytime = Date.now() + 10 * 60 * 1000;
  otpStorage.set(key, {
    otp,
    expirytime,
    attempts: 0,
  });
  return expirytime;
}

const ensureMailReady = () => {
  if (!transporter) {
    throw new Error('Email transporter is not configured. Check EMAIL and EMAILSECRET.');
  }
  if (mailConfigError) {
    throw new Error(mailConfigError);
  }
};

async function sendOTPEMAIL(email, otp) {
  ensureMailReady();

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your one time password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:0;">
        <h2>Your OTP code is</h2>
        <div style="background-color:#13b4ff; padding:20px; text-align:center; border-radius:8px;">
          <h1 style="color:#fff; font-size:36px; margin:0;">${otp}</h1>
        </div>
      </div>
    `,
    text: `Your OTP code is: ${otp}. This code will expire in 10 minutes.`,
  };

  return transporter.sendMail(mailOptions);
}

async function sendEmail(to, subject, htmlContent, textContent) {
  ensureMailReady();

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    html: htmlContent,
    text: textContent,
  };

  return transporter.sendMail(mailOptions);
}

async function sendWelcomeEmail(user) {
  const subject = 'Welcome to Elite Marketplace!';

  const html = `
    <div style="font-family: Arial; max-width:600px;">
      <h2>Welcome ${user.name || ''}</h2>
      <p>Thank you for signing up to <b>Elite Marketplace</b>.</p>
      <p>You can now explore products, shop, and become a seller anytime.</p>
      <br/>
      <p>Happy Shopping!</p>
    </div>
  `;

  const text = 'Welcome to Elite Marketplace!';

  return sendEmail(user.email, subject, html, text);
}

async function sendLoginAlertEmail(user) {
  const subject = 'Login Alert - Elite Marketplace';

  const html = `
    <div style="font-family: Arial;">
      <h2>Hello ${user.name || ''},</h2>
      <p>You just logged into your Elite Marketplace account.</p>
      <p>If this was not you, please reset your password immediately.</p>
      <br/>
      <small>Time: ${new Date().toLocaleString()}</small>
    </div>
  `;

  const text = 'You logged into Elite Marketplace';

  return sendEmail(user.email, subject, html, text);
}

async function sendSellerApprovalEmail(user) {
  const subject = "You're now a seller on Elite Marketplace!";

  const html = `
    <div style="font-family: Arial;">
      <h2>Congratulations ${user.name || ''}</h2>
      <p>Your request to become a seller has been approved.</p>
      <p>You can now list products and start selling.</p>
      <br/>
      <p>We wish you great sales success!</p>
    </div>
  `;

  const text = 'You are now a seller on Elite Marketplace!';

  return sendEmail(user.email, subject, html, text);
}

const toMailUser = (input = {}) => ({
  email: normalizeEmail(input.email),
  name: String(input.name || "").trim(),
});

const validateMailUser = (user = {}) => {
  if (!user.email) return "Email is required";
  return "";
};

async function sendWelcome(req, res) {
  try {
    const user = toMailUser(req.body || {});
    const validationError = validateMailUser(user);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    await sendWelcomeEmail(user);
    return res.status(200).json({
      success: true,
      message: `Welcome email sent to ${user.email}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to send welcome email",
    });
  }
}

async function sendLoginAlert(req, res) {
  try {
    const user = toMailUser(req.body || {});
    const validationError = validateMailUser(user);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    await sendLoginAlertEmail(user);
    return res.status(200).json({
      success: true,
      message: `Login alert email sent to ${user.email}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to send login alert email",
    });
  }
}

async function sendSellerApproval(req, res) {
  try {
    const user = toMailUser(req.body || {});
    const validationError = validateMailUser(user);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    await sendSellerApprovalEmail(user);
    return res.status(200).json({
      success: true,
      message: `Seller approval email sent to ${user.email}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to send seller approval email",
    });
  }
}

async function sendOTP(req, res) {
  try {
    const { email } = req.body || {};
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    const otp = generateOTP();
    storeOTP(normalizedEmail, otp);

    await sendOTPEMAIL(normalizedEmail, otp);

    return res.status(200).json({
      success: true,
      message: `OTP sent to ${normalizedEmail}, expires in 10mins`,
    });
  } catch (error) {
    console.log('send OTP error:', error?.message || error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to send OTP',
    });
  }
}

async function verifyOTP(req, res) {
  try {
    const input = req.body && Object.keys(req.body).length ? req.body : req.query;
    const email = normalizeEmail(input?.email);
    const otp = String(input?.otp || '').trim();

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Email and OTP are required',
      });
    }

    const storeData = otpStorage.get(email);

    if (!storeData) {
      return res.status(400).json({
        success: false,
        error: 'OTP not found or expired',
      });
    }

    if (Date.now() > storeData.expirytime) {
      otpStorage.delete(email);
      return res.status(400).json({
        success: false,
        error: 'OTP has expired',
      });
    }

    if (storeData.otp === otp) {
      const verifyemail = await userSchema.findOne({ email });
      if (verifyemail) {
        verifyemail.isVerified = true;
        await verifyemail.save();
        otpStorage.delete(email);
        return res.status(200).json({
          success: true,
          data: {
            email: verifyemail.email,
            userId: verifyemail._id,
            isVerified: true,
          },
          message: 'Email Verification Successful. Please login.',
        });
      }
      otpStorage.delete(email);
      return res.status(404).json({
        success: false,
        error: 'No account found for this email',
      });
    }

    storeData.attempts += 1;
    if (storeData.attempts >= 3) {
      otpStorage.delete(email);
      return res.status(400).json({
        success: false,
        error: 'Too many attempts. Please request a new otp',
      });
    }

    return res.status(400).json({
      success: false,
      error: 'Invalid OTP',
    });
  } catch (error) {
    console.log('Verification OTP Error', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  sendOTP,
  verifyOTP,
  sendWelcome,
  sendLoginAlert,
  sendSellerApproval,
  sendWelcomeEmail,
  sendLoginAlertEmail,
  sendSellerApprovalEmail,
};
