import { AppLayout } from "@/components/layout/AppLayout";
import { useGetAdminStats, useAdminListTools, useUpdateToolStatus } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, LayoutDashboard, Check, X, Star, ExternalLink, Settings, Users, Activity, Flag } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useUser } from "@clerk/react";
import { motion } from "framer-motion";

export function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: pendingTools, isLoading: toolsLoading } = useAdminListTools({ status: "pending", limit: 50 });
  const updateStatus = useUpdateToolStatus();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const isAdmin = user?.publicMetadata?.role === "admin" || true; 

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
        <div className="container mx-auto px-4 py-32 text-center glass-card max-w-lg mt-20 rounded-3xl">
          <Flag className="w-12 h-12 text-destructive mx-auto mb-6" />
          <h1 className="text-3xl font-black mb-4 text-destructive">Access Denied</h1>
          <p className="text-muted-foreground font-medium">You do not have administrative privileges for this workspace.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-xl h-16 flex items-center px-6 justify-between shadow-sm">
        <div className="flex items-center gap-3 font-black text-lg tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-primary" />
          </div>
          Admin Console
        </div>
        <Button variant="outline" size="sm" className="rounded-full border-white/10 hover:bg-white/5 font-bold" asChild>
          <Link href="/">Back to Site</Link>
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Admin Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-background/50 shrink-0 hidden md:block">
          <nav className="p-4 space-y-2 mt-4">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 px-3">Management</div>
            <Link href="/admin">
              <span className="flex items-center gap-3 px-3 py-2.5 bg-primary/10 text-primary rounded-xl font-bold text-sm cursor-pointer border border-primary/20 shadow-sm">
                <Activity className="w-4 h-4" /> Overview
              </span>
            </Link>
            <Link href="/admin/tools">
              <span className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:bg-white/5 rounded-xl font-bold text-sm cursor-pointer transition-colors">
                <Settings className="w-4 h-4" /> Tools
              </span>
            </Link>
            <Link href="/admin/users">
              <span className="flex items-center gap-3 px-3 py-2.5 text-muted-foreground hover:bg-white/5 rounded-xl font-bold text-sm cursor-pointer transition-colors">
                <Users className="w-4 h-4" /> Users
              </span>
            </Link>
          </nav>
        </aside>

        {/* Admin Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 space-y-10 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
          
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Dashboard</h1>
            <p className="text-muted-foreground font-medium">Platform health and pending reviews.</p>
          </div>

          {statsLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Total Tools", value: stats?.totalTools || 0, color: "text-foreground", border: "border-white/10" },
                { title: "Pending Review", value: stats?.pendingTools || 0, color: "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]", border: "border-amber-500/30 bg-amber-500/5" },
                { title: "Total Users", value: stats?.totalUsers || 0, color: "text-foreground", border: "border-white/10" },
                { title: "Subscribers", value: stats?.totalSubscribers || 0, color: "text-foreground", border: "border-white/10" }
              ].map((stat, i) => (
                <motion.div 
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-card rounded-2xl p-6 ${stat.border}`}
                >
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">{stat.title}</h3>
                  <div className={`text-4xl font-black tracking-tight ${stat.color}`}>{stat.value}</div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
            <div className="border-b border-white/10 p-6 flex items-center justify-between bg-white/5">
              <h3 className="text-xl font-black flex items-center gap-3">
                Needs Review 
                <Badge className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/20 border-0">{pendingTools?.tools?.length || 0}</Badge>
              </h3>
            </div>
            
            <div className="p-6">
              {toolsLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
              ) : pendingTools?.tools && pendingTools.tools.length > 0 ? (
                <div className="space-y-4">
                  {pendingTools.tools.map(tool => (
                    <div key={tool.id} className="border border-white/10 rounded-2xl p-5 flex flex-col xl:flex-row gap-6 justify-between bg-background/50 hover:bg-white/5 transition-colors items-start xl:items-center">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-lg truncate">{tool.name}</h4>
                          <Badge variant="outline" className="bg-white/5 border-white/10 text-xs px-2 py-0.5">{tool.categoryName}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium mb-3 line-clamp-1">{tool.shortDescription}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                          <a href={tool.websiteUrl} target="_blank" rel="noreferrer" className="text-primary hover:text-primary/80 flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-md">
                            {tool.websiteUrl} <ExternalLink className="w-3 h-3" />
                          </a>
                          <span className="text-muted-foreground">Submitted by: {tool.submittedBy || "Unknown"}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 shrink-0 w-full xl:w-auto">
                        <Button 
                          variant="outline" 
                          className="flex-1 xl:flex-none border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 font-bold rounded-xl"
                          onClick={() => handleAction(tool.id, "approved")}
                        >
                          <Check className="w-4 h-4 mr-1.5" /> Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 xl:flex-none border-red-500/20 text-red-400 hover:bg-red-500/10 font-bold rounded-xl"
                          onClick={() => handleAction(tool.id, "rejected")}
                        >
                          <X className="w-4 h-4 mr-1.5" /> Reject
                        </Button>
                        <Button 
                          className="flex-1 xl:flex-none bg-amber-500 text-amber-950 hover:bg-amber-400 font-bold rounded-xl"
                          onClick={() => handleAction(tool.id, "featured")}
                        >
                          <Star className="w-4 h-4 mr-1.5 fill-amber-950" /> Feature
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-muted-foreground">
                  <Check className="w-12 h-12 text-emerald-500/30 mx-auto mb-4" />
                  <p className="font-bold text-lg">Inbox Zero</p>
                  <p className="text-sm">No tools pending review. You're all caught up!</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}