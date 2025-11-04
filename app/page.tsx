"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [nama, setNama] = useState("")
  const [kode, setKode] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  useEffect(() => {
  // Jalankan async agar tidak dianggap sync setState
  queueMicrotask(() => {
    setIsClient(true)

    const savedNama = localStorage.getItem("namaUser")
    const savedKode = localStorage.getItem("kodeKelas")

    if (savedNama && savedKode === "PIA2023") {
      router.push("/kelas")
    }
  })
}, [router])

  // Animated Background Effect
  useEffect(() => {
    if (!isClient || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
    }> = []

    const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899']

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x > canvas.width) particle.x = 0
        if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        if (particle.y < 0) particle.y = canvas.height

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = 0.6
        ctx.fill()

        // Connect particles
        for (let j = index + 1; j < particles.length; j++) {
          const dx = particle.x - particles[j].x
          const dy = particle.y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = particle.color
            ctx.globalAlpha = 0.2 * (1 - distance / 100)
            ctx.lineWidth = 0.5
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isClient])

  const handleSubmit = async () => {
    if (nama.trim() === "" || kode.trim() === "") {
      setFeedback("Harap isi semua kolom terlebih dahulu!")
      return
    }

    if (kode !== "PIA2023") {
      setFeedback("Kode kelas salah! Coba lagi.")
      return
    }

    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    localStorage.setItem("namaUser", nama)
    localStorage.setItem("kodeKelas", kode)
    setFeedback("Login Berhasil! Mengarahkan...")
    
    setTimeout(() => router.push("/kelas"), 1200)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Glass Morphism Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Floating Card */}
        <div className="relative">
          {/* Background Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50" />
          
          {/* Main Card */}
          <div className="relative backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Header Section */}
            <div className="p-8 text-center border-b border-white/10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 mx-auto mb-4 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl rotate-45" />
                <div className="absolute inset-2 bg-slate-900 rounded-lg rotate-45 flex items-center justify-center">
                  <span className="text-white font-bold text-lg -rotate-45">UCB</span>
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2"
              >
                PI23A
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-cyan-200/60 text-sm font-light"
              >
                Karya Anak Universitas Citra Bangsa
              </motion.p>
            </div>

            {/* Form Section */}
            <div className="p-8 space-y-6">
              {/* Nama Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-cyan-200/80">
                  Nama Lengkap
                </label>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-xl text-white placeholder-cyan-200/40 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    placeholder="Masukkan nama lengkap kamu..."
                  />
                </motion.div>
              </div>

              {/* Kode Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-cyan-200/80">
                  Kode Kelas
                </label>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <input
                    type="text"
                    value={kode}
                    onChange={(e) => setKode(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-200/40 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    placeholder="Masukkan kode akses kelas..."
                  />
                </motion.div>
              </div>

              {/* Submit Button */}
              <motion.button
                onClick={handleSubmit}
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/30 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto"
                  />
                ) : (
                  <span className="relative flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      🚀
                    </motion.span>
                    Masuk Kelas
                  </span>
                )}
              </motion.button>

              {/* Feedback Message */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`px-4 py-3 rounded-lg backdrop-blur-md border ${
                      feedback.includes("Berhasil")
                        ? "bg-green-500/10 text-green-300 border-green-500/30"
                        : "bg-red-500/10 text-red-300 border-red-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-lg">
                        {feedback.includes("Berhasil") ? "✨" : "⚠️"}
                      </span>
                      <span>{feedback}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-white/5 border-t border-white/10">
              <div className="text-center text-xs text-cyan-200/40">
                <p>© 2025 PI23A | Made with 💙 by Rey Langko</p>
                <motion.p
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mt-1 text-cyan-400/30"
                >
                  Next Generation Class Portal
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      {isClient && (
        <>
          {/* Large Floating Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -20, 0],
              y: [0, 20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
    </main>
  )
}