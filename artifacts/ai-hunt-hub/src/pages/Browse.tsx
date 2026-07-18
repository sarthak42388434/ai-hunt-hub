import { AppLayout } from "@/components/layout/AppLayout";
import { useListTools, ListToolsParams } from "@workspace/api-client-react";
import { ToolCard } from "@/components/ToolCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, Loader2, Zap } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { motion, AnimatePresence } from "framer-motion";

export function Browse() {
  const searchParams = new URLSearchParams(window.location.search);
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, 500);
  
  const [filters, setFilters] = useState<Omit<ListToolsParams, 'search'>>({
    category: initialCategory,
    pricing: undefined,
    sort: "popular",
    page: 1,
    limit: 24,
  });

  const { data, isLoading } = useListTools({
    search: debouncedSearch,
    ...filters
  });

  const handleFilterChange = (key: keyof ListToolsParams, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <AppLayout>
      {/* Header Banner */}
      <div className="bg-muted/20 border-b border-white/5 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 gradient-text w-fit">
            {debouncedSearch ? `Search: "${debouncedSearch}"` : "Browse AI Tools"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl font-medium">
            {data ? `Showing ${data.total} tools across all categories.` : "Discover the perfect AI tool for your needs"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0 space-y-8">
          <div className="sticky top-28 glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Filter className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Filters</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="search" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="search"
                    placeholder="Search tools..." 
                    className="pl-10 bg-background/50 border-white/10 rounded-xl focus-visible:ring-primary h-11"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="sort" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sort By</Label>
                <Select 
                  id="sort"
                  value={filters.sort || "popular"} 
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="bg-background/50 border-white/10 rounded-xl h-11"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest Added</option>
                  <option value="rating">Highest Rated</option>
                  <option value="alphabetical">Alphabetical</option>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="pricing" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pricing Model</Label>
                <Select 
                  id="pricing"
                  value={filters.pricing || ""} 
                  onChange={(e) => handleFilterChange('pricing', e.target.value || undefined)}
                  className="bg-background/50 border-white/10 rounded-xl h-11"
                >
                  <option value="">Any Pricing</option>
                  <option value="free">100% Free</option>
                  <option value="freemium">Freemium</option>
                  <option value="paid">Paid</option>
                </Select>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl border-white/10 hover:bg-white/5"
                  onClick={() => {
                    setSearch("");
                    setFilters({ sort: "popular", page: 1, limit: 24 });
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <span className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Loading Tools</span>
            </div>
          ) : data?.tools && data.tools.length > 0 ? (
            <div className="space-y-12">
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {data.tools.map((tool, i) => (
                    <motion.div 
                      key={tool.id}
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: Math.min(i * 0.05, 0.5), duration: 0.4 }}
                      layout
                    >
                      <ToolCard tool={tool} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
              
              {data.total > (filters.page || 1) * (filters.limit || 24) && (
                <div className="flex justify-center pt-8">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="rounded-full px-8 border-white/10 hover:bg-white/5 font-semibold"
                    onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
                  >
                    Load More Results
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 glass-card rounded-3xl text-center px-4 border-dashed border-white/10">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-3">No tools found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                We couldn't find any tools matching your current filters. Try adjusting your search or clearing some filters.
              </p>
              <Button 
                size="lg"
                className="rounded-full px-8 glow-primary"
                onClick={() => {
                  setSearch("");
                  setFilters({ sort: "popular", page: 1, limit: 24 });
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </AppLayout>
  );
}