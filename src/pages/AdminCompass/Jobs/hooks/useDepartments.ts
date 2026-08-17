// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { fetchDepartments, getOrgId, Department } from "../api/departmentsApi";

export function useDepartments() {
  // org_id runtime pe badalta hai — key me rakha hai taaki org switch pe refetch ho.
  const orgId = getOrgId();
  return useQuery<Department[]>({
    queryKey: ["jobs-departments", orgId],
    queryFn: fetchDepartments,
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
  });
}
