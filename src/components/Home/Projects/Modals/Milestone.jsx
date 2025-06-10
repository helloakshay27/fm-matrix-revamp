// import { useEffect, useState } from "react";
// import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
// import SelectBox from "../../../SelectBox";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUsers } from "../../../../redux/slices/userSlice";
// import {
//   createMilestone,
//   fetchMilestone,
// } from "../../../../redux/slices/milestoneSlice";
// import { useLocation, useParams } from "react-router-dom";
// import toast from "react-hot-toast";

// const AddMilestoneModal = ({
//   id,
//   deleteMilestone,
//   users,
//   options,
//   formData,
//   setFormData,
//   startDate,
//   setStartDate,
//   endDate,
//   setEndDate,
//   handleDuration,
//   value,
//   setValue
// }) => {

// const { fetchMilestone: milestone } = useSelector(
//   (state) => state.fetchMilestone
// );

//   return (
//     <div className="flex flex-col  relative justify-start gap-4 w-full bottom-0 py-3 bg-white my-10">
//       <div className="absolute right-2 top-2">
//         <DeleteOutlinedIcon
//           className="text-red-600 cursor-pointer"
//           onClick={() => deleteMilestone(id)}
//         />
//       </div>
//       <div className="mt-4 space-y-2">
//         <label className="block ms-2">
//           Milestone Title <span className="text-red-600">*</span>
//         </label>
//         <input
//           type="text"
//           placeholder="Enter Project Title"
//           className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[12px]"
//           onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//           value={formData.title}
//         />
//       </div>
//       <div className="flex items-start gap-4 mt-3">
//         <div className="w-1/2 flex flex-col justify-between">
//           <label className="block mb-2">
//             Project Owner <span className="text-red-600">*</span>
//           </label>
//           <SelectBox
//             options={users.map((user) => ({
//               label: `${user.firstname} ${user.lastname}`,
//               value: user.id,
//             }))}
//             onChange={(value) => setFormData({ ...formData, ownerId: value })}
//             value={formData.ownerId}
//             style={{ border: "1px solid #b3b2b2" }}
//           />
//         </div>
//       </div>

//       <div className="flex items-start gap-4 mt-4 text-[12px]">
//         <div className="w-1/3 space-y-2">
//           <label className="block ms-2">Start Date</label>
//           <input
//             value={startDate}
//             onChange={(e) => {
//               setStartDate(e.target.value);
//             }}
//             type="date"
//             className="w-full border outline-none border-gray-300  p-2 text-[12px] placeholder-shown:text-transparent"
//           />
//         </div>

//         <div className="w-1/3 space-y-2">
//           <label className="block ms-2">End Date</label>
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => {
//               setEndDate(e.target.value);
//             }}
//             className="w-full border outline-none border-gray-300 p-2 text-[12px]"
//           />
//         </div>

//         <div className="w-[100px] space-y-2">
//           <label className="block ms-2">Duration</label>
//           <input
//             type="text"
//             value={handleDuration()}
//             className="w-full border outline-none border-gray-300  p-2 text-[12px] bg-gray-200"
//             readOnly
//           />
//         </div>
//       </div>

//       <div className="flex items-start gap-4 mt-3">
//         <div className="w-1/2 flex flex-col justify-between">
//           <label className="block mb-2">
//             Depends On <span className="text-red-600">*</span>
//           </label>
//           <SelectBox
//             options={milestone.map((m) => ({ label: m.title, value: m.id }))}
//             style={{ border: "1px solid #b3b2b2" }}
//             onChange={(value) => setValue(value)}
//             value={value}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const Milestones = () => {
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const { id } = useParams();

//   const { fetchUsers: users } = useSelector((state) => state.fetchUsers);
//   const { fetchMilestone: milestone } = useSelector(
//     (state) => state.fetchMilestone
//   );
//   const { createProject: project } = useSelector(
//     (state) => state.createProject
//   );
//   const { success } = useSelector((state) => state.createMilestone);

//   const [dependencyOptions, setDependencyOptions] = useState([]);

//   const [milestones, setMilestones] = useState([]);
//   const [nextId, setNextId] = useState(1);
//   const [load, setLoad] = useState(false)

//   const [startDate, setStartDate] = useState();
//   const [endDate, setEndDate] = useState();
//   const [value, setValue] = useState(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     ownerId: null,
//     startDate: null,
//     endDate: null,
//   });

//   useEffect(() => {
//     setFormData({
//       ...formData,
//       startDate: startDate,
//       endDate: endDate,
//     });
//   }, [startDate, endDate]);

//   useEffect(() => {
//     dispatch(fetchUsers());
//     dispatch(fetchMilestone({ id }));
//   }, [dispatch]);

//   const handleDuration = () => {
//     if (startDate == null || endDate == null) return;
//     const ms = new Date(endDate) - new Date(startDate); // difference in milliseconds

//     const totalMinutes = Math.floor(ms / (1000 * 60));
//     const days = Math.floor(totalMinutes / (60 * 24));
//     const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
//     const minutes = totalMinutes % 60;

//     return `${days}d:${hours}h:${minutes}m`;
//   };

//   const handleDeleteMilestone = (id) => {
//     setMilestones(milestones.filter((milestone) => milestone.id !== id));
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!formData.title) {
//       errors.title = "Milestone title is required.";
//     } else if (!formData.endDate) {
//       errors.endDate = "Milestone end date is required.";
//     } else if (!formData.startDate) {
//       errors.startDate = "Milestone start date is required.";
//     } else if (!formData.ownerId) {
//       errors.ownerId = "Select project owner.";
//     }

//     if (Object.keys(errors).length > 0) {
//       toast.error(Object.values(errors)[0]);
//       return false;
//     }

//     return true
//   }

//   const handleSubmitMilestone = (e) => {
//     console.log("clicked")
//     e.preventDefault();
//     if (!validateForm()) return;

//     const payload = {
//       milestone: {
//         title: formData.title,
//         owner_id: formData.ownerId,
//         start_date: formData.startDate,
//         end_date: formData.endDate,
//         depends_on_id: value,
//         project_management_id: location.pathname.includes("/milestones")
//           ? id
//           : project.id,
//       },
//     };
//     console.log(payload);
//     try {
//       dispatch(createMilestone(payload));
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (success) {
//       setFormData({
//         title: "",
//         ownerId: null,
//         endDate: null,
//         startDate: null,
//       })
//       setValue(null)
//       setMilestones([...milestones, { id: nextId }]);
//       setNextId(nextId + 1);
//       dispatch(fetchMilestone({ id }))

//       load && window.location.reload()
//     }
//   }, [success]);

//   return (
//     <form className="pt-2 pb-12 h-full text-[12px]">
//       <div
//         id="addTask"
//         className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3"
//       >
//         <div className="mt-4 space-y-2">
//           <label className="block ms-2">
//             Milestone Title <span className="text-red-600">*</span>
//           </label>
//           <input
//             type="text"
//             placeholder="Enter Project Title"
//             className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[12px]"
//             onChange={(e) =>
//               setFormData({ ...formData, title: e.target.value })
//             }
//             value={formData.title}
//           />
//         </div>
//         <div className="flex items-start gap-4 mt-3">
//           <div className="w-1/2 flex flex-col justify-between">
//             <label className="block mb-2">
//               Project Owner <span className="text-red-600">*</span>
//             </label>
//             <SelectBox
//               options={users.map((user) => ({
//                 label: `${user.firstname} ${user.lastname}`,
//                 value: user.id,
//               }))}
//               onChange={(value) => setFormData({ ...formData, ownerId: value })}
//               value={formData.ownerId}
//               style={{ border: "1px solid #b3b2b2" }}
//             />
//           </div>
//         </div>

//         <div className="flex items-start gap-4 mt-4 text-[12px]">
//           <div className="w-1/3 space-y-2">
//             <label className="block ms-2">Start Date</label>
//             <input
//               value={startDate}
//               onChange={(e) => {
//                 setStartDate(e.target.value);
//               }}
//               type="date"
//               className="w-full border outline-none border-gray-300  p-2 text-[12px] placeholder-shown:text-transparent"
//             />
//           </div>

//           <div className="w-1/3 space-y-2">
//             <label className="block ms-2">End Date</label>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => {
//                 setEndDate(e.target.value);
//               }}
//               className="w-full border outline-none border-gray-300 p-2 text-[12px]"
//             />
//           </div>

//           <div className="w-[100px] space-y-2">
//             <label className="block ms-2">Duration</label>
//             <input
//               type="text"
//               value={handleDuration()}
//               className="w-full border outline-none border-gray-300  p-2 text-[12px] bg-gray-200"
//               readOnly
//             />
//           </div>
//         </div>

//         <div className="flex items-start gap-4 mt-3">
//           <div className="w-1/2 flex flex-col justify-between">
//             <label className="block mb-2">
//               Depends On <span className="text-red-600">*</span>
//             </label>
//             <SelectBox
//               options={milestone.map((m) => ({ label: m.title, value: m.id }))}
//               style={{ border: "1px solid #b3b2b2" }}
//               onChange={(value) => setValue(value)}
//               value={value}
//             />
//           </div>
//         </div>

//         {milestones.map((milestone) => (
//           <AddMilestoneModal
//             id={milestone.id}
//             deleteMilestone={handleDeleteMilestone}
//             users={users}
//             options={dependencyOptions}
//             formData={formData}
//             setFormData={setFormData}
//             startDate={startDate}
//             setStartDate={setStartDate}
//             endDate={endDate}
//             setEndDate={setEndDate}
//             handleDuration={handleDuration}
//             value={value}
//             setValue={setValue}
//           />
//         ))}

//         <div className="relative">
//           <label
//             onClick={handleSubmitMilestone}
//             className="absolute text-[12px] text-[red] right-2 cursor-pointer"
//           >
//             <i>Add Milestone</i>
//           </label>
//         </div>

//         <div className="flex items-center justify-center gap-4  w-full bottom-0 py-3 bg-white mt-16">
//           <button
//             type="button"
//             className="flex items-center justify-center border-2 text-[black] border-[red] px-4 py-2 w-[100px]"
//             onClick={(e) => {
//               handleSubmitMilestone(e);
//               setLoad(true)
//             }}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default Milestones;




import { useEffect, useState } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SelectBox from "../../../SelectBox";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../../redux/slices/userSlice";
import {
  createMilestone,
  fetchMilestone,
} from "../../../../redux/slices/milestoneSlice";
import { useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const AddMilestoneModal = ({
  id,
  deleteMilestone,
  users,
  formData,
  setFormData,
  handleDuration,
}) => {
  const { fetchMilestone: milestone } = useSelector(
    (state) => state.fetchMilestone
  );

  return (
    <div className="flex flex-col relative justify-start gap-4 w-full bottom-0 py-3 bg-white my-10">
      <div className="absolute right-2 top-2">
        <DeleteOutlinedIcon
          className="text-red-600 cursor-pointer"
          onClick={() => deleteMilestone(id)}
        />
      </div>
      <div className="mt-4 space-y-2">
        <label className="block ms-2">
          Milestone Title <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter Project Title"
          className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[12px]"
          onChange={(e) =>
            setFormData(id, { ...formData[id], title: e.target.value })
          }
          value={formData[id]?.title || ""}
        />
      </div>
      <div className="flex items-start gap-4 mt-3">
        <div className="w-1/2 flex flex-col justify-between">
          <label className="block mb-2">
            Project Owner <span className="text-red-600">*</span>
          </label>
          <SelectBox
            options={users.map((user) => ({
              label: `${user.firstname} ${user.lastname}`,
              value: user.id,
            }))}
            onChange={(value) => setFormData(id, { ...formData[id], ownerId: value })}
            value={formData[id]?.ownerId || null}
            style={{ border: "1px solid #b3b2b2" }}
          />
        </div>
      </div>

      <div className="flex items-start gap-4 mt-4 text-[12px]">
        <div className="w-1/3 space-y-2">
          <label className="block ms-2">Start Date</label>
          <input
            value={formData[id]?.startDate || ""}
            onChange={(e) => setFormData(id, { ...formData[id], startDate: e.target.value })}
            type="date"
            className="w-full border outline-none border-gray-300 p-2 text-[12px] placeholder-shown:text-transparent"
          />
        </div>

        <div className="w-1/3 space-y-2">
          <label className="block ms-2">End Date</label>
          <input
            type="date"
            value={formData[id]?.endDate || ""}
            onChange={(e) => setFormData(id, { ...formData[id], endDate: e.target.value })}
            className="w-full border outline-none border-gray-300 p-2 text-[12px]"
          />
        </div>

        <div className="w-[100px] space-y-2">
          <label className="block ms-2">Duration</label>
          <input
            type="text"
            value={handleDuration(formData[id]?.startDate, formData[id]?.endDate)}
            className="w-full border outline-none border-gray-300 p-2 text-[12px] bg-gray-200"
            readOnly
          />
        </div>
      </div>

      <div className="flex items-start gap-4 mt-3">
        <div className="w-1/2 flex flex-col justify-between">
          <label className="block mb-2">
            Depends On <span className="text-red-600">*</span>
          </label>
          <SelectBox
            options={milestone.map((m) => ({ label: m.title, value: m.id }))}
            style={{ border: "1px solid #b3b2b2" }}
            onChange={(value) => setFormData(id, { ...formData[id], dependsOnId: value })}
            value={formData[id]?.dependsOnId || null}
          />
        </div>
      </div>
    </div>
  );
};

const Milestones = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { fetchUsers: users } = useSelector((state) => state.fetchUsers);
  const { fetchMilestone: milestone } = useSelector(
    (state) => state.fetchMilestone
  );
  const { createProject: project } = useSelector(
    (state) => state.createProject
  );
  const { success } = useSelector((state) => state.createMilestone);

  const [milestones, setMilestones] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [load, setLoad] = useState(false);
  const [formData, setFormData] = useState({}); // Store form data for each milestone by id

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchMilestone({ id }));
  }, [dispatch]);

  const handleDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "";
    const ms = new Date(endDate) - new Date(startDate);
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    return `${days}d:${hours}h:${minutes}m`;
  };

  const handleDeleteMilestone = (id) => {
    setMilestones(milestones.filter((milestone) => milestone.id !== id));
    setFormData((prev) => {
      const newFormData = { ...prev };
      delete newFormData[id];
      return newFormData;
    });
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.title) errors.title = "Milestone title is required.";
    if (!data.endDate) errors.endDate = "Milestone end date is required.";
    if (!data.startDate) errors.startDate = "Milestone start date is required.";
    if (!data.ownerId) errors.ownerId = "Select project owner.";
    if (Object.keys(errors).length > 0) {
      toast.error(Object.values(errors)[0]);
      return false;
    }
    return true;
  };

  const handleSubmitMilestone = (e) => {
    e.preventDefault();
    const newMilestoneId = nextId;
    const milestoneData = formData[newMilestoneId] || {
      title: "",
      ownerId: null,
      startDate: null,
      endDate: null,
      dependsOnId: null,
    };

    if (!validateForm(milestoneData)) return;

    const payload = {
      milestone: {
        title: milestoneData.title,
        owner_id: milestoneData.ownerId,
        start_date: milestoneData.startDate,
        end_date: milestoneData.endDate,
        depends_on_id: milestoneData.dependsOnId,
        project_management_id: location.pathname.includes("/milestones")
          ? id
          : project.id,
      },
    };

    try {
      dispatch(createMilestone(payload));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (success) {
      setMilestones([...milestones, { id: nextId }]);
      setNextId(nextId + 1);
      dispatch(fetchMilestone({ id }));
      if (load) window.location.reload();
    }
  }, [success]);

  const updateFormData = (id, updatedData) => {
    setFormData((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...updatedData },
    }));
  };

  return (
    <form className="pt-2 pb-12 h-full text-[12px]">
      <div
        id="addTask"
        className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3"
      >
        {milestones.map((milestone) => (
          <AddMilestoneModal
            key={milestone.id}
            id={milestone.id}
            deleteMilestone={handleDeleteMilestone}
            users={users}
            formData={formData}
            setFormData={updateFormData}
            handleDuration={handleDuration}
          />
        ))}
        <div className="mt-4 space-y-2">
          <label className="block ms-2">
            Milestone Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Project Title"
            className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[12px]"
            onChange={(e) =>
              updateFormData(nextId, { title: e.target.value })
            }
            value={formData[nextId]?.title || ""}
          />
        </div>
        <div className="flex items-start gap-4 mt-3">
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">
              Project Owner <span className="text-red-600">*</span>
            </label>
            <SelectBox
              options={users.map((user) => ({
                label: `${user.firstname} ${user.lastname}`,
                value: user.id,
              }))}
              onChange={(value) => updateFormData(nextId, { ownerId: value })}
              value={formData[nextId]?.ownerId || null}
              style={{ border: "1px solid #b3b2b2" }}
            />
          </div>
        </div>

        <div className="flex items-start gap-4 mt-4 text-[12px]">
          <div className="w-1/3 space-y-2">
            <label className="block ms-2">Start Date</label>
            <input
              value={formData[nextId]?.startDate || ""}
              onChange={(e) => updateFormData(nextId, { startDate: e.target.value })}
              type="date"
              className="w-full border outline-none border-gray-300 p-2 text-[12px] placeholder-shown:text-transparent"
            />
          </div>

          <div className="w-1/3 space-y-2">
            <label className="block ms-2">End Date</label>
            <input
              type="date"
              value={formData[nextId]?.endDate || ""}
              onChange={(e) => updateFormData(nextId, { endDate: e.target.value })}
              className="w-full border outline-none border-gray-300 p-2 text-[12px]"
            />
          </div>

          <div className="w-[100px] space-y-2">
            <label className="block ms-2">Duration</label>
            <input
              type="text"
              value={handleDuration(formData[nextId]?.startDate, formData[nextId]?.endDate)}
              className="w-full border outline-none border-gray-300 p-2 text-[12px] bg-gray-200"
              readOnly
            />
          </div>
        </div>

        <div className="flex items-start gap-4 mt-3">
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">
              Depends On <span className="text-red-600">*</span>
            </label>
            <SelectBox
              options={milestone.map((m) => ({ label: m.title, value: m.id }))}
              style={{ border: "1px solid #b3b2b2" }}
              onChange={(value) => updateFormData(nextId, { dependsOnId: value })}
              value={formData[nextId]?.dependsOnId || null}
            />
          </div>
        </div>

        <div className="relative">
          <label
            onClick={handleSubmitMilestone}
            className="absolute text-[12px] text-[red] right-2 cursor-pointer"
          >
            <i>Add Milestone</i>
          </label>
        </div>

        <div className="flex items-center justify-center gap-4 w-full bottom-0 py-3 bg-white mt-16">
          <button
            type="button"
            className="flex items-center justify-center border-2 text-[black] border-[red] px-4 py-2 w-[100px]"
            onClick={(e) => {
              handleSubmitMilestone(e);
              setLoad(true);
            }}
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default Milestones;