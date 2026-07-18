import { AppLayout } from "@/components/layout/AppLayout";
import { useCompareTools } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { CheckCircle2, XCircle, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export function Compare() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const ids = searchParams.get("ids") || "";

  const { data: tools, isLoading } = useCompareTools(
    { ids },
    { query: { enabled: !!ids } }
  );

  const pricingColors = {
    free: "success",
    freemium: "info",
    paid: "default",
    contact: "secondary",
  } as const;

  if (!ids) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-32 text-center max-w-lg">
          <h1 className="text-3xl font-bold mb-4">Compare Tools</h1>
          <p className="text-muted-foreground mb-8">
            Select up to 3 tools from the browse page to compare them side by side.
          </p>
          <Button asChild>
            <Link href="/browse">Browse Tools</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-32 flex justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!tools || tools.length === 0) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">No Tools Found</h1>
          <p className="text-muted-foreground">The tools you're trying to compare couldn't be found.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12 overflow-x-auto">
        <SectionHeading 
          title="Compare Tools" 
          description={`Comparing ${tools.length} AI tools head to head.`}
        />

        <div className="min-w-[800px]">
          <table className="w-full text-left border-collapse bg-card border rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="p-4 md:p-6 w-48 font-semibold text-muted-foreground align-top">Overview</th>
                {tools.map((tool) => (
                  <th key={tool.id} className="p-4 md:p-6 border-l align-top min-w-[250px] w-1/3">
                    <div className="flex flex-col gap-4">
                      <div className="w-16 h-16 rounded-xl border bg-white flex items-center justify-center p-2">
                        {tool.logoUrl ? (
                          <img src={tool.logoUrl} alt={tool.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <span className="font-bold text-primary">{tool.name.substring(0, 2)}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{tool.name}</h3>
                        <Badge variant={pricingColors[tool.pricing]} className="capitalize text-xs">
                          {tool.pricing}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-normal line-clamp-3">
                        {tool.shortDescription}
                      </p>
                      <Button className="w-full gap-2 mt-auto" onClick={() => window.open(tool.websiteUrl, "_blank")}>
                        Visit Site <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b hover:bg-muted/10">
                <td className="p-4 md:p-6 font-semibold text-muted-foreground align-top">Rating</td>
                {tools.map((tool) => (
                  <td key={tool.id} className="p-4 md:p-6 border-l align-top">
                    <div className="flex items-center gap-2 font-medium">
                      <span className="text-lg">{tool.ratingAvg?.toFixed(1) || "N/A"}</span>
                      <span className="text-muted-foreground">({tool.reviewCount || 0} reviews)</span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-b hover:bg-muted/10">
                <td className="p-4 md:p-6 font-semibold text-muted-foreground align-top">Category</td>
                {tools.map((tool) => (
                  <td key={tool.id} className="p-4 md:p-6 border-l align-top">
                    {tool.categoryName || "Uncategorized"}
                  </td>
                ))}
              </tr>
              <tr className="border-b hover:bg-muted/10">
                <td className="p-4 md:p-6 font-semibold text-muted-foreground align-top">Key Features</td>
                {tools.map((tool) => (
                  <td key={tool.id} className="p-4 md:p-6 border-l align-top">
                    {tool.features && tool.features.length > 0 ? (
                      <ul className="space-y-2">
                        {tool.features.slice(0, 5).map((f, i) => (
                          <li key={i} className="flex gap-2 items-start">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground italic">Not specified</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b hover:bg-muted/10">
                <td className="p-4 md:p-6 font-semibold text-muted-foreground align-top">Pros</td>
                {tools.map((tool) => (
                  <td key={tool.id} className="p-4 md:p-6 border-l align-top">
                    {tool.pros && tool.pros.length > 0 ? (
                      <ul className="space-y-2 text-green-800 dark:text-green-400">
                        {tool.pros.map((pro, i) => (
                          <li key={i} className="flex gap-2 items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 mt-1.5" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground italic">Not specified</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b hover:bg-muted/10">
                <td className="p-4 md:p-6 font-semibold text-muted-foreground align-top">Cons</td>
                {tools.map((tool) => (
                  <td key={tool.id} className="p-4 md:p-6 border-l align-top">
                    {tool.cons && tool.cons.length > 0 ? (
                      <ul className="space-y-2 text-red-800 dark:text-red-400">
                        {tool.cons.map((con, i) => (
                          <li key={i} className="flex gap-2 items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground italic">Not specified</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-muted/10">
                <td className="p-4 md:p-6 font-semibold text-muted-foreground align-top">Platforms</td>
                {tools.map((tool) => (
                  <td key={tool.id} className="p-4 md:p-6 border-l align-top">
                    {tool.platforms && tool.platforms.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {tool.platforms.map(p => (
                          <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">Not specified</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
            <tfoot className="border-t bg-muted/10">
              <tr>
                <td className="p-4 md:p-6"></td>
                {tools.map((tool) => (
                  <td key={tool.id} className="p-4 md:p-6 border-l text-center">
                    <Button variant="outline" asChild className="w-full">
                      <Link href={`/tools/${tool.id}`}>
                        View Details <ArrowRight className="w-4 h-4 ml-2" />
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