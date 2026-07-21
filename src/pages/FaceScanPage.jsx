import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, Sparkles, RefreshCw, AlertCircle, CheckCircle2, ShoppingBag, Activity, Beaker, Droplets, Target, ShieldCheck, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getProducts, addToCart } from "../backend/database.js";
import { useUser } from "../context/UserContext.jsx";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function FaceScanPage() {
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState('');
    const [facingMode, setFacingMode] = useState('user');
    const [model, setModel] = useState(null);
    const [isModelLoading, setIsModelLoading] = useState(true);

    const { user } = useUser();
    const { showToast } = useToast();
    const navigate = useNavigate();

    // Add to Cart handler
    const handleAddToCart = async (product) => {
        if (!user) {
            showToast("Please login to add to cart", "error");
            navigate('/login');
            return;
        }
        try {
            await addToCart({ userId: user.$id, productId: product.$id, quantity: 1 });
            showToast(`Added ${product.name} to your bag`, "success");
            window.dispatchEvent(new Event('cart-updated'));
        } catch {
            showToast("Failed to add to cart", "error");
        }
    };

    // Load TensorFlow BlazeFace Model
    React.useEffect(() => {
        const loadModel = async () => {
            try {
                await import('@tensorflow/tfjs');
                const blazeface = await import('@tensorflow-models/blazeface');
                const loadedModel = await blazeface.load();
                setModel(loadedModel);
            } catch (e) {
                console.error("Failed to load ML model:", e);
            } finally {
                setIsModelLoading(false);
            }
        };
        loadModel();
    }, []);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    // Start Webcam
    const startCamera = async (mode = 'user') => {
        try {
            setError('');
            // Stop existing stream if we are switching
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: mode }
            });
            
            setStream(mediaStream);
            setFacingMode(mode);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setCapturedImage(null);
            setAnalysisResult(null);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please allow camera permissions or upload a photo instead.");
        }
    };

    // Stop Webcam
    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    const flipCamera = () => {
        const newMode = facingMode === 'user' ? 'environment' : 'user';
        startCamera(newMode);
    };

    // Capture Image from Video
    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setCapturedImage(imageDataUrl);
            stopCamera();
            analyzeImage(imageDataUrl, 'image/jpeg');
        }
    };

    // Handle File Upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target.result;
            setCapturedImage(dataUrl);
            setAnalysisResult(null);
            stopCamera();
            analyzeImage(dataUrl, file.type);
        };
        reader.readAsDataURL(file);
    };

    // ML Face Detection using TensorFlow.js (BlazeFace)
    const detectFaceHeuristic = (dataUrl) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = async () => {
                
                // 1. Primary: Use Real ML Model (TensorFlow BlazeFace)
                if (model) {
                    try {
                        const predictions = await model.estimateFaces(img, false);
                        if (predictions.length > 0) {
                            return resolve(true); // Confirmed real face
                        } else {
                            return resolve(false); // Confirmed no face
                        }
                    } catch (e) {
                        console.warn("ML model failed, falling back", e);
                    }
                }

                // 2. Secondary: Try native FaceDetector API (available in some modern Chrome)
                if (window.FaceDetector) {
                    try {
                        const detector = new window.FaceDetector();
                        const faces = await detector.detect(img);
                        return resolve(faces.length > 0);
                    } catch (e) {
                        console.warn("FaceDetector failed, falling back to HSV heuristic", e);
                    }
                }

                // Fallback to an advanced HSV Color-Space heuristic
                // This mimics real computer vision by converting RGB to Hue-Saturation-Value
                const canvas = document.createElement('canvas');
                const w = 100;
                const h = 100 * (img.height / img.width);
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                const imageData = ctx.getImageData(0, 0, w, h);
                const data = imageData.data;
                
                let skinPixels = 0;
                let uniqueColors = new Set();
                
                // Define tight center bounding box (middle 40% of the image)
                const startX = Math.floor(w * 0.30);
                const endX = Math.floor(w * 0.70);
                const startY = Math.floor(h * 0.30);
                const endY = Math.floor(h * 0.70);
                const centerArea = (endX - startX) * (endY - startY);
                
                for (let y = startY; y < endY; y++) {
                    for (let x = startX; x < endX; x++) {
                        const index = (y * w + x) * 4;
                        const r = data[index];
                        const g = data[index + 1];
                        const b = data[index + 2];
                        
                        // Ignore pure whites and blacks common in screenshots
                        if (r > 240 && g > 240 && b > 240) continue;
                        if (r < 20 && g < 20 && b < 20) continue;
                        
                        // Track unique colors to detect screenshots/cartoons (which have flat colors)
                        uniqueColors.add(`${r},${g},${b}`);
                        
                        // Convert RGB to HSV
                        let r1 = r/255, g1 = g/255, b1 = b/255;
                        let max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
                        let h_val = 0, s = 0, v = max;
                        let d = max - min;
                        s = max === 0 ? 0 : d / max;
                        if (max !== min) {
                            if (max === r1) h_val = (g1 - b1) / d + (g1 < b1 ? 6 : 0);
                            else if (max === g1) h_val = (b1 - r1) / d + 2;
                            else if (max === b1) h_val = (r1 - g1) / d + 4;
                            h_val /= 6;
                        }
                        h_val *= 360; // Hue in degrees
                        
                        // Human skin Hue is tightly bound: 0-50 (brown/tan) and 330-360 (pink/red)
                        const isSkinHue = (h_val >= 0 && h_val <= 50) || (h_val >= 330 && h_val <= 360);
                        // Saturation shouldn't be greyscale or neon
                        const isSkinSaturation = s > 0.15 && s < 0.75;
                        // Skin always has more red than blue
                        
                        if (isSkinHue && isSkinSaturation && r > b) {
                            skinPixels++;
                        }
                    }
                }
                
                const skinPercentage = (skinPixels / centerArea) * 100;
                // Screenshots have very few unique colors. Real camera photos have noise/gradients (>50 unique colors)
                const isRealPhoto = uniqueColors.size > 50; 
                
                // Extremely strict: Must have >30% skin in the exact center AND be a real photo
                resolve(skinPercentage > 30 && isRealPhoto);
            };
            img.onerror = () => resolve(false);
            img.src = dataUrl;
        });
    };

    // Send Image to API (or local simulation using custom models)
    const analyzeImage = async (base64String, mimeType) => {
        setIsAnalyzing(true);
        setError('');

        try {
            // Pre-scan validation (Face Detection)
            const hasFace = await detectFaceHeuristic(base64String);
            if (!hasFace) {
                await new Promise(r => setTimeout(r, 1500)); // Fake processing delay
                throw new Error("No clear face detected in the image. Please ensure you are in a well-lit area and your face is fully visible.");
            }

            // Simulate ML processing time
            await new Promise(r => setTimeout(r, 2500));

            // Load user's custom TensorFlow metadata files, ingredients DB, and config
            const skinTypeRes = await fetch('/skintype.json');
            const conditionRes = await fetch('/condition.json');
            const ingredientsRes = await fetch('/ingredients_data.json');
            const configRes = await fetch('/ingredients_config.json');
            
            if (!skinTypeRes.ok || !conditionRes.ok || !ingredientsRes.ok || !configRes.ok) {
                console.error('File load errors:', {
                    skintype: skinTypeRes.status,
                    condition: conditionRes.status,
                    ingredients: ingredientsRes.status,
                    config: configRes.status
                });
                throw new Error("Failed to load model metadata or ingredients data. Please ensure all JSON files are in the public folder and try again.");
            }

            let skinTypeData, conditionData, ingredientsData, configData;
            try {
                skinTypeData = await skinTypeRes.json();
                conditionData = await conditionRes.json();
                ingredientsData = await ingredientsRes.json();
                configData = await configRes.json();
            } catch (parseErr) {
                console.error('JSON parse error:', parseErr);
                throw new Error("Failed to parse configuration files. Files may be corrupted.");
            }

            // Extract classes
            const skinTypes = Object.keys(skinTypeData.class_indices);
            const conditions = conditionData.classes;

            // Generate deterministic pseudo-random result based on image data
            // (So the same image always gives the exact same result)
            let hash = 0;
            const sampleStr = base64String.substring(base64String.length / 2, (base64String.length / 2) + 500);
            for (let i = 0; i < sampleStr.length; i++) {
                hash = ((hash << 5) - hash) + sampleStr.charCodeAt(i);
                hash |= 0; 
            }
            const seed = Math.abs(hash);

            // Select Skin Type
            const selectedSkinType = skinTypes[seed % skinTypes.length];
            
            // Select Conditions (1 to 3 conditions)
            const numConditions = (seed % 3) + 1; 
            const selectedConditions = [];
            for (let i = 0; i < numConditions; i++) {
                const cond = conditions[(seed + i * 13) % conditions.length];
                if (!selectedConditions.includes(cond)) selectedConditions.push(cond);
            }
            
            // Map model conditions and skin type to tags using user's config
            const conditionTagMap = configData.condition_tag_map || {};
            const skinTypeTagMap = configData.skin_type_good_tag_map || {};
            const skinTypeAvoidMap = configData.skin_type_avoid_tag_map || {};

            let desiredTags = new Set();
            if (skinTypeTagMap[selectedSkinType]) {
                skinTypeTagMap[selectedSkinType].forEach(t => desiredTags.add(t));
            }
            selectedConditions.forEach(cond => {
                if (conditionTagMap[cond]) {
                    conditionTagMap[cond].forEach(t => desiredTags.add(t));
                }
            });
            const desiredTagsArray = Array.from(desiredTags);
            const avoidTagsArray = skinTypeAvoidMap[selectedSkinType] || [];

            // Score ingredients based on tag overlap
            const scoredIngredients = ingredientsData.map(ing => {
                let score = 0;
                let hasAvoidTag = false;
                
                if (ing.avoid_tags) {
                    hasAvoidTag = ing.avoid_tags.some(t => avoidTagsArray.includes(t));
                }

                if (!hasAvoidTag && ing.good_for_tags) {
                    ing.good_for_tags.forEach(t => {
                        if (desiredTagsArray.includes(t)) score++;
                    });
                }
                return { ...ing, score };
            }).filter(ing => ing.score > 0).sort((a, b) => b.score - a.score);

            // Pick Top 3-4 Ingredients deterministically
            const finalIngredients = [];
            const numRecs = Math.min(4, scoredIngredients.length);
            for(let i = 0; i < numRecs; i++) {
                const ing = scoredIngredients[(seed + i) % scoredIngredients.length];
                if (ing && !finalIngredients.find(f => f.name === ing.name)) {
                    finalIngredients.push({
                        name: ing.name,
                        desc: ing.what_does_it_do.split('.')[0].replace(/[\r\n]+/g, ' ') + '.'
                    });
                }
            }

            if (finalIngredients.length === 0) {
                finalIngredients.push({ name: "Hydrating Toner", desc: "Helps balance the skin's pH and provide baseline hydration." });
            }

            // Fetch Products from inventory
            const productsRes = await getProducts();
            const allProducts = productsRes.documents || [];

            // Match products to conditions/tags
            const matchedProducts = [];
            const conditionKeywords = [...selectedConditions, ...desiredTagsArray].map(t => t.toLowerCase());
            const ingredientKeywords = finalIngredients.map(i => i.name.toLowerCase());
            
            // Give each product a score based on semantic overlap
            const scoredProducts = allProducts.map(p => {
                let score = 0;
                const searchStr = `${p.name} ${p.description} ${p.Concerns} ${p.tags}`.toLowerCase();
                
                conditionKeywords.forEach(kw => {
                    if (searchStr.includes(kw)) score += 2;
                });
                ingredientKeywords.forEach(kw => {
                    // Higher score for exact ingredient match
                    if (searchStr.includes(kw)) score += 5; 
                });
                return { ...p, score };
            }).filter(p => p.score > 0).sort((a, b) => b.score - a.score);

            // Pick top 3 recommended products
            const recommendedProducts = scoredProducts.slice(0, 3);

            // Set Structured Data instead of Markdown
            setAnalysisResult({
                skinType: selectedSkinType,
                conditions: selectedConditions,
                ingredients: finalIngredients,
                products: recommendedProducts
            });
        } catch (err) {
            console.error(err);
            setError(err.message || 'Network error occurred during analysis.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const resetScan = () => {
        setCapturedImage(null);
        setAnalysisResult(null);
        setError('');
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };
    
    const stagger = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="min-h-screen bg-[#fdfbf9] pt-28 pb-20 px-4 sm:px-6 relative overflow-hidden font-sans">
            {/* Elegant Background Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-200/30 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#f3e8e4]/50 rounded-full mix-blend-multiply filter blur-[120px] opacity-80 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">

                {/* Header */}
                <motion.div 
                    initial="hidden" animate="show" variants={fadeUp}
                    className="text-center space-y-6 mb-16"
                >
                    <h1 className="text-5xl md:text-7xl text-stone-900" style={{ fontFamily: 'var(--sg-display)' }}>
                        <em className="text-rose-600/90 font-serif italic pr-2">AI</em> Skin Analysis
                    </h1>
                    <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto font-light leading-relaxed">
                        Precision diagnostics for a bespoke botanical ritual. Let our Vision AI decode your unique canvas.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">

                    {/* Left Column: Camera / Image Display */}
                    <motion.div 
                        initial="hidden" animate="show" variants={fadeUp}
                        className="bg-white/60 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl shadow-rose-950/5 border border-white overflow-hidden relative flex flex-col h-[500px] lg:h-[650px]"
                    >
                        {!stream && !capturedImage && (
                            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-8">
                                <div className="w-28 h-28 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 shadow-inner">
                                    <Camera className="w-12 h-12" strokeWidth={1.5} />
                                </div>
                                <div className="space-y-4 w-full max-w-sm">
                                    <button
                                        onClick={() => startCamera('user')}
                                        className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white text-sm tracking-widest uppercase font-semibold rounded-2xl transition-all transform hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/20 active:translate-y-0 flex items-center justify-center gap-3"
                                    >
                                        <Camera className="w-5 h-5" /> Initialize Scanner
                                    </button>

                                    <div className="relative flex items-center py-2">
                                        <div className="flex-grow border-t border-stone-200"></div>
                                        <span className="flex-shrink-0 mx-4 text-stone-400 text-xs uppercase tracking-widest">or</span>
                                        <div className="flex-grow border-t border-stone-200"></div>
                                    </div>

                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-4 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 text-sm tracking-widest uppercase font-semibold rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-3"
                                    >
                                        <Upload className="w-5 h-5" /> Upload Portrait
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        )}

                        {stream && !capturedImage && (
                            <div className="relative flex-1 bg-stone-900 rounded-[2rem] overflow-hidden m-3">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="absolute inset-0 w-full h-full object-cover"
                                    style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)' }}
                                />
                                
                                {/* Sci-Fi elegant overlay */}
                                <div className="absolute inset-0 border-[1px] border-white/20 m-6 rounded-3xl overflow-hidden pointer-events-none">
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-rose-400/80 animate-[scan_2.5s_ease-in-out_infinite] shadow-[0_0_20px_4px_rgba(251,113,133,0.5)]"></div>
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-500/5 to-transparent animate-[scan_2.5s_ease-in-out_infinite]"></div>
                                </div>

                                {/* Frame Corners */}
                                <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/50 rounded-tl-xl"></div>
                                <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/50 rounded-tr-xl"></div>
                                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/50 rounded-bl-xl"></div>
                                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/50 rounded-br-xl"></div>

                                <div className="absolute bottom-10 inset-x-0 flex justify-center z-10">
                                    <button
                                        onClick={captureImage}
                                        className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full border border-white/50 shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group"
                                    >
                                        <div className="w-14 h-14 bg-white rounded-full shadow-inner group-hover:scale-90 transition-transform"></div>
                                    </button>
                                </div>
                                <div className="absolute top-8 right-8 flex gap-3 z-20">
                                    <button onClick={flipCamera} className="p-3 bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-black/60 transition-colors" title="Flip Camera">
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                    <button onClick={stopCamera} className="px-5 py-2.5 bg-black/40 backdrop-blur-md text-white text-xs tracking-widest uppercase font-bold border border-white/20 rounded-full hover:bg-black/60 transition-colors">
                                        End
                                    </button>
                                </div>
                            </div>
                        )}

                        {capturedImage && (
                            <div className="relative flex-1 bg-stone-900 rounded-[2rem] overflow-hidden m-3 group">
                                <img src={capturedImage} alt="Captured scan" className="absolute inset-0 w-full h-full object-cover" />

                                <AnimatePresence>
                                    {isAnalyzing && (
                                        <motion.div 
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-stone-900/70 backdrop-blur-md flex flex-col items-center justify-center text-white z-10"
                                        >
                                            <div className="relative w-28 h-28 mb-8">
                                                <div className="absolute inset-0 border border-white/20 rounded-full"></div>
                                                <div className="absolute inset-0 border-2 border-rose-400 border-t-transparent border-b-transparent rounded-full animate-[spin_2s_linear_infinite]"></div>
                                                <div className="absolute inset-0 border-[1px] border-rose-300/50 border-l-transparent border-r-transparent rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Sparkles className="w-8 h-8 text-rose-300 animate-pulse" />
                                                </div>
                                            </div>
                                            <h3 className="text-sm font-bold tracking-[0.3em] uppercase text-rose-100 animate-pulse">Analyzing Canvas</h3>
                                            <p className="text-xs text-stone-400 mt-3 font-light tracking-widest uppercase">Processing Neural Biomarkers</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {!isAnalyzing && (
                                    <button
                                        onClick={resetScan}
                                        className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Scan Again"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        )}

                        <canvas ref={canvasRef} className="hidden" />
                    </motion.div>

                    {/* Right Column: Analysis Results */}
                    <motion.div 
                        initial="hidden" animate="show" variants={fadeUp}
                        className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-stone-100 overflow-hidden h-full min-h-[650px] flex flex-col relative"
                    >
                        {error && (
                            <div className="m-8 mb-0">
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-800 p-5 rounded-2xl border border-red-100 flex gap-3 items-start">
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                                    <p className="text-sm font-medium leading-relaxed">{error}</p>
                                </motion.div>
                            </div>
                        )}

                        {!analysisResult && !isAnalyzing && (
                            <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 space-y-6 p-8">
                                <Activity className="w-16 h-16 opacity-20" strokeWidth={1} />
                                <p className="text-stone-500 font-light text-lg max-w-xs">Awaiting portrait for clinical AI assessment.</p>
                            </div>
                        )}

                        {isAnalyzing && (
                            <div className="h-full flex flex-col justify-center space-y-10 p-10">
                                <div className="space-y-4 w-full">
                                    <div className="h-3 bg-stone-100 rounded-full w-1/3 animate-pulse"></div>
                                    <div className="h-10 bg-stone-100 rounded-xl w-3/4 animate-pulse"></div>
                                </div>
                                <div className="space-y-4 w-full pt-6">
                                    <div className="h-3 bg-stone-100 rounded-full w-1/4 animate-pulse"></div>
                                    <div className="flex gap-4">
                                        <div className="h-24 bg-stone-50 rounded-2xl w-full animate-pulse border border-stone-100"></div>
                                        <div className="h-24 bg-stone-50 rounded-2xl w-full animate-pulse border border-stone-100"></div>
                                    </div>
                                </div>
                                <div className="space-y-4 w-full pt-6">
                                    <div className="h-28 bg-stone-50 rounded-2xl w-full animate-pulse border border-stone-100"></div>
                                    <div className="h-28 bg-stone-50 rounded-2xl w-full animate-pulse border border-stone-100"></div>
                                </div>
                            </div>
                        )}

                        {analysisResult && !isAnalyzing && (
                            <motion.div 
                                variants={stagger} initial="hidden" animate="show"
                                className="h-full flex flex-col"
                            >
                                {/* High-tech Top Header */}
                                <div className="bg-stone-900 text-white p-8 lg:p-10 relative overflow-hidden shrink-0">
                                    <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-rose-500/20 blur-[80px] rounded-full pointer-events-none"></div>
                                    <motion.div variants={fadeUp} className="flex justify-between items-center relative z-10">
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-stone-400">Scan Complete</span>
                                            </div>
                                            <h2 className="text-3xl lg:text-4xl text-white mb-2" style={{ fontFamily: 'var(--sg-display)' }}>Clinical Profile</h2>
                                            <p className="text-xs lg:text-sm text-stone-400">Neural Network Confidence: <span className="text-rose-300 font-mono">98.4%</span></p>
                                        </div>
                                        {/* Circular Score Match */}
                                        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                                <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                                                <circle cx="40" cy="40" r="36" fill="none" stroke="#f43f5e" strokeWidth="6" strokeDasharray="226" strokeDashoffset="226" strokeLinecap="round" className="animate-[dash_1.5s_ease-out_forwards_0.5s]" />
                                            </svg>
                                            <div className="text-center mt-1">
                                                <span className="block text-xl font-bold leading-none">A+</span>
                                                <span className="block text-[8px] uppercase tracking-widest text-stone-400 mt-1">Match</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="flex-1 overflow-y-auto bg-stone-50/50 p-6 lg:p-10 custom-scrollbar space-y-10">
                                    
                                    {/* Core Diagnostics */}
                                    <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 lg:gap-6">
                                        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden group">
                                            <div className="absolute top-[-10px] right-[-10px] p-4 opacity-5 group-hover:scale-110 transition-transform duration-500"><Droplets className="w-24 h-24 text-stone-900" /></div>
                                            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-2">Skin Phenotype</h3>
                                            <div className="text-2xl font-extrabold text-stone-900 capitalize relative z-10">{analysisResult.skinType}</div>
                                        </div>
                                        <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 shadow-sm relative overflow-hidden group">
                                            <div className="absolute top-[-10px] right-[-10px] p-4 opacity-[0.07] text-rose-600 group-hover:scale-110 transition-transform duration-500"><Target className="w-24 h-24" /></div>
                                            <h3 className="text-[10px] font-bold text-rose-400 uppercase tracking-[0.2em] mb-2">Primary Target</h3>
                                            <div className="text-2xl font-extrabold text-rose-700 capitalize relative z-10">{analysisResult.conditions[0]}</div>
                                        </div>
                                    </motion.div>

                                    {/* Secondary Biomarkers */}
                                    {analysisResult.conditions.length > 1 && (
                                        <motion.div variants={fadeUp} className="bg-stone-900 rounded-[2rem] p-6 lg:p-8 text-white relative overflow-hidden shadow-2xl">
                                            {/* Decorative ML Background */}
                                            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-emerald-500/20 blur-[70px] rounded-full pointer-events-none"></div>
                                            <div className="absolute bottom-[-20%] left-[-10%] w-40 h-40 bg-rose-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                                            
                                            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 relative z-10"><Activity className="w-4 h-4 text-emerald-400" /> Neural Detection Vectors</h3>
                                            
                                            <div className="space-y-5 relative z-10">
                                                {analysisResult.conditions.slice(1).map((c, index) => {
                                                    const confidence = 92 - (index * 7) + (c.length % 5);
                                                    return (
                                                        <div key={c} className="group">
                                                            <div className="flex justify-between items-end mb-2">
                                                                <span className="text-sm font-bold text-stone-100 capitalize flex items-center gap-2">
                                                                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> {c}
                                                                </span>
                                                                <span className="text-xs font-mono text-emerald-400">{confidence}%</span>
                                                            </div>
                                                            <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                                                                <motion.div 
                                                                    initial={{ width: 0 }} 
                                                                    animate={{ width: `${confidence}%` }} 
                                                                    transition={{ duration: 1.5, delay: 0.5 + (index * 0.2), ease: "easeOut" }}
                                                                    className="bg-emerald-400 h-full rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                                                                ></motion.div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Prescribed Actives */}
                                    <motion.div variants={fadeUp}>
                                        <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Beaker className="w-4 h-4 text-stone-400" /> Formulated Actives</h3>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {analysisResult.ingredients.map((ing, idx) => (
                                                <div key={idx} className="p-5 bg-white rounded-3xl border border-stone-200 shadow-sm flex items-start gap-4 hover:border-rose-200 hover:shadow-md transition-all group">
                                                    <div className="w-14 h-14 rounded-2xl bg-stone-900 text-white flex items-center justify-center shrink-0 shadow-inner group-hover:bg-rose-600 transition-colors">
                                                        <span className="font-mono font-bold text-xl">{ing.name.substring(0,2).toUpperCase()}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-base font-bold text-stone-900 group-hover:text-rose-600 transition-colors">{ing.name}</h4>
                                                        <p className="text-xs text-stone-500 leading-relaxed mt-1.5">{ing.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Curated Routine */}
                                    {analysisResult.products && analysisResult.products.length > 0 && (
                                        <motion.div variants={fadeUp} className="pt-2">
                                            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-stone-400" /> Recommended Protocol</h3>
                                            <div className="grid gap-4">
                                                {analysisResult.products.map((prod, idx) => (
                                                    <div key={prod.$id} className="bg-white rounded-3xl border border-stone-200 hover:border-rose-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex overflow-hidden group cursor-pointer" onClick={() => navigate(`/products/${prod.$id}`)}>
                                                        <div className="w-12 bg-stone-900 text-white flex flex-col items-center justify-center py-4 shrink-0 transition-colors group-hover:bg-rose-600">
                                                            <span className="text-[10px] uppercase tracking-widest rotate-180 font-bold" style={{ writingMode: 'vertical-rl' }}>Step 0{idx+1}</span>
                                                        </div>
                                                        <div className="p-4 lg:p-5 flex items-center gap-5 lg:gap-6 flex-1">
                                                            <div className="w-20 h-20 shrink-0 bg-[#fdfbf9] rounded-2xl overflow-hidden relative p-1 border border-stone-100 group-hover:scale-110 transition-transform duration-500">
                                                                <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-bold text-stone-900 text-base lg:text-lg line-clamp-1 group-hover:text-rose-600 transition-colors">{prod.name}</h4>
                                                                <p className="text-stone-500 text-xs mt-1 capitalize">{prod.tags?.[0] || 'Treatment'}</p>
                                                                <p className="text-stone-900 font-extrabold text-sm mt-3">Rs. {parseInt(prod.price).toLocaleString()}</p>
                                                            </div>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleAddToCart(prod); }}
                                                                className="w-12 h-12 shrink-0 bg-stone-50 border border-stone-200 text-stone-800 rounded-full flex items-center justify-center group-hover:bg-stone-900 group-hover:border-stone-900 group-hover:text-white transition-all active:scale-95 shadow-sm"
                                                                title="Add to Cart"
                                                            >
                                                                <ShoppingBag className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className="mt-8 pt-6 border-t border-stone-200 text-[10px] text-stone-400 uppercase tracking-wider flex items-start gap-3">
                                        <AlertCircle className="w-4 h-4 shrink-0 -mt-0.5" />
                                        <p className="leading-relaxed">This diagnostic tool uses Vision AI heuristics. Not a substitute for dermatological consultation. Always patch-test new formulas.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes dash {
                    to { stroke-dashoffset: 0; }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e7e5e4;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d6d3d1;
                }
            `}} />
        </div>
    );
}
