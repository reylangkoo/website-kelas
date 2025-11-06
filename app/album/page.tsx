"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { X, Upload, Trash2, Image as ImageIcon, Lock, Key, User, Shield, Check, Grid3X3, Rows, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Photo {
  id: string;
  name: string;
  src: string;
  uploadedAt: string;
}

export default function AlbumPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showClassCode, setShowClassCode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [classCode, setClassCode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [classCodeError, setClassCodeError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showManualUploadButton, setShowManualUploadButton] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [gridLayout, setGridLayout] = useState<"compact" | "comfortable">("comfortable");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fix hydration
  useEffect(() => {
    setIsMounted(true);
    
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin === "true") {
      setIsAuthenticated(true);
    }
  }, []);

//  useEffect partikel 
useEffect(() => {
  if (!isMounted || !canvasRef.current) return

  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let particles: Array<{
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    color: string
  }> = []

  const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899']
  let animationId: number
  
  // GUNAKAN VIEWPORT SIZE BUKAN DOCUMENT SIZE
  let viewportWidth = window.innerWidth
  let viewportHeight = window.innerHeight

  // INIT PARTIKEL - HANYA DI VIEWPORT
  const initParticles = () => {
    particles = []
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * viewportWidth,
        y: Math.random() * viewportHeight,
        size: (Math.random() * 2 + 1),
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
  }

  // SET CANVAS SIZE - VIEWPORT SAJA
  const setCanvasSize = () => {
    const dpr = window.devicePixelRatio || 1
    viewportWidth = window.innerWidth
    viewportHeight = window.innerHeight
    
    canvas.width = viewportWidth * dpr
    canvas.height = viewportHeight * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = `${viewportWidth}px`
    canvas.style.height = `${viewportHeight}px`
    
    // POSITION FIXED COVER VIEWPORT
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.zIndex = '0'
  }

  // INITIAL SETUP
  setCanvasSize()
  initParticles()

  const animate = () => {
    // Clear entire canvas
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, viewportWidth, viewportHeight)

    particles.forEach((particle, index) => {
      // Update position - TANPA PENGARUH SCROLL
      particle.x += particle.speedX
      particle.y += particle.speedY

      // Boundary checking - HANYA DI VIEWPORT
      if (particle.x > viewportWidth) particle.x = 0
      else if (particle.x < 0) particle.x = viewportWidth
      if (particle.y > viewportHeight) particle.y = 0
      else if (particle.y < 0) particle.y = viewportHeight

      // Draw particle - SEMUA PARTIKEL DI-RENDER
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.globalAlpha = 0.8
      ctx.fill()

      // Connect particles - untuk yang dekat saja
      for (let j = index + 1; j < particles.length; j++) {
        const otherParticle = particles[j]
        const dx = particle.x - otherParticle.x
        const dy = particle.y - otherParticle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          ctx.beginPath()
          ctx.strokeStyle = particle.color
          ctx.globalAlpha = Math.max(0.1, 0.6 * (1 - distance / 100))
          ctx.lineWidth = 1.5
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(otherParticle.x, otherParticle.y)
          ctx.stroke()
        }
      }

      // Reset global alpha
      ctx.globalAlpha = 1
    })

    animationId = requestAnimationFrame(animate)
  }

  animate()

  const handleResize = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }

    setCanvasSize()
    initParticles()
    animate()
  }

  let resizeTimeout: NodeJS.Timeout
  const debouncedResize = () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(handleResize, 250)
  }

  window.addEventListener('resize', debouncedResize)
  
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    window.removeEventListener('resize', debouncedResize)
    clearTimeout(resizeTimeout)
  }
}, [isMounted])

  // Admin credentials
  const ADMIN_CREDENTIALS = {
    username: "reylangko",
    password: "hyuga10"
  };
  
  const VALID_CLASS_CODE = "PI23A";

  // 🧠 Ambil semua foto dari database
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch("/api/photos");
        const data = await res.json();
        if (data.success) {
          setPhotos(data.photos);
        } else {
          console.error("Gagal ambil data foto dari API");
        }
      } catch (err) {
        console.error("Error fetch:", err);
      }
    };
    fetchPhotos();
  }, []);

  // 🔐 Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (
      loginData.username === ADMIN_CREDENTIALS.username &&
      loginData.password === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      localStorage.setItem("isAdmin", "true");
      setShowLogin(false);
      setLoginData({ username: "", password: "" });
    } else {
      setLoginError("Username atau password salah!");
    }
  };

  // 🔑 Handle Google OAuth sebelum upload
  const handleGoogleAuth = async () => {
    setIsAuthenticating(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth/google");
      const data = await res.json();

      if (data.authUrl) {
        const handleMessage = (event: MessageEvent) => {
          if (event.data.type === "auth_success") {
            setIsAuthenticating(false);
            window.removeEventListener("message", handleMessage);
            setTimeout(() => {
              const fileInput = document.getElementById("file-upload") as HTMLInputElement;
              fileInput?.click();
            }, 1000);
            setShowManualUploadButton(true);
            setTimeout(() => setShowManualUploadButton(false), 7000);
          } else if (event.data.type === "auth_error") {
            setAuthError("Autentikasi Google gagal: " + event.data.message);
            setIsAuthenticating(false);
            window.removeEventListener("message", handleMessage);
          }
        };

        window.addEventListener("message", handleMessage);
        const width = 600;
        const height = 700;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        const authWindow = window.open(
          data.authUrl,
          "google_auth",
          `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
        );

        const checkClosed = setInterval(() => {
          if (authWindow?.closed) {
            clearInterval(checkClosed);
            window.removeEventListener("message", handleMessage);
            if (isAuthenticating) {
              setAuthError("Popup tertutup sebelum autentikasi selesai");
              setIsAuthenticating(false);
            }
          }
        }, 1000);
      } else {
        throw new Error("Failed to get auth URL");
      }
    } catch (error) {
      console.error("Auth error:", error);
      setAuthError("Gagal menghubungkan ke Google Drive");
      setIsAuthenticating(false);
    }
  };

  // 🔑 Handle Class Code Verification
  const handleClassCode = (e: React.FormEvent) => {
    e.preventDefault();
    setClassCodeError("");

    if (classCode.toUpperCase() === VALID_CLASS_CODE) {
      setShowClassCode(false);
      handleGoogleAuth();
    } else {
      setClassCodeError("Kode kelas salah! Coba lagi.");
    }
  };

  // ✅ Upload ke server lokal
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Gagal upload ke server");

        const data = await res.json();

        if (data.success && data.photo) {
          const newPhoto: Photo = data.photo;
          setPhotos((prev) => [newPhoto, ...prev]);
        }
      }

      setUploading(false);
      e.target.value = "";
      setClassCode("");
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  // 🗑️ Hapus dari DB (single photo)
  const handleDelete = async (photoId: string) => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    if (!confirm("Yakin ingin menghapus foto ini?")) return;

    try {
      const res = await fetch(`/api/photos?id=${photoId}`, { method: "DELETE" });
      const data = await res.json();

      if (!data.success) throw new Error("Gagal hapus di server");

      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (err) {
      console.error(err);
    }
  };

  // 🆕 Hapus multiple photos
  const handleDeleteMultiple = async () => {
    if (selectedPhotos.length === 0) return;
    
    if (!confirm(`Yakin ingin menghapus ${selectedPhotos.length} foto?`)) return;

    try {
      const deletePromises = selectedPhotos.map(photoId => 
        fetch(`/api/photos?id=${photoId}`, { method: "DELETE" })
      );
      
      const results = await Promise.all(deletePromises);
      const allSuccess = results.every(res => res.ok);
      
      if (allSuccess) {
        setPhotos((prev) => prev.filter((p) => !selectedPhotos.includes(p.id)));
        setSelectedPhotos([]);
        setIsSelectionMode(false);
      } else {
        throw new Error("Gagal menghapus beberapa foto");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🆕 Toggle seleksi foto
  const togglePhotoSelection = (photoId: string) => {
    if (!isAuthenticated || !isSelectionMode) return;
    
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  // 🆕 Toggle mode seleksi
  const toggleSelectionMode = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    
    setIsSelectionMode(!isSelectionMode);
    setSelectedPhotos([]);
  };

  // Trigger upload dengan class code
  const triggerUpload = () => {
    setShowClassCode(true);
  };

  // Toggle grid layout
  const toggleGridLayout = () => {
    setGridLayout(prev => prev === "comfortable" ? "compact" : "comfortable");
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-300">Memuat album...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      <div className="relative z-10 px-4 sm:px-6 pb-20 pt-4">
        {/* Header - Cyber Glass Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center justify-between mb-6">
            {/* Logo & Title */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <div className="w-9 h-9 bg-slate-900/80 rounded-lg backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <ImageIcon className="text-cyan-400 w-5 h-5" />
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 border border-cyan-400/30 rounded-xl"
                />
              </div>
              
              <div>
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Album Foto
                </h1>
                <p className="text-xs text-cyan-200/80 mt-0.5">
                  Kenangan <b className="text-cyan-300">PI23A</b> • {photos.length} foto
                </p>
              </div>
            </motion.div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Grid Layout Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleGridLayout}
                className="flex items-center gap-2 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/30 px-3 py-2 rounded-xl transition-all duration-300 text-cyan-200 hover:text-cyan-300 backdrop-blur-md text-sm"
              >
                {gridLayout === "comfortable" ? (
                  <Grid3X3 className="w-4 h-4" />
                ) : (
                  <Rows className="w-4 h-4" />
                )}
                <span className="whitespace-nowrap">
                  {gridLayout === "comfortable" ? "Compact" : "Comfortable"}
                </span>
              </motion.button>

              {/* Back Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/kelas"
                  className="flex items-center gap-2 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/30 px-3 py-2 rounded-xl transition-all duration-300 text-cyan-200 hover:text-cyan-300 backdrop-blur-md text-sm"
                >
                  <ArrowLeft size={16} />
                  <span className="whitespace-nowrap">Kembali</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-7xl mx-auto mb-6 flex flex-wrap gap-3 justify-center"
        >
          {/* Upload Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={triggerUpload}
            disabled={uploading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
              uploading 
                ? "bg-cyan-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            }`}
          >
            <Upload size={18} />
            <span>{uploading ? "Uploading..." : "Upload Foto"}</span>
          </motion.button>

          {/* Selection Mode Button */}
          {isAuthenticated && isSelectionMode ? (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeleteMultiple}
                disabled={selectedPhotos.length === 0}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all ${
                  selectedPhotos.length === 0
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                <Trash2 size={16} />
                <span>Hapus ({selectedPhotos.length})</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleSelectionMode}
                className="flex items-center gap-2 px-3 py-2 rounded-xl font-semibold bg-gray-600 hover:bg-gray-700 transition-all"
              >
                <X size={16} />
                <span>Batal</span>
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isAuthenticated ? toggleSelectionMode : () => setShowLogin(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all"
            >
              <Shield size={18} />
              <span>{isAuthenticated ? "Pilih Foto" : "Admin"}</span>
            </motion.button>
          )}
        </motion.div>

        {/* Photo Grid */}
        <section className="max-w-7xl mx-auto">
          {photos.length === 0 && !uploading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mb-4"
              >
                <ImageIcon size={64} className="mx-auto opacity-50 text-cyan-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-cyan-200 mb-2">
                Album Masih Kosong
              </h3>
              <p className="text-cyan-200/70">
                Yuk jadi yang pertama upload kenangan spesial! 📸
              </p>
            </motion.div>
          )}

          {/* Dynamic Grid Layout */}
          <div className={`grid gap-3 ${
            gridLayout === "comfortable" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
          }`}>
            {photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: isSelectionMode ? 1 : 1.05,
                  y: isSelectionMode ? 0 : -4
                }}
                className="group relative"
              >
                {/* Card Container */}
                <div className={`relative rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border transition-all ${
                  isSelectionMode && selectedPhotos.includes(photo.id) 
                    ? "border-cyan-400 ring-2 ring-cyan-400/30" 
                    : "border-white/10"
                }`}>
                  {/* Selection Checkbox */}
                  {isSelectionMode && (
                    <div className="absolute top-2 left-2 z-20">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        selectedPhotos.includes(photo.id) 
                          ? "bg-cyan-500" 
                          : "bg-black/50 backdrop-blur-sm"
                      }`}>
                        {selectedPhotos.includes(photo.id) && (
                          <Check size={14} className="text-white" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Image Container */}
                  <div 
                    className={`relative overflow-hidden cursor-pointer ${
                      gridLayout === "comfortable" ? "h-64" : "h-48"
                    }`}
                    onClick={() => {
                      if (isSelectionMode) {
                        togglePhotoSelection(photo.id);
                      } else {
                        setSelected(photo.src);
                      }
                    }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.name}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    
                    {/* Hover Actions */}
                    <div className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-500 ${
                      "sm:translate-y-4 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 translate-y-0 opacity-100"
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="text-white/90 text-xs font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
                          {new Date(photo.uploadedAt).toLocaleDateString('id-ID')}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(photo.id);
                          }}
                          className="p-1.5 bg-red-500/80 hover:bg-red-600 backdrop-blur-sm rounded transition-all shadow"
                        >
                          <Trash2 size={14} className="text-white" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </div>

                  {/* Photo Name - Only show in comfortable mode */}
                  {gridLayout === "comfortable" && (
                    <div className="p-3">
                      <p className="text-white/90 font-medium truncate text-sm">
                        {photo.name}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl mx-auto mt-6 text-center"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-cyan-200/70">Cloud Photo Gallery</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xs text-cyan-200/60">
              Powered by Google Drive • Kelas PI23A • 
              <span className="text-cyan-400 ml-1">Secure Storage</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Modal Login Admin */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowLogin(false);
              setLoginError("");
              setLoginData({ username: "", password: "" });
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl mb-3">
                  <Lock className="text-white w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Admin Access</h2>
                <p className="text-cyan-200/70 text-sm">Masuk untuk mengelola foto</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-cyan-200 mb-2">
                    <User size={14} />
                    Username
                  </label>
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-sm"
                    placeholder="Masukkan username"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-cyan-200 mb-2">
                    <Key size={14} />
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-sm"
                    placeholder="Masukkan password"
                    required
                  />
                </div>

                {loginError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm text-center bg-red-400/10 py-2 px-3 rounded-lg border border-red-400/20"
                  >
                    {loginError}
                  </motion.p>
                )}

                <div className="flex gap-2 pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowLogin(false);
                      setLoginError("");
                      setLoginData({ username: "", password: "" });
                    }}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all"
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all"
                  >
                    Masuk
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Class Code */}
      <AnimatePresence>
        {showClassCode && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowClassCode(false);
              setClassCodeError("");
              setClassCode("");
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-white/10 shadow-2xl backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-3">
                  <Key className="text-white w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Kode Kelas</h2>
                <p className="text-cyan-200/70 text-sm">Masukkan kode kelas untuk upload</p>
              </div>

              <form onSubmit={handleClassCode} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-xl text-white text-center text-lg font-mono tracking-widest placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-sm"
                    placeholder="PI23A"
                    required
                    maxLength={5}
                  />
                </div>

                {classCodeError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-300 text-sm text-center bg-red-400/10 py-2 px-3 rounded-lg border border-red-400/20"
                  >
                    {classCodeError}
                  </motion.p>
                )}

                <div className="flex gap-2 pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowClassCode(false);
                      setClassCodeError("");
                      setClassCode("");
                    }}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all"
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all"
                  >
                    Verifikasi
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Preview */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-6xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[80vh] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={selected}
                  alt="Preview"
                  fill
                  className="object-contain"
                  quality={100}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-2 border border-white/20 transition-all"
              >
                <X size={20} className="text-white" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Input */}
      <input
        id="file-upload"
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        disabled={uploading}
      />

      {/* Uploading Overlay */}
      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl p-6 text-center shadow-2xl border border-white/20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-3"
              />
              <h3 className="text-lg font-bold text-white mb-1">Uploading...</h3>
              <p className="text-white/80 text-sm">Sedang mengupload foto Anda</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Overlay */}
      <AnimatePresence>
        {isAuthenticating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-center shadow-2xl border border-white/20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-3"
              />
              <h3 className="text-lg font-bold text-white mb-1">Menghubungkan ke Google Drive...</h3>
              {authError && <p className="text-red-300 text-sm mt-2">{authError}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Upload Button */}
      <AnimatePresence>
        {showManualUploadButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <button
              onClick={() => {
                const fileInput = document.getElementById("file-upload") as HTMLInputElement;
                fileInput?.click();
              }}
              className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white px-4 py-2 rounded-xl shadow-lg font-semibold text-sm"
            >
              📸 Klik di sini untuk memilih foto
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}