import { AppLayout } from "@/components/layout/AppLayout";
import { useListNews } from "@workspace/api-client-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Loader2, ExternalLink, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function NewsList() {
  const { data, isLoading } = useListNews({ limit: 20 });

  return (
    <AppLayout>
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <SectionHeading 
          title="AI Industry News" 
          description="The latest product launches, funding rounds, and breakthroughs."
        />

        {isLoading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : data?.articles && data.articles.length > 0 ? (
          <div className="space-y-6">
            {data.articles.map((article) => (
              <a 
                key={article.id} 
                href={article.sourceUrl || "#"} 
                target="_blank" 
                rel="noreferrer"
                className="block group"
              >
                <Card className="overflow-hidden hover:border-primary/50 hover:shadow-md transition-all">
                  <CardContent className="p-0 sm:flex">
                    {article.coverImage && (
                      <div className="w-full sm:w-64 h-48 sm:h-auto shrink-0 overflow-hidden bg-muted">
                        <img 
                          src={article.coverImage} 
                          alt={article.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col justify-center flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        {article.isTrending && (
                          <Badge variant="destructive" className="bg-red-500 font-bold uppercase tracking-wider text-[10px]">
                            Trending
                          </Badge>
                        )}
                        {article.category && (
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                            {article.category}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-2 leading-tight">
                        {article.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center text-sm font-medium text-primary mt-auto">
                        Read full story <ExternalLink className="w-3 h-3 ml-1.5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-muted/20 rounded-xl border border-dashed">
            <h3 className="text-xl font-semibold mb-2">No news yet</h3>
            <p className="text-muted-foreground">Check back later for industry updates.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}