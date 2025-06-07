import { useEffect, useState } from "react";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SelectBox from "../../../SelectBox";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../../redux/slices/userSlice";
import { createMilestone,fetchMilestone } from "../../../../redux/slices/milestoneSlice";


const AddMilestoneModal = ({ id, deleteMilestone ,users}) => {
  const [options, setOptions] = useState(["Option 1", "Option 2", "Option 3"]);

  return (
    <div className="flex flex-col  relative justify-start gap-4 w-full bottom-0 py-3 bg-white my-10">
      <div className="absolute right-2 top-2">
        <DeleteOutlinedIcon className="text-red-600 cursor-pointer" onClick={() => deleteMilestone(id)} />
      </div>
      <div>
        <label className="block mb-2 ">Milestone Title</label>
        <input
          type="text"
          placeholder="Enter Milestone Title"
          className="w-full p-2 border border-gray-300"
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="w-1/2">
          <label className="block mb-2 ">Milestone Owner<span className="text-red-600">*</span></label>
          <SelectBox
            options={users.map(user => ({ value: user.id, label: user.firstname + ' ' + user.lastname }))}
                style={{"border":"1px solid #b3b2b2"}}

          />
        </div>

      </div>

      <div className="flex items-start gap-2 mt-4 text-[12px]">
        <div className="w-1/3 space-y-2">
          <label className="block ms-2">Start Date</label>
          <input type="date" className="w-full border outline-none border-gray-300 p-2 placeholder-shown:text-transparent" />
        </div>

        <div className="w-1/3 space-y-2">
          <label className="block ms-2">End Date</label>
          <input type="date" className="w-full border outline-none border-gray-300 p-2 " />
        </div>

        <div className="w-[100px] space-y-2">
          <label className="block ms-2">Duration</label>
          <input type="text" className="w-full border outline-none border-gray-300 p-2" readOnly />
        </div>

      </div>

      <div className="flex items-start gap-4 mt-3">
        <div className="w-1/2 flex flex-col justify-between">
          <label className="block mb-2">
            Depends On <span className="text-red-600">*</span>
          </label>
          <SelectBox
            options={[]}
                style={{"border":"1px solid #b3b2b2"}}

          />
        </div>
      </div>
    </div>
  );
}

const Milestones = () => {
  const dispatch = useDispatch();

  const { fetchUsers: users } = useSelector(state => state.fetchUsers)
  const {fetchMilestone:milestone} = useSelector(state => state.fetchMilestone)
  const { createProject: project } = useSelector(state => state.createProject)
  const { success } = useSelector(state => state.createMilestone)

  const [dependencyOptions, setDependencyOptions] = useState([]);
  const [createTeamModal, setCreateTeamModal] = useState(false);

  const [milestones, setMilestones] = useState([]);
  const [nextId, setNextId] = useState(1);
  
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [formData, setFormData] = useState({
    title: "",
    ownerId: null,
    startDate: null,
    endDate: null
  })

  useEffect(() => {
    setFormData({
      ...formData,
      startDate: startDate,
      endDate: endDate
    })
  }, [startDate, endDate])

  useEffect(async() => {
   dispatch(fetchUsers())
    dispatch(fetchMilestone())
  }, [dispatch])

  const handleDuration = () => {
    if (startDate == null || endDate == null) return;
    const ms = new Date(endDate) - new Date(startDate); // difference in milliseconds

    const totalMinutes = Math.floor(ms / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    return `${days}:${hours}:${minutes}`;
  }

    useEffect(() => {
      const options = milestone.map(item =>( {value: item.id, label: `Milestone ${item.id}`}));
      setDependencyOptions(options);
    }, [milestone])


  const handleDeleteMilestone = (id) => {
    setMilestones(milestones.filter(milestone => milestone.id !== id));
  }

  const handleAddMilestone = () => {
    setMilestones([...milestones, { id: nextId }]);
    setNextId(nextId + 1);
  }

  const handleSubmitMilestone = (e) => {
    e.preventDefault();

    const payload = {
      milestone: {
        title: formData.title,
        owner_id: formData.ownerId,
        start_date: formData.startDate,
        end_date: formData.endDate,
        project_management_id: 2
      }
    }
    try {
      dispatch(createMilestone( payload ));
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (success) {
      window.location.reload();
    }
  }, [success])

  return (

    <form className="pt-2 pb-12 h-full text-[12px]">
      <div
        id="addTask"
        className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3"
      >
        <div className="mt-4 space-y-2">
          <label className="block ms-2">
            Milestone Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Project Title"
            className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[12px]"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            value={formData.title}
          />
        </div>
        <div className="flex items-start gap-4 mt-3">
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">
              Project Owner <span className="text-red-600">*</span>
            </label>
            <SelectBox
              options={
                users.map(user => ({
                  label: `${user.firstname} ${user.lastname}`,
                  value: user.id
                }))
              }
              onChange={(value) => setFormData({ ...formData, ownerId: value })}
              value={formData.ownerId}
                style={{"border":"1px solid #b3b2b2"}}

            />
          </div>


        </div>

        <div className="flex items-start gap-4 mt-4 text-[12px]">
          <div className="w-1/3 space-y-2">
            <label className="block ms-2">Start Date</label>
            <input value={startDate} onChange={(e) => { setStartDate(e.target.value) }} type="date" className="w-full border outline-none border-gray-300  p-2 text-[12px] placeholder-shown:text-transparent" />
          </div>

          <div className="w-1/3 space-y-2">
            <label className="block ms-2">End Date</label>
            <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value) }} className="w-full border outline-none border-gray-300 p-2 text-[12px]" />
          </div>

          <div className="w-[100px] space-y-2">
            <label className="block ms-2">Duration</label>
            <input type="text" value={handleDuration} className="w-full border outline-none border-gray-300  p-2 text-[12px] bg-gray-200" readOnly />
          </div>

        </div>

        <div className="flex items-start gap-4 mt-3">
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">
              Depends On <span className="text-red-600">*</span>
            </label>
            <SelectBox
              options={dependencyOptions}
                style={{"border":"1px solid #b3b2b2"}}

            />
          </div>
        </div>


        <div className="relative">
          <label onClick={handleAddMilestone} className="absolute text-[12px] text-[red] top-2 right-2 mt-2 cursor-pointer"><i>Add Milestone</i></label>
        </div>

        {
          milestones.map(milestone => <AddMilestoneModal id={milestone.id} deleteMilestone={handleDeleteMilestone} users={users} />)
        }

        <div className="flex items-center justify-center gap-4  w-full bottom-0 py-3 bg-white mt-10">
          <button
            type="submit"
            className="flex items-center justify-center border-2 text-[black] border-[red] px-4 py-2 w-[100px]"
            onClick={handleSubmitMilestone}
          >
            Next
          </button>

        </div>
      </div>

    </form>

  );
};

export default Milestones;