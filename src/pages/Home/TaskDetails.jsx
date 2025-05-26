// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import {
//     ChevronDown,
//     ChevronDownCircle,
//     MoreHorizontal,
// } from "lucide-react";
// import { Fragment, useEffect, useRef, useState } from "react";
// import SourceIcon from "@mui/icons-material/Source";
// import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
// import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
// import SubtaskTable from "../../components/Home/Task/Modals/subtaskTable";
// import DependancyKanban from "../../components/Home/DependancyKanban";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { changeTaskStatus, createTaskComment, editTaskComment, fetchTasksComments, taskDetails } from "../../redux/slices/taskSlice";

// const calculateDuration = (start, end) => {
//     const startDate = new Date(start);
//     const endDate = new Date(end);
//     const diffMs = endDate - startDate;
//     if (diffMs <= 0) return '0 sec';
//     const seconds = Math.floor(diffMs / 1000);
//     const minutes = Math.floor(seconds / 60);
//     const hours = Math.floor(minutes / 60);
//     const remainingMinutes = minutes % 60;
//     const remainingSeconds = seconds % 60;
//     return `${hours > 0 ? hours + ' hr ' : ''}${remainingMinutes > 0 ? remainingMinutes + ' mins ' : ''}${remainingSeconds} sec`;
// };

// function formatToDDMMYYYY_AMPM(dateString) {
//     const date = new Date(dateString);

//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//     const year = date.getFullYear();

//     let hours = date.getHours();
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const ampm = hours >= 12 ? 'PM' : 'AM';

//     hours = hours % 12;
//     hours = hours ? hours : 12; // Convert hour 0 to 12
//     hours = String(hours).padStart(2, '0');

//     return `${day} /${month}/${year} ${hours}:${minutes} ${ampm}`;
// }

// const Status = () => {
//     const activities = [
//         { id: 1, person: 'Chetan Bafna', action: 'added', item: 'task', timestamp: '01 Jan 2025 09:30 AM' },
//         { id: 2, person: 'John Doe', action: 'updated', item: 'task', timestamp: '01 Jan 2025 10:53 AM' },
//         { id: 3, person: 'John Doe', action: 'updated', item: 'task', timestamp: '01 Jan 2025 10:53 AM' },
//         { id: 4, person: 'John Doe', action: 'updated', item: 'task', timestamp: '01 Jan 2025 10:53 AM' },
//         { id: 5, person: 'John Doe', action: 'updated', item: 'task', timestamp: '01 Jan 2025 10:53 AM' },
//         // ...
//     ]
//     const sortedActivities = [...activities].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

//     return (
//         <div className="overflow-x-auto w-full bg-[rgba(247, 247, 247, 0.51)] shadow rounded-lg mt-3 px-4">
//             <div className="flex items-center p-2 gap-5 text-[12px] my-3">
//                 {sortedActivities.map((activity, index) => (
//                     <Fragment key={activity.id}>
//                         <div className="flex flex-col gap-2 min-w-[150px]">
//                             <span><i>{activity.person} <span className="text-[#C72030]">{activity.action}</span> {activity.item}</i></span>
//                             <span><i>{activity.timestamp}</i></span>
//                         </div>
//                         {index < sortedActivities.length - 1 && (
//                             <div className="flex flex-col items-center min-w-[100px]">
//                                 <h1 className="text-[12px] text-center">{calculateDuration(activity.timestamp, sortedActivities[index + 1].timestamp)}</h1>
//                                 <img src="/arrow.png" alt="arrow" className="mt-1" />
//                             </div>
//                         )}
//                     </Fragment>
//                 ))}
//             </div>
//         </div>
//     );
// };

// const Documents = () => {
//     return (
//         <div>
//             <div className="flex items-start gap-2 p-5">
//                 <SourceIcon />
//                 <h1 className="text-[#0063AF]">BRD.xls</h1>
//             </div>
//             <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
//         </div>

//     )
// }

// // const Comments = () => {
// //     const { id } = useParams();
// //     const [comment, setComment] = useState("");

// //     const dispatch = useDispatch()
// //     const { fetchTasksComments: comments } = useSelector(state => state.fetchTasksComments)
// //     const { loading, success, error } = useSelector(state => state.createTaskComment)
// //     const { loading: editLoading, success: editSuccess, error: editError } = useSelector(state => state.editTaskComment)


// //     useEffect(() => {
// //         dispatch(fetchTasksComments())
// //     }, [success])

// //     const handleAddComment = (e) => {
// //         e.preventDefault();
// //         const payload = {
// //             comment: {
// //                 body: comment,
// //                 commentable_id: id,
// //                 commentable_type: "TaskManagement",
// //                 commentor_id: 364,
// //                 active: true
// //             }
// //         }

// //         dispatch(createTaskComment(payload))
// //     }

// //     useEffect(() => {
// //         if (success) {
// //             setComment("")
// //         }
// //     }, [success])

// //     return (
// //         <div className="text-[14px] flex flex-col gap-2">
// //             <div className="flex justify-start m-2 gap-5">
// //                 <div className="bg-[#01569E] h-[36px] w-[36px] rounded-full text-white  text-center p-1.5">
// //                     <span className="">CB</span>
// //                 </div>
// //                 <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-[95%] h-[70px] bg-[#F2F4F4] p-2 border-2 b-[#DFDFDF]" placeholder="Add comment here. Type @ to mentions users. Type # to mention tags"></textarea>
// //             </div>
// //             <div className="flex justify-end">
// //                 <button type="submit" className="bg-red text-white h-[30px] px-3 cursor-pointer p-1 mr-2" onClick={handleAddComment}>Add Comment</button>
// //                 <button className="border-2 border-[#C72030] h-[30px] cursor-pointer p-1 px-3" >Cancel</button>
// //             </div>
// //             {comments.map((comment) => {
// //                 return (
// //                     <div className="relative flex justify-start m-2 gap-5">
// //                         <div className="bg-[#01569E] h-[36px] w-[36px] rounded-full text-white  text-center p-1.5">
// //                             <span className="">CB</span>
// //                         </div>
// //                         <div className="flex flex-col gap-2 w-full border-b-[2px] pb-3 border-[rgba(190, 190, 190, 1)]">
// //                             <h1 className="font-bold">{comment.commentor_full_name}</h1>
// //                             <span>{comment?.body}</span>
// //                             <div className="flex gap-2 text-[10px]">
// //                                 <span>{formatToDDMMYYYY_AMPM(comment.created_at)}</span>
// //                                 <span className="cursor-pointer" onClick={handleEdit}>Edit</span>
// //                                 <span>Delete</span>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 );
// //             })}
// //         </div>
// //     )
// // }

// const Comments = () => {
//     const { id } = useParams();
//     const [comment, setComment] = useState("");
//     const [editingCommentId, setEditingCommentId] = useState(null);
//     const textareaRef = useRef(null); // Reference to the textarea

//     const dispatch = useDispatch();
//     const { fetchTasksComments: comments } = useSelector(state => state.fetchTasksComments);
//     const { loading, success, error } = useSelector(state => state.createTaskComment);
//     const { loading: editLoading, success: editSuccess, error: editError } = useSelector(state => state.editTaskComment);

//     useEffect(() => {
//         dispatch(fetchTasksComments());
//     }, [success, editSuccess, dispatch]);

//     const handleAddComment = (e) => {
//         e.preventDefault();
//         if (editingCommentId) {
//             const payload = new FormData();
//             payload.append('comment[body]', comment)
//             dispatch(editTaskComment({ id: editingCommentId, payload }));
//         } else {
//             // Create new comment
//             const payload = {
//                 comment: {
//                     body: comment,
//                     commentable_id: id,
//                     commentable_type: "TaskManagement",
//                     commentor_id: 364,
//                     active: true
//                 }
//             };
//             dispatch(createTaskComment(payload));
//         }
//     };

//     const handleEdit = (comment) => {
//         setEditingCommentId(comment.id);
//         setComment(comment.body);
//         // Scroll to textarea
//         if (textareaRef.current) {
//             textareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
//             textareaRef.current.focus(); // Optional: focus the textarea for immediate editing
//         }
//     };

//     const handleCancel = () => {
//         setEditingCommentId(null);
//         setComment("");
//     };

//     useEffect(() => {
//         if (success || editSuccess) {
//             setComment("");
//             setEditingCommentId(null);
//         }
//     }, [success, editSuccess]);

//     return (
//         <div className="text-[14px] flex flex-col gap-2">
//             <div className="flex justify-start m-2 gap-5">
//                 <div className="bg-[#01569E] h-[36px] w-[36px] rounded-full text-white text-center p-1.5">
//                     <span className="">CB</span>
//                 </div>
//                 <textarea
//                     ref={textareaRef}
//                     value={comment}
//                     onChange={(e) => setComment(e.target.value)}
//                     className="w-[95%] h-[70px] bg-[#F2F4F4] p-2 border-2 b-[#DFDFDF]"
//                     placeholder="Add comment here. Type @ to mentions users. Type # to mention tags"
//                 />
//             </div>
//             <div className="flex justify-end">
//                 <button
//                     type="submit"
//                     className="bg-red text-white h-[30px] px-3 cursor-pointer p-1 mr-2"
//                     onClick={handleAddComment}
//                     disabled={loading || editLoading}
//                 >
//                     {editingCommentId ? 'Update Comment' : 'Add Comment'}
//                 </button>
//                 <button
//                     className="border-2 border-[#C72030] h-[30px] cursor-pointer p-1 px-3"
//                     onClick={handleCancel}
//                 >
//                     Cancel
//                 </button>
//             </div>
//             {comments.map((comment) => (
//                 <div key={comment.id} className="relative flex justify-start m-2 gap-5">
//                     <div className="bg-[#01569E] h-[36px] w-[36px] rounded-full text-white text-center p-1.5">
//                         <span className="">CB</span>
//                     </div>
//                     <div className="flex flex-col gap-2 w-full border-b-[2px] pb-3 border-[rgba(190, 190, 190, 1)]">
//                         <h1 className="font-bold">{comment.commentor_full_name}</h1>
//                         <span>{comment.body}</span>
//                         <div className="flex gap-2 text-[10px]">
//                             <span>{formatToDDMMYYYY_AMPM(comment.created_at)}</span>
//                             <span
//                                 className="cursor-pointer"
//                                 onClick={() => handleEdit(comment)}
//                             >
//                                 Edit
//                             </span>
//                             <span>Delete</span>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// const Attachments = () => {
//     return (
//         <div className="flex justify-start flex-col gap-3 p-5 text-[14px] mt-2">
//             <span>No Documents Attahced</span>
//             <span className="text-[#C2C2C2]">Drop or attach relevant documents here</span>
//             <button className="bg-[#C72030] h-[40px] w-[240px] text-white px-5">Attach Files</button>
//         </div>
//     );
// }


// const TaskDetails = () => {
//     const { id } = useParams();

//     const dispatch = useDispatch();
//     const { taskDetails: task } = useSelector((state) => state.taskDetails);

//     console.log(task)

//     useEffect(() => {
//         dispatch(taskDetails(id));
//     }, []);

//     const [isFirstCollapsed, setIsFirstCollapsed] = useState(false);
//     const [isSecondCollapsed, setIsSecondCollapsed] = useState(false);
//     const firstContentRef = useRef(null);
//     const secondContentRef = useRef(null);
//     const [tab, setTab] = useState("Subtasks");

//     const [openDropdown, setOpenDropdown] = useState(false);
//     const [selectedOption, setSelectedOption] = useState('Active');

//     const dropdownRef = useRef(null);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setOpenDropdown(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     const dropdownOptions = ["Active", "In Progress", "On Hold", "Overdue", "Completed"];

//     const handleOptionSelect = (option) => {
//         setSelectedOption(option);
//         setOpenDropdown(false);
//     };

//     useEffect(() => {
//         dispatch(changeTaskStatus({ id, payload: { status: selectedOption.replace(' ', '_').toLowerCase() } }))
//     }, [selectedOption])

//     useGSAP(() => {
//         gsap.set(firstContentRef.current, { height: "auto" });
//         gsap.set(secondContentRef.current, { height: "auto" });
//     }, []);

//     const toggleFirstCollapse = () => {
//         if (isFirstCollapsed) {
//             gsap.to(firstContentRef.current, {
//                 height: "auto",
//                 opacity: 1,
//                 duration: 0.5,
//                 ease: "power2.inOut",
//             });
//         } else {
//             gsap.to(firstContentRef.current, {
//                 height: 0,
//                 opacity: 0,
//                 duration: 0.5,
//                 ease: "power2.inOut",
//             });
//         }
//         setIsFirstCollapsed(!isFirstCollapsed);
//     };

//     const toggleSecondCollapse = () => {
//         if (isSecondCollapsed) {
//             gsap.to(secondContentRef.current, {
//                 height: "auto",
//                 opacity: 1,
//                 duration: 0.5,
//                 ease: "power2.inOut",
//             });
//         } else {
//             gsap.to(secondContentRef.current, {
//                 height: 0,
//                 opacity: 0,
//                 duration: 0.5,
//                 ease: "power2.inOut",
//             });
//         }
//         setIsSecondCollapsed(!isSecondCollapsed);
//     };

//     return (
//         <div className="m-4">
//             <div className="px-4 pt-1">
//                 <h2 className="text-[15px] p-3 px-0">
//                     <span className=" mr-3">T-0{task.id}</span>
//                     <span >{task.title}</span>
//                 </h2>

//                 <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
//                 <div className="flex items-center justify-between my-3 text-[12px]">
//                     <div className="flex items-center gap-3 text-[#323232]">
//                         <span>Created By : {task.created_by?.name}</span>
//                         <span className="h-6 w-[1px] border border-gray-300"></span>
//                         <span className="flex items-center gap-3">
//                             Created On : {formatToDDMMYYYY_AMPM(task.created_at)}
//                         </span>
//                         <span className="h-6 w-[1px] border border-gray-300"></span>
//                         <span className="flex relative items-center gap-2 cursor-pointer px-2 py-1 w-[150px] rounded-md text-sm text-white bg-[#C85E68]">
//                             {/* Active <ChevronDown className="absolute right-2" /> */}

//                             <div className="relative w-full" ref={dropdownRef}>
//                                 <div
//                                     className="flex items-center justify-between gap-1 cursor-pointer px-2 py-1"
//                                     onClick={() => setOpenDropdown(!openDropdown)}
//                                     role="button"
//                                     aria-haspopup="true"
//                                     aria-expanded={openDropdown}
//                                     tabIndex={0}
//                                     onKeyDown={(e) =>
//                                         e.key === "Enter" && setOpenDropdown(!openDropdown)
//                                     }
//                                 >
//                                     <span className="text-[13px]">{task.status}</span> {/* Display selected option */}
//                                     <ChevronDown
//                                         size={15}
//                                         className={`${openDropdown ? "rotate-180" : ""
//                                             } transition-transform`}
//                                     />
//                                 </div>
//                                 <ul
//                                     className={`dropdown-menu absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden ${openDropdown ? "block" : "hidden"}`}
//                                     role="menu"
//                                     style={{
//                                         minWidth: "150px",
//                                         maxHeight: "400px",
//                                         overflowY: "auto",
//                                         zIndex: 1000,
//                                     }}
//                                 >
//                                     {dropdownOptions.map((option, idx) => (
//                                         <li key={idx} role="menuitem">
//                                             <button
//                                                 className={`dropdown-item w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 ${selectedOption === option
//                                                     ? "bg-gray-100 font-semibold"
//                                                     : ""
//                                                     }`}
//                                                 onClick={() => handleOptionSelect(option)}
//                                             >
//                                                 {option}
//                                             </button>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </span>
//                         <span className="h-6 w-[1px] border border-gray-300"></span>
//                         <span>
//                             <EditOutlinedIcon className="mx-1" sx={{ fontSize: "12px" }} />                       Edit Task
//                         </span>
//                         <span className="h-6 w-[1px] border border-gray-300"></span>

//                         <span>
//                             <DeleteOutlinedIcon className="mx-1" sx={{ fontSize: "12px" }} />
//                             Delete Task
//                         </span>
//                     </div>
//                     <MoreHorizontal color="#E95420" className="cursor-pointer" />
//                 </div>
//                 <div className="border-b-[3px] border-grey my-3 "></div>

//                 <div className="border rounded-md shadow-custom p-5 mb-4 text-[14px]">
//                     <div
//                         className="font-[600] text-[16px] flex items-center gap-4"
//                         onClick={toggleFirstCollapse}
//                     >
//                         <ChevronDownCircle
//                             color="#E95420"
//                             size={30}
//                             className={`${isFirstCollapsed ? "rotate-180" : "rotate-0"
//                                 } transition-transform`}
//                         />{" "}
//                         Description
//                     </div>
//                     <div className="mt-3 overflow-hidden " ref={firstContentRef}>
//                         <p>{task.description}</p>
//                     </div>
//                 </div>

//                 <div className="border rounded-md shadow-custom p-5 mb-4">
//                     <div
//                         className="font-[600] text-[16px] flex items-center gap-4"
//                         onClick={toggleSecondCollapse}
//                     >
//                         <ChevronDownCircle
//                             color="#E95420"
//                             size={30}
//                             className={`${isSecondCollapsed ? "rotate-180" : "rotate-0"
//                                 } transition-transform`}
//                         />{" "}
//                         Details
//                     </div>

//                     <div className="mt-3 overflow-hidden " ref={secondContentRef}>
//                         <div className="flex items-center">
//                             <div className="w-1/2 flex items-center justify-center gap-3">
//                                 <div className="text-right text-[12px] font-[500]">
//                                     Responsible Person  :
//                                 </div>
//                                 <div className="text-left text-[12px]">{task.responsible_person?.name}</div>
//                             </div>
//                             <div className="w-1/2 flex items-center justify-center gap-3">
//                                 <div className="text-right text-[12px] font-[500]]">
//                                     Priority :
//                                 </div>
//                                 <div className="text-left text-[12px]">{task.priority?.charAt(0).toUpperCase() +
//                                     task.priority?.slice(1).toLowerCase() || ""}</div>
//                             </div>
//                         </div>

//                         <span className="border h-[1px] inline-block w-full my-4"></span>

//                         <div className="flex items-center">
//                             <div className="w-1/2 flex items-center justify-center gap-3">
//                                 <div className="text-right text-[12px] font-[500]">
//                                     Start Date :
//                                 </div>
//                                 <div className="text-left text-[12px]">{task.expected_start_date}</div>
//                             </div>
//                             <div className="w-1/2 flex items-center justify-center gap-3">
//                                 <div className="text-right text-[12px] font-[500]">
//                                     MileStones :
//                                 </div>
//                                 <div className="text-left text-[12px]">0/1</div>
//                             </div>
//                         </div>

//                         <span className="border h-[1px] inline-block w-full my-4"></span>

//                         <div className="flex items-center">
//                             <div className="w-1/2 flex items-center justify-center gap-3">
//                                 <div className="text-right text-[12px] font-[500]">
//                                     End Date :
//                                 </div>
//                                 <div className="text-left text-[12px]">{task.target_date} </div>
//                             </div>
//                             <div className="w-1/2 flex items-center justify-center gap-3">
//                                 <div className="text-right text-[12px] font-semibold">
//                                     Tags :
//                                 </div>
//                                 <div className="text-left text-[12px] flex items-start gap-1">
//                                     {task.task_tags?.map((tag) => {
//                                         return (
//                                             <div className="border-2 border-[#c72030] rounded-full py-1 px-2 text-[12px] mx-1">
//                                                 {tag.company_tag?.name}
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             </div>
//                         </div>

//                         <span className="border h-[1px] inline-block w-full my-4"></span>

//                         <div className="flex items-center">
//                             <div className="w-1/2 flex items-center justify-center gap-3">
//                                 <div className="text-right text-[12px] font-[500]">
//                                     Duration :
//                                 </div>
//                                 <div className="text-left text-[#029464] text-[12px]">00d : 00h : 30m</div>
//                             </div>
//                             <div className="w-1/2 flex items-center justify-center gap-3">
//                                 <div className="text-right text-[12px] font-semibold">
//                                     Observer :
//                                 </div>
//                                 <div className="text-left text-[12px] flex items-start gap-1">
//                                     {task.observers?.map((observer) => {
//                                         return (
//                                             <div className="border-2  border-[#c72030] rounded-full px-2 py-1 text-[12px] mx-2">
//                                                 {observer.user_name}
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//                 <div>
//                     <div className="flex items-center justify-between my-3" >
//                         <div className="flex items-center gap-10">
//                             {
//                                 ["Subtasks", "Dependency", "Comments", "Attachments", "Activity Log"].map((tabName, index) => (
//                                     <div
//                                         key={index}
//                                         id={index + 1}
//                                         className={`text-[14px] font-[400] ${tab === tabName ? "selected" : "cursor-pointer"}`}
//                                         onClick={() => setTab(tabName)}
//                                     >
//                                         {tabName}
//                                     </div>
//                                 ))
//                             }
//                         </div>

//                     </div>
//                     <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>

//                     <div>
//                         {tab == "Subtasks" && <SubtaskTable />}
//                         {tab == "Dependency" && <DependancyKanban />}
//                         {tab == "Comments" && <Comments />}
//                         {tab == "Attachments" && <Attachments />}
//                         {tab == "Activity Log" && <Status />}

//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default TaskDetails;




import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronDown, ChevronDownCircle, MoreHorizontal } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import SourceIcon from "@mui/icons-material/Source";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SubtaskTable from "../../components/Home/Task/Modals/subtaskTable";
import DependancyKanban from "../../components/Home/DependancyKanban";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeTaskStatus, createTaskComment, editTaskComment, fetchTasksComments, taskDetails } from "../../redux/slices/taskSlice";

// Utility function to map raw API status to display-friendly status
const mapStatusToDisplay = (rawStatus) => {
    const statusMap = {
        open: "Active",
        in_progress: "In Progress",
        on_hold: "On Hold",
        overdue: "Overdue",
        completed: "Completed",
    };
    return statusMap[rawStatus?.toLowerCase()] || "Active"; // Default to "Active" if unknown
};

// Utility function to map display status back to API format
const mapDisplayToApiStatus = (displayStatus) => {
    const reverseStatusMap = {
        Active: "open",
        "In Progress": "in_progress",
        "On Hold": "on_hold",
        Overdue: "overdue",
        Completed: "completed",
    };
    return reverseStatusMap[displayStatus] || "open"; // Default to "open" if unknown
};

const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate - startDate;
    if (diffMs <= 0) return "0 sec";
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? hours + " hr " : ""}${remainingMinutes > 0 ? remainingMinutes + " mins " : ""}${remainingSeconds} sec`;
};

function formatToDDMMYYYY_AMPM(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = String(hours).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

const Status = () => {
    const activities = [
        { id: 1, person: "Chetan Bafna", action: "added", item: "task", timestamp: "01 Jan 2025 09:30 AM" },
        { id: 2, person: "John Doe", action: "updated", item: "task", timestamp: "01 Jan 2025 10:53 AM" },
        { id: 3, person: "John Doe", action: "updated", item: "task", timestamp: "01 Jan 2025 10:53 AM" },
        { id: 4, person: "John Doe", action: "updated", item: "task", timestamp: "01 Jan 2025 10:53 AM" },
        { id: 5, person: "John Doe", action: "updated", item: "task", timestamp: "01 Jan 2025 10:53 AM" },
    ];
    const sortedActivities = [...activities].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return (
        <div className="overflow-x-auto w-full bg-[rgba(247, 247, 247, 0.51)] shadow rounded-lg mt-3 px-4">
            <div className="flex items-center p-2 gap-5 text-[12px] my-3">
                {sortedActivities.map((activity, index) => (
                    <Fragment key={activity.id}>
                        <div className="flex flex-col gap-2 min-w-[150px]">
                            <span>
                                <i>
                                    {activity.person} <span className="text-[#C72030]">{activity.action}</span> {activity.item}
                                </i>
                            </span>
                            <span>
                                <i>{activity.timestamp}</i>
                            </span>
                        </div>
                        {index < sortedActivities.length - 1 && (
                            <div className="flex flex-col items-center min-w-[100px]">
                                <h1 className="text-[12px] text-center">{calculateDuration(activity.timestamp, sortedActivities[index + 1].timestamp)}</h1>
                                <img src="/arrow.png" alt="arrow" className="mt-1" />
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

const Documents = () => {
    return (
        <div>
            <div className="flex items-start gap-2 p-5">
                <SourceIcon />
                <h1 className="text-[#0063AF]">BRD.xls</h1>
            </div>
            <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
        </div>
    );
};

const Comments = () => {
    const { id } = useParams();
    const [comment, setComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const textareaRef = useRef(null);

    const dispatch = useDispatch();
    const { fetchTasksComments: comments } = useSelector(state => state.fetchTasksComments);
    const { loading, success, error } = useSelector(state => state.createTaskComment);
    const { loading: editLoading, success: editSuccess, error: editError } = useSelector(state => state.editTaskComment);

    useEffect(() => {
        dispatch(fetchTasksComments());
    }, [success, editSuccess, dispatch]);

    const handleAddComment = (e) => {
        e.preventDefault();
        if (editingCommentId) {
            const payload = new FormData();
            payload.append("comment[body]", comment);
            dispatch(editTaskComment({ id: editingCommentId, payload }));
        } else {
            const payload = {
                comment: {
                    body: comment,
                    commentable_id: id,
                    commentable_type: "TaskManagement",
                    commentor_id: 364,
                    active: true,
                },
            };
            dispatch(createTaskComment(payload));
        }
    };

    const handleEdit = (comment) => {
        setEditingCommentId(comment.id);
        setComment(comment.body);
        if (textareaRef.current) {
            textareaRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            textareaRef.current.focus();
        }
    };

    const handleCancel = () => {
        setEditingCommentId(null);
        setComment("");
    };

    useEffect(() => {
        if (success || editSuccess) {
            setComment("");
            setEditingCommentId(null);
        }
    }, [success, editSuccess]);

    return (
        <div className="text-[14px] flex flex-col gap-2">
            <div className="flex justify-start m-2 gap-5">
                <div className="bg-[#01569E] h-[36px] w-[36px] rounded-full text-white text-center p-1.5">
                    <span className="">CB</span>
                </div>
                <textarea
                    ref={textareaRef}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-[95%] h-[70px] bg-[#F2F4F4] p-2 border-2 b-[#DFDFDF]"
                    placeholder="Add comment here. Type @ to mentions users. Type # to mention tags"
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-red text-white h-[30px] px-3 cursor-pointer p-1 mr-2"
                    onClick={handleAddComment}
                    disabled={loading || editLoading}
                >
                    {editingCommentId ? "Update Comment" : "Add Comment"}
                </button>
                <button
                    className="border-2 border-[#C72030] h-[30px] cursor-pointer p-1 px-3"
                    onClick={handleCancel}
                >
                    Cancel
                </button>
            </div>
            {comments.map((comment) => (
                <div key={comment.id} className="relative flex justify-start m-2 gap-5">
                    <div className="bg-[#01569E] h-[36px] w-[36px] rounded-full text-white text-center p-1.5">
                        <span className="">CB</span>
                    </div>
                    <div className="flex flex-col gap-2 w-full border-b-[2px] pb-3 border-[rgba(190, 190, 190, 1)]">
                        <h1 className="font-bold">{comment.commentor_full_name}</h1>
                        <span>{comment.body}</span>
                        <div className="flex gap-2 text-[10px]">
                            <span>{formatToDDMMYYYY_AMPM(comment.created_at)}</span>
                            <span
                                className="cursor-pointer"
                                onClick={() => handleEdit(comment)}
                            >
                                Edit
                            </span>
                            <span>Delete</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Attachments = () => {
    return (
        <div className="flex justify-start flex-col gap-3 p-5 text-[14px] mt-2">
            <span>No Documents Attached</span>
            <span className="text-[#C2C2C2]">Drop or attach relevant documents here</span>
            <button className="bg-[#C72030] h-[40px] w-[240px] text-white px-5">Attach Files</button>
        </div>
    );
};

const TaskDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { taskDetails: task, status: taskStatus } = useSelector((state) => state.taskDetails);

    const [isFirstCollapsed, setIsFirstCollapsed] = useState(false);
    const [isSecondCollapsed, setIsSecondCollapsed] = useState(false);
    const firstContentRef = useRef(null);
    const secondContentRef = useRef(null);
    const [tab, setTab] = useState("Subtasks");
    const [openDropdown, setOpenDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Active");
    const dropdownRef = useRef(null);

    // Sync selectedOption with task.status when task loads or updates
    useEffect(() => {
        if (task?.status) {
            setSelectedOption(mapStatusToDisplay(task.status));
        }
    }, [task?.status]);

    useEffect(() => {
        dispatch(taskDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const dropdownOptions = ["Active", "In Progress", "On Hold", "Overdue", "Completed"];

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setOpenDropdown(false);
        // Dispatch status change with API-compatible status
        dispatch(
            changeTaskStatus({
                id,
                payload: { status: mapDisplayToApiStatus(option) },
            })
        );
    };

    useGSAP(() => {
        gsap.set(firstContentRef.current, { height: "auto" });
        gsap.set(secondContentRef.current, { height: "auto" });
    }, []);

    const toggleFirstCollapse = () => {
        if (isFirstCollapsed) {
            gsap.to(firstContentRef.current, {
                height: "auto",
                opacity: 1,
                duration: 0.5,
                ease: "power2.inOut",
            });
        } else {
            gsap.to(firstContentRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut",
            });
        }
        setIsFirstCollapsed(!isFirstCollapsed);
    };

    const toggleSecondCollapse = () => {
        if (isSecondCollapsed) {
            gsap.to(secondContentRef.current, {
                height: "auto",
                opacity: 1,
                duration: 0.5,
                ease: "power2.inOut",
            });
        } else {
            gsap.to(secondContentRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut",
            });
        }
        setIsSecondCollapsed(!isSecondCollapsed);
    };

    return (
        <div className="m-4">
            <div className="px-4 pt-1">
                <h2 className="text-[15px] p-3 px-0">
                    <span className="mr-3">T-0{task.id}</span>
                    <span>{task.title}</span>
                </h2>
                <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
                <div className="flex items-center justify-between my-3 text-[12px]">
                    <div className="flex items-center gap-3 text-[#323232]">
                        <span>Created By: {task.created_by?.name}</span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>
                        <span className="flex items-center gap-3">
                            Created On: {formatToDDMMYYYY_AMPM(task.created_at)}
                        </span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>
                        <span className="flex relative items-center gap-2 cursor-pointer px-2 py-1 w-[150px] rounded-md text-sm text-white bg-[#C85E68]">
                            <div className="relative w-full" ref={dropdownRef}>
                                <div
                                    className="flex items-center justify-between gap-1 cursor-pointer px-2 py-1"
                                    onClick={() => setOpenDropdown(!openDropdown)}
                                    role="button"
                                    aria-haspopup="true"
                                    aria-expanded={openDropdown}
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === "Enter" && setOpenDropdown(!openDropdown)}
                                >
                                    <span className="text-[13px]">{selectedOption}</span>
                                    <ChevronDown
                                        size={15}
                                        className={`${openDropdown ? "rotate-180" : ""} transition-transform`}
                                    />
                                </div>
                                <ul
                                    className={`dropdown-menu absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden ${openDropdown ? "block" : "hidden"}`}
                                    role="menu"
                                    style={{
                                        minWidth: "150px",
                                        maxHeight: "400px",
                                        overflowY: "auto",
                                        zIndex: 1000,
                                    }}
                                >
                                    {dropdownOptions.map((option, idx) => (
                                        <li key={idx} role="menuitem">
                                            <button
                                                className={`dropdown-item w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 ${selectedOption === option ? "bg-gray-100 font-semibold" : ""}`}
                                                onClick={() => handleOptionSelect(option)}
                                            >
                                                {option}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>
                        <span>
                            <EditOutlinedIcon className="mx-1" sx={{ fontSize: "12px" }} /> Edit Task
                        </span>
                        <span className="h-6 w-[1px] border border-gray-300"></span>
                        <span>
                            <DeleteOutlinedIcon className="mx-1" sx={{ fontSize: "12px" }} /> Delete Task
                        </span>
                    </div>
                    <MoreHorizontal color="#E95420" className="cursor-pointer" />
                </div>
                <div className="border-b-[3px] border-grey my-3"></div>
                <div className="border rounded-md shadow-custom p-5 mb-4 text-[14px]">
                    <div className="font-[600] text-[16px] flex items-center gap-4" onClick={toggleFirstCollapse}>
                        <ChevronDownCircle
                            color="#E95420"
                            size={30}
                            className={`${isFirstCollapsed ? "rotate-180" : "rotate-0"} transition-transform`}
                        />{" "}
                        Description
                    </div>
                    <div className="mt-3 overflow-hidden" ref={firstContentRef}>
                        <p>{task.description}</p>
                    </div>
                </div>
                <div className="border rounded-md shadow-custom p-5 mb-4">
                    <div className="font-[600] text-[16px] flex items-center gap-4" onClick={toggleSecondCollapse}>
                        <ChevronDownCircle
                            color="#E95420"
                            size={30}
                            className={`${isSecondCollapsed ? "rotate-180" : "rotate-0"} transition-transform`}
                        />{" "}
                        Details
                    </div>
                    <div className="mt-3 overflow-hidden" ref={secondContentRef}>
                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">Responsible Person:</div>
                                <div className="text-left text-[12px]">{task.responsible_person?.name}</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">Priority:</div>
                                <div className="text-left text-[12px]">
                                    {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1).toLowerCase() || ""}
                                </div>
                            </div>
                        </div>
                        <span className="border h-[1px] inline-block w-full my-4"></span>
                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">Start Date:</div>
                                <div className="text-left text-[12px]">{task.expected_start_date}</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">MileStones:</div>
                                <div className="text-left text-[12px]">0/1</div>
                            </div>
                        </div>
                        <span className="border h-[1px] inline-block w-full my-4"></span>
                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">End Date:</div>
                                <div className="text-left text-[12px]">{task.target_date}</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-semibold">Tags:</div>
                                <div className="text-left text-[12px] flex items-start gap-1">
                                    {task.task_tags?.map((tag) => (
                                        <div key={tag.company_tag?.id} className="border-2 border-[#c72030] rounded-full py-1 px-2 text-[12px] mx-1">
                                            {tag.company_tag?.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <span className="border h-[1px] inline-block w-full my-4"></span>
                        <div className="flex items-center">
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-[500]">Duration:</div>
                                <div className="text-left text-[#029464] text-[12px]">
                                    {calculateDuration(task.expected_start_date, task.target_date)}
                                </div>
                            </div>
                            <div className="w-1/2 flex items-center justify-center gap-3">
                                <div className="text-right text-[12px] font-semibold">Observer:</div>
                                <div className="text-left text-[12px] flex items-start gap-1">
                                    {task.observers?.map((observer) => (
                                        <div key={observer.id} className="border-2 border-[#c72030] rounded-full px-2 py-1 text-[12px] mx-2">
                                            {observer.user_name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between my-3">
                        <div className="flex items-center gap-10">
                            {["Subtasks", "Dependency", "Comments", "Attachments", "Activity Log"].map((tabName, index) => (
                                <div
                                    key={index}
                                    id={index + 1}
                                    className={`text-[14px] font-[400] ${tab === tabName ? "selected" : "cursor-pointer"}`}
                                    onClick={() => setTab(tabName)}
                                >
                                    {tabName}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
                    <div>
                        {tab === "Subtasks" && <SubtaskTable />}
                        {tab === "Dependency" && <DependancyKanban />}
                        {tab === "Comments" && <Comments />}
                        {tab === "Attachments" && <Attachments />}
                        {tab === "Activity Log" && <Status />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;