// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { fetchDepartments, Department } from "../api/departmentsApi";

export function useDepartments() {
  // org_id runtime pe badalta hai — key me rakha hai taaki org switch pe refetch ho.
  const orgId = localStorage.getItem("org_id") || "";
  return useQuery<Department[]>({
    queryKey: ["jobs-departments", orgId],
    queryFn: fetchDepartments,
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
  });
}
