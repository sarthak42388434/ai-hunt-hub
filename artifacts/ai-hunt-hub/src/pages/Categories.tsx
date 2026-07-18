import { AppLayout } from "@/components/layout/AppLayout";
import { useListCategories } from "@workspace/api-client-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Link } from "wouter";
import { Layers, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function Categories() {
  const { data: categories, isLoading } = useListCategories();

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12">
        <SectionHeading 
          title="All Categories" 
          description="Browse AI tools by their primary use case and industry."
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-muted/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories?.map((cat) => (
              <Link key={cat.id} href={`/categories/${cat.slug}`}>
                <Card className="h-full hover:shadow-md hover:border-primary/50 transition-all group cursor-pointer bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Layers className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium bg-muted px-2 py-1 rounded-full text-muted-foreground">
                        {cat.toolCount} tools
                      </span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center gap-2">
                      {cat.name}
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </CardTitle>
                    {cat.description && (
                      <CardDescription className="line-clamp-2 mt-1">
                        {cat.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}