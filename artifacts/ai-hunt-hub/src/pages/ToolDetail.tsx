import { AppLayout } from "@/components/layout/AppLayout";
import { 
  useGetTool, 
  useRecordToolView, 
  useRecordToolClick, 
  useCheckBookmark,
  useAddBookmark,
  useRemoveBookmark,
  useGetRelatedTools,
  useListReviews,
  useCreateReview
} from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { useEffect, useRef, useState } from "react";
import { ToolCard } from "@/components/ToolCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, Eye, Bookmark, ArrowUpRight, Share2, 
  CheckCircle2, XCircle, LayoutGrid, Globe, Github, Scale, Code
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

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
  const createReview = useCreateReview();
  
  const hasRecordedView = useRef(false);

  // Review Form State
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

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

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    createReview.mutate({ toolId, data: { rating: reviewRating, content: reviewText } }, {
      onSuccess: () => {
        setReviewText("");
        queryClient.invalidateQueries({ queryKey: ["/api/tools", toolId, "reviews"] });
        queryClient.invalidateQueries({ queryKey: ["/api/tools", toolId] });
      }
    });
  };

  const pricingColors = {
    free: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    freemium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    paid: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    contact: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  } as const;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-32 flex justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!tool) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-32 text-center glass-card max-w-lg mt-20 rounded-3xl">
          <h1 className="text-3xl font-black tracking-tight mb-4">Tool Not Found</h1>
          <p className="text-muted-foreground mb-8">The AI tool you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="rounded-full px-8 glow-primary">
            <Link href="/browse">Browse All Tools</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Hero Banner Area */}
      <div className="relative border-b border-white/5 overflow-hidden">
        {/* Background glow effects based on tool */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0" />
        <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3" />
        
        <div className="container mx-auto px-4 md:px-8 py-16 lg:py-24 relative z-10">
          <div className="flex flex-col lg:flex-row gap-10 items-start justify-between">
            <div className="flex flex-col sm:flex-row gap-8 items-start flex-1">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass border border-white/10 shadow-2xl rounded-3xl p-5 shrink-0 flex items-center justify-center bg-background/50 relative group"
              >
                <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Avatar className="w-28 h-28 md:w-32 md:h-32 rounded-2xl relative z-10">
                  <AvatarImage src={tool.logoUrl || undefined} className="object-contain" />
                  <AvatarFallback className="text-4xl font-black bg-primary/10 text-primary rounded-2xl">
                    {tool.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              
              <div className="space-y-5 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight drop-shadow-sm">{tool.name}</h1>
                  {tool.isVerified && (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 gap-1.5 rounded-full px-3 py-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </Badge>
                  )}
                  {tool.isEditorChoice && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 gap-1.5 rounded-full px-3 py-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Editor's Choice
                    </Badge>
                  )}
                </div>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed font-medium">
                  {tool.shortDescription}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
                  {tool.categoryName && (
                    <Link href={`/categories/${tool.categorySlug}`} className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-lg">
                      <LayoutGrid className="w-4 h-4" /> {tool.categoryName}
                    </Link>
                  )}
                  <Badge variant="outline" className={`capitalize px-3 py-1.5 rounded-lg border ${pricingColors[tool.pricing]}`}>
                    {tool.pricing}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-foreground/80 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span>{tool.ratingAvg?.toFixed(1) || "0.0"} ({tool.reviewCount || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-foreground/80 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    <Eye className="w-4 h-4" />
                    <span>{tool.views || 0} views</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full lg:w-[280px] shrink-0">
              <Button 
                size="lg" 
                className="w-full gap-2 text-base h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-bold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5" 
                onClick={handleVisitWebsite}
              >
                Visit Website <ArrowUpRight className="w-5 h-5" />
              </Button>
              <div className="flex gap-3 w-full">
                <Button 
                  variant="outline" 
                  className={`flex-1 gap-2 h-12 rounded-xl font-bold border-white/10 ${bookmarkStatus?.bookmarked ? "bg-primary/10 border-primary/30 text-primary" : "hover:bg-white/5"}`}
                  onClick={toggleBookmark}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarkStatus?.bookmarked ? "fill-primary text-primary" : ""}`} /> 
                  {bookmarkStatus?.bookmarked ? "Saved" : "Save Tool"}
                </Button>
                <Button variant="outline" size="icon" className="shrink-0 h-12 w-12 rounded-xl border-white/10 hover:bg-white/5" title="Compare">
                  <Link href={`/compare?ids=${tool.id}`}>
                    <Scale className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="icon" className="shrink-0 h-12 w-12 rounded-xl border-white/10 hover:bg-white/5">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start border-b border-white/10 rounded-none h-auto p-0 bg-transparent mb-12 gap-8 overflow-x-auto no-scrollbar">
            <TabsTrigger 
              value="overview" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-base font-bold data-[state=active]:text-foreground text-muted-foreground"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-base font-bold data-[state=active]:text-foreground text-muted-foreground"
            >
              Reviews <Badge variant="secondary" className="ml-2 bg-white/10">{tool.reviewCount || 0}</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="alternatives" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-base font-bold data-[state=active]:text-foreground text-muted-foreground"
            >
              Alternatives
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="outline-none">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-16">
                
                {/* Visuals */}
                {(tool.screenshots?.length || tool.demoVideoUrl) && (
                  <section>
                    <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory no-scrollbar">
                      {tool.demoVideoUrl && (
                        <div className="min-w-[85%] md:min-w-[70%] shrink-0 snap-center rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video relative shadow-xl">
                           <iframe src={tool.demoVideoUrl} className="absolute inset-0 w-full h-full" allowFullScreen />
                        </div>
                      )}
                      {tool.screenshots?.map((url, i) => (
                        <div key={i} className="min-w-[85%] md:min-w-[70%] shrink-0 snap-center rounded-2xl overflow-hidden border border-white/10 bg-muted/50 aspect-video shadow-xl relative group">
                          <img src={url} alt={`${tool.name} screenshot`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <Button variant="secondary" className="rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-0 font-bold">View Full Image</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* About */}
                <section>
                  <h3 className="text-2xl font-black mb-6">About {tool.name}</h3>
                  <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground/90 leading-relaxed font-medium">
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
                      <div className="glass-card bg-emerald-500/5 border-emerald-500/20 rounded-3xl p-8">
                        <h4 className="text-xl font-bold flex items-center gap-3 text-emerald-400 mb-6">
                          <CheckCircle2 className="w-6 h-6" /> Pros
                        </h4>
                        <ul className="space-y-4">
                          {tool.pros.map((pro, i) => (
                            <li key={i} className="flex gap-3 text-foreground/80 font-medium">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                              <span className="leading-relaxed">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {tool.cons && tool.cons.length > 0 && (
                      <div className="glass-card bg-red-500/5 border-red-500/20 rounded-3xl p-8">
                        <h4 className="text-xl font-bold flex items-center gap-3 text-red-400 mb-6">
                          <XCircle className="w-6 h-6" /> Cons
                        </h4>
                        <ul className="space-y-4">
                          {tool.cons.map((con, i) => (
                            <li key={i} className="flex gap-3 text-foreground/80 font-medium">
                              <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                              <span className="leading-relaxed">{con}</span>
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
                    <h3 className="text-2xl font-black mb-6">Key Features</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {tool.features.map((feature, i) => (
                        <div key={i} className="glass-card rounded-2xl p-5 flex gap-4 items-start hover:bg-white/5 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium text-foreground/90 pt-1 leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                <div className="glass-card rounded-3xl p-8 space-y-8 sticky top-28">
                  <h4 className="font-black text-xl mb-4">Specifications</h4>
                  
                  <div className="space-y-6">
                    {tool.platforms && tool.platforms.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-3">Platforms</span>
                        <div className="flex flex-wrap gap-2">
                          {tool.platforms.map(p => (
                            <Badge key={p} variant="outline" className="bg-white/5 border-white/10 px-3 py-1">{p}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {tool.integrations && tool.integrations.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-3">Integrations</span>
                        <div className="flex flex-wrap gap-2">
                          {tool.integrations.map(p => (
                            <Badge key={p} variant="outline" className="bg-white/5 border-white/10 px-3 py-1">{p}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-6 border-t border-white/10 space-y-4">
                      {tool.aiModel && (
                        <div className="flex items-center gap-3">
                          <Code className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">AI Model</p>
                            <p className="font-medium text-foreground">{tool.aiModel}</p>
                          </div>
                        </div>
                      )}
                      {tool.launchDate && (
                        <div className="flex items-center gap-3">
                          <Star className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Launched</p>
                            <p className="font-medium text-foreground">{new Date(tool.launchDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-white/10 space-y-3">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-3">Links</span>
                      {tool.githubUrl && (
                        <a href={tool.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm font-medium hover:text-primary transition-colors bg-white/5 p-3 rounded-xl border border-white/5">
                          <Github className="w-4 h-4" /> Source Code
                        </a>
                      )}
                      {tool.documentationUrl && (
                        <a href={tool.documentationUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm font-medium hover:text-primary transition-colors bg-white/5 p-3 rounded-xl border border-white/5">
                          <Globe className="w-4 h-4" /> Documentation
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="outline-none max-w-4xl mx-auto">
            <div className="glass-card rounded-3xl p-8 mb-12">
              <h3 className="text-2xl font-black mb-6">Write a Review</h3>
              {isSignedIn ? (
                <form onSubmit={submitReview} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Rating</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(star => (
                        <button 
                          key={star} 
                          type="button" 
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none"
                        >
                          <Star className={`w-8 h-8 transition-colors ${star <= reviewRating ? 'fill-yellow-500 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'text-muted-foreground/30'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Your Experience</label>
                    <Textarea 
                      placeholder="What do you like or dislike about this tool?"
                      className="min-h-[120px] bg-background/50 border-white/10 rounded-xl resize-none focus-visible:ring-primary text-base"
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={createReview.isPending} className="glow-primary rounded-xl px-8 font-bold">
                    Post Review
                  </Button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You must be logged in to leave a review.</p>
                  <Button asChild className="rounded-xl px-8">
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {reviews?.reviews && reviews.reviews.length > 0 ? (
                reviews.reviews.map(review => (
                  <div key={review.id} className="glass-card rounded-3xl p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border border-white/10">
                          <AvatarImage src={review.userAvatar || undefined} />
                          <AvatarFallback className="bg-primary/20 text-primary font-bold">{review.userName?.substring(0,2) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold text-base">{review.userName || "Anonymous User"}</div>
                          <div className="text-xs text-muted-foreground font-medium">{new Date(review.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "fill-transparent text-muted-foreground/30"}`} />
                        ))}
                      </div>
                    </div>
                    {review.title && <h5 className="font-bold text-lg mb-2">{review.title}</h5>}
                    {review.content && <p className="text-muted-foreground/90 font-medium leading-relaxed">{review.content}</p>}
                  </div>
                ))
              ) : (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5">
                  <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="alternatives" className="outline-none">
            {relatedTools && relatedTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedTools.map(t => (
                  <ToolCard key={t.id} tool={t} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5">
                <LayoutGrid className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No alternatives found in this category yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}