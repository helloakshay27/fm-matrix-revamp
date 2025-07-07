import { Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInternalUser, fetchUsers } from "../../redux/slices/userSlice";
import { createMoM, resetMomCreateSuccess } from "../../redux/slices/momSlice";
import { fetchActiveTags } from "../../redux/slices/tagsSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SelectBox from "../../components/SelectBox";

const MoMAdd = () => {
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { fetchInternalUser: internalUsers } = useSelector(
        (state) => state.fetchInternalUser
    );
    const { fetchUsers: users } = useSelector((state) => state.fetchUsers);
    const { fetchActiveTags: tags } = useSelector((state) => state.fetchActiveTags);
    const { loading, success, error } = useSelector((state) => state.createMoM);

    const attachmentRef = useRef(null);
    const [isExternal, setIsExternal] = useState(false);
    const [internalEntries, setInternalEntries] = useState([{ id: Date.now() }]);
    const [externalEntries, setExternalEntries] = useState([{ id: Date.now() + 1 }]);
    const [internalAttendees, setInternalAttendees] = useState([null]);
    const [externalAttendees, setExternalAttendees] = useState([{}]);
    const [points, setPoints] = useState([{ id: Date.now() }]);
    const [rawDate, setRawDate] = useState("");
    const [rawTime, setRawTime] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        time: "",
        meetingType: "",
        meetingMode: "",
        users: [],
        points: [
            {
                description: "",
                raisedBy: null,
                responsiblePerson: null,
                endDate: "",
                isTask: false,
                tag: null,
            },
        ],
        attachments: [],
    });

    // Fetch data on component mount
    useEffect(() => {
        dispatch(fetchInternalUser({ token }));
        dispatch(fetchUsers({ token }));
        dispatch(fetchActiveTags({ token }));
    }, [dispatch]);

    // Handle success navigation and error handling
    useEffect(() => {
        if (success) {
            toast.success("MoM created successfully!");
            navigate(-1);
            dispatch(resetMomCreateSuccess());
        }
        if (error) {
            toast.error("Failed to create MoM. Please try again.");
        }
    }, [success, error, navigate, dispatch]);

    // Sync formData.users with both internal and external attendees
    useEffect(() => {
        const updatedUsers = [
            ...internalAttendees.filter(Boolean),
            ...externalAttendees.filter((u) => u?.name && u?.email),
        ];
        setFormData((prev) => ({ ...prev, users: updatedUsers }));
    }, [internalAttendees, externalAttendees]);

    const updateCombinedDateTime = (newDate, newTime) => {
        if (newDate && newTime) {
            try {
                const combined = new Date(`${newDate}T${newTime}`);
                if (isNaN(combined.getTime())) throw new Error("Invalid date or time");
                setFormData((prev) => ({ ...prev, date: combined.toISOString() }));
            } catch {
                toast.error("Invalid date or time format");
            }
        }
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setRawDate(newDate);
        updateCombinedDateTime(newDate, rawTime);
    };

    const handleTimeChange = (e) => {
        const newTime = e.target.value;
        setRawTime(newTime);
        updateCombinedDateTime(rawDate, newTime);
    };

    const handleAddMore = () => {
        if (isExternal) {
            setExternalEntries((prev) => [...prev, { id: Date.now() }]);
            setExternalAttendees((prev) => [...prev, {}]);
        } else {
            setInternalEntries((prev) => [...prev, { id: Date.now() }]);
            setInternalAttendees((prev) => [...prev, null]);
        }
    };

    const handleDeleteEntry = (index) => {
        if (isExternal) {
            if (externalEntries.length === 1 && internalEntries.length === 0) {
                toast.error("At least one attendee is required");
                return;
            }
            setExternalEntries((prev) => prev.filter((_, i) => i !== index));
            setExternalAttendees((prev) => prev.filter((_, i) => i !== index));
        } else {
            if (internalEntries.length === 1 && externalEntries.length === 0) {
                toast.error("At least one attendee is required");
                return;
            }
            setInternalEntries((prev) => prev.filter((_, i) => i !== index));
            setInternalAttendees((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleAddPoint = () => {
        const newPoint = {
            description: "",
            raisedBy: null,
            responsiblePerson: null,
            endDate: "",
            isTask: false,
            tag: null,
        };
        setPoints((prev) => [...prev, { id: Date.now() }]);
        setFormData((prev) => ({
            ...prev,
            points: [...prev.points, newPoint],
        }));
    };

    const handleDeletePoint = (index) => {
        if (points.length === 1) {
            toast.error("At least one discussion point is required");
            return;
        }
        setPoints((prev) => prev.filter((_, i) => i !== index));
        setFormData((prev) => ({
            ...prev,
            points: prev.points.filter((_, i) => i !== index),
        }));
    };

    const handleDeleteAttachment = (index) => {
        setFormData((prev) => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index),
        }));
    };

    const validateForm = () => {
        toast.dismiss();
        if (!formData.title.trim()) {
            toast.error("Meeting Title is required");
            return false;
        }
        if (!formData.meetingMode) {
            toast.error("Meeting Mode is required");
            return false;
        }
        if (!rawDate) {
            toast.error("Meeting Date is required");
            return false;
        }
        if (!rawTime) {
            toast.error("Meeting Time is required");
            return false;
        }

        if (formData.users.length === 0) {
            toast.error("At least one attendee is required");
            return false;
        }

        for (let i = 0; i < externalAttendees.length; i++) {
            const user = externalAttendees[i];
            if (user?.name || user?.email || user?.role || user?.organization) {
                if (!user?.name?.trim()) {
                    toast.error(`Name is required for external attendee ${i + 1}`);
                    return false;
                }
                if (!user?.email?.trim()) {
                    toast.error(`Email is required for external attendee ${i + 1}`);
                    return false;
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
                    toast.error(`Invalid email format for external attendee ${i + 1}`);
                    return false;
                }
                if (!user?.role?.trim()) {
                    toast.error(`Role is required for external attendee ${i + 1}`);
                    return false;
                }
                if (!user?.organization?.trim()) {
                    toast.error(`Organization is required for external attendee ${i + 1}`);
                    return false;
                }
            }
        }

        for (let i = 0; i < internalAttendees.length; i++) {
            const attendee = internalAttendees[i];
            if (!attendee?.value) {
                toast.error(`Internal attendee ${i + 1} is not selected.`);
                return false;
            }
        }

        if (formData.points.length === 0) {
            toast.error("At least one discussion point is required");
            return false;
        }

        for (let i = 0; i < formData.points.length; i++) {
            const point = formData.points[i];
            if (!point?.description?.trim()) {
                toast.error(`Description is required for point ${i + 1}`);
                return false;
            }
            if (!point?.raisedBy?.value) {
                toast.error(`Raised By is required for point ${i + 1}`);
                return false;
            }
            if (!point?.responsiblePerson?.value) {
                toast.error(`Responsible Person is required for point ${i + 1}`);
                return false;
            }
            if (!point?.endDate) {
                toast.error(`End Date is required for point ${i + 1}`);
                return false;
            }
            if (!point?.tag?.value) {
                toast.error(`Tag is required for point ${i + 1}`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const combinedUsers = [
            ...internalAttendees
                .filter(Boolean)
                .map((u) => ({
                    name: u.label,
                    email: u.user?.email,
                    organization: u.user?.organization_name,
                    imp_mail: true,
                    role: u.user?.lock_role?.name,
                    attendees_type: "internal",
                    attendees_id: JSON.parse(localStorage.getItem("user")).id,
                })),
            ...externalAttendees
                .filter((u) => u?.name && u?.email)
                .map((u) => ({
                    name: u.name,
                    email: u.email,
                    organization: u.organization,
                    imp_mail: true,
                    role: u.role,
                    attendees_type: "external",
                    attendees_id: JSON.parse(localStorage.getItem("user")).id,
                })),
        ];

        const formDataPayload = new FormData();

        formDataPayload.append("mom_detail[title]", formData.title);
        formDataPayload.append("mom_detail[meeting_date]", formData.date);
        formDataPayload.append("mom_detail[meeting_type]", formData.meetingType);
        formDataPayload.append("mom_detail[meeting_mode]", formData.meetingMode);
        formDataPayload.append("mom_detail[created_by_id]", JSON.parse(localStorage.getItem("user")).id);

        combinedUsers.forEach((user, index) => {
            formDataPayload.append(`mom_detail[mom_attendees_attributes][${index}][name]`, user.name);
            formDataPayload.append(`mom_detail[mom_attendees_attributes][${index}][email]`, user.email);
            formDataPayload.append(`mom_detail[mom_attendees_attributes][${index}][organization]`, user.organization || '');
            formDataPayload.append(`mom_detail[mom_attendees_attributes][${index}][imp_mail]`, user.imp_mail);
            formDataPayload.append(`mom_detail[mom_attendees_attributes][${index}][role]`, user.role || '');
            formDataPayload.append(`mom_detail[mom_attendees_attributes][${index}][attendees_type]`, user.attendees_type);
            formDataPayload.append(`mom_detail[mom_attendees_attributes][${index}][attendees_id]`, user.attendees_id);
        });

        formData.points.forEach((point, index) => {
            formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][description]`, point.description || '');
            formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][raised_by]`, point.raisedBy?.label || '');
            formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][responsible_person_id]`, point.responsiblePerson?.value || '');
            formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][responsible_person_name]`, point.responsiblePerson?.label || '');
            formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][responsible_person_type]`, point.responsiblePerson?.user.user_type || '');
            formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][responsible_person_email]`, point.responsiblePerson?.user.email || '');
            formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][target_date]`, point.endDate || '');
            formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][status]`, "open");
            formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][save_task]`, point.isTask);
            formDataPayload.append(`mom_detail[mom_tasks_attributes][${index}][company_tag_id]`, point.tag?.value || '');
        });

        if (formData.attachments?.length > 0) {
            for (let i = 0; i < formData.attachments.length; i++) {
                formDataPayload.append("attachments[]", formData.attachments[i]);
            }
        }

        dispatch(createMoM({ token, payload: formDataPayload }));
    };

    const isImage = (file) => file?.type?.startsWith("image/") || false;

    // Combine internal and external attendees for Raised by SelectBox
    const attendeeOptions = [
        ...internalAttendees
            .filter(Boolean)
            .map((attendee) => ({
                value: attendee.value,
                label: attendee.label,
            })),
        ...externalAttendees
            .filter((u) => u?.name && u?.email)
            .map((attendee) => ({
                value: attendee.email, // Using email as unique value for external attendees
                label: attendee.name,
            })),
    ];

    return (
        <div className="h-full overflow-y-auto no-scrollbar">
            <h3 className="font-medium m-4">New Minutes Of Meeting</h3>
            <hr className="border border-gray-200" />

            <div className="py-4 px-6 w-full">
                <div className="flex items-start gap-10 mb-6">
                    <div className="flex flex-col w-[40%] space-y-4">
                        <div className="space-y-2 w-full">
                            <label className="text-[12px]">
                                Meeting Title <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border outline-none border-gray-300 py-2 px-3 text-[12px]"
                                placeholder="Enter meeting Title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                            />
                        </div>
                        <div className="flex icon-link justify-between gap-8">
                            <div className="space-y-2 w-full">
                                <label className="text-[12px]">Meeting Type</label>
                                <SelectBox
                                    className="w-full"
                                    placeholder="Select Meeting Type"
                                    options={[
                                        { value: "internal", label: "Internal" },
                                        { value: "client", label: "Client" },
                                    ]}
                                    value={formData.meetingType}
                                    onChange={(value) =>
                                        setFormData({ ...formData, meetingType: value })
                                    }
                                />
                            </div>
                            <div className="space-y-2 w-full">
                                <label className="text-[12px]">
                                    Meeting Mode <span className="text-red-500 ml-1">*</span>
                                </label>
                                <SelectBox
                                    className="w-full"
                                    placeholder="Select Meeting Mode"
                                    options={[
                                        { value: "online", label: "Online" },
                                        { value: "offline", label: "Offline" },
                                    ]}
                                    value={formData.meetingMode}
                                    onChange={(value) =>
                                        setFormData({ ...formData, meetingMode: value })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[12px]">
                            Meeting Date <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="date"
                            className="w-full border outline-none border-gray-300 py-2 px-3 text-[12px]"
                            value={rawDate}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={handleDateChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[12px]">
                            Meeting Time <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="time"
                            className="w-full border outline-none border-gray-300 py-2 px-3 text-[12px]"
                            value={rawTime}
                            onChange={handleTimeChange}
                        />
                    </div>
                </div>

                <hr className="border border-dashed border-[#C72030]" />

                <div className="flex items-end gap-4">
                    <div className="flex items-center gap-4 mt-6">
                        <span className="text-[12px]">Internal</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isExternal}
                                onChange={(e) => {
                                    setIsExternal(e.target.checked);
                                }}
                            />
                            <div
                                className={`group peer ${isExternal ? "bg-black" : "bg-[#C72030]"
                                    } rounded-full duration-300 w-10 h-5 ring-2 ${isExternal ? "ring-black" : "ring-[#C72030]"
                                    } after:duration-300 after:bg-white peer-checked:after:bg-white after:rounded-full after:absolute after:h-5 after:w-5 after:top-0 after:left-0 after:flex after:justify-center after:items-center peer-checked:after:translate-x-5 peer-hover:after:scale-95`}
                            />
                        </label>
                        <span className="text-[12px]">Client</span>
                    </div>

                    <div className="flex flex-col w-full">
                        {(isExternal ? externalEntries : internalEntries).map((entry, i) => (
                            <div
                                key={entry.id}
                                className="flex items-end gap-5 mt-6 justify-between"
                            >
                                {isExternal ? (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-[12px]">
                                                External User{" "}
                                                <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full border outline-none border-gray-300 py-2 px-3 text-[12px]"
                                                placeholder="Enter External User Name"
                                                value={externalAttendees[i]?.name || ""}
                                                onChange={(e) => {
                                                    const updated = [...externalAttendees];
                                                    updated[i] = { ...updated[i], name: e.target.value };
                                                    setExternalAttendees(updated);
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[12px]">
                                                Email ID <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                className="w-full border outline-none border-gray-300 py-2 px-3 text-[12px]"
                                                placeholder="Enter Email ID"
                                                value={externalAttendees[i]?.email || ""}
                                                onChange={(e) => {
                                                    const updated = [...externalAttendees];
                                                    updated[i] = { ...updated[i], email: e.target.value };
                                                    setExternalAttendees(updated);
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[12px]">
                                                Role <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full border outline-none border-gray-300 py-2 px-3 text-[12px]"
                                                placeholder="Enter Role"
                                                value={externalAttendees[i]?.role || ""}
                                                onChange={(e) => {
                                                    const updated = [...externalAttendees];
                                                    updated[i] = { ...updated[i], role: e.target.value };
                                                    setExternalAttendees(updated);
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[12px]">
                                                Organization{" "}
                                                <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full border outline-none border-gray-300 py-2 px-3 text-[12px]"
                                                placeholder="Enter Organization"
                                                value={externalAttendees[i]?.organization || ""}
                                                onChange={(e) => {
                                                    const updated = [...externalAttendees];
                                                    updated[i] = {
                                                        ...updated[i],
                                                        organization: e.target.value,
                                                    };
                                                    setExternalAttendees(updated);
                                                }}
                                            />
                                        </div>
                                        {(externalEntries.length > 1) && (
                                            <button
                                                className="text-[#C72030] p-2"
                                                onClick={() => handleDeleteEntry(i)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="space-y-2 w-[300px]">
                                        <label className="text-[12px]">
                                            Select Internal User{" "}
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <SelectBox
                                                className="w-full"
                                                placeholder="Select Internal User"
                                                options={
                                                    internalUsers
                                                        ? internalUsers.map((user) => ({
                                                            value: user.id,
                                                            label: `${user.firstname} ${user.lastname}`,
                                                            user,
                                                        }))
                                                        : []
                                                }
                                                value={internalAttendees[i]?.value || null}
                                                onChange={(value) => {
                                                    const updated = [...internalAttendees];
                                                    updated[i] = value;
                                                    setInternalAttendees(updated);
                                                }}
                                                mom={true}
                                            />
                                            {(internalEntries.length > 1) && (
                                                <button
                                                    className="text-[#C72030] p-2"
                                                    onClick={() => handleDeleteEntry(i)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end mt-5 mb-6">
                    <button
                        className="text-[12px] flex items-center justify-center gap-2 text-[#C72030] px-3 py-2 w-32 bg-white border border-[#C72030]"
                        onClick={handleAddMore}
                    >
                        <Plus size={18} /> Add More
                    </button>
                </div>

                <hr className="border border-dashed border-[#C72030]" />

                {points.map((point, index) => (
                    <div key={point.id} className="flex mt-6 justify-between gap-4">
                        <div className="space-y-2 w-1/2">
                            <label className="text-[12px]">
                                Point {index + 1} <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="flex items-start gap-4 w-full">
                                <textarea
                                    rows={6}
                                    className="w-[70%] border outline-none border-gray-300 py-2 px-3 text-[12px]"
                                    placeholder="Enter description here"
                                    value={formData.points[index]?.description || ""}
                                    onChange={(e) => {
                                        const updatedPoints = [...formData.points];
                                        updatedPoints[index] = {
                                            ...updatedPoints[index],
                                            description: e.target.value,
                                        };
                                        setFormData({ ...formData, points: updatedPoints });
                                    }}
                                />
                                <div className="flex items-center w-max gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.points[index]?.isTask || false}
                                        onChange={(e) => {
                                            const updatedPoints = [...formData.points];
                                            updatedPoints[index] = {
                                                ...updatedPoints[index],
                                                isTask: e.target.checked,
                                            };
                                            setFormData({ ...formData, points: updatedPoints });
                                        }}
                                    />
                                    <label className="text-[12px]">Convert to task</label>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between">
                            <div className="space-y-2">
                                <label className="text-[12px]">
                                    Raised by <span className="text-red-500 ml-1">*</span>
                                </label>
                                <SelectBox
                                    className="w-full"
                                    placeholder="Select Raised By"
                                    options={attendeeOptions}
                                    value={formData.points[index]?.raisedBy?.value || ""}
                                    onChange={(e) => {
                                        const updatedPoints = [...formData.points];
                                        updatedPoints[index] = {
                                            ...updatedPoints[index],
                                            raisedBy: e,
                                        };
                                        setFormData({ ...formData, points: updatedPoints });
                                    }}
                                    mom={true}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px]">
                                    End Date <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="date"
                                    className="w-full border outline-none border-gray-300 py-2 px-3 text-[12px]"
                                    value={formData.points[index]?.endDate || ""}
                                    min={rawDate}
                                    onChange={(e) => {
                                        const updatedPoints = [...formData.points];
                                        updatedPoints[index] = {
                                            ...updatedPoints[index],
                                            endDate: e.target.value,
                                        };
                                        setFormData({ ...formData, points: updatedPoints });
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col justify-between w-1/5">
                            <div className="space-y-2">
                                <label className="text-[12px]">
                                    Responsible Person{" "}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <SelectBox
                                    options={users.map((user) => ({
                                        value: user.id,
                                        label: `${user.firstname} ${user.lastname}`,
                                        user,
                                    }))}
                                    className="w-full"
                                    value={formData.points[index]?.responsiblePerson?.value || ""}
                                    onChange={(e) => {
                                        const updatedPoints = [...formData.points];
                                        updatedPoints[index] = {
                                            ...updatedPoints[index],
                                            responsiblePerson: e,
                                        };
                                        setFormData({ ...formData, points: updatedPoints });
                                    }}
                                    mom={true}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px]">
                                    Tags <span className="text-red-500 ml-1">*</span>
                                </label>
                                <SelectBox
                                    options={tags.map((tag) => ({
                                        value: tag.id,
                                        label: tag.name,
                                        user: tag,
                                    }))}
                                    className="w-full"
                                    value={formData.points[index]?.tag?.value || ""}
                                    onChange={(e) => {
                                        const updatedPoints = [...formData.points];
                                        updatedPoints[index] = {
                                            ...updatedPoints[index],
                                            tag: e,
                                        };
                                        setFormData({ ...formData, points: updatedPoints });
                                    }}
                                    mom={true}
                                />
                            </div>
                        </div>

                        {points.length > 1 && (
                            <button
                                className="text-[#C72030] p-2 self-start"
                                onClick={() => handleDeletePoint(index)}
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                ))}

                <button
                    className="text-[12px] flex items-center justify-center gap-2 text-[#C72030] px-3 py-2 w-40 bg-white border border-[#C72030] mt-4 mb-6"
                    onClick={handleAddPoint}
                >
                    <Plus size={18} /> Add New Point
                </button>

                <hr className="border border-dashed border-[#C72030]" />

                <div className="my-6">
                    <h3 className="text-[14px]">
                        {formData.attachments.length > 0
                            ? `${formData.attachments.length} Document(s) Attached`
                            : "No Documents Attached"}
                    </h3>
                    <span className="text-[#C2C2C2] text-[12px]">
                        Drop or attach relevant documents here
                    </span>

                    {formData.attachments.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
                            {formData.attachments.map((file, index) => (
                                <div
                                    key={index}
                                    className="relative border border-gray-300 rounded p-2 flex flex-col items-center"
                                >
                                    {isImage(file) ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="w-full h-32 object-cover rounded mb-2"
                                        />
                                    ) : (
                                        <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded mb-2">
                                            <span className="text-[12px] text-gray-500">
                                                {file.name.split(".").pop().toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <span
                                        className="text-[12px] text-center truncate w-full"
                                        title={file.name}
                                    >
                                        {file.name}
                                    </span>
                                    <button
                                        className="absolute top-2 right-2 text-[#C72030] p-1"
                                        onClick={() => handleDeleteAttachment(index)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        className="w-max text-[12px] flex items-center justify-center text-[#C72030] px-3 py-2 bg-white border border-[#C72030] mt-4 mb-6"
                        onClick={() => attachmentRef.current.click()}
                    >
                        Attach Files{" "}
                        <span className="text-[10px]">( Max 10 MB )</span>
                    </button>
                    <input
                        ref={attachmentRef}
                        type="file"
                        onChange={(e) => {
                            const files = Array.from(e.target.files);

                            const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
                            if (oversizedFiles.length > 0) {
                                const names = oversizedFiles.map(f => f.name).join(", ");
                                toast.error(`File(s) too large: ${names}. Max 10MB per file.`);
                            }

                            const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
                            if (validFiles.length > 0) {
                                setFormData((prev) => ({
                                    ...prev,
                                    attachments: [...prev.attachments, ...validFiles],
                                }));
                            }

                            attachmentRef.current.value = null;
                        }}
                        multiple
                        hidden
                    />
                </div>

                <hr className="border border-dashed border-[#C72030]" />

                <div className="mt-6 flex justify-center">
                    <button
                        className={`text-[12px] flex items-center justify-center gap-2 text-white px-3 py-2 w-40 bg-red border ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoMAdd;