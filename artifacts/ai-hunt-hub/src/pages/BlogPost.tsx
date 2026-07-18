import { AppLayout } from "@/components/layout/AppLayout";
import { useGetBlogPost } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Loader2, ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Linkedin, Badge } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AdSensePlaceholder } from "@/components/AdSensePlaceholder";

export function BlogPost() {
  const { slug } = useParams();
  const { data: post, isLoading } = useGetBlogPost(slug || "", {
    query: { enabled: !!slug }
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!post) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">This article doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <article className="pb-24">
        {/* Header */}
        <header className="bg-muted/30 border-b pb-12 pt-16">
          <div className="container max-w-4xl mx-auto px-4">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            
            {post.category && (
              <span className="text-sm font-bold text-primary uppercase tracking-widest mb-4 block">
                {post.category}
              </span>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl">
              {post.excerpt}
            </p>
            
            <div className="flex items-center gap-6 pt-6 border-t border-border/50">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={post.authorAvatar || undefined} />
                  <AvatarFallback>{post.authorName?.substring(0,2) || "A"}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-foreground">{post.authorName || "Editorial Team"}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                    {post.readingTime && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readingTime} min read</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {post.coverImage && (
          <div className="container max-w-5xl mx-auto px-4 -mt-8 relative z-10 mb-16">
            <div className="rounded-2xl overflow-hidden shadow-2xl border aspect-[2/1] bg-muted">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Social Share Sticky Sidebar */}
            <div className="hidden lg:block w-12 shrink-0">
              <div className="sticky top-32 flex flex-col gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground [writing-mode:vertical-rl] mb-4 h-auto">SHARE</span>
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-full bg-background"><Twitter className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-full bg-background"><Linkedin className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-full bg-background"><Facebook className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-full bg-background"><Share2 className="w-4 h-4" /></Button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl prose-img:border"
                dangerouslySetInnerHTML={{ __html: post.content || "<p>Content goes here.</p>" }} 
              />
              
              <AdSensePlaceholder type="banner" className="my-12" />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t flex flex-wrap gap-2">
                  <span className="text-sm font-semibold mr-2 self-center">Tags:</span>
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="font-normal text-xs">{tag}</Badge>
                  ))}
                </div>
              )}

              {/* Mobile Share */}
              <div className="lg:hidden mt-8 pt-8 border-t flex items-center justify-between">
                <span className="font-semibold text-sm">Share this article:</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="w-8 h-8"><Twitter className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8"><Linkedin className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8"><Share2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </AppLayout>
  );
}