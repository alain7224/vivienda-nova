/** Casa & Plano: rutas públicas y área privada de gestión inmobiliaria. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Admin from "./pages/Admin";
import MidPageCtaBridge from "./components/MidPageCtaBridge";
import HeroImageBridge from "./components/HeroImageBridge";
import Home from "./pages/Home";
import Legal from "./pages/Legal";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/privacidad"} component={Legal} />
      <Route path={"/cookies"} component={Legal} />
      <Route path={"/referidos"} component={Legal} />
      <Route path={"/aviso-legal"} component={Legal} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <MidPageCtaBridge />
          <HeroImageBridge />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
