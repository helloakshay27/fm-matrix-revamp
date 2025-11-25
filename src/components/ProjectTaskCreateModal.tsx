// import { useCallback, useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
// // import { DurationPicker } from "@/components/DurationPicker";
// import { CalendarIcon, X } from "lucide-react";
// import { useAppSelector } from "@/store/hooks";
// // import { TaskDatePicker } from "@/components/TaskDatePicker";
// // import TasksOfDate from "@/components/TasksOfDate";
// // import { CustomCalender } from "@/components/CustomCalender";

// const TaskForm = ({
//     formData,
//     setFormData,
//     isReadOnly = false,
//     project,
//     milestone,
//     users,
//     tags,
//     prevTags,
//     setPrevTags,
//     prevObservers,
//     setPrevObservers,
//     isEdit,
//     dispatch,
//     token,
//     allUsers,
//     hasSavedTasks,
//     setIsDelete,
//     taskDuration,
//     setTaskDuration,
//     setDateWiseHours,
//     totalWorkingHours,
//     setTotalWorkingHours,
//     startDate,
//     setStartDate,
//     endDate,
//     setEndDate,
// }) => {
//     const { data: userAvailability } = useAppSelector((state) => state.fetchUserAvailability);
//     const { fetchUserShift: shift } = useSelector(
//         (state) => state.fetchUserShift
//     );

//     const startDateRef = useRef(null);
//     const endDateRef = useRef(null);

//     const [showDatePicker, setShowDatePicker] = useState(false);
//     const [showStartDatePicker, setShowStartDatePicker] = useState(false);
//     const [startDateTasks, setStartDateTasks] = useState([]);
//     const [targetDateTasks, setTargetDateTasks] = useState([]);
//     const [showCalender, setShowCalender] = useState(false);
//     const [showStartCalender, setShowStartCalender] = useState(false);
//     const [calendarTaskHours, setCalendarTaskHours] = useState([]);
//     const [selectedProject, setSelectedProject] = useState(null);
//     const [projects, setProjects] = useState([])
//     const [milestones, setMilestones] = useState([]);

//     const monthNames = [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//     ];

//     const collapsibleRef = useRef(null);
//     const startCollapsibleRef = useRef(null);

//     // Animate when showDatePicker changes
//     useEffect(() => {
//         const el = collapsibleRef.current;
//         if (!el) return;

//         if (showDatePicker) {
//             gsap.to(el, {
//                 height: "auto",
//                 opacity: 1,
//                 duration: 0.4,
//                 ease: "power2.out",
//             });
//         } else {
//             gsap.to(el, {
//                 height: 0,
//                 opacity: 0,
//                 duration: 0.3,
//                 ease: "power2.in",
//             });
//         }
//     }, [showDatePicker]);

//     useEffect(() => {
//         const getProjects = async () => {
//             try {
//                 const response = await dispatch(fetchProjects({ token })).unwrap();
//                 setProjects(response);
//             } catch (error) {
//                 console.log(error);
//             }
//         }

//         getProjects();
//     }, [])

//     useEffect(() => {
//         const getMilestones = async () => {
//             if (!selectedProject) return;

//             try {
//                 const response = await dispatch(
//                     fetchMilestone({ token, id: selectedProject })
//                 ).unwrap();
//                 setMilestones(response);
//             } catch (error) {
//                 console.log(error);
//             }
//         }

//         getMilestones();
//     }, [selectedProject])

//     useEffect(() => {
//         const el = startCollapsibleRef.current;
//         if (!el) return;

//         if (showStartDatePicker) {
//             gsap.to(el, {
//                 height: "auto",
//                 opacity: 1,
//                 duration: 0.4,
//                 ease: "power2.out",
//             });
//         } else {
//             gsap.to(el, {
//                 height: 0,
//                 opacity: 0,
//                 duration: 0.3,
//                 ease: "power2.in",
//             });
//         }
//     }, [showStartDatePicker]);

//     useEffect(() => {
//         if (userAvailability.length > 0) {
//             const formattedHours = userAvailability.map((dayData) => ({
//                 date: dayData.date,
//                 hours: dayData.allocated_hours,
//             }));
//             setCalendarTaskHours(formattedHours);
//         }
//     }, [userAvailability]);

//     useEffect(() => {
//         const getStartDateTasks = async () => {
//             if (!startDate) return;

//             const formattedStartDate = `${startDate.year}-${String(
//                 startDate.month + 1
//             ).padStart(2, "0")}-${String(startDate.date).padStart(2, "0")}`;

//             try {
//                 const response = await dispatch(
//                     fetchTargetDateTasks({
//                         token,
//                         id: formData.responsiblePerson,
//                         date: formattedStartDate,
//                     })
//                 ).unwrap();
//                 setStartDateTasks([...response.tasks, ...response.issues]);
//             } catch (error) {
//                 console.log(error);
//             }
//         };

//         if (formData.responsiblePerson && startDate) {
//             getStartDateTasks();
//         }
//     }, [formData.responsiblePerson, startDate]);

//     useEffect(() => {
//         const getTargetDateTasks = async () => {
//             const formattedEndDate = `${endDate.year}-${String(
//                 endDate.month + 1
//             ).padStart(2, "0")}-${String(endDate.date).padStart(2, "0")}`;
//             try {
//                 const response = await dispatch(
//                     fetchTargetDateTasks({
//                         token,
//                         id: formData.responsiblePerson,
//                         date: formattedEndDate,
//                     })
//                 ).unwrap();
//                 setTargetDateTasks([...response.tasks, ...response.issues]);
//             } catch (error) {
//                 console.log(error);
//             }
//         };
//         if (formData.responsiblePerson && endDate) {
//             getTargetDateTasks();
//         }
//     }, [formData.responsiblePerson, endDate]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleMultiSelectChange = (name, selectedOptions) => {
//         if (name === "tags") {
//             const removed = prevTags.find(
//                 (prev) => !selectedOptions.some((curr) => curr.value === prev.value)
//             );

//             if (removed && isEdit) {
//                 dispatch(removeTagFromProject({ token, id: removed.id }));
//             }

//             setPrevTags(selectedOptions);
//         }

//         if (name === "observer") {
//             const removed = prevObservers.find(
//                 (prev) => !selectedOptions.some((curr) => curr.value === prev.value)
//             );

//             if (removed && isEdit) {
//                 dispatch(removeUserFromProject({ token, id: removed.id }));
//             }

//             setPrevObservers(selectedOptions);
//         }

//         setFormData((prev) => ({ ...prev, [name]: selectedOptions }));
//     };

//     return (
//         <div className="p-4 bg-white relative">
//             {!isReadOnly && hasSavedTasks && (
//                 <DeleteOutlinedIcon
//                     onClick={() => {
//                         setFormData({
//                             project: formData.project,
//                             milestone: formData.milestone,
//                             taskTitle: "",
//                             description: "",
//                             responsiblePerson: "",
//                             department: "",
//                             priority: "",
//                             duration: "",
//                             expected_start_date: null,
//                             target_date: null,
//                             observer: [],
//                             tags: [],
//                         });
//                         setIsDelete(true);
//                     }}
//                     className="absolute top-3 right-3 text-red-600 cursor-pointer"
//                 />
//             )}
//             {(project &&
//                 milestone &&
//                 !Array.isArray(project) &&
//                 !Array.isArray(milestone) &&
//                 project.title &&
//                 milestone.title) ? (
//                 <div className="flex items-center justify-between gap-3">
//                     <div className="mt-4 space-y-2 w-full">
//                         <label className="block ms-2">
//                             Project <span className="text-red-600">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             value={project.title}
//                             className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[13px] bg-gray-200 overflow-hidden text-ellipsis"
//                             readOnly
//                         />
//                     </div>
//                     <div className="mt-4 space-y-2 w-full">
//                         <label className="block ms-2">
//                             Milestone <span className="text-red-600">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             value={milestone.title}
//                             readOnly
//                             className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[13px] bg-gray-200"
//                         />
//                     </div>
//                 </div>
//             ) : (
//                 <div className="flex items-center justify-between gap-3">
//                     <div className="mt-4 space-y-2 w-full">
//                         <label className="block ms-2">
//                             Project
//                         </label>
//                         <SelectBox
//                             options={[
//                                 ...projects.map((project) => ({
//                                     label: project.title,
//                                     value: project.id,
//                                 })),
//                             ]}
//                             placeholder="Select Project"
//                             value={formData.project}
//                             onChange={(value) => {
//                                 setFormData({ ...formData, project: value });
//                                 setSelectedProject(value);
//                             }}
//                             disabled={isReadOnly}
//                         />
//                     </div>
//                     <div className="mt-4 space-y-2 w-full">
//                         <label className="block ms-2">
//                             Milestone
//                         </label>
//                         <SelectBox
//                             options={milestones.map((milestone) => ({
//                                 label: milestone.title,
//                                 value: milestone.id,
//                             }))}
//                             placeholder="Select Milestone"
//                             value={formData.milestone}
//                             onChange={(value) => setFormData({ ...formData, milestone: value })}
//                             disabled={isReadOnly}
//                         />
//                     </div>
//                 </div>
//             )}

//             <div className="flex items-start gap-4 mt-3">
//                 <div className="w-full flex flex-col justify-between">
//                     <label className="block mb-2">
//                         Task Title <span className="text-red-600">*</span>
//                     </label>
//                     <input
//                         type="text"
//                         name="taskTitle"
//                         placeholder="Enter Task Title"
//                         className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[13px]"
//                         value={formData.taskTitle}
//                         onChange={handleInputChange}
//                         disabled={isReadOnly}
//                     />
//                 </div>
//             </div>

//             <div className="mt-4 space-y-2 h-[100px]">
//                 <label className="block">Description</label>
//                 <textarea
//                     name="description"
//                     rows={5}
//                     placeholder="Enter Description"
//                     className="w-full border outline-none border-gray-300 p-2 text-[13px] h-[80px] overflow-y-auto resize-none"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     disabled={isReadOnly}
//                 />
//             </div>

//             <div className="flex justify-between mt-1 mb-4 gap-2">
//                 <div className="mt-4 space-y-2 w-full">
//                     <label className="block">
//                         Responsible Person <span className="text-red-600">*</span>
//                     </label>
//                     <SelectBox
//                         options={users.map((user) => ({
//                             label: user.name ? user.name : user?.firstname + " " + user?.lastname,
//                             value: user.id,
//                         }))}
//                         placeholder="Select Person"
//                         value={formData.responsiblePerson}
//                         onChange={(value) => {
//                             setFormData({
//                                 ...formData,
//                                 responsiblePerson: value,
//                                 responsiblePersonName:
//                                     users.find(
//                                         (user) => user.user_id === value || user.id === value
//                                     )?.user?.name ||
//                                     users.find(
//                                         (user) => user.user_id === value || user.id === value
//                                     )?.name,
//                             });
//                             if (!isReadOnly && value) {
//                                 dispatch(fetchUserAvailability({ token, id: value }));
//                                 dispatch(fetchUserShift({ token, id: value }));
//                             }
//                         }}
//                         disabled={isReadOnly}
//                     />
//                 </div>
//                 <div className="mt-4 space-y-2 w-full">
//                     <label className="block">Role</label>
//                     <input
//                         type="text"
//                         value={
//                             allUsers.find((user) => user.id === formData.responsiblePerson)
//                                 ?.lock_role?.display_name || ""
//                         }
//                         className="text-[13px] border-2 border-gray-300 px-2 py-[6px] w-full bg-gray-200"
//                         readOnly
//                     />
//                 </div>
//             </div>

//             <div className="flex justify-between mt-3 gap-2 text-[12px]">
//                 <div className="space-y-2 w-full">
//                     <label className="block">Start Date</label>
//                     <button
//                         type="button"
//                         className="w-full border outline-none border-gray-300 px-2 py-[7px] text-[13px] flex items-center gap-3 text-gray-400"
//                         onClick={() => {
//                             if (showDatePicker) {
//                                 setShowDatePicker(false);
//                             }
//                             setShowStartDatePicker(!showStartDatePicker);
//                         }}
//                         ref={startDateRef}
//                     >
//                         {startDate ? (
//                             <div className="text-black flex items-center justify-between w-full">
//                                 <CalendarIcon className="w-4 h-4" />
//                                 <div>
//                                     Start Date : {startDate?.date?.toString().padStart(2, "0")}{" "}
//                                     {monthNames[startDate.month]}
//                                 </div>
//                                 <X className="w-4 h-4" onClick={() => setStartDate(null)} />
//                             </div>
//                         ) : (
//                             <>
//                                 <CalendarIcon className="w-4 h-4" /> Select Start Date
//                             </>
//                         )}
//                     </button>
//                 </div>

//                 <div className="space-y-2 w-full">
//                     <label className="block">
//                         Target Date <span className="text-red-600">*</span>
//                     </label>
//                     <button
//                         type="button"
//                         className="w-full border outline-none border-gray-300 px-2 py-[7px] text-[13px] flex items-center gap-3 text-gray-400"
//                         onClick={() => {
//                             if (showStartDatePicker) {
//                                 setShowStartDatePicker(false);
//                             }
//                             setShowDatePicker(!showDatePicker);
//                         }}
//                         ref={endDateRef}
//                     >
//                         {endDate ? (
//                             <div className="text-black flex items-center justify-between w-full">
//                                 <CalendarIcon className="w-4 h-4" />
//                                 <div>
//                                     Target : {endDate.date.toString().padStart(2, "0")}{" "}
//                                     {monthNames[endDate.month]}
//                                 </div>
//                                 <X className="w-4 h-4" onClick={() => setEndDate(null)} />
//                             </div>
//                         ) : (
//                             <>
//                                 <CalendarIcon className="w-4 h-4" /> Select Target Date
//                             </>
//                         )}
//                     </button>
//                 </div>
//             </div>

//             <div className="flex justify-between mt-3 gap-2 text-[12px]">
//                 <div className="space-y-2 w-full">
//                     <label className="block">
//                         Duration <span className="text-red-600">*</span>
//                     </label>
//                     <DurationPicker
//                         value={taskDuration}
//                         onChange={setTaskDuration}
//                         onDateWiseHoursChange={setDateWiseHours}
//                         startDate={startDate}
//                         endDate={endDate}
//                         resposiblePerson={formData.responsiblePersonName}
//                         totalWorkingHours={totalWorkingHours}
//                         setTotalWorkingHours={setTotalWorkingHours}
//                         shift={shift}
//                     />
//                 </div>
//             </div>

//             <div
//                 ref={startCollapsibleRef}
//                 className="overflow-hidden opacity-0 h-0"
//                 style={{ willChange: "height, opacity" }}
//             >
//                 {!startDate ? (
//                     showStartCalender ? (
//                         <CustomCalender
//                             setShowCalender={setShowStartCalender}
//                             onDateSelect={setStartDate}
//                             selectedDate={startDate}
//                             taskHoursData={calendarTaskHours}
//                             ref={startDateRef}
//                         />
//                     ) : (
//                         <TaskDatePicker
//                             selectedDate={startDate}
//                             onDateSelect={setStartDate}
//                             startDate={null}
//                             userAvailability={userAvailability}
//                             setShowCalender={setShowStartCalender}
//                         />
//                     )
//                 ) : (
//                     <TasksOfDate
//                         selectedDate={startDate}
//                         onClose={() => { }}
//                         tasks={startDateTasks}
//                         selectedUser={formData.responsiblePerson}
//                         userAvailability={userAvailability}
//                     />
//                 )}
//             </div>

//             <div
//                 ref={collapsibleRef}
//                 className="overflow-hidden opacity-0 h-0"
//                 style={{ willChange: "height, opacity" }}
//             >
//                 {!endDate ? (
//                     showCalender ? (
//                         <CustomCalender
//                             setShowCalender={setShowCalender}
//                             onDateSelect={setEndDate}
//                             selectedDate={endDate}
//                             taskHoursData={calendarTaskHours}
//                             ref={endDateRef}
//                         />
//                     ) : (
//                         <TaskDatePicker
//                             selectedDate={endDate}
//                             onDateSelect={setEndDate}
//                             startDate={startDate}
//                             userAvailability={userAvailability}
//                             setShowCalender={setShowCalender}
//                         />
//                     )
//                 ) : (
//                     <TasksOfDate
//                         selectedDate={endDate}
//                         onClose={() => { }}
//                         tasks={targetDateTasks}
//                         selectedUser={formData.responsiblePerson}
//                         userAvailability={userAvailability}
//                     />
//                 )}
//             </div>

//             <div className="flex gap-2 text-[12px] mt-3">
//                 <div className="space-y-2 w-full">
//                     <label className="block">
//                         Priority <span className="text-red-600">*</span>
//                     </label>
//                     <SelectBox
//                         options={[
//                             { label: "High", value: "High" },
//                             { label: "Medium", value: "Medium" },
//                             { label: "Low", value: "Low" },
//                         ]}
//                         placeholder="Select Priority"
//                         value={formData.priority}
//                         onChange={(value) => setFormData({ ...formData, priority: value })}
//                         disabled={isReadOnly}
//                     />
//                 </div>
//             </div>

//             <div className="flex items-start gap-4 mt-3">
//                 <div className="flex flex-col justify-between w-full">
//                     <label className="block mb-2">
//                         Observer <span className="text-red-600">*</span>
//                     </label>
//                     <MultiSelectBox
//                         options={users.map((user) => ({
//                             label: user?.user?.name || user.name,
//                             value: user.user_id || user.id,
//                         }))}
//                         value={formData.observer}
//                         placeholder="Select Observer"
//                         onChange={(values) => handleMultiSelectChange("observer", values)}
//                         disabled={isReadOnly}
//                     />
//                 </div>
//             </div>

//             <div className="flex items-start gap-4 mt-3">
//                 <div className="flex flex-col justify-between w-full">
//                     <label className="block mb-2">
//                         Tags <span className="text-red-600">*</span>
//                     </label>
//                     <MultiSelectBox
//                         options={tags.map((tag) => ({ value: tag.id, label: tag.name }))}
//                         value={formData.tags}
//                         onChange={(values) => handleMultiSelectChange("tags", values)}
//                         placeholder="Select Tags"
//                         disabled={isReadOnly}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// const ProjectTaskCreateModal = ({ isEdit, onCloseModal }) => {
//     const token = localStorage.getItem("token");
//     const { id, mid, tid } = useParams();
//     const dispatch = useDispatch();
//     const { loading, success, error } = useSelector((state) => state.createTask);
//     const { fetchUsers: users = [] } = useSelector((state) => state.fetchUsers);
//     const { fetchTags: tags = [] } = useSelector((state) => state.fetchTags);
//     const { taskDetails: task } = useSelector((state) => state.taskDetails);
//     const { fetchProjectDetails: project } = useSelector(
//         (state) => state.fetchProjectDetails
//     );
//     const { fetchMilestoneById: milestone } = useSelector(
//         (state) => state.fetchMilestoneById
//     );
//     const {
//         loading: editLoading,
//         success: editSuccess,
//         error: editError,
//     } = useSelector((state) => state.editTask);

//     const [taskDuration, setTaskDuration] = useState();
//     const [nextId, setNextId] = useState(1);
//     const [savedTasks, setSavedTasks] = useState([]);
//     const [isDelete, setIsDelete] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [totalWorkingHours, setTotalWorkingHours] = useState(0);
//     const [dateWiseHours, setDateWiseHours] = useState([]);
//     const [startDate, setStartDate] = useState(null);
//     const [endDate, setEndDate] = useState(null);
//     const [members, setMembers] = useState([])
//     const [formData, setFormData] = useState({
//         project: "",
//         milestone: "",
//         taskTitle: "",
//         description: "",
//         responsiblePerson: "",
//         responsiblePersonName: "",
//         department: "",
//         priority: "",
//         observer: [],
//         tags: [],
//     });

//     useEffect(() => {
//         setFormData({
//             ...formData,
//             duration: Math.round(totalWorkingHours),
//         });
//     }, [totalWorkingHours]);

//     const [prevTags, setPrevTags] = useState([]);
//     const [prevObservers, setPrevObservers] = useState([]);

//     useEffect(() => {
//         dispatch(fetchUsers({ token }));
//         dispatch(fetchTags({ token }));
//         dispatch(fetchProjectDetails({ token, id }));
//         dispatch(fetchMilestoneById({ token, id: mid }));
//     }, [dispatch, id, mid, token]);

//     const getTagName = useCallback(
//         (id) => tags.find((t) => t.id === id)?.name || "",
//         [tags]
//     );

//     useEffect(() => {
//         if (project?.project_team) {
//             const members = []

//             project?.project_team?.project_team_members.map((member) => {
//                 members.push(member.user)
//             })
//             members.push(project?.project_team.team_lead)

//             setMembers(members)
//         }
//     }, [project?.project_team])

//     useEffect(() => {
//         if (isEdit && task) {
//             const mappedTags =
//                 task.task_tags?.map((tag) => ({
//                     value: tag?.company_tag?.id,
//                     label: getTagName(tag?.company_tag?.id),
//                     id: tag.id,
//                 })) || [];

//             const mappedObservers =
//                 task.observers?.map((observer) => ({
//                     value: observer?.user_id,
//                     label: observer?.user_name,
//                     id: observer.id,
//                 })) || [];

//             setFormData({
//                 project: id,
//                 milestone: mid,
//                 taskTitle: task.title || "",
//                 description: task.description || "",
//                 responsiblePerson: task.responsible_person_id || "",
//                 department: "",
//                 priority: task.priority || "",
//                 observer: mappedObservers,
//                 tags: mappedTags,
//             });
//             setStartDate({
//                 date: new Date(task.expected_start_date).getDate(),
//                 month: new Date(task.expected_start_date).getMonth(),
//                 year: new Date(task.expected_start_date).getFullYear(),
//             })
//             setEndDate({
//                 date: new Date(task.target_date).getDate(),
//                 month: new Date(task.target_date).getMonth(),
//                 year: new Date(task.target_date).getFullYear(),
//             })

//             setPrevTags(mappedTags);
//             setPrevObservers(mappedObservers);
//         }
//     }, [isEdit, task, id, mid, getTagName]);

//     const createTaskPayload = (data) => {
//         const formatedEndDate = `${endDate.year}-${endDate.month + 1}-${endDate.date
//             }`;
//         const formatedStartDate = `${startDate.year}-${startDate.month + 1}-${startDate.date
//             }`;
//         return {
//             title: data.taskTitle,
//             description: data.description,
//             responsible_person_id: data.responsiblePerson,
//             priority: data.priority,
//             observer_ids: data.observer.map((observer) => observer.value),
//             task_tag_ids: data.tags.map((tag) => tag.value),
//             expected_start_date: formatedStartDate,
//             target_date: formatedEndDate,
//             allocation_date: formatedEndDate,
//             project_management_id: id || formData.project,
//             milestone_id: mid || formData.milestone,
//             active: true,
//             estimated_hour: totalWorkingHours,
//             task_allocation_times_attributes: dateWiseHours,
//         };
//     };

//     const isFormEmpty = () => {
//         return (
//             !formData.taskTitle &&
//             !formData.responsiblePerson &&
//             !formData.priority &&
//             !formData.expected_start_date &&
//             !formData.target_date &&
//             formData.observer.length === 0 &&
//             formData.tags.length === 0
//         );
//     };

//     const handleCancel = () => {
//         if (savedTasks.length === 0) {
//             if (onCloseModal) {
//                 onCloseModal();
//             } else {
//                 console.log("Modal closed (onCloseModal not provided)");
//             }
//         } else {
//             window.location.reload();
//         }
//     };

//     const handleAddTask = async (e) => {
//         e.preventDefault();

//         if (isDelete) {
//             setIsDelete(false);
//             return;
//         }

//         if (
//             !formData.taskTitle ||
//             !formData.responsiblePerson ||
//             !formData.priority ||
//             !formData.observer.length ||
//             !formData.tags.length
//         ) {
//             toast.dismiss();
//             toast.error("Please fill all required fields.");
//             return;
//         }

//         setIsSubmitting(true);

//         const payload = createTaskPayload(formData);

//         try {
//             await dispatch(createTask({ token, payload })).unwrap();
//             toast.dismiss();
//             toast.success("Task created successfully.");
//             setSavedTasks([...savedTasks, { id: nextId, formData }]);
//             setFormData({
//                 project: id,
//                 milestone: mid,
//                 taskTitle: "",
//                 description: "",
//                 responsiblePerson: "",
//                 department: "",
//                 priority: "",
//                 observer: [],
//                 tags: [],
//             });
//             setPrevTags([]);
//             setPrevObservers([]);
//             setIsDelete(false);
//             setNextId(nextId + 1);
//             dispatch(fetchTasks({ token, id: mid ? mid : "" }));
//         } catch (error) {
//             console.errorovate("Error creating task:", error);
//             toast.dismiss();
//             toast.error("Error creating task.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleSubmit = async (e, editId) => {
//         e.preventDefault();

//         if (isDelete && isFormEmpty()) {
//             window.location.reload();
//             return;
//         }

//         if (
//             !isDelete &&
//             (!formData.taskTitle ||
//                 !formData.responsiblePerson ||
//                 !formData.priority ||
//                 !formData.observer.length ||
//                 !formData.tags.length)
//         ) {
//             toast.dismiss();
//             toast.error("Please fill all required fields.");
//             return;
//         }

//         setIsSubmitting(true);

//         const payload = createTaskPayload(formData);

//         try {
//             const resultAction = isEdit
//                 ? await dispatch(editTask({ token, id: editId, payload }))
//                 : await dispatch(createTask({ token, payload }));

//             if (
//                 (isEdit && editTask.fulfilled.match(resultAction)) ||
//                 (!isEdit && createTask.fulfilled.match(resultAction))
//             ) {
//                 toast.dismiss();
//                 toast.success(
//                     isEdit ? "Task updated successfully." : "Task created successfully."
//                 );
//                 window.location.reload();
//             } else {
//                 toast.error(isEdit ? "Task update failed." : "Task creation failed.");
//             }
//         } catch (error) {
//             console.error(`Error ${isEdit ? "updating" : "creating"} task:`, error);
//             toast.error(`Error ${isEdit ? "updating" : "creating"} task.`);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <form
//             className="pb-12 h-full overflow-y-auto text-[12px]"
//             onSubmit={(e) => handleSubmit(e, tid)}
//         >
//             <div
//                 id="addTask"
//                 className="max-w-[95%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3"
//             >
//                 {savedTasks.map((task) => (
//                     <TaskForm
//                         key={task.id}
//                         formData={task.formData}
//                         setFormData={() => { }}
//                         isReadOnly={true}
//                         project={project}
//                         milestone={milestone}
//                         users={members.length > 0 ? members : users}
//                         tags={tags}
//                         prevTags={prevTags}
//                         setPrevTags={setPrevTags}
//                         prevObservers={prevObservers}
//                         setPrevObservers={setPrevObservers}
//                         isEdit={isEdit}
//                         dispatch={dispatch}
//                         token={token}
//                         allUsers={users}
//                         hasSavedTasks={savedTasks.length > 0}
//                         setIsDelete={setIsDelete}
//                         taskDuration={taskDuration}
//                         setTaskDuration={setTaskDuration}
//                         setDateWiseHours={setDateWiseHours}
//                         totalWorkingHours={totalWorkingHours}
//                         setTotalWorkingHours={setTotalWorkingHours}
//                         startDate={startDate}
//                         setStartDate={setStartDate}
//                         endDate={endDate}
//                         setEndDate={setEndDate}
//                     />
//                 ))}

//                 {!isDelete && (
//                     <TaskForm
//                         formData={formData}
//                         setFormData={setFormData}
//                         isReadOnly={false}
//                         project={project}
//                         milestone={milestone}
//                         users={members.length > 0 ? members : users}
//                         tags={tags}
//                         prevTags={prevTags}
//                         setPrevTags={setPrevTags}
//                         prevObservers={prevObservers}
//                         setPrevObservers={setPrevObservers}
//                         isEdit={isEdit}
//                         dispatch={dispatch}
//                         token={token}
//                         allUsers={users}
//                         hasSavedTasks={savedTasks.length > 0}
//                         setIsDelete={setIsDelete}
//                         taskDuration={taskDuration}
//                         setTaskDuration={setTaskDuration}
//                         setDateWiseHours={setDateWiseHours}
//                         totalWorkingHours={totalWorkingHours}
//                         setTotalWorkingHours={setTotalWorkingHours}
//                         startDate={startDate}
//                         setStartDate={setStartDate}
//                         endDate={endDate}
//                         setEndDate={setEndDate}
//                     />
//                 )}

//                 <div className="flex items-center justify-center gap-4 w-full bottom-0 py-3 bg-white mt-10 text-[12px]">
//                     <button
//                         type="submit"
//                         className="flex items-center justify-center border-2 text-[red] border-[red] px-4 py-2 w-[100px]"
//                         disabled={isSubmitting}
//                     >
//                         {loading || editLoading
//                             ? "Processing..."
//                             : isEdit
//                                 ? "Update"
//                                 : "Create"}
//                     </button>

//                     {!isEdit &&
//                         (isFormEmpty() ? (
//                             <button
//                                 type="button"
//                                 onClick={handleCancel}
//                                 className="flex items-center justify-center border-2 text-gray-600 border-gray-400 px-4 py-2 w-max"
//                             >
//                                 Cancel
//                             </button>
//                         ) : (
//                             <button
//                                 type="button"
//                                 className="flex items-center justify-center border-2 text-[red] border-[red] px-4 py-2 w-max"
//                                 onClick={handleAddTask}
//                                 disabled={isSubmitting}
//                             >
//                                 Save & Add New
//                             </button>
//                         ))}
//                 </div>
//             </div>
//         </form>
//     );
// };

// export default ProjectTaskCreateModal;




import React from 'react'

const ProjectTaskCreateModal = () => {
    return (
        <div>ProjectTaskCreateModal</div>
    )
}

export default ProjectTaskCreateModal