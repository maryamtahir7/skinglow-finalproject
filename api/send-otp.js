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
        from: `"SkinGlow" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: '✨ Your SkinGlow Verification Code',
        text: `Your SkinGlow verification code is: ${otp}. This code is valid for 5 minutes.`,
        html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: linear-gradient(135deg, #fff5f5 0%, #fff0f6 50%, #fdf2f8 100%); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(190, 18, 60, 0.08);">
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #be123c 0%, #e11d48 50%, #f43f5e 100%); padding: 36px 32px 28px; text-align: center;">
          <h1 style="margin: 0 0 4px; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: 2px;">SkinGlow</h1>
          <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.75); letter-spacing: 1px; text-transform: uppercase;">Premium Skincare</p>
        </div>

        <!-- Body -->
        <div style="padding: 36px 32px 28px;">
          <h2 style="margin: 0 0 8px; font-size: 22px; font-weight: 600; color: #1e293b; text-align: center;">Verify Your Email</h2>
          <p style="margin: 0 0 24px; font-size: 15px; color: #64748b; text-align: center; line-height: 1.6;">Welcome to SkinGlow! Use the code below to complete your registration and start your skincare journey.</p>

          <!-- OTP Box -->
          <div style="background: #ffffff; border: 2px solid #fecdd3; border-radius: 16px; padding: 24px; text-align: center; margin: 0 0 24px;">
            <p style="margin: 0 0 8px; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Your Verification Code</p>
            <div style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #be123c; font-family: 'Courier New', monospace;">${otp}</div>
          </div>

          <p style="margin: 0 0 6px; font-size: 13px; color: #94a3b8; text-align: center;">⏱ This code expires in <strong style="color: #64748b;">5 minutes</strong></p>
          <p style="margin: 0; font-size: 12px; color: #cbd5e1; text-align: center;">If you didn't create a SkinGlow account, you can safely ignore this email.</p>
        </div>

        <!-- Footer -->
        <div style="padding: 20px 32px; background: rgba(0,0,0,0.02); border-top: 1px solid #fecdd3; text-align: center;">
          <p style="margin: 0 0 4px; font-size: 12px; color: #94a3b8;">Made with 💖 by the SkinGlow team</p>
          <p style="margin: 0; font-size: 11px; color: #cbd5e1;">© ${new Date().getFullYear()} SkinGlow Skincare. All rights reserved.</p>
        </div>
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
