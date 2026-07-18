import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import {
  Star, ExternalLink, Bookmark, CheckCircle, TrendingUp, Zap,
  Shield, Globe, ArrowUpRight
} from "lucide-react";

interface CardProps {
  name?: string;
  logo?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  description?: string;
  tags?: string[];
  pricing?: "free" | "freemium" | "paid";
  trending?: boolean;
  verified?: boolean;
  featured?: boolean;
}

function PricingBadge({ pricing }: { pricing: "free" | "freemium" | "paid" }) {
  const configs = {
    free: { label: "Free", bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", color: "#34d399" },
    freemium: { label: "Freemium", bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.3)", color: "#60a5fa" },
    paid: { label: "Paid", bg: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.3)", color: "#c084fc" },
  };
  const c = configs[pricing];
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}
    >
      {c.label}
    </span>
  );
}

function StarRating({ value, count }: { value: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className="w-3.5 h-3.5"
            style={{
              fill: i <= Math.round(value) ? "#fbbf24" : "transparent",
              color: i <= Math.round(value) ? "#fbbf24" : "#475569",
            }}
          />
        ))}
      </div>
      <span className="text-xs font-semibold" style={{ color: "#fbbf24" }}>{value.toFixed(1)}</span>
      <span className="text-xs" style={{ color: "#64748b" }}>({count.toLocaleString()})</span>
    </div>
  );
}

function GlassToolCard({
  name = "GPT-4 Vision",
  logo,
  category = "Writing",
  rating = 4.9,
  reviews = 2847,
  description = "Advanced multimodal AI assistant that understands both text and images, enabling complex reasoning and creative tasks with unprecedented accuracy.",
  tags = ["Writing", "Productivity", "API"],
  pricing = "freemium",
  trending = true,
  verified = true,
  featured = false,
}: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });
  const glowX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), { stiffness: 300, damping: 30 });
  const glowY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("");

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="relative cursor-pointer"
    >
      {/* Outer glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: featured
            ? "0 0 40px rgba(99,102,241,0.4), 0 0 80px rgba(99,102,241,0.15)"
            : "0 0 40px rgba(99,102,241,0)",
          transition: "box-shadow 0.3s ease",
        }}
      />

      {/* The card */}
      <div
        className="relative rounded-2xl p-5 overflow-hidden"
        style={{
          width: 340,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Moving shine */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([gx, gy]) => `radial-gradient(180px circle at ${gx}% ${gy}%, rgba(99,102,241,0.08) 0%, transparent 70%)`
            ),
          }}
        />

        {/* Featured banner */}
        {featured && (
          <div
            className="absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl rounded-tr-xl"
            style={{
              background: "linear-gradient(135deg, #6366f1, #818cf8)",
              color: "white",
            }}
          >
            ⭐ Featured
          </div>
        )}

        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black shrink-0"
              style={{
                background: logo
                  ? `url(${logo}) center/cover`
                  : "linear-gradient(135deg, #6366f1, #818cf8)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
              }}
            >
              {!logo && initials}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-sm leading-tight">{name}</span>
                {verified && (
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: "#60a5fa" }} />
                )}
              </div>
              <span
                className="text-xs mt-0.5 block"
                style={{ color: "#6366f1" }}
              >
                {category}
              </span>
            </div>
          </div>
          <Bookmark className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#475569" }} />
        </div>

        {/* Rating */}
        <div className="mb-3">
          <StarRating value={rating} count={reviews} />
        </div>

        {/* Description */}
        <p
          className="text-xs leading-relaxed mb-4"
          style={{ color: "#94a3b8" }}
        >
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md text-xs font-medium"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#94a3b8",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom row */}
        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2">
            <PricingBadge pricing={pricing} />
            {trending && (
              <span
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: "rgba(251,191,36,0.12)",
                  border: "1px solid rgba(251,191,36,0.25)",
                  color: "#fbbf24",
                }}
              >
                <TrendingUp className="w-3 h-3" /> Trending
              </span>
            )}
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.8), rgba(129,140,248,0.6))",
              border: "1px solid rgba(99,102,241,0.4)",
              boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
            }}
          >
            <Globe className="w-3 h-3" /> Visit Tool
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function ToolCard() {
  const cards: CardProps[] = [
    {
      name: "ChatGPT",
      category: "Writing AI",
      rating: 4.9,
      reviews: 12487,
      description: "The world's most capable AI assistant for writing, analysis, coding, and creative tasks. Powered by GPT-4.",
      tags: ["Writing", "Coding", "Research"],
      pricing: "freemium",
      trending: true,
      verified: true,
      featured: true,
    },
    {
      name: "Midjourney",
      category: "Image AI",
      rating: 4.8,
      reviews: 8932,
      description: "AI image generation at its finest. Create stunning, photorealistic and artistic images with simple text prompts.",
      tags: ["Images", "Design", "Creative"],
      pricing: "paid",
      trending: true,
      verified: true,
    },
    {
      name: "Runway ML",
      category: "Video AI",
      rating: 4.7,
      reviews: 3241,
      description: "Professional AI video generation and editing. Create cinematic content from text with Gen-2 model.",
      tags: ["Video", "Editing", "Creative"],
      pricing: "freemium",
      trending: false,
      verified: true,
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-8 py-16"
      style={{
        background: "#050A18",
        fontFamily: "'Inter', sans-serif",
        perspective: 1200,
      }}
    >
      {/* Background glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "30%", left: "50%", transform: "translate(-50%, -50%)",
          width: 700, height: 500,
          background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-3 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
        style={{
          background: "rgba(99,102,241,0.12)",
          border: "1px solid rgba(99,102,241,0.3)",
          color: "#a5b4fc",
        }}
      >
        <Zap className="w-3 h-3" /> Premium Tool Cards
      </motion.div>

      <motion.h2
        className="text-3xl font-black text-white text-center mb-2 tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        Trending AI Tools
      </motion.h2>
      <motion.p
        className="text-sm mb-10 text-center"
        style={{ color: "#64748b" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Hover over cards to see the 3D tilt effect ✦
      </motion.p>

      <div className="flex flex-wrap gap-5 justify-center items-start">
        {cards.map((card, i) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: "easeOut" }}
          >
            <GlassToolCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <motion.div
        className="mt-10 flex items-center gap-6 text-xs"
        style={{ color: "#475569" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <span className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5" style={{ color: "#60a5fa" }} /> Verified
        </span>
        <span className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5" style={{ color: "#fbbf24" }} /> Trending
        </span>
        <span className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" style={{ color: "#34d399" }} /> Curated
        </span>
      </motion.div>
    </div>
  );
}
