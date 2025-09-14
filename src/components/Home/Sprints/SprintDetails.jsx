import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronDownCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpirintById } from "../../../redux/slices/spirintSlice";

const sprintData = {
  id: 1,
  title: "Sprint 1 - Feature Development",
  description: "",
  created_by: { name: "John Doe" },
  created_at: "2025-06-01T10:00:00Z",
  start_date: "2025-06-01",
  end_date: "2025-06-14",
  status: "In Progress",
  priority: "High",
  team_members: [
    { id: 1, name: "Alice Smith" },
    { id: 2, name: "Bob Johnson" },
    { id: 3, name: "Carol White" },
  ],
  goals: [
    { id: 1, name: "Complete dashboard UI" },
    { id: 2, name: "Implement data API" },
  ],
  comments: [
    { id: 1, user: "Alice Smith", content: "UI designs approved.", timestamp: "2025-06-02" },
    { id: 2, user: "Bob Johnson", content: "API integration in progress.", timestamp: "2025-06-05" },
  ],
  attachments: [
    { id: 1, name: "sprint_plan.pdf", url: "#" },
    { id: 2, name: "mockup.png", url: "#" },
  ],
  status_logs: [
    { id: 1, status: "Not Started", timestamp: "2025-05-30" },
    { id: 2, status: "In Progress", timestamp: "2025-06-01" },
  ],
};

const SprintDetails = () => {
  const [isFirstCollapsed, setIsFirstCollapsed] = useState(false);
  const [isSecondCollapsed, setIsSecondCollapsed] = useState(false);
  const firstContentRef = useRef(null);
  const secondContentRef = useRef(null);
  const { sid } = useParams()



  const dispatch = useDispatch();
  const token = localStorage.getItem("token");


  const { fetchSpirintById: newSprint } = useSelector(
    (state) => state.fetchSpirintById
  );

  useEffect(() => {
    dispatch(fetchSpirintById({ token, id: sid }));
  }, [dispatch, sid]);






  // Format date to DD/MM/YYYY HH:MM AM/PM
  const formatToDDMMYYYY_AMPM = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Toggle collapsible sections
  const toggleFirstCollapse = () => setIsFirstCollapsed(!isFirstCollapsed);
  const toggleSecondCollapse = () => setIsSecondCollapsed(!isSecondCollapsed);


  console.log(newSprint);

  return (
    <div className="m-4">
      <div className="px-4 pt-1">
        <h2 className="text-[15px] p-3 px-0">
          <span className="mr-3">S-{newSprint.id}</span>
          <span>{newSprint.name}</span>
        </h2>
        <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
        <div className="flex items-center justify-between my-3 text-[12px]">
          <div className="flex items-center gap-3 text-[#323232]">
            <span>Created By: {sprintData.created_by.name}</span>
            <span className="h-6 w-[1px] border border-gray-300"></span>
            <span className="flex items-center gap-3">
              Created On: {formatToDDMMYYYY_AMPM(newSprint.created_at)}
            </span>
            <span className="h-6 w-[1px] border border-gray-300"></span>
            <span className="flex relative items-center gap-2 cursor-pointer px-2 py-1 w-[150px] rounded-md text-sm text-white bg-[#C85E68]">
              <div className="relative w-full">
                <div
                  className="flex items-center justify-between gap-1 px-2 py-1 rounded-md w-fit"
                  role="button"
                  tabIndex={0}
                >
                  <span className="text-[13px]">
                    {newSprint.status?.charAt(0).toUpperCase() + newSprint.status?.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>

            </span>
          </div>
        </div>
        <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)] my-3"></div>
        <div className="border rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.1)] p-5 mb-4 text-[14px]">
          <div className="font-[600] text-[16px] flex items-center gap-4" onClick={toggleFirstCollapse}>
            <ChevronDownCircle
              color="#E95420"
              size={30}
              className={`${isFirstCollapsed ? "rotate-180" : ""} transition-transform`}
            />
            Description
          </div>
          <div className={`mt-3 overflow-hidden ${isFirstCollapsed ? "h-0" : ""}`} ref={firstContentRef}>
            <p>{newSprint.description}</p>
          </div>
        </div>
        <div className="border rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.1)] p-5 mb-4">
          <div className="font-[600] text-[16px] flex items-center gap-4" onClick={toggleSecondCollapse}>
            <ChevronDownCircle
              color="#E95420"
              size={30}
              className={`${isSecondCollapsed ? "rotate-180" : ""} transition-transform`}
            />
            Details
          </div>
          <div className={`mt-3 ${isSecondCollapsed ? "h-0 overflow-hidden" : ""}`} ref={secondContentRef}>
            <div className="flex flex-col">
              <div className="flex items-center ml-36">
                <div className="w-1/2 flex items-center justify-start gap-3">
                  <div className="text-right text-[12px] font-[500]">Responsible Person:                  </div>
                  <div className="text-left text-[12px]">{newSprint.sprint_owner_name}</div>
                </div>
                <div className="w-1/2 flex items-center justify-start gap-3">
                  <div className="text-right text-[12px] font-[500]">Priority:</div>
                  <div className="text-left text-[12px]">
                    {newSprint.priority}
                  </div>
                </div>
              </div>
              <span className="border h-[1px] inline-block w-full my-4"></span>
              <div className="flex items-center ml-36">
                <div className="w-1/2 flex items-center justify-start gap-3">
                  <div className="text-right text-[12px] font-[500]">Start Date:</div>
                  <div className="text-left text-[12px]">{newSprint.start_date}</div>
                </div>
                <div className="w-1/2 flex items-center justify-start gap-3">
                  <div className="text-right text-[12px] font-[500]">End Date:</div>
                  <div className="text-left text-[12px]">{newSprint.end_date}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SprintDetails;