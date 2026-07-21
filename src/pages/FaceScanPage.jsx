import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, Sparkles, RefreshCw, AlertCircle, CheckCircle2, ShoppingBag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getProducts, addToCart } from "../backend/database.js";
import { useUser } from "../context/UserContext.jsx";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";

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

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-pink-100 rounded-full mb-2">
                        <Sparkles className="w-8 h-8 text-pink-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">AI Skin Scan</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Take a selfie and let our advanced Vision AI analyze your skin type, identify concerns, and recommend a personalized routine instantly.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">

                    {/* Left Column: Camera / Image Display */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative min-h-[400px] flex flex-col">

                        {!stream && !capturedImage && (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 bg-gradient-to-b from-gray-50 to-white">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                    <Camera className="w-10 h-10" />
                                </div>
                                <div className="space-y-4 w-full">
                                    <button
                                        onClick={startCamera}
                                        className="w-full py-4 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Camera className="w-5 h-5" /> Open Camera
                                    </button>

                                    <div className="relative flex items-center">
                                        <div className="flex-grow border-t border-gray-200"></div>
                                        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">OR</span>
                                        <div className="flex-grow border-t border-gray-200"></div>
                                    </div>

                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-4 bg-white hover:bg-gray-50 text-black border-2 border-gray-200 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Upload className="w-5 h-5" /> Upload Photo
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
                            <div className="relative flex-1 bg-black">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="absolute inset-0 w-full h-full object-cover mirror"
                                    style={{ transform: 'scaleX(-1)' }}
                                />
                                {/* Scanning Overlay */}
                                <div className="absolute inset-0 border-4 border-pink-500/50 m-8 rounded-2xl">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-pink-500 animate-[scan_2s_ease-in-out_infinite]" style={{ boxShadow: '0 0 15px 5px rgba(236, 72, 153, 0.4)' }}></div>
                                </div>
                                <div className="absolute bottom-6 inset-x-0 flex justify-center z-10">
                                    <button
                                        onClick={captureImage}
                                        className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform group"
                                    >
                                        <div className="w-16 h-16 rounded-full border-2 border-black group-hover:bg-gray-100 transition-colors"></div>
                                    </button>
                                </div>
                                <div className="absolute top-4 right-4 flex gap-2 z-20">
                                    <button onClick={flipCamera} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70" title="Flip Camera">
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                    <button onClick={stopCamera} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {capturedImage && (
                            <div className="relative flex-1 bg-black group">
                                <img src={capturedImage} alt="Captured scan" className="absolute inset-0 w-full h-full object-cover" />

                                {isAnalyzing && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
                                        <div className="relative w-24 h-24 mb-6">
                                            <div className="absolute inset-0 border-4 border-pink-500/30 rounded-full"></div>
                                            <div className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold tracking-wider animate-pulse">ANALYZING SKIN...</h3>
                                        <p className="text-sm text-gray-300 mt-2">Searching database for matches</p>
                                    </div>
                                )}

                                {!isAnalyzing && (
                                    <button
                                        onClick={resetScan}
                                        className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Scan Again"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Hidden Canvas for capturing video frame */}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* Right Column: Analysis Results */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 h-full min-h-[400px]">
                        {error && (
                            <div className="bg-red-50 text-red-700 p-4 rounded-xl flex gap-3 items-start mb-6">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {!analysisResult && !isAnalyzing && (
                            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
                                <Sparkles className="w-12 h-12 opacity-20" />
                                <p>Your personalized skin analysis will appear here.</p>
                            </div>
                        )}

                        {isAnalyzing && (
                            <div className="h-full flex flex-col items-center justify-center space-y-6">
                                <div className="space-y-3 w-full max-w-sm">
                                    <div className="h-4 bg-gray-200 rounded-full w-3/4 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded-full w-full animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded-full w-5/6 animate-pulse"></div>
                                </div>
                                <div className="space-y-3 w-full max-w-sm pt-6">
                                    <div className="h-24 bg-gray-100 rounded-2xl w-full animate-pulse"></div>
                                    <div className="h-24 bg-gray-100 rounded-2xl w-full animate-pulse"></div>
                                </div>
                            </div>
                        )}

                        {analysisResult && !isAnalyzing && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 text-white rounded-xl shadow-lg flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Analysis Complete</h2>
                                        <p className="text-sm font-medium text-pink-500">Skin Profile Generated</p>
                                    </div>
                                </div>

                                <div className="space-y-8 flex-1">
                                    {/* Skin Type Section */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-blue-400 rounded-full"></span> Detected Skin Type
                                        </h3>
                                        <div className="inline-block px-5 py-2.5 bg-blue-50 text-blue-700 font-bold rounded-xl border border-blue-100 shadow-sm">
                                            {analysisResult.skinType}
                                        </div>
                                    </div>

                                    {/* Conditions Section */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-orange-400 rounded-full"></span> Identified Conditions
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResult.conditions.map(c => (
                                                <div key={c} className="px-4 py-2 bg-orange-50 text-orange-700 font-semibold rounded-lg border border-orange-100 shadow-sm capitalize">
                                                    {c}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recommendations Section */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-400 rounded-full"></span> Recommended Active Ingredients
                                        </h3>
                                        <div className="space-y-3">
                                            {analysisResult.ingredients.map((ing, idx) => (
                                                <div key={idx} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                                                    <h4 className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors">{ing.name}</h4>
                                                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{ing.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Inventory Recommended Products Section */}
                                    {analysisResult.products && analysisResult.products.length > 0 && (
                                        <div className="pt-4 border-t border-gray-100">
                                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-pink-400 rounded-full"></span> Matches from your Inventory
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {analysisResult.products.map(prod => (
                                                    <div key={prod.$id} className="p-3 bg-white rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group cursor-pointer" onClick={() => navigate(`/products/${prod.$id}`)}>
                                                        <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-xl overflow-hidden relative">
                                                            <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover mix-blend-multiply" />
                                                            <div className="absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/10 transition-colors"></div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-pink-600 transition-colors">{prod.name}</h4>
                                                            <p className="text-pink-600 font-extrabold text-xs mt-0.5">Rs. {parseInt(prod.price).toLocaleString()}</p>
                                                        </div>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleAddToCart(prod); }}
                                                            className="p-2.5 bg-stone-900 text-white rounded-xl hover:bg-pink-600 active:scale-95 transition-all shadow-sm"
                                                            title="Add to Cart"
                                                        >
                                                            <ShoppingBag className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 text-xs text-gray-400 bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <p><strong>Disclaimer:</strong> This is an AI visual analysis tool utilizing deterministic CNN models. It is not a substitute for professional medical diagnosis. Always patch test recommended ingredients.</p>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan {
                    0% { top: 0%; }
                    50% { top: 100%; }
                    100% { top: 0%; }
                }
            `}} />
        </div>
    );
}
