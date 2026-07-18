import { AppLayout } from "@/components/layout/AppLayout";
import { useGetHomeData } from "@workspace/api-client-react";
import { ToolCard } from "@/components/ToolCard";
import { SectionHeading } from "@/components/SectionHeading";
import { AdSensePlaceholder } from "@/components/AdSensePlaceholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Flame, Zap, Clock, Star, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";

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
          <div className="animate-pulse space-y-4 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">LOADING</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-background pt-24 pb-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm shadow-sm backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              <span className="font-medium text-foreground">Over {data?.stats?.totalTools || "5,000+"} AI tools indexed</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Discover the Best AI Tools <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">for Every Task.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              The premium directory to find, compare, and review the top artificial intelligence applications for developers, founders, and designers.
            </p>

            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto flex shadow-lg shadow-primary/5 rounded-full bg-background border p-2">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="text"
                  placeholder="What do you want to build?"
                  className="w-full pl-12 border-0 bg-transparent text-lg focus-visible:ring-0 shadow-none h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="rounded-full px-8 h-12 text-base font-semibold">
                Search
              </Button>
            </form>

            <div className="pt-4 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-muted-foreground flex items-center mr-2">Trending:</span>
              {data?.categories?.slice(0, 5).map(cat => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                  {cat.name}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <AdSensePlaceholder className="my-12" />

      <div className="container mx-auto px-4 space-y-24 py-12">
        {/* Editor's Choice */}
        {data?.editorsChoice && data.editorsChoice.length > 0 && (
          <section>
            <SectionHeading 
              title="Editor's Choice" 
              description="Hand-picked excellence by our curation team."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.editorsChoice.map((tool, i) => (
                <motion.div key={tool.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <ToolCard tool={tool} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Featured & Trending Split */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <SectionHeading 
                title="Trending Now" 
                description="The most viewed and bookmarked tools this week."
                viewAllLink="/trending"
                className="mb-6"
              />
              <div className="grid sm:grid-cols-2 gap-6">
                {data?.trendingTools?.slice(0, 4).map((tool, i) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
            
            <section>
              <SectionHeading 
                title="New Today" 
                description="Freshly launched AI products."
                viewAllLink="/new"
                className="mb-6"
              />
              <div className="grid sm:grid-cols-2 gap-6">
                {data?.newestTools?.slice(0, 4).map((tool, i) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-6">
                <Star className="text-yellow-500 fill-yellow-500 w-5 h-5" />
                Top Rated
              </h3>
              <div className="space-y-4">
                {data?.topRatedTools?.slice(0, 5).map(tool => (
                  <Link key={tool.id} href={`/tools/${tool.id}`} className="flex items-center gap-4 group">
                    <img src={tool.logoUrl || undefined} alt={tool.name} className="w-10 h-10 rounded shadow-sm border bg-white object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors truncate">{tool.name}</h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span>{tool.ratingAvg?.toFixed(1)}</span>
                        <span className="mx-1">•</span>
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
            {data?.freeTools?.slice(0, 4).map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Categories Grid */}
        <section className="bg-muted/30 -mx-4 px-4 py-16 md:-mx-8 md:px-8 border-y">
          <div className="container mx-auto">
            <SectionHeading 
              title="Explore by Category" 
              viewAllLink="/categories"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {data?.categories?.slice(0, 12).map((cat) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="group">
                  <div className="bg-background border rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all flex flex-col items-center text-center gap-3 h-full justify-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      {/* Simple icon placeholder */}
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-foreground">{cat.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{cat.toolCount} tools</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}