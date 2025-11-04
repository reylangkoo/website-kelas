"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Send, ArrowLeft, MessageCircle, Smile, Users, Zap, Heart, Trash2, Sparkles, Target } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { db } from "@/lib/firebaseConfig"
import { Timestamp } from "firebase/firestore"
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore"
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface Pesan {
  id: string
  nama: string
  isi: string
  waktu: string
  timestamp: Timestamp | null
  likes?: string[]
}

export default function ForumPage() {
  const [pesan, setPesan] = useState<Pesan[]>([])
  const [input, setInput] = useState("")
  const [nama, setNama] = useState("Mahasiswa PI23A")
  const [showEmoji, setShowEmoji] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState(24)
  const [activeUsers, setActiveUsers] = useState(12)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUser, setTypingUser] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const notifRef = useRef(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Fix hydration
  useEffect(() => {
  // Hindari pemanggilan setState langsung secara sinkron
  queueMicrotask(() => setIsMounted(true))

  if (typeof window !== "undefined") {
    const savedName = localStorage.getItem("namaUser") || "Mahasiswa PI23A"
    // Aman juga karena dipanggil asynchronous
    queueMicrotask(() => setNama(savedName))
  }
}, [])

  // Animated Background Effect - FIXED FOR ALL DEVICES
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
  let visibleWidth = window.innerWidth
  let visibleHeight = window.innerHeight

  // INIT PARTIKEL BARU
  const initParticles = () => {
    particles = []
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * visibleWidth,
        y: Math.random() * visibleHeight,
        size: (Math.random() * 2 + 1),
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
  }

  // SET CANVAS SIZE
  const setCanvasSize = () => {
    const dpr = window.devicePixelRatio || 1
    visibleWidth = window.innerWidth
    visibleHeight = window.innerHeight
    
    canvas.width = visibleWidth * dpr
    canvas.height = visibleHeight * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = `${visibleWidth}px`
    canvas.style.height = `${visibleHeight}px`
  }

  // INITIAL SETUP
  setCanvasSize()
  initParticles()

  const animate = () => {
    // Clear canvas
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, visibleWidth, visibleHeight)

    particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.speedX
      particle.y += particle.speedY

      // Boundary checking dengan visible size
      if (particle.x > visibleWidth) particle.x = 0
      else if (particle.x < 0) particle.x = visibleWidth
      if (particle.y > visibleHeight) particle.y = 0
      else if (particle.y < 0) particle.y = visibleHeight

      // Draw particle - TANPA SHADOW UNTUK PERFORMANCE
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.globalAlpha = 0.8
      ctx.fill()

      // Connect particles - LEBIH STABIL
      for (let j = index + 1; j < particles.length; j++) {
        const dx = particle.x - particles[j].x
        const dy = particle.y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          ctx.beginPath()
          ctx.strokeStyle = particle.color
          // Alpha yang konsisten
          ctx.globalAlpha = Math.max(0.1, 0.6 * (1 - distance / 100))
          ctx.lineWidth = 1.5
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(particles[j].x, particles[j].y)
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
    // Cancel previous animation frame
    if (animationId) {
      cancelAnimationFrame(animationId)
    }

    // Update canvas size
    setCanvasSize()
    
    // RE-INIT PARTIKEL dengan size baru
    initParticles()

    // Restart animation
    animate()
  }

  // Debounce resize untuk performance
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

  // 🔹 Ambil pesan realtime dari Firestore
  useEffect(() => {
    const q = query(collection(db, "pesan"), orderBy("timestamp"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        nama: doc.data().nama,
        isi: doc.data().isi,
        waktu: doc.data().waktu,
        timestamp: doc.data().timestamp,
        likes: doc.data().likes || [],
      })) as Pesan[]

      if (pesan.length > 0 && data.length > pesan.length) {
        const lastMsg = data[data.length - 1]
        if (lastMsg.nama !== nama && notifRef.current) {
          toast.info(`💬 ${lastMsg.nama} mengirim pesan baru!`, {
            theme: "dark",
            position: "bottom-right",
            className: "backdrop-blur-lg",
          })
        }
      }
      notifRef.current = true
      setPesan(data)
    })
    return () => unsubscribe()
  }, [nama, pesan.length])

  // 🔹 Auto scroll ke bawah
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [pesan])

  // 🔹 Simulasi user online dan typing
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => Math.max(15, prev + Math.floor(Math.random() * 3) - 1))
      setActiveUsers(prev => Math.max(5, prev + Math.floor(Math.random() * 5) - 2))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // 🔹 Kirim pesan
  const kirimPesan = async () => {
    if (input.trim() === "") return
    const waktu = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    
    setIsTyping(false)
    setTypingUser("")
    
    try {
      await addDoc(collection(db, "pesan"), {
        nama,
        isi: input,
        waktu,
        timestamp: serverTimestamp(),
        likes: [],
      })
      setInput("")
      setShowEmoji(false)
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Gagal mengirim pesan")
    }
  }

  // 🔹 Like pesan
  const likePesan = async (messageId: string, currentLikes: string[]) => {
    try {
      const docRef = doc(db, "pesan", messageId)
      const updatedLikes = currentLikes.includes(nama)
        ? currentLikes.filter(user => user !== nama)
        : [...currentLikes, nama]
      
      await updateDoc(docRef, {
        likes: updatedLikes
      })
    } catch (error) {
      console.error("Error liking message:", error)
      // Fallback: update local state
      setPesan(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, likes: currentLikes.includes(nama) ? currentLikes.filter(user => user !== nama) : [...currentLikes, nama] } : msg
      ))
    }
  }

  // 🔹 Hapus pesan
  const hapusPesan = async (messageId: string) => {
    if (confirm("Yakin ingin menghapus pesan ini?")) {
      try {
        await deleteDoc(doc(db, "pesan", messageId))
        toast.success("Pesan berhasil dihapus")
      } catch (error) {
        console.error("Error deleting message:", error)
        toast.error("Gagal menghapus pesan")
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      kirimPesan()
    } else {
      // Simulasi typing indicator
      if (!isTyping) {
        setIsTyping(true)
        setTypingUser(nama)
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
        setTypingUser("")
      }, 2000)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prev) => prev + emojiData.emoji)
    inputRef.current?.focus()
  }

  // Nilai waktu statis saat komponen pertama kali dimount
  const [now] = useState(() => Date.now())

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-300">Memuat forum...</p>
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

      <ToastContainer
        toastClassName="backdrop-blur-lg bg-white/10 border border-white/20"
        progressClassName="bg-white"
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
                    <MessageCircle className="text-cyan-400 w-5 h-5" />
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
                  Forum Diskusi
                </h1>
                <p className="text-xs text-cyan-200/80 mt-0.5">
                  Live chat <b className="text-cyan-300">PI23A</b>
                </p>
              </div>
            </motion.div>

            {/* Stats & Back Button */}
            <div className="flex items-center gap-4">
              {/* Stats */}
              <div className="hidden sm:flex items-center gap-3">
                <motion.div 
                  className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10"
                  whileHover={{ scale: 1.05 }}
                >
                  <Users size={14} className="text-green-400" />
                  <span className="text-xs">{onlineUsers}</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10"
                  whileHover={{ scale: 1.05 }}
                >
                  <Zap size={14} className="text-yellow-400" />
                  <span className="text-xs">{activeUsers}</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10"
                  whileHover={{ scale: 1.05 }}
                >
                  <Target size={14} className="text-blue-400" />
                  <span className="text-xs">{pesan.length}</span>
                </motion.div>
              </div>

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

        {/* Main Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-30" />
            
            {/* Main Card */}
            <div className="relative backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              
              {/* Chat Header */}
              <div className="border-b border-white/10 p-4 backdrop-blur-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <MessageCircle className="text-cyan-400" size={20} />
                      Live Discussion
                    </h2>
                    <p className="text-sm text-cyan-200/70 mt-0.5">
                      Connected as <span className="font-semibold text-cyan-300">{nama}</span>
                    </p>
                  </div>
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-white/5 backdrop-blur-md border border-white/10"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-2 h-2 bg-cyan-500 rounded-full"
                        />
                        {typingUser} is typing...
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Messages Area */}
              <div
                ref={chatRef}
                className="h-[50vh] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent"
              >
                {pesan.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
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
                      <MessageCircle size={48} className="mx-auto opacity-50 text-cyan-400" />
                    </motion.div>
                    <h3 className="text-lg font-semibold mb-2 text-cyan-200">
                      No messages yet
                    </h3>
                    <p className="text-cyan-200/70">
                      Be the first to start the conversation! 🌟
                    </p>
                  </motion.div>
                ) : (
                  pesan.map((msg, index) => {
                    const isUser = msg.nama === nama
                    const showDate = index === 0 || 
                      new Date(msg.timestamp?.toDate?.() || now).toDateString() !== 
                      new Date(pesan[index - 1]?.timestamp?.toDate?.() || now).toDateString()

                    return (
                      <div key={msg.id} className="space-y-2">
                        {showDate && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                          >
                            <span className="text-xs px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                              {new Date(msg.timestamp?.toDate?.() || now).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </motion.div>
                        )}
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex gap-3 group ${isUser ? "flex-row-reverse" : "flex-row"}`}
                        >
                          {/* Avatar */}
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-semibold text-xs ${
                              isUser 
                                ? "bg-gradient-to-r from-cyan-500 to-blue-500" 
                                : "bg-gradient-to-r from-purple-500 to-pink-500"
                            }`}
                          >
                            {msg.nama.charAt(0).toUpperCase()}
                          </motion.div>

                          {/* Message Bubble */}
                          <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[70%]`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-semibold ${isUser ? "text-cyan-300" : "text-purple-300"}`}>
                                {msg.nama}
                              </span>
                              <span className="text-xs text-cyan-200/70">
                                {msg.waktu}
                              </span>
                            </div>
                            
                            <div className="relative group/message">
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                className={`rounded-2xl px-3 py-2 shadow-lg ${
                                  isUser 
                                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-none" 
                                    : "bg-white/10 backdrop-blur-md text-cyan-100 rounded-bl-none border border-white/10"
                                }`}
                              >
                                <p className="text-sm leading-relaxed">{msg.isi}</p>
                              </motion.div>

                              {/* Message Actions */}
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ opacity: 1, scale: 1 }}
                                className={`absolute top-1/2 -translate-y-1/2 flex gap-1 ${
                                  isUser ? "left-0 -translate-x-12" : "right-0 translate-x-12"
                                }`}
                              >
                                <motion.button
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => likePesan(msg.id, msg.likes || [])}
                                  className={`p-1.5 rounded-full backdrop-blur-sm ${
                                    msg.likes?.includes(nama) 
                                      ? "bg-red-500/20 text-red-400" 
                                      : "bg-white/10 text-white/60"
                                  }`}
                                >
                                  <Heart 
                                    size={14} 
                                    fill={msg.likes?.includes(nama) ? "currentColor" : "none"} 
                                  />
                                  {msg.likes && msg.likes.length > 0 && (
                                    <span className="text-xs ml-0.5">{msg.likes.length}</span>
                                  )}
                                </motion.button>
                                
                                {isUser && (
                                  <motion.button
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => hapusPesan(msg.id)}
                                    className="p-1.5 rounded-full backdrop-blur-sm bg-white/10 text-white/60 hover:text-red-400"
                                  >
                                    <Trash2 size={14} />
                                  </motion.button>
                                )}
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-white/10 p-4 backdrop-blur-lg">
                <div className="flex items-center gap-2">
                  {/* Emoji Picker Trigger */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEmoji(!showEmoji)}
                    className="p-2 rounded-xl backdrop-blur-sm border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <Smile size={18} className="text-cyan-400" />
                  </motion.button>

                  {/* Message Input */}
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message here..."
                      className="w-full px-3 py-2 rounded-xl backdrop-blur-sm border border-white/10 bg-white/5 text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm"
                    />
                  </div>

                  {/* Send Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={kirimPesan}
                    disabled={!input.trim()}
                    className={`p-2 rounded-xl font-semibold transition-all ${
                      input.trim()
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg"
                        : "bg-white/10 text-white/40 cursor-not-allowed"
                    }`}
                  >
                    <Send size={18} />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto mt-4 text-center"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-cyan-200/70">Real-time Chat System</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xs text-cyan-200/60">
              Powered by Reylangko • Kelas PI23A • 
              <span className="text-cyan-400 ml-1">Live Connection</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-20 left-4 z-50 shadow-2xl rounded-2xl overflow-hidden"
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={Theme.DARK}
              width={300}
              height={350}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click Outside to Close Emoji Picker */}
      {showEmoji && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowEmoji(false)}
        />
      )}
    </main>
  )
}