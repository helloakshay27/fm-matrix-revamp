import {
  DndContext,
  DragEndEvent,
  closestCorners,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { useCallback, useState, useEffect } from "react";
import KanbanBoard from "./KanbanBoard";
import IssueCard from "./IssueCard";
import { toast } from "sonner";
import axios from "axios";

const issueKanbanColumns = [
  {
    id: 1,
    title: "Open",
    color: "#E4636A",
    status: "open",
  },
  {
    id: 2,
    title: "In Progress",
    color: "#08AEEA",
    status: "in_progress",
  },
  {
    id: 3,
    title: "On Hold",
    color: "#7BD2B5",
    status: "on_hold",
  },
  {
    id: 4,
    title: "Completed",
    color: "#83D17A",
    status: "completed",
  },
  {
    id: 5,
    title: "Reopen",
    color: "#F59E0B",
    status: "reopen",
  },
  {
    id: 6,
    title: "Closed",
    color: "#FF2733",
    status: "closed",
  },
];

interface IssueManagementKanbanProps {
  showMyIssuesOnly?: boolean;
  appliedFilters?: string;
  projectId?: string;
  projectIdParam?: string;
  taskIdParam?: string;
  milestoneIdParam?: string;
  onRefresh?: () => void;
}

const IssueManagementKanban = ({
  showMyIssuesOnly = false,
  appliedFilters = "",
  projectId,
  projectIdParam,
  taskIdParam,
  milestoneIdParam,
  onRefresh,
}: IssueManagementKanbanProps) => {
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const [issueList, setIssueList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);
  const [droppedIssues, setDroppedIssues] = useState<Record<string, string>>(
    {}
  );

  const fetchKanbanIssues = useCallback(async () => {
    if (!token || !baseUrl) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (showMyIssuesOnly) {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.id) {
          params.append("q[responsible_person_id_eq]", user.id.toString());
        }
      }

      if (projectId || projectIdParam) {
        params.append(
          "q[project_management_id_eq]",
          projectId || projectIdParam || ""
        );
      }
      if (taskIdParam) {
        params.append("q[task_management_id_eq]", taskIdParam);
      }
      if (milestoneIdParam) {
        params.append("q[milestone_id_eq]", milestoneIdParam);
      }

      // Append applied filters if present
      let url = `https://${baseUrl}/issues.json?per_page=500`;
      if (params.toString()) {
        url += `&${params.toString()}`;
      }
      if (appliedFilters) {
        url += `&${appliedFilters}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIssueList(response.data.issues || []);
    } catch (error) {
      console.error("Error fetching issues for Kanban:", error);
      toast.error("Failed to load issues for Kanban view");
    } finally {
      setLoading(false);
    }
  }, [
    token,
    baseUrl,
    showMyIssuesOnly,
    projectId,
    projectIdParam,
    taskIdParam,
    milestoneIdParam,
    appliedFilters,
  ]);

  useEffect(() => {
    fetchKanbanIssues();
  }, [fetchKanbanIssues]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const activeData = event.active.data.current;
    if (activeData?.type === "ISSUE") {
      setDraggedIssueId(activeData.issueId.toString());
    }
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setDraggedIssueId(null);

      if (!over) return;

      const activeData = active.data.current;
      const overData = over.data.current;

      if (activeData?.type === "ISSUE" && overData?.type === "KANBAN_COLUMN") {
        const issueId = activeData.issueId;
        const issue = activeData.issue;
        const newStatus = overData.title;

        // Don't update if dropping in the same column
        if (issue.status === newStatus) return;

        // Optimistic update
        setDroppedIssues((prev) => ({
          ...prev,
          [issueId]: newStatus,
        }));

        try {
          await axios.put(
            `https://${baseUrl}/issues/${issueId}.json`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("Issue status updated");
          // Refresh the data
          fetchKanbanIssues();
          onRefresh?.();
        } catch (error) {
          // Revert optimistic update
          setDroppedIssues((prev) => {
            const updated = { ...prev };
            delete updated[issueId];
            return updated;
          });
          toast.error("Failed to update issue status");
        }
      }
    },
    [baseUrl, token, fetchKanbanIssues, onRefresh]
  );

  const SkeletonColumn = () => (
    <div className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-lg p-4">
      <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-lg p-4 space-y-2 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative">
      {loading ? (
        <div className="py-4">
          <div
            className="flex gap-2 overflow-x-auto"
            style={{ height: "75vh" }}
          >
            {issueKanbanColumns.map((col) => (
              <SkeletonColumn key={col.id} />
            ))}
          </div>
        </div>
      ) : (
        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div
            className="h-[80%] my-3 flex items-start gap-2 max-w-full overflow-x-auto overflow-y-auto flex-nowrap"
            style={{
              height: "75vh",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {issueKanbanColumns.map((col) => {
              const filteredIssues = issueList.filter((issue) => {
                const effectiveStatus = droppedIssues[issue.id] || issue.status;
                return effectiveStatus === col.status;
              });

              return (
                <KanbanBoard
                  key={col.id}
                  add={false}
                  color={col.color}
                  count={filteredIssues.length}
                  title={col.title}
                  onDrop={() => {}}
                >
                  {filteredIssues.length > 0 ? (
                    <div
                      style={{
                        height: "500px",
                        overflow: "auto",
                        width: "100%",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                      className="scrollbar-hide"
                    >
                      {filteredIssues.map((issue) => (
                        <div key={issue.id} id={`issue-${issue.id}`}>
                          <IssueCard issue={issue} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                      No issues
                    </div>
                  )}
                </KanbanBoard>
              );
            })}
          </div>
          <DragOverlay>
            {draggedIssueId ? (
              issueList.find(
                (issue) => issue.id.toString() === draggedIssueId
              ) ? (
                <div className="w-60 opacity-100">
                  <IssueCard
                    issue={issueList.find(
                      (issue) => issue.id.toString() === draggedIssueId
                    )}
                  />
                </div>
              ) : null
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

export default IssueManagementKanban;
