import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

export function Footer() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <footer className="border-t bg-muted/20 mt-20">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <img src={`${basePath}/logo.svg`} alt="AI Hunt Hub Logo" className="h-8" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mt-4">
              The definitive discovery platform for AI tools. Find the right AI for any task, backed by community reviews and curation.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Discover</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/browse" className="hover:text-primary transition-colors">Browse Tools</Link></li>
              <li><Link href="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
              <li><Link href="/trending" className="hover:text-primary transition-colors">Trending Now</Link></li>
              <li><Link href="/new" className="hover:text-primary transition-colors">New Today</Link></li>
              <li><Link href="/free" className="hover:text-primary transition-colors">Free Tools</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/news" className="hover:text-primary transition-colors">AI News</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">Get the latest AI tools delivered to your inbox.</p>
            <form className="flex gap-2 mt-2" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Enter your email" type="email" className="bg-background" required />
              <Button type="submit" size="icon" className="shrink-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2025 AI Hunt Hub. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link>
            <Link href="/cookie-policy" className="hover:text-foreground transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}