import { useEffect, useState } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SelectBox from "../../../SelectBox";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpirints, postSprint } from "../../../../redux/slices/spirintSlice";

const AddSprintsModal = ({ id, deleteSprints }) => {
  return (
    <div className="flex flex-col  relative justify-start gap-4 w-full bottom-0 py-3 bg-white my-10 ">
      <DeleteOutlinedIcon
        onClick={() => deleteSprints(id)}
        className="absolute top-3 right-3 text-red-600 cursor-pointer "
      />
      <div className="mt-4 space-y-2">
        <label className="block">
          Sprints Title <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter Project Title"
          className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[12px]"
        />
      </div>
      <div className="flex items-start gap-4 mt-3">
        <div className="w-1/2 flex flex-col justify-between">
          <label className="block mb-2">
            Sprint Owner <span className="text-red-600">*</span>
          </label>
          <SelectBox options={[]} />
        </div>
      </div>

      <div className="flex items-start gap-4 mt-4 text-[12px]">
        <div className="w-1/3 space-y-2">
          <label className="block">Start Date</label>
          <input
            type="date"
            className="w-full border outline-none border-gray-300  p-2 text-[12px] placeholder-shown:text-transparent"
          />
        </div>

        <div className="w-1/3 space-y-2">
          <label className="block">End Date</label>
          <input
            type="date"
            className="w-full border outline-none border-gray-300 p-2 text-[12px]"
          />
        </div>

        <div className="w-[100px] space-y-2">
          <label className="block">Duration</label>
          <input
            type="text"
            className="w-full border outline-none border-gray-300  p-2 text-[12px]"
            readOnly
          />
        </div>
      </div>

      <div className="flex items-start gap-4 mt-3">
        <div className="w-1/2 flex flex-col justify-between">
          <label className="block mb-2">
            Priority<span className="text-red-600">*</span>
          </label>
          <SelectBox options={[]} />
        </div>
      </div>
    </div>
  );
};

const Sprints = ({ closeModal }) => {
  const [options, setOptions] = useState(["Option 1", "Option 2", "Option 3"]);
  const [nextId, setNextId] = useState(1);
  const [sprints, setSprints] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { loading, success } = useSelector((state) => state.postSprint?.postSprint || {});
  const { loading: load,
    success: succ, } = useSelector((state) => state.fetchSpirints?.fetchSpirints || []);



  const dispatch = useDispatch();






  const handleDeleteSprints = (id) => {
    setSprints(sprints.filter((sprints) => sprints.id !== id));
  };

  const handleDuration = () => {
    if (startDate == null || endDate == null) return;
    const ms = new Date(endDate) - new Date(startDate); // difference in milliseconds

    const totalMinutes = Math.floor(ms / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    return `${days}:${hours}:${minutes}`;
  };

  const handleAddSprints = () => {
    setSprints([...sprints, { id: nextId }]);
    setNextId(nextId + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const sprintPayload = {
      name: e.target[0].value,
      description: "Sprint focused on UI enhancements and bug fixes",
      project_id: 3,
      start_date: startDate,
      end_date: endDate,
      duration: handleDuration(),
      start_time: "09:00",
      end_time: "18:00",
    };
  
    const payload = { sprint: sprintPayload };
  
    try {
      const resultAction = await dispatch(postSprint(payload));
  
      if (postSprint.fulfilled.match(resultAction)) {
        dispatch(fetchSpirints()); 
        closeModal(); 
      } else {
        console.log("Sprint creation failed.");
      }
    } catch (error) {
      console.error("Error submitting sprint:", error);
    }
  };
  
  


  return (
    <form className="pt-2 pb-12 h-full overflow-y-auto" onSubmit={handleSubmit}>
      <div
        id="addTask"
        className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3"
      >
        <div className="mt-4 space-y-2">
          <label className="block">
            Sprints Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Project Title"
            className="w-full border h-[40px] outline-none border-gray-300 p-2 text-sm"
          />
        </div>
        <div className="flex items-start gap-4 mt-3">
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">
              Sprint Owner <span className="text-red-600">*</span>
            </label>
            <SelectBox options={[]} />
          </div>
        </div>

        <div className="flex items-start gap-4 mt-4 text-[12px]">
          <div className="w-1/3 space-y-2">
            <label className="block">Start Date</label>
            <input
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
              className="w-full border outline-none border-gray-300 p-2 text-[12px] placeholder-shown:text-transparent"
            />
          </div>

          <div className="w-1/3 space-y-2">
            <label className="block">End Date</label>
            <input
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              className="w-full border outline-none border-gray-300 p-2 text-[12px]"
            />
          </div>

          <div className="w-[100px] space-y-2">
            <label className="block">Duration</label>
            <input
              value={handleDuration()}
              type="text"
              className="w-full bg-gray-200 border outline-none border-gray-300 p-2 text-[12px]"
              readOnly
            />
          </div>
        </div>

        <div className="flex items-start gap-4 mt-3">
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">
              Priority<span className="text-red-600">*</span>
            </label>
            <SelectBox options={[]} />
          </div>
        </div>
        <div className="relative">
          <label
            onClick={handleAddSprints}
            className="absolute text-[12px] text-[red] top-2 right-2 mt-2 cursor-pointer"
          >
            Add Sprints
          </label>
        </div>

        {sprints.map((sprints) => (
          <AddSprintsModal
            id={sprints.id}
            deleteSprints={handleDeleteSprints}
          />
        ))}

        <div className="flex items-center justify-center gap-4  w-full bottom-0 py-3 bg-white mt-10">
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
