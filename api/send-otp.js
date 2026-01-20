import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"MediStore" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Your Verification Code for MediStore',
        text: `Your OTP is: ${otp}. This code is valid for 5 minutes.`,
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 500px; margin: auto;">
        <h2 style="color: #0d9488; text-align: center;">MediStore Verification</h2>
        <p>Thank you for signing up! Please use the following code to verify your account:</p>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0f172a;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #64748b; text-align: center;">This code will expire in 5 minutes. If you didn't request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">© 2024 MediStore Pharmacy. All rights reserved.</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);

        // Create a JWT token containing the OTP and email (valid for 5 mins)
        const token = jwt.sign({ email, otp }, process.env.JWT_SECRET, { expiresIn: '5m' });

        res.status(200).json({ message: 'OTP sent successfully', token });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
}
