import { AppLayout } from "@/components/layout/AppLayout";
import { 
  useGetMyProfile, 
  useGetMySubmittedTools, 
  useListBookmarks,
  useUpdateMyProfile,
  useRemoveBookmark
} from "@workspace/api-client-react";
import { SectionHeading } from "@/components/SectionHeading";
import { ToolCard } from "@/components/ToolCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Trash2, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

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
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Profile Sidebar */}
          <aside className="w-full md:w-80 shrink-0 space-y-6">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-background shadow-md">
                  <AvatarImage src={profile?.avatarUrl || undefined} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {profile?.name?.substring(0,2) || profile?.email?.substring(0,2) || "U"}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{profile?.name || "User"}</CardTitle>
                <CardDescription>{profile?.email}</CardDescription>
                {profile?.role === "admin" && (
                  <Badge className="mt-2 mx-auto w-fit" variant="secondary">Admin</Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-sm text-center text-muted-foreground">
                  Member since {new Date(profile?.createdAt || "").toLocaleDateString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={formData.bio}
                      onChange={e => setFormData(prev => ({...prev, bio: e.target.value}))}
                      className="resize-none h-24"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={updateProfile.isPending}>
                    {updateProfile.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {profile?.role === "admin" && (
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin">Admin Dashboard</Link>
              </Button>
            )}
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 w-full">
            <Tabs defaultValue="bookmarks" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-8">
                <TabsTrigger 
                  value="bookmarks" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  Saved Tools ({bookmarks?.length || 0})
                </TabsTrigger>
                <TabsTrigger 
                  value="submissions" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  My Submissions ({submittedTools?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bookmarks" className="space-y-6 outline-none">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Your Bookmarks</h3>
                </div>

                {bookmarksLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : Array.isArray(bookmarks) && bookmarks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {(Array.isArray(bookmarks) ? bookmarks : []).map((bookmark) => (
                      <div key={bookmark.id} className="relative group">
                        {bookmark.tool && <ToolCard tool={bookmark.tool} />}
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
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
                  <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                    <p className="text-muted-foreground mb-4">You haven't saved any tools yet.</p>
                    <Button asChild variant="outline">
                      <Link href="/browse">Browse Tools</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="submissions" className="space-y-6 outline-none">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Submitted Tools</h3>
                  <Button asChild size="sm">
                    <Link href="/submit">Submit New Tool</Link>
                  </Button>
                </div>

                {toolsLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
               ) : Array.isArray(submittedTools) && submittedTools.length > 0 ? (
                  <div className="space-y-4">
                    {submittedTools.map((tool) => (
                      <div key={tool.id} className="bg-card border rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 justify-between hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12 rounded">
                            <AvatarImage src={tool.logoUrl || undefined} className="object-contain" />
                            <AvatarFallback>{tool.name.substring(0,2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{tool.name}</h4>
                              <Badge variant={
                                tool.status === 'approved' ? 'success' : 
                                tool.status === 'rejected' ? 'destructive' : 
                                'secondary'
                              }>
                                {tool.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{tool.shortDescription}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {tool.status === 'approved' && (
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/tools/${tool.id}`}>View</Link>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" disabled>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                    <p className="text-muted-foreground mb-4">You haven't submitted any tools yet.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
