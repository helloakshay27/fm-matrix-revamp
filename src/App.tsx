
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            {navItems.map(({ to, page, subItems }) => {
              if (subItems) {
                return subItems.map((subItem) => (
                  <Route 
                    key={subItem.to} 
                    path={subItem.to} 
                    element={<subItem.page />} 
                  />
                ));
              }
              return <Route key={to} path={to} element={<page />} />;
            })}
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
