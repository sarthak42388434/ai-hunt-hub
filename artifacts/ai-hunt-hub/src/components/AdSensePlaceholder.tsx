import { cn } from "@/lib/utils";

interface AdSensePlaceholderProps {
  type?: "banner" | "rectangle";
  className?: string;
}

export function AdSensePlaceholder({ type = "banner", className }: AdSensePlaceholderProps) {
  return (
    <div 
      className={cn(
        "w-full bg-muted/30 border border-dashed border-muted-foreground/30 flex items-center justify-center relative overflow-hidden rounded-lg my-8",
        type === "banner" ? "h-[90px] max-w-[728px] mx-auto" : "h-[250px] max-w-[300px] mx-auto",
        className
      )}
    >
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest absolute top-2 right-2">
        Advertisement
      </span>
      <div className="text-muted-foreground/50 text-sm font-medium flex items-center gap-2">
        <div className="w-4 h-4 rounded-sm border border-current opacity-50" />
        Ad Space
      </div>
    </div>
  );
}