"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Info, Users, School, Calendar, MapPin, Instagram, Globe, Sparkles, Award, BookOpen, Heart, GraduationCap, Crown, Code, UserCheck } from "lucide-react"

export default function Informasi() {
  const [darkMode, setDarkMode] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    queueMicrotask(() => {
      setIsMounted(true)
      const storedDarkMode = localStorage.getItem("darkMode")
      if (storedDarkMode) {
        setDarkMode(JSON.parse(storedDarkMode))
      }
    })
  }, [])

  // Animated Background Effect
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
    
    let viewportWidth = window.innerWidth
    let viewportHeight = window.innerHeight

    const initParticles = () => {
      particles = []
      for (let i = 0; i < 60; i++) {
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

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      viewportWidth = window.innerWidth
      viewportHeight = window.innerHeight
      
      canvas.width = viewportWidth * dpr
      canvas.height = viewportHeight * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${viewportWidth}px`
      canvas.style.height = `${viewportHeight}px`
      
      canvas.style.position = 'fixed'
      canvas.style.top = '0'
      canvas.style.left = '0'
      canvas.style.zIndex = '0'
    }

    setCanvasSize()
    initParticles()

    const animate = () => {
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, viewportWidth, viewportHeight)

      particles.forEach((particle, index) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x > viewportWidth) particle.x = 0
        else if (particle.x < 0) particle.x = viewportWidth
        if (particle.y > viewportHeight) particle.y = 0
        else if (particle.y < 0) particle.y = viewportHeight

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = 0.8
        ctx.fill()

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

  // Fungsi untuk handle klik
  const handleInstagramClick = () => {
    window.open("https://www.instagram.com/pi_ucb_a23", "_blank")
  }

  const handleWebsiteClick = () => {
    window.open("https://ucb.ac.id", "_blank")
  }

  const handleInstitusiClick = () => {
    window.open("https://maps.google.com/?q=Universitas+Citra+Bangsa+Kupang", "_blank")
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-300">Memuat halaman...</p>
        </div>
      </div>
    )
  }

  const teamMembers = [
    {
      name: "Rey Langko",
      role: "Full Stack Developer",
      description: "Pengembang utama sistem portal kelas PI23A",
      avatar: "/assets/hyuga.jpg",
    },
    {
      name: "Ibu Diana Fallo, S.Kom., MT",
      role: "Academic Leader",
      description: "Pemimpin program studi Pendidikan Informatika",
      avatar: "/assets/kaprodi.png",
      icon: <Crown className="w-3 h-3" />
    },
    {
      name: "PI23A Community",
      role: "Class Members",
      description: "Seluruh anggota kelas PI23A yang berpartisipasi",
      avatar: "/assets/class.jpg",
      icon: <UserCheck className="w-3 h-3" />
    }
  ]

  return (
    <main className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-slate-950 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 text-gray-900'
    } relative overflow-hidden`}>
      
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      <div className="relative z-10 px-3 sm:px-6 pb-16 pt-3">
        {/* Header - Compact untuk Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mb-6 lg:mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <Link href="/kelas">
              <motion.button
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`group flex items-center gap-2 ${
                  darkMode ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20' : 'bg-gradient-to-r from-cyan-100 to-blue-100 hover:from-cyan-200 hover:to-blue-200'
                } backdrop-blur-md border ${
                  darkMode ? 'border-cyan-500/30 hover:border-cyan-400/50' : 'border-cyan-300 hover:border-cyan-400'
                } px-3 py-2 lg:px-4 lg:py-3 rounded-xl transition-all duration-300 shadow-lg`}
              >
                <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold text-sm lg:text-base">Dashboard</span>
              </motion.button>
            </Link>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex items-center gap-2 ${
                darkMode ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10' : 'bg-gradient-to-r from-purple-100 to-pink-100'
              } backdrop-blur-md border ${
                darkMode ? 'border-purple-500/30' : 'border-purple-300'
              } px-3 py-2 lg:px-5 lg:py-3 rounded-xl shadow-lg`}
            >
              <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center ${
                darkMode ? 'shadow-purple-500/30' : 'shadow-purple-500/20'
              }`}>
                <Info className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </div>
              <span className="font-bold text-sm lg:text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Tentang Kami
              </span>
            </motion.div>
          </div>

          {/* Hero Section - Compact untuk Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8 lg:mb-16"
          >
            {/* Logo UCB - Kecil di Mobile */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`w-14 h-14 lg:w-28 lg:h-28 mx-auto mb-4 lg:mb-6 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-xl lg:shadow-2xl ${
                darkMode ? 'shadow-cyan-500/30' : 'shadow-cyan-500/20'
              } relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className={`w-12 h-12 lg:w-24 lg:h-24 ${
                darkMode ? 'bg-slate-900/90' : 'bg-white/95'
              } rounded-xl lg:rounded-2xl backdrop-blur-sm border ${
                darkMode ? 'border-white/20' : 'border-gray-200'
              } flex items-center justify-center overflow-hidden`}>
                <Image
                  src="/assets/ucb.png"
                  alt="Logo UCB"
                  width={80}
                  height={80}
                  className="object-contain w-8 h-8 lg:w-16 lg:h-16"
                />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-2xl lg:text-5xl font-black bg-gradient-to-r ${
                darkMode 
                  ? 'from-cyan-300 via-blue-400 to-purple-500' 
                  : 'from-cyan-600 via-blue-600 to-purple-700'
              } bg-clip-text text-transparent mb-3 lg:mb-6 leading-tight`}
            >
              PI23A Portal
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`text-sm lg:text-xl ${
                darkMode ? 'text-cyan-200/90' : 'text-cyan-700/90'
              } max-w-3xl mx-auto leading-relaxed font-medium px-2`}
            >
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Generasi Digital Masa Depan
              </span>
              <br />
              <span className={`text-xs lg:text-base ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                Pendidikan Informatika Angkatan 2023
              </span>
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Class Photo Section - TETAP BESAR */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mb-6 lg:mb-12"
        >
          <div className={`${
            darkMode ? 'bg-white/5' : 'bg-white/80'
          } backdrop-blur-xl rounded-xl lg:rounded-2xl border ${
            darkMode ? 'border-white/10' : 'border-gray-200'
          } shadow-xl lg:shadow-2xl overflow-hidden`}>
            <div className="p-3 lg:p-6">
              <h2 className={`text-lg lg:text-2xl font-bold text-center mb-3 lg:mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Keluarga PI23A
              </h2>
              <div className="relative h-56 lg:h-80 rounded-lg lg:rounded-xl overflow-hidden">
                <Image
                  src="/assets/class.jpg"
                  alt="Foto Anggota Kelas PI23A"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const fallback = target.parentElement?.querySelector('.photo-fallback') as HTMLElement
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
                <div className="photo-fallback hidden w-full h-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600">
                  <Users className="w-12 h-12 lg:w-16 lg:h-16 text-white opacity-50" />
                </div>
              </div>
              <div className="mt-3 text-center">
                <h3 className={`font-bold text-base lg:text-xl mb-1 lg:mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Pendidikan Informatika - Kelas A
                </h3>
                <p className={`text-xs lg:text-base ${
                  darkMode ? 'text-cyan-200/70' : 'text-cyan-700/70'
                }`}>
                  Angkatan 2023 • Fakultas FKIP • Universitas Citra Bangsa
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Team Section - Compact Horizontal untuk Mobile */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-6xl mx-auto mb-8 lg:mb-16"
        >
          <div className="text-center mb-6 lg:mb-12">
            <motion.h2 
              className={`text-xl lg:text-3xl font-bold mb-2 lg:mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Tim <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Pengembang</span>
            </motion.h2>
            <p className={`text-sm lg:text-lg ${
              darkMode ? 'text-cyan-200/80' : 'text-cyan-700/80'
            } max-w-2xl mx-auto`}>
              Individu berdedikasi pembangun platform digital
            </p>
          </div>

          {/* Mobile: Horizontal Scroll, Desktop: Grid */}
          <div className="flex overflow-x-auto pb-3 gap-3 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible scrollbar-hide">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -3, scale: 1.02 }}
                className={`min-w-[240px] lg:min-w-0 flex-shrink-0 lg:flex-shrink group relative rounded-xl lg:rounded-2xl p-3 lg:p-6 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800' 
                    : 'bg-gradient-to-br from-white to-gray-50 hover:from-white hover:to-gray-100'
                } border-2 ${
                  darkMode ? 'border-slate-700 group-hover:border-cyan-500/30' : 'border-gray-200 group-hover:border-cyan-300'
                } shadow-lg hover:shadow-xl transition-all duration-300 text-center`}
              >
                {/* Background Effect */}
                <div className={`absolute inset-0 rounded-xl lg:rounded-2xl bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Avatar - Lebih Kecil di Mobile */}
                <div className="relative z-10 w-12 h-12 lg:w-20 lg:h-20 mx-auto mb-2 lg:mb-4">
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl lg:rounded-2xl flex items-center justify-center p-0.5">
                    <div className="w-full h-full bg-slate-900 rounded-lg lg:rounded-xl flex items-center justify-center overflow-hidden">
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const fallback = target.parentElement?.querySelector('.avatar-fallback') as HTMLElement
                          if (fallback) fallback.style.display = 'flex'
                        }}
                      />
                      <div className="avatar-fallback hidden w-full h-full items-center justify-center bg-purple-500/20">
                        {member.icon}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content - Text Lebih Kecil di Mobile */}
                <div className="relative z-10">
                  <h3 className={`font-bold text-sm lg:text-xl mb-1 lg:mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  } group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all`}>
                    {member.name}
                  </h3>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mb-1 lg:mb-3 ${
                    darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {member.icon}
                    <span className="text-xs">{member.role}</span>
                  </div>
                  <p className={`text-xs lg:text-sm ${
                    darkMode ? 'text-cyan-200/70' : 'text-cyan-700/70'
                  } leading-relaxed`}>
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scroll Indicator untuk Mobile */}
          <div className="lg:hidden flex justify-center mt-3">
            <div className={`flex items-center gap-1 text-xs ${
              darkMode ? 'text-cyan-400/60' : 'text-cyan-600/60'
            }`}>
              <span>← scroll →</span>
            </div>
          </div>
        </motion.section>

        {/* Contact & Info Section - Compact untuk Mobile */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className={`rounded-2xl lg:rounded-3xl ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-800 to-slate-900' 
              : 'bg-gradient-to-br from-white to-gray-50'
          } border-2 ${
            darkMode ? 'border-cyan-500/20' : 'border-cyan-300'
          } shadow-xl lg:shadow-2xl overflow-hidden`}>
            
            <div className="p-4 lg:p-8">
              {/* Header */}
              <div className="text-center mb-6 lg:mb-8">
                <motion.h2 
                  className={`text-xl lg:text-3xl font-bold mb-2 lg:mb-3 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Informasi
                  </span> Kontak
                </motion.h2>
                <p className={`text-sm lg:text-base ${
                  darkMode ? 'text-cyan-200/80' : 'text-cyan-700/80'
                }`}>
                  Terhubung dengan kami melalui berbagai platform
                </p>
              </div>

              {/* Informasi Kontak - Grid 2x2 Compact */}
              <div className="grid grid-cols-2 gap-3 lg:gap-6 mb-6 lg:mb-8">
                {/* Institusi - Klik untuk buka Maps */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  onClick={handleInstitusiClick}
                  className={`flex flex-col items-center text-center p-3 lg:p-5 rounded-xl lg:rounded-2xl ${
                    darkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-white hover:bg-gray-50'
                  } border ${
                    darkMode ? 'border-slate-700 hover:border-cyan-500/30' : 'border-gray-200 hover:border-cyan-300'
                  } shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}
                >
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-2 lg:mb-3 ${
                    darkMode ? 'shadow-lg' : 'shadow-md'
                  } group-hover:scale-110 transition-transform duration-300`}>
                    <School className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <h3 className={`font-bold text-xs lg:text-base mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>Institusi</h3>
                  <p className={`text-xs lg:text-sm ${
                    darkMode ? 'text-cyan-200' : 'text-cyan-700'
                  } font-medium`}>Universitas Citra Bangsa</p>
                  <span className={`text-xs mt-1 ${
                    darkMode ? 'text-cyan-400/70' : 'text-cyan-600/70'
                  }`}>Klik untuk lihat lokasi</span>
                </motion.div>

                {/* Lokasi */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`flex flex-col items-center text-center p-3 lg:p-5 rounded-xl lg:rounded-2xl ${
                    darkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-white hover:bg-gray-50'
                  } border ${
                    darkMode ? 'border-slate-700 hover:border-purple-500/30' : 'border-gray-200 hover:border-purple-300'
                  } shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-2 lg:mb-3 ${
                    darkMode ? 'shadow-lg' : 'shadow-md'
                  }`}>
                    <MapPin className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <h3 className={`font-bold text-xs lg:text-base mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>Lokasi</h3>
                  <p className={`text-xs lg:text-sm ${
                    darkMode ? 'text-cyan-200' : 'text-cyan-700'
                  } font-medium`}>Kupang, NTT</p>
                </motion.div>

                {/* Instagram - Klik untuk buka Instagram */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  onClick={handleInstagramClick}
                  className={`flex flex-col items-center text-center p-3 lg:p-5 rounded-xl lg:rounded-2xl ${
                    darkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-white hover:bg-gray-50'
                  } border ${
                    darkMode ? 'border-slate-700 hover:border-amber-500/30' : 'border-gray-200 hover:border-amber-300'
                  } shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}
                >
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-2 lg:mb-3 ${
                    darkMode ? 'shadow-lg' : 'shadow-md'
                  } group-hover:scale-110 transition-transform duration-300`}>
                    <Instagram className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <h3 className={`font-bold text-xs lg:text-base mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>Instagram</h3>
                  <p className={`text-xs lg:text-sm ${
                    darkMode ? 'text-cyan-200' : 'text-cyan-700'
                  } font-medium`}>@pi_ucb_a23</p>
                  <span className={`text-xs mt-1 ${
                    darkMode ? 'text-amber-400/70' : 'text-amber-600/70'
                  }`}>Klik untuk follow</span>
                </motion.div>

                {/* Website - Klik untuk buka Website */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  onClick={handleWebsiteClick}
                  className={`flex flex-col items-center text-center p-3 lg:p-5 rounded-xl lg:rounded-2xl ${
                    darkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-white hover:bg-gray-50'
                  } border ${
                    darkMode ? 'border-slate-700 hover:border-green-500/30' : 'border-gray-200 hover:border-green-300'
                  } shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}
                >
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-2 lg:mb-3 ${
                    darkMode ? 'shadow-lg' : 'shadow-md'
                  } group-hover:scale-110 transition-transform duration-300`}>
                    <Globe className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <h3 className={`font-bold text-xs lg:text-base mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>Website</h3>
                  <p className={`text-xs lg:text-sm ${
                    darkMode ? 'text-cyan-200' : 'text-cyan-700'
                  } font-medium`}>ucb.ac.id</p>
                  <span className={`text-xs mt-1 ${
                    darkMode ? 'text-green-400/70' : 'text-green-600/70'
                  }`}>Klik untuk kunjungi</span>
                </motion.div>
              </div>

              {/* Mission Statement - Compact */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className={`rounded-xl lg:rounded-2xl p-4 lg:p-8 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20' 
                    : 'bg-gradient-to-br from-cyan-50 to-purple-50 border border-cyan-200'
                }`}
              >
                <div className="text-center mb-4 lg:mb-6">
                  <Award className={`w-6 h-6 lg:w-10 lg:h-10 mx-auto mb-2 lg:mb-3 ${
                    darkMode ? 'text-amber-400' : 'text-amber-500'
                  }`} />
                  <h3 className={`font-bold text-lg lg:text-2xl mb-3 lg:mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Visi & Misi <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">PI23A</span>
                  </h3>
                </div>
                
                <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:gap-8">
                  <div>
                    <h4 className={`font-semibold text-sm lg:text-lg mb-2 lg:mb-3 flex items-center gap-2 ${
                      darkMode ? 'text-cyan-300' : 'text-cyan-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-cyan-400`}></span>
                      🎯 Visi Kami
                    </h4>
                    <p className={`text-xs lg:text-base ${
                      darkMode ? 'text-cyan-200/80' : 'text-cyan-700/80'
                    } leading-relaxed`}>
                      Menjadi komunitas akademik digital yang inovatif dan kolaboratif, 
                      mencetak generasi edukator teknologi yang kompeten.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className={`font-semibold text-sm lg:text-lg mb-2 lg:mb-3 flex items-center gap-2 ${
                      darkMode ? 'text-purple-300' : 'text-purple-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-purple-400`}></span>
                      🚀 Misi Kami
                    </h4>
                    <ul className={`text-xs lg:text-base ${
                      darkMode ? 'text-cyan-200/80' : 'text-cyan-700/80'
                    } space-y-1 lg:space-y-2 leading-relaxed`}>
                      <li className="flex items-start gap-2">
                        <span className={`w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full mt-1 lg:mt-2 flex-shrink-0 ${
                          darkMode ? 'bg-cyan-400' : 'bg-cyan-500'
                        }`}></span>
                        Mengembangkan kompetensi informatika pendidikan
                      </li>
                      <li className="flex items-start gap-2">
                        <span className={`w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full mt-1 lg:mt-2 flex-shrink-0 ${
                          darkMode ? 'bg-purple-400' : 'bg-purple-500'
                        }`}></span>
                        Membangun ekosistem belajar kolaboratif
                      </li>
                      <li className="flex items-start gap-2">
                        <span className={`w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full mt-1 lg:mt-2 flex-shrink-0 ${
                          darkMode ? 'bg-pink-400' : 'bg-pink-500'
                        }`}></span>
                        Menerapkan teknologi digital dalam pembelajaran
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Info Box */}
                <div className={`mt-4 lg:mt-6 p-3 lg:p-4 rounded-lg lg:rounded-xl ${
                  darkMode ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-cyan-100 border border-cyan-200'
                }`}>
                  <div className="flex flex-wrap justify-center gap-2 lg:gap-4 text-xs lg:text-sm font-semibold">
                    <span className={`flex items-center gap-1 lg:gap-2 ${
                      darkMode ? 'text-cyan-300' : 'text-cyan-700'
                    }`}>
                      <GraduationCap className="w-3 h-3 lg:w-4 lg:h-4" />
                      Pendidikan Informatika
                    </span>
                    <span className={`flex items-center gap-1 lg:gap-2 ${
                      darkMode ? 'text-purple-300' : 'text-purple-700'
                    }`}>
                      <School className="w-3 h-3 lg:w-4 lg:h-4" />
                      Fakultas FKIP
                    </span>
                    <span className={`flex items-center gap-1 lg:gap-2 ${
                      darkMode ? 'text-pink-300' : 'text-pink-700'
                    }`}>
                      <Users className="w-3 h-3 lg:w-4 lg:h-4" />
                      Kelas A • 2023
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <div className={`px-4 py-3 lg:px-8 lg:py-6 ${
              darkMode 
                ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-t border-cyan-500/10' 
                : 'bg-gradient-to-r from-cyan-50 to-purple-50 border-t border-cyan-200'
            }`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 lg:gap-4">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center ${
                    darkMode ? 'shadow-cyan-500/30' : 'shadow-cyan-500/20'
                  }`}>
                    <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                  </div>
                  <span className={`text-xs lg:text-sm font-medium ${
                    darkMode ? 'text-cyan-200' : 'text-cyan-700'
                  }`}>
                    Inovasi Digital untuk Pendidikan
                  </span>
                </div>
                
                <div className="flex items-center gap-1 lg:gap-2 text-xs">
                  <Heart className={`w-2 h-2 lg:w-3 lg:h-3 ${
                    darkMode ? 'text-pink-400' : 'text-pink-500'
                  }`} />
                  <span className={darkMode ? 'text-cyan-200/60' : 'text-cyan-700/60'}>
                    © 2025 PI23A • Pendidikan Informatika • UCB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Floating Elements */}
      {isMounted && darkMode && (
        <>
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