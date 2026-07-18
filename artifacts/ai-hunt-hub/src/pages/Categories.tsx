import { AppLayout } from "@/components/layout/AppLayout";
import { useListCategories } from "@workspace/api-client-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Link } from "wouter";
import { ArrowRight, Layers, Zap, Cpu, MonitorPlay, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const ICONS: Record<string, any> = {
  "writing": MessageSquare,
  "image": MonitorPlay,
  "coding": Cpu,
  "productivity": Zap,
};

export function Categories() {
  const { data: categories, isLoading } = useListCategories();

  return (
    <AppLayout>
      {/* Header Banner */}
      <div className="bg-muted/20 border-b border-white/5 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute -left-40 top-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 gradient-text w-fit">
            Categories
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl font-medium">
            Browse AI tools organized by their primary use case and industry. Find the specialized solutions for your workflow.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-40 rounded-3xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories?.map((cat, i) => {
              const Icon = ICONS[cat.slug] || Layers;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/categories/${cat.slug}`} className="block h-full outline-none">
                    <div className="h-full glass-card rounded-3xl p-6 hover:border-primary/40 transition-all duration-300 group cursor-pointer hover:bg-white/5 relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
                      
                      <div className="flex items-start justify-between mb-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-background/80 border border-white/10 flex items-center justify-center text-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300 shadow-sm">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold tracking-wider bg-white/5 border border-white/10 px-3 py-1 rounded-full text-muted-foreground group-hover:text-foreground transition-colors">
                          {cat.toolCount} Tools
                        </span>
                      </div>
                      
                      <div className="relative z-10">
                        <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                          {cat.name}
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                        </h3>
                        {cat.description && (
                          <p className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}