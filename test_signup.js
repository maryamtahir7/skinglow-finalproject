import fetch from 'node-fetch';

async function test() {
    try {
        console.log("Calling db-proxy API for signup...");
        const res = await fetch('http://localhost:8085/api/db-proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'signup', payload: { email: 'mock2@google.com', password: 'password', name: 'Google Mock User' } })
        });
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response:", text);
    } catch (e) {
        console.error(e);
    }
}
test();
