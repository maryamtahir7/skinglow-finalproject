import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { otp, token } = req.body;

    if (!otp || !token) {
        console.log('Missing data in request:', { hasOtp: !!otp, hasToken: !!token });
        return res.status(400).json({ message: 'OTP and token are required' });
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('CRITICAL: JWT_SECRET is not defined in environment variables!');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        console.log('Verifying token...');
        const decoded = jwt.verify(token, secret);
        console.log('Decoded data:', { email: decoded.email, expectedOtp: decoded.otp });
        console.log('User entered OTP:', otp);

        const match = String(decoded.otp).trim() === String(otp).trim();
        console.log('OTP Match Result:', match);

        if (match) {
            res.status(200).json({ message: 'OTP verified successfully', email: decoded.email });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('JWT Verification Error:', error.name, error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'OTP has expired' });
        }
        res.status(400).json({ message: 'Invalid or expired token' });
    }
}
