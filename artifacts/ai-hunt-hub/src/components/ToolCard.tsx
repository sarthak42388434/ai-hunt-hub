import { Tool } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";
import { Star, Eye, Bookmark, ArrowUpRight, TrendingUp, CheckCircle2 } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const pricingColors = {
    free: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    freemium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    paid: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    contact: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  } as const;

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const transform = useMotionTemplate`rotateX(${mouseXSpring}deg) rotateY(${mouseYSpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(yPct * -10);
    y.set(xPct * 10);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link href={`/tools/${tool.id}`} className="block h-full outline-none perspective-1000">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: "preserve-3d", transform }}
        whileHover={{ scale: 1.02 }}
        className="h-full relative group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-b from-primary/50 to-purple-600/50 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500" />
        
        <div className="h-full flex flex-col rounded-2xl glass-card overflow-hidden relative z-10 bg-background/80 transition-colors">
          
          <div className="p-5 pb-4 flex flex-row items-start gap-4">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-primary/20 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition duration-500" />
              <Avatar className="w-14 h-14 rounded-xl border border-white/10 bg-background/50 backdrop-blur-sm relative z-10">
                <AvatarImage src={tool.logoUrl || undefined} alt={tool.name} className="object-contain p-1.5" />
                <AvatarFallback className="rounded-xl font-bold bg-primary/10 text-primary">
                  {tool.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-lg leading-tight truncate group-hover:text-primary transition-colors flex items-center gap-1.5">
                  {tool.name}
                  {tool.isVerified && (
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  )}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Badge variant="outline" className={`capitalize text-[10px] px-2 py-0 font-semibold border ${pricingColors[tool.pricing]}`}>
                  {tool.pricing}
                </Badge>
                <span className="text-muted-foreground font-medium truncate max-w-[100px]">
                  {tool.categoryName || "AI Tool"}
                </span>
              </div>
            </div>
          </div>
          
          <div className="px-5 pb-5 flex-1">
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {tool.shortDescription}
            </p>
          </div>

          <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground mt-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-medium">
                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                <span className="text-foreground/90">{tool.ratingAvg?.toFixed(1) || "0.0"}</span>
                <span className="opacity-50 hidden sm:inline">({tool.reviewCount || 0})</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Eye className="w-3.5 h-3.5 text-primary/70" />
                <span>{tool.views || 0}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {(tool.trendingScore || 0) > 80 && (
                <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  <TrendingUp className="w-3 h-3" />
                </div>
              )}
              {tool.isEditorChoice && (
                <div className="flex items-center gap-1 text-[10px] text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                  Editor's Pick
                </div>
              )}
              <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 border border-white/10 group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}