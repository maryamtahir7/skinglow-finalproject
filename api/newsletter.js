import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ message: 'Invalid email address' });
    }

    // Configure Nodemailer with credentials from .env
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    // Email to the user (Welcome)
    const userMailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Welcome to the Inner Circle ✨',
        html: `
            <div style="font-family: sans-serif; background-color: #FDFBF7; padding: 40px; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <h1 style="color: #e11d48; font-family: serif; text-align: center;">Welcome to SkinGlow</h1>
                    <p>Hi there,</p>
                    <p>You're officially on the list! Get ready for expert skincare advice, deep dives into ingredients, and exclusive early access to our newest launches.</p>
                    <p>We're so happy to have you on this journey to radiant skin.</p>
                    <br>
                    <p style="text-align: center;">
                        <a href="http://localhost:5173/products" style="background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Shop The Collection</a>
                    </p>
                    <br>
                    <p style="font-size: 12px; color: #999; text-align: center;">With love,<br>The SkinGlow Team</p>
                </div>
            </div>
        `
    };

    // Email to admin (Notification)
    const adminMailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER, // Send to self
        subject: 'New Newsletter Subscriber! 🎉',
        text: `New subscriber: ${email}`
    };

    try {
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(adminMailOptions);
        console.log(`✅ Newsletter email sent to ${email}`);
        return res.status(200).json({ message: 'Subscribed successfully!' });
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        return res.status(500).json({ message: 'Failed to send email' });
    }
}
