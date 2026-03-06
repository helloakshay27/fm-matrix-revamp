import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { queryClient } from "@/config/queryClient";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * QueryProvider - Wraps project pages that use TanStack Query
 *
 * Usage:
 * - Wrap around individual pages or route groups that need TanStack Query
 * - Does NOT interfere with Redux which continues to manage app state
 * - Keep at the component tree level where needed (not at root)
 *
 * Example:
 * <QueryProvider>
 *   <ProjectsList />
 * </QueryProvider>
 */
export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
