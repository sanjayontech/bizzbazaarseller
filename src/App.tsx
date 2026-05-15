import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import StartupLoader from "./components/StartupLoader";

const Index    = lazy(() => import("./pages/Index"));
const Language = lazy(() => import("./pages/Language").then(m => ({ default: m.Language })));
const StoreName = lazy(() => import("./pages/StoreName").then(m => ({ default: m.StoreName })));
const StoreType = lazy(() => import("./pages/StoreType").then(m => ({ default: m.StoreType })));
const Confirm  = lazy(() => import("./pages/Confirm").then(m => ({ default: m.Confirm })));
const Success  = lazy(() => import("./pages/Success").then(m => ({ default: m.Success })));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="sync" initial={false}>
      <Suspense fallback={null}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/language" element={<Language />} />
          <Route path="/store-name" element={<StoreName />} />
          <Route path="/store-type" element={<StoreType />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/success" element={<Success />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => {
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const initializeApp = async () => {
      // You can add actual initialization logic here
      // For now, we'll just wait for the minimum loading time
      await new Promise(resolve => setTimeout(resolve, 100));
      setIsAppLoaded(true);
    };

    initializeApp();
  }, []);

  const handleLoadingComplete = () => {
    setShowLoader(false);
  };

  if (showLoader) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <StartupLoader 
            onLoadingComplete={handleLoadingComplete}
            minLoadingTime={2500}
            showProgress={true}
          />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
