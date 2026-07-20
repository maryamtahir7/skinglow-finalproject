import fetch from 'node-fetch';

async function test() {
    try {
        console.log("Calling chat API...");
        const res = await fetch('http://localhost:8085/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "Hello", history: [], userId: "123" })
        });
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response:", text);
    } catch (e) {
        console.error(e);
    }
}
test();
