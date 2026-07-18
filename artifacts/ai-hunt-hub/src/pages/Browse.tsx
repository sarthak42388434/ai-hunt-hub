import { AppLayout } from "@/components/layout/AppLayout";
import { useListTools, ListToolsParams, ListToolsPricing, ListToolsSort } from "@workspace/api-client-react";
import { ToolCard } from "@/components/ToolCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, SlidersHorizontal, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export function Browse() {
  const [location] = useLocation();
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
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h3>
              <p className="text-xs text-muted-foreground">Refine your search</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="search"
                    placeholder="Search tools..." 
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort">Sort By</Label>
                <Select 
                  id="sort"
                  value={filters.sort || "popular"} 
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                  <option value="alphabetical">Alphabetical</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricing">Pricing</Label>
                <Select 
                  id="pricing"
                  value={filters.pricing || ""} 
                  onChange={(e) => handleFilterChange('pricing', e.target.value || undefined)}
                >
                  <option value="">All Pricing</option>
                  <option value="free">Free</option>
                  <option value="freemium">Freemium</option>
                  <option value="paid">Paid</option>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearch("");
                  setFilters({ sort: "popular", page: 1, limit: 24 });
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <SectionHeading 
            title={debouncedSearch ? `Search results for "${debouncedSearch}"` : "Browse AI Tools"} 
            description={data ? `Showing ${data.tools.length} of ${data.total} tools` : "Discover the perfect AI tool for your needs"}
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : data?.tools && data.tools.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
              
              {data.total > (filters.page || 1) * (filters.limit || 24) && (
                <div className="flex justify-center pt-8">
                  <Button 
                    variant="outline" 
                    onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-32 bg-muted/20 rounded-xl border border-dashed">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No tools found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn't find any tools matching your current filters. Try adjusting your search or clearing some filters.
              </p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => {
                  setSearch("");
                  setFilters({ sort: "popular", page: 1, limit: 24 });
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </AppLayout>
  );
}