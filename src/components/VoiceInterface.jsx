import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

const PROFESSIONAL_FEMALE_VOICES = [
    /microsoft.*zira/i,
    /google.*english.*female/i,
    /google.*us.*english.*female/i,
    /jenny/i,
    /aria/i,
    /samantha/i,
    /natural.*female/i,
    /neural.*female/i,
    /premium.*female/i,
    /karen/i,
    /victoria/i,
    /fiona/i,
    /tessa/i,
    /zira/i,
    /susan/i,
    /hazel/i,
];
const FEMALE_VOICE_PATTERNS = [
    /female/i, /woman/i, /zira/i, /samantha/i, /karen/i, /victoria/i,
    /fiona/i, /tessa/i, /moira/i, /susan/i, /hazel/i, /heera/i, /veena/i,
    /jenny/i, /aria/i,
];
const MALE_VOICE_PATTERNS = [
    /male/i, /man\b/i, /david/i, /mark\b/i, /james/i, /daniel/i, /guy/i, /rishi/i,
];

let voicesCache = null;

function loadVoices() {
    if (!window.speechSynthesis) return [];
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) voicesCache = voices;
    return voices;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = () => {
        voicesCache = window.speechSynthesis.getVoices();
    };
}

function getFemaleVoice(lang = 'en-US') {
    const voices = voicesCache?.length ? voicesCache : loadVoices();
    if (!voices.length) return null;

    const langPrefix = lang.split('-')[0];
    const inLang = voices.filter((v) => v.lang.startsWith(langPrefix));

    for (const pattern of PROFESSIONAL_FEMALE_VOICES) {
        const match = inLang.find((v) => pattern.test(v.name));
        if (match) return match;
    }

    const femaleInLang = inLang.find(
        (v) => FEMALE_VOICE_PATTERNS.some((p) => p.test(v.name))
    );
    if (femaleInLang) return femaleInLang;

    const nonMaleInLang = inLang.find(
        (v) => !MALE_VOICE_PATTERNS.some((p) => p.test(v.name))
    );
    if (nonMaleInLang) return nonMaleInLang;

    const anyFemale = voices.find((v) => FEMALE_VOICE_PATTERNS.some((p) => p.test(v.name)));
    if (anyFemale) return anyFemale;

    return inLang[0] || voices[0];
}

/** Strip markdown, bullets, emojis — return only readable plain text for TTS */
export function prepareTextForSpeech(text) {
    if (!text) return '';

    let cleaned = String(text);

    cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
    cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    cleaned = cleaned.replace(/https?:\/\/\S+/g, '');

    cleaned = cleaned.replace(/\*\*\*([^*]+)\*\*\*/g, '$1');
    cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
    cleaned = cleaned.replace(/\*([^*\n]+)\*/g, '$1');
    cleaned = cleaned.replace(/__([^_]+)__/g, '$1');
    cleaned = cleaned.replace(/_([^_\n]+)_/g, '$1');

    cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');
    cleaned = cleaned.replace(/^[\s]*[-*+•]\s+/gm, '');
    cleaned = cleaned.replace(/^[\s]*\d+[.)]\s+/gm, '');

    cleaned = cleaned.replace(/\*+/g, '');
    cleaned = cleaned.replace(/#+/g, '');
    cleaned = cleaned.replace(/>/g, '');
    cleaned = cleaned.replace(/^[-_]{3,}$/gm, '');

    cleaned = cleaned.replace(
        /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1FA00}-\u{1FAFF}\u{1F1E0}-\u{1F1FF}]/gu,
        ''
    );

    cleaned = cleaned.replace(/\n+/g, '. ');
    cleaned = cleaned.replace(/\s+/g, ' ');
    cleaned = cleaned.replace(/\.{2,}/g, '.');
    cleaned = cleaned.replace(/\s+\./g, '.');
    cleaned = cleaned.replace(/\.\s*\./g, '.');
    cleaned = cleaned.replace(/[,;]\s*[,;]+/g, ', ');

    return cleaned.trim();
}

/** Post-process speech transcript for clearer, skincare-aware text */
export function postProcessTranscript(text) {
    if (!text) return '';

    let cleaned = String(text).trim();

    const skincareFixes = [
        [/\breti\s*nal\b/gi, 'retinol'],
        [/\bhyaluronic\s*acid\b/gi, 'hyaluronic acid'],
        [/\bniacin\s*amide\b/gi, 'niacinamide'],
        [/\bsalicylic\s*acid\b/gi, 'salicylic acid'],
        [/\bglycolic\s*acid\b/gi, 'glycolic acid'],
        [/\blactic\s*acid\b/gi, 'lactic acid'],
        [/\bvitamin\s*see\b/gi, 'vitamin C'],
        [/\bvitamin\s*c\b/gi, 'vitamin C'],
        [/\bvitamin\s*e\b/gi, 'vitamin E'],
        [/\bsun\s*screen\b/gi, 'sunscreen'],
        [/\bmoisturiser\b/gi, 'moisturizer'],
        [/\bmoisturize\b/gi, 'moisturize'],
        [/\bexfoliat(?:or|e|ing)\b/gi, (m) => m.toLowerCase()],
        [/\bcleans(?:er|ing)\b/gi, (m) => m.toLowerCase()],
        [/\bspf\s*(\d+)/gi, 'SPF $1'],
        [/\bskin\s*glow\b/gi, 'SkinGlow'],
        [/\bacne\s*marks?\b/gi, 'acne marks'],
        [/\bdark\s*spots?\b/gi, 'dark spots'],
        [/\bpigmentation\b/gi, 'pigmentation'],
        [/\banti[\s-]?aging\b/gi, 'anti-aging'],
    ];

    for (const [pattern, replacement] of skincareFixes) {
        cleaned = cleaned.replace(pattern, replacement);
    }

    cleaned = cleaned.replace(/\s+/g, ' ');
    cleaned = cleaned.replace(/\s+([,.!?])/g, '$1');
    cleaned = cleaned.replace(/([.!?])\s*([a-z])/g, (_, punct, letter) => `${punct} ${letter.toUpperCase()}`);
    cleaned = cleaned.replace(/^([a-z])/, (_, letter) => letter.toUpperCase());

    return cleaned.trim();
}

function getBestAlternative(result) {
    let best = result[0];
    for (let i = 1; i < result.length; i++) {
        const alt = result[i];
        if (alt.confidence > best.confidence) {
            best = alt;
        } else if (alt.confidence === best.confidence && alt.transcript.length > best.transcript.length) {
            best = alt;
        }
    }
    return best.transcript;
}

function getSpeechRecognition() {
    return window.SpeechRecognition || window.webkitSpeechRecognition;
}

function ensureVoicesReady() {
    return new Promise((resolve) => {
        const voices = loadVoices();
        if (voices.length) {
            resolve(voices);
            return;
        }
        const timeout = setTimeout(() => resolve(loadVoices()), 400);
        window.speechSynthesis.onvoiceschanged = () => {
            clearTimeout(timeout);
            window.speechSynthesis.onvoiceschanged = null;
            resolve(loadVoices());
        };
    });
}

export default function VoiceInterface({
    onResult,
    onInterim,
    onFinalUtterance,
    onError,
    disabled = false,
    lang = 'en-US',
    agentMode = false,
    paused = false,
}) {
    const [isListening, setIsListening] = useState(false);
    const [interimText, setInterimText] = useState('');
    const recognitionRef = useRef(null);
    const listeningRef = useRef(false);
    const finalTranscriptRef = useRef('');
    const interimRef = useRef('');
    const lastProcessedIndexRef = useRef(0);
    const silenceTimerRef = useRef(null);
    const pausedRef = useRef(paused);
    const agentModeRef = useRef(agentMode);

    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);

    useEffect(() => {
        agentModeRef.current = agentMode;
    }, [agentMode]);

    const clearSilenceTimer = () => {
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }
    };

    const emitUtterance = () => {
        clearSilenceTimer();
        const cleaned = postProcessTranscript(
            `${finalTranscriptRef.current}${interimRef.current}`.trim()
        );
        finalTranscriptRef.current = '';
        interimRef.current = '';
        setInterimText('');

        if (!cleaned) return;

        if (agentModeRef.current && onFinalUtterance) {
            onFinalUtterance(cleaned);
        } else if (onResult) {
            onResult(cleaned);
        }
    };

    const scheduleSilenceCommit = () => {
        if (!agentModeRef.current) return;
        clearSilenceTimer();
        silenceTimerRef.current = setTimeout(() => {
            if (pausedRef.current) return;
            const pending = `${finalTranscriptRef.current}${interimRef.current}`.trim();
            if (pending) emitUtterance();
        }, 1400);
    };

    const finishListening = ({ sendResult = true } = {}) => {
        clearSilenceTimer();
        listeningRef.current = false;
        setIsListening(false);
        setInterimText('');

        const cleaned = postProcessTranscript(
            `${finalTranscriptRef.current}${interimRef.current}`.trim()
        );
        finalTranscriptRef.current = '';
        interimRef.current = '';

        if (sendResult && cleaned) {
            if (agentModeRef.current && onFinalUtterance) {
                onFinalUtterance(cleaned);
            } else if (onResult) {
                onResult(cleaned);
            }
        }
    };

    const teardownRecognition = (recognition) => {
        if (!recognition) return;
        recognition.onend = null;
        recognition.onresult = null;
        recognition.onerror = null;
        try {
            recognition.abort();
        } catch {
            try {
                recognition.stop();
            } catch {
                // ignore
            }
        }
    };

    const startListening = () => {
        if (pausedRef.current || disabled) return;

        const SpeechRecognition = getSpeechRecognition();
        if (!SpeechRecognition) {
            onError?.('Speech recognition is not supported. Please use Chrome or Edge.');
            alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
            return;
        }

        if (recognitionRef.current) {
            const oldRecognition = recognitionRef.current;
            recognitionRef.current = null;
            teardownRecognition(oldRecognition);
        }

        finalTranscriptRef.current = '';
        interimRef.current = '';
        lastProcessedIndexRef.current = 0;
        setInterimText('');
        clearSilenceTimer();

        const recognition = new SpeechRecognition();
        recognition.lang = lang;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 5;

        recognition.onresult = (event) => {
            if (pausedRef.current) return;

            let interimStr = '';
            let newFinalStr = '';
            let hasNewFinal = false;

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                const transcript = getBestAlternative(result);

                if (result.isFinal) {
                    // Only process if we haven't seen this final index yet
                    if (i >= lastProcessedIndexRef.current) {
                        newFinalStr += `${transcript} `;
                        lastProcessedIndexRef.current = i + 1;
                        hasNewFinal = true;
                    }
                } else {
                    interimStr += transcript;
                }
            }

            if (newFinalStr) {
                finalTranscriptRef.current += newFinalStr;
            }
            interimRef.current = interimStr;

            if (hasNewFinal) {
                scheduleSilenceCommit();
            }
            if (interimStr) {
                clearSilenceTimer();
            }

            const liveText = `${finalTranscriptRef.current}${interimStr}`.trim();
            setInterimText(liveText);
            onInterim?.(liveText);
        };

        recognition.onerror = (event) => {
            if (event.error === 'no-speech') return;
            if (event.error === 'aborted') return;

            const messages = {
                'not-allowed': 'Microphone access denied. Please allow microphone permission.',
                network: 'Network error. Check your internet connection and try again.',
                'audio-capture': 'No microphone found. Please connect a microphone.',
            };

            const message = messages[event.error] || 'Could not recognize speech. Please try again.';
            onError?.(message);
            console.error('Speech recognition error:', event.error);

            if (recognitionRef.current === recognition) {
                recognitionRef.current = null;
            }
            teardownRecognition(recognition);
            finishListening({ sendResult: false });
        };

        recognition.onend = () => {
            if (!listeningRef.current || recognitionRef.current !== recognition) {
                return;
            }
            if (pausedRef.current) return;

            try {
                recognition.start();
            } catch {
                if (recognitionRef.current === recognition) {
                    recognitionRef.current = null;
                }
                finishListening({ sendResult: false });
            }
        };

        recognitionRef.current = recognition;
        listeningRef.current = true;
        setIsListening(true);

        try {
            recognition.start();
        } catch {
            onError?.('Could not start microphone. Please try again.');
            finishListening({ sendResult: false });
        }
    };

    const stopListening = ({ sendResult = true } = {}) => {
        clearSilenceTimer();
        listeningRef.current = false;
        setIsListening(false);
        setInterimText('');

        const recognition = recognitionRef.current;
        recognitionRef.current = null;
        teardownRecognition(recognition);

        if (!sendResult) {
            finalTranscriptRef.current = '';
            interimRef.current = '';
            return;
        }

        const cleaned = postProcessTranscript(
            `${finalTranscriptRef.current}${interimRef.current}`.trim()
        );
        finalTranscriptRef.current = '';
        interimRef.current = '';

        if (cleaned) {
            if (agentModeRef.current && onFinalUtterance) {
                onFinalUtterance(cleaned);
            } else if (onResult) {
                onResult(cleaned);
            }
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening({ sendResult: !agentMode });
        } else {
            startListening();
        }
    };

    // Agent mode: auto-start when not paused; pause/resume with TTS/loading
    useEffect(() => {
        if (!agentMode) return undefined;

        if (paused || disabled) {
            if (listeningRef.current) {
                stopListening({ sendResult: false });
            }
            return undefined;
        }

        if (!listeningRef.current) {
            startListening();
        }

        return undefined;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [agentMode, paused, disabled]);

    // Leave agent mode → stop mic
    useEffect(() => {
        if (!agentMode && listeningRef.current) {
            stopListening({ sendResult: false });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [agentMode]);

    useEffect(() => {
        return () => {
            clearSilenceTimer();
            listeningRef.current = false;
            const recognition = recognitionRef.current;
            recognitionRef.current = null;
            teardownRecognition(recognition);
        };
    }, []);

    if (agentMode) {
        return (
            <div className="ai-voice-agent-mic">
                <div className={`ai-voice-agent-orb ${isListening && !paused ? 'ai-voice-agent-orb--live' : ''} ${paused ? 'ai-voice-agent-orb--paused' : ''}`}>
                    <Mic className="w-5 h-5" />
                </div>
                <span className="ai-voice-agent-mic__label">
                    {paused ? 'AI speaking…' : isListening ? (interimText || 'Listening…') : 'Starting mic…'}
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <button
                type="button"
                onClick={toggleListening}
                disabled={disabled}
                title={isListening ? 'Stop listening' : 'Speak to SkinGlow AI'}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95 ${
                    isListening
                        ? 'bg-red-500 text-white animate-pulse hover:bg-red-600 ring-4 ring-red-200'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            {isListening && (
                <span className="text-[9px] font-semibold text-red-500 uppercase tracking-wide animate-pulse whitespace-nowrap">
                    {interimText ? 'Listening...' : 'Speak now'}
                </span>
            )}
        </div>
    );
}

export function stopSpeaking() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
}

export function isSpeaking() {
    return window.speechSynthesis?.speaking ?? false;
}

// Speak text aloud with a clear, professional female voice
export async function speakText(text, lang = 'en-US', { onStart, onEnd } = {}) {
    if (!window.speechSynthesis) return;

    const cleanText = prepareTextForSpeech(text);
    if (!cleanText) return;

    window.speechSynthesis.cancel();
    await ensureVoicesReady();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    const femaleVoice = getFemaleVoice(lang);
    if (femaleVoice) utterance.voice = femaleVoice;

    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();

    window.speechSynthesis.speak(utterance);
}
