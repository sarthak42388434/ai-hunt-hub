import { AppLayout } from "@/components/layout/AppLayout";
import { useCompareTools } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { CheckCircle2, XCircle, ExternalLink, ArrowRight, Scale, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Compare() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const ids = searchParams.get("ids") || "";

  const { data: tools, isLoading } = useCompareTools(
    { ids },
    { query: { enabled: !!ids } }
  );

  const pricingColors = {
    free: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    freemium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    paid: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    contact: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  } as const;

  if (!ids) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-32 text-center glass-card max-w-lg mt-20 rounded-3xl border-dashed border-white/10">
          <Scale className="w-16 h-16 text-primary mx-auto mb-6 opacity-80" />
          <h1 className="text-3xl font-black mb-4">Compare Tools</h1>
          <p className="text-muted-foreground mb-8 text-lg font-medium">
            Select up to 3 tools from the directory to compare their features and pricing side by side.
          </p>
          <Button asChild className="rounded-full px-8 glow-primary font-bold">
            <Link href="/browse">Browse Directory</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <span className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Analyzing Data</span>
        </div>
      </AppLayout>
    );
  }

  if (!tools || tools.length === 0) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-32 text-center glass-card max-w-lg mt-20 rounded-3xl">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-6 opacity-80" />
          <h1 className="text-3xl font-black mb-4">Comparison Failed</h1>
          <p className="text-muted-foreground text-lg mb-8 font-medium">The selected tools could not be loaded or no longer exist.</p>
          <Button asChild variant="outline" className="rounded-full px-8">
            <Link href="/browse">Go Back</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header Banner */}
      <div className="bg-muted/20 border-b border-white/5 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Scale className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Head to Head</h1>
            <p className="text-muted-foreground font-medium">Comparing {tools.length} AI tools.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16 overflow-x-auto">
        <div className="min-w-[900px] pb-8">
          <table className="w-full text-left border-collapse glass-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <thead>
              <tr className="bg-background/80 backdrop-blur-xl border-b border-white/10">
                <th className="p-6 w-48 font-bold text-xs uppercase tracking-wider text-muted-foreground align-top bg-white/5">
                  Overview
                </th>
                {tools.map((tool) => (
                  <th key={tool.id} className="p-6 border-l border-white/10 align-top min-w-[280px] w-1/3">
                    <div className="flex flex-col gap-5 h-full">
                      <Avatar className="w-20 h-20 rounded-2xl border border-white/10 bg-background/50 shadow-lg">
                        <AvatarImage src={tool.logoUrl || undefined} className="object-contain p-2" />
                        <AvatarFallback className="rounded-2xl font-black bg-primary/10 text-primary text-xl">{tool.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-black text-2xl mb-2 tracking-tight">{tool.name}</h3>
                        <Badge variant="outline" className={`capitalize text-xs px-3 py-1 font-bold border ${pricingColors[tool.pricing]}`}>
                          {tool.pricing}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium line-clamp-3 leading-relaxed">
                        {tool.shortDescription}
                      </p>
                      <Button className="w-full gap-2 mt-auto rounded-xl font-bold bg-white text-primary hover:bg-white/90" onClick={() => window.open(tool.websiteUrl, "_blank")}>
                        Visit Site <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-6 font-bold text-xs uppercase tracking-wider text-muted-foreground align-top bg-white/[0.01]">User Rating</td>
                {tools.map((tool) => (
                  <td key={tool.id} className="p-6 border-l border-white/5 align-top">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">{tool.ratingAvg?.toFixed(1) || "N/A"}</span>
                      <span className="text-muted-foreground">({tool.reviewCount || 0} reviews)</span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-6 font-bold text-xs uppercase tracking-wider text-muted-foreground align-top bg-white/[0.01]">Category</td>
                {tools.map((tool) => (
                  <td key={tool.id} className="p-6 border-l border-white/5 align-top">
                    <Badge variant="outline" className="bg-white/5 border-white/10 px-3 py-1 text-foreground/80">{tool.categoryName || "Uncategorized"}</Badge>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-6 font-bold text-xs uppercase tracking-wider text-muted-foreground align-top bg-white/[0.01]">Key Features</td>
                {tools.map((tool) => (
                  <td key={tool.id} className="p-6 border-l border-white/5 align-top">
                    {tool.features && tool.features.length > 0 ? (
                      <ul className="space-y-3">
                        {tool.features.slice(0, 5).map((f, i) => (
                          <li key={i} className="flex gap-3 items-start text-foreground/90">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{f}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground/50 italic">Not specified</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-6 font-bold text-xs uppercase tracking-wider text-muted-foreground align-top bg-emerald-500/[0.02]">Pros</td>
                {tools.map((tool) => (
                  <td key={tool.id} className="p-6 border-l border-white/5 align-top">
                    {tool.pros && tool.pros.length > 0 ? (
                      <ul className="space-y-3 text-emerald-400">
                        {tool.pros.map((pro, i) => (
                          <li key={i} className="flex gap-3 items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                            <span className="leading-relaxed">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground/50 italic">Not specified</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-6 font-bold text-xs uppercase tracking-wider text-muted-foreground align-top bg-red-500/[0.02]">Cons</td>
                {tools.map((tool) => (
                  <td key={tool.id} className="p-6 border-l border-white/5 align-top">
                    {tool.cons && tool.cons.length > 0 ? (
                      <ul className="space-y-3 text-red-400">
                        {tool.cons.map((con, i) => (
                          <li key={i} className="flex gap-3 items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                            <span className="leading-relaxed">{con}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground/50 italic">Not specified</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-6 font-bold text-xs uppercase tracking-wider text-muted-foreground align-top bg-white/[0.01]">Platforms</td>
                {tools.map((tool) => (
                  <td key={tool.id} className="p-6 border-l border-white/5 align-top">
                    {tool.platforms && tool.platforms.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {tool.platforms.map(p => (
                          <Badge key={p} variant="outline" className="bg-white/5 border-white/10 px-2 py-0.5">{p}</Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground/50 italic">Not specified</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
            <tfoot className="border-t border-white/10 bg-background/80 backdrop-blur-xl">
              <tr>
                <td className="p-6 bg-white/5"></td>
                {tools.map((tool) => (
                  <td key={tool.id} className="p-6 border-l border-white/10 text-center">
                    <Button variant="outline" asChild className="w-full rounded-xl border-white/10 hover:bg-white/5 font-bold">
                      <Link href={`/tools/${tool.id}`}>
                        Read Full Review <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}