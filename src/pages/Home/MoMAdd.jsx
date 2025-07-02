import { Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SelectBox from "../../components/SelectBox";
import { useDispatch, useSelector } from "react-redux";
import { fetchInternalUser, fetchUsers } from "../../redux/slices/userSlice";
import { createMoM, resetMomCreateSuccess } from "../../redux/slices/momSlice";
import { useNavigate } from "react-router-dom";
import { fetchActiveTags } from "../../redux/slices/tagsSlice";
import toast from "react-hot-toast";

const MoMAdd = () => {
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { fetchInternalUser: internalUsers } = useSelector(
        (state) => state.fetchInternalUser
    );
    const { fetchUsers: users } = useSelector((state) => state.fetchUsers);
    const { fetchActiveTags: tags } = useSelector((state) => state.fetchActiveTags);
    const { loading, success } = useSelector((state) => state.createMoM);

    const attachmentRef = useRef();

    const [isExternal, setIsExternal] = useState(false);
    const [entries, setEntries] = useState([{ id: Date.now() }]);
    const [points, setPoints] = useState([{ id: Date.now() }]);
    const [rawDate, setRawDate] = useState("");
    const [rawTime, setRawTime] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        time: "",
        meetingType: "",
        meetingMode: "",
        isInternal: true,
        users: [],
        points: [],
        attachments: [],
    });

    useEffect(() => {
        dispatch(fetchInternalUser({ token }));
        dispatch(fetchUsers({ token }));
        dispatch(fetchActiveTags({ token }));
    }, [dispatch]);

    const handleAddMore = () => {
        setEntries((prev) => [...prev, { id: Date.now() }]);
    };

    const handleDeleteEntry = (id, index) => {
        if (entries.length === 1) {
            toast.error("At least one attendee is required");
            return;
        }
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
        setFormData((prev) => ({
            ...prev,
            users: prev.users.filter((_, i) => i !== index),
        }));
    };

    const updateCombinedDateTime = (newDate, newTime) => {
        if (newDate && newTime) {
            const combined = new Date(`${newDate}T${newTime}`);
            setFormData((prev) => ({
                ...prev,
                date: combined.toISOString(),
            }));
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

    const handleAddPoint = () => {
        const newPoint = {
            description: "",
            raisedBy: "",
            responsiblePerson: "",
            endDate: "",
            isTask: false,
        };
        setPoints((prev) => [...prev, { id: Date.now() }]);
        setFormData((prev) => ({
            ...prev,
            points: [...prev.points, newPoint],
        }));
    };

    const handleDeletePoint = (id, index) => {
        if (points.length === 1) {
            toast.error("At least one discussion point is required");
            return;
        }
        setPoints((prev) => prev.filter((point) => point.id !== id));
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

        if (isExternal) {
            for (let i = 0; i < formData.users.length; i++) {
                const user = formData.users[i];
                if (!user.name?.trim()) {
                    toast.error(`Name is required for attendee ${i + 1}`);
                    return false;
                }
                if (!user.email?.trim()) {
                    toast.error(`Email is required for attendee ${i + 1}`);
                    return false;
                }
                if (!/\S+@\S+\.\S+/.test(user.email)) {
                    toast.error(`Invalid email for attendee ${i + 1}`);
                    return false;
                }
                if (!user.role?.trim()) {
                    toast.error(`Role is required for attendee ${i + 1}`);
                    return false;
                }
                if (!user.organization?.trim()) {
                    toast.error(`Organization is required for attendee ${i + 1}`);
                    return false;
                }
            }
        } else {
            for (let i = 0; i < formData.users.length; i++) {
                const user = formData.users[i];
                if (!user?.value) {
                    toast.error(`Internal user selection is required for attendee ${i + 1}`);
                    return false;
                }
            }
        }

        if (formData.points.length === 0) {
            toast.error("At least one discussion point is required");
            return false;
        }

        for (let i = 0; i < formData.points.length; i++) {
            const point = formData.points[i];
            if (!point.description?.trim()) {
                toast.error(`Description is required for point ${i + 1}`);
                return false;
            }
        }

        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        const payload = {
            title: formData.title,
            meeting_date: formData.date,
            meeting_type: formData.meetingType,
            meeting_mode: formData.meetingMode,
            created_by_id: JSON.parse(localStorage.getItem("user")).id,
            mom_attendees_attributes: [
                ...formData.users.map((user) => ({
                    name: isExternal ? user.name : user.label,
                    email: isExternal ? user.email : user.user?.email,
                    organization: isExternal
                        ? user.organization
                        : user.user?.organization_name,
                    imp_mail: true,
                    role: isExternal ? user.role : user.user?.lock_role?.name,
                    attendees_type: isExternal ? "external" : "internal",
                    attendees_id: JSON.parse(localStorage.getItem("user")).id,
                })),
            ],
            mom_tasks_attributes: [
                ...formData.points.map((point) => ({
                    description: point.description,
                    raised_by: point.raisedBy,
                    responsible_person_id: point.responsiblePerson?.value,
                    responsible_person_name: point.responsiblePerson?.label,
                    responsible_person_type: point.responsiblePerson?.user.user_type,
                    responsible_person_email: point.responsiblePerson?.user.email,
                    target_date: point.endDate,
                    status: "open",
                    save_task: point?.isTask,
                    company_tag_id: point.tag?.value,
                })),
            ],
            attachments: formData.attachments.map((file) => file),
        };

        dispatch(createMoM({ token, payload }));
    };

    useEffect(() => {
        if (success) {
            navigate(-1);
            dispatch(resetMomCreateSuccess());
        }
    }, [success]);

    const isImage = (file) => {
        return file.type.startsWith("image/");
    };

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
                                    const external = e.target.checked;
                                    setIsExternal(external);
                                    setFormData((prev) => ({
                                        ...prev,
                                        isInternal: !external,
                                        users: [],
                                    }));
                                    setEntries([{ id: Date.now() }]);
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

                    <div
                        className={`flex ${isExternal ? "flex-col" : "flex-row gap-4 flex-wrap"
                            } w-full`}
                    >
                        {entries.map((entry, i) => (
                            <div
                                key={entry.id}
                                className="flex items-end gap-5 mt-6 justify-between"
                            >
                                {isExternal ? (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-[12px]">
                                                External User <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full border outline-none border-gray-300 py-2 px-3 text-[12px]"
                                                placeholder="Enter External User Name"
                                                value={formData.users[i]?.name || ""}
                                                onChange={(e) => {
                                                    const updatedUsers = [...formData.users];
                                                    updatedUsers[i] = {
                                                        ...updatedUsers[i],
                                                        name: e.target.value,
                                                    };
                                                    setFormData({ ...formData, users: updatedUsers });
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[12px]">
                                                Email ID <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full border outline-none border-gray-300 py-2 px-3 text-[12px]"
                                                placeholder="Enter Email ID"
                                                value={formData.users[i]?.email || ""}
                                                onChange={(e) => {
                                                    const updatedUsers = [...formData.users];
                                                    updatedUsers[i] = {
                                                        ...updatedUsers[i],
                                                        email: e.target.value,
                                                    };
                                                    setFormData({ ...formData, users: updatedUsers });
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
                                                value={formData.users[i]?.role || ""}
                                                onChange={(e) => {
                                                    const updatedUsers = [...formData.users];
                                                    updatedUsers[i] = {
                                                        ...updatedUsers[i],
                                                        role: e.target.value,
                                                    };
                                                    setFormData({ ...formData, users: updatedUsers });
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[12px]">
                                                Organization <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full border outline-none border-gray-300 py-2 px-3 text-[12px]"
                                                placeholder="Enter Organization"
                                                value={formData.users[i]?.organization || ""}
                                                onChange={(e) => {
                                                    const updatedUsers = [...formData.users];
                                                    updatedUsers[i] = {
                                                        ...updatedUsers[i],
                                                        organization: e.target.value,
                                                    };
                                                    setFormData({ ...formData, users: updatedUsers });
                                                }}
                                            />
                                        </div>
                                        {entries.length > 1 && (
                                            <button
                                                className="text-[#C72030] p-2"
                                                onClick={() => handleDeleteEntry(entry.id, i)}
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
                                                    internalUsers ? internalUsers.map((user) => ({
                                                        value: user.id,
                                                        label: user.firstname + " " + user.lastname,
                                                        user: user,
                                                    })) : []
                                                }
                                                value={formData.users[i]?.value || null}
                                                onChange={(value) => {
                                                    const newUsers = [...formData.users];
                                                    newUsers[i] = value;
                                                    setFormData({ ...formData, users: newUsers });
                                                }}
                                                mom={true}
                                            />
                                            {entries.length > 1 && (
                                                <button
                                                    className="text-[#C72030] p-2"
                                                    onClick={() => handleDeleteEntry(entry.id, i)}
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
                                <label className="text-[12px]">Raised by</label>
                                <input
                                    type="text"
                                    className="w-full border outline-none border-gray-300 py-2 px-3 text-[12px]"
                                    placeholder="Enter name"
                                    value={formData.points[index]?.raisedBy || ""}
                                    onChange={(e) => {
                                        const updatedPoints = [...formData.points];
                                        updatedPoints[index] = {
                                            ...updatedPoints[index],
                                            raisedBy: e.target.value,
                                        };
                                        setFormData({ ...formData, points: updatedPoints });
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px]">End Date</label>
                                <input
                                    type="date"
                                    className="w-full border outline-none border-gray-300 py-2 px-3 text-[12px]"
                                    value={formData.points[index]?.endDate || ""}
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
                                <label className="text-[12px]">Responsible Person</label>
                                <SelectBox
                                    options={
                                        users ? users.map((user) => ({
                                            value: user.id,
                                            label: user.firstname + " " + user.lastname,
                                            user: user,
                                        })) : []
                                    }
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
                                <label className="text-[12px]">Tags</label>
                                <SelectBox
                                    options={
                                        tags ? tags.map((tag) => ({
                                            value: tag.id,
                                            label: tag.name,
                                            user: tag,
                                        })) : []
                                    }
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
                                onClick={() => handleDeletePoint(point.id, index)}
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
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                        className="text-[12px] flex items-center justify-center gap-2 text-[#C72030] px-3 py-2 w-40 bg-white border border-[#C72030] mt-4 mb-6"
                        onClick={() => attachmentRef.current.click()}
                    >
                        Attach Files
                    </button>
                    <input
                        ref={attachmentRef}
                        type="file"
                        onChange={(e) => {
                            const files = Array.from(e.target.files);
                            const updatedAttachments = [...formData.attachments, ...files];
                            setFormData({ ...formData, attachments: updatedAttachments });
                        }}
                        multiple
                        hidden
                    />
                </div>

                <hr className="border border-dashed border-[#C72030]" />

                <div className="mt-6 flex justify-center">
                    <button
                        className="text-[12px] flex items-center justify-center gap-2 text-white px-3 py-2 w-40 bg-red border"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoMAdd;