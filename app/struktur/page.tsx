"use client"

import { motion } from "framer-motion"
import { Users, ArrowLeft, Crown, Code, Paintbrush, GamepadIcon, Smartphone, Brain, BookOpen, Upload, Sparkles } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"

export default function StrukturPage() {
  const [isMounted, setIsMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

 useEffect(() => {
  // Jalankan async agar tidak dianggap sinkron oleh React
  queueMicrotask(() => setIsMounted(true))
}, [])

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

  const struktur = [
    {
      jabatan: "Ketua Kelas",
      nama: "Rey Langko",
      nim: "237111024",
      warna: "from-purple-500 via-pink-500 to-indigo-500",
      icon: Crown,
      level: "leader"
    }
  ]

  const sipen = [
    {
      matkul: "Pengembangan Bahan Ajar",
      nama: "GRATCIA R. K BEREK",
      nim: "237111012",
      warna: "from-blue-500 via-cyan-500 to-teal-500",
      icon: BookOpen
    },
    {
      matkul: "Pengembangan Media & Game Pembelajaran",
      nama: "Lucky Daniel Mboeik",
      nim: "237111018",
      warna: "from-green-500 via-emerald-500 to-lime-500",
      icon: GamepadIcon
    },
    {
      matkul: "Animasi dan Motion Grafis",
      nama: "Ranjas Sadrak Mbuik",
      nim: "237111022",
      warna: "from-orange-500 via-red-500 to-pink-500",
      icon: Paintbrush
    },
    {
      matkul: "Kecerdasan Buatan",
      nama: "Riko Mbuik",
      nim: "237111025",
      warna: "from-purple-500 via-indigo-500 to-blue-500",
      icon: Brain
    },
    {
      matkul: "Pemrograman Web",
      nama: "Klemensia Tea",
      nim: "237111016",
      warna: "from-yellow-500 via-orange-500 to-red-500",
      icon: Code
    },
    {
      matkul: "Mobile Learning",
      nama: "Sandro Pangga Leghu",
      nim: "237111027",
      warna: "from-cyan-500 via-blue-500 to-purple-500",
      icon: Smartphone
    },
    {
      matkul: "Multimedia & Cloud Computing",
      nama: "Elsa Sin",
      nim: "237111008",
      warna: "from-indigo-500 via-purple-500 to-pink-500",
      icon: Upload
    }
  ]

  const anggota = [
    { nama: "Reymundo J. Langko", nim: "237111024" },
    { nama: "JASMINE ADELIA NDUN", nim: "237111015" },
    { nama: "ANJELA ERSA KARTINI", nim: "237111003" },
    { nama: "Dedryon R. Loak", nim: "237111005" },
    { nama: "Emanuel S. Latu", nim: "237111009" },
    { nama: "ALFRIDO YOSEPH SERAN", nim: "237111002" },
    { nama: "LIDIA Y. NAIHELI", nim: "237111017" },
    { nama: "Regina Selan", nim: "237111023" },
    { nama: "FILADELFIA NDUN", nim: "237111011" },
    { nama: "Eugenius Robinus Nour", nim: "237111010" },
    { nama: "Uamar Yanto Usman", nim: "237111032" },
    { nama: "SINDY SHANTIKA C. TSU", nim: "237111030" },
    { nama: "Donsius Gadja Wadu", nim: "237111007" },
    { nama: "Victor Tamelab", nim: "237111033" },
    { nama: "Niswar n ndolu", nim: "237111021" },
    { nama: "Theo K F Oeina", nim: "237111031" },
    { nama: "James Ishak Marlon Benu", nim: "237111014" },
    { nama: "Merlin Wahyuni Babis", nim: "237111020" },
    { nama: "YANSRY WELANDA ESTER DETHAN", nim: "237111034" },
    { nama: "MEIMAN BEFIANTO LAHAGU", nim: "237111019" },
    { nama: "YOSUA NAHAK", nim: "237111035" },
    { nama: "GRATCIA R. K BEREK", nim: "237111012" },
    { nama: "Lucky Daniel Mboeik", nim: "237111018" },
    { nama: "Ranjas Sadrak Mbuik", nim: "237111022" },
    { nama: "Riko Mbuik", nim: "237111025" },
    { nama: "Klemensia Tea", nim: "237111016" },
    { nama: "Sandro Pangga Leghu", nim: "237111027" },
    { nama: "Inosensius S Banggo", nim: "237111013" },
    { nama: "Silfinus Malaiwali", nim: "237111029" },
    { nama: "Elsania Sin", nim: "237111008" }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-300">Memuat struktur...</p>
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

      <div className="relative z-10 px-4 sm:px-6 pb-20 pt-4">
        {/* Header - Cyber Glass Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center justify-between mb-6">
            {/* Logo & Title - Compact */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <div className="w-9 h-9 bg-slate-900/80 rounded-lg backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <Users className="text-cyan-400 w-5 h-5" />
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
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Struktur Kelas
                </h1>
                <p className="text-xs text-cyan-200/80 mt-0.5">
                  Organisasi <b className="text-cyan-300">PI23A</b>
                </p>
              </div>
            </motion.div>

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
        </motion.div>

        {/* Ketua Kelas */}
        <section className="max-w-2xl mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-4"
          >
            <h2 className="text-lg font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              Ketua Kelas
            </h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mt-1 rounded-full"></div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center"
          >
            {struktur.map((orang, i) => {
              const IconComponent = orang.icon
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -4,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  className="relative group cursor-pointer w-full max-w-xs"
                >
                  {/* Gradient Border */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${orang.warna} rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300`} />
                  
                  {/* Main Card */}
                  <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-lg p-4 text-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${orang.warna} flex items-center justify-center shadow-lg`}
                    >
                      <IconComponent className="text-white w-5 h-5" />
                    </motion.div>

                    {/* Name */}
                    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300 group-hover:bg-clip-text transition-all">
                      {orang.nama.split(' ')[0]} {orang.nama.split(' ')[1]}
                    </h3>

                    {/* NIM */}
                    <p className="text-cyan-200/70 text-xs mb-1">
                      {orang.nim}
                    </p>

                    {/* Position */}
                    <p className="text-xs text-cyan-300/80 font-medium">
                      {orang.jabatan}
                    </p>

                    {/* Decorative Elements */}
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </section>

        {/* Garis pemisah */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-2xl mx-auto my-6 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
        />

        {/* SIPEN */}
        <section className="max-w-4xl mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-4"
          >
            <h2 className="text-lg font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              Tim SIPEN
            </h2>
            <p className="text-cyan-200/70 text-xs mt-0.5">
              {sipen.length} penanggung jawab mata kuliah
            </p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mt-1 rounded-full"></div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {sipen.map((item, i) => {
              const IconComponent = item.icon
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -2,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  className="relative group cursor-pointer"
                >
                  {/* Gradient Border */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.warna} rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-300`} />
                  
                  {/* Main Card */}
                  <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-lg p-3 border border-white/10 group-hover:border-white/20 transition-all duration-300 h-full">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.05 }}
                      className={`w-8 h-8 mb-2 rounded-lg bg-gradient-to-br ${item.warna} flex items-center justify-center shadow-lg`}
                    >
                      <IconComponent className="text-white w-4 h-4" />
                    </motion.div>

                    {/* Mata Kuliah */}
                    <h4 className="text-xs font-semibold text-cyan-300 mb-1 line-clamp-2 leading-tight">
                      {item.matkul.split(' ')[0]}
                    </h4>

                    {/* Nama */}
                    <h3 className="font-bold text-white text-xs mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-cyan-300 group-hover:bg-clip-text transition-all leading-tight">
                      {item.nama.split(' ')[0]} {item.nama.split(' ')[1]}
                    </h3>

                    {/* NIM */}
                    <p className="text-cyan-200/70 text-[10px]">
                      {item.nim}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </section>

        {/* Garis pemisah */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="max-w-4xl mx-auto my-6 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
        />

        {/* Anggota Kelas */}
        <section className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center mb-4"
          >
            <h2 className="text-lg font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Anggota Kelas
            </h2>
            <p className="text-cyan-200/70 text-xs mt-0.5">
              {anggota.length} anggota aktif
            </p>
            <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mt-1 rounded-full"></div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"
          >
            {anggota.map((orang, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  transition: { type: "spring", stiffness: 400 }
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative cursor-pointer"
              >
                {/* Hover Effect Background */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300" />
                
                {/* Main Card */}
                <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-2 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  {/* Avatar Indicator */}
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto mb-1 opacity-60 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Name */}
                  <p className="text-xs font-medium text-cyan-200 group-hover:text-white transition-colors text-center line-clamp-2 leading-tight">
                    {orang.nama}
                  </p>
                  
                  {/* NIM */}
                  <p className="text-[10px] text-cyan-400/70 text-center mt-0.5">
                    {orang.nim}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="max-w-2xl mx-auto mt-6 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: "Total Anggota", value: anggota.length },
              { label: "Ketua Kelas", value: 1 },
              { label: "Tim SIPEN", value: sipen.length },
              { label: "Kelas", value: "PI23A" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-md rounded-lg p-2 border border-white/10"
              >
                <div className="text-base font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-cyan-200/70 mt-0.5">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="max-w-2xl mx-auto mt-4 text-center"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-cyan-200/70">Struktur Organisasi Kelas</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xs text-cyan-200/60 ">
              Pendidikan Informatika 2023 • 
              <span className="text-cyan-400 ml-1">Team Gacor</span>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}