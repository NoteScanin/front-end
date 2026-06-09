"use client";

import { useState, useRef, useEffect } from "react";
import {
    Image as ImageIcon,
    UploadCloud,
    X,
    FileText,
    Loader2,
    Download,
    Sparkles,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function NoteScannerUI({ className }: { className?: string }) {
    const { token } = useAuth();
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState<number>(0);
    const [scanStatus, setScanStatus] = useState<string>("");
    const [extractedText, setExtractedText] = useState<string | null>(null);
    const [jobId, setJobId] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleFile = (file: File) => {
        if (file.type.startsWith("image/")) {
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setExtractedText(null); // Reset previous results
            setJobId(null);
            setScanProgress(0);
            setScanStatus("");
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setExtractedText(null);
        setJobId(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleScan = async () => {
        if (!selectedFile) return;
        if (!token) {
            alert("Harap login terlebih dahulu.");
            return;
        }

        setIsScanning(true);
        setScanProgress(0);
        setScanStatus("Mengunggah gambar...");
        
        try {
            // 1. Upload file to create note
            const formData = new FormData();
            formData.append("file", selectedFile);
            
            const uploadRes = await fetch(`${API_URL}/api/v1/notes/upload`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (!uploadRes.ok) {
                throw new Error("Gagal mengunggah gambar");
            }
            
            const uploadData = await uploadRes.json();
            const noteId = uploadData.data.id;

            // 2. Start OCR job
            setScanStatus("Memulai proses AI...");
            const processRes = await fetch(`${API_URL}/api/v1/ocr/process/${noteId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!processRes.ok) {
                throw new Error("Gagal memulai proses OCR");
            }

            const processData = await processRes.json();
            const currentJobId = processData.data.jobId;
            setJobId(currentJobId);

            // 3. Listen to SSE for progress
            const eventSource = new EventSource(`${API_URL}/api/v1/ocr/jobs/${currentJobId}/stream?token=${token}`);
            
            eventSource.addEventListener("progress", async (e) => {
                try {
                    const data = JSON.parse(e.data);
                    setScanProgress(data.progress || 0);
                    
                    if (data.status === "COMPLETED") {
                        eventSource.close();
                        setScanStatus("Selesai!");
                        
                        // 4. Fetch Results
                        const resultRes = await fetch(`${API_URL}/api/v1/ocr/results/${currentJobId}`, {
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        });
                        if (resultRes.ok) {
                            const resultData = await resultRes.json();
                            setExtractedText(resultData.data.clean_text || resultData.data.raw_text || "Tidak ada teks terdeteksi.");
                        } else {
                            throw new Error("Gagal mengambil hasil");
                        }
                        setIsScanning(false);
                    } else if (data.status === "FAILED") {
                        eventSource.close();
                        throw new Error(data.error || "Proses OCR gagal");
                    } else {
                        setScanStatus("Memproses gambar...");
                    }
                } catch (err) {
                    eventSource.close();
                    console.error("SSE Error:", err);
                    alert("Terjadi kesalahan saat memproses data.");
                    setIsScanning(false);
                }
            });

            eventSource.onerror = (err) => {
                console.error("EventSource failed:", err);
                eventSource.close();
                alert("Koneksi terputus saat memantau progres.");
                setIsScanning(false);
            };

        } catch (err: any) {
            console.error("OCR Error:", err);
            alert(err.message || "Terjadi kesalahan saat scan gambar.");
            setIsScanning(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!jobId) {
            alert("Tidak ada hasil untuk diunduh.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/v1/pdf/generate/${jobId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ text: extractedText })
            });

            if (!res.ok) {
                throw new Error("Gagal membuat PDF");
            }

            const data = await res.json();
            const pdfId = data.data.id;
            
            // Trigger download via window.open
            window.open(`${API_URL}/api/v1/pdf/download/${pdfId}`, "_blank");
            
        } catch (err: any) {
            console.error("Download error:", err);
            alert(err.message || "Gagal mengunduh PDF.");
        }
    };

    return (
        <div className={cn("w-full py-8 px-4 flex flex-col gap-10", className)}>
            {/* Header Section */}
            <div className="text-center mb-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-xs font-medium text-black/70 dark:text-white/70 mb-6 backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI-Powered Handwriting OCR</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-black dark:text-white mb-4">
                    Catatan ke <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-black dark:from-gray-400 dark:to-white">Teks</span>
                </h2>
                <p className="text-base text-black/60 dark:text-white/60 max-w-lg mx-auto leading-relaxed">
                    Unggah foto tulisan tanganmu, biarkan AI membaca teksnya dengan akurat, lalu unduh hasilnya sebagai PDF yang rapi.
                </p>
            </div>

            <div className="relative max-w-2xl w-full mx-auto">
                {/* Subtle glowing background blob for premium feel */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-transparent via-black/[0.03] dark:via-white/[0.03] to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />

                {/* Uploader Card */}
                <div 
                    className={cn(
                        "relative flex flex-col items-center justify-center p-10 md:p-14 border rounded-[2rem] transition-all duration-300 ease-out overflow-hidden backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_40px_rgba(255,255,255,0.03)]",
                        dragActive 
                            ? "border-black/30 dark:border-white/30 bg-black/[0.03] dark:bg-white/[0.05] scale-[1.01]" 
                            : "border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/40 hover:bg-white/80 dark:hover:bg-white/[0.02]",
                        selectedFile ? "hidden" : "flex"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg, image/png, image/jpg"
                        onChange={handleChange}
                        className="hidden"
                        id="image-upload"
                    />

                    <div className="w-20 h-20 mb-6 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/5 shadow-sm">
                        <UploadCloud className="w-8 h-8 text-black/50 dark:text-white/50" />
                    </div>
                    
                    <h3 className="text-lg font-medium text-black/80 dark:text-white/80 mb-2">
                        Pilih foto catatanmu
                    </h3>
                    <p className="text-sm text-black/50 dark:text-white/50 mb-8 text-center max-w-[250px] leading-relaxed">
                        Tarik & lepas gambar ke sini, atau klik tombol di bawah untuk menelusuri (JPG, PNG).
                    </p>
                    
                    <label
                        htmlFor="image-upload"
                        className="px-6 py-3 text-sm font-medium rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-transparent dark:hover:bg-white/5 hover:bg-black/5 transition-all duration-200 cursor-pointer text-black/80 dark:text-white/80 shadow-sm flex items-center gap-2 group"
                    >
                        Telusuri File
                        <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                    </label>
                </div>

                {/* Selected File State */}
                {selectedFile && (
                    <div className="flex flex-col gap-6 w-full animate-in fade-in zoom-in-95 duration-400">
                        <div className="w-full flex items-center justify-between p-4 border border-black/10 dark:border-white/10 rounded-2xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-md shadow-sm">
                            <div className="flex items-center gap-4 overflow-hidden">
                                {previewUrl ? (
                                    <div className="w-16 h-16 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden relative border border-black/5 dark:border-white/5 shadow-sm">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0 border border-black/5 dark:border-white/5">
                                        <ImageIcon className="w-6 h-6 text-black/40 dark:text-white/40" />
                                    </div>
                                )}
                                
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-medium text-black/80 dark:text-white/80 truncate">
                                        {selectedFile.name}
                                    </span>
                                    <span className="text-xs text-black/40 dark:text-white/40 mt-1 font-medium">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type.split('/')[1].toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={removeFile}
                                className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                                aria-label="Hapus foto"
                                disabled={isScanning}
                            >
                                <X className="w-4 h-4 text-black/50 dark:text-white/50" />
                            </button>
                        </div>

                        {!extractedText ? (
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleScan}
                                    disabled={isScanning}
                                    className={cn(
                                        "w-full py-4 px-6 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group",
                                        isScanning && "animate-pulse"
                                    )}
                                >
                                    {isScanning ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>{scanStatus} {scanProgress}%</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            <span>Mulai Ekstrak Teks</span>
                                        </>
                                    )}
                                </button>
                                {isScanning && (
                                    <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-black dark:bg-white transition-all duration-300 ease-out"
                                            style={{ width: `${scanProgress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>
                )}

                {/* Extracted Text Area */}
                {extractedText && (
                    <div className="mt-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                        <div className="w-full border border-black/10 dark:border-white/10 rounded-2xl p-6 bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.02)]">
                            <div className="flex items-center justify-between mb-4 border-b border-black/5 dark:border-white/5 pb-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 bg-black/5 dark:bg-white/10 rounded-lg">
                                        <FileText className="w-4 h-4 text-black/70 dark:text-white/70" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-black/80 dark:text-white/80">
                                        Hasil Ekstraksi
                                    </h4>
                                </div>
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-black/40 dark:text-white/40 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md">
                                    Bisa Diedit
                                </span>
                            </div>
                            
                            <textarea 
                                className="w-full bg-transparent resize-y min-h-[200px] text-sm text-black/80 dark:text-white/80 focus:outline-none placeholder:text-black/30 dark:placeholder:text-white/30 leading-relaxed font-mono"
                                value={extractedText}
                                onChange={(e) => setExtractedText(e.target.value)}
                                placeholder="Teks hasil scan akan muncul di sini..."
                            />
                        </div>

                        <button
                            onClick={handleDownloadPDF}
                            className="w-full py-4 px-6 border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] backdrop-blur-md text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md group"
                        >
                            <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                            Download sebagai PDF
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
