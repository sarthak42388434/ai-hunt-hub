import { Link, useLocation } from "wouter";
import { Search, Menu, UserCircle, Plus, Zap, ArrowRight, Home, LayoutGrid, TrendingUp, Sparkles, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";
import { Show, useClerk, useUser } from "@clerk/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/browse", label: "Browse", icon: Home },
  { href: "/categories", label: "Categories", icon: LayoutGrid },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/new", label: "New", icon: Sparkles },
  { href: "/free", label: "Free", icon: Gift },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const { user } = useUser();
  const { signOut } = useClerk();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        scrolled 
          ? "bg-background/70 backdrop-blur-xl border-white/10 shadow-lg" 
          : "bg-background/40 backdrop-blur-md border-transparent"
      }`}
    >
      <div className="container mx-auto h-20 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 group outline-none">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-indigo-500 to-purple-600 shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.8)] transition-all"
            >
              <Zap className="w-5 h-5 text-white fill-white" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
            <span className="font-extrabold text-xl tracking-tight hidden sm:inline-block gradient-text">
              AI Hunt Hub
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {NAV_LINKS.map((link) => {
              const isActive = location === link.href;
              return (
                <Link key={link.href} href={link.href} className="relative px-3 py-2 rounded-md text-muted-foreground hover:text-foreground transition-colors group">
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-white/5 rounded-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex relative w-64 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="search"
                placeholder="Search tools..."
                className="pl-10 bg-background/50 backdrop-blur-sm border-white/10 focus-visible:ring-1 focus-visible:ring-primary h-10 rounded-full shadow-inner transition-all hover:bg-background/80"
                onChange={(e) => {
                  if (e.target.value && e.key === 'Enter' as any) {
                    window.location.href = `${basePath}/browse?search=${encodeURIComponent(e.target.value)}`;
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = `${basePath}/browse?search=${encodeURIComponent(e.currentTarget.value)}`;
                  }
                }}
              />
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground rounded-full hover:bg-white/5"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Link href="/submit" className="hidden sm:inline-flex outline-none">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="sm" className="gap-2 rounded-full px-5 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white border-0 shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]">
                <Plus className="h-4 w-4" />
                Submit Tool
              </Button>
            </motion.div>
          </Link>

          <Show when="signed-out">
            <Link href="/sign-in" className="hidden sm:inline-flex outline-none">
              <Button variant="ghost" size="sm" className="rounded-full px-5 hover:bg-white/5 font-medium">Sign In</Button>
            </Link>
          </Show>
          
          <Show when="signed-in">
            <div className="flex items-center gap-2">
              <Link href="/profile" className="hidden sm:inline-flex outline-none">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <img 
                    src={user?.imageUrl} 
                    alt={user?.fullName || "Profile"} 
                    className="w-9 h-9 rounded-full border border-white/20 object-cover"
                  />
                </motion.div>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => signOut({ redirectUrl: basePath || "/" })} className="hidden sm:inline-flex rounded-full text-muted-foreground hover:bg-white/5" title="Log Out">
                <UserCircle className="h-5 w-5" />
              </Button>
            </div>
          </Show>

          <Button variant="ghost" size="icon" className="md:hidden rounded-full" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass-card border-t border-white/10 absolute top-full left-0 right-0 p-4 flex flex-col gap-4 shadow-2xl"
          >
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tools..."
                className="pl-9 bg-background/50 border-white/10 h-10 rounded-xl"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = `${basePath}/browse?search=${encodeURIComponent(e.currentTarget.value)}`;
                  }
                }}
              />
            </div>

            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 font-medium transition-colors text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
            
            <div className="h-px bg-white/10 my-1" />
            
            <div className="flex flex-col gap-3 px-2 pb-2">
              <Link href="/submit" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white border-0">
                  <Plus className="h-4 w-4" /> Submit Tool
                </Button>
              </Link>
              
              <Show when="signed-out">
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl border-white/10 bg-white/5">Sign In</Button>
                </Link>
              </Show>
              
              <Show when="signed-in">
                <div className="flex gap-2">
                  <Link href="/profile" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-xl gap-2 border-white/10 bg-white/5 hover:bg-white/10">
                      <UserCircle className="h-4 w-4" /> Profile
                    </Button>
                  </Link>
                  <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 px-4" onClick={() => signOut({ redirectUrl: basePath || "/" })}>
                    Logout
                  </Button>
                </div>
              </Show>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
