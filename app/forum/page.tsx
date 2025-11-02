"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Send, ArrowLeft, MessageCircle, Smile, Users, TrendingUp, Zap, Heart, Trash2 } from "lucide-react"
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
  const [tema, setTema] = useState<"dark" | "light" | "galaxy">("dark")
  const [showEmoji, setShowEmoji] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState(24)
  const [activeUsers, setActiveUsers] = useState(12)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUser, setTypingUser] = useState("")
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const notifRef = useRef(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 🔹 Initialize user name from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem("namaUser") || "Mahasiswa PI23A"
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNama(savedName)
    }
  }, [])

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
            theme: tema === "dark" ? "dark" : "light",
            position: "bottom-right",
            className: "backdrop-blur-lg",
          })
        }
      }
      notifRef.current = true
      setPesan(data)
    })
    return () => unsubscribe()
  }, [nama, tema, pesan.length])

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

  // 🌈 Tema styling
  const getThemeStyles = () => {
    switch (tema) {
      case "light":
        return {
          background: "bg-gradient-to-br from-white via-blue-50 to-purple-50",
          border: "border-gray-200",
          text: "text-gray-900",
          secondaryText: "text-gray-600",
          bubbleUser: "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
          bubbleOther: "bg-gray-100 text-gray-900 border border-gray-200",
          input: "bg-white border-gray-300 text-gray-900 placeholder-gray-500",
        }
      case "galaxy":
        return {
          background: "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900",
          border: "border-purple-500/30",
          text: "text-white",
          secondaryText: "text-purple-200",
          bubbleUser: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white",
          bubbleOther: "bg-white/10 backdrop-blur-md text-purple-100 border border-white/10",
          input: "bg-white/10 border-white/20 text-white placeholder-purple-300",
        }
      default: // dark
        return {
          background: "bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-950",
          border: "border-purple-700/30",
          text: "text-white",
          secondaryText: "text-purple-300",
          bubbleUser: "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
          bubbleOther: "bg-white/10 backdrop-blur-md text-purple-100",
          input: "bg-white/10 border-white/20 text-white placeholder-purple-300",
        }
    }
  }

  const themeStyles = getThemeStyles()
  // Nilai waktu statis saat komponen pertama kali dimount
  const [now] = useState(() => Date.now())

  return (
    <main className={`min-h-screen transition-all duration-500 ${themeStyles.background} ${themeStyles.text} px-4 pt-8 pb-20`}>
      <ToastContainer
        toastClassName="backdrop-blur-lg bg-white/10 border border-white/20"
        progressClassName={tema === "light" ? "bg-gray-600" : "bg-white"}
      />

      {/* Header Modern */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8">
          {/* Judul dan Info */}
          <div className="text-center lg:text-left">
            <motion.h1 
              className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent flex items-center justify-center lg:justify-start gap-3 mb-3"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                animate={{ rotate: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <MessageCircle className="text-pink-400" size={40} />
              </motion.div>
              Forum PI23A
            </motion.h1>
            <p className={`text-lg ${themeStyles.secondaryText} mb-4`}>
              Tempat ngobrol, diskusi, dan berbagi ilmu bersama teman seperjuangan 🚀
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm">
              <motion.div 
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-2xl border border-white/10"
                whileHover={{ scale: 1.05 }}
              >
                <Users size={16} className="text-green-400" />
                <span>{onlineUsers} Online</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-2xl border border-white/10"
                whileHover={{ scale: 1.05 }}
              >
                <Zap size={16} className="text-yellow-400" />
                <span>{activeUsers} Active</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-2xl border border-white/10"
                whileHover={{ scale: 1.05 }}
              >
                <TrendingUp size={16} className="text-blue-400" />
                <span>{pesan.length} Messages</span>
              </motion.div>
            </div>
          </div>

          {/* Controls - PERBAIKAN: Selalu horisontal */}
          <div className="flex flex-row gap-3 w-full lg:w-auto justify-between items-center">
            {/* Ganti Mode - Kiri */}
            <motion.select
              value={tema}
              onChange={(e) => setTema(e.target.value as "dark" | "light" | "galaxy")}
              className={`px-4 py-2 rounded-2xl backdrop-blur-sm border ${themeStyles.input} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all flex-1 lg:flex-none`}
              whileHover={{ scale: 1.05 }}
              whileFocus={{ scale: 1.05 }}
            >
              <option value="dark">🌌 Dark Mode</option>
              <option value="light">🌤 Light Mode</option>
              <option value="galaxy">🌈 Galaxy Mode</option>
            </motion.select>

            {/* Kembali - Kanan */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 lg:flex-none"
            >
              <Link
                href="/kelas"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2 rounded-2xl transition-all text-white font-semibold shadow-lg w-full justify-center"
              >
                <ArrowLeft size={18} />
                <span className="whitespace-nowrap">Kembali</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Chat Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-6xl mx-auto mt-8"
      >
        <div className={`rounded-3xl border backdrop-blur-xl shadow-2xl overflow-hidden ${themeStyles.background} ${themeStyles.border}`}>
          
          {/* Chat Header */}
          <div className={`border-b ${themeStyles.border} p-6 backdrop-blur-lg`}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MessageCircle className="text-purple-400" size={24} />
                  Live Discussion
                </h2>
                <p className={`text-sm ${themeStyles.secondaryText} mt-1`}>
                  Connected as <span className="font-semibold text-purple-400">{nama}</span>
                </p>
              </div>
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${themeStyles.bubbleOther}`}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 bg-purple-500 rounded-full"
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
            className="h-[60vh] overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent"
          >
            {pesan.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="mb-4"
                >
                  <MessageCircle size={64} className="mx-auto opacity-50" />
                </motion.div>
                <h3 className={`text-xl font-semibold mb-2 ${themeStyles.secondaryText}`}>
                  No messages yet
                </h3>
                <p className={themeStyles.secondaryText}>
                  Be the first to start the conversation! 🌟
                </p>
              </motion.div>
            ) : (
              pesan.map((msg, index) => {
                const isUser = msg.nama === nama
                const bubbleStyle = isUser ? themeStyles.bubbleUser : themeStyles.bubbleOther
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
                        <span className={`text-xs px-3 py-1 rounded-full ${themeStyles.bubbleOther}`}>
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
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-semibold text-sm ${
                          isUser 
                            ? "bg-gradient-to-r from-purple-500 to-pink-500" 
                            : "bg-gradient-to-r from-blue-500 to-cyan-500"
                        }`}
                      >
                        {msg.nama.charAt(0).toUpperCase()}
                      </motion.div>

                      {/* Message Bubble */}
                      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[70%]`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold ${isUser ? "text-purple-200" : themeStyles.secondaryText}`}>
                            {msg.nama}
                          </span>
                          <span className={`text-xs ${themeStyles.secondaryText}`}>
                            {msg.waktu}
                          </span>
                        </div>
                        
                        <div className="relative group/message">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`rounded-3xl px-4 py-3 shadow-lg ${bubbleStyle} ${
                              isUser ? "rounded-br-none" : "rounded-bl-none"
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
                              className={`p-2 rounded-full backdrop-blur-sm ${
                                msg.likes?.includes(nama) 
                                  ? "bg-red-500/20 text-red-400" 
                                  : "bg-white/10 text-white/60"
                              }`}
                            >
                              <Heart 
                                size={16} 
                                fill={msg.likes?.includes(nama) ? "currentColor" : "none"} 
                              />
                              {msg.likes && msg.likes.length > 0 && (
                                <span className="text-xs ml-1">{msg.likes.length}</span>
                              )}
                            </motion.button>
                            
                            {isUser && (
                              <motion.button
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => hapusPesan(msg.id)}
                                className="p-2 rounded-full backdrop-blur-sm bg-white/10 text-white/60 hover:text-red-400"
                              >
                                <Trash2 size={16} />
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
          <div className={`border-t ${themeStyles.border} p-4 backdrop-blur-lg`}>
            <div className="flex items-center gap-3">
              {/* Emoji Picker Trigger */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowEmoji(!showEmoji)}
                className={`p-3 rounded-2xl backdrop-blur-sm border ${themeStyles.input} hover:bg-white/20 transition-all`}
              >
                <Smile size={20} />
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
                  className={`w-full px-4 py-3 rounded-2xl backdrop-blur-sm border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${themeStyles.input}`}
                />
              </div>

              {/* Send Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={kirimPesan}
                disabled={!input.trim()}
                className={`p-3 rounded-2xl font-semibold transition-all ${
                  input.trim()
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                    : "bg-white/10 text-white/40 cursor-not-allowed"
                }`}
              >
                <Send size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 left-4 z-50 shadow-2xl rounded-2xl overflow-hidden"
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={tema === "dark" || tema === "galaxy" ? Theme.DARK : Theme.LIGHT}
              width={350}
              height={400}
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