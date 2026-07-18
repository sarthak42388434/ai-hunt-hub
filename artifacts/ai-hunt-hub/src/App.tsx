import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { ThemeProvider } from '@/components/theme-provider';

// Clerk
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';

// Pages
import { Home } from '@/pages/Home';
import { Browse } from '@/pages/Browse';
import { Categories } from '@/pages/Categories';
import { GenericList } from '@/pages/GenericList';
import { ToolDetail } from '@/pages/ToolDetail';
import { SubmitTool } from '@/pages/SubmitTool';
import { Profile } from '@/pages/Profile';
import { Compare } from '@/pages/Compare';
import { BlogList } from '@/pages/BlogList';
import { BlogPost } from '@/pages/BlogPost';
import { NewsList } from '@/pages/NewsList';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { PrivacyPolicy, TermsOfService, About, Contact, GenericPolicy, Pricing } from '@/pages/StaticPages';
import { 
  useGetTrendingTools, 
  useGetNewestTools, 
  useGetFreeTools 
} from "@workspace/api-client-react";

const clerkPubKey = publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || "/" : path;
}

const queryClient = new QueryClient();

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/browse" component={Browse} />
      <Route path="/categories" component={Categories} />
      <Route path="/categories/:slug" component={Browse} />
      
      <Route path="/trending">
        {() => <GenericList title="Trending Tools" description="The most popular AI tools this week" useQueryHook={useGetTrendingTools} />}
      </Route>
      <Route path="/new">
        {() => <GenericList title="Newest Tools" description="Freshly launched AI products" useQueryHook={useGetNewestTools} />}
      </Route>
      <Route path="/free">
        {() => <GenericList title="Free Tools" description="Powerful AI without the price tag" useQueryHook={useGetFreeTools} />}
      </Route>
      
      <Route path="/tools/:id" component={ToolDetail} />
      <Route path="/submit" component={SubmitTool} />
      <Route path="/profile" component={Profile} />
      <Route path="/compare" component={Compare} />
      
      <Route path="/blog" component={BlogList} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/news" component={NewsList} />
      
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/:section" component={AdminDashboard} />
      
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/disclaimer">{() => <GenericPolicy title="Disclaimer" />}</Route>
      <Route path="/cookie-policy">{() => <GenericPolicy title="Cookie Policy" />}</Route>
      <Route path="/editorial-policy">{() => <GenericPolicy title="Editorial Policy" />}</Route>
      <Route path="/review-policy">{() => <GenericPolicy title="Review Policy" />}</Route>
      
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ai-hunt-hub-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={basePath}>
            <ClerkProvider
              publishableKey={clerkPubKey}
              proxyUrl={clerkProxyUrl}
              signInUrl={`${basePath}/sign-in`}
              signUpUrl={`${basePath}/sign-up`}
              routerPush={(to) => window.history.pushState(null, '', stripBase(to))}
              routerReplace={(to) => window.history.replaceState(null, '', stripBase(to))}
              appearance={{
                theme: shadcn,
                cssLayerName: "clerk",
                variables: {
                  colorPrimary: "hsl(244, 76%, 59%)",
                  colorBackground: "hsl(222, 47%, 6%)",
                  colorForeground: "hsl(210, 40%, 96%)",
                  colorMutedForeground: "hsl(215, 20%, 50%)",
                  colorInput: "hsl(217, 33%, 17%)",
                  colorInputForeground: "hsl(210, 40%, 96%)",
                  colorNeutral: "hsl(217, 33%, 17%)",
                  colorDanger: "hsl(0, 72%, 51%)",
                  fontFamily: "Inter, system-ui, sans-serif",
                  borderRadius: "0.75rem",
                }
              }}
            >
              <Router />
            </ClerkProvider>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;