import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Zap, Twitter, Github, Linkedin } from "lucide-react";
import { useSubscribeNewsletter } from "@workspace/api-client-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function Footer() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const subscribe = useSubscribeNewsletter();
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    subscribe.mutate({ data: { email } }, {
      onSuccess: () => {
        toast({ title: "Subscribed successfully!", description: "You're now on the list." });
        setEmail("");
      },
      onError: () => {
        toast({ title: "Subscription failed", variant: "destructive", description: "Please try again later." });
      }
    });
  };

  return (
    <footer className="relative mt-20 border-t border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-background/50 backdrop-blur-3xl -z-10" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 group outline-none w-fit">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)]">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight gradient-text">
                AI Hunt Hub
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              The definitive discovery platform for AI tools. Find the right AI for any task, backed by community reviews and curation.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors border border-white/5">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors border border-white/5">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors border border-white/5">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-semibold text-foreground tracking-wide">Product</h4>
            <ul className="space-y-3.5 text-sm text-muted-foreground">
              <li><Link href="/browse" className="hover:text-primary transition-colors">Browse Tools</Link></li>
              <li><Link href="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
              <li><Link href="/trending" className="hover:text-primary transition-colors">Trending Now</Link></li>
              <li><Link href="/new" className="hover:text-primary transition-colors">New Additions</Link></li>
              <li><Link href="/submit" className="hover:text-primary transition-colors text-primary/80">Submit Tool</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-semibold text-foreground tracking-wide">Resources</h4>
            <ul className="space-y-3.5 text-sm text-muted-foreground">
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/news" className="hover:text-primary transition-colors">AI News</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Advertising</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-semibold text-foreground tracking-wide">Stay Updated</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">Join 15,000+ founders getting the latest AI tools weekly.</p>
            <form className="space-y-3" onSubmit={handleSubscribe}>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition duration-500"></div>
                <div className="relative flex items-center bg-background/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden focus-within:border-primary/50 transition-colors">
                  <Input 
                    placeholder="name@email.com" 
                    type="email" 
                    className="border-0 bg-transparent focus-visible:ring-0 px-4 h-11" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required 
                  />
                  <Button type="submit" size="icon" variant="ghost" className="mr-1 h-9 w-9 text-muted-foreground hover:text-primary hover:bg-transparent" disabled={subscribe.isPending}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AI Hunt Hub. Crafted with precision.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link>
            <Link href="/cookie-policy" className="hover:text-foreground transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}