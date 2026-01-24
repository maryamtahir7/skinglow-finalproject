import Stripe from 'stripe';

export default async ({ req, res, log, error }) => {
    // 1. Initialize Stripe with Secret Key from Environment Variable
    // You MUST set 'STRIPE_SECRET_KEY' in your Appwrite Function Settings
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    try {
        // 2. Parse the request body
        // Appwrite passes body as a string, sometimes JSON parsing is needed
        let payload;
        try {
            payload = JSON.parse(req.body);
        } catch (e) {
            // If it's already an object or simple string
            payload = req.body;
        }

        const { amount, currency = 'pkr' } = payload;

        if (!amount) {
            return res.json({ error: 'Amount is required' }, 400);
        }

        // 3. Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount in lowest denomination (e.g., cents/paisa)
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        log(`Created PaymentIntent: ${paymentIntent.id} for amount: ${amount}`);

        // 4. Return Client Secret to Frontend
        return res.json({
            clientSecret: paymentIntent.client_secret,
            id: paymentIntent.id
        });

    } catch (err) {
        error(err.message);
        return res.json({ error: err.message }, 500);
    }
};
