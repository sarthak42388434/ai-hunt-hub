import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  viewAllLink?: string;
}

export function SectionHeading({ title, description, viewAllLink, className, ...props }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8", className)} {...props}>
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {viewAllLink && (
        <Link href={viewAllLink} className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 group whitespace-nowrap">
          View all 
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}