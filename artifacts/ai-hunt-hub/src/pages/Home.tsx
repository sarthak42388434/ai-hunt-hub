import { AppLayout } from "@/components/layout/AppLayout";
import { useGetHomeData } from "@workspace/api-client-react";
import { ToolCard } from "@/components/ToolCard";
import { SectionHeading } from "@/components/SectionHeading";
import { AdSensePlaceholder } from "@/components/AdSensePlaceholder";
import { Search, Flame, Zap, Clock, Star, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

// ---------- Hero sub-components ----------

const CATEGORIES = [
  { label: "Writing AI",    emoji: "✍️",  angle: 0   },
  { label: "Image AI",      emoji: "🎨",  angle: 60  },
  { label: "Video AI",      emoji: "🎬",  angle: 120 },
  { label: "Coding AI",     emoji: "💻",  angle: 180 },
  { label: "Marketing AI",  emoji: "📈",  angle: 240 },
  { label: "Productivity",  emoji: "⚡",  angle: 300 },
];

function ParticleField() {
  const pts = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    x: (i * 37 + 11) % 100,
    y: (i * 53 + 7)  % 100,
    sz: ((i % 3) * 0.7) + 0.6,
    dur: 4 + (i % 7),
    delay: (i % 5) * 0.8,
    color: i % 3 === 0 ? "#818cf8" : i % 3 === 1 ? "#38bdf8" : "#a78bfa",
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pts.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.sz, height: p.sz, background: p.color }}
          animate={{ opacity: [0, 0.65, 0], y: [0, -28, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function OrbNode({ label, emoji, angle, dist = 195, delay }: {
  label: string; emoji: string; angle: number; dist?: number; delay: number;
}) {
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * dist;
  const y = Math.sin(rad) * dist;
  return (
    <motion.div
      className="absolute flex flex-col items-center"
      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: "translate(-50%,-50%)" }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5 + delay * 0.3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Link href={`/categories`}>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer"
            style={{
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.28)",
              backdropFilter: "blur(12px)",
              color: "#a5b4fc",
              boxShadow: "0 0 16px rgba(99,102,241,0.12)",
            }}
          >
            <span>{emoji}</span>
            <span>{label}</span>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ---------- Main page ----------

export function Home() {
  const { data, isLoading } = useGetHomeData();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/browse?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#050A18" }}>
          <div className="flex flex-col items-center gap-4">
            <motion.div
              className="w-12 h-12 rounded-full border-2"
              style={{ borderColor: "rgba(99,102,241,0.8)", borderTopColor: "transparent" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-xs font-medium tracking-widest uppercase" style={{ color: "#4f6272" }}>
              Loading
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: "#050A18", minHeight: "100vh" }}>
        {/* Ambient glows */}
        <div className="absolute pointer-events-none" style={{
          top: "-15%", left: "50%", transform: "translateX(-50%)",
          width: 900, height: 900,
          background: "radial-gradient(circle, rgba(99,102,241,0.16) 0%, rgba(99,102,241,0.05) 40%, transparent 70%)",
        }} />
        <div className="absolute pointer-events-none" style={{
          bottom: "5%", left: "3%", width: 500, height: 500,
          background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)",
        }} />
        <div className="absolute pointer-events-none" style={{
          bottom: "15%", right: "3%", width: 380, height: 380,
          background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)",
        }} />

        <ParticleField />

        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-28 pb-24">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.55 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-medium"
            style={{
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.28)",
              color: "#a5b4fc",
            }}
          >
            <Zap className="w-3 h-3" />
            <span>Over {data?.stats?.totalTools?.toLocaleString() || "5,000+"} AI tools indexed and growing</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-black leading-none tracking-tighter mb-6"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", maxWidth: 800 }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.65 }}
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

          {/* Sub-headline */}
          <motion.p
            className="text-lg leading-relaxed mb-10"
            style={{ color: "#94a3b8", maxWidth: 560 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.55 }}
          >
            Explore, compare, and discover thousands of AI tools built for creators,
            developers, businesses, and innovators.
          </motion.p>

          {/* Search */}
          <motion.form
            onSubmit={handleSearch}
            className="w-full flex items-center gap-3 mb-8 px-4 py-3 rounded-2xl"
            style={{
              maxWidth: 580,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 40px rgba(99,102,241,0.07)",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.55 }}
          >
            <Search className="w-5 h-5 shrink-0" style={{ color: "#4f6272" }} />
            <input
              type="text"
              placeholder="Search thousands of AI tools..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
              style={{ color: "white" }}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}
            >
              Search
            </button>
          </motion.form>

          {/* CTAs */}
          <motion.div
            className="flex items-center gap-4 mb-20"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.55 }}
          >
            <Link href="/browse">
              <button
                className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #818cf8)",
                  boxShadow: "0 0 28px rgba(99,102,241,0.4)",
                }}
              >
                Explore AI Tools <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/submit">
              <button
                className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.11)",
                  color: "#e2e8f0",
                  backdropFilter: "blur(12px)",
                }}
              >
                Submit Your AI Tool
              </button>
            </Link>
          </motion.div>

          {/* Orbital visualization */}
          <motion.div
            className="relative"
            style={{ width: 500, height: 500 }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.65, duration: 0.75, ease: "easeOut" }}
          >
            {/* Rings */}
            {[200, 155, 110].map((r, i) => (
              <div key={r} className="absolute rounded-full pointer-events-none" style={{
                width: r * 2, height: r * 2,
                left: "50%", top: "50%",
                transform: "translate(-50%,-50%)",
                border: `1px solid rgba(99,102,241,${0.07 + i * 0.04})`,
              }} />
            ))}
            {/* Rotating dashed ring */}
            <motion.div className="absolute rounded-full pointer-events-none" style={{
              width: 420, height: 420, left: "50%", top: "50%",
              transform: "translate(-50%,-50%)",
              border: "1px dashed rgba(99,102,241,0.13)",
            }} animate={{ rotate: 360 }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }} />
            {/* Core glow */}
            <div className="absolute rounded-full pointer-events-none" style={{
              width: 110, height: 110, left: "50%", top: "50%",
              transform: "translate(-50%,-50%)",
              background: "radial-gradient(circle, rgba(99,102,241,0.55) 0%, rgba(99,102,241,0.15) 55%, transparent 70%)",
              filter: "blur(6px)",
            }} />
            {/* Core orb */}
            <motion.div
              className="absolute flex items-center justify-center rounded-full"
              style={{
                width: 76, height: 76, left: "50%", top: "50%",
                transform: "translate(-50%,-50%)",
                background: "linear-gradient(135deg, rgba(99,102,241,0.75), rgba(129,140,248,0.55))",
                border: "1px solid rgba(129,140,248,0.35)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 0 36px rgba(99,102,241,0.55), 0 0 70px rgba(99,102,241,0.25)",
              }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-7 h-7 text-white" />
            </motion.div>
            {/* Category nodes */}
            {CATEGORIES.map((cat, i) => (
              <OrbNode key={cat.label} {...cat} delay={0.75 + i * 0.09} />
            ))}
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{
          background: "linear-gradient(to top, #050A18, transparent)",
        }} />
      </section>

      <AdSensePlaceholder className="my-12" />

      {/* ── Content sections ── */}
      <div className="container mx-auto px-4 space-y-24 py-16">

        {/* Editor's Choice */}
        {data?.editorsChoice && data.editorsChoice.length > 0 && (
          <section>
            <SectionHeading
              title="Editor's Choice"
              description="Hand-picked excellence by our curation team."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.editorsChoice.map((tool, i) => (
                <motion.div key={tool.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <ToolCard tool={tool} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Trending + Sidebar */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Trending */}
            <section>
              <SectionHeading
                title="Trending Now"
                description="The most viewed and bookmarked tools this week."
                viewAllLink="/trending"
                className="mb-6"
              />
              <div className="grid sm:grid-cols-2 gap-6">
                {data?.trendingTools?.slice(0, 4).map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>

            {/* New Today */}
            <section>
              <SectionHeading
                title="New Today"
                description="Freshly launched AI products."
                viewAllLink="/new"
                className="mb-6"
              />
              <div className="grid sm:grid-cols-2 gap-6">
                {data?.newestTools?.slice(0, 4).map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="rounded-xl border p-6" style={{
              background: "rgba(255,255,255,0.02)",
              borderColor: "rgba(255,255,255,0.07)",
            }}>
              <h3 className="font-semibold text-base flex items-center gap-2 mb-6 text-foreground">
                <Star className="text-yellow-400 fill-yellow-400 w-4 h-4" />
                Top Rated
              </h3>
              <div className="space-y-4">
                {data?.topRatedTools?.slice(0, 5).map(tool => (
                  <Link key={tool.id} href={`/tools/${tool.id}`} className="flex items-center gap-3 group">
                    <img
                      src={tool.logoUrl || undefined}
                      alt={tool.name}
                      className="w-9 h-9 rounded-lg border object-contain bg-white shrink-0"
                      style={{ borderColor: "rgba(255,255,255,0.08)" }}
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">{tool.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span>{tool.ratingAvg?.toFixed(1)}</span>
                        <span className="mx-1 opacity-40">·</span>
                        <span>{tool.categoryName}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <AdSensePlaceholder type="rectangle" className="mx-auto" />
          </div>
        </div>

        {/* Free Tools */}
        <section>
          <SectionHeading
            title="Best Free Tools"
            description="Powerful AI without the price tag."
            viewAllLink="/free"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.freeTools?.slice(0, 4).map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Category Grid */}
        <section
          className="-mx-4 px-4 py-16 md:-mx-8 md:px-8 rounded-2xl"
          style={{
            background: "rgba(99,102,241,0.04)",
            border: "1px solid rgba(99,102,241,0.1)",
          }}
        >
          <div className="container mx-auto">
            <SectionHeading title="Explore by Category" viewAllLink="/categories" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {data?.categories?.slice(0, 12).map(cat => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="group">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.18 }}
                    className="rounded-xl p-5 flex flex-col items-center text-center gap-3 h-full justify-center"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}
                    >
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-foreground">{cat.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{cat.toolCount} tools</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
