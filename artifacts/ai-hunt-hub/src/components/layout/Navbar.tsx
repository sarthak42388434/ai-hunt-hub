import { Link, useLocation } from "wouter";
import { Search, UserCircle, Plus, Sparkles, Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import { Show, useClerk, useUser } from "@clerk/react";
import { useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const { user } = useUser();
  const { signOut } = useClerk();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      setLocation(`/browse?search=${encodeURIComponent(e.currentTarget.value.trim())}`);
    }
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{
        background: "rgba(5, 10, 24, 0.85)",
        backdropFilter: "blur(20px)",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      <div className="container mx-auto h-16 flex items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", boxShadow: "0 0 16px rgba(99,102,241,0.4)" }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-base tracking-tight hidden sm:block">AI Hunt Hub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            {[
              { label: "Browse", href: "/browse" },
              { label: "Categories", href: "/categories" },
              { label: "Trending", href: "/trending" },
              { label: "New", href: "/new" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="transition-colors"
                style={{ color: "rgb(148 163 184)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgb(148 163 184)")}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search — lg+ */}
          <div className="hidden lg:flex relative w-56">
            <Search className="absolute left-3 top-2.5 h-4 w-4 pointer-events-none" style={{ color: "rgb(100 116 139)" }} />
            <input
              type="search"
              placeholder="Search tools..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleSearchKey}
              className="w-full pl-9 pr-3 h-9 rounded-lg text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "white",
              }}
            />
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: "rgb(100 116 139)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "white")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgb(100 116 139)")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Submit Tool */}
          <Link href="/submit" className="hidden sm:inline-flex">
            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
                boxShadow: "0 0 16px rgba(99,102,241,0.35)",
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              Submit Tool
            </button>
          </Link>

          {/* Auth */}
          <Show when="signed-out">
            <Link href="/sign-in" className="hidden sm:inline-flex">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: "rgb(148 163 184)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgb(148 163 184)")}
              >
                Sign In
              </button>
            </Link>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <button
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{ color: "rgb(148 163 184)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "white")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgb(148 163 184)")}
                >
                  <UserCircle className="h-4 w-4" />
                  {user?.firstName || "Profile"}
                </button>
              </Link>
              <button
                onClick={() => signOut({ redirectUrl: basePath || "/" })}
                className="hidden sm:flex px-3 py-2 rounded-lg text-sm transition-colors"
                style={{ color: "rgb(100 116 139)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgb(100 116 139)")}
              >
                Log Out
              </button>
            </div>
          </Show>

          {/* Mobile menu */}
          <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg" style={{ color: "rgb(148 163 184)" }}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
