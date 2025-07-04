// import { useEffect, useRef, useState } from "react";
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import CloseIcon from "@mui/icons-material/Close";
// import SelectBox from "../../SelectBox";
// import MultiSelectBox from "../../MultiSelectBox";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUsers } from "../../../redux/slices/userSlice";
// import {
//     createProjectTeam,
//     fetchProjects,
//     fetchProjectTeam,
//     removeMembersFromTeam,
//     updateProjectTeam,
// } from "../../../redux/slices/projectSlice";
// import toast from "react-hot-toast";

// const TeamModal = ({
//     isModalOpen,
//     setIsModalOpen,
//     isEdit = false,
//     id = null,
// }) => {
//     const token = localStorage.getItem("token");
//     const dispatch = useDispatch();
//     const addTaskModalRef = useRef(null);

//     const { fetchUsers: users = [] } = useSelector((state) => state.fetchUsers);
//     const { fetchProjectTeam: projectTeam } = useSelector(
//         (state) => state.fetchProjectTeam
//     );
//     const { success } = useSelector((state) => state.createProjectTeam);
//     const { success: editSuccess } = useSelector(
//         (state) => state.updateProjectTeam
//     );

//     const [prevMembers, setPrevMembers] = useState([]);
//     const [projectTeamId, setProjectTeamId] = useState();
//     const [formData, setFormData] = useState({
//         teamName: "",
//         teamLead: "",
//         project: "",
//         teamMembers: [],
//     });

//     useGSAP(() => {
//         if (isModalOpen) {
//             gsap.fromTo(
//                 addTaskModalRef.current,
//                 { x: "100%" },
//                 { x: "0%", duration: 0.5, ease: "power3.out" }
//             );
//         }
//     }, [isModalOpen]);

//     useEffect(() => {
//         dispatch(fetchUsers({ token }));
//         dispatch(fetchProjects({ token }));
//     }, [dispatch]);

//     useEffect(() => {
//         isEdit && dispatch(fetchProjectTeam({ token, id }));
//     }, [dispatch]);

//     useEffect(() => {
//         if (projectTeam && users.length > 0 && isEdit) {
//             // Map user IDs to objects with label and value
//             const selectedTeamMembers = projectTeam?.project_team_members?.map(
//                 (member) => {
//                     const user = users.find((u) => u.id === member.user_id);
//                     return {
//                         label: user ? `${user.firstname} ${user.lastname}` : '',
//                         value: member.user_id,
//                         id: member.id
//                     };
//                 }
//             ) || [];

//             setFormData({
//                 teamName: projectTeam.name,
//                 teamLead: projectTeam.team_lead_id,
//                 project: projectTeam.project_management_id,
//                 teamMembers: selectedTeamMembers,
//             });
//             setProjectTeamId(projectTeam.id);
//             setPrevMembers(selectedTeamMembers);
//         }
//     }, [projectTeam, users, isEdit]);


//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSelectChange = (field, value) => {
//         setFormData((prev) => ({ ...prev, [field]: value }));
//     };

//     const handleMultiSelectChange = (name, selectedOptions) => {
//         if (name === "teamMembers") {
//             const removed = prevMembers.find(
//                 (prev) => !selectedOptions.some((curr) => curr.value === prev.value)
//             );

//             if (removed && isEdit) {
//                 dispatch(removeMembersFromTeam({ token, id: removed.id }));
//             }

//             setPrevMembers(selectedOptions);
//         }

//         setFormData((prev) => ({ ...prev, [name]: selectedOptions }));
//     };

//     const validateForm = () => {
//         const errors = {}
//         if (!formData.teamName) {
//             errors.teamName = "Team name is required"
//         } else if (!formData.teamLead) {
//             errors.teamLead = "Team lead is required"
//         } else if (!formData.teamMembers.length) {
//             errors.teamMembers = "Team members is required"
//         }

//         if (Object.keys(errors).length) {
//             toast.dismiss()
//             toast.error(Object.values(errors)[0])
//             return false
//         }
//         return true
//     }

//     const handleCloseModal = () => {
//         gsap.to(addTaskModalRef.current, {
//             x: "100%",
//             duration: 0.5,
//             ease: "power3.in",
//             onComplete: () => setIsModalOpen(false),
//         });
//         setFormData({
//             teamName: "",
//             teamLead: "",
//             project: "",
//             teamMembers: [],
//         })

//     }
//     const handleSubmit = () => {
//         if (!validateForm()) return;

//         const payload = {
//             project_team: {
//                 name: formData.teamName,
//                 team_lead_id: formData.teamLead,
//                 // project_management_id: formData.project,
//                 user_ids: formData.teamMembers.map((member) => member.value),
//             },
//         };

//         console.log(payload)

//         if (isEdit) {
//             dispatch(updateProjectTeam({ token, payload, id: projectTeamId }));
//         } else {
//             dispatch(createProjectTeam({ token, payload }));
//         }
//     };

//     useEffect(() => {
//         if (success || editSuccess) {
//             window.location.reload()
//         }
//     }, [success, editSuccess]);

//     return (
//         <div className="fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 z-10 text-[12px]">
//             <div
//                 ref={addTaskModalRef}
//                 className="bg-white py-6 rounded-lg shadow-lg w-1/3 relative h-full right-0"
//             >
//                 <h3 className="text-[14px] font-medium text-center ">
//                     {isEdit ? "Edit Team" : "New team"}
//                 </h3>
//                 <CloseIcon
//                     className="absolute top-[26px] right-8 cursor-pointer"
//                     onClick={handleCloseModal}
//                 />

//                 <hr className="border border-[#E95420] my-4" />

//                 <div className="flex flex-col gap-5 text-[12px] p-4">
//                     <div className="flex flex-col gap-2">
//                         <label>
//                             Team Name<span>*</span>
//                         </label>
//                         <input
//                             name="teamName"
//                             value={formData.teamName}
//                             onChange={handleChange}
//                             placeholder="Enter Matrix Title"
//                             className="w-full border-[0.5px] border-[#C0C0C0] p-2"
//                         />
//                     </div>
//                     <div className="flex flex-col gap-2">
//                         <label>
//                             Team Lead<span>*</span>
//                         </label>
//                         <SelectBox
//                             placeholder="Select team Lead"
//                             value={formData.teamLead}
//                             onChange={(value) => handleSelectChange("teamLead", value)}
//                             options={users.map((user) => ({
//                                 label: `${user.firstname} ${user.lastname}`,
//                                 value: user.id,
//                             }))}
//                         />
//                     </div>
//                     {/* <div className="flex flex-col gap-2 w-1/2">
//                         <label>
//                             Project<span>*</span>
//                         </label>
//                         <SelectBox
//                             placeholder="Select Project"
//                             value={formData.project}
//                             onChange={(value) => handleSelectChange("project", value)}
//                             options={projects.map((project) => ({
//                                 label: project.title,
//                                 value: project.id,
//                             }))}
//                         />
//                     </div> */}
//                     <div className="flex flex-col gap-2">
//                         <label>
//                             Team Members<span>*</span>
//                         </label>
//                         <MultiSelectBox
//                             placeholder="Select Team Members"
//                             value={formData.teamMembers}
//                             // onChange={(value) => handleSelectChange("teamMembers", value)}
//                             onChange={values => handleMultiSelectChange("teamMembers", values)}
//                             options={users.map((user) => ({
//                                 label: `${user.firstname} ${user.lastname}`,
//                                 value: user.id,
//                             }))}
//                         />
//                     </div>
//                 </div>

//                 <div className="absolute flex justify-center gap-6 bottom-10 left-[30%] ">
//                     <button
//                         className="bg-[#C72030] text-white px-4 h-[30px] w-[100px]"
//                         onClick={handleSubmit} // Replace with dispatch or save logic
//                     >
//                         {isEdit ? "Update" : "Save"}
//                     </button>
//                     <button
//                         className="border-2 border-[#C72030] text-[#C72030] px-4 h-[30px] w-[100px]"
//                         onClick={handleCloseModal}
//                     >
//                         Cancel
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TeamModal;



import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import CloseIcon from "@mui/icons-material/Close";
import SelectBox from "../../SelectBox";
import MultiSelectBox from "../../MultiSelectBox";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../redux/slices/userSlice";
import {
    createProjectTeam,
    fetchProjects,
    fetchProjectTeam,
    fetchProjectTeams,
    removeMembersFromTeam,
    resetTeamCreateSuccess,
    resetTeamUpdateSuccess,
    updateProjectTeam,
} from "../../../redux/slices/projectSlice";
import toast from "react-hot-toast";

const TeamModal = ({
    isModalOpen,
    setIsModalOpen,
    isEdit = false,
    id = null,
}) => {
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();
    const addTaskModalRef = useRef(null);

    const { fetchUsers: users = [] } = useSelector((state) => state.fetchUsers);
    const { fetchProjectTeam: projectTeam } = useSelector(
        (state) => state.fetchProjectTeam
    );
    const { success } = useSelector((state) => state.createProjectTeam);
    const { success: editSuccess } = useSelector(
        (state) => state.updateProjectTeam
    );

    const [prevMembers, setPrevMembers] = useState([]);
    const [projectTeamId, setProjectTeamId] = useState();
    const [formData, setFormData] = useState({
        teamName: "",
        teamLead: "",
        project: "",
        teamMembers: [],
    });

    // Modal animation
    useGSAP(() => {
        if (isModalOpen) {
            gsap.fromTo(
                addTaskModalRef.current,
                { x: "100%" },
                { x: "0%", duration: 0.5, ease: "power3.out" }
            );
        }
    }, [isModalOpen]);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchUsers({ token })).unwrap();
            } catch (err) {
                toast.error("Error fetching users.");
                console.error(err);
            }
        };

        if (token) fetchData();
    }, [dispatch, token]);

    // Fetch project team if in edit mode
    useEffect(() => {
        if (isEdit && id && token) {
            dispatch(fetchProjectTeam({ token, id }));
        }
    }, [dispatch, id, isEdit, token]);

    // Load project team data into form
    useEffect(() => {
        if (isEdit && projectTeam && users.length > 0) {
            const selectedTeamMembers = projectTeam?.project_team_members?.map((member) => {
                const user = users.find((u) => u.id === member.user_id);
                return {
                    label: user ? `${user.firstname} ${user.lastname}` : "",
                    value: member.user_id,
                    id: member.id,
                };
            }) || [];

            setFormData({
                teamName: projectTeam.name || "",
                teamLead: projectTeam.team_lead_id || "",
                project: projectTeam.project_management_id || "",
                teamMembers: selectedTeamMembers,
            });

            setProjectTeamId(projectTeam.id);
            setPrevMembers(selectedTeamMembers);
        }
    }, [projectTeam, users, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleMultiSelectChange = (name, selectedOptions) => {
        if (name === "teamMembers") {
            const removed = prevMembers.find(
                (prev) => !selectedOptions.some((curr) => curr.value === prev.value)
            );

            if (removed && isEdit) {
                dispatch(removeMembersFromTeam({ token, id: removed.id }));
            }

            setPrevMembers(selectedOptions);
        }

        setFormData((prev) => ({ ...prev, [name]: selectedOptions }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.teamName) {
            errors.teamName = "Team name is required";
        } else if (!formData.teamLead) {
            errors.teamLead = "Team lead is required";
        } else if (!formData.teamMembers.length) {
            errors.teamMembers = "Team members are required";
        }

        if (Object.keys(errors).length) {
            toast.dismiss();
            toast.error(Object.values(errors)[0]);
            return false;
        }

        return true;
    };

    const handleCloseModal = () => {
        gsap.to(addTaskModalRef.current, {
            x: "100%",
            duration: 0.5,
            ease: "power3.in",
            onComplete: () => setIsModalOpen(false),
        });
        setFormData({
            teamName: "",
            teamLead: "",
            project: "",
            teamMembers: [],
        });
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const payload = {
            project_team: {
                name: formData.teamName,
                team_lead_id: formData.teamLead,
                user_ids: formData.teamMembers.map((member) => member.value),
            },
        };

        if (isEdit) {
            dispatch(updateProjectTeam({ token, payload, id: projectTeamId }));
        } else {
            dispatch(createProjectTeam({ token, payload }));
        }
    };

    // Refresh page on success
    useEffect(() => {
        if (success || editSuccess) {
            setIsModalOpen(false);
            toast.dismiss();
            if (success) {
                toast.success("Team created successfully");
                dispatch(resetTeamCreateSuccess())
            } else {
                toast.success("Team updated successfully");
                dispatch(resetTeamUpdateSuccess())
            }
            dispatch(fetchProjectTeams({ token }));

        }
    }, [success, editSuccess]);

    return (
        <div className="fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 z-10 text-[12px]">
            <div
                ref={addTaskModalRef}
                className="bg-white py-6 rounded-lg shadow-lg w-1/3 relative h-full right-0"
            >
                <h3 className="text-[14px] font-medium text-center">
                    {isEdit ? "Edit Team" : "New team"}
                </h3>
                <CloseIcon
                    className="absolute top-[26px] right-8 cursor-pointer"
                    onClick={handleCloseModal}
                />

                <hr className="border border-[#E95420] my-4" />

                <div className="flex flex-col gap-5 text-[12px] p-4">
                    <div className="flex flex-col gap-2">
                        <label>Team Name<span className="text-red-500">*</span></label>
                        <input
                            name="teamName"
                            value={formData.teamName}
                            onChange={handleChange}
                            placeholder="Enter Matrix Title"
                            className="w-full border-[0.5px] border-[#C0C0C0] p-2"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Team Lead<span className="text-red-500">*</span></label>
                        <SelectBox
                            placeholder="Select team Lead"
                            value={formData.teamLead}
                            onChange={(value) => handleSelectChange("teamLead", value)}
                            options={users.map((user) => ({
                                label: `${user.firstname} ${user.lastname}`,
                                value: user.id,
                            }))}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Team Members<span className="text-red-500">*</span></label>
                        <MultiSelectBox
                            placeholder="Select Team Members"
                            value={formData.teamMembers}
                            onChange={(values) => handleMultiSelectChange("teamMembers", values)}
                            options={users.map((user) => ({
                                label: `${user.firstname} ${user.lastname} (${user.email})`,
                                value: user.id,
                            }))}
                        />
                    </div>
                </div>

                <div className="absolute flex justify-center gap-6 bottom-10 left-[30%]">
                    <button
                        className="bg-[#C72030] text-white px-4 h-[30px] w-[100px]"
                        onClick={handleSubmit}
                    >
                        {isEdit ? "Update" : "Save"}
                    </button>
                    <button
                        className="border-2 border-[#C72030] text-[#C72030] px-4 h-[30px] w-[100px]"
                        onClick={handleCloseModal}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamModal;
