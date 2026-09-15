import { useQuery } from "@tanstack/react-query";
import { fetchAllowedSites } from "../api/sitesApi";

export const useSitesQuery = () =>
  useQuery({
    queryKey: ["gate-integration", "sites"],
    queryFn: fetchAllowedSites,
    refetchOnWindowFocus: false,
  });
