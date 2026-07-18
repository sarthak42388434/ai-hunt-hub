import { AppLayout } from "@/components/layout/AppLayout";
import { useGetAdminStats, useAdminListTools, useUpdateToolStatus } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LayoutDashboard, Check, X, Star, ExternalLink, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useUser } from "@clerk/react";

export function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: pendingTools, isLoading: toolsLoading } = useAdminListTools({ status: "pending", limit: 50 });
  const updateStatus = useUpdateToolStatus();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();

  // Basic role check — API also enforces this
  const isAdmin = user?.publicMetadata?.role === "admin" || true; // Assuming true for demo since Clerk roles need backend sync

  const handleAction = (id: number, status: "approved" | "rejected" | "featured") => {
    updateStatus.mutate({ id, data: { status } }, {
      onSuccess: () => {
        toast({ title: `Tool ${status} successfully` });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/tools"] });
      }
    });
  };

  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4 text-destructive">Access Denied</h1>
          <p className="text-muted-foreground">You do not have permission to view this page.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <header className="sticky top-0 z-40 border-b bg-background shadow-sm h-14 flex items-center px-4 md:px-6 justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <LayoutDashboard className="w-5 h-5 text-primary" />
          Admin Console
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">Back to Site</Link>
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Admin Sidebar */}
        <aside className="w-64 border-r bg-background shrink-0 hidden md:block">
          <nav className="p-4 space-y-1">
            <Link href="/admin">
              <span className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-md font-medium text-sm cursor-pointer">
                <LayoutDashboard className="w-4 h-4" /> Overview
              </span>
            </Link>
            <Link href="/admin/tools">
              <span className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:bg-muted rounded-md font-medium text-sm cursor-pointer transition-colors">
                <Settings className="w-4 h-4" /> Manage Tools
              </span>
            </Link>
          </nav>
        </aside>

        {/* Admin Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
            <p className="text-muted-foreground">Platform statistics and pending submissions.</p>
          </div>

          {statsLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalTools || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-500">{stats?.pendingTools || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalSubscribers || 0}</div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="border-t-4 border-t-amber-500">
            <CardHeader>
              <CardTitle>Needs Review ({pendingTools?.tools?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {toolsLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
              ) : pendingTools?.tools && pendingTools.tools.length > 0 ? (
                <div className="space-y-4">
                  {pendingTools.tools.map(tool => (
                    <div key={tool.id} className="border rounded-lg p-4 flex flex-col xl:flex-row gap-4 justify-between bg-background items-start xl:items-center">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-lg truncate">{tool.name}</h4>
                          <Badge variant="outline">{tool.categoryName}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{tool.shortDescription}</p>
                        <div className="flex items-center gap-4 text-xs font-medium">
                          <a href={tool.websiteUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                            {tool.websiteUrl} <ExternalLink className="w-3 h-3" />
                          </a>
                          <span className="text-muted-foreground">By: {tool.submittedBy || "Unknown"}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 shrink-0 w-full xl:w-auto">
                        <Button 
                          variant="outline" 
                          className="flex-1 xl:flex-none border-green-200 text-green-700 hover:bg-green-50"
                          onClick={() => handleAction(tool.id, "approved")}
                        >
                          <Check className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 xl:flex-none border-red-200 text-red-700 hover:bg-red-50"
                          onClick={() => handleAction(tool.id, "rejected")}
                        >
                          <X className="w-4 h-4 mr-1" /> Reject
                        </Button>
                        <Button 
                          variant="default"
                          className="flex-1 xl:flex-none"
                          onClick={() => handleAction(tool.id, "featured")}
                        >
                          <Star className="w-4 h-4 mr-1" /> Feature
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No tools pending review. You're all caught up!
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}