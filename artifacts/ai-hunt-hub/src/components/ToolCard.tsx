import { Tool } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";
import { Star, Eye, Bookmark, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const pricingColors = {
    free: "success",
    freemium: "info",
    paid: "default",
    contact: "secondary",
  } as const;

  return (
    <Link href={`/tools/${tool.id}`} className="block h-full group">
      <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-md hover:border-primary/20 bg-card overflow-hidden">
        <CardHeader className="flex flex-row items-start gap-4 p-5 pb-4">
          <Avatar className="w-12 h-12 rounded-xl border bg-white">
            <AvatarImage src={tool.logoUrl || undefined} alt={tool.name} className="object-contain" />
            <AvatarFallback className="rounded-xl font-bold bg-primary/5 text-primary">
              {tool.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <Badge variant={pricingColors[tool.pricing]} className="capitalize text-[10px] px-1.5 py-0">
                {tool.pricing}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {tool.categoryName || "AI Tool"}
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="p-5 pt-0 flex-1">
          <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
            {tool.shortDescription}
          </p>
        </CardContent>

        <CardFooter className="p-4 bg-muted/30 border-t flex items-center justify-between text-xs text-muted-foreground mt-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5" title={`${tool.ratingAvg?.toFixed(1) || 0} rating`}>
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">{tool.ratingAvg?.toFixed(1) || "0.0"}</span>
            </div>
            <div className="flex items-center gap-1.5" title={`${tool.views || 0} views`}>
              <Eye className="w-3.5 h-3.5" />
              <span>{tool.views || 0}</span>
            </div>
            <div className="flex items-center gap-1.5" title={`${tool.bookmarkCount || 0} bookmarks`}>
              <Bookmark className="w-3.5 h-3.5" />
              <span>{tool.bookmarkCount || 0}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-4 h-4 text-primary" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}