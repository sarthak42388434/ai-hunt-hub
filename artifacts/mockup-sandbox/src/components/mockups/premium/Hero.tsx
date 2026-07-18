import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ArrowRight, Sparkles, Zap, Search } from "lucide-react";

const categories = [
  { label: "Writing AI", emoji: "✍️", angle: 0, dist: 200 },
  { label: "Image AI", emoji: "🎨", angle: 60, dist: 210 },
  { label: "Video AI", emoji: "🎬", angle: 120, dist: 195 },
  { label: "Coding AI", emoji: "💻", angle: 180, dist: 205 },
  { label: "Marketing AI", emoji: "📈", angle: 240, dist: 215 },
  { label: "Productivity", emoji: "⚡", angle: 300, dist: 200 },
];

function OrbNode({ label, emoji, angle, dist, delay }: {
  label: string; emoji: string; angle: number; dist: number; delay: number;
}) {
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * dist;
  const y = Math.sin(rad) * dist;

  return (
    <motion.div
      className="absolute flex flex-col items-center gap-1"
      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: "translate(-50%, -50%)" }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="relative"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Connecting line to center */}
        <svg
          className="absolute pointer-events-none"
          style={{
            width: dist,
            height: 1,
            left: "50%",
            top: "50%",
            transformOrigin: "0 0",
            transform: `rotate(${angle + 180}deg)`,
          }}
        >
          <line
            x1="0" y1="0" x2={dist - 28} y2="0"
            stroke="url(#lineGrad)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        {/* Node pill */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer"
          style={{
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.3)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 20px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
            color: "#a5b4fc",
          }}
        >
          <span>{emoji}</span>
          <span>{label}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ParticleField() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    dur: Math.random() * 8 + 4,
    delay: Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0 ? "#818cf8" : p.id % 3 === 1 ? "#38bdf8" : "#a78bfa",
          }}
          animate={{ opacity: [0, 0.7, 0], y: [0, -30, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "#050A18", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Ambient glows */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: 900, height: 900,
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(99,102,241,0.06) 40%, transparent 70%)",
          filter: "blur(1px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-10%", left: "5%",
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(56,189,248,0.10) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "10%", right: "5%",
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(167,139,250,0.10) 0%, transparent 70%)",
        }}
      />

      <ParticleField />

      {/* Navbar */}
      <motion.nav
        className="relative z-20 flex items-center justify-between px-10 py-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">AI Hunt Hub</span>
        </div>
        <div className="flex items-center gap-8">
          {["Browse", "Categories", "Trending", "Blog"].map((item) => (
            <span key={item} className="text-sm text-slate-400 hover:text-white cursor-pointer transition-colors">{item}</span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400 cursor-pointer hover:text-white transition-colors">Sign In</span>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}
          >
            Get Started
          </button>
        </div>
      </motion.nav>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center pt-8 pb-16">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-medium"
          style={{
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "#a5b4fc",
          }}
        >
          <Zap className="w-3 h-3" />
          <span>Over 5,000+ AI tools indexed and growing</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="text-6xl font-black leading-none tracking-tighter mb-6"
          style={{ maxWidth: 780 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <span className="text-white block">Discover The Future</span>
          <span
            className="block"
            style={{
              background: "linear-gradient(135deg, #818cf8 0%, #38bdf8 50%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Of AI Tools
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-slate-400 text-xl leading-relaxed mb-10"
          style={{ maxWidth: 580 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
        >
          Explore, compare, and discover thousands of AI tools built for creators,
          developers, businesses, and innovators.
        </motion.p>

        {/* Search bar */}
        <motion.div
          className="flex items-center w-full mb-8"
          style={{ maxWidth: 580 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          <div
            className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 40px rgba(99,102,241,0.08)",
            }}
          >
            <Search className="w-5 h-5 text-slate-500 shrink-0" />
            <span className="text-slate-500 text-sm">Search thousands of AI tools...</span>
            <div className="ml-auto shrink-0">
              <button
                className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}
              >
                Search
              </button>
            </div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
        >
          <button
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #6366f1, #818cf8)",
              boxShadow: "0 0 30px rgba(99,102,241,0.4), 0 4px 15px rgba(0,0,0,0.3)",
            }}
          >
            Explore AI Tools <ArrowRight className="w-4 h-4" />
          </button>
          <button
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#e2e8f0",
              backdropFilter: "blur(12px)",
            }}
          >
            Submit Your AI Tool
          </button>
        </motion.div>

        {/* AI Ecosystem Visualization */}
        <motion.div
          className="relative mt-16"
          style={{ width: 520, height: 520 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
        >
          {/* Orbital rings */}
          {[200, 155, 110].map((r, i) => (
            <div
              key={r}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: r * 2,
                height: r * 2,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                border: `1px solid rgba(99,102,241,${0.08 + i * 0.04})`,
              }}
            />
          ))}

          {/* Rotating outer ring */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 420,
              height: 420,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              border: "1px dashed rgba(99,102,241,0.15)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />

          {/* Core glow */}
          <div
            className="absolute rounded-full"
            style={{
              width: 120,
              height: 120,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, rgba(99,102,241,0.6) 0%, rgba(99,102,241,0.2) 50%, transparent 70%)",
              filter: "blur(8px)",
            }}
          />
          <motion.div
            className="absolute flex items-center justify-center rounded-full"
            style={{
              width: 80,
              height: 80,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              background: "linear-gradient(135deg, rgba(99,102,241,0.8), rgba(129,140,248,0.6))",
              border: "1px solid rgba(129,140,248,0.4)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 40px rgba(99,102,241,0.6), 0 0 80px rgba(99,102,241,0.3)",
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          {/* Category nodes */}
          {categories.map((cat, i) => (
            <OrbNode key={cat.label} {...cat} delay={0.8 + i * 0.1} />
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, #050A18, transparent)" }}
      />
    </div>
  );
}
