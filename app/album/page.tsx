"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Upload, Trash2, Image as ImageIcon, Lock, Key, User, Shield } from "lucide-react";
import Image from "next/image";

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

  // Admin credentials (dalam production, ini harus dari environment variables)
  const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin123"
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

    if (loginData.username === ADMIN_CREDENTIALS.username && 
        loginData.password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setShowLogin(false);
      setLoginData({ username: "", password: "" });
    } else {
      setLoginError("Username atau password salah!");
    }
  };

  // 🔑 Handle Class Code Verification
  const handleClassCode = (e: React.FormEvent) => {
    e.preventDefault();
    setClassCodeError("");

    if (classCode.toUpperCase() === VALID_CLASS_CODE) {
      setShowClassCode(false);
      // Trigger file input setelah kode kelas benar
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      fileInput?.click();
    } else {
      setClassCodeError("Kode kelas salah! Coba lagi.");
    }
  };

  // ✅ Upload ke server lokal (Drive & DB)
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

      // Success notification dengan animasi
      setUploading(false);
      e.target.value = "";
      
      // Reset class code setelah upload berhasil
      setClassCode("");
      
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  // 🗑️ Hapus dari DB
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
      
      // Success feedback
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger upload dengan class code
  const triggerUpload = () => {
    setShowClassCode(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 text-white px-4 pt-6 pb-20 overflow-x-hidden">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 mb-12"
      >
        <div className="text-center md:text-left">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent flex items-center justify-center md:justify-start gap-3 mb-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              <ImageIcon className="text-pink-400" size={40} />
            </motion.div>
            Album Foto PI23A
          </motion.h1>
          <p className="text-purple-200 text-lg max-w-2xl">
            Simpan dan bagikan momen terbaik bersama teman seperjuangan 💜
            <span className="block text-sm text-purple-400 mt-2">
              {photos.length} kenangan tersimpan • Klik foto untuk melihat detail
            </span>
          </p>
        </div>

        {/* Tombol Upload & Admin - PERBAIKAN: Selalu horisontal */}
        <div className="flex flex-row gap-3 w-full md:w-auto justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={triggerUpload}
            disabled={uploading}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold shadow-2xl transition-all flex-1 md:flex-none justify-center ${
              uploading 
                ? "bg-purple-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            }`}
          >
            <Upload size={20} />
            <span className="whitespace-nowrap">{uploading ? "Uploading..." : "Upload Foto"}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all flex-1 md:flex-none justify-center"
          >
            <Shield size={20} />
            <span className="whitespace-nowrap">Admin</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Grid Foto dengan Desain Keren */}
      <section className="max-w-7xl mx-auto">
        {photos.length === 0 && !uploading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full text-center text-purple-300 py-20"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="mb-6"
            >
              <ImageIcon size={80} className="mx-auto opacity-60" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-purple-200 mb-3">
              Album Masih Kosong
            </h3>
            <p className="text-lg text-purple-400 max-w-md mx-auto">
              Yuk jadi yang pertama upload kenangan spesial! 📸
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                scale: 1.05,
                y: -8
              }}
              className="group relative"
            >
              {/* Card Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10">
                {/* Image Container */}
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    onClick={() => setSelected(photo.src)}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  
                  {/* Hover Actions */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex justify-between items-center">
                      <span className="text-white/90 text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                        {new Date(photo.uploadedAt).toLocaleDateString('id-ID')}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(photo.id);
                        }}
                        className="p-2 bg-red-500/80 hover:bg-red-600 backdrop-blur-sm rounded-full transition-all shadow-lg"
                      >
                        <Trash2 size={16} className="text-white" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </div>

                {/* Photo Name */}
                <div className="p-4">
                  <p className="text-white/90 font-medium truncate text-sm">
                    {photo.name}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

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
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4">
                  <Lock className="text-white" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
                <p className="text-gray-400">Masuk untuk mengelola foto</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <User size={16} />
                    Username
                  </label>
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Masukkan username"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Key size={16} />
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Masukkan password"
                    required
                  />
                </div>

                {loginError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm text-center bg-red-400/10 py-2 px-4 rounded-xl border border-red-400/20"
                  >
                    {loginError}
                  </motion.p>
                )}

                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowLogin(false);
                      setLoginError("");
                      setLoginData({ username: "", password: "" });
                    }}
                    className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-2xl font-semibold transition-all"
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-semibold transition-all"
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
              className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
                  <Key className="text-white" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Kode Kelas</h2>
                <p className="text-purple-200">Masukkan kode kelas PI23A untuk upload foto</p>
              </div>

              <form onSubmit={handleClassCode} className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-center text-xl font-mono tracking-widest placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all backdrop-blur-sm"
                    placeholder="PI23A"
                    required
                    maxLength={5}
                  />
                </div>

                {classCodeError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-300 text-sm text-center bg-red-400/10 py-2 px-4 rounded-xl border border-red-400/20"
                  >
                    {classCodeError}
                  </motion.p>
                )}

                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowClassCode(false);
                      setClassCodeError("");
                      setClassCode("");
                    }}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-semibold transition-all backdrop-blur-sm"
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl font-semibold transition-all"
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
              <div className="relative w-full h-[80vh] rounded-3xl overflow-hidden shadow-2xl">
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
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-3 border border-white/20 transition-all"
              >
                <X size={24} className="text-white" />
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
              className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 text-center shadow-2xl border border-white/20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
              />
              <h3 className="text-2xl font-bold text-white mb-2">Uploading...</h3>
              <p className="text-white/80">Sedang mengupload foto Anda</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}