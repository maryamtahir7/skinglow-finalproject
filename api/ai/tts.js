import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

const VOICES = {
    'ur-PK': 'ur-PK-UzmaNeural',     // Female Urdu voice
    'en-US': 'en-US-JennyNeural',     // Female English voice
    'en-GB': 'en-GB-SoniaNeural',     // Female British English voice
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { text, lang = 'en-US' } = req.body;

    if (!text || !text.trim()) {
        return res.status(400).json({ message: 'Text is required' });
    }

    // Detect Urdu script even if lang says en-US
    const isUrdu = /[\u0600-\u06FF]/.test(text) || lang.startsWith('ur');
    const voiceName = isUrdu ? VOICES['ur-PK'] : (VOICES[lang] || VOICES['en-US']);

    try {
        const tts = new MsEdgeTTS();
        await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

        const { audioStream } = tts.toStream(text);

        const audioChunks = [];

        await new Promise((resolve, reject) => {
            audioStream.on('data', (chunk) => {
                if (Buffer.isBuffer(chunk)) {
                    audioChunks.push(chunk);
                } else if (chunk.audio) {
                    audioChunks.push(chunk.audio);
                }
            });
            audioStream.on('end', resolve);
            audioStream.on('error', reject);
            audioStream.on('close', resolve);
        });

        if (audioChunks.length === 0) {
            return res.status(500).json({ message: 'No audio generated' });
        }

        const audioBuffer = Buffer.concat(audioChunks);
        const base64Audio = audioBuffer.toString('base64');

        return res.status(200).json({
            audio: base64Audio,
            contentType: 'audio/mpeg',
            voice: voiceName,
        });
    } catch (error) {
        console.error('TTS Error:', error);
        return res.status(500).json({ message: 'TTS generation failed', error: error.message });
    }
}
