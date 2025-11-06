"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, Home, Calendar, MessageCircle, Users, User, ImageIcon, Code, Sparkles, Zap, ChevronDown, Info } from "lucide-react"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeHover, setActiveHover] = useState<number | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const mainNavItems = [
    { name: "Dashboard", href: "/kelas", icon: Home },
    { name: "Jadwal", href: "/jadwal", icon: Calendar },
    { name: "Forum", href: "/forum", icon: MessageCircle },
  ]

  const moreNavItems = [
    { name: "Struktur", href: "/struktur", icon: Users },
    { name: "Album", href: "/album", icon: ImageIcon },
    { name: "Profil", href: "/profil", icon: User },
    { name: "VSCode", href: "/vscode", icon: Code },
    { name: "Tentang Kami", href: "/informasi", icon: Info },
  ]

  const allNavItems = [...mainNavItems, ...moreNavItems]

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 backdrop-blur-xl ${
        scrolled
          ? "bg-slate-900/95 border-b border-cyan-500/30 shadow-2xl shadow-cyan-500/20"
          : "bg-slate-900/80 border-b border-cyan-500/20"
      }`}
    >
      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 opacity-50" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* LOGO + NAMA dengan Cyber Style */}
        <Link href="/kelas" className="flex items-center gap-3 group relative">
          {/* Animated Border */}
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-10 h-10 bg-slate-900 rounded-full border border-cyan-400/30 flex items-center justify-center backdrop-blur-sm">
              <Image
                src="/assets/gg.png"
                alt="Logo PI23A"
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
          </motion.div>
          
          {/* Text dengan Gradient */}
          <div className="flex flex-col">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
            >
              PI23A
            </motion.span>
            <motion.span
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
              className="text-xs text-cyan-400/70 font-light tracking-wider"
            >
              Universitas Citra Bangsa
            </motion.span>
          </div>

          {/* Floating Particles */}
          <motion.div
            animate={{ 
              y: [0, -3, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -right-2 -top-1 w-1 h-1 bg-cyan-400 rounded-full"
          />
        </Link>

        {/* MENU DESKTOP - Modern dengan Dropdown */}
        <div className="hidden md:flex items-center space-x-1">
          {/* Main Navigation Items */}
          {mainNavItems.map((item, index) => {
            const IconComponent = item.icon
            return (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setActiveHover(index)}
                onHoverEnd={() => setActiveHover(null)}
                className="relative"
              >
                {/* Background Glow */}
                <div className={`absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-md transition-all duration-300 ${
                  activeHover === index ? 'opacity-100' : 'opacity-0'
                }`} />
                
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-md transition-all duration-300 group ${
                    activeHover === index
                      ? 'bg-cyan-500/10 border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-500/20'
                      : 'bg-white/5 border-white/10 text-cyan-200/80 hover:border-cyan-400/30'
                  }`}
                >
                  {/* Icon */}
                  <motion.div
                    animate={{ 
                      rotate: activeHover === index ? 360 : 0,
                      scale: activeHover === index ? 1.2 : 1
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <IconComponent className="w-4 h-4" />
                  </motion.div>
                  
                  {/* Text */}
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.name}
                  </span>

                  {/* Active Indicator */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: activeHover === index ? 1 : 0 }}
                    className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                  />
                </Link>
              </motion.div>
            )
          })}

          {/* More Dropdown */}
          <motion.div 
            className="relative"
            onHoverStart={() => setDropdownOpen(true)}
            onHoverEnd={() => setDropdownOpen(false)}
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-md transition-all duration-300 group ${
                dropdownOpen
                  ? 'bg-cyan-500/10 border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 border-white/10 text-cyan-200/80 hover:border-cyan-400/30'
              }`}
            >
              {/* Icon */}
              <motion.div
                animate={{ 
                  rotate: dropdownOpen ? 180 : 0,
                  scale: dropdownOpen ? 1.2 : 1
                }}
                transition={{ duration: 0.4 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
              
              {/* Text */}
              <span className="text-sm font-medium whitespace-nowrap">
                More
              </span>

              {/* Active Indicator */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: dropdownOpen ? 1 : 0 }}
                className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
              />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 overflow-hidden"
                >
                  <div className="p-2">
                    {moreNavItems.map((item, index) => {
                      const IconComponent = item.icon
                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <Link
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-cyan-200/80 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all duration-300 group"
                          >
                            <IconComponent className="w-4 h-4" />
                            <span className="text-sm font-medium">{item.name}</span>
                            <motion.div
                              animate={{ 
                                rotate: 360,
                                scale: [1, 1.2, 1]
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                delay: index * 0.2
                              }}
                              className="ml-auto opacity-0 group-hover:opacity-100"
                            >
                              <Sparkles className="w-3 h-3 text-cyan-400" />
                            </motion.div>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* TOGGLE MOBILE - Cyber Style */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-md group relative"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {open ? (
            <X size={20} className="text-cyan-400 relative z-10" />
          ) : (
            <Menu size={20} className="text-cyan-400 relative z-10" />
          )}
        </motion.button>
      </div>

      {/* MENU MOBILE - Tetap sama seperti sebelumnya */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-2xl border-b border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
          >
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="grid grid-cols-2 gap-3">
                {allNavItems.map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-cyan-400/20 hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-all duration-300 group text-center"
                      >
                        {/* Icon Container */}
                        <motion.div
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30"
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </motion.div>
                        
                        {/* Text */}
                        <span className="text-cyan-200 text-sm font-medium group-hover:text-cyan-300 transition-colors">
                          {item.name}
                        </span>

                        {/* Sparkle Effect */}
                        <motion.div
                          animate={{ 
                            rotate: 360,
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            delay: index * 0.2
                          }}
                          className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                        </motion.div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Footer Mobile Menu */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4 pt-4 border-t border-cyan-500/20 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-cyan-400/60 text-xs">
                  <Zap className="w-3 h-3" />
                  <span>Cyber Navigation System</span>
                  <Zap className="w-3 h-3" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar Indicator */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrolled ? 1 : 0 }}
        className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 origin-left"
        transition={{ duration: 0.3 }}
      />
    </motion.nav>
  )
}