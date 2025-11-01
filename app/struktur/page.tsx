"use client"

import { motion } from "framer-motion"
import { Users, ArrowLeft, Crown, Code, Paintbrush, GamepadIcon, Smartphone, Brain, BookOpen } from "lucide-react"
import Link from "next/link"

export default function StrukturPage() {
  const struktur = [
    {
      jabatan: "Ketua Kelas",
      nama: "Reymundo J. Langko",
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
    }
  ]

  const anggota = [
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
    { nama: "YOSUA NAHAK", nim: "237111035" }
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 pt-6 pb-20">
        {/* Header */}
{/* Header */}
<motion.div
  initial={{ y: -30, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.8, type: "spring" }}
  className="max-w-7xl mx-auto"
>
  {/* Title dan Tombol dalam container terpisah */}
  <div className="mb-6">
    <div className="text-center lg:text-left">
      <motion.h1 
        className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center lg:justify-start gap-3"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="relative">
          <Users className="text-cyan-400" size={32} />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 border-2 border-cyan-400/30 rounded-full"
          />
        </div>
        <span>Struktur Kelas <span className="text-cyan-200">PI23A</span></span>
      </motion.h1>
      <motion.p 
        className="text-lg text-purple-300/80 mt-3 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Tim solid dengan semangat kolaborasi dalam setiap mata kuliah
      </motion.p>
    </div>
  </div>
  
  {/* Tombol di bawah teks, align kanan */}
  <div className="flex justify-end -mt-2">
    <motion.div
      whileHover={{ scale: 1.05, x: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        href="/kelas"
        className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-6 py-3 rounded-2xl transition-all duration-300 text-purple-200 hover:text-white backdrop-blur-md shadow-lg hover:shadow-purple-500/20"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold">Kembali</span>
      </Link>
    </motion.div>
  </div>
</motion.div>

        {/* Ketua Kelas */}
        <section className="max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Ketua Kelas
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mt-4 rounded-full"></div>
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
                    scale: 1.05, 
                    y: -8,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  className="relative group cursor-pointer max-w-sm w-full"
                >
                  {/* Gradient Border */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${orang.warna} rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300`} />
                  
                  {/* Main Card */}
                  <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${orang.warna} flex items-center justify-center shadow-lg`}
                    >
                      <IconComponent className="text-white" size={32} />
                    </motion.div>

                    {/* Name */}
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-cyan-300 group-hover:bg-clip-text transition-all">
                      {orang.nama}
                    </h3>

                    {/* NIM */}
                    <p className="text-purple-300/70 text-sm mb-3">
                      NIM: {orang.nim}
                    </p>

                    {/* Position */}
                    <p className="text-lg text-purple-300/80 font-medium italic">
                      {orang.jabatan}
                    </p>

                    {/* Decorative Elements */}
                    <div className="absolute top-6 right-6 w-3 h-3 bg-cyan-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-6 left-6 w-3 h-3 bg-purple-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </section>

        {/* Garis pemisah animasi */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="max-w-4xl mx-auto my-16 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
        />

        {/* SIPEN - Struktur Unik */}
        <section className="max-w-6xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              Tim SIPEN Semester 5A
            </h2>
            <p className="text-purple-300/70 mt-2">
              6 mata kuliah dengan penanggung jawab masing-masing
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sipen.map((item, i) => {
              const IconComponent = item.icon
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -4,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  className="relative group cursor-pointer"
                >
                  {/* Gradient Border */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.warna} rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-300`} />
                  
                  {/* Main Card */}
                  <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl p-6 border border-white/10 group-hover:border-white/20 transition-all duration-300 h-full">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${item.warna} flex items-center justify-center shadow-lg`}
                    >
                      <IconComponent className="text-white" size={20} />
                    </motion.div>

                    {/* Mata Kuliah */}
                    <h4 className="text-sm font-semibold text-cyan-300 mb-2 line-clamp-2">
                      {item.matkul}
                    </h4>

                    {/* Nama */}
                    <h3 className="font-bold text-white mb-1 text-sm group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-cyan-300 group-hover:bg-clip-text transition-all">
                      {item.nama}
                    </h3>

                    {/* NIM */}
                    <p className="text-purple-300/70 text-xs">
                      NIM: {item.nim}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </section>

        {/* Garis pemisah animasi */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="max-w-4xl mx-auto my-16 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
        />

        {/* Anggota Kelas - Grid Modern */}
        <section className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Anggota Kelas
            </h2>
            <p className="text-purple-300/70 mt-2">
              {anggota.length} anggota aktif yang berkontribusi
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mt-4 rounded-full"></div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
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
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                
                {/* Main Card */}
                <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-3 hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10">
                  {/* Avatar Indicator */}
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto mb-2 opacity-60 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Name */}
                  <p className="text-xs font-medium text-purple-200 group-hover:text-white transition-colors text-center line-clamp-2 leading-tight">
                    {orang.nama}
                  </p>
                  
                  {/* NIM */}
                  <p className="text-[10px] text-purple-400/70 text-center mt-1">
                    {orang.nim}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="max-w-4xl mx-auto mt-16 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Anggota", value: anggota.length + 1 },
              { label: "Ketua Kelas", value: 1 },
              { label: "Tim SIPEN", value: sipen.length },
              { label: "Kelas", value: "PI23A" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10"
              >
                <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-purple-300/70 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}