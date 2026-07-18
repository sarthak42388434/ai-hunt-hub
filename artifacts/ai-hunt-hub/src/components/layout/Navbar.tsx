import { Link } from "wouter";
import { Search, Menu, UserCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";
import { Show, useClerk, useUser } from "@clerk/react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto h-16 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <img src={`${basePath}/logo.svg`} alt="AI Hunt Hub Logo" className="h-8" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/browse" className="text-muted-foreground hover:text-foreground transition-colors">Browse</Link>
            <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">Categories</Link>
            <Link href="/trending" className="text-muted-foreground hover:text-foreground transition-colors">Trending</Link>
            <Link href="/new" className="text-muted-foreground hover:text-foreground transition-colors">New</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tools..."
              className="pl-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-9"
              onChange={(e) => {
                if (e.target.value && e.key === 'Enter') {
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

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Link href="/submit" className="hidden sm:inline-flex">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Submit Tool
            </Button>
          </Link>

          <Show when="signed-out">
            <Link href="/sign-in" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
          </Show>
          
          <Show when="signed-in">
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-2">
                  <UserCircle className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut({ redirectUrl: basePath || "/" })} className="hidden sm:inline-flex">
                Log Out
              </Button>
            </div>
          </Show>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}