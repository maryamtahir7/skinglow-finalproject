import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, email, subject, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({ message: 'Email and Message are required' });
    }

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    // 1. Email to Admin (You)
    const adminMailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER, // Send to self
        replyTo: email,
        subject: `New Contact Message: ${subject || 'No Subject'}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px;">
                <h2>New Message from ${name || 'User'}</h2>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Topic:</strong> ${subject}</p>
                <hr />
                <p><strong>Message:</strong></p>
                <p style="background: #f4f4f4; padding: 15px; border-radius: 8px;">${message}</p>
            </div>
        `
    };

    // 2. Auto-reply to User
    const userMailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'We received your message ✨',
        html: `
            <div style="font-family: sans-serif; background-color: #FFFBF5; padding: 40px; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <h1 style="color: #e11d48; font-family: serif; text-align: center;">SkinGlow Concierge</h1>
                    <p>Hi ${name || 'there'},</p>
                    <p>Thank you for reaching out! We have received your message regarding "<strong>${subject || 'General Inquiry'}</strong>".</p>
                    <p>Our team is reviewing your inquiry and will get back to you within 24 hours.</p>
                    <br>
                    <p style="font-size: 12px; color: #999; text-align: center;">With love,<br>The SkinGlow Team</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);
        console.log(`✅ Contact email processed for ${email}`);
        return res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('❌ Contact email failed:', error);
        return res.status(500).json({ message: 'Failed to send email' });
    }
}
