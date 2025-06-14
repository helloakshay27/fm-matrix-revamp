// import { useEffect, useState } from "react";
// import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
// import SelectBox from "../../../SelectBox";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchSpirints,
//   postSprint,
// } from "../../../../redux/slices/spirintSlice";
// import { fetchUsers } from "../../../../redux/slices/userSlice";

// const AddSprintsModal = ({ id, deleteSprints }) => {
//   const dispatch = useDispatch();
//   const { fetchUsers: users } = useSelector((state) => state.fetchUsers);

//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   return (
//     <div className="flex flex-col  relative justify-start gap-4 w-full bottom-0 py-3 bg-white my-10 ">
//       <DeleteOutlinedIcon
//         onClick={() => deleteSprints(id)}
//         className="absolute top-3 right-3 text-red-600 cursor-pointer "
//       />
//       <div className="mt-4 space-y-2">
//         <label className="block">
//           Sprints Title <span className="text-red-600">*</span>
//         </label>
//         <input
//           type="text"
//           placeholder="Enter Project Title"
//           className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[12px]"
//         />
//       </div>
//       <div className="flex items-start gap-4 mt-3">
//         <div className="w-1/2 flex flex-col justify-between">
//           <label className="block mb-2">
//             Sprint Owner <span className="text-red-600">*</span>
//           </label>
//           <SelectBox
//             options={users?.map((user) => ({
//               value: user.id,
//               label: user?.firstname + " " + user?.lastname,
//             }))}
//             // value={formData.projectOwner}
//             // onChange={(value) => {
//             //   handleSelectChange("projectOwner", value)
//             // }}
//             placeholder="Select Owner"
//             style={{ border: "1px solid #b3b2b2" }}
//           />
//         </div>
//       </div>

//       <div className="flex items-start gap-4 mt-4 text-[12px]">
//         <div className="w-1/3 space-y-2">
//           <label className="block">Start Date</label>
//           <input
//             type="date"
//             className="w-full border outline-none border-gray-300  p-2 text-[12px] placeholder-shown:text-transparent"
//           />
//         </div>

//         <div className="w-1/3 space-y-2">
//           <label className="block">End Date</label>
//           <input
//             type="date"
//             className="w-full border outline-none border-gray-300 p-2 text-[12px]"
//           />
//         </div>

//         <div className="w-[100px] space-y-2">
//           <label className="block">Duration</label>
//           <input
//             type="text"
//             className="w-full border outline-none border-gray-300  p-2 text-[12px]"
//             readOnly
//           />
//         </div>
//       </div>

//       <div className="flex items-start gap-4 mt-3">
//         <div className="w-1/2 flex flex-col justify-between">
//           <label className="block mb-2">
//             Priority<span className="text-red-600">*</span>
//           </label>
//           <SelectBox options={[]} />
//         </div>
//       </div>
//     </div>
//   );
// };

// const Sprints = ({ closeModal }) => {
//   const [nextId, setNextId] = useState(1);
//   const [sprints, setSprints] = useState([]);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [selectedOwner, setSelectedOwner] = useState();
//   const [priority, setPriority] = useState("");

//   const dispatch = useDispatch();
//   const { fetchUsers: users } = useSelector((state) => state.fetchUsers);

//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   const handleDeleteSprints = (id) => {
//     setSprints(sprints.filter((sprints) => sprints.id !== id));
//   };

//   const handleDuration = () => {
//     if (startDate == null || endDate == null) return;
//     const ms = new Date(endDate) - new Date(startDate);

//     const totalMinutes = Math.floor(ms / (1000 * 60));
//     const days = Math.floor(totalMinutes / (60 * 24));
//     const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
//     const minutes = totalMinutes % 60;

//     return `${days}d:${hours}h:${minutes}m`;
//   };

//   const handleAddSprints = () => {
//     setSprints([...sprints, { id: nextId }]);
//     setNextId(nextId + 1);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const sprintPayload = {
//       name: e.target[0].value,
//       description: "Sprint focused on UI enhancements and bug fixes",
//       project_id: 35,
//       start_date: startDate,
//       end_date: endDate,
//       duration: handleDuration(),
//       start_time: "09:00",
//       end_time: "18:00",
//       owner_id: selectedOwner,
//       priority: priority,
//     };

//     const payload = { sprint: sprintPayload };

//     try {
//       const resultAction = dispatch(postSprint(payload));

//       if (postSprint.fulfilled.match(resultAction)) {
//         dispatch(fetchSpirints());
//         closeModal();
//       } else {
//         console.log("Sprint creation failed.");
//       }
//     } catch (error) {
//       console.error("Error submitting sprint:", error);
//     }
//   };

//   return (
//     <form className="pt-2 pb-12 h-full overflow-y-auto" onSubmit={handleSubmit}>
//       <div
//         id="addTask"
//         className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3"
//       >
//         <div className="mt-4 space-y-2">
//           <label className="block">
//             Sprints Title <span className="text-red-600">*</span>
//           </label>
//           <input
//             type="text"
//             placeholder="Enter Project Title"
//             className="w-full border h-[40px] outline-none border-gray-300 p-2 text-sm"
//           />
//         </div>
//         <div className="flex items-start gap-4 mt-3">
//           <div className="w-1/2 flex flex-col justify-between">
//             <label className="block mb-2">
//               Sprint Owner <span className="text-red-600">*</span>
//             </label>
//             <SelectBox
//               options={users?.map((user) => ({
//                 value: user.id,
//                 label: user?.firstname + " " + user?.lastname,
//               }))}
//               value={selectedOwner}
//               onChange={(value) => {
//                 setSelectedOwner(value);
//               }}
//               placeholder="Select Owner"
//               style={{ border: "1px solid #b3b2b2" }}
//             />
//           </div>
//         </div>

//         <div className="flex items-start gap-4 mt-4 text-[12px]">
//           <div className="w-1/3 space-y-2">
//             <label className="block">Start Date</label>
//             <input
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               type="date"
//               className="w-full border outline-none border-gray-300 p-2 text-[12px] placeholder-shown:text-transparent"
//             />
//           </div>

//           <div className="w-1/3 space-y-2">
//             <label className="block">End Date</label>
//             <input
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               type="date"
//               className="w-full border outline-none border-gray-300 p-2 text-[12px]"
//             />
//           </div>

//           <div className="w-[100px] space-y-2">
//             <label className="block">Duration</label>
//             <input
//               value={handleDuration()}
//               type="text"
//               className="w-full bg-gray-200 border outline-none border-gray-300 p-2 text-[12px]"
//               readOnly
//             />
//           </div>
//         </div>

//         <div className="flex items-start gap-4 mt-3">
//           <div className="w-1/2 flex flex-col justify-between">
//             <label className="block mb-2">
//               Priority<span className="text-red-600">*</span>
//             </label>
//             <SelectBox
//               options={[
//                 { label: "High", value: "high" },
//                 { label: "Medium", value: "medium" },
//                 { label: "Low", value: "low" },
//               ]}
//               value={priority}
//               onChange={(value) => setPriority(value)}
//             />
//           </div>
//         </div>
//         <div className="relative">
//           <label
//             onClick={handleAddSprints}
//             className="absolute text-[12px] text-[red] top-2 right-2 mt-2 cursor-pointer"
//           >
//             Add Sprints
//           </label>
//         </div>

//         {sprints.map((sprints) => (
//           <AddSprintsModal
//             id={sprints.id}
//             deleteSprints={handleDeleteSprints}
//           />
//         ))}

//         <div className="flex items-center justify-center gap-4  w-full bottom-0 py-3 bg-white mt-10">
//           <button
//             type="submit"
//             className="flex items-center justify-center border-2 text-[black] border-[red] px-4 py-2 w-[100px]"
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default Sprints;




import React, { useEffect, useState } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SelectBox from "../../../SelectBox";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSpirints,
  postSprint,
} from "../../../../redux/slices/spirintSlice";
import { fetchUsers } from "../../../../redux/slices/userSlice";
import toast from "react-hot-toast";

const AddSprintsModal = ({ id, deleteSprint, formData, setFormData, isReadOnly = false, hasSavedSprints }) => {
  const dispatch = useDispatch();
  const { fetchUsers: users = [] } = useSelector((state) => state.fetchUsers);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return "";
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end < start) return "";
    const ms = end - start;
    const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    return `${days}d:${hours}h:${minutes}m`;
  };


  return (
    <div className="flex flex-col relative justify-start gap-4 w-full bottom-0 py-3 bg-white my-10">
      {!isReadOnly && hasSavedSprints && (
        <DeleteOutlinedIcon
          onClick={() => deleteSprint(id)}
          className="absolute top-3 right-3 text-red-600 cursor-pointer"
        />
      )}
      <div className="mt-2 space-y-2">
        <label className="block">
          Sprint Title <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={handleInputChange}
          placeholder="Enter Sprint Title"
          className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[12px]"
          disabled={isReadOnly}
        />
      </div>
      <div className="flex items-start gap-4 mt-1">
        <div className="w-1/2 flex flex-col justify-between">
          <label className="block mb-2">
            Sprint Owner <span className="text-red-600">*</span>
          </label>
          <SelectBox
            options={users.map((user) => ({
              value: user.id,
              label: `${user.firstname} ${user.lastname}`,
            }))}
            value={formData.ownerId}
            onChange={(value) => handleSelectChange("ownerId", value)}
            placeholder="Select Owner"
            style={{ border: "1px solid #b3b2b2" }}
            disabled={isReadOnly}
          />
        </div>
      </div>

      <div className="flex items-start gap-4 mt-1 text-[12px]">
        <div className="w-1/3 space-y-2">
          <label className="block">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate || ""}
            onChange={handleInputChange}
            min={new Date().toISOString().split("T")[0]} 
            className="w-full border outline-none border-gray-300 p-2 text-[12px]"
            disabled={isReadOnly}
          />
        </div>

        <div className="w-1/3 space-y-2">
          <label className="block">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate || ""}
            onChange={handleInputChange}
            min={formData.startDate || ""} 
            className="w-full border outline-none border-gray-300 p-2 text-[12px]"
            disabled={isReadOnly}
          />
        </div>

        <div className="w-[100px] space-y-2">
          <label className="block">Duration</label>
          <input
            type="text"
            value={calculateDuration()}
            className="w-full bg-gray-200 border outline-none border-gray-300 p-2 text-[12px]"
            readOnly
          />
        </div>
      </div>


      <div className="flex items-start gap-4 mt-1">
        <div className="w-1/2 flex flex-col justify-between">
          <label className="block mb-2">
            Priority<span className="text-red-600">*</span>
          </label>
          <SelectBox
            options={[
              { label: "High", value: "high" },
              { label: "Medium", value: "medium" },
              { label: "Low", value: "low" },
            ]}
            value={formData.priority}
            onChange={(value) => handleSelectChange("priority", value)}
            disabled={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
};

const Sprints = ({ closeModal }) => {
  const [nextId, setNextId] = useState(1);
  const [sprints, setSprints] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    ownerId: "",
    startDate: "",
    endDate: "",
    priority: "",
  });
  const [savedSprints, setSavedSprints] = useState([]);

  const dispatch = useDispatch();
  const { fetchUsers: users = [] } = useSelector((state) => state.fetchUsers);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDeleteSprint = (id) => {
    setSprints(sprints.filter((sprint) => sprint.id !== id));
    setSavedSprints(savedSprints.filter((sprint) => sprint.id !== id));
  };

  const createSprintPayload = (data) => ({
    sprint: {
      name: data.title,
      description: "Sprint focused on UI enhancements and bug fixes",
      project_id: 35,
      start_date: data.startDate,
      end_date: data.endDate,
      duration: calculateDuration(data.startDate, data.endDate),
      start_time: "09:00",
      end_time: "18:00",
      owner_id: data.ownerId,
      priority: data.priority,
    },
  });

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return "";
    const ms = end - start;
    const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1; // Inclusive counting
    return `${days}d`;
  };

  const handleAddSprints = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.ownerId || !formData.startDate || !formData.endDate || !formData.priority) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = createSprintPayload(formData);

    try {
      const resultAction = await dispatch(postSprint(payload));
      if (postSprint.fulfilled.match(resultAction)) {
        toast.success("Sprint created successfully.");
        setSavedSprints([...savedSprints, { id: nextId, formData }]);
        setSprints([...sprints, { id: nextId }]);
        setFormData({
          title: "",
          ownerId: "",
          startDate: "",
          endDate: "",
          priority: "",
        });
        setNextId(nextId + 1);
      } else {
        toast.error("Failed to create sprint.");
      }
    } catch (error) {
      console.error("Error creating sprint:", error);
      toast.error("Error creating sprint.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.ownerId || !formData.startDate || !formData.endDate || !formData.priority) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = createSprintPayload(formData);

    try {
      const resultAction = await dispatch(postSprint(payload));
      if (postSprint.fulfilled.match(resultAction)) {
        toast.success("Sprint created successfully.");
        dispatch(fetchSpirints());
        closeModal();
        window.location.reload();
      } else {
        toast.error("Sprint creation failed.");
      }
    } catch (error) {
      console.error("Error submitting sprint:", error);
      toast.error("Error submitting sprint.");
    }
  };

  return (
    <form className="pt-2 pb-12 h-full overflow-y-auto" onSubmit={handleSubmit}>
      <div
        id="addTask"
        className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3"
      >
        {savedSprints.map((sprint) => (
          <AddSprintsModal
            key={sprint.id}
            id={sprint.id}
            deleteSprint={handleDeleteSprint}
            formData={sprint.formData}
            setFormData={() => { }}
            isReadOnly={true}
            hasSavedSprints={savedSprints.length > 0}
          />
        ))}
        <AddSprintsModal
          id={nextId}
          deleteSprint={() => { }}
          formData={formData}
          setFormData={setFormData}
          isReadOnly={false}
          hasSavedSprints={savedSprints.length > 0}
        />
        <div className="relative">
          <button
            type="button"
            onClick={handleAddSprints}
            className="absolute text-[12px] text-[red] right-2 -top-[30px] cursor-pointer mt-1"
          >
            Add Sprints
          </button>
        </div>
        <div className="flex items-center justify-between gap-4 w-full bottom-0 py-4 bg-white mt-10">
          <button
            type="submit"
            className="flex items-center justify-center border-2 text-[black] border-[red] px-4 py-2 w-[100px]"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default Sprints;

