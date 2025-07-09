import {
  useState,
  useEffect,
  useMemo,
  useRef,
  Fragment,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import StatusBadge from "../../Projects/statusBadge";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import {
  ChevronDownIcon as HUIDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/20/solid";
import SelectBox from "../../../SelectBox";
import {
  fetchTasks,
  createSubTask,
  updateTask,
  changeTaskStatus,
} from "../../../../redux/slices/taskSlice";
import { fetchUsers } from "../../../../redux/slices/userSlice";
import { fetchTags } from "../../../../redux/slices/tagsSlice";
import { fetchProjectTeamMembers } from "../../../../redux/slices/projectSlice";

const UserCustomDropdownMultiple = ({
  options = [],
  value = [],
  onChange,
  onKeyDownHandler,
  placeholder = "Select options...",
  searchPlaceholder = "Search options...",
  validator,
}) => {
  const [selectedOptions, setSelectedOptions] = useState(value);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSelectedOptions(Array.isArray(value) ? value : []);
  }, [value]);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleListboxChange = (newSelectionArray) => {
    setSelectedOptions(newSelectionArray);
    if (onChange) {
      onChange(newSelectionArray);
    }
  };
  return (
    <div
      className="relative w-full text-xs"
      onKeyDown={onKeyDownHandler}
      tabIndex={-1}
    >
      <Listbox
        value={selectedOptions}
        onChange={handleListboxChange}
        multiple
        name="custom-multi-select"
      >
        <div className="relative rounded-md shadow-sm">
          <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-opacity-75 sm:text-sm min-h-[40px] flex flex-wrap items-center gap-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <span
                  key={option}
                  className="border-2 border-red-400 rounded-full px-2 py-0.5 text-xs whitespace-nowrap"
                >
                  {option}
                </span>
              ))
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <HUIDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>
          <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-xs z-50">
            <div className="sticky top-0 bg-white px-2 py-1 border-b border-gray-200 m-1">
              <div className="flex items-center border border-gray-300 rounded-md p-1">
                <SearchOutlinedIcon
                  style={{ color: "red" }}
                  className="mr-2 h-4 w-4"
                />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="w-full text-xs focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <ListboxOption
                  key={option}
                  className={({ active, selected }) =>
                    `relative cursor-default select-none py-2 pl-3 pr-4 text-xs ${active ? "bg-[#C72030] text-white" : "text-gray-900"
                    } ${selected ? "font-semibold" : "font-normal"}`
                  }
                  value={option}
                >
                  {({ selected: isSelected }) => (
                    <span
                      className={`block truncate ${isSelected ? "font-semibold" : "font-normal"
                        }`}
                    >
                      {option}
                    </span>
                  )}
                </ListboxOption>
              ))
            ) : (
              <div className="text-gray-500 px-3 py-2">No options found</div>
            )}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
};

const NewSubtaskTextField = ({
  value,
  onChange,
  onEnterPress,
  inputRef,
  placeholder,
  validator,
}) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onEnterPress();
    }
  };
  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      className={`w-full p-1 ${validator ? "border border-red-500" : "border border-gray-300"
        } focus:outline-none rounded text-sm`}
    />
  );
};

const DateEditor = ({
  value: propValue,
  onUpdate,
  isNewRow,
  onEnterPress,
  className,
  placeholder = "Select date",
  validator,
  min,
  max,
}) => {
  const [date, setDate] = useState(
    propValue ? new Date(propValue).toISOString().split("T")[0] : ""
  );
  const inputRef = useRef(null);

  useEffect(() => {
    const initialDate = propValue
      ? new Date(propValue).toISOString().split("T")[0]
      : "";
    setDate(initialDate);
  }, [propValue]);

  const performUpdate = (dateValue) => {
    onUpdate(dateValue || null);
  };

  const handleInputChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    performUpdate(newDate);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performUpdate(date);
      if (onEnterPress) {
        onEnterPress();
      }
    }
  };

  const handleBlur = () => {
    performUpdate(date);
  };

  const handleInputClick = () => {
    if (inputRef.current && typeof inputRef.current.showPicker === "function") {
      try {
        inputRef.current.showPicker();
      } catch (error) {
        console.error("Error trying to show picker:", error);
      }
    }
  };

  const isInvalid = typeof validator === "function" ? !validator(date) : false;

  return (
    <input
      ref={inputRef}
      type="date"
      value={date}
      min={min}
      max={max}
      onChange={handleInputChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={handleInputClick}
      className={`${isInvalid ? "border border-red-400" : "border-none"
        } w-full focus:outline-none rounded text-[12px] p-1 my-custom-date-editor ${className || ""
        }`}
      placeholder={placeholder}
    />
  );
};

const globalPriorityOptions = ["None", "Low", "Medium", "High", "Urgent"];
const globalStatusOptions = ["open", "in_progress", "completed", "on_hold"];

const calculateDuration = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) {
    return "0d:0h:0m";
  }
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (end < start) return "Invalid: End date before start date";

  const ms = end - start;
  const totalMinutes = Math.floor(ms / (1000 * 60));
  const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  return `${days}d : ${hours}h : ${minutes}m`;
};

const SubtaskTable = ({ projectId }) => {
  const token = localStorage.getItem("token");
  const { mid = "", tid: parentId } = useParams();
  const dispatch = useDispatch();

  const {
    fetchTasks: allTasksFromStore,
    loading: loadingAllTasks,
    error: allTasksError,
  } = useSelector((state) => state.fetchTasks);

  const {
    fetchUsers: users,
    loading: loadingUsers,
    error: usersFetchError,
  } = useSelector(
    (state) => state.fetchUsers || { users: [], loading: false, error: null }
  );

  const { fetchProjectTeamMembers: projectTeamMembers } = useSelector(state => state.fetchProjectTeamMembers)

  const {
    fetchTags: tagList,
    loading: loadingTags,
    error: tagsError,
  } = useSelector(
    (state) => state.fetchTags || { tagList: [], loading: false, error: null }
  );

  const [data, setData] = useState([]);
  const [parentTaskForSubtasks, setParentTaskForSubtasks] = useState(null);
  const [parentTaskLookupStatus, setParentTaskLookupStatus] = useState("idle");

  const [isAddingNewSubtask, setIsAddingNewSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newSubtaskStatus, setNewSubtaskStatus] = useState("open");
  const [newSubtaskResponsiblePersonId, setNewSubtaskResponsiblePersonId] =
    useState(null);
  const [newSubtaskStartDate, setNewSubtaskStartDate] = useState("");
  const [newSubtaskEndDate, setNewSubtaskEndDate] = useState("");
  const [newSubtaskPriority, setNewSubtaskPriority] = useState("None");
  const [newSubtaskTags, setNewSubtaskTags] = useState([]);
  const [isSavingSubtask, setIsSavingSubtask] = useState(false);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [validator, setValidator] = useState(false);

  const newSubtaskTitleInputRef = useRef(null);
  const newTaskFormRowRef = useRef(null);
  const userFetchInitiatedRef = useRef(false);
  const allTasksFetchInitiatedRef = useRef(false);
  const tagsFetchInitiatedRef = useRef(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        await dispatch(fetchProjectTeamMembers({ token, id: projectId })).unwrap();
      } catch (error) {
        console.error("Failed to fetch team members:", error);
      }
    };

    if (projectId) {
      fetchMembers();
    }
  }, [dispatch, token, projectId]);


  const handleOnChange = useCallback(
    async (taskId, fieldName, newValue) => {
      if (isUpdatingTask) return;
      let payload;
      if (fieldName === "task_tag_ids") {
        const selectedTagIds = newValue
          .map((tagName) => {
            const foundTag = Array.isArray(tagList)
              ? tagList.find((tag) => tag.name === tagName)
              : null;
            return foundTag ? foundTag.id : null;
          })
          .filter((id) => id !== null);
        payload = { [fieldName]: selectedTagIds };
      } else {
        payload = { [fieldName]: newValue };
      }
      setIsUpdatingTask(true);
      setLocalError(null);
      try {
        if (fieldName === "status") {
          await dispatch(
            changeTaskStatus({ token, id: taskId, payload })
          ).unwrap();
        } else {
          await dispatch(updateTask({ token, id: taskId, payload })).unwrap();
        }
        await dispatch(fetchTasks({ token, id: mid })).unwrap();
      } catch (error) {
        console.error(
          `Task field update failed for ${taskId} (${fieldName}):`,
          error
        );
        setLocalError(
          `Update failed: ${error?.response?.data?.errors || error?.message || "Server error"
          }`
        );
        dispatch(fetchTasks({ token, id: mid }));
      } finally {
        setIsUpdatingTask(false);
      }
    },
    [dispatch, isUpdatingTask, token, mid, tagList]
  );

  useEffect(() => {
    if (
      !loadingAllTasks &&
      (!allTasksFromStore ||
        !Array.isArray(allTasksFromStore) ||
        allTasksFromStore.length === 0) &&
      !allTasksError &&
      !allTasksFetchInitiatedRef.current
    ) {
      dispatch(fetchTasks({ token, id: mid }));
      allTasksFetchInitiatedRef.current = true;
    } else if (allTasksFromStore || allTasksError) {
      allTasksFetchInitiatedRef.current = true;
    }
  }, [dispatch, allTasksFromStore, loadingAllTasks, allTasksError, token, mid]);

  useEffect(() => {
    if (
      !loadingUsers &&
      (!Array.isArray(users) || users.length === 0) &&
      !usersFetchError &&
      !userFetchInitiatedRef.current
    ) {
      dispatch(fetchUsers({ token }));
      userFetchInitiatedRef.current = true;
    } else if ((Array.isArray(users) && users.length > 0) || usersFetchError) {
      userFetchInitiatedRef.current = true;
    }
  }, [dispatch, users, loadingUsers, usersFetchError, token]);

  useEffect(() => {
    if (
      !loadingTags &&
      (!Array.isArray(tagList) || tagList.length === 0) &&
      !tagsError &&
      !tagsFetchInitiatedRef.current
    ) {
      dispatch(fetchTags({ token }));
      tagsFetchInitiatedRef.current = true;
    } else if ((Array.isArray(tagList) && tagList.length > 0) || tagsError) {
      tagsFetchInitiatedRef.current = true;
    }
  }, [dispatch, tagList, loadingTags, tagsError, token]);

  useEffect(() => {
    if (loadingAllTasks) {
      setParentTaskLookupStatus("loading");
      return;
    }
    if (allTasksError) {
      setParentTaskLookupStatus("error");
      setLocalError("Failed to load tasks to find the parent.");
      return;
    }
    if (
      allTasksFromStore &&
      Array.isArray(allTasksFromStore) &&
      allTasksFromStore.length > 0 &&
      parentId
    ) {
      const foundTask = allTasksFromStore.find(
        (task) => String(task.id) === String(parentId)
      );
      if (foundTask) {
        setParentTaskForSubtasks(foundTask);
        setParentTaskLookupStatus("found");
        if (
          foundTask.sub_tasks_managements &&
          Array.isArray(foundTask.sub_tasks_managements)
        ) {
          const processedSubtasks = foundTask.sub_tasks_managements.map(
            (sub) => ({
              id: sub.id,
              taskTitle: sub.title || "Unnamed Subtask",
              status: sub.status || "open",
              responsiblePerson: sub.responsible_person?.name || "Unassigned",
              responsiblePersonId: sub.responsible_person?.id || null,
              startDate: sub.started_at
                ? new Date(sub.started_at).toLocaleDateString("en-CA")
                : null,
              endDate: sub.target_date
                ? new Date(sub.target_date).toLocaleDateString("en-CA")
                : null,
              duration: calculateDuration(sub.started_at, sub.target_date),
              priority: sub.priority || "None",
              tags: (sub.task_tags || []).map((tag) => tag.company_tag.name),
            })
          );
          setData(processedSubtasks);
        } else {
          setData([]);
        }
        setLocalError(null);
      } else {
        setParentTaskForSubtasks(null);
        setParentTaskLookupStatus("not_found");
        setData([]);
        setLocalError(`Parent task with ID ${parentId} not found.`);
      }
    } else if (!loadingAllTasks && allTasksFromStore && parentId) {
      setParentTaskLookupStatus("not_found");
      setData([]);
      setLocalError(`Parent task with ID ${parentId} not found.`);
    }
  }, [allTasksFromStore, parentId, loadingAllTasks, allTasksError]);

  useEffect(() => {
    if (isAddingNewSubtask && newSubtaskTitleInputRef.current) {
      newSubtaskTitleInputRef.current.focus();
    }
  }, [isAddingNewSubtask]);

  const resetNewSubtaskForm = useCallback(() => {
    setNewSubtaskTitle("");
    setNewSubtaskStatus("open");
    setNewSubtaskResponsiblePersonId(null);
    setNewSubtaskStartDate("");
    setNewSubtaskEndDate("");
    setNewSubtaskPriority("None");
    setNewSubtaskTags([]);
    setLocalError(null);
    setValidator(false);
  }, []);

  const handleShowNewSubtaskForm = useCallback(() => {
    if (!parentTaskForSubtasks) {
      setLocalError("Parent task not loaded. Cannot add subtask.");
      return;
    }
    resetNewSubtaskForm();
    setIsAddingNewSubtask(true);
  }, [parentTaskForSubtasks, resetNewSubtaskForm]);

  const handleCancelNewSubtask = useCallback(() => {
    setIsAddingNewSubtask(false);
    resetNewSubtaskForm();
  }, [resetNewSubtaskForm]);

  const handleSaveNewSubtask = useCallback(async () => {
    if (
      !newSubtaskTitle?.trim() ||
      !newSubtaskStartDate ||
      !newSubtaskEndDate
    ) {
      setLocalError("Please fill out all required fields.");
      setValidator(true);
      newSubtaskTitleInputRef.current?.focus();
      return;
    }

    const start = new Date(newSubtaskStartDate);
    const end = new Date(newSubtaskEndDate);
    const parentStart = parentTaskForSubtasks?.started_at
      ? new Date(parentTaskForSubtasks.started_at)
      : new Date();
    const parentEnd = parentTaskForSubtasks?.target_date
      ? new Date(parentTaskForSubtasks.target_date)
      : null;


    if (parentEnd && start > parentEnd) {
      setLocalError("Subtask start date cannot be after parent task end date");
      setValidator(true);
      return;
    }
    if (end < start) {
      setLocalError("Subtask end date cannot be before start date");
      setValidator(true);
      return;
    }
    if (parentEnd && end > parentEnd) {
      setLocalError("Subtask end date cannot be after parent task end date");
      setValidator(true);
      return;
    }

    setLocalError(null);
    setValidator(false);
    setIsSavingSubtask(true);

    const selectedTagIds = newSubtaskTags
      .map((tagName) => {
        const foundTag = Array.isArray(tagList)
          ? tagList.find((tag) => tag.name === tagName)
          : null;
        return foundTag ? foundTag.id : null;
      })
      .filter((id) => id !== null);

    const subtaskPayload = {
      parent_id: parentId,
      title: newSubtaskTitle.trim(),
      status: newSubtaskStatus,
      responsible_person_id: newSubtaskResponsiblePersonId,
      project_management_id: parentTaskForSubtasks?.project_management_id || 2,
      started_at: newSubtaskStartDate || null,
      target_date: newSubtaskEndDate || null,
      priority: newSubtaskPriority,
      task_tag_ids: selectedTagIds,
    };

    try {
      await dispatch(
        createSubTask({ token, payload: subtaskPayload })
      ).unwrap();
      await dispatch(fetchTasks({ token, id: mid }));
      setIsAddingNewSubtask(false);
      resetNewSubtaskForm();
    } catch (error) {
      console.error("Failed to create subtask:", error);
      const errorMessage =
        error?.message ||
        (typeof error === "string" ? error : "Failed to save subtask.");
      setLocalError(errorMessage);
    } finally {
      setIsSavingSubtask(false);
    }
  }, [
    dispatch,
    parentId,
    parentTaskForSubtasks,
    resetNewSubtaskForm,
    newSubtaskTitle,
    newSubtaskStatus,
    newSubtaskResponsiblePersonId,
    newSubtaskStartDate,
    newSubtaskEndDate,
    newSubtaskPriority,
    newSubtaskTags,
    tagList,
    token,
    mid,
  ]);

  const handleDeleteExistingSubtask = useCallback((subtaskId) => {
    alert(
      `API for deleting existing subtask ${subtaskId} needs to be implemented.`
    );
  }, []);

  useEffect(() => {
    const handleClickOutsideNewSubtaskRow = (event) => {
      if (
        !isAddingNewSubtask ||
        isSavingSubtask ||
        !newTaskFormRowRef.current ||
        newTaskFormRowRef.current.contains(event.target)
      ) {
        return;
      }
      handleSaveNewSubtask();
    };

    if (isAddingNewSubtask) {
      document.addEventListener("mousedown", handleClickOutsideNewSubtaskRow);
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutsideNewSubtaskRow
      );
    };
  }, [
    isAddingNewSubtask,
    isSavingSubtask,
    newSubtaskTitle,
    handleSaveNewSubtask,
    resetNewSubtaskForm,
  ]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (!isAddingNewSubtask) return;
      if (event.key === "Escape") {
        console.log("Escape key pressed!");
        handleCancelNewSubtask();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isAddingNewSubtask, handleCancelNewSubtask]);

  const userOptionsForSelectBox = useMemo(
    () => [
      ...(Array.isArray(projectTeamMembers)
        ? projectTeamMembers.map((u) => ({
          value: u.user_id,
          label: u?.user?.name,
        }))
        : []),
    ],
    [projectTeamMembers]
  );

  const tagNamesForDropdown = useMemo(() => {
    return Array.isArray(tagList) ? tagList.map((tag) => tag.name) : [];
  }, [tagList]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
        cell: ({ getValue }) => (
          <span className="text-xs text-gray-500 px-1">
            {getValue().toString().slice(-5)}
          </span>
        ),
      },
      {
        accessorKey: "taskTitle",
        header: "Subtask Title",
        size: 250,
        cell: ({ getValue, row }) => {
          const [editTitle, setEditTitle] = useState(getValue());
          return (
            <NewSubtaskTextField
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onEnterPress={() =>
                handleOnChange(row.original.id, "title", editTitle)
              }
            />
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
        cell: ({ getValue, row }) => (
          <StatusBadge
            status={getValue()}
            statusOptions={globalStatusOptions}
            onStatusChange={(newStatus) =>
              handleOnChange(row.original.id, "status", newStatus)
            }
          />
        ),
      },
      {
        accessorKey: "responsiblePersonId",
        header: "Responsible Person",
        size: 180,
        cell: ({ getValue, row }) => (
          <SelectBox
            options={userOptionsForSelectBox}
            value={getValue()}
            onChange={(newValue) =>
              handleOnChange(row.original.id, "responsible_person_id", newValue)
            }
            placeholder="Select Person..."
            table={true}
            className="w-full"
          />
        ),
      },
      {
        accessorKey: "startDate",
        header: "Start Date",
        size: 160,
        cell: ({ getValue, row }) => (
          <DateEditor
            value={getValue()}
            onUpdate={(date) =>
              handleOnChange(row.original.id, "started_at", date)
            }
            min={
              parentTaskForSubtasks?.started_at
                ? new Date(parentTaskForSubtasks.started_at)
                  .toISOString()
                  .split("T")[0]
                : new Date().toISOString().split("T")[0]
            }
            max={
              parentTaskForSubtasks?.target_date
                ? new Date(parentTaskForSubtasks.target_date)
                  .toISOString()
                  .split("T")[0]
                : undefined
            }
          />
        ),
      },
      {
        accessorKey: "endDate",
        header: "End Date",
        size: 160,
        cell: ({ getValue, row }) => (
          <DateEditor
            value={getValue()}
            onUpdate={(date) =>
              handleOnChange(row.original.id, "target_date", date)
            }
            min={row.original.startDate}
            max={
              parentTaskForSubtasks?.target_date
                ? new Date(parentTaskForSubtasks.target_date)
                  .toISOString()
                  .split("T")[0]
                : undefined
            }
          />
        ),
      },
      {
        accessorKey: "duration",
        header: "Duration",
        size: 100,
        cell: (info) => <span className="text-xs p-1">{info.getValue()}</span>,
      },
      {
        accessorKey: "priority",
        header: "Priority",
        size: 150,
        cell: ({ getValue, row }) => (
          <StatusBadge
            status={getValue()}
            statusOptions={globalPriorityOptions}
            onStatusChange={(newStatus) =>
              handleOnChange(row.original.id, "priority", newStatus)
            }
          />
        ),
      },
      {
        accessorKey: "tags",
        header: "Tags",
        size: 200,
        cell: ({ getValue, row }) => (
          <UserCustomDropdownMultiple
            value={getValue()}
            options={tagNamesForDropdown}
            onChange={(newTags) =>
              handleOnChange(row.original.id, "task_tag_ids", newTags)
            }
            placeholder="Select Tags"
            searchPlaceholder="Search tags..."
          />
        ),
      },
    ],
    [
      handleOnChange,
      parentTaskForSubtasks,
      userOptionsForSelectBox,
      tagNamesForDropdown,
    ]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const newSubtaskDuration = useMemo(
    () => calculateDuration(newSubtaskStartDate, newSubtaskEndDate),
    [newSubtaskStartDate, newSubtaskEndDate]
  );

  let pageContent;
  if (isUpdatingTask) {
    pageContent = (
      <div className="p-4 flex justify-center items-center min-h-[200px]">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-gray-500 mr-2" />{" "}
        Updating data...
      </div>
    );
  } else if (
    parentTaskLookupStatus === "loading" ||
    (loadingAllTasks && !allTasksFetchInitiatedRef.current) ||
    (loadingUsers && !userFetchInitiatedRef.current) ||
    (loadingTags && !tagsFetchInitiatedRef.current)
  ) {
    pageContent = (
      <div className="p-4 flex justify-center items-center min-h-[200px]">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-gray-500 mr-2" />{" "}
        Loading data...
      </div>
    );
  } else if (
    parentTaskLookupStatus === "error" ||
    allTasksError ||
    usersFetchError ||
    tagsError
  ) {
    pageContent = (
      <div className="p-4 text-red-600 rounded">
        Error:{" "}
        {localError ||
          String(
            allTasksError?.message ||
            allTasksError ||
            usersFetchError?.message ||
            usersFetchError ||
            tagsError?.message ||
            tagsError ||
            "Could not load required data."
          )}
      </div>
    );
  } else if (parentTaskLookupStatus === "not_found") {
    pageContent = (
      <div className="p-4 text-center text-gray-600">
        Parent task (ID: {parentId}) not found.
      </div>
    );
  } else if (parentTaskLookupStatus === "found") {
    pageContent = (
      <>
        {localError && !isAddingNewSubtask && (
          <div className="mb-4 p-2 text-red-700 text-sm">{localError}</div>
        )}
        {localError && isAddingNewSubtask && (
          <div className="my-2 p-2 text-red-700 text-sm">{localError}</div>
        )}
        <div className="overflow-x-auto h-[400px]">
          <table className="w-full border-collapse border text-sm bg-white">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        width: header.getSize()
                          ? `${header.getSize()}px`
                          : undefined,
                      }}
                      className="border p-2 text-center text-gray-700 font-semibold"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`border p-0 align-middle ${cell.column.id === "actions"
                        ? "text-center"
                        : "text-left"
                        }`}
                    >
                      <div className="p-1 h-full flex items-center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
              {isAddingNewSubtask && (
                <tr ref={newTaskFormRowRef}>
                  <td className="border p-1 text-xs text-gray-400 align-middle">
                    NEW
                  </td>
                  <td className="border p-1 align-middle">
                    <NewSubtaskTextField
                      inputRef={newSubtaskTitleInputRef}
                      value={newSubtaskTitle}
                      onChange={(e) => {
                        setNewSubtaskTitle(e.target.value);
                        if (localError) setLocalError(null);
                      }}
                      onEnterPress={handleSaveNewSubtask}
                      placeholder="Subtask title"
                      validator={!newSubtaskTitle?.trim()}
                    />
                  </td>
                  <td className="border p-1 align-middle">
                    <StatusBadge
                      status={newSubtaskStatus}
                      statusOptions={globalStatusOptions}
                      onStatusChange={setNewSubtaskStatus}
                    />
                  </td>
                  <td className="border p-1 align-middle">
                    <SelectBox
                      options={userOptionsForSelectBox}
                      value={newSubtaskResponsiblePersonId}
                      onChange={setNewSubtaskResponsiblePersonId}
                      placeholder="Select Person..."
                      table={true}
                    />
                  </td>
                  <td className="border p-1 align-middle">
                    <DateEditor
                      value={newSubtaskStartDate}
                      onUpdate={(date) => setNewSubtaskStartDate(date)}
                      onEnterPress={handleSaveNewSubtask}
                      validator={(date) => {
                        if (!date) return false;
                        const start = new Date(date);
                        const parentStart = parentTaskForSubtasks?.started_at
                          ? new Date(parentTaskForSubtasks.started_at)
                          : new Date();
                        const parentEnd = parentTaskForSubtasks?.target_date
                          ? new Date(parentTaskForSubtasks.target_date)
                          : null;
                        return (
                          start >= parentStart &&
                          (!parentEnd || start <= parentEnd) &&
                          (!newSubtaskEndDate ||
                            start <= new Date(newSubtaskEndDate))
                        );
                      }}
                      min={
                        parentTaskForSubtasks?.started_at
                          ? new Date(parentTaskForSubtasks.started_at)
                            .toISOString()
                            .split("T")[0]
                          : new Date().toISOString().split("T")[0]
                      }
                      max={
                        parentTaskForSubtasks?.target_date
                          ? new Date(parentTaskForSubtasks.target_date)
                            .toISOString()
                            .split("T")[0]
                          : undefined
                      }
                    />
                  </td>
                  <td className="border p-1 align-middle">
                    <DateEditor
                      value={newSubtaskEndDate}
                      onUpdate={(date) => setNewSubtaskEndDate(date)}
                      onEnterPress={handleSaveNewSubtask}
                      validator={(date) => {
                        if (!date) return false;
                        const end = new Date(date);
                        const start = newSubtaskStartDate
                          ? new Date(newSubtaskStartDate)
                          : null;
                        const parentEnd = parentTaskForSubtasks?.target_date
                          ? new Date(parentTaskForSubtasks.target_date)
                          : null;
                        return (
                          (!start || end >= start) &&
                          (!parentEnd || end <= parentEnd)
                        );
                      }}
                      min={newSubtaskStartDate}
                      max={
                        parentTaskForSubtasks?.target_date
                          ? new Date(parentTaskForSubtasks.target_date)
                            .toISOString()
                            .split("T")[0]
                          : undefined
                      }
                    />
                  </td>
                  <td className="border p-1 text-xs align-middle">
                    {newSubtaskDuration}
                  </td>
                  <td className="border p-1 align-middle">
                    <StatusBadge
                      status={newSubtaskPriority}
                      statusOptions={globalPriorityOptions}
                      onStatusChange={setNewSubtaskPriority}
                    />
                  </td>
                  <td className="border p-1 align-middle">
                    <UserCustomDropdownMultiple
                      value={newSubtaskTags}
                      options={tagNamesForDropdown}
                      onChange={setNewSubtaskTags}
                      placeholder="Select Tags"
                      searchPlaceholder="Search tags..."
                    />
                  </td>
                </tr>
              )}
              {!isAddingNewSubtask && parentTaskLookupStatus === "found" && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="border p-2 text-left text-[12px]"
                  >
                    <button
                      onClick={handleShowNewSubtaskForm}
                      className="text-red-500 hover:underline text-sm py-1"
                    >
                      Add subtask
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  } else {
    pageContent = (
      <div className="p-4 text-center text-gray-500">
        Please wait or ensure a valid task ID is provided.
      </div>
    );
  }

  return pageContent;
};

export default SubtaskTable;
