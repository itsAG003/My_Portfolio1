require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Setup Nodemailer transporter securely using environment variables
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Loaded from .env
        pass: process.env.EMAIL_PASS  // Loaded from .env
    }
});

app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    // ✅ Email to YOUR inbox
    const ownerMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New Contact Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`
    };

    // ✅ Confirmation email back to USER
    const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Thank you for contacting me!",
        text: `Hello ${name},\n\nThank you for reaching out! I have received your message:\n"${message}"\n\nI’ll get back to you soon.\n\nBest regards,\nYour Name`
    };

    try {
        await transporter.sendMail(ownerMailOptions); // Send to you
        await transporter.sendMail(userMailOptions);  // Send confirmation to user

        console.log("✅ Emails sent successfully!");
        res.status(200).send({ success: true });
    } catch (error) {
        console.error("❌ Error sending email:", error);
        res.status(500).send({ success: false, error: "Email failed to send." });
    }
});

app.listen(3000, () => {
    console.log("✅ Server running at http://localhost:3000");
});
