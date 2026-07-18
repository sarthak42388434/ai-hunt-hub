import { AppLayout } from "@/components/layout/AppLayout";
import { useListBlogPosts } from "@workspace/api-client-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "wouter";
import { Loader2, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function BlogList() {
  const { data, isLoading } = useListBlogPosts({ limit: 12 });

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12">
        <SectionHeading 
          title="The AI Hunt Blog" 
          description="Insights, guides, and deep dives into the AI ecosystem."
        />

        {isLoading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : data?.posts && data.posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group h-full">
                <Card className="h-full overflow-hidden hover:shadow-md hover:border-primary/50 transition-all flex flex-col">
                  {post.coverImage && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  )}
                  <CardHeader className="pb-3 pt-6">
                    {post.category && (
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
                        {post.category}
                      </span>
                    )}
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={post.authorAvatar || undefined} />
                          <AvatarFallback className="text-[10px]">{post.authorName?.substring(0,2) || "A"}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-foreground/80">{post.authorName || "Editorial Team"}</span>
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium group-hover:text-primary transition-colors">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-muted/20 rounded-xl border border-dashed">
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground">Our editorial team is working on new content.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}