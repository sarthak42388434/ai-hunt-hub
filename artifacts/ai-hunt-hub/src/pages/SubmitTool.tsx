import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeading } from "@/components/SectionHeading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useSubmitTool, useListCategories } from "@workspace/api-client-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Show } from "@clerk/react";

export function SubmitTool() {
  const { data: categories } = useListCategories();
  const submitTool = useSubmitTool();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    websiteUrl: "",
    shortDescription: "",
    categoryId: "",
    pricing: "free",
    longDescription: "",
    features: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.websiteUrl || !formData.shortDescription || !formData.categoryId) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }

    const payload = {
      name: formData.name,
      websiteUrl: formData.websiteUrl,
      shortDescription: formData.shortDescription,
      categoryId: parseInt(formData.categoryId, 10),
      pricing: formData.pricing as any,
      longDescription: formData.longDescription,
      features: formData.features.split("\n").filter(f => f.trim() !== ""),
    };

    submitTool.mutate({ data: payload }, {
      onSuccess: () => {
        toast({
          title: "Tool submitted successfully!",
          description: "Your tool is now pending review by our editors.",
        });
        setLocation("/profile");
      },
      onError: (err) => {
        toast({
          title: "Submission failed",
          description: "There was an error submitting your tool. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <AppLayout>
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <Show when="signed-out">
          <div className="text-center py-24 bg-muted/30 rounded-xl border border-dashed">
            <h2 className="text-2xl font-bold mb-4">Sign in to submit a tool</h2>
            <p className="text-muted-foreground mb-8">You need an account to submit and manage your AI tools.</p>
            <Button onClick={() => window.location.href = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/sign-in`}>
              Sign In
            </Button>
          </div>
        </Show>

        <Show when="signed-in">
          <SectionHeading 
            title="Submit an AI Tool" 
            description="Share a new AI tool with our community. All submissions are reviewed before publishing."
          />

          <form onSubmit={handleSubmit} className="space-y-8 bg-card border rounded-xl p-6 md:p-8 shadow-sm">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tool Name *</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. ChatGPT" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL *</Label>
                  <Input id="websiteUrl" name="websiteUrl" type="url" value={formData.websiteUrl} onChange={handleChange} placeholder="https://" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description *</Label>
                <Input id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="A one-sentence summary of what the tool does" maxLength={100} required />
                <p className="text-xs text-muted-foreground">Max 100 characters.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category *</Label>
                  <Select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                    <option value="" disabled>Select a category...</option>
                    {categories?.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricing">Pricing Model *</Label>
                  <Select id="pricing" name="pricing" value={formData.pricing} onChange={handleChange} required>
                    <option value="free">Free</option>
                    <option value="freemium">Freemium</option>
                    <option value="paid">Paid</option>
                    <option value="contact">Contact for Pricing</option>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-semibold">Detailed Description</h3>
              
              <div className="space-y-2">
                <Label htmlFor="longDescription">Full Description</Label>
                <Textarea 
                  id="longDescription" 
                  name="longDescription" 
                  value={formData.longDescription} 
                  onChange={handleChange} 
                  placeholder="Describe the tool, its use cases, and why people should use it." 
                  className="min-h-[150px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Key Features (One per line)</Label>
                <Textarea 
                  id="features" 
                  name="features" 
                  value={formData.features} 
                  onChange={handleChange} 
                  placeholder="Generates text&#10;Supports 50+ languages&#10;API available" 
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="pt-6 border-t flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setLocation("/")}>Cancel</Button>
              <Button type="submit" disabled={submitTool.isPending}>
                {submitTool.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit for Review
              </Button>
            </div>
          </form>
        </Show>
      </div>
    </AppLayout>
  );
}