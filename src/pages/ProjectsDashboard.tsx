import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { fetchProjects } from "@/store/slices/projectManagementSlice";
import { Edit, Eye, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  MenuItem,
  Select,
} from "@mui/material";
import { Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef } from "react";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const columns: ColumnConfig[] = [
  {
    key: "id",
    label: "Project ID",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "title",
    label: "Project Title",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "type",
    label: "Project Type",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "manager",
    label: "Project Manager",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "milestones",
    label: "Milestones",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "tasks",
    label: "Tasks",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "issues",
    label: "Issues",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "start_date",
    label: "Start Date",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "end_date",
    label: "End Date",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "priority",
    label: "Priority",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
];

export const ProjectsDashboard = () => {
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const [projects, setProjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    status: "",
    type: "",
    manager: "",
    start_date: "",
    end_date: "",
    priority: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchProjects({ token, baseUrl })).unwrap();
        setProjects(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [dispatch, token, baseUrl]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      title: "",
      status: "",
      type: "",
      manager: "",
      start_date: "",
      end_date: "",
      priority: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Handle form submission (e.g., dispatch an action to add the project)
    console.log("Form submitted:", formData);
    handleCloseDialog();
  };

  const renderActions = (item: any) => (
    <div className="flex gap-2">
      <Button size="sm" variant="ghost" className="p-1">
        <Edit className="w-4 h-4" />
      </Button>
      <Button size="sm" variant="ghost" className="p-1">
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "milestones": {
        const completed = item.milestonesCompleted || 0;
        const total = item.milestonesTotal || 0;
        const progress = total > 0 ? (completed / total) * 100 : 0;

        return (
          <div className="relative w-[8rem] bg-gray-200 rounded-full h-3">
            <div
              className="absolute top-0 left-0 h-3 bg-[#84edba] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-black">
              {progress.toFixed(2)}%
            </div>
          </div>
        );
      }
      case "tasks": {
        const completed = item.tasksCompleted || 0;
        const total = item.tasksTotal || 0;
        const progress = total > 0 ? (completed / total) * 100 : 0;

        return (
          <div className="relative w-[8rem] bg-gray-200 rounded-full h-3">
            <div
              className="absolute top-0 left-0 h-3 bg-[#e9e575] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-black">
              {progress.toFixed(2)}%
            </div>
          </div>
        );
      }
      default:
        return item[columnKey] || "-";
    }
  };

  const leftActions = (
    <>
      <Button
        className="bg-[#C72030] hover:bg-[#A01020] text-white"
        onClick={handleOpenDialog}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </>
  );

  return (
    <div className="p-6">
      <EnhancedTable
        data={[
          {
            id: 1,
            title: "Project A",
            status: "Active",
            type: "Type A",
            manager: "John Doe",
            milestonesCompleted: 9,
            milestonesTotal: 19,
            tasksCompleted: 9,
            tasksTotal: 19,
            issues: 5,
            start_date: "2022-01-01",
            end_date: "2022-12-31",
            priority: "High",
          },
        ]}
        columns={columns}
        renderActions={renderActions}
        renderCell={renderCell}
        leftActions={leftActions}
        storageKey="projects-table"
      />


      <Dialog open={openDialog} onClose={handleCloseDialog} TransitionComponent={Transition}>
        <DialogContent
          className="w-[30rem] fixed right-0 top-0 h-full rounded-none bg-[#fff]"
          style={{ margin: 0 }}
          sx={{
            padding: "0 !important"
          }}
        >
          <form className="h-full" onSubmit={handleSubmit}>
            <div className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3">
              <div className="mt-4 space-y-2">
                <label className="block">
                  Project Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="projectTitle"
                  placeholder="Enter Project Title"
                  className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[12px]"
                />
              </div>

              <div className="flex justify-between my-4">
                {["createChannel", "createTemplate"].map((name) => (
                  <div key={name}>
                    <input
                      type="checkbox"
                      id={name}
                      name={name}
                      checked={formData[name]}
                      onChange={handleInputChange}
                      className="mx-2 my-0.5"
                    />
                    <label htmlFor={name}>
                      Create a {name === "createChannel" ? "Channel" : "Template"}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 h-[100px]">
                <label className="block">Description</label>
                <textarea
                  name="description"
                  rows={5}
                  placeholder="Enter Description"
                  className="w-full border outline-none border-gray-300 p-2 text-[13px] h-[75px] overflow-y-auto resize-none"
                />
              </div>

              <div className="flex items-start gap-4 mt-3">
                <div className="w-full">
                  <label className="block mb-2">
                    Project Owner <span className="text-red-600">*</span>
                  </label>
                  <Select
                    label="Project Owner"
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>Select Team</em>
                    </MenuItem>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 mt-4 text-[12px]">
                {["startDate", "endDate"].map((field) => (
                  <div key={field} className="w-full space-y-2">
                    <label className="block">
                      {field === "startDate" ? "Start Date" : "End Date"}{" "}
                      <span className="text-red-600">*</span>
                    </label>

                    <input
                      type="date"
                      className="w-full border outline-none border-gray-300 p-2"
                    />
                  </div>
                ))}

                <div className="w-[300px] space-y-2">
                  <label className="block">Duration</label>
                  <input
                    readOnly
                    type="text"
                    className="w-full border outline-none border-gray-300 p-2 bg-gray-200"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 my-10">
                <div>
                  <div className="flex justify-between">
                    <label className="block mb-2">
                      Project Team <span className="text-red-600">*</span>
                    </label>
                    <label
                      className="text-[12px] text-[red] cursor-pointer"
                    >
                      <i>Create new team</i>
                    </label>
                  </div>
                  <Select
                    label="Project Team"
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>Select Team</em>
                    </MenuItem>
                  </Select>
                </div>

                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block mb-2">Project Type</label>
                    <Select
                      label="Project Type"
                      fullWidth
                    >
                      <MenuItem value="">
                        <em>Select Team</em>
                      </MenuItem>
                    </Select>
                  </div>
                  <div className="w-1/2">
                    <label className="block mb-2">Priority</label>
                    <Select
                      label="Priority"
                      fullWidth
                    >
                      <MenuItem value="">
                        <em>Select Team</em>
                      </MenuItem>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Tags</label>
                  <Select
                    label="Tags"
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>Select Team</em>
                    </MenuItem>
                  </Select>
                  <div
                    className="text-[12px] text-[red] text-right cursor-pointer mt-2"
                  >
                    <i>Create new tag</i>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    className="border-2 border-red-500 px-4 py-2 text-black w-[100px]"
                  >
                    Save
                  </button>
                  <button
                    type="submit"
                    className="border-2 border-red-500 px-4 py-2 text-black w-max"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};