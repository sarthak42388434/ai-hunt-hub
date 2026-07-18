import { AppLayout } from "@/components/layout/AppLayout";
import { 
  useGetMyProfile, 
  useGetMySubmittedTools, 
  useListBookmarks,
  useUpdateMyProfile,
  useRemoveBookmark
} from "@workspace/api-client-react";
import { ToolCard } from "@/components/ToolCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Trash2, Edit, Settings, Bookmark, Send, LayoutDashboard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";

export function Profile() {
  const { data: profile, isLoading: profileLoading } = useGetMyProfile();
  const { data: submittedTools, isLoading: toolsLoading } = useGetMySubmittedTools();
  const { data: bookmarks, isLoading: bookmarksLoading } = useListBookmarks();
  
  const updateProfile = useUpdateMyProfile();
  const removeBookmark = useRemoveBookmark();
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "Profile updated successfully" });
        queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
      },
      onError: () => {
        toast({ title: "Failed to update profile", variant: "destructive" });
      }
    });
  };

  const handleRemoveBookmark = (toolId: number) => {
    removeBookmark.mutate({ toolId }, {
      onSuccess: () => {
        toast({ title: "Bookmark removed" });
        queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      }
    });
  };

  if (profileLoading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <span className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Loading Profile</span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Profile Header Background */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-primary/20 via-purple-600/20 to-background border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start relative -mt-20">
          
          {/* Profile Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="glass-card rounded-3xl p-8 text-center border-t border-white/20 shadow-2xl bg-background/90"
            >
              <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-background shadow-xl rounded-2xl relative">
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 ring-inset z-10" />
                <AvatarImage src={profile?.avatarUrl || undefined} className="object-cover" />
                <AvatarFallback className="text-4xl font-black bg-primary/10 text-primary rounded-2xl">
                  {profile?.name?.substring(0,2).toUpperCase() || profile?.email?.substring(0,2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-black tracking-tight">{profile?.name || "User"}</h2>
              <p className="text-muted-foreground font-medium mb-4">{profile?.email}</p>
              {profile?.role === "admin" && (
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/30 font-bold px-3 py-1 rounded-full mb-6">Administrator</Badge>
              )}
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider pt-6 border-t border-white/10">
                Member since {new Date(profile?.createdAt || "").toLocaleDateString()}
              </div>
            </motion.div>

            {profile?.role === "admin" && (
              <Button asChild className="w-full rounded-2xl h-14 font-bold gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-foreground">
                <Link href="/admin"><LayoutDashboard className="w-5 h-5" /> Admin Dashboard</Link>
              </Button>
            )}
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 w-full lg:mt-20">
            <Tabs defaultValue="bookmarks" className="w-full">
              <TabsList className="w-full justify-start border-b border-white/10 rounded-none h-auto p-0 bg-transparent mb-10 overflow-x-auto no-scrollbar gap-8">
                <TabsTrigger 
                  value="bookmarks" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-base font-bold data-[state=active]:text-foreground text-muted-foreground flex items-center gap-2"
                >
                  <Bookmark className="w-4 h-4" /> Saved Tools 
                  <Badge variant="secondary" className="bg-white/10 ml-1">{bookmarks?.length || 0}</Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="submissions" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-base font-bold data-[state=active]:text-foreground text-muted-foreground flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> My Submissions 
                  <Badge variant="secondary" className="bg-white/10 ml-1">{submittedTools?.length || 0}</Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-base font-bold data-[state=active]:text-foreground text-muted-foreground flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" /> Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bookmarks" className="space-y-6 outline-none">
                {bookmarksLoading ? (
                  <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                ) : Array.isArray(bookmarks) && bookmarks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {bookmarks.map((bookmark) => (
                      <div key={bookmark.id} className="relative group">
                        {bookmark.tool && <ToolCard tool={bookmark.tool} />}
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20 rounded-xl shadow-xl hover:bg-destructive"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveBookmark(bookmark.toolId);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-32 glass-card rounded-3xl border-dashed border-white/10">
                    <Bookmark className="w-12 h-12 text-muted-foreground/30 mx-auto mb-6" />
                    <h3 className="text-2xl font-black mb-3">No saved tools</h3>
                    <p className="text-muted-foreground mb-8 text-lg">You haven't bookmarked any tools yet.</p>
                    <Button asChild size="lg" className="rounded-full px-8 glow-primary">
                      <Link href="/browse">Discover Tools</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="submissions" className="space-y-6 outline-none">
                <div className="flex justify-end mb-6">
                  <Button asChild size="sm" className="rounded-full bg-gradient-to-r from-primary to-purple-600 text-white font-bold px-6">
                    <Link href="/submit">Submit New Tool</Link>
                  </Button>
                </div>

                {toolsLoading ? (
                  <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
               ) : Array.isArray(submittedTools) && submittedTools.length > 0 ? (
                  <div className="space-y-4">
                    {submittedTools.map((tool) => (
                      <div key={tool.id} className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6 justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-5 w-full sm:w-auto">
                          <Avatar className="w-16 h-16 rounded-xl border border-white/10 bg-background/50">
                            <AvatarImage src={tool.logoUrl || undefined} className="object-contain p-2" />
                            <AvatarFallback className="rounded-xl font-bold bg-primary/10 text-primary">{tool.name.substring(0,2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-bold text-lg">{tool.name}</h4>
                              <Badge variant="outline" className={`capitalize px-2 py-0.5 text-[10px] font-bold ${
                                tool.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                tool.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}>
                                {tool.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium line-clamp-1">{tool.shortDescription}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          {tool.status === 'approved' && (
                            <Button asChild variant="secondary" size="sm" className="rounded-xl font-bold bg-white/10 hover:bg-white/20">
                              <Link href={`/tools/${tool.id}`}>View Live</Link>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" disabled className="rounded-xl border border-white/5">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-32 glass-card rounded-3xl border-dashed border-white/10">
                    <Send className="w-12 h-12 text-muted-foreground/30 mx-auto mb-6" />
                    <h3 className="text-2xl font-black mb-3">No submissions</h3>
                    <p className="text-muted-foreground mb-8 text-lg">You haven't submitted any tools yet.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="settings" className="outline-none">
                <div className="glass-card rounded-3xl p-8 max-w-2xl">
                  <h3 className="text-2xl font-black mb-8">Edit Profile</h3>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Display Name</Label>
                      <Input 
                        id="name" 
                        value={formData.name}
                        onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
                        className="bg-background/50 border-white/10 rounded-xl h-12 focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={formData.bio}
                        onChange={e => setFormData(prev => ({...prev, bio: e.target.value}))}
                        className="resize-none h-32 bg-background/50 border-white/10 rounded-xl focus-visible:ring-primary text-base p-4"
                        placeholder="Tell the community a bit about yourself..."
                      />
                    </div>
                    <div className="pt-6">
                      <Button type="submit" size="lg" className="rounded-xl px-8 glow-primary font-bold" disabled={updateProfile.isPending}>
                        {updateProfile.isPending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}