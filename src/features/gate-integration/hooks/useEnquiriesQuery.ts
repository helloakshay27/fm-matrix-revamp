import { useQuery } from "@tanstack/react-query";
import { fetchEnquiries } from "../api/enquiriesApi";

export const useEnquiriesQuery = () =>
  useQuery({
    queryKey: ["gate-integration", "enquiries"],
    queryFn: fetchEnquiries,
    refetchOnWindowFocus: false,
  });
