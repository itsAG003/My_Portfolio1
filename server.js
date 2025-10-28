// ✅ Load environment variables


require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

// ✅ Middlewares
app.use(cors({
    origin: "https://YOUR_USERNAME.github.io", // ← replace with your actual GitHub Pages domain
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.static("public")); // Serves your frontend files (index.html, etc.)

// ✅ Setup Nodemailer transporter using secure environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // from .env
    pass: process.env.EMAIL_PASS  // from .env
  }
});

// ✅ Contact form endpoint
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "All fields are required." });
  }

  // Email to yourself
  const ownerMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Contact Message from ${name}`,
    text: `📩 New message received:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  };

  // Confirmation email to the user
  const userMailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "✅ Thanks for contacting me!",
    text: `Hi ${name},\n\nThank you for reaching out! I've received your message:\n"${message}"\n\nI'll get back to you soon.\n\nBest regards,\nAditya Gupta`
  };

  try {
    // Send both emails in parallel
    await Promise.all([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    console.log("✅ Emails sent successfully!");
    res.status(200).json({ success: true, message: "Emails sent successfully." });

  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ success: false, error: "Failed to send email. Please try again later." });
  }
});

// ✅ Use Render's dynamic port (important)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
