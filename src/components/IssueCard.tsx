import { useDraggable } from "@dnd-kit/core";
import { Briefcase, Flag, User2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CSS } from "@dnd-kit/utilities";

const getInitials = (name = "") => {
  const parts = name
    ?.trim()
    .split(" ")
    .filter((part) => part.length > 0);
  if (!parts || parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "";
  return (parts[0][0] + parts[parts.length - 1][0])?.toUpperCase();
};

const priorityColorMap: Record<string, string> = {
  high: "text-red-600",
  medium: "text-amber-500",
  low: "text-green-600",
  critical: "text-red-800",
};

const IssueCard = ({ issue }: { issue: any }) => {
  const navigate = useNavigate();

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `issue-${issue.id}`,
      data: {
        type: "ISSUE",
        issueId: issue.id,
        issue: issue,
      },
    });

  const priorityClass =
    priorityColorMap[issue.priority?.toLowerCase()] || "text-gray-500";

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        opacity: isDragging ? 0.4 : 1,
        transform: CSS.Translate.toString(transform),
      }}
      className="w-full h-max bg-white p-2 shadow-xl text-xs flex flex-col space-y-2 mb-2 rounded"
    >
      <p
        className="mb-1 truncate cursor-pointer text-start hover:text-blue-600 transition-colors font-medium"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/vas/issues/${issue.id}`);
        }}
      >
        <span className="text-blue-500">I-{issue.id}</span> {issue.title}
      </p>
      <div
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        className="flex-1"
      >
        <div {...listeners} className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Briefcase className="text-[#C72030] flex-shrink-0" size={14} />
            <span className="text-[10px] truncate">
              {issue.project_management_name || "No Project"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Flag className="text-[#C72030] flex-shrink-0" size={14} />
            <span className="text-[10px] truncate">
              {issue.milstone_name || "No Milestone"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <User2 className="text-[#C72030] flex-shrink-0" size={14} />
            <span className="text-[10px] truncate">
              {issue.responsible_person_name ||
                issue.responsible_person_id ||
                "Unassigned"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle
              className={`flex-shrink-0 ${priorityClass}`}
              size={14}
            />
            <span className={`text-[10px] capitalize ${priorityClass}`}>
              {issue.priority || "N/A"}
            </span>
          </div>
        </div>

        <hr className="border border-gray-200 my-2" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-gray-500">
              {issue.issue_type || "No Type"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {issue.end_date && (
              <span className="flex items-center gap-1 text-[9px] text-gray-600">
                {new Date(issue.end_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            )}
            <span className="h-5 w-5 flex items-center justify-center bg-green-600 text-white rounded-full text-[7px] font-light">
              {getInitials(issue.responsible_person_name || "")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
