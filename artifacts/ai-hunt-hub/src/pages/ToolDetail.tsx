import { AppLayout } from "@/components/layout/AppLayout";
import { 
  useGetTool, 
  useRecordToolView, 
  useRecordToolClick, 
  useCheckBookmark,
  useAddBookmark,
  useRemoveBookmark,
  useGetRelatedTools,
  useListReviews
} from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { ToolCard } from "@/components/ToolCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdSensePlaceholder } from "@/components/AdSensePlaceholder";
import { 
  Star, Eye, Bookmark, ArrowUpRight, Share2, AlertTriangle, 
  CheckCircle2, XCircle, LayoutGrid, Globe, Github, Scale
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/react";

export function ToolDetail() {
  const { id } = useParams();
  const toolId = parseInt(id || "0", 10);
  const { user, isSignedIn } = useUser();
  const queryClient = useQueryClient();

  const { data: tool, isLoading } = useGetTool(toolId, {
    query: { enabled: !!toolId }
  });

  const { data: relatedTools } = useGetRelatedTools(toolId, {
    query: { enabled: !!toolId }
  });

  const { data: reviews } = useListReviews(toolId, {
    query: { enabled: !!toolId }
  });

  const { data: bookmarkStatus } = useCheckBookmark(toolId, {
    query: { enabled: !!toolId && isSignedIn }
  });

  const recordView = useRecordToolView();
  const recordClick = useRecordToolClick();
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();
  
  const hasRecordedView = useRef(false);

  useEffect(() => {
    if (toolId && !hasRecordedView.current) {
      hasRecordedView.current = true;
      recordView.mutate({ id: toolId });
    }
  }, [toolId, recordView]);

  const handleVisitWebsite = () => {
    if (tool) {
      recordClick.mutate({ id: toolId });
      window.open(tool.websiteUrl, "_blank", "noopener,noreferrer");
    }
  };

  const toggleBookmark = () => {
    if (!isSignedIn) {
      // Redirect to sign in or show toast
      window.location.href = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/sign-in`;
      return;
    }
    
    if (bookmarkStatus?.bookmarked) {
      removeBookmark.mutate({ toolId }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/tools", toolId, "bookmark"] });
          queryClient.invalidateQueries({ queryKey: ["/api/tools", toolId] });
        }
      });
    } else {
      addBookmark.mutate({ data: { toolId } }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/tools", toolId, "bookmark"] });
          queryClient.invalidateQueries({ queryKey: ["/api/tools", toolId] });
        }
      });
    }
  };

  const pricingColors = {
    free: "success",
    freemium: "info",
    paid: "default",
    contact: "secondary",
  } as const;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!tool) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
          <p className="text-muted-foreground mb-8">The AI tool you're looking for doesn't exist or has been removed.</p>
          <Link href="/browse">
            <Button>Browse All Tools</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Banner / Header Area */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
            <div className="flex flex-col sm:flex-row gap-6 items-start flex-1">
              <div className="bg-background border shadow-sm rounded-2xl p-4 shrink-0 flex items-center justify-center">
                <Avatar className="w-24 h-24 rounded-xl">
                  <AvatarImage src={tool.logoUrl || undefined} className="object-contain" />
                  <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary rounded-xl">
                    {tool.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{tool.name}</h1>
                  {tool.isVerified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 gap-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </Badge>
                  )}
                  {tool.isEditorChoice && (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 gap-1 rounded-full">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Editor's Choice
                    </Badge>
                  )}
                </div>
                
                <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                  {tool.shortDescription}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                  {tool.categoryName && (
                    <Link href={`/categories/${tool.categorySlug}`} className="text-primary hover:underline flex items-center gap-1.5">
                      <LayoutGrid className="w-4 h-4" /> {tool.categoryName}
                    </Link>
                  )}
                  <Badge variant={pricingColors[tool.pricing]} className="capitalize">
                    {tool.pricing}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{tool.ratingAvg?.toFixed(1) || "0.0"} ({tool.reviewCount || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{tool.views || 0} views</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
              <Button size="lg" className="w-full lg:w-64 gap-2 text-base h-12" onClick={handleVisitWebsite}>
                Visit Website <ArrowUpRight className="w-5 h-5" />
              </Button>
              <div className="flex gap-2 w-full lg:w-64">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={toggleBookmark}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarkStatus?.bookmarked ? "fill-primary text-primary" : ""}`} /> 
                  {bookmarkStatus?.bookmarked ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" size="icon" className="shrink-0" title="Compare">
                  <Link href={`/compare?ids=${tool.id}`}>
                    <Scale className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Screenshots / Video */}
            {tool.screenshots && tool.screenshots.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-6">Gallery</h3>
                <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory rounded-xl no-scrollbar">
                  {tool.demoVideoUrl && (
                    <div className="min-w-[80%] md:min-w-[60%] shrink-0 snap-center rounded-xl overflow-hidden border bg-black aspect-video relative">
                       <iframe 
                          src={tool.demoVideoUrl} 
                          className="absolute inset-0 w-full h-full"
                          allowFullScreen 
                        />
                    </div>
                  )}
                  {tool.screenshots.map((url, i) => (
                    <div key={i} className="min-w-[80%] md:min-w-[60%] shrink-0 snap-center rounded-xl overflow-hidden border bg-muted aspect-video">
                      <img src={url} alt={`Screenshot ${i+1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Description */}
            <section>
              <h3 className="text-xl font-bold mb-4">About {tool.name}</h3>
              <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                {tool.longDescription ? (
                  <div dangerouslySetInnerHTML={{ __html: tool.longDescription.replace(/\n/g, '<br/>') }} />
                ) : (
                  <p>{tool.shortDescription}</p>
                )}
              </div>
            </section>

            {/* Pros & Cons */}
            {(tool.pros?.length || tool.cons?.length) ? (
              <section className="grid sm:grid-cols-2 gap-6">
                {tool.pros && tool.pros.length > 0 && (
                  <div className="bg-green-50/50 dark:bg-green-950/10 border border-green-100 dark:border-green-900/30 rounded-xl p-6">
                    <h4 className="font-bold flex items-center gap-2 text-green-800 dark:text-green-400 mb-4">
                      <CheckCircle2 className="w-5 h-5" /> Pros
                    </h4>
                    <ul className="space-y-2">
                      {tool.pros.map((pro, i) => (
                        <li key={i} className="flex gap-2 text-sm text-foreground/80">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tool.cons && tool.cons.length > 0 && (
                  <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-xl p-6">
                    <h4 className="font-bold flex items-center gap-2 text-red-800 dark:text-red-400 mb-4">
                      <XCircle className="w-5 h-5" /> Cons
                    </h4>
                    <ul className="space-y-2">
                      {tool.cons.map((con, i) => (
                        <li key={i} className="flex gap-2 text-sm text-foreground/80">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ) : null}

            {/* Features */}
            {tool.features && tool.features.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-4">Key Features</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {tool.features.map((feature, i) => (
                    <div key={i} className="bg-card border rounded-lg p-4 flex gap-3 items-start">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <AdSensePlaceholder type="banner" />

            {/* Reviews */}
            <section id="reviews">
              <div className="flex items-end justify-between mb-6">
                <h3 className="text-xl font-bold">User Reviews</h3>
                {isSignedIn ? (
                  <Button variant="outline">Write a Review</Button>
                ) : (
                  <Button variant="outline" asChild>
                    <Link href="/sign-in">Sign in to Review</Link>
                  </Button>
                )}
              </div>
              
              {reviews?.reviews && reviews.reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.reviews.map(review => (
                    <div key={review.id} className="bg-card border rounded-xl p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={review.userAvatar || undefined} />
                            <AvatarFallback>{review.userName?.substring(0,2) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-sm">{review.userName || "Anonymous User"}</div>
                            <div className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "fill-transparent text-muted"}`} />
                          ))}
                        </div>
                      </div>
                      {review.title && <h5 className="font-bold text-base">{review.title}</h5>}
                      {review.content && <p className="text-sm text-muted-foreground">{review.content}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed rounded-xl bg-muted/10">
                  <p className="text-muted-foreground mb-4">No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card border rounded-xl p-6 space-y-6">
              <h4 className="font-bold text-lg mb-2">Details</h4>
              
              <div className="space-y-4">
                {tool.platforms && tool.platforms.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block mb-2">Platforms</span>
                    <div className="flex flex-wrap gap-2">
                      {tool.platforms.map(p => (
                        <Badge key={p} variant="secondary" className="bg-muted">{p}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {tool.integrations && tool.integrations.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block mb-2">Integrations</span>
                    <div className="flex flex-wrap gap-2">
                      {tool.integrations.map(p => (
                        <Badge key={p} variant="outline">{p}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {tool.tags && tool.tags.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block mb-2">Tags</span>
                    <div className="flex flex-wrap gap-2">
                      {tool.tags.map(t => (
                        <Link key={t} href={`/browse?tag=${t}`}>
                          <span className="text-xs text-primary hover:underline bg-primary/10 px-2 py-1 rounded">#{t}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t space-y-3">
                  {tool.aiModel && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">AI Model</span>
                      <span className="font-medium">{tool.aiModel}</span>
                    </div>
                  )}
                  {tool.launchDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Launched</span>
                      <span className="font-medium">{new Date(tool.launchDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t space-y-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block mb-2">Links</span>
                  {tool.githubUrl && (
                    <a href={tool.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <Github className="w-4 h-4" /> Source Code
                    </a>
                  )}
                  {tool.documentationUrl && (
                    <a href={tool.documentationUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <Globe className="w-4 h-4" /> Documentation
                    </a>
                  )}
                </div>
              </div>
            </div>

            <AdSensePlaceholder type="rectangle" />

            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Button variant="ghost" size="sm" className="h-auto py-1 text-muted-foreground hover:text-foreground">
                <AlertTriangle className="w-3 h-3 mr-1" /> Report Issue
              </Button>
              <span>•</span>
              <span>ID: {tool.id}</span>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        {relatedTools && relatedTools.length > 0 && (
          <div className="mt-24 pt-12 border-t">
            <SectionHeading title="Similar Tools" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedTools.map(t => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}