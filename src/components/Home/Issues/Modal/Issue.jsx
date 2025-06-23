import { useEffect, useState, useCallback, useRef } from "react";
import SelectBox from "../../../SelectBox";
import { useDispatch, useSelector} from "react-redux";
import { fetchUsers } from "../../../../redux/slices/userSlice";
import { createIssue, fetchIssue ,fetchIssueType} from "../../../../redux/slices/issueSlice";
import { fetchMilestone } from "../../../../redux/slices/milestoneSlice";
import { fetchProjects } from "../../../../redux/slices/projectSlice";
import { fetchTasks } from "../../../../redux/slices/taskSlice";

import toast from "react-hot-toast";

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

const Issues = ({ closeModal }) => {
  const [title, setTitle] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newIssuesProjectId, setNewIssuesProjectId] = useState("");
  const [newIssuesMilestoneId, setNewIssuesMilestoneId] = useState("");
  const [newIssuesTaskId, setNewIssuesTaskId] = useState("");
  const token= localStorage.getItem("token");
  const isSubmittingRef=useRef(false);

  const {
    fetchUsers: users,
    loading: loadingUsers,
    error: usersFetchError
  } = useSelector((state) => state.fetchUsers || { users: [], loading: false, error: null });

  const{
    fetchProjects:projects,
    loading:loadingProjects,
    error:projectsFetchError
  }=useSelector((state) => state.fetchProjects || { projects: [], loading: false, error: null });

  const{
    fetchMilestone:milestone,
    loading:loadingMilestone,
    error:milestoneFetchError
  }=useSelector((state) => state.fetchMilestone || { milestone: [], loading: false, error: null });

  const{
    fetchTasks:tasks,
    loading:loadingTasks,
    error:tasksFetchError
  }=useSelector((state) => state.fetchTasks || { tasks: [], loading: false, error: null });

  const{
    fetchIssueType:issueType,
    loading:loadingIssueType,
    error:issueTypeFetchError
  }=useSelector((state) => state.fetchIssueType || { issueType: [], loading: false, error: null });

  const [projectOptions, setProjectOptions] = useState([]);
  const [milestoneOptions, setMilestoneOptions] = useState([]);
  const [issueTypeOptions, setIssueTypeOptions] = useState([]);
  const [taskOptions, setTaskOptions] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers({token}));
  }, [dispatch]);

  useEffect(()=>{
    if(!loadingIssueType && (!issueType.length > 0 && !issueTypeFetchError)){
    dispatch(fetchIssueType({token}));
    }
  },[dispatch,loadingIssueType,issueType,issueTypeFetchError]);

  useEffect(()=>{
    if(!loadingIssueType && issueType.length > 0 && !issueTypeFetchError){
    setIssueTypeOptions(
      issueType.map((i) => ({
        value: i.id,
        label: i.name,
    })))
    }
  },[issueType,loadingIssueType,issueTypeFetchError]);

  useEffect(()=>{
    if(!loadingMilestone && milestoneOptions.length > 0 && !milestoneFetchError && newIssuesMilestoneId){
      dispatch(fetchTasks({id: newIssuesMilestoneId,token}));
      setNewIssuesTaskId(null);
      setTaskOptions([]);
    }
  },[dispatch, loadingMilestone, milestoneFetchError ,newIssuesMilestoneId, milestoneOptions]);
  
  useEffect(()=>{
     if(!loadingTasks && !tasksFetchError && tasks.length > 0){
         setTaskOptions(
           tasks.map((t) => ({
             value: t.id,
             label: t.title,
         })))
     }
  },[tasks, loadingTasks, tasksFetchError]);
  

   useEffect(() => {
    if (
      newIssuesProjectId &&
      projectOptions.length > 0 &&
      !loadingProjects &&
      !projectsFetchError
    ) {
      dispatch(fetchMilestone({ id: newIssuesProjectId ,token})).unwrap();
      setNewIssuesMilestoneId('');
      setMilestoneOptions([]);
      setNewIssuesTaskId('');
      setTaskOptions([]);
    }
  }, [dispatch, newIssuesProjectId, projectOptions, loadingProjects, projectsFetchError]);
  
   useEffect(()=>{  
     if(!loadingProjects && (!Array.isArray(projectOptions) || projectOptions.length === 0)){
      dispatch(fetchProjects({token})).unwrap();
      setProjectOptions(projects.map((project) => ({
        value: project.id,
        label: project.title
      })))
     }
     
   },[dispatch,loadingProjects,projectOptions]);

   useEffect(() => {
     if (!loadingMilestone && !milestoneFetchError && milestone.length > 0) {
       setMilestoneOptions(
         milestone.map((m) => ({
           value: m.id,
           label: m.title,
         }))
       );
     }
   }, [milestone, loadingMilestone, milestoneFetchError]);
   

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    toast.dismiss();
    // Form Validations
    if(isSubmittingRef.current)return;
    console.log(newIssuesProjectId);
    if(!newIssuesProjectId){
      toast.error("Project is required");
      return;
    }
    
    if(!newIssuesMilestoneId){
      toast.error("Milestone is required");
      return;
    }
    if(!newIssuesTaskId){
      toast.error("Task is required");
      return;
    }
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!responsiblePerson) {
      toast.error("Responsible Person is required");
      return;
    }
    if (!type) {
      toast.error("Issue Type is required");
      return;
    }
    if (!priority) {
      toast.error("Priority is required");
      return;
    }

    if (!endDate) {
      toast.error("End Date is required");
      return;
    }
    if (!comments.trim()) {
      toast.error("Comment is required");
      return;
    }

    setIsSubmitting(true);
    isSubmittingRef.current=true;

    const data = {
      title: title.trim(),
      status: "open",
      responsible_person_id: responsiblePerson,
      project_management_id: newIssuesProjectId || null,
      milestone_id: newIssuesMilestoneId || null,
      task_management_id: newIssuesTaskId || null,
      start_date: startDate || null,
      end_date: endDate || null,
      priority: globalPriorityOptions.find((option) => option.value === priority)?.label || null,
      created_by_id: 158,
      comment: comments,
      issue_type: issueTypeOptions.find((option) => option.value === type)?.label || null,
    };

    try {
      await dispatch(createIssue({token,payload:data})).unwrap();
      dispatch(fetchIssue({token}));
      closeModal();
      toast.success("Issue created successfully!");
    } catch (error) {
      console.error("Error submitting Issue:", error);
      toast.error(`Issue creation failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    dispatch,
    title,
    responsiblePerson,
    endDate,
    startDate,
    priority,
    comments,
    type,
    newIssuesProjectId,
    newIssuesMilestoneId,
    newIssuesTaskId,
    closeModal,
  ]);

  return (
    <form className="pt-2 pb-12 h-full overflow-y-auto" onSubmit={handleSubmit}>
      <div
        id="addTask"
        className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3 text-[12px]"
      >
        <div className="flex items-center justify-between gap-5">
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">
              Project <span className="text-red-600">*</span>
            </label>
            <SelectBox
             options={projectOptions}
             value={newIssuesProjectId}
              onChange={(selectedValue) => setNewIssuesProjectId(selectedValue)}
              placeholder={"Select Project"}
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">
              Milestone <span className="text-red-600">*</span>
            </label>
            <SelectBox
             options={milestoneOptions}
             value={newIssuesMilestoneId}
              onChange={(selectedValue) => setNewIssuesMilestoneId(selectedValue)}
              placeholder={"Select Milestone"}
            />
          </div>
           <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">
              Task <span className="text-red-600">*</span>
            </label>
            <SelectBox
             options={taskOptions}
             value={newIssuesTaskId}
              onChange={(selectedValue) => setNewIssuesTaskId(selectedValue)}
              placeholder={"Select Task"}
            />
          </div>
        </div>
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
              placeholder={"Select Responsible Person"}
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">
              Type <span className="text-red-600">*</span>
            </label>
            <SelectBox
              options={issueTypeOptions}
              value={type}
              onChange={(selectedValue) => setType(selectedValue)}
              placeholder={"Select Type"}
            />
          </div>
        </div>
        <div className="flex items-start gap-4 mt-4 text-[12px]">
           <div className="w-1/2 space-y-2">
            <label className="block">Start Date <span className="text-red-600">*</span></label>
            <input
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
              className="w-full border outline-none border-gray-300 p-2 text-[12px]"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="w-1/2 space-y-2">
            <label className="block">End Date <span className="text-red-600">*</span></label>
            <input
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              className="w-full border outline-none border-gray-300 p-2 text-[12px]"
              min={startDate}
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">
              Priority <span className="text-red-600">*</span>
            </label>
            <SelectBox
              options={globalPriorityOptions}
              value={priority}
              onChange={(selectedValue) => setPriority(selectedValue)}
              placeholder={"Select Priority"}
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <label className="block">
            Comment <span className="text-red-600">*</span>
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