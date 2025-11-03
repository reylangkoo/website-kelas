"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

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

  const isClient = typeof window !== "undefined";
if (!isClient) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <p className="text-purple-300">Memuat profil...</p>
      </div>
    </div>
  );
}


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

  // Filter anggota berdasarkan role
  const filteredAnggota = anggota.filter(anggota => {
    if (activeFilter === "semua") return true
    if (activeFilter === "pengurus") return anggota.role.includes("Ketua") || anggota.role.includes("Sipen")
    if (activeFilter === "sipen") return anggota.role.includes("Sipen")
    return true
  })

  const getRoleColor = (role: string) => {
    if (role.includes("Ketua")) return "from-purple-500 to-pink-500"
    if (role.includes("Sipen")) return "from-blue-500 to-cyan-500"
    return "from-gray-500 to-slate-500"
  }

  const getRoleBadge = (role: string) => {
    if (role.includes("Ketua")) return "👑 Ketua"
    if (role.includes("Sipen")) return "⭐ " + role.split(" - ")[1]
    return "👤 Anggota"
  }

  // Tampilkan loading sampai client siap
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-purple-300">Memuat profil...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br via-purple-900 to-indigo-900 text-white">
      <div className="px-3 sm:px-6 pt-4 sm:pt-6 pb-20">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="text-center lg:text-left w-full lg:w-auto">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center lg:justify-start gap-3">
                <span>Profil <span className="text-cyan-200">PI23A</span></span>
              </h1>
              <p className="text-sm sm:text-lg text-purple-300/80 mt-2 sm:mt-3 max-w-2xl">
                Kenali lebih dekat 28 talenta hebat ✨
              </p>
            </div>
            
            <Link
              href="/kelas"
              className="group flex items-center gap-2 sm:gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300 text-purple-200 hover:text-white backdrop-blur-md text-sm sm:text-base w-full lg:w-auto justify-center"
            >
              <span className="font-semibold">← Kembali</span>
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { label: "Total Anggota", value: anggota.length, emoji: "👥" },
              { label: "Ketua & Sipen", value: 8, emoji: "⭐" },
              { label: "Tahun Ajaran", value: "2025", emoji: "🎓" },
              { label: "Semester", value: "5A", emoji: "📚" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 text-center hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{stat.emoji}</div>
                <div className="text-lg sm:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-purple-300/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Buttons - Horizontal Scroll untuk Mobile */}
        <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { key: "semua", label: "👥 Semua", count: anggota.length },
              { key: "pengurus", label: "⭐ Ketua & Sipen", count: 8 },
              { key: "sipen", label: "🎯 SIPEN", count: 7 },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border transition-all duration-300 backdrop-blur-md whitespace-nowrap flex-shrink-0 ${
                  activeFilter === filter.key
                    ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-300"
                    : "bg-white/5 border-white/10 text-purple-300 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <span className="text-sm">
                  {filter.label} <span className="text-xs opacity-70">({filter.count})</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid Profil - 3 kolom untuk mobile */}
        <section className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {filteredAnggota.map((mhs, i) => {
              const roleColor = getRoleColor(mhs.role)
              const roleBadge = getRoleBadge(mhs.role)
              
              return (
                <div
                  key={i}
                  className="relative group cursor-pointer"
                  onClick={() => setFlipped(flipped === i ? null : i)}
                >
                  {/* Hover Effect Glow */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${roleColor} rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300`} />
                  
                  {/* Main Card */}
                  <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-all duration-300 h-full">
                    
                    {/* Front Side */}
                    {flipped !== i && (
                      <div className="h-full flex flex-col">
                        {/* Photo Section */}
                        <div className="relative h-28 sm:h-36 md:h-48 overflow-hidden">
                          <Image
                            src={mhs.foto}
                            alt={mhs.nama}
                            fill
                            className="object-cover group-hover:scale-110 transition duration-500"
                            priority={i < 6}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/assets/default-avatar.jpg"
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                          
                          {/* Role Badge */}
                          <div className={`absolute top-2 right-2 bg-gradient-to-r ${roleColor} rounded-full px-2 py-1 text-[10px] sm:text-xs font-semibold text-white flex items-center gap-1 shadow-lg backdrop-blur-sm max-w-[80%] truncate`}>
                            {roleBadge.includes("Ketua") ? "👑" : roleBadge.includes("Sipen") ? "⭐" : "👤"}
                          </div>
                        </div>

                        {/* Info Section */}
                        <div className="p-3 sm:p-4 flex-1 flex flex-col">
                          <h3 className="font-bold text-xs sm:text-sm text-white mb-1 leading-tight line-clamp-2">
                            {mhs.nama.split(' ')[0]} {mhs.nama.split(' ')[1]}
                          </h3>
                          <p className="text-purple-300 text-[10px] sm:text-xs mb-2 font-mono">NIM: {mhs.nim.slice(-3)}</p>
                          <p className="text-[10px] sm:text-xs text-purple-200/80 italic line-clamp-2 mb-2 sm:mb-3">
                            &quot;{mhs.quote}&quot;
                          </p>
                          
                          {/* Hobi Tags */}
                          <div className="mt-auto flex flex-wrap gap-1">
                            {mhs.hobi.split('&').slice(0, 1).map((hobi, idx) => (
                              <span
                                key={idx}
                                className="bg-white/10 text-purple-200 text-[10px] px-1.5 py-0.5 rounded-full border border-white/10 hover:bg-white/20 transition-colors truncate max-w-full"
                              >
                                {hobi.trim()}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Flip Hint */}
                        <div className="px-3 sm:px-4 pb-2 sm:pb-3">
                          <div className="text-[10px] text-purple-400/60 text-center group-hover:text-purple-300 transition-colors flex items-center justify-center gap-1">
                            <span className="hidden sm:inline">Klik untuk detail</span>
                            <span className="sm:hidden">Detail</span>
                            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Back Side - Teks lebih kecil untuk mobile */}
                    {flipped === i && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${roleColor} p-2 sm:p-4 rounded-xl sm:rounded-2xl text-white backdrop-blur-md`}>
                        <div className="h-full flex flex-col justify-between">
                          {/* Header */}
                          <div>
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                              <h3 className="font-bold text-xs sm:text-lg leading-tight">
                                {mhs.nama.split(' ')[0]}
                              </h3>
                              <button
                                className="w-5 h-5 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors backdrop-blur-sm text-[10px] sm:text-base"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setFlipped(null)
                                }}
                              >
                                ✕
                              </button>
                            </div>
                            
                            <div className="space-y-1.5 sm:space-y-3">
                              <div className="bg-white/10 rounded sm:rounded-lg p-1.5 sm:p-3 backdrop-blur-sm">
                                <p className="text-[10px] sm:text-sm font-semibold opacity-80">NIM</p>
                                <p className="text-white font-mono text-[10px] sm:text-sm leading-tight">
                                  {mhs.nim}
                                </p>
                              </div>
                              
                              <div className="bg-white/10 rounded sm:rounded-lg p-1.5 sm:p-3 backdrop-blur-sm">
                                <p className="text-[10px] sm:text-sm font-semibold opacity-80">Peran</p>
                                <p className="text-white/90 text-[10px] sm:text-sm leading-tight">
                                  {mhs.role}
                                </p>
                              </div>
                              
                              <div className="bg-white/10 rounded sm:rounded-lg p-1.5 sm:p-3 backdrop-blur-sm">
                                <p className="text-[10px] sm:text-sm font-semibold opacity-80">Hobi</p>
                                <p className="text-white/90 text-[10px] sm:text-sm leading-tight">
                                  {mhs.hobi}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Social Links & Quote */}
                          <div>
                            {/* Social Links */}
                            {mhs.socials && (
                              <div className="mt-3 sm:mt-6">
                                <div className="flex justify-center gap-1.5 sm:gap-3">
                                  {mhs.socials.instagram && (
                                    <a
                                      className="w-6 h-6 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm hover:scale-110 text-[10px] sm:text-base"
                                      href={`https://instagram.com/${mhs.socials.instagram.replace('@', '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      📷
                                    </a>
                                  )}
                                  {mhs.socials.github && (
                                    <a
                                      className="w-6 h-6 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm hover:scale-110 text-[10px] sm:text-base"
                                      href={`https://github.com/${mhs.socials.github}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      💻
                                    </a>
                                  )}
                                  {mhs.socials.email && (
                                    <a
                                      className="w-6 h-6 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm hover:scale-110 text-[10px] sm:text-base"
                                      href={`mailto:${mhs.socials.email}`}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      ✉️
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Quote */}
                            <div className="mt-2 sm:mt-4 text-center">
                              <p className="text-[10px] sm:text-sm italic text-white/80 leading-tight">
                                &quot;{mhs.quote}&quot;
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Footer CTA */}
        <div className="max-w-2xl mx-auto mt-12 sm:mt-16 text-center">
          <div className="bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
            <div className="text-2xl sm:text-4xl mb-3 sm:mb-4">✨</div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Komunitas Pembelajar Teknologi</h3>
            <p className="text-purple-300/80 mb-4 leading-relaxed text-sm sm:text-base">
              28 individu, 1 visi - Menjadi generasi pendidik yang melek teknologi
            </p>
            <div className="flex gap-2 sm:gap-3 justify-center">
              <button 
                onClick={() => setActiveFilter("pengurus")}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all duration-300 text-sm sm:text-base flex-1 max-w-[140px]"
              >
                Tim Inti
              </button>
              <button 
                onClick={() => setActiveFilter("sipen")}
                className="bg-white/10 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/10 text-sm sm:text-base flex-1 max-w-[140px]"
              >
                SIPEN
              </button>
            </div>
          </div>
        </div>
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