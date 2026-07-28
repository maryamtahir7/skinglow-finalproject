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
let currentAudio = null;

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

            let sessionStr = '';
            let hasNewFinal = false;
            let hasInterim = false;

            for (let i = 0; i < event.results.length; i++) {
                const result = event.results[i];
                const transcript = getBestAlternative(result);

                if (result.isFinal) {
                    if (i >= lastProcessedIndexRef.current) {
                        lastProcessedIndexRef.current = i + 1;
                        hasNewFinal = true;
                    }
                } else {
                    hasInterim = true;
                }

                const trimmed = transcript.trimStart();
                if (!trimmed) continue;

                const sessionTrimmed = sessionStr.trim();
                
                // Handle Android duplication bug: if the new transcript contains the existing session text
                if (sessionTrimmed && trimmed.toLowerCase().startsWith(sessionTrimmed.toLowerCase())) {
                    sessionStr = transcript + ' ';
                } else {
                    sessionStr += transcript + ' ';
                }
            }

            interimRef.current = sessionStr;

            if (hasNewFinal) {
                scheduleSilenceCommit();
            }
            if (hasInterim) {
                clearSilenceTimer();
            }

            const liveText = `${finalTranscriptRef.current}${sessionStr}`.trim();
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

            // Commit the session string to finalTranscript before restarting
            if (interimRef.current) {
                finalTranscriptRef.current += interimRef.current;
                if (!finalTranscriptRef.current.endsWith(' ')) {
                    finalTranscriptRef.current += ' ';
                }
                interimRef.current = '';
            }
            lastProcessedIndexRef.current = 0;

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
    if (currentAudio) {
        try {
            currentAudio.pause();
            currentAudio.onended = null;
            currentAudio.onerror = null;
        } catch (e) {
            console.error('Error stopping fallback audio:', e);
        }
        currentAudio = null;
    }
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
}

export function isSpeaking() {
    const isSynthSpeaking = window.speechSynthesis?.speaking ?? false;
    const isAudioPlaying = currentAudio ? !currentAudio.paused : false;
    return isSynthSpeaking || isAudioPlaying;
}

function transliterateUrduToDevanagari(text) {
    if (!text) return '';

    // Common words map for high accuracy on common skincare conversation words
    const wordMap = {
        'السلام': 'अस्सलाम',
        'علیکم': 'वालेकुम',
        'وعلیکم': 'वालेकुम',
        'شكریہ': 'शुक्रिया',
        'شکریہ': 'शुक्रिया',
        'خوش': 'खुश',
        'آمدید': 'आमदीद',
        'اللہ': 'अल्लाह',
        'حافظ': 'हाफ़िज़',
        'میں': 'मैं',
        'ہوں': 'हूँ',
        'ہے': 'है',
        'ہیں': 'हैं',
        'کی': 'की',
        'کا': 'का',
        'کے': 'के',
        'کو': 'को',
        'کر': 'कर',
        'اور': 'और',
        'آپ': 'आप',
        'مدد': 'मदद',
        'سکتی': 'सकती',
        'سکتا': 'सकता',
        'کریں': 'करें',
        'نہیں': 'नहीं',
        'تو': 'तो',
        'یہ': 'यह',
        'وہ': 'वह',
        'تھا': 'था',
        'تھی': 'थी',
        'تھے': 'थे',
        'کرنا': 'करना',
        'طرح': 'तरह',
        'بات': 'बात',
        'بولیں': 'बोलें',
        'کیئر': 'केयर',
        'اسکن': 'स्किन',
        'گلو': 'ग्लो',
        'آرڈر': 'ऑर्डर',
        'مصنوعات': 'मसनूआत',
        'رٹین': 'रूटीन',
        'فیس': 'फेस',
        'ماسک': 'मास्क',
        'کریم': 'क्रीम',
        'لوشن': 'लोशन',
        'سیرم': 'सीरम',
        'جلد': 'जिल्द',
        'خشک': 'खुश्क',
        'چکنی': 'चिकनी',
        'حساس': 'हसास',
        'معلومات': 'मालूमात',
        'رہنمائی': 'रहनुमाई',
        'ایسٹھیٹیشن': 'एस्थेटीशियन',
        'وائس': 'वॉइस',
        'ایجنٹ': 'एजेंट',
        'سن': 'सुन',
        'رہی': 'रही',
        'رہا': 'रहा',
        'پوچھیں': 'पूछें',
        'کچھ': 'कुछ',
        'بھی': 'भी',
        'بارے': 'बारे'
    };

    const consonants = {
        'ب': 'ब', 'پ': 'प', 'ت': 'त', 'ٹ': 'ट', 'ث': 'स', 'ج': 'ज', 'چ': 'च',
        'ح': 'ह', 'خ': 'ख़', 'د': 'द', 'ڈ': 'ड', 'ذ': 'ज़', 'ر': 'र', 'ڑ': 'ड़',
        'ز': 'ज़', 'ژ': 'ज़', 'س': 'स', 'ش': 'श', 'ص': 'स', 'ض': 'ज़', 'ط': 'त',
        'ظ': 'ज़', 'ع': 'अ', 'غ': 'ग़', 'ف': 'फ़', 'ق': 'क़', 'ک': 'क', 'گ': 'ग',
        'ل': 'ल', 'م': 'म', 'ن': 'न', 'ہ': 'ह', 'ھ': 'ह'
    };

    const vowelsMap = {
        'ا': 'ा', 'ی': 'ी', 'ے': 'े', 'و': 'ो'
    };

    let words = text.split(/\s+/);
    let mappedWords = words.map(word => {
        if (/^[a-zA-Z0-9.,!?'-]+$/.test(word)) {
            return word;
        }

        let cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()۔؟]/g, "");
        if (wordMap[cleanWord]) {
            return word.replace(cleanWord, wordMap[cleanWord]);
        }

        let devanagari = '';
        let i = 0;
        while (i < word.length) {
            let char = word[i];
            let nextChar = word[i + 1] || '';

            if (nextChar === 'ھ') {
                const aspirates = {
                    'ب': 'भ', 'پ': 'फ', 'ت': 'थ', 'ٹ': 'ठ', 'ج': 'झ', 'چ': 'छ',
                    'د': 'ध', 'ڈ': 'ढ', 'ر': 'र्ह', 'ڑ': 'ढ़', 'ک': 'ख', 'گ': 'घ'
                };
                if (aspirates[char]) {
                    devanagari += aspirates[char];
                    i += 2;
                    continue;
                }
            }

            if (consonants[char]) {
                let devCons = consonants[char];
                if (vowelsMap[nextChar]) {
                    devanagari += devCons + vowelsMap[nextChar];
                    i += 2;
                } else {
                    devanagari += devCons;
                    i++;
                }
            } else {
                const independentVowels = {
                    'ا': 'अ', 'آ': 'आ', 'ی': 'ई', 'ے': 'ए', 'و': 'ऊ', 'ں': 'ं', '۔': '।', '؟': '?'
                };
                devanagari += independentVowels[char] || char;
                i++;
            }
        }
        return devanagari;
    });

    return mappedWords.join(' ');
}

function prepareUrduPronunciation(text) {
    if (!text) return '';
    let processed = text;
    
    const pronunciationMap = [
        [/\bSkinGlow\b/gi, 'اسکن گلو'],
        [/\bskin\s*glow\b/gi, 'اسکن گلو'],
        [/\bspf\b/gi, 'ایس پی ایف'],
        [/\bvitamin\s*c\b/gi, 'وٹامن سی'],
        [/\bvitamin\s*e\b/gi, 'وٹامن ای'],
        [/\bvitamin\s*a\b/gi, 'وٹامن اے'],
        [/\bvitamin\b/gi, 'وٹامن'],
        [/\bretinol\b/gi, 'ریٹینول'],
        [/\bhyaluronic\s*acid\b/gi, 'ہائلورونک ایسڈ'],
        [/\bsalicylic\s*acid\b/gi, 'سیلی سیلک ایسڈ'],
        [/\bniacinamide\b/gi, 'نیاسینامائڈ'],
        [/\bmoisturizer\b/gi, 'مائسچرائزر'],
        [/\bsunscreen\b/gi, 'سن اسکرین'],
        [/\bserum\b/gi, 'سیرم'],
        [/\bserums\b/gi, 'سیرمز'],
        [/\broutine\b/gi, 'روٹین'],
        [/\btoner\b/gi, 'ٹونر'],
        [/\bcleanser\b/gi, 'کلینزر'],
        [/\bacne\b/gi, 'ایکنی'],
        [/\bskin\b/gi, 'اسکن'],
        [/\bglow\b/gi, 'گلو'],
        [/\bcream\b/gi, 'کریم'],
        [/\bface\b/gi, 'فیس'],
        [/\bgel\b/gi, 'جیل'],
        [/\boily\b/gi, 'آئیلی'],
        [/\bdry\b/gi, 'ڈرائی'],
        [/\bpeeling\b/gi, 'پیلنگ'],
        [/\bscrub\b/gi, 'اسکرب'],
        [/\bmask\b/gi, 'ماسک'],
        [/\btoners\b/gi, 'ٹونرز'],
        [/\bcleansers\b/gi, 'کلینزرز'],
        [/\bmoisturizers\b/gi, 'مائسچرائزرز'],
        [/\bsunscreens\b/gi, 'سن اسکرینز']
    ];

    for (const [pattern, replacement] of pronunciationMap) {
        processed = processed.replace(pattern, replacement);
    }
    return processed;
}

// Speak text aloud with a clear, professional female voice
export async function speakText(text, lang = 'en-US', { onStart, onEnd } = {}) {
    let cleanText = prepareTextForSpeech(text);
    if (!cleanText) return;

    stopSpeaking();

    const isUrdu = /[\u0600-\u06FF]/.test(cleanText) || lang.startsWith('ur');
    const targetLang = isUrdu ? 'ur-PK' : lang;

    if (isUrdu) {
        cleanText = prepareUrduPronunciation(cleanText);
    }

    // Try server-side Microsoft Edge Neural TTS (high-quality female voices)
    let audioSrc = null;
    let contentType = 'audio/mpeg';

    onStart?.();

    // 1. Try relative path (Vite proxy / production same-origin)
    try {
        const apiBase = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${apiBase}/api/ai/tts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: cleanText, lang: targetLang }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.audio) {
                audioSrc = `data:${data.contentType || 'audio/mpeg'};base64,${data.audio}`;
                contentType = data.contentType || 'audio/mpeg';
            }
        }
    } catch (err) {
        console.warn('Relative Edge TTS fetch failed:', err.message);
    }

    // 2. Try direct localhost backend URL as fallback (in case proxy is inactive in preview/custom servers)
    if (!audioSrc) {
        try {
            const response = await fetch(`http://localhost:8085/api/ai/tts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: cleanText, lang: targetLang }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.audio) {
                    audioSrc = `data:${data.contentType || 'audio/mpeg'};base64,${data.audio}`;
                    contentType = data.contentType || 'audio/mpeg';
                }
            }
        } catch (err) {
            console.warn('Direct local Edge TTS fetch failed:', err.message);
        }
    }

    // 3. Play audio if loaded successfully
    if (audioSrc) {
        try {
            const audio = new Audio(audioSrc);
            currentAudio = audio;

            audio.onended = () => {
                currentAudio = null;
                onEnd?.();
            };
            audio.onerror = () => {
                currentAudio = null;
                console.warn('Edge TTS audio playback failed, falling back to native TTS');
                speakNative(cleanText, targetLang, { onEnd });
            };

            await audio.play();
            return;
        } catch (playErr) {
            console.warn('Edge TTS audio play failed, falling back to native:', playErr.message);
        }
    }

    // Fallback to native browser TTS if server-side TTS fails
    await speakNative(cleanText, targetLang, { onEnd });
}

async function speakNative(cleanText, targetLang, { onStart, onEnd } = {}) {
    if (!window.speechSynthesis) {
        onEnd?.();
        return;
    }
    
    await ensureVoicesReady();
    const isUrdu = targetLang.startsWith('ur');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = targetLang;
    utterance.rate = isUrdu ? 0.85 : 0.92;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    const femaleVoice = getFemaleVoice(targetLang);
    if (femaleVoice) utterance.voice = femaleVoice;

    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();

    window.speechSynthesis.speak(utterance);
}
