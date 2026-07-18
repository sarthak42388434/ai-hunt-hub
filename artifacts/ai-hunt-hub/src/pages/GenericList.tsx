import { AppLayout } from "@/components/layout/AppLayout";
import { ToolCard } from "@/components/ToolCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Loader2 } from "lucide-react";
import { UseQueryResult } from "@tanstack/react-query";
import { Tool } from "@workspace/api-client-react";

interface GenericListProps {
  title: string;
  description?: string;
  useQueryHook: (params?: { limit?: number }) => UseQueryResult<Tool[], any>;
}

export function GenericList({ title, description, useQueryHook }: GenericListProps) {
  const { data: tools, isLoading } = useQueryHook({ limit: 50 });

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12">
        <SectionHeading 
          title={title} 
          description={description}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : tools && tools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-muted/20 rounded-xl border border-dashed">
            <h3 className="text-xl font-semibold mb-2">No tools found</h3>
            <p className="text-muted-foreground">Check back later for updates.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}