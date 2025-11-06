"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Sparkles, Search, X, Mail, Github, Instagram, Crown, Star, User } from "lucide-react"

interface Anggota {
  nama: string
  nim: string
  role: string
  hobi: string
  foto: string
  quote?: string
  socials?: {
    instagram?: string
    github?: string
    email?: string
  }
}

export default function ProfilPage() {
  const [flipped, setFlipped] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>("semua")
  const [searchQuery, setSearchQuery] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Fix hydration
useEffect(() => {
  // Jalankan async agar tidak dianggap sinkron
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

  // Data anggota kelas
  const anggota: Anggota[] = [
    {
      nama: "Rey Langko",
      nim: "237111024",
      role: "Ketua Kelas",
      hobi: "Ngoding & Desain",
      foto: "/assets/rey.JPG",
      quote: "Code today, lead tomorrow 💻",
      socials: {
        instagram: "@hyugaa_r",
        github: "reylangko",
        email: "reyylangko@gmail.com"
      }
    },
    {
      nama: "Jasmine Adelia Ndun",
      nim: "237111015",
      role: "Anggota",
      hobi: "Membaca & Traveling",
      foto: "/assets/jasmine.jpg",
      quote: "Keep learning, keep growing 📚",
    },
    {
      nama: "Anjela Ersa Kartini",
      nim: "237111003",
      role: "Anggota",
      hobi: "Fotografi & Musik",
      foto: "/assets/anjela.jpg",
      quote: "Capture every beautiful moment 📸",
    },
    {
      nama: "Dedryon R. Loak",
      nim: "237111005",
      role: "Anggota",
      hobi: "Olahraga & Gaming",
      foto: "/assets/dedryon.jpg",
      quote: "Game on! Level up your life 🎮",
    },
    {
      nama: "Emanuel S. Latu",
      nim: "237111009",
      role: "Anggota",
      hobi: "Programming & Robotika",
      foto: "/assets/emanuel.jpg",
      quote: "Building the future with code 🤖",
    },
    {
      nama: "Alfrido Yoseph Seran",
      nim: "237111002",
      role: "Anggota",
      hobi: "Basket & Teknologi",
      foto: "/assets/alfrido.jpg",
      quote: "Shoot for the stars 🏀",
    },
    {
      nama: "Lidia Y. Naiheli",
      nim: "237111017",
      role: "Anggota",
      hobi: "Menulis & Seni",
      foto: "/assets/lidia.jpg",
      quote: "Words can change the world ✍️",
    },
    {
      nama: "Regina Selan",
      nim: "237111023",
      role: "Anggota",
      hobi: "Dance & Design",
      foto: "/assets/regina.jpg",
      quote: "Dance to your own rhythm 💃",
    },
    {
      nama: "Filadelfia Ndun",
      nim: "237111011",
      role: "Anggota",
      hobi: "Research & Science",
      foto: "/assets/filadelfia.jpg",
      quote: "Curiosity leads to discovery 🔬",
    },
    {
      nama: "Eugenius Robinus Nour",
      nim: "237111010",
      role: "Anggota",
      hobi: "AI & Machine Learning",
      foto: "/assets/eugenius.jpg",
      quote: "Teaching machines to think 🧠",
    },
    {
      nama: "Gratcia R. K Berek",
      nim: "237111012",
      role: "Sipen - Pengembangan Bahan Ajar",
      hobi: "Teaching & Content Creation",
      foto: "/assets/gratcia.jpg",
      quote: "Sharing knowledge, inspiring minds 📖",
    },
    {
      nama: "Lucky Daniel Mboeik",
      nim: "237111018",
      role: "Sipen - Pengembangan Media Game",
      hobi: "Game Development & 3D Modeling",
      foto: "/assets/lucky.jpg",
      quote: "Creating worlds through code 🎮",
    },
    {
      nama: "Umar Yanto Usman",
      nim: "237111032",
      role: "Anggota",
      hobi: "Networking & Cybersecurity",
      foto: "/assets/umar.jpg",
      quote: "Securing the digital world 🔒",
    },
    {
      nama: "Sindy Shantika C. Tsu",
      nim: "237111030",
      role: "Anggota",
      hobi: "UI/UX Design & Photography",
      foto: "/assets/sindy.jpg",
      quote: "Design with purpose, create with heart 🎨",
    },
    {
      nama: "Ranjas Sadrak Mbuik",
      nim: "237111022",
      role: "Sipen - Animasi Motion Grafis",
      hobi: "Animation & Video Editing",
      foto: "/assets/ranjas.jpg",
      quote: "Bringing stories to life through motion 🎬",
    },
    {
      nama: "Donsius Gadja Wadu",
      nim: "237111007",
      role: "Anggota",
      hobi: "Data Science & Analytics",
      foto: "/assets/donsius.jpg",
      quote: "Turning data into insights 📊",
    },
    {
      nama: "Victor Tamelab",
      nim: "237111033",
      role: "Anggota",
      hobi: "Mobile Development & IoT",
      foto: "/assets/victor.jpg",
      quote: "Connecting the world, one app at a time 📱",
    },
    {
      nama: "Niswar N. Ndolu",
      nim: "237111021",
      role: "Anggota",
      hobi: "Web Development & Cloud",
      foto: "/assets/niswar.jpg",
      quote: "Building for the cloud era ☁️",
    },
    {
      nama: "Elsa Sin",
      nim: "237111008",
      role: "Sipen",
      hobi: "Multimedia & Cloud",
      foto: "/assets/elsa.jpg",
      quote: "Building for the cloud ⚠️",
    },
    {
      nama: "Ricko Mbuik",
      nim: "237111025",
      role: "Sipen - Kecerdasan Buatan",
      hobi: "AI Research & Algorithms",
      foto: "/assets/riko.jpg",
      quote: "Making machines intelligent 🤖",
    },
    {
      nama: "Silfinus Malaiwali",
      nim: "237111029",
      role: "Anggota",
      hobi: "AI Research & Algorithms",
      foto: "/assets/silfinus.jpg",
      quote: "Making machines intelligent 🤖",
    },
    {
      nama: "Theo K. F. Oeina",
      nim: "237111031",
      role: "Anggota",
      hobi: "Software Engineering & DevOps",
      foto: "/assets/theo.jpg",
      quote: "Code, deploy, repeat 🔄",
    },
    {
      nama: "James Ishak Marlon Benu",
      nim: "237111014",
      role: "Anggota",
      hobi: "Database & System Architecture",
      foto: "/assets/james.jpg",
      quote: "Architecting robust systems 🏗️",
    },
    {
      nama: "Merlin Wahyuni Babis",
      nim: "237111020",
      role: "Anggota",
      hobi: "Digital Marketing & SEO",
      foto: "/assets/merlin.jpg",
      quote: "Connecting brands with audiences 🌐",
    },
    {
      nama: "Yansry Welanda Ester Dethan",
      nim: "237111034",
      role: "Anggota",
      hobi: "Creative Writing & Blogging",
      foto: "/assets/yansry.jpg",
      quote: "Telling stories that matter 📝",
    },
    {
      nama: "Meiman Befianto Lahagu",
      nim: "237111019",
      role: "Anggota",
      hobi: "Hardware & Embedded Systems",
      foto: "/assets/meiman.jpg",
      quote: "Where software meets hardware 💡",
    },
    {
      nama: "Yosua Nahak",
      nim: "237111035",
      role: "Anggota",
      hobi: "Entrepreneurship & Startups",
      foto: "/assets/yosua.jpg",
      quote: "Building the next big thing 🚀",
    },
    {
      nama: "Klemensia Tea",
      nim: "237111016",
      role: "Sipen - Pemrograman Web",
      hobi: "Web Development & Design",
      foto: "/assets/klemensia.jpg",
      quote: "Crafting beautiful web experiences 🌐",
    },
    {
      nama: "Sandro Pangga Leghu",
      nim: "237111027",
      role: "Sipen - Mobile Learning",
      hobi: "Mobile Apps & E-Learning",
      foto: "/assets/sandro.jpg",
      quote: "Learning in the palm of your hand 📱",
    },
    {
      nama: "Inosensius S. Banggo",
      nim: "237111013",
      role: "Anggota",
      hobi: "Research & Academic Writing",
      foto: "/assets/inosensius.jpg",
      quote: "Pushing the boundaries of knowledge 🔍",
    }
  ]

  // Filter dan search
  const filteredAnggota = anggota.filter(anggota => {
    const matchesFilter = activeFilter === "semua" ? true : 
      activeFilter === "pengurus" ? (anggota.role.includes("Ketua") || anggota.role.includes("Sipen")) :
      activeFilter === "sipen" ? anggota.role.includes("Sipen") : true
    
    const matchesSearch = searchQuery === "" || 
      anggota.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      anggota.nim.includes(searchQuery) ||
      anggota.role.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  // Warna berbeda untuk setiap role
  const getRoleColor = (role: string) => {
    if (role.includes("Ketua")) return {
      gradient: "from-purple-500 to-pink-500",
      bg: "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/30",
      icon: <Crown className="w-3 h-3" />,
      badge: "👑",
      text: "text-purple-300"
    }
    if (role.includes("Sipen")) return {
      gradient: "from-cyan-500 to-blue-500", 
      bg: "bg-gradient-to-r from-cyan-500/20 to-blue-500/20",
      border: "border-cyan-500/30",
      icon: <Star className="w-3 h-3" />,
      badge: "⭐",
      text: "text-cyan-300"
    }
    return {
      gradient: "from-emerald-500 to-green-500",
      bg: "bg-gradient-to-r from-emerald-500/20 to-green-500/20", 
      border: "border-emerald-500/30",
      icon: <User className="w-3 h-3" />,
      badge: "👤",
      text: "text-emerald-300"
    }
  }

  // Fungsi untuk handle klik card
  const handleCardClick = (index: number) => {
    setFlipped(flipped === index ? null : index)
  }

  // Fungsi untuk handle klik close di card back
  const handleCloseClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    setFlipped(null)
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-300">Memuat profil...</p>
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
            {/* Logo & Title */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <div className="w-9 h-9 bg-slate-900/80 rounded-lg backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <Sparkles className="text-cyan-400 w-5 h-5" />
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 border border-cyan-400/30 rounded-xl"
                />
              </div>
              
              <div>
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600 bg-clip-text text-transparent">
                  Profil Anggota
                </h1>
                <p className="text-xs text-cyan-200/80 mt-0.5">
                  Kelas <b className="text-cyan-300">PI23A</b> • {anggota.length} talenta
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

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-7xl mx-auto mb-6"
        >
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Total", value: anggota.length, emoji: "👥", color: "from-cyan-500/20 to-blue-500/20" },
              { label: "Pengurus", value: 8, emoji: "⭐", color: "from-purple-500/20 to-pink-500/20" },
              { label: "SIPEN", value: 7, emoji: "🎯", color: "from-cyan-500/20 to-purple-500/20" },
              { label: "Semester", value: "5A", emoji: "📚", color: "from-emerald-500/20 to-green-500/20" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`bg-gradient-to-r ${stat.color} backdrop-blur-lg rounded-xl p-3 border border-white/10 text-center hover:border-cyan-500/30 transition-all duration-300`}
              >
                <div className="text-lg mb-1">{stat.emoji}</div>
                <div className="text-sm font-bold text-white">{stat.value}</div>
                <div className="text-[10px] text-cyan-200/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-7xl mx-auto mb-6 space-y-3"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari nama, NIM, atau peran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { key: "semua", label: "👥 Semua", count: anggota.length },
              { key: "pengurus", label: "⭐ Pengurus", count: 8 },
              { key: "sipen", label: "🎯 SIPEN", count: 7 },
            ].map((filter) => (
              <motion.button
                key={filter.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-3 py-2 rounded-lg border transition-all duration-300 backdrop-blur-lg whitespace-nowrap flex-shrink-0 text-xs ${
                  activeFilter === filter.key
                    ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-500/20"
                    : "bg-white/5 border-white/10 text-cyan-200 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {filter.label} <span className="opacity-70">({filter.count})</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Profile Grid - 3 kolom untuk HP */}
        <section className="max-w-7xl mx-auto">
          {filteredAnggota.length === 0 ? (
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
                <Sparkles size={64} className="mx-auto opacity-50 text-cyan-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-cyan-200 mb-2">
                Tidak ada hasil
              </h3>
              <p className="text-cyan-200/70">
                Coba ubah pencarian atau filter Anda
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredAnggota.map((mhs, i) => {
                const roleStyle = getRoleColor(mhs.role)
                
                return (
                  <motion.div
                    key={mhs.nim}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: i * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="group relative cursor-pointer"
                    onClick={() => handleCardClick(i)}
                  >
                    {/* Hover Glow Effect */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${roleStyle.gradient} rounded-xl blur opacity-0 group-hover:opacity-70 transition duration-300`} />
                    
                    {/* Main Glass Card */}
                    <div className="relative bg-slate-900/40 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 group-hover:border-cyan-500/30 transition-all duration-300 h-full">
                      
                      {/* Front Side */}
                      {flipped !== i && (
                        <div className="h-full flex flex-col">
                          {/* Photo with Glass Overlay */}
                          <div className="relative h-32 overflow-hidden">
                            <Image
                              src={mhs.foto}
                              alt={mhs.nama}
                              fill
                              className="object-cover transition-all duration-500 group-hover:scale-110"
                              sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/assets/default-avatar.jpg"
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                            
                            {/* Role Badge */}
                            <div className={`absolute top-2 right-2 ${roleStyle.bg} backdrop-blur-lg rounded-full px-2 py-1 text-[10px] font-semibold text-white border ${roleStyle.border} flex items-center gap-1`}>
                              {roleStyle.icon}
                            </div>
                          </div>

                          {/* Info Section */}
                          <div className="p-2 flex-1 flex flex-col">
                            <h3 className="font-bold text-xs text-white mb-1 leading-tight line-clamp-2">
                              {mhs.nama.split(' ')[0]}
                            </h3>
                            <p className="text-cyan-300 text-[10px] font-mono mb-1">#{mhs.nim.slice(-3)}</p>
                            <p className="text-[10px] text-cyan-200/80 italic line-clamp-2 mb-2">
                              &quot;{mhs.quote}&quot;
                            </p>
                          </div>

                          {/* Flip Hint */}
                          <div className="px-2 pb-2">
                            <div className="text-[10px] text-cyan-400/60 text-center group-hover:text-cyan-300 transition-colors">
                              Detail
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Back Side - Flip Card dengan design yang rapi */}
                      {flipped === i && (
                        <div className={`absolute inset-0 ${roleStyle.bg} backdrop-blur-xl rounded-xl border ${roleStyle.border} overflow-hidden`}>
                          <div className="h-full flex flex-col p-2">
                            {/* Header dengan Close Button */}
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-sm text-white leading-tight truncate">
                                  {mhs.nama.split(' ')[0]}
                                </h3>
                                <p className="text-cyan-300 text-[10px] font-mono truncate">{mhs.nim}</p>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors backdrop-blur-sm flex-shrink-0 ml-2"
                                onClick={(e) => handleCloseClick(e, i)}
                              >
                                <X size={10} />
                              </motion.button>
                            </div>

                            {/* Role Section */}
                            <div className="mb-2">
                              <div className="bg-black/20 backdrop-blur-lg rounded-lg p-2 border border-white/10">
                                <div className="flex items-center gap-1 mb-1">
                                  {roleStyle.icon}
                                  <span className="text-[10px] font-bold text-white">Peran</span>
                                </div>
                                <p className="text-white/90 text-[10px] leading-tight font-medium line-clamp-2">
                                  {mhs.role}
                                </p>
                              </div>
                            </div>

                            {/* Hobi Section */}
                            <div className="mb-2">
                              <div className="bg-black/20 backdrop-blur-lg rounded-lg p-2 border border-white/10">
                                <div className="flex items-center gap-1 mb-1">
                                  <Sparkles className="w-3 h-3 text-cyan-400" />
                                  <span className="text-[10px] font-bold text-cyan-300">Hobi</span>
                                </div>
                                <p className="text-white/90 text-[10px] leading-tight font-medium line-clamp-2">
                                  {mhs.hobi}
                                </p>
                              </div>
                            </div>

                            {/* Social Links */}
                            {mhs.socials && (
                              <div className="mb-2">
                                <div className="flex justify-center gap-1">
                                  {mhs.socials.instagram && (
                                    <motion.a
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="w-6 h-6 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full flex items-center justify-center hover:from-pink-500/30 hover:to-rose-500/30 transition-colors backdrop-blur-sm border border-pink-500/30"
                                      href={`https://instagram.com/${mhs.socials.instagram.replace('@', '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Instagram size={10} className="text-pink-400" />
                                    </motion.a>
                                  )}
                                  {mhs.socials.github && (
                                    <motion.a
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="w-6 h-6 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full flex items-center justify-center hover:from-purple-500/30 hover:to-indigo-500/30 transition-colors backdrop-blur-sm border border-purple-500/30"
                                      href={`https://github.com/${mhs.socials.github}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Github size={10} className="text-purple-400" />
                                    </motion.a>
                                  )}
                                  {mhs.socials.email && (
                                    <motion.a
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="w-6 h-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center hover:from-cyan-500/30 hover:to-blue-500/30 transition-colors backdrop-blur-sm border border-cyan-500/30"
                                      href={`mailto:${mhs.socials.email}`}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Mail size={10} className="text-cyan-400" />
                                    </motion.a>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Quote */}
                            <div className="mt-auto text-center">
                              <p className="text-[10px] italic text-cyan-300/80 leading-tight line-clamp-3">
                                &quot;{mhs.quote}&quot;
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </section>

        {/* Footer Info - Lebar Penuh */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.6 }}
  className="w-full mx-auto mt-6 " // Hapus max-w-2xl dan gunakan w-full
>
  <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 mx-0 sm:mx-2 text-center ">
  <div className="flex items-center justify-center gap-2 mb-2">
    <Sparkles className="w-4 h-4 text-cyan-400" />
    <span className="text-xs text-cyan-200/70">Profile Mahasiswa Angkatan 2023</span>
    <Sparkles className="w-4 h-4 text-cyan-400" />
  </div>

  <p className="text-xs text-cyan-200/60">
    Kelas PI23A • FKIP • 
    <span className="text-cyan-400 ml-1">UCB</span>
  </p>
</div>

</motion.div>
      </div>

      {/* Custom Scrollbar Hide */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}