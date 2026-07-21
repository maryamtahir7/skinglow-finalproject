// src/backend/payment.js

export async function createPaymentIntent(amount, currency = 'pkr') {

    console.warn("Payment integration is mocked.");

    // Returning a dummy client secret
    return "pi_dummy_secret_123456789";
}
