import { useEffect, useState, useRef } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SelectBox from "../../../SelectBox";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers
} from "../../../../redux/slices/userSlice";
import {
  createMilestone,
  fetchMilestone,
  addSavedMilestone,
  clearSavedMilestones
} from "../../../../redux/slices/milestoneSlice";
import { useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const AddMilestoneModal = ({
  users,
  formData,
  setFormData,
  setIsDelete,
  isReadOnly = false,
  milestoneOptions,
  hasSavedMilestones,
  projectStartDate,
  projectEndDate,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return "";
    const ms = end - start;
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    return `${days}d:${hours}h:${minutes}m`;
  };

  return (
    <div className="flex flex-col relative justify-start gap-4 w-full bottom-0 py-3 bg-white p-4">
      {!isReadOnly && hasSavedMilestones && (
        <div className="absolute right-2 top-2">
          <DeleteOutlinedIcon
            className="text-red-600 cursor-pointer"
            onClick={() => {
              setFormData({});
              setIsDelete(true);
            }}
          />
        </div>
      )}
      <div className="mt-4 space-y-2">
        <label className="block ms-2">
          Milestone Title <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          name="title"
          placeholder="Enter Milestone Title"
          className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[12px]"
          onChange={handleInputChange}
          value={formData.title || ""}
          disabled={isReadOnly}
        />
      </div>
      <div className="flex items-start gap-4 mt-3">
        <div className="w-1/2 flex flex-col justify-between">
          <label className="block mb-2">
            Milestone Owner <span className="text-red-600">*</span>
          </label>
          <SelectBox
            options={users.map((user) => ({
              label: `${user.firstname} ${user.lastname}`,
              value: user.id,
            }))}
            onChange={(value) => handleSelectChange("ownerId", value)}
            value={formData.ownerId || null}
            placeholder="Select Owner"
            style={{ border: "1px solid #b3b2b2" }}
            disabled={isReadOnly}
          />
        </div>
      </div>

      <div className="flex items-start gap-4 mt-4 text-[12px]">
        <div className="w-1/3 space-y-2">
          <label className="block ms-2">
            Start Date <span className="text-red-600">*</span>
          </label>
          <input
            name="startDate"
            value={formData.startDate || ""}
            onChange={handleInputChange}
            type="date"
            min={new Date().toISOString().split("T")[0] || projectStartDate}
            max={projectEndDate}
            className="w-full border outline-none border-gray-300 p-2 text-[12px] placeholder-shown:text-transparent"
            disabled={isReadOnly}
          />
        </div>

        <div className="w-1/3 space-y-2">
          <label className="block ms-2">
            End Date <span className="text-red-600">*</span>
          </label>
          <input
            name="endDate"
            type="date"
            value={formData.endDate || ""}
            onChange={handleInputChange}
            min={formData.startDate || projectStartDate}
            max={projectEndDate}
            className="w-full border outline-none border-gray-300 p-2 text-[12px]"
            disabled={isReadOnly}
          />
        </div>

        <div className="w-[100px] space-y-2">
          <label className="block ms-2">Duration</label>
          <input
            type="text"
            value={calculateDuration(formData.startDate, formData.endDate)}
            className="w-full border outline-none border-gray-300 p-2 text-[12px] bg-gray-200"
            readOnly
          />
        </div>
      </div>

      <div className="flex items-start gap-4 mt-3">
        <div className="w-1/2 flex flex-col justify-between">
          <label className="block mb-2">Depends On</label>
          <SelectBox
            options={Array.isArray(milestoneOptions) ? milestoneOptions.map((m) => ({ label: m.title, value: m.id })) : []}
            style={{ border: "1px solid #b3b2b2" }}
            onChange={(value) => handleSelectChange("dependsOnId", value)}
            value={formData.dependsOnId || null}
            placeholder="Select Dependency"
            disabled={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
};

const Milestones = ({ closeModal }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { fetchUsers: users = [] } = useSelector((state) => state.fetchUsers);
  const { fetchMilestone: milestone = [], savedMilestones = [] } = useSelector(
    (state) => state.fetchMilestone
  );
  const { createProject: project = {} } = useSelector(
    (state) => state.createProject
  );
  const { loading } = useSelector((state) => state.createMilestone);
  const { fetchProjectDetails: projectDetail } = useSelector(
    (state) => state.fetchProjectDetails
  );

  const [nextId, setNextId] = useState(1);
  const [isDelete, setIsDelete] = useState(false);
  const isSubmittingRef = useRef(false);
  const [formData, setFormData] = useState({
    title: "",
    ownerId: null,
    startDate: "",
    endDate: "",
    dependsOnId: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          dispatch(fetchUsers({ token })),
          dispatch(fetchMilestone({ token, id: project?.id ? project.id : id })),
        ]);
      } catch (error) {
        toast.error("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id]);

  const validateForm = (data) => {
    toast.dismiss();
    if (!data.title)
      return toast.error("Milestone title is required.") && false;
    if (!data.ownerId) return toast.error("Select project owner.") && false;
    if (!data.startDate)
      return toast.error("Milestone start date is required.") && false;
    if (!data.endDate)
      return toast.error("Milestone end date is required.") && false;
    if (
      data.startDate < projectDetail.startDate ||
      data.startDate > projectDetail.endDate
    )
      return (
        toast.error("Start date must be within project duration.") && false
      );
    if (
      data.endDate < projectDetail.startDate ||
      data.endDate > projectDetail.endDate
    )
      return toast.error("End date must be within project duration.") && false;
    return true;
  };

  const createMilestonePayload = (data) => ({
    milestone: {
      title: data.title,
      owner_id: data.ownerId,
      start_date: data.startDate,
      end_date: data.endDate,
      depends_on_id: data.dependsOnId,
      project_management_id: location.pathname.includes("/milestones")
        ? id
        : project?.id,
    },
  });

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (isDelete) {
      setIsDelete(false);
      return;
    }
    toast.dismiss();

    if (!validateForm(formData)) return;
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    const payload = createMilestonePayload(formData);

    try {
      await dispatch(createMilestone({ token, payload })).unwrap();
      toast.success("Milestone created successfully.");
      dispatch(addSavedMilestone({ id: nextId, formData }));
      setFormData({
        title: "",
        ownerId: null,
        startDate: "",
        endDate: "",
        dependsOnId: null,
      });
      setNextId(nextId + 1);
      await dispatch(fetchMilestone({ token, id: project?.id ? project.id : id })).unwrap();
    } catch {
      toast.error("Error creating milestone.");
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    if (isDelete && isFormEmpty) {
      dispatch(clearSavedMilestones());
      window.location.reload();
      return;
    }

    toast.dismiss();

    if (!isDelete && !validateForm(formData)) return;
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    const payload = createMilestonePayload(formData);

    try {
      if (!isDelete) {
        await dispatch(createMilestone({ token, payload })).unwrap();
      }
      toast.dismiss();
      toast.success("Milestone created successfully.");
      await dispatch(fetchMilestone({ token, id }));
      dispatch(clearSavedMilestones());
      window.location.reload();
    } catch {
      toast.error("Error creating milestone.");
    } finally {
      isSubmittingRef.current = false;
      setIsDelete(false);
    }
  };

  const isFormEmpty =
    !formData.title &&
    !formData.ownerId &&
    !formData.startDate &&
    !formData.endDate;

  if (isLoading) return <div className="text-center py-4">Loading...</div>;

  return (
    <form className="pb-12 h-full text-[12px]" onSubmit={handleSubmit}>
      <div
        id="addTask"
        className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3"
      >
        {savedMilestones.map((m) => (
          <AddMilestoneModal
            key={m.id}
            users={users}
            formData={m.formData}
            setFormData={() => { }}
            isReadOnly={true}
            milestoneOptions={milestone}
            hasSavedMilestones={savedMilestones.length > 0}
            projectStartDate={project?.start_date || projectDetail.start_date}
            projectEndDate={project?.end_date || projectDetail.end_date}
          />
        ))}
        {!isDelete && (
          <AddMilestoneModal
            users={users}
            formData={formData}
            setFormData={setFormData}
            setIsDelete={setIsDelete}
            isReadOnly={false}
            milestoneOptions={milestone}
            hasSavedMilestones={savedMilestones.length > 0}
            projectStartDate={project?.start_date || projectDetail.start_date}
            projectEndDate={project?.end_date || projectDetail.end_date}
          />
        )}

        <div className="flex items-center justify-center gap-4 w-full bottom-0 bg-white mt-16">
          <button
            type="submit"
            className="flex items-center justify-center border-2 text-[black] border-[red] px-4 py-2 w-[100px]"
            disabled={loading}
          >
            {loading ? "Processing..." : "Save"}
          </button>

          {isFormEmpty ? (
            <button
              type="button"
              className="flex items-center justify-center border-2 text-[black] border-[red] px-4 py-2 w-max"
              disabled={loading}
              onClick={() => {
                if (savedMilestones.length === 0) {
                  setFormData({
                    title: "",
                    ownerId: null,
                    startDate: "",
                    endDate: "",
                    dependsOnId: null,
                  });
                  closeModal();
                } else {
                  dispatch(clearSavedMilestones());
                  window.location.reload();
                }
              }}
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              className="flex items-center justify-center border-2 text-[black] border-[red] px-4 py-2 w-max"
              disabled={loading}
              onClick={handleAddMilestone}
            >
              Save & Add New
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default Milestones;
