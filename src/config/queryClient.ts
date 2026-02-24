import { QueryClient } from "@tanstack/react-query";

/**
 * Create and configure Query Client for Projects module
 * This only manages server state for project-related pages
 * Redux continues to handle app state in other parts
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds - data is fresh for 30s
      gcTime: 5 * 60 * 1000, // 5 minutes - keep unused data in cache for 5 minutes
      refetchOnWindowFocus: true, // Refetch when window regains focus
      refetchOnReconnect: true, // Refetch when connection is restored
      retry: 1, // Retry failed requests once
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    },
    mutations: {
      retry: 1, // Retry failed mutations once
    },
  },
});
