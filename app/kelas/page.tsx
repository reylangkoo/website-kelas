"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { LogOut, Calendar, MessageCircle, Users, User, Image as ImageIcon, Sparkles, Zap, Target, TrendingUp, Clock, BookOpen, Settings, X, Sun, Moon, Info } from "lucide-react"
import { Instagram } from "lucide-react"

// Interface untuk tipe data
interface Task {
  id: number
  title: string
  due: string
  course: string
}

interface ScheduleItem {
  time: string
  course: string
  room: string
  day: string
}

interface ForumMessage {
  id: number
  user: string
  message: string
  timestamp: Date
  isNew: boolean
}

// Mock data untuk simulasi fungsi
const MOCK_DATA = {
  tasks: [
    { id: 1, title: "Tugas Algoritma", due: "2 jam lagi", course: "Algoritma & Pemrograman" },
    { id: 2, title: "Essay Pendidikan", due: "Besok", course: "Filsafat Pendidikan" },
  ] as Task[],
}

// Data jadwal kuliah sesuai permintaan
const SCHEDULE_DATA: ScheduleItem[] = [
  { 
    time: "13:00-15:00", 
    course: "Sistem Keamanan Informasi", 
    room: "Ruang PI-2",
    day: "Senin"
  },
  { 
    time: "08:00-10:00", 
    course: "Kecerdasan Buatan", 
    room: "Ruang PI-1",
    day: "Selasa"
  },
  { 
    time: "08:00-10:00", 
    course: "Mobile Learning", 
    room: "Ruang PI-2",
    day: "Rabu"
  },
  { 
    time: "13:00-16:00", 
    course: "Pengembangan Media dan Game", 
    room: "Ruang PI-1",
    day: "Rabu"
  },
  {
      day: "Kamis",
      course: "Animasi & Motion Grafis",
      time: "10.00–12.00",
      room: "Lab. Kom",
    },
  { 
    time: "13:00-15:00", 
    course: "Pengembangan Bahan Ajar", 
    room: "Lab. Kom",
    day: "Kamis"
  },
  { 
    time: "07:00-Selesai", 
    course: "Pemrograman Web", 
    room: "Ruang PI-3",
    day: "Jumat"
  }
]

// Firebase simulation untuk forum messages
let forumMessages: ForumMessage[] = []
let forumListeners: ((messages: ForumMessage[]) => void)[] = []

const forumSimulation = {
  subscribe: (callback: (messages: ForumMessage[]) => void) => {
    forumListeners.push(callback)
    callback(forumMessages)
    return () => {
      forumListeners = forumListeners.filter(listener => listener !== callback)
    }
  },
  addMessage: (message: ForumMessage) => {
    forumMessages = [...forumMessages, message]
    forumListeners.forEach(listener => listener(forumMessages))
  },
  getNewMessagesCount: () => {
    return forumMessages.filter(msg => msg.isNew).length
  }
}

export default function Dashboard() {
  const [nama, setNama] = useState("Mahasiswa")
  const [currentTime, setCurrentTime] = useState("")
  const [activeHover, setActiveHover] = useState<number | null>(null)
  const [tasks] = useState<Task[]>(MOCK_DATA.tasks)
  const [showSettings, setShowSettings] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [newForumMessages, setNewForumMessages] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Fix hydration: Set mounted state after component mounts
  useEffect(() => {
    // Tunda eksekusi state agar tidak dianggap sinkron
    queueMicrotask(() => {
      setIsMounted(true)

      const storedName = localStorage.getItem("namaUser") || "Mahasiswa"
      setNama(storedName)

      const updateTime = () => {
        const now = new Date()
        setCurrentTime(
          now.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        )
      }

      updateTime()
      const interval = setInterval(updateTime, 1000)

      const today = new Date().toLocaleDateString("id-ID", { weekday: "long" })
      const filtered = SCHEDULE_DATA.filter(
        (item) => item.day.toLowerCase() === today.toLowerCase()
      )
      setTodaySchedule(filtered)

      const unsubscribe = forumSimulation.subscribe((messages) => {
        const newMsgs = messages.filter((msg) => msg.isNew).length
        setNewForumMessages(newMsgs)
      })

      const forumInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          const newMsg: ForumMessage = {
            id: Date.now(),
            user: "Teman Kelas",
            message: "Ada yang bisa bantu tugas ini?",
            timestamp: new Date(),
            isNew: true,
          }
          forumSimulation.addMessage(newMsg)
        }
      }, 10000)

      // cleanup
      return () => {
        clearInterval(interval)
        clearInterval(forumInterval)
        unsubscribe()
      }
    })
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

  const showCustomFeedback = (message: string) => {
    setFeedbackMessage(message)
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
    }, 3000)
  }

  const handleInstagramClick = () => {
    window.open("https://www.instagram.com/pi_ucb_a23", "_blank")
    showCustomFeedback("Membuka Instagram PI23A!")
  }

  const handleTotalMataKuliah = () => {
    showCustomFeedback("Total 7 mata kuliah aktif")
  }

  const handleTugasMendatang = () => {
    showCustomFeedback(`${tasks.length} tugas perlu perhatian`)
  }

  const handleKehadiran = () => {
    showCustomFeedback("Kehadiran Anda 94% - Excellent!")
  }

  const stats = [
    { 
      label: "Total Mata Kuliah", 
      value: "7", 
      icon: BookOpen, 
      change: "+0",
      onClick: handleTotalMataKuliah
    },
    { 
      label: "Tugas Mendatang", 
      value: tasks.length.toString(), 
      icon: Target, 
      change: `${tasks.filter(t => t.due.includes('jam') || t.due.includes('Besok')).length} urgent`,
      onClick: handleTugasMendatang
    },
    { 
      label: "Kehadiran", 
      value: "94%", 
      icon: TrendingUp, 
      change: "+2%",
      onClick: handleKehadiran
    },
    { 
      label: "Instagram", 
      value: "PI23A", 
      icon: Instagram,
      change: "Terbaru",
      onClick: handleInstagramClick
    },
  ]

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    showCustomFeedback(`Mode ${newDarkMode ? 'Gelap' : 'Terang'} diaktifkan`)
  }

  const handleLogout = () => {
    showCustomFeedback("Sampai jumpa! Keluar dari sistem...")
    setTimeout(() => {
      localStorage.removeItem("namaUser")
      window.location.href = "/"
    }, 1500)
  }

  // Tampilkan loading sampai client siap (fix hydration)
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-300">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <main className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-slate-950 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 text-gray-900'
    } relative overflow-hidden`}>
      
      {/* Animated Canvas Background - SAMA PERSIS DENGAN LOGIN */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Custom Feedback Modal */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div
              className={`${
                darkMode ? 'bg-slate-800/95' : 'bg-white/95'
              } rounded-2xl p-8 max-w-sm mx-4 border ${
                darkMode ? 'border-cyan-500/50' : 'border-cyan-400/50'
              } shadow-2xl backdrop-blur-sm`}
            >
              <div className="text-center">
                <Sparkles className={`w-12 h-12 mx-auto mb-4 ${
                  darkMode ? 'text-cyan-400' : 'text-cyan-600'
                }`} />
                <h3 className={`text-lg font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Notifikasi
                </h3>
                <p className={darkMode ? 'text-cyan-200' : 'text-cyan-700'}>
                  {feedbackMessage}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 px-4 sm:px-6 pb-20 pt-4">
        {/* Header - Compact Layout */}
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
                <div className={`w-12 h-12 bg-gradient-to-br ${
                  darkMode ? 'from-cyan-400 to-blue-600' : 'from-cyan-500 to-blue-600'
                } rounded-xl flex items-center justify-center shadow-lg ${
                  darkMode ? 'shadow-cyan-500/30' : 'shadow-cyan-500/20'
                }`}>
                  <div className={`w-9 h-9 ${
                    darkMode ? 'bg-slate-900/80' : 'bg-white/90'
                  } rounded-lg backdrop-blur-sm border ${
                    darkMode ? 'border-white/20' : 'border-gray-200'
                  } flex items-center justify-center overflow-hidden`}>
                    <Image
                      src="/assets/ucb.png"
                      alt="Logo PI23A"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className={`absolute -inset-2 border ${
                    darkMode ? 'border-cyan-400/30' : 'border-cyan-500/30'
                  } rounded-xl`}
                />
              </div>
              
              {/* Title Text */}
              <div>
                <h1 className={`text-xl lg:text-2xl font-bold bg-gradient-to-r ${
                  darkMode 
                    ? 'from-cyan-400 via-blue-500 to-purple-600' 
                    : 'from-cyan-600 via-blue-600 to-purple-700'
                } bg-clip-text text-transparent`}>
                  Halo, {nama}! 👋
                </h1>
                <p className={`text-xs ${
                  darkMode ? 'text-cyan-200/80' : 'text-cyan-700/80'
                } mt-0.5`}>
                  Portal <b className={darkMode ? 'text-cyan-300' : 'text-cyan-600'}>PI23A</b>
                </p>
              </div>
            </motion.div>

            {/* Time & Date - Compact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`flex flex-col items-end gap-1 text-xs ${
                darkMode ? 'text-cyan-200/70' : 'text-cyan-700/70'
              }`}
            >
              <div className={`flex items-center gap-2 ${
                darkMode ? 'bg-white/5' : 'bg-black/5'
              } px-2 py-1 rounded-lg`}>
                <Clock className="w-3 h-3" />
                <span>{currentTime}</span>
              </div>
              <div className={`flex items-center gap-2 ${
                darkMode ? 'bg-white/5' : 'bg-black/5'
              } px-2 py-1 rounded-lg`}>
                <Calendar className="w-3 h-3" />
                <span className="text-xs">{new Date().toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'short'
                })}</span>
              </div>
            </motion.div>
          </div>
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
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={stat.onClick}
                  className={`${
                    darkMode ? 'bg-white/5' : 'bg-white/80'
                  } backdrop-blur-md rounded-xl p-4 border ${
                    darkMode ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300'
                  } transition-all duration-300 cursor-pointer text-left group relative overflow-hidden shadow-lg`}
                >
                  {/* Background Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    !darkMode && 'mix-blend-multiply'
                  }`} />
                  
                  <div className="relative z-10 flex items-center justify-between mb-2">
                    <IconComponent className={`w-5 h-5 ${
                      darkMode ? 'text-cyan-400' : 'text-cyan-600'
                    }`} />
                    <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <div className={`relative z-10 text-lg font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  } mb-0.5`}>{stat.value}</div>
                  <div className={`relative z-10 text-xs ${
                    darkMode ? 'text-cyan-200/70' : 'text-cyan-700/70'
                  } leading-tight`}>{stat.label}</div>
                </motion.button>
              )
            })}
          </div>
        </motion.section>

        {/* Today's Schedule */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-7xl mx-auto mb-6"
        >
          <div className="relative">
            {/* Background Glow */}
            <div className={`absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg opacity-30 ${
              !darkMode && 'mix-blend-multiply'
            }`} />
            
            {/* Main Card */}
            <div className={`relative backdrop-blur-xl ${
              darkMode ? 'bg-white/5' : 'bg-white/80'
            } rounded-xl border ${
              darkMode ? 'border-white/10' : 'border-gray-200'
            } shadow-lg overflow-hidden`}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-base font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>Jadwal Hari Ini</h3>
                  <span className={`text-xs ${
                    darkMode ? 'text-cyan-300' : 'text-cyan-600'
                  }`}>
                    {new Date().toLocaleDateString('id-ID', { weekday: 'long' })}
                  </span>
                </div>
                <div className="space-y-2">
                  {todaySchedule.length > 0 ? (
                    todaySchedule.map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'
                        } border`}
                      >
                        <div className="flex-1">
                          <div className={`font-semibold text-sm ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>{item.course}</div>
                          <div className={`text-xs ${
                            darkMode ? 'text-cyan-200/70' : 'text-cyan-700/70'
                          }`}>{item.room}</div>
                        </div>
                        <div className={`text-xs ${
                          darkMode ? 'text-cyan-400 bg-cyan-500/10' : 'text-cyan-600 bg-cyan-100'
                        } font-mono px-2 py-1 rounded-md`}>
                          {item.time}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className={`text-center py-4 ${
                      darkMode ? 'text-cyan-200/70' : 'text-cyan-700/70'
                    }`}>
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Tidak ada jadwal hari ini 🎉</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Main Navigation Grid */}
        <section className="max-w-7xl mx-auto">
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="visible"
            className="hidden lg:grid lg:grid-cols-3 gap-4"
          >
            <CyberGlassCard
              href="/jadwal"
              title="Jadwal Kuliah"
              icon={<Calendar className="w-6 h-6" />}
              desc="Lihat jadwal perkuliahan mingguan"
              gradient="from-blue-500 to-cyan-600"
              index={0}
              activeHover={activeHover}
              setActiveHover={setActiveHover}
              features={["Kalender Interaktif", "Pengingat Otomatis", "Export Schedule"]}
              darkMode={darkMode}
            />
            <CyberGlassCard
              href="/forum"
              title="Forum Diskusi"
              icon={<MessageCircle className="w-6 h-6" />}
              desc="Berbincang dan berdiskusi bersama teman"
              gradient="from-purple-500 to-pink-600"
              index={1}
              activeHover={activeHover}
              setActiveHover={setActiveHover}
              features={["Diskusi Real-time", "Share File", "Thread Terorganisir"]}
              darkMode={darkMode}
            />
            <CyberGlassCard
              href="/struktur"
              title="Struktur Kelas"
              icon={<Users className="w-6 h-6" />}
              desc="Lihat struktur organisasi kelas"
              gradient="from-indigo-500 to-purple-600"
              index={2}
              activeHover={activeHover}
              setActiveHover={setActiveHover}
              features={["Organigram Interaktif", "Kontak Dosen", "Team Roles"]}
              darkMode={darkMode}
            />
            <CyberGlassCard
              href="/profil"
              title="Profil Anggota"
              icon={<User className="w-6 h-6" />}
              desc="Kenali teman sekelas dan lihat biodata"
              gradient="from-pink-500 to-rose-600"
              index={3}
              activeHover={activeHover}
              setActiveHover={setActiveHover}
              features={["Profil 3D", "Social Links", "Skills & Hobbies"]}
              darkMode={darkMode}
            />
            <CyberGlassCard
              href="/album"
              title="Album Foto"
              icon={<ImageIcon className="w-6 h-6" />}
              desc="Koleksi foto kegiatan kelas"
              gradient="from-violet-500 to-blue-600"
              index={4}
              activeHover={activeHover}
              setActiveHover={setActiveHover}
              features={["Gallery Modern", "Photo Tags", "Memory Timeline"]}
              darkMode={darkMode}
            />
            <CyberGlassCard
              href="/informasi"
              title="Tentang Kami"
              icon={<Info className="w-6 h-6" />}  
              desc="Informasi resmi tentang kami"
              gradient="from-amber-500 to-orange-600"
              index={5}
              activeHover={activeHover}
              setActiveHover={setActiveHover}
              features={["Profil Kelas", "Visi & Misi", "Kontak Informasi"]}
              darkMode={darkMode}
            />
          </motion.div>

          {/* Mobile Layout */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08
                }
              }
            }}
            initial="hidden"
            animate="visible"
            className="lg:hidden grid grid-cols-3 grid-rows-2 gap-2"
          >
            <MobileCyberCard
              href="/jadwal"
              title="Jadwal"
              icon={<Calendar className="w-4 h-4" />}
              gradient="from-blue-500 to-cyan-600"
              index={0}
              darkMode={darkMode}
            />
            <MobileCyberCard
              href="/forum"
              title="Forum"
              icon={<MessageCircle className="w-4 h-4" />}
              gradient="from-purple-500 to-pink-600"
              index={1}
              darkMode={darkMode}
            />
            <MobileCyberCard
              href="/struktur"
              title="Struktur"
              icon={<Users className="w-4 h-4" />}
              gradient="from-indigo-500 to-purple-600"
              index={2}
              darkMode={darkMode}
            />
            <MobileCyberCard
              href="/profil"
              title="Profil"
              icon={<User className="w-4 h-4" />}
              gradient="from-pink-500 to-rose-600"
              index={3}
              darkMode={darkMode}
            />
            <MobileCyberCard
              href="/album"
              title="Album"
              icon={<ImageIcon className="w-4 h-4" />}
              gradient="from-violet-500 to-blue-600"
              index={4}
              darkMode={darkMode}
            />
            <MobileCyberCard
              href="/informasi"
              title="Tetang kami"
              icon={<Info className="w-4 h-4" />}
              gradient="from-amber-500 to-orange-600"
              index={5}
              darkMode={darkMode}
            />
          </motion.div>
        </section>

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="max-w-7xl mx-auto mt-6 flex items-center justify-between gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className={`group flex items-center gap-2 ${
              darkMode ? 'bg-white/5 hover:bg-red-500/20 border-white/10 hover:border-red-400/30' : 'bg-white hover:bg-red-50 border-gray-200 hover:border-red-200'
            } border px-4 py-2 rounded-xl transition-all duration-300 ${
              darkMode ? 'text-cyan-200 hover:text-red-300' : 'text-gray-700 hover:text-red-600'
            } backdrop-blur-md text-sm flex-1 max-w-[48%] justify-center shadow-lg`}
          >
            <LogOut className="w-4 h-4 group-hover:rotate-180 transition-transform" />
            <span className="font-semibold">Keluar</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(true)}
            className={`group flex items-center gap-2 ${
              darkMode ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20' : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
            } border px-4 py-2 rounded-xl transition-all duration-300 ${
              darkMode ? 'text-cyan-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            } backdrop-blur-md text-sm flex-1 max-w-[48%] justify-center shadow-lg`}
          >
            <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span className="font-semibold">Pengaturan</span>
          </motion.button>
        </motion.div>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`${
                  darkMode ? 'bg-slate-800' : 'bg-white'
                } rounded-2xl p-6 w-96 max-w-[90vw] border ${
                  darkMode ? 'border-white/10' : 'border-gray-200'
                } shadow-2xl`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>Pengaturan</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className={`p-2 rounded-full ${
                      darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X size={20} className={darkMode ? 'text-white' : 'text-gray-900'} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={darkMode ? 'text-white' : 'text-gray-900'}>Mode Tampilan</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleDarkMode}
                      className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                        darkMode ? 'bg-gradient-to-r from-cyan-500 to-purple-600' : 'bg-gradient-to-r from-amber-400 to-orange-500'
                      } p-1`}
                    >
                      <motion.div
                        animate={{ x: darkMode ? 32 : 0 }}
                        className={`w-6 h-6 rounded-full shadow-lg flex items-center justify-center ${
                          darkMode ? 'bg-slate-900' : 'bg-white'
                        }`}
                      >
                        {darkMode ? (
                          <Moon className="w-3 h-3 text-cyan-400" />
                        ) : (
                          <Sun className="w-3 h-3 text-amber-500" />
                        )}
                      </motion.div>
                    </motion.button>
                  </div>

                  <div className={`p-3 rounded-lg ${
                    darkMode ? 'bg-white/5' : 'bg-gray-100'
                  }`}>
                    <div className={`text-sm ${
                      darkMode ? 'text-cyan-300' : 'text-cyan-700'
                    }`}>
                      <strong>Fitur Aktif:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• Real-time clock</li>
                        <li>• Forum notifications</li>
                        <li>• Today&apos;s schedule</li>
                        <li>• Dark/Light mode</li>
                        <li>• Interactive stats</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="max-w-7xl mx-auto mt-6 -mb-8 text-center"
        >
          <div className={`${
            darkMode ? 'bg-white/5' : 'bg-white/80'
          } backdrop-blur-md rounded-xl p-4 border ${
            darkMode ? 'border-white/10' : 'border-gray-200'
          } shadow-lg`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className={`w-4 h-4 ${
                darkMode ? 'text-cyan-400' : 'text-cyan-600'
              }`} />
              <span className={`text-xs ${
                darkMode ? 'text-cyan-200/70' : 'text-cyan-700/70'
              }`}>Sistem Terkini - Semua Fitur Aktif</span>
              <Sparkles className={`w-4 h-4 ${
                darkMode ? 'text-cyan-400' : 'text-cyan-600'
              }`} />
            </div>
            <p className={`text-xs ${
              darkMode ? 'text-cyan-200/60' : 'text-cyan-700/60'
            }`}>
              Build by Rey Langko • PI23A • 
              <span className={`ml-1 ${
                darkMode ? 'text-cyan-400' : 'text-cyan-600'
              }`}>v2.0</span>
              <span className="ml-1 text-xs opacity-50">✨</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements seperti di Login Page */}
      {isMounted && darkMode && (
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

// Enhanced Cyber Glass Card Component
function CyberGlassCard({
  href,
  title,
  icon,
  desc,
  gradient,
  index,
  activeHover,
  setActiveHover,
  features = [],
  darkMode
}: {
  href: string
  title: string
  icon: React.ReactNode
  desc: string
  gradient: string
  index: number
  activeHover: number | null
  setActiveHover: (index: number | null) => void
  features?: string[]
  darkMode: boolean
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 }
      }}
      whileHover={{ 
        scale: 1.03, 
        y: -4,
        transition: { type: "spring", stiffness: 300 }
      }}
      onHoverStart={() => setActiveHover(index)}
      onHoverEnd={() => setActiveHover(null)}
      className="relative group cursor-pointer"
    >
      {/* Animated Border Glow */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300`}></div>
      
      {/* Main Card */}
      <div className={`relative ${
        darkMode ? 'bg-slate-900/80' : 'bg-white/80'
      } backdrop-blur-xl rounded-xl p-4 border ${
        darkMode ? 'border-white/10 group-hover:border-white/20' : 'border-gray-200 group-hover:border-gray-300'
      } transition-all duration-300 h-full shadow-lg`}>
        <Link href={href}>
          <div className="flex flex-col h-full">
            {/* Icon Section */}
            <div className="flex items-center justify-between mb-3">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
              >
                {icon}
              </motion.div>
              
              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: activeHover === index ? 1 : 0 }}
                className={`${
                  darkMode ? 'bg-white/10' : 'bg-black/10'
                } rounded-full px-2 py-1 text-xs ${
                  darkMode ? 'text-cyan-300' : 'text-cyan-600'
                } border ${
                  darkMode ? 'border-white/10' : 'border-gray-300'
                }`}
              >
                <Zap className="w-2 h-2 inline mr-1" />
                Cepat
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className={`text-base font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              } mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300 group-hover:bg-clip-text transition-all leading-tight`}>
                {title}
              </h3>
              <p className={`text-xs ${
                darkMode ? 'text-cyan-200/80' : 'text-cyan-700/80'
              } mb-3 leading-relaxed`}>
                {desc}
              </p>

              {/* Features List */}
              <AnimatePresence>
                {activeHover === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1"
                  >
                    {features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex items-center gap-1 text-xs ${
                          darkMode ? 'text-cyan-400' : 'text-cyan-500'
                        }`}
                      >
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        {feature}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Arrow */}
            <div className={`flex items-center justify-between mt-3 pt-3 border-t ${
              darkMode ? 'border-white/10 group-hover:border-white/20' : 'border-gray-200 group-hover:border-gray-300'
            } transition-colors`}>
              <span className={`text-xs ${
                darkMode ? 'text-cyan-400/60 group-hover:text-cyan-300' : 'text-cyan-600/60 group-hover:text-cyan-500'
              } transition-colors`}>
                Akses
              </span>
              <motion.div
                animate={{ x: activeHover === index ? 3 : 0 }}
                className={darkMode ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-cyan-500 group-hover:text-cyan-400'}
              >
                →
              </motion.div>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  )
}

// Mobile Cyber Card Component
function MobileCyberCard({
  href,
  title,
  icon,
  gradient,
  index,
  darkMode
}: {
  href: string
  title: string
  icon: React.ReactNode
  gradient: string
  index: number
  darkMode: boolean
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer"
    >
      {/* Animated Border Glow */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300`}></div>
      
      {/* Main Card */}
      <div className={`relative ${
        darkMode ? 'bg-slate-900/90' : 'bg-white/90'
      } backdrop-blur-xl rounded-lg p-2 border ${
        darkMode ? 'border-white/10 group-hover:border-white/20' : 'border-gray-200 group-hover:border-gray-300'
      } transition-all duration-300 h-16 flex flex-col items-center justify-center text-center shadow-lg`}>
        <Link href={href} className="w-full h-full flex flex-col items-center justify-center">
          {/* Icon */}
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className={`w-6 h-6 rounded-md bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md mb-0.5`}
          >
            {icon}
          </motion.div>
          
          {/* Title */}
          <h3 className={`text-xs font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          } group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300 group-hover:bg-clip-text transition-all leading-tight`}>
            {title}
          </h3>
        </Link>
      </div>
    </motion.div>
  )
}