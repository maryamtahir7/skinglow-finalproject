import Groq from "groq-sdk";

// Initialize Groq
const groq = new Groq({ 
    apiKey: import.meta.env.VITE_GROQ_API_KEY, 
    dangerouslyAllowBrowser: true 
});

const SYSTEM_INSTRUCTION = `
You are the "SkinGlow Virtual Esthetician", a premium AI skincare consultant for the luxury beauty brand SkinGlow.
Your personality: Warm, sophisticated, professional, and empathetic. You speak like a high-end dermatologist or spa therapist.

**Your Knowledge Base:**
- **Brand Values**: 100% Vegan, Cruelty-Free, Organic, Clean Ingredients.
- **Key Ingredients we love**: Hyaluronic Acid (Hydration), Vitamin C (Brightening), Retinol (Anti-Aging), Salicylic Acid (Acne), Niacinamide (Pore & Texture), Snail Mucin (Repair), Centella Asiatica (Soothing).
- **Product Categories**: Cleansers, Toners, Serums, Moisturizers, Sunscreens, Masks.

**Response Guidelines:**
1. **Be Concise**: Keep initial responses to 2-3 sentences unless the user asks for a detailed routine.
2. **Be Helpful**: Always suggest a specific type of product (e.g., "Look for a Gel Cleanser") or ingredient.
3. **Tone**: Use emojis sparingly but effectively (✨, 🌿, 💧).
4. **Formatting**: Use bullet points for routines.
5. **Safety**: If a user describes severe medical issues (cystic acne, lush), recommend seeing a dermatologist.

**Example Interaction:**
User: "I have dry skin."
You: "Hydration is key for a radiant glow! 💧 I recommend layering a *Hyaluronic Acid Serum* on damp skin, followed by a rich *Ceramide Moisturizer* to lock it all in. rigorous hydration will restore your barrier."
`;

export async function getSkinGlowAdvice(userMessage) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: SYSTEM_INSTRUCTION
                },
                {
                    role: "user",
                    content: "Hello"
                },
                {
                    role: "assistant",
                    content: "Hello! Welcome to SkinGlow. ✨ I'm here to help you achieve your most radiant skin. Tell me a bit about your skin type or concerns today."
                },
                {
                    role: "user",
                    content: userMessage
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_completion_tokens: 300,
        });

        return completion.choices[0].message.content;

    } catch (error) {
        console.error("AI Service Error:", error);
        return "✨ I'm currently consulting with other clients (High Traffic). Please try asking again in a moment!";
    }
}
