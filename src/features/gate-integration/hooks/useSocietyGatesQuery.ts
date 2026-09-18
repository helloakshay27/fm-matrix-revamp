import { useQuery } from "@tanstack/react-query";
import { fetchSocietyGates } from "../api/societyGatesApi";

export const useSocietyGatesQuery = (page: number = 1) =>
  useQuery({
    queryKey: ["gate-integration", "society-gates", page],
    queryFn: () => fetchSocietyGates(page),
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });
