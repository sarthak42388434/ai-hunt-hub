import { AppLayout } from "@/components/layout/AppLayout";
import { useGetHomeData } from "@workspace/api-client-react";
import { ToolCard } from "@/components/ToolCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Zap, Star, ArrowRight, TrendingUp, Cpu, MonitorPlay, MessageSquare } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const ICONS: Record<string, any> = {
  "writing": MessageSquare,
  "image": MonitorPlay,
  "coding": Cpu,
  "productivity": Zap,
};

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
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse space-y-6 flex flex-col items-center">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-[0_0_30px_rgba(99,102,241,0.5)]">
              <Zap className="w-8 h-8 text-white fill-white animate-pulse" />
            </div>
            <p className="text-muted-foreground text-sm font-bold tracking-[0.2em] uppercase">INITIALIZING</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/5 bg-background pt-24 pb-32 lg:pt-32 lg:pb-40">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.2, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/4 top-0 -z-10 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.1, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute right-1/4 top-20 -z-10 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[150px]" 
        />
        <motion.div 
          animate={{ y: [0, -50, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute left-1/2 bottom-0 -translate-x-1/2 -z-10 h-[300px] w-[600px] rounded-full bg-indigo-500/20 blur-[100px]" 
        />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <Badge variant="outline" className="px-4 py-1.5 rounded-full border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium tracking-wide">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              {data?.stats?.totalTools ? (data.stats.totalTools).toLocaleString() : "5,000+"} AI Tools Indexed
            </Badge>
            
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight text-foreground leading-[1.05] drop-shadow-sm">
              Discover The Future Of <br />
              <span className="gradient-text">Artificial Intelligence</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
              Explore thousands of AI tools, compare solutions, and build the perfect AI stack for your workflow.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <form onSubmit={handleSearch} className="relative w-full max-w-lg group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-30 group-focus-within:opacity-60 transition duration-500"></div>
                <div className="relative flex items-center bg-background border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                  <Input 
                    type="text"
                    placeholder="Search for image generators, copywriters..."
                    className="w-full pl-12 border-0 bg-transparent text-base md:text-lg focus-visible:ring-0 shadow-none h-14"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" size="default" className="mr-1.5 h-11 px-6 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold">
                    Search
                  </Button>
                </div>
              </form>
            </div>

            <div className="pt-8 flex flex-wrap justify-center gap-3">
              <span className="text-sm font-semibold text-muted-foreground flex items-center mr-2 uppercase tracking-widest">Trending</span>
              {data?.categories?.slice(0, 5).map(cat => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="text-sm px-4 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-primary/20 hover:border-primary/50 hover:text-primary transition-all backdrop-blur-sm">
                  {cat.name}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 space-y-32 py-24">
        
        {/* Editor's Choice */}
        {data?.editorsChoice && data.editorsChoice.length > 0 && (
          <section>
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3 flex items-center gap-3">
                  <Star className="w-8 h-8 text-amber-400 fill-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                  Editor's Choice
                </h2>
                <p className="text-muted-foreground text-lg">Hand-picked excellence by our curation team.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.editorsChoice.slice(0, 4).map((tool, i) => (
                <motion.div 
                  key={tool.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true, margin: "-100px" }} 
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <ToolCard tool={tool} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Categories Carousel */}
        <section className="relative">
          <div className="absolute inset-0 bg-primary/5 -skew-y-2 transform origin-top-left -z-10" />
          <div className="py-12">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-2">Browse by Category</h2>
                <p className="text-muted-foreground">Find the perfect tool for your specific workflow.</p>
              </div>
              <Button variant="ghost" asChild className="hidden sm:flex hover:bg-white/5">
                <Link href="/categories">View All <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {data?.categories?.slice(0, 12).map((cat, i) => {
                const Icon = ICONS[cat.slug] || Zap;
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={`/categories/${cat.slug}`} className="block h-full group outline-none">
                      <div className="glass-card rounded-2xl p-6 hover:border-primary/50 transition-all flex flex-col items-center text-center gap-4 h-full justify-center group-hover:bg-primary/5">
                        <div className="w-12 h-12 rounded-xl bg-background/50 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300">
                          <Icon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">{cat.name}</h4>
                          <p className="text-xs font-medium text-muted-foreground">{cat.toolCount} tools</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured & Trending Split */}
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-8 xl:gap-12">
          <div className="lg:col-span-2 space-y-24">
            <section>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
                    <TrendingUp className="w-7 h-7 text-primary" />
                    Trending Now
                  </h2>
                  <p className="text-muted-foreground">The most viewed and bookmarked tools this week.</p>
                </div>
                <Button variant="ghost" asChild className="hidden sm:flex hover:bg-white/5">
                  <Link href="/trending">View All</Link>
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {data?.trendingTools?.slice(0, 4).map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
            
            <section>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-black tracking-tight mb-2">New Arrivals</h2>
                  <p className="text-muted-foreground">Freshly launched AI products.</p>
                </div>
                <Button variant="ghost" asChild className="hidden sm:flex hover:bg-white/5">
                  <Link href="/new">View All</Link>
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {data?.newestTools?.slice(0, 4).map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl glass-card p-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
              <div className="relative bg-background/80 rounded-[1.35rem] p-6 lg:p-8 backdrop-blur-xl border border-white/5">
                <h3 className="font-black text-2xl flex items-center gap-3 mb-8">
                  <Star className="text-amber-400 fill-amber-400 w-6 h-6 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
                  Top Rated
                </h3>
                <div className="space-y-6">
                  {data?.topRatedTools?.slice(0, 5).map((tool, i) => (
                    <Link key={tool.id} href={`/tools/${tool.id}`} className="flex items-center gap-4 group outline-none">
                      <span className="text-xl font-bold text-muted-foreground/30 w-4 text-center">{i + 1}</span>
                      <div className="w-12 h-12 rounded-xl glass p-2 shrink-0 group-hover:border-primary/40 transition-colors bg-background">
                        <img src={tool.logoUrl || undefined} alt={tool.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base group-hover:text-primary transition-colors truncate">{tool.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 font-medium">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-foreground/80">{tool.ratingAvg?.toFixed(1)}</span>
                          <span className="mx-1 opacity-50">•</span>
                          <span className="truncate">{tool.categoryName}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-8 rounded-xl border-white/10 hover:bg-white/5" asChild>
                  <Link href="/browse?sort=rating">View Leaderboard</Link>
                </Button>
              </div>
            </div>
            
            {/* Call to action card */}
            <div className="rounded-3xl bg-gradient-to-br from-primary to-purple-600 p-8 text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-colors" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-3">Built an AI Tool?</h3>
                <p className="text-white/80 font-medium mb-6">Get discovered by thousands of early adopters and founders.</p>
                <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90 rounded-xl font-bold" asChild>
                  <Link href="/submit">Submit Your Tool</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Free Tools */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Best Free Tools</h2>
              <p className="text-muted-foreground">Powerful AI without the price tag.</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex hover:bg-white/5">
              <Link href="/free">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.freeTools?.slice(0, 4).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

      </div>
    </AppLayout>
  );
}