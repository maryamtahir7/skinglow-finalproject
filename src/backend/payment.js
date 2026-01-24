// src/backend/payment.js
import { Client, Functions } from "appwrite";

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const functions = new Functions(client);

/**
 * Creates a Stripe PaymentIntent via Appwrite Function
 * @param {number} amount - Amount in cents (or smallest currency unit)
 * @param {string} currency - e.g., 'pkr', 'usd'
 */
export async function createPaymentIntent(amount, currency = 'pkr') {
    // In a real scenario, we call an Appwrite Function (cloud backend)
    // because interacting with Stripe Secret Key MUST happen on the server.

    // Example:
    /*
    const response = await functions.createExecution(
        'create-payment-intent', // Function ID
        JSON.stringify({ amount, currency })
    );
    return JSON.parse(response.response).clientSecret;
    */

    // FOR DEMO: Since we don't have a live backend function yet, 
    // and we can't use the Secret Key on the frontend,
    // we will simulate the "clientSecret" creation if we were using a fake/test mode
    // OR we just return a placeholder. With Stripe.js, you usually NEED the real clientSecret 
    // from the backend to render the PaymentElement correctly.

    // CRITICAL: Without a backend, we cannot generate a real clientSecret.
    // However, I will construct a call structure assuming the function exists.
    // If the user doesn't have the backend set up, this will fail.

    // To make this "work" for the user *visually* without a backend, 
    // we might have to use the legacy "CardElement" which doesn't strictly adhere to 
    // PaymentIntent first flow, OR we just show the UI.

    // But the user asked for "Real Manner". So:
    try {
        const execution = await functions.createExecution(
            '6974f69e0006944e2c52',
            JSON.stringify({ amount, currency })
        );

        if (execution.status === 'completed') {
            const data = JSON.parse(execution.responseBody);
            return data.clientSecret;
        } else {
            throw new Error('Transaction failed initialization');
        }
    } catch (e) {
        console.error("Payment Intent Error Details:", e);
        throw e; // Throw the real error so frontend can see it
    }
}
