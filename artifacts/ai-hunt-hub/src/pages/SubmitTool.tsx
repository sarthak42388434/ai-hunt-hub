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
import { Loader2, Rocket, Link as LinkIcon, Info, Image as ImageIcon } from "lucide-react";
import { Show } from "@clerk/react";
import { motion } from "framer-motion";

export function SubmitTool() {
  const { data: categories } = useListCategories();
  const submitTool = useSubmitTool();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    websiteUrl: "",
    shortDescription: "",
    categoryId: "",
    pricing: "free",
    longDescription: "",
    features: "",
    logoUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.websiteUrl || !formData.shortDescription || !formData.categoryId) {
        toast({ title: "Required fields missing", description: "Please fill out all required fields marked with *.", variant: "destructive" });
        return;
      }
      setStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      websiteUrl: formData.websiteUrl,
      shortDescription: formData.shortDescription,
      categoryId: parseInt(formData.categoryId, 10),
      pricing: formData.pricing as any,
      longDescription: formData.longDescription,
      features: formData.features.split("\n").filter(f => f.trim() !== ""),
      logoUrl: formData.logoUrl,
    };

    submitTool.mutate({ data: payload }, {
      onSuccess: () => {
        toast({
          title: "Tool submitted successfully!",
          description: "Your tool is now pending review by our editorial team.",
        });
        setLocation("/profile");
      },
      onError: () => {
        toast({
          title: "Submission failed",
          description: "There was an error submitting your tool. Please check your inputs and try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <AppLayout>
      {/* Header Background */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/10 via-purple-600/5 to-background -z-10" />

      <div className="container max-w-3xl mx-auto px-4 py-20 lg:py-28">
        <Show when="signed-out">
          <div className="text-center py-32 glass-card rounded-3xl border-dashed border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <Rocket className="w-16 h-16 text-primary mx-auto mb-6 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
            <h2 className="text-3xl font-black mb-4 tracking-tight">Sign in to launch</h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">Join the platform to submit your AI tool, track its performance, and manage reviews.</p>
            <Button size="lg" className="rounded-full px-10 glow-primary font-bold" onClick={() => window.location.href = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/sign-in`}>
              Sign In to Continue
            </Button>
          </div>
        </Show>

        <Show when="signed-in">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 drop-shadow-sm">Submit an <span className="gradient-text">AI Tool</span></h1>
            <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto">Get your product in front of thousands of founders, developers, and early adopters.</p>
          </div>

          <div className="glass-card border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl bg-background/80 relative">
            
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-10 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full -z-10">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: step === 1 ? "50%" : "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className={`flex flex-col items-center gap-2 ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? "bg-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]" : "bg-muted text-muted-foreground"}`}>
                  1
                </div>
                <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">Basics</span>
              </div>
              <div className={`flex flex-col items-center gap-2 ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]" : "bg-background border border-white/10"}`}>
                  2
                </div>
                <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">Details</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Step 1: Basics */}
              {step === 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <Info className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-black">Basic Information</h3>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tool Name *</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. OpenAI" className="bg-background/50 border-white/10 rounded-xl h-12 focus-visible:ring-primary" required />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="websiteUrl" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Website URL *</Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="websiteUrl" name="websiteUrl" type="url" value={formData.websiteUrl} onChange={handleChange} placeholder="https://" className="pl-10 bg-background/50 border-white/10 rounded-xl h-12 focus-visible:ring-primary" required />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="shortDescription" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pitch (One Sentence) *</Label>
                    <Input id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="What does it do? Keep it punchy." maxLength={100} className="bg-background/50 border-white/10 rounded-xl h-12 focus-visible:ring-primary" required />
                    <p className="text-xs text-muted-foreground font-medium text-right">{formData.shortDescription.length}/100 chars</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="categoryId" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category *</Label>
                      <Select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} className="bg-background/50 border-white/10 rounded-xl h-12 focus-visible:ring-primary" required>
                        <option value="" disabled>Select category...</option>
                        {categories?.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="pricing" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pricing Model *</Label>
                      <Select id="pricing" name="pricing" value={formData.pricing} onChange={handleChange} className="bg-background/50 border-white/10 rounded-xl h-12 focus-visible:ring-primary" required>
                        <option value="free">100% Free</option>
                        <option value="freemium">Freemium (Free tier exists)</option>
                        <option value="paid">Paid Only</option>
                        <option value="contact">Contact for Pricing</option>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="pt-8 flex justify-end">
                    <Button type="button" size="lg" className="rounded-xl px-8 font-bold bg-white text-primary hover:bg-white/90" onClick={handleNext}>
                      Continue to Details
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <ImageIcon className="w-5 h-5 text-purple-500" />
                    <h3 className="text-xl font-black">Deep Dive</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="logoUrl" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Logo URL (Optional)</Label>
                    <Input id="logoUrl" name="logoUrl" type="url" value={formData.logoUrl} onChange={handleChange} placeholder="https://.../logo.png" className="bg-background/50 border-white/10 rounded-xl h-12 focus-visible:ring-primary" />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="longDescription" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Description</Label>
                    <Textarea 
                      id="longDescription" 
                      name="longDescription" 
                      value={formData.longDescription} 
                      onChange={handleChange} 
                      placeholder="Why did you build it? What makes it better? Tell your story..." 
                      className="min-h-[150px] bg-background/50 border-white/10 rounded-xl resize-none focus-visible:ring-primary p-4 text-base"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="features" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Key Features (One per line)</Label>
                    <Textarea 
                      id="features" 
                      name="features" 
                      value={formData.features} 
                      onChange={handleChange} 
                      placeholder="Generates text&#10;Supports 50+ languages&#10;API available" 
                      className="min-h-[120px] bg-background/50 border-white/10 rounded-xl resize-none focus-visible:ring-primary p-4 text-base leading-relaxed"
                    />
                  </div>

                  <div className="pt-8 flex justify-between gap-4">
                    <Button type="button" variant="outline" size="lg" className="rounded-xl px-8 font-bold border-white/10 hover:bg-white/5" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button type="submit" size="lg" disabled={submitTool.isPending} className="rounded-xl px-8 font-bold glow-primary">
                      {submitTool.isPending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                      Submit for Review
                    </Button>
                  </div>
                </motion.div>
              )}

            </form>
          </div>
        </Show>
      </div>
    </AppLayout>
  );
}