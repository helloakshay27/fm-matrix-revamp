// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { fetchDepartments, Department } from "../api/departmentsApi";

export function useDepartments() {
  return useQuery<Department[]>({
    queryKey: ["jobs-departments"],
    queryFn: fetchDepartments,
    staleTime: 5 * 60 * 1000,
  });
}
