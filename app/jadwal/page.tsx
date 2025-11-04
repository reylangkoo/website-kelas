"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CalendarDays, Clock, ArrowLeft, MapPin, User, BookOpen, Sparkles, Target } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"

export default function JadwalPage() {
  const [currentTime, setCurrentTime] = useState("")
  const [progressValues, setProgressValues] = useState<number[]>(() =>
    Array(7).fill(0).map(() => Math.floor(Math.random() * 100))
  )
  const [activeDay, setActiveDay] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Fix hydration
  useEffect(() => {
  // tunda sedikit agar tidak dianggap sync setState
  queueMicrotask(() => setIsMounted(true))

  const updateTimeAndProgress = () => {
    const now = new Date()
    setCurrentTime(now.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    }))
    
    if (now.getSeconds() % 30 === 0) {
      setProgressValues(prev => 
        prev.map(value => {
          const change = Math.floor(Math.random() * 5) - 2
          return Math.max(0, Math.min(100, value + change))
        })
      )
    }
  }

  updateTimeAndProgress()
  const interval = setInterval(updateTimeAndProgress, 1000)
  return () => clearInterval(interval)
}, [])

  // Animated Background Effect
  useEffect(() => {
    if (!isMounted || !canvasRef.current) return

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

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.03)'
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
        ctx.globalAlpha = 0.3
        ctx.fill()

        for (let j = index + 1; j < particles.length; j++) {
          const dx = particle.x - particles[j].x
          const dy = particle.y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 60) {
            ctx.beginPath()
            ctx.strokeStyle = particle.color
            ctx.globalAlpha = 0.1 * (1 - distance / 60)
            ctx.lineWidth = 0.2
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
  }, [isMounted])

  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
  const d = new Date()
  const today = hari[d.getDay()]

  const jadwal = [
    {
      hari: "Senin",
      mataKuliah: "Sistem Keamanan Informasi",
      kode: "P786222",
      sks: 3,
      jam: "13.00–16.00 WITA",
      ruang: "Ruang PI-2",
      dosen: "Syukri Adi Sakti, M.Pd",
      color: "from-blue-500 to-cyan-500",
      icon: "🔒"
    },
    {
      hari: "Selasa",
      mataKuliah: "Kecerdasan Buatan",
      kode: "P786224",
      sks: 3,
      jam: "08.00–10.00 WITA",
      ruang: "Ruang PI-1",
      dosen: "Minahen Budi Bansoma, S.Kom., M.Kom",
      color: "from-purple-500 to-pink-500",
      icon: "🤖"
    },
    {
      hari: "Rabu",
      mataKuliah: "Mobile Learning",
      kode: "P786225",
      sks: 3,
      jam: "08.00–10.00 WITA",
      ruang: "Ruang PI-2",
      dosen: "Syukri Adi Sakti, M.Pd",
      color: "from-green-500 to-emerald-500",
      icon: "📱"
    },
    {
      hari: "Rabu",
      mataKuliah: "Pengembangan Media dan Game",
      kode: "P786226",
      sks: 3,
      jam: "13.00–16.00 WITA",
      ruang: "Ruang PI-1",
      dosen: "Diana F. Fallo, S.Kom., MT",
      color: "from-orange-500 to-red-500",
      icon: "🎮"
    },
    {
      hari: "Kamis",
      mataKuliah: "Animasi & Motion Grafis",
      kode: "P786227",
      sks: 3,
      jam: "10.00–12.00 WITA",
      ruang: "Lab. Kom",
      dosen: "-",
      color: "from-indigo-500 to-purple-500",
      icon: "🎨"
    },
    {
      hari: "Kamis",
      mataKuliah: "Pengembangan Bahan Ajar",
      kode: "P786301",
      sks: 2,
      jam: "13.00–15.00 WITA",
      ruang: "Lab. Kom",
      dosen: "Dr. Maria M.B. Sogen, S.Kom., M.Pd",
      color: "from-indigo-500 to-purple-500",
      icon: "📚"
    },
    {
      hari: "Jumat",
      mataKuliah: "Pemrograman Web",
      kode: "P786222",
      sks: 3,
      jam: "07.00–Selesai",
      ruang: "Lab",
      dosen: "Meinahen Budi Bansoma, S.Kom., M.Kom",
      color: "from-yellow-500 to-amber-500",
      icon: "💻"
    },
  ]

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
  const filteredJadwal = activeDay ? jadwal.filter(item => item.hari === activeDay) : jadwal

  const stats = [
    { label: "Total Mata Kuliah", value: "7", icon: BookOpen },
    { label: "SKS Semester", value: "19", icon: Target },
    { label: "Hari Aktif", value: "5", icon: CalendarDays },
    { label: "Dosen", value: "7", icon: User },
  ]

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-300">Memuat jadwal...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      <div className="relative z-10 px-4 sm:px-6 pb-20 pt-4"> {/* Increased top padding for navbar */}
        {/* Header - REVISED LAYOUT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          {/* Top Row - Back Button Right Aligned */}
          <div className="flex justify-between items-start mb-6">
            {/* Left Side - Title Section */}
            <motion.div
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
            >
              {/* Smaller Icon */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <div className="w-9 h-9 bg-slate-900/80 rounded-lg backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <CalendarDays className="text-cyan-400 w-5 h-5" />
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 border border-cyan-400/30 rounded-xl"
                />
              </div>
              
              {/* Title Text */}
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Jadwal Kuliah
                </h1>
                <p className="text-sm text-cyan-200/80 mt-1">
                  Rencana pembelajaran <span className="text-cyan-300">PI23A</span>
                </p>
              </div>
            </motion.div>

            {/* Right Side - Back Button */}
            <motion.div
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Link
                href="/kelas"
                className="group flex items-center gap-2 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/30 px-4 py-2 rounded-xl transition-all duration-300 text-cyan-200 hover:text-cyan-300 backdrop-blur-md shadow-lg text-sm"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold">Kembali</span>
              </Link>
            </motion.div>
          </div>

          {/* Time Info - Compact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 text-xs text-cyan-200/70 mb-6"
          >
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              <span>{currentTime}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
              <CalendarDays className="w-3 h-3" />
              <span>Hari ini: <strong className="text-cyan-300">{today}</strong></span>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-7xl mx-auto mb-6"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 text-center group relative overflow-hidden"
                >
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <IconComponent className="w-6 h-6 text-cyan-400 mx-auto mb-2 relative z-10" />
                  <div className="text-lg lg:text-xl font-bold text-white mb-1 relative z-10">{stat.value}</div>
                  <div className="text-xs text-cyan-200/70 relative z-10">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Day Filter */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-7xl mx-auto mb-6"
        >
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-30" />
            
            {/* Main Card */}
            <div className="relative backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 shadow-lg overflow-hidden">
              <div className="p-4">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Filter Berdasarkan Hari
                </h3>
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveDay("")}
                    className={`px-3 py-1.5 rounded-lg transition-all duration-300 backdrop-blur-md border text-sm ${
                      activeDay === "" 
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md border-cyan-400/50" 
                        : "bg-white/5 text-cyan-200 border-white/10 hover:border-cyan-400/30"
                    }`}
                  >
                    Semua Hari
                  </motion.button>
                  {days.map((day) => (
                    <motion.button
                      key={day}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveDay(day)}
                      className={`px-3 py-1.5 rounded-lg transition-all duration-300 backdrop-blur-md border text-sm ${
                        activeDay === day 
                          ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md border-purple-400/50" 
                          : "bg-white/5 text-cyan-200 border-white/10 hover:border-purple-400/30"
                      } ${day === today ? "ring-1 ring-cyan-400" : ""}`}
                    >
                      {day} {day === today && "✨"}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Jadwal List */}
        <section className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              {filteredJadwal.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -4,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  className="relative group cursor-pointer"
                >
                  {/* Gradient Border */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300`}></div>
                  
                  {/* Main Card */}
                  <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl p-4 border border-white/10 group-hover:border-white/20 transition-all duration-300 h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md text-white text-base`}
                        >
                          {item.icon}
                        </motion.div>
                        <div>
                          <h2 className="text-lg font-bold text-white">{item.hari}</h2>
                          <div className="flex items-center gap-1 text-xs text-cyan-200">
                            <Clock className="w-3 h-3" />
                            {item.jam}
                          </div>
                        </div>
                      </div>
                      
                      {/* Today Badge */}
                      {item.hari === today && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded-full border border-cyan-400/30"
                        >
                          Hari Ini
                        </motion.div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-base font-semibold text-white mb-1 leading-tight">
                          {item.mataKuliah}
                        </h3>
                        <p className="text-xs text-cyan-200">
                          {item.kode} • {item.sks} SKS
                        </p>
                      </div>

                      {/* Details */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-cyan-200">
                          <MapPin className="w-3 h-3" />
                          <span>{item.ruang}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-cyan-200">
                          <User className="w-3 h-3" />
                          <span className="italic">{item.dosen}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-cyan-400 mb-1">
                        <span>Progress</span>
                        <span>{progressValues[i] || 0}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressValues[i] || 0}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                          className={`h-1.5 rounded-full bg-gradient-to-r ${item.color}`}
                        />
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredJadwal.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-30" />
                <div className="relative bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                  <CalendarDays className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">Tidak ada jadwal</h3>
                  <p className="text-cyan-200 text-sm">
                    Tidak ada jadwal kuliah untuk hari {activeDay}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </section>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="max-w-7xl mx-auto mt-6 -mb-8 text-center"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-cyan-200/70">Semester Aktif 2023/2024</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xs text-cyan-200/60">
              Program Studi Pendidikan Informatika • Universitas Citra Bangsa •
              <span className="text-cyan-400 ml-1">Kelas PI23A</span>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}