import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "wouter";

export function StaticPage({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <AppLayout>
      <div className="container max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">{title}</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold">
          {children}
        </div>
      </div>
    </AppLayout>
  );
}

export function PrivacyPolicy() {
  return (
    <StaticPage title="Privacy Policy">
      <p>Last updated: June 1, 2025</p>
      
      <h2>1. Introduction</h2>
      <p>AI Hunt Hub ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.</p>

      <h2>2. The Data We Collect About You</h2>
      <p>Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
      <ul>
        <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
        <li><strong>Contact Data</strong> includes email address.</li>
        <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
        <li><strong>Profile Data</strong> includes your username and password, submissions made by you, your interests, preferences, feedback and survey responses.</li>
        <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
      </ul>

      <h2>3. How We Use Your Personal Data</h2>
      <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
      <ul>
        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
        <li>Where we need to comply with a legal obligation.</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>

      <h2>5. Your Legal Rights</h2>
      <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.</p>
    </StaticPage>
  );
}

export function TermsOfService() {
  return (
    <StaticPage title="Terms of Service">
      <p>Last updated: June 1, 2025</p>

      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using AI Hunt Hub (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>

      <h2>2. Description of Service</h2>
      <p>AI Hunt Hub provides users with access to a curated directory of AI tools, community reviews, and related editorial content. You understand and agree that the Service is provided "AS-IS" and that AI Hunt Hub assumes no responsibility for the timeliness, deletion, mis-delivery or failure to store any user communications or personalization settings.</p>

      <h2>3. User Submissions</h2>
      <p>You may submit tools to be included in the directory. By submitting a tool, you guarantee that:</p>
      <ul>
        <li>You have the right to submit the tool.</li>
        <li>The information provided is accurate and up-to-date.</li>
        <li>The tool does not contain malicious code, malware, or illegal content.</li>
      </ul>
      <p>We reserve the right to reject or remove any submission at our sole discretion without notice or explanation.</p>

      <h2>4. Content and Copyright</h2>
      <p>You retain your rights to any content you submit, post or display on or through the Service. By submitting, posting or displaying content on or through the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display and distribute such content in any and all media or distribution methods.</p>

      <h2>5. Disclaimer of Warranties</h2>
      <p>Your use of the service is at your sole risk. The service is provided on an "as is" and "as available" basis. AI Hunt Hub expressly disclaims all warranties of any kind, whether express or implied, including, but not limited to the implied warranties of merchantability, fitness for a particular purpose and non-infringement.</p>
    </StaticPage>
  );
}

export function About() {
  return (
    <StaticPage title="About AI Hunt Hub">
      <p className="lead text-xl text-muted-foreground mb-8">
        We're building the definitive layer of discovery for the artificial intelligence revolution.
      </p>

      <h2>Our Mission</h2>
      <p>The pace of AI development is staggering. Every day, dozens of new tools are launched, promising to revolutionize how we work, create, and think. But amid this explosion of innovation, discovery is broken. It's too hard to separate the signal from the noise.</p>
      <p>AI Hunt Hub exists to solve this. We meticulously index, categorize, and evaluate AI tools so developers, founders, creators, and enterprises can find exactly what they need, when they need it.</p>

      <h2>How We Work</h2>
      <p>Unlike automated scrapers, AI Hunt Hub relies on a hybrid approach of community submission and editorial curation:</p>
      <ul>
        <li><strong>Community-Driven:</strong> Makers submit their tools, and users share real, unvarnished reviews.</li>
        <li><strong>Editorially Curated:</strong> Our team reviews submissions for quality, assigns strict categories, and highlights exceptional products through the "Editor's Choice" badge.</li>
        <li><strong>Data-Rich:</strong> We capture structured data on pricing, models, platforms, and features to make complex comparisons easy.</li>
      </ul>

      <h2>Join the Community</h2>
      <p>Whether you're an AI researcher, a startup founder, or just someone looking to automate a tedious task, you belong here. Create an account to save tools, write reviews, and join the conversation.</p>
    </StaticPage>
  );
}

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export function Contact() {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We've received your message and will get back to you shortly.",
    });
  };

  return (
    <StaticPage title="Contact Us">
      <p className="text-muted-foreground mb-8">
        Have a question, feedback, or partnership inquiry? Fill out the form below and our team will get back to you as soon as possible.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl not-prose">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" required placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required placeholder="john@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" required placeholder="How can we help?" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" required placeholder="Your message here..." className="min-h-[150px]" />
        </div>
        <Button type="submit" size="lg">Send Message</Button>
      </form>
    </StaticPage>
  );
}

export function GenericPolicy({ title }: { title: string }) {
  return (
    <StaticPage title={title}>
      <p>Last updated: June 1, 2025</p>
      <p>This is a placeholder page for the {title}. A full legal document would typically be placed here covering the specifics of the policy.</p>
      <p>If you have any questions regarding this policy, please visit our <a href="/contact">Contact page</a>.</p>
    </StaticPage>
  );
}

import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export function Pricing() {
  return (
    <AppLayout>
      <div className="container max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose how you want your AI tool to be discovered by thousands of daily users.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <Card className="flex flex-col relative overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl">Standard Listing</CardTitle>
              <CardDescription>Perfect for new tools and indie makers.</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-muted-foreground"> / forever</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3 items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span>Standard directory listing</span>
                </li>
                <li className="flex gap-3 items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span>Accept user reviews and ratings</span>
                </li>
                <li className="flex gap-3 items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span>Basic analytics dashboard</span>
                </li>
                <li className="flex gap-3 items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span>Eligible for organic trending</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/submit">Submit for Free</a>
              </Button>
            </CardFooter>
          </Card>

          {/* Featured Tier */}
          <Card className="flex flex-col relative overflow-hidden border-primary shadow-lg shadow-primary/10">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              Recommended
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Featured Listing</CardTitle>
              <CardDescription>Maximum visibility to drive immediate growth.</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-extrabold">$299</span>
                <span className="text-muted-foreground"> / month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3 items-center font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span>Everything in Standard, plus:</span>
                </li>
                <li className="flex gap-3 items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span>Guaranteed homepage placement</span>
                </li>
                <li className="flex gap-3 items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span>Featured in our weekly newsletter</span>
                </li>
                <li className="flex gap-3 items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span>"Verified" badge on your listing</span>
                </li>
                <li className="flex gap-3 items-center">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span>Priority 24-hour review process</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <a href="/contact">Contact Sales</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}