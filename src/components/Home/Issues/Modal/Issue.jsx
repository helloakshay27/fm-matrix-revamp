import { useEffect, useState, useCallback } from "react";
import SelectBox from "../../../SelectBox";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../../redux/slices/userSlice";
import { createIssue, fetchIssue } from "../../../../redux/slices/IssueSlice";

const globalTypesOptions = [
  { value: 1, label: 'bug' },
  { value: 2, label: 'task' },
  { value: 3, label: 'feature' },
  { value: 4, label: 'UI' },
  { value: 5, label: 'UX' },
];

const globalPriorityOptions = [
  { value: 1, label: 'None' },
  { value: 2, label: 'Low' },
  { value: 3, label: 'Medium' },
  { value: 4, label: 'High' },
  { value: 5, label: 'Urgent' },
];

const Issues = ({  closeModal }) => {
  const [title, setTitle] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const{
    fetchUsers:users,
    loading:loadingUsers,
    error:usersFetchError
  }=useSelector((state) => state.fetchUsers || { users: [], loading: false, error: null });

  const dispatch = useDispatch();
   
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
     
    const data = {
      title: title.trim(),
      status:"open",
      responsible_person_id: responsiblePerson,
      project_management_id: null,
      start_date: new Date().toISOString(),
      end_date: endDate || null,
      priority: globalPriorityOptions.find((option) => option.value === priority)?.label || null,
      created_by_id: 158,
      comments: comments,
      issue_type: globalTypesOptions.find((option) => option.value === type)?.label || null,
    };
  
    try {
      dispatch(createIssue(data)).unwrap();
      dispatch(fetchIssue());
    //   closeModal();
    } catch (error) {
      console.error("Error submitting Issue:", error);
      alert(`Issue creation failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    dispatch,
    title,
    responsiblePerson,
    endDate,
    priority,
    comments,
    type,
  ]);
  
  return (
    <form className="pt-2 pb-12 h-full overflow-y-auto" onSubmit={handleSubmit}>
      <div
        id="addTask"
        className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3 text-[12px]"
      >
        <div className="mt-4 space-y-2">
          <label className="block">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Issue Title"
            className="w-full border h-[40px] outline-none border-gray-300 p-2 text-sm"
            required
          />
        </div>
        <div className="flex items-start gap-4 mt-3">
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">
               Responsible Person <span className="text-red-600">*</span>
            </label>
            <SelectBox 
              options={users ? users.map((user) => ({ value: user.id, label: `${user.firstname || ''} ${user.lastname || ''}`.trim() })) : []} 
              value={responsiblePerson} 
              onChange={(selectedValue) => setResponsiblePerson(selectedValue)} 
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">
               Type <span className="text-red-600">*</span>
            </label>
            <SelectBox 
              options={globalTypesOptions} 
              value={type} 
              onChange={(selectedValue) => setType(selectedValue)} 
            />
          </div>
        </div>
        <div className="flex items-start gap-4 mt-4 text-[12px]">
          <div className="w-1/2 space-y-2">
            <label className="block">End Date</label>
            <input
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              className="w-full border outline-none border-gray-300 p-2 text-[12px]"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">
              Priority<span className="text-red-600">*</span>
            </label>
            <SelectBox 
              options={globalPriorityOptions} 
              value={priority} 
              onChange={(selectedValue) => setPriority(selectedValue)} 
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <label className="block">
            Comment 
          </label>
          <input 
            type="text"
            placeholder="Enter Comment"
            className="w-full border h-[40px] outline-none border-gray-300 p-2 text-sm"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center gap-4 w-full bottom-0 py-3 bg-white mt-10">
          <button
            type="submit"
            className="flex items-center justify-center border-2 text-[black] border-[red] px-4 py-2 w-[100px]"
            disabled={isSubmitting || loadingUsers}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Issues;