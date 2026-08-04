// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { fetchKras } from "../api/jobsApi";

export function useFetchKras(departmentId = null, assigneeId = null) {
    const normalizedDeptId = departmentId && departmentId !== "all" ? departmentId : null;
    const normalizedAssigneeId = assigneeId && assigneeId !== "all" ? assigneeId : null;

    return useQuery({
        queryKey: ["kras-list", normalizedDeptId, normalizedAssigneeId],
        queryFn: () => fetchKras(normalizedDeptId, normalizedAssigneeId),
        staleTime: 2 * 60 * 1000,
    });
}
