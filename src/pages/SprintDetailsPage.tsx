import axios from "axios";
import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ChevronDown,
  ChevronDownCircle,
  FolderKanban,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  SprintDetails,
  ApiSprint,
  SprintMember,
} from "@/types/sprint";
import {
  formatToDDMMYYYY_AMPM,
  mapStatusToDisplay,
  STATUS_COLORS,
  mapDisplayToApiStatus,
  dropdownOptions,
  extractMembers,
  fmtMinutes,
  mapApiToDetails,
} from "@/utils/sprint";
import { useLayout } from "@/contexts/LayoutContext";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  fetchSprintById,
  updateSprintStatus,
} from "@/store/slices/sprintSlice";
import SprintMemberModal, { MemberSummary } from "@/components/SprintMemberModal";
import SprintProjectModal, { ProjectSummary } from "@/components/SprintProjectModal";
import SprintTaskList from "@/components/SprintTaskList";
import SprintIssueList from "@/components/SprintIssueList";
import SprintActivityLog from "@/components/SprintActivityLog";

export const SprintDetailsPage = () => {
  const { setCurrentSection } = useLayout();
  useEffect(() => {
    setCurrentSection("Project Task");
  }, [setCurrentSection]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const baseUrl = localStorage.getItem("baseUrl") || "";
  const token = localStorage.getItem("token") || "";

  const [loading, setLoading] = useState(true);
  const [sprintDetails, setSprintDetails] = useState<SprintDetails>({});
  const [sprintMembers, setSprintMembers] = useState<SprintMember[]>([]);
  const [totalMembers, setTotalMembers] = useState<number | null>(null);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [membersSummary, setMembersSummary] = useState<MemberSummary[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [projectsSummary, setProjectsSummary] = useState<ProjectSummary[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Open");
  const [memberTaskFilter, setMemberTaskFilter] = useState<number | undefined>(undefined);
  const [memberIssueFilter, setMemberIssueFilter] = useState<number | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<
    "tasks" | "issues" | "activity_log"
  >("tasks");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [sprintResp, projectsResp] = await Promise.all([
        dispatch(fetchSprintById({ token, baseUrl, id })).unwrap(),
        axios.get(`https://${baseUrl}/sprints/${id}/sprint_projects.json`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const resp = sprintResp as ApiSprint;
      setSprintDetails(mapApiToDetails(resp));
      setSprintMembers(extractMembers(resp));
      setTotalMembers(resp.total_members ?? null);
      setSelectedOption(mapStatusToDisplay(resp.status));
      setProjectsSummary(projectsResp.data?.projects_summary || []);
    } catch (error) {
      toast.error(String(error) || "Failed to fetch sprint details");
    } finally {
      setLoading(false);
    }
  }, [id, dispatch, token, baseUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isMembersOpen || !id) return;
    const fetchMembersSummary = async () => {
      setMembersLoading(true);
      try {
        const response = await axios.get(
          `https://${baseUrl}/sprints/${id}/sprint_members.json`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMembersSummary(response.data?.members_summary || []);
      } catch {
        toast.error("Failed to fetch members summary");
      } finally {
        setMembersLoading(false);
      }
    };
    fetchMembersSummary();
  }, [isMembersOpen, id, baseUrl, token]);

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);
    setOpenDropdown(false);

    await dispatch(
      updateSprintStatus({
        token,
        baseUrl,
        id,
        data: { status: option.toLowerCase().replace(/\s+/g, "_") },
      })
    ).unwrap();
    fetchData();
    toast.dismiss();
    toast.success("Status updated successfully");
  };

  return (
    <div className="m-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="py-0">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="px-4 pt-1">
        {loading ? (
          <>
            {/* Title skeleton */}
            <div className="flex items-center gap-3 p-3 px-0">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-48" />
            </div>
            <div className="border-b-[3px] border-[rgba(190,190,190,1)]"></div>

            {/* Header info skeleton */}
            <div className="flex items-center gap-4 my-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-7 w-24 rounded-md" />
            </div>
            <div className="border-b-[3px] border-grey my-3"></div>

            {/* Details card skeleton */}
            <div className="border rounded-[10px] shadow-md p-5 mb-4">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex flex-col">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="flex items-center ml-36">
                      <div className="w-1/2 flex items-center gap-3">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3.5 w-24" />
                      </div>
                      <div className="w-1/2 flex items-center gap-3">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-3.5 w-20" />
                      </div>
                    </div>
                    {i < 4 && (
                      <span className="border h-[1px] inline-block w-full my-4"></span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs skeleton */}
            <div>
              <div className="flex items-center gap-0 border-b-[3px] border-[rgba(190,190,190,1)] pb-2">
                <Skeleton className="h-5 w-16 mx-5" />
                <Skeleton className="h-5 w-16 mx-5" />
              </div>
              <div className="mt-4 space-y-3">
                <Skeleton className="h-10 w-full rounded" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded" />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Title */}
            <h2 className="text-[15px] p-3 px-0">
              <span className="mr-3">S-{sprintDetails.id}</span>
              <span>{sprintDetails.title}</span>
            </h2>
            <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>

            {/* Header Info & Dropdown */}
            <div className="flex items-center justify-between my-3 text-[12px]">
              <div className="flex items-center gap-3 text-[#323232] flex-wrap">
                <span>Created By: {sprintDetails.created_by_name}</span>
                <span className="h-6 w-[1px] border border-gray-300"></span>
                <span className="flex items-center gap-3">
                  Created On: {formatToDDMMYYYY_AMPM(sprintDetails.created_at)}
                </span>
                <span className="h-6 w-[1px] border border-gray-300"></span>

                {/* Status Dropdown */}
                <span
                  className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md text-sm ${STATUS_COLORS[mapDisplayToApiStatus(selectedOption).toLowerCase()] || "bg-gray-400 text-white"}`}
                >
                  <div className="relative" ref={dropdownRef}>
                    <div
                      className="flex items-center gap-1 cursor-pointer px-2 py-1"
                      onClick={() => setOpenDropdown(!openDropdown)}
                      role="button"
                      aria-haspopup="true"
                      aria-expanded={openDropdown}
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setOpenDropdown(!openDropdown)
                      }
                    >
                      <span className="text-[13px]">{selectedOption}</span>
                      <ChevronDown
                        size={15}
                        className={`${openDropdown ? "rotate-180" : ""} transition-transform`}
                      />
                    </div>
                    <ul
                      className={`dropdown-menu absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden ${openDropdown ? "block" : "hidden"}`}
                      role="menu"
                      style={{
                        minWidth: "150px",
                        maxHeight: "400px",
                        overflowY: "auto",
                        zIndex: 1000,
                      }}
                    >
                      {dropdownOptions.map((option, idx) => (
                        <li key={idx} role="menuitem">
                          <button
                            className={`dropdown-item w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 ${selectedOption === option ? "bg-gray-100 font-semibold" : ""}`}
                            onClick={() => handleOptionSelect(option)}
                          >
                            {option}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </span>

                {/* Members */}
                {sprintMembers.length > 0 && (
                  <>
                    <span className="h-6 w-[1px] border border-gray-300"></span>
                    <button
                      onClick={() => setIsMembersOpen(true)}
                      className="flex items-center gap-2 px-2 py-1 rounded-md transition-colors"
                    >
                      <Users size={15} />
                      Sprint Members
                      {totalMembers != null && totalMembers > 0 && (
                        <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">
                          {totalMembers}
                        </span>
                      )}
                    </button>
                  </>
                )}
                {/* Projects */}
                <span className="h-6 w-[1px] border border-gray-300"></span>
                <button
                  onClick={() => setIsProjectsOpen(true)}
                  className="flex items-center gap-2 px-2 py-1 rounded-md transition-colors"
                >
                  <FolderKanban size={15} />
                  Sprint Projects
                  {projectsSummary.length > 0 && (
                    <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">
                      {projectsSummary.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="border-b-[3px] border-grey my-3"></div>

            {/* Details Section */}
            <div className="border rounded-[10px] shadow-md p-5 mb-4">
              <div className="font-[600] text-[16px] flex items-center gap-4">
                <ChevronDownCircle color="#E95420" size={30} />
                Details
              </div>
              <div className="mt-3 flex flex-col">
                {/* Row 1 */}
                <div className="flex items-center ml-16">
                  <div className="w-1/2 flex items-center justify-start gap-3">
                    <div className="text-right text-[14px] font-[500]">
                      Responsible Person :
                    </div>
                    <div className="text-left text-[14px]">
                      {sprintDetails.responsible_person || "-"}
                    </div>
                  </div>
                  <div className="w-1/2 flex items-center justify-start gap-3">
                    <div className="text-right text-[14px] font-[500]">
                      Priority :
                    </div>
                    <div className="text-left text-[14px]">
                      {sprintDetails.priority?.charAt(0)?.toUpperCase() + sprintDetails.priority?.slice(1) || "-"}
                    </div>
                  </div>
                </div>
                <span className="border h-[1px] inline-block w-full my-4"></span>
                {/* Row 2 */}
                <div className="flex items-center ml-16">
                  <div className="w-1/2 flex items-center justify-start gap-3">
                    <div className="text-right text-[14px] font-[500]">
                      Start Date :
                    </div>
                    <div className="text-left text-[14px]">
                      {sprintDetails.start_date || "-"}
                    </div>
                  </div>
                  <div className="w-1/2 flex items-center justify-start gap-3">
                    <div className="text-right text-[14px] font-[500]">
                      End Date :
                    </div>
                    <div className="text-left text-[14px]">
                      {sprintDetails.end_date || "-"}
                    </div>
                  </div>
                </div>
                <span className="border h-[1px] inline-block w-full my-4"></span>
                {/* Row 3 */}
                <div className="flex items-center ml-16">
                  <div className="w-1/2 flex items-center justify-start gap-3">
                    <div className="text-right text-[14px] font-[500]">
                      Total Tasks :
                    </div>
                    <div className="text-left text-[14px]">
                      {sprintDetails?.total_tasks ?? "-"}
                    </div>
                  </div>
                  <div className="w-1/2 flex items-center justify-start gap-3">
                    <div className="text-right text-[14px] font-[500]">
                      Total Issues :
                    </div>
                    <div className="text-left text-[14px]">
                      {sprintDetails?.total_issues ?? "-"}
                    </div>
                  </div>
                </div>
                <span className="border h-[1px] inline-block w-full my-4"></span>
                {/* Row 4 */}
                <div className="flex items-center ml-16">
                  <div className="w-1/2 flex items-center justify-start gap-3">
                    <div className="text-right text-[14px] font-[500]">
                      Effective Hours :
                    </div>
                    <div className="text-left text-[14px] text-[#029464] font-medium">
                      {fmtMinutes(sprintDetails?.total_effective_minutes)}
                    </div>
                  </div>
                  <div className="w-1/2 flex items-center justify-start gap-3">
                    <div className="text-right text-[14px] font-[500]">
                      Actual Hours :
                    </div>
                    <div className="text-left text-[14px] text-[#E95420] font-medium">
                      {fmtMinutes(sprintDetails?.total_actual_minutes)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div>
              {/* Tab headers */}
              <div className="flex items-center gap-0 border-b-[3px] border-[rgba(190,190,190,1)]">
                {(
                  [
                    { key: "tasks", label: "Tasks" },
                    { key: "issues", label: "Issues" },
                    { key: "activity_log", label: "Activity Log" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative px-5 py-2 text-[14px] font-[500] capitalize transition-colors focus:outline-none ${activeTab === tab.key
                      ? "text-[#E95420]"
                      : "text-[#323232] hover:text-[#E95420]"
                      }`}
                  >
                    {tab.label}
                    {activeTab === tab.key && (
                      <span className="absolute bottom-[-3px] left-0 w-full h-[3px] bg-[#E95420] rounded-t-sm" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="mt-4 overflow-x-auto">
                {activeTab === "tasks" && (
                  <SprintTaskList sprintId={String(id)} initialMemberId={memberTaskFilter} />
                )}
                {activeTab === "issues" && (
                  <SprintIssueList sprintId={String(id)} initialMemberId={memberIssueFilter} />
                )}
                {activeTab === "activity_log" && (
                  <SprintActivityLog sprintId={String(id)} />
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <SprintMemberModal
        open={isMembersOpen}
        onClose={() => setIsMembersOpen(false)}
        membersSummary={membersSummary}
        membersLoading={membersLoading}
        onFilterTask={(memberId) => {
          setIsMembersOpen(false);
          setMemberIssueFilter(undefined);
          setMemberTaskFilter(memberId);
          setActiveTab("tasks");
        }}
        onFilterIssue={(memberId) => {
          setIsMembersOpen(false);
          setMemberTaskFilter(undefined);
          setMemberIssueFilter(memberId);
          setActiveTab("issues");
        }}
      />
      <SprintProjectModal
        open={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        projectsSummary={projectsSummary}
        projectsLoading={projectsLoading}
      />
    </div>
  );
};

export default SprintDetailsPage;
