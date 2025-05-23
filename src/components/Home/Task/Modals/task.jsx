import { useState } from "react";
import WeekProgressPicker from "../../../../Milestone/weekProgressPicker";
import MultiSelectBox from "../../../MultiSelectBox";
import SelectBox from "../../../SelectBox";



const Tasks = () => {
  const [options, setOptions] = useState(["Option 1", "Option 2", "Option 3"]);
  const [nextId, setNextId] = useState(2);
  const [tasks, setTasks] = useState([
    { id: 1 }
  ])


  const handleDeleteTasks = (id) => {
    setTasks(tasks.filter(tasks => tasks.id !== id));
  }

  const handleAddTasks = () => {
    setTasks([...tasks, { id: nextId }]);
    setNextId(nextId + 1);
  }

  return (

    <form className="pt-2 pb-12 h-full overflow-y-auto text-[12px]">

      <div
        id="addTask"
        className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="mt-4 space-y-2">
            <label className="block ms-2">
              Project <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder={`Project ${nextId - 1}`}
              className="w-full border h-[40px] outline-none border-gray-300 py-2 px-4 text-[13px] bg-gray-200"
              readOnly
            />
          </div>
          <div className="mt-4 space-y-2 w-auto">
            <label className="block ms-2">
              Milestone<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder={`Milestone ${nextId - 1}`}
              className="w-full border h-[40px] outline-none border-gray-300 py-2 px-4 text-[13px] bg-gray-200"
            />
          </div>
        </div>




        <div className="flex items-start gap-4 mt-3">
          <div className="w-full flex flex-col justify-between">
            <label className="block mb-2">
              Task Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Task Title"
              className="w-full border h-[40px] outline-none border-gray-300 py-2 px-4 text-[13px]"
            />
          </div>
        </div>

        <div className="mt-4 space-y-2 h-[100px]">
          <label className="block ms-2">
            Description
          </label>
          <textarea
            type="text"
            rows={5}
            placeholder="Enter Description"
            className="w-full border outline-none border-gray-300 py-3 px-4 text-[13px] h-[70%]"
          />
        </div>


        <div className="flex justify-between gap-20 mt-1">
          <div className="mt-4 space-y-2 h-[100px]">
            <label className="block mb-2 ">
              Responsible Person<span className="text-red-600">*</span>
            </label>
            <SelectBox
              options={[
                { label: "User", value: "op1" },
              ]}

              placeholder="Select Person "

            />
          </div>
          <div className="mt-4 space-y-2 h-[100px] ">
            <label className="block">
              Department<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Tech"
              className="w-full text-[13px] border-2 border-grey-300 p-2 bg-gray-200"
              readOnly
            />

          </div>

        </div>

        <div className="flex justify-between gap-20 mt-1 text-[12px]">
          <div className="space-y-2">
            <label className="block ms-2">Priority</label>
            <MultiSelectBox options={[
              { label: "User1", value: "op1" },
              { label: "User2", value: "op1" },

            ]} value={"Priority"} placeholder="Select Priority"
            />
          </div>

          <div className="w-[130px] space-y-2 ">
            <label className="block ms-2">Duration</label>
            <input type="text" className="w-full border outline-none border-gray-300 p-2 text-[13px]" placeholder="00d:00h:00m" />
          </div>

        </div>

        <div>
          <WeekProgressPicker />
        </div>

        <div className="flex items-start gap-4 mt-3">
          <div className="flex flex-col justify-between w-2/3">
            <label className="block mb-2">
              Observer<span className="text-red-600">*</span>
            </label>
            <MultiSelectBox  options={[
              { label: "User1", value: "op1" },
              { label: "User2", value: "op1" },
            ]}
              value={"Observer"}  placeholder="Select Observer"/>
          </div>


        </div>

        <div className="flex items-start gap-4 mt-3">
          <div className=" flex flex-col justify-between w-full">
            <label className="block mb-2">
              Tags<span className="text-red-600">*</span>
            </label>
            <MultiSelectBox options={[
              { label: "User1", value: "op1" },
              { label: "User2", value: "op1" },
            ]} value={"Tags"} placeholder="Select Tags" />
          </div>


        </div>


        {/* <div className="relative">
                                <label onClick={handleAddTasks} className="absolute text-[12px] text-[red] top-2 right-2 mt-2 cursor-pointer">Add Sprints</label>
                            </div> */}

        {/* {
                            tasks.map(tasks=><AddTasksModal id={tasks.id} deleteTasks={handleDeleteTasks}/>)
                            } */}

        <div className="flex items-center justify-center gap-4  w-full bottom-0 py-3 bg-white mt-10 text-[12px]">
          <button
            type="submit"
            className="flex items-center justify-center border-2 text-[white] border-[red] px-4 py-2 w-[100px] bg-[red]"
          >
            Create
          </button>
          <button type="submit" className="flex items-center justify-center border-2 text-[black] border-[red] px-4 py-2 ">
            Add New task
          </button>

        </div>
      </div>
    </form>

  );
};

export default Tasks;