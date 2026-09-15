import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchBuildings } from "../api/buildingsApi";

export const useBuildingsQuery = (siteId: number | null) =>
  useInfiniteQuery({
    queryKey: ["gate-integration", "buildings", siteId],
    queryFn: ({ pageParam }) => fetchBuildings(siteId as number, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.current_page < lastPage.pagination.total_pages
        ? lastPage.pagination.current_page + 1
        : undefined,
    enabled: siteId != null,
    refetchOnWindowFocus: false,
  });
