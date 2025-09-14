import { useEffect, useState, useCallback } from "react";
import Xarrow from "react-xarrows";
import {
  CalendarDays,
  GripHorizontal,
  Play,
  Square,
  Timer,
  User,
  Circle,
  X,
  CircleCheck,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import useDeepCompareEffect from "use-deep-compare-effect";
import { debounce } from "lodash";
import { sprintTitle } from "../../../data/Data";
import Boards from "../Boards";
import TaskCard from "../Task/TaskCard";
import { changeTaskStatus, fetchTasks } from "../../../redux/slices/taskSlice";
import { useDrop } from "react-dnd";
import {
  fetchSpirintById,
  fetchSpirints,
  putSprint,
} from "../../../redux/slices/spirintSlice";
import { useParams } from "react-router-dom";
import TaskSubCard from "../Task/TaskSubCard";

const SprintBoardSection = ({ selectedProject }) => {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const dispatch = useDispatch();
  const [subCardVisibility, setSubCardVisibility] = useState({});
  const [arrowLinks, setArrowLinks] = useState([]);
  const [taskData, setTaskData] = useState([]); // Non-sprint board tasks
  const [sprintBoardTasks, setSprintBoardTasks] = useState([]); // Persistent sprint board tasks
  const taskState = useSelector((state) => state.fetchTasks.fetchTasks);
  const sprintState = useSelector(
    (state) => state.fetchSpirints?.fetchSpirints || []
  );
  const [projects, setProjects] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [countdown, setCountdown] = useState("00d:00h:00m:00s");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = useSelector((state) => state.fetchTasksOfProject);
  const { fetchSpirintById: newSprint } = useSelector(
    (state) => state.fetchSpirintById
  );

  useEffect(() => {
    dispatch(fetchSpirintById({ token, id }));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchTasks({ token }));
    dispatch(fetchSpirints({ token }));
  }, [dispatch]);

  // Initialize taskData and sprintBoardTasks when fetchProjects changes
  useDeepCompareEffect(() => {
    const newTasks = fetchProjects?.fetchTasksOfProject || [];
    // Filter out tasks already in sprintBoardTasks to avoid duplicates
    const nonSprintTasks = newTasks.filter(
      (task) => !sprintBoardTasks.some((sprintTask) => sprintTask.id === task.id)
    );
    setTaskData(nonSprintTasks);
    // Initialize sprintBoardTasks with sprint tasks from newTasks if empty
    if (sprintBoardTasks.length === 0) {
      const initialSprintTasks = newTasks.filter(
        (task) => task.status === "sprint"
      );
      setSprintBoardTasks(initialSprintTasks);
    }
  }, [fetchProjects, sprintBoardTasks]);

  const toggleSubCard = useCallback((taskId) => {
    setSubCardVisibility((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  }, []);

  const updateTaskDataField = useCallback((taskId, fieldName, newValue) => {
    let changed = false;

    // Update sprintBoardTasks if the task is in the sprint board
    setSprintBoardTasks((prev) => {
      const updated = prev.map((task) => {
        if (task.id === taskId) {
          if (task[fieldName] === newValue) return task;
          console.log(`Updating sprint task ${taskId} with ${fieldName}: ${newValue}`);
          changed = true;
          return { ...task, [fieldName]: newValue };
        }
        if (task.sub_tasks_managements) {
          const updatedSubtasks = task.sub_tasks_managements.map((subtask) => {
            if (subtask.id === taskId && subtask[fieldName] !== newValue) {
              console.log(
                `Updating sprint subtask ${taskId} with ${fieldName}: ${newValue}`
              );
              changed = true;
              return { ...subtask, [fieldName]: newValue };
            }
            return subtask;
          });
          if (changed) {
            return { ...task, sub_tasks_managements: updatedSubtasks };
          }
        }
        return task;
      });
      return changed ? updated : prev;
    });

    // Update taskData if the task is not in the sprint board
    setTaskData((prev) => {
      const updated = prev.map((task) => {
        if (task.id === taskId) {
          if (task[fieldName] === newValue) return task;
          console.log(`Updating task ${taskId} with ${fieldName}: ${newValue}`);
          changed = true;
          return { ...task, [fieldName]: newValue };
        }
        if (task.sub_tasks_managements) {
          const updatedSubtasks = task.sub_tasks_managements.map((subtask) => {
            if (subtask.id === taskId && subtask[fieldName] !== newValue) {
              console.log(
                `Updating subtask ${taskId} with ${fieldName}: ${newValue}`
              );
              changed = true;
              return { ...subtask, [fieldName]: newValue };
            }
            return subtask;
          });
          if (changed) {
            return { ...task, sub_tasks_managements: updatedSubtasks };
          }
        }
        return task;
      });
      if (!changed) {
        console.warn(`No task or subtask found with id ${taskId}`);
      }
      return changed ? updated : prev;
    });
  }, []);

  const debouncedUpdateTaskField = useCallback(
    debounce(
      async (
        taskId,
        fieldName,
        newValue,
        isSubtask = false,
        parentTaskId = null
      ) => {
        try {
          await dispatch(
            changeTaskStatus({
              token,
              id: taskId,
              payload: { [fieldName]: newValue },
              isSubtask,
              parentTaskId,
            })
          ).unwrap();
        } catch (error) {
          console.error(`Task update failed for ${taskId}:`, error);
          dispatch(fetchTasks({ token }));
        }
      },
      300
    ),
    [dispatch]
  );

  const ItemTypes = {
    TASK: "TASK",
    SUBTASK: "SUBTASK",
  };

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [ItemTypes.TASK, ItemTypes.SUBTASK],
    drop:
      selectedSprint?.status === "stopped"
        ? (item) => {
          handleDrop(item, "sprint");
        }
        : undefined,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleDrop = useCallback(
    async (item, newStatus) => {
      const { type, id: taskId, fromTaskId } = item;

      if (type === "TASK" || type === "SUBTASK") {
        updateTaskDataField(taskId, "status", newStatus);
      }

      if (newStatus === "sprint" && (type === "TASK" || type === "SUBTASK")) {
        // Find the task or subtask from taskData
        let taskToAdd = taskData.find((task) => task.id === taskId);
        if (!taskToAdd && type === "SUBTASK") {
          taskToAdd = taskData
            .flatMap((task) => task.sub_tasks_managements || [])
            .find((subtask) => subtask.id === taskId);
        }
        if (taskToAdd) {
          // Add to sprintBoardTasks
          setSprintBoardTasks((prev) => {
            if (!prev.some((task) => task.id === taskId)) {
              return [...prev, { ...taskToAdd, status: "sprint" }];
            }
            return prev;
          });
          // Remove from taskData
          setTaskData((prev) =>
            prev.filter((task) => task.id !== taskId).map((task) => ({
              ...task,
              sub_tasks_managements: (task.sub_tasks_managements || []).filter(
                (subtask) => subtask.id !== taskId
              ),
            }))
          );
        }
      } else if (newStatus !== "sprint" && (type === "TASK" || type === "SUBTASK")) {
        // Move from sprintBoardTasks back to taskData
        let taskToRemove = sprintBoardTasks.find((task) => task.id === taskId);
        if (!taskToRemove && type === "SUBTASK") {
          taskToRemove = sprintBoardTasks
            .flatMap((task) => task.sub_tasks_managements || [])
            .find((subtask) => subtask.id === taskId);
        }
        if (taskToRemove) {
          setTaskData((prev) => [...prev, { ...taskToRemove, status: newStatus }]);
          setSprintBoardTasks((prev) =>
            prev.filter((task) => task.id !== taskId).map((task) => ({
              ...task,
              sub_tasks_managements: (task.sub_tasks_managements || []).filter(
                (subtask) => subtask.id !== taskId
              ),
            }))
          );
        }
      }

      if (newStatus !== "sprint") {
        debouncedUpdateTaskField(taskId, "status", newStatus, type === "SUBTASK", fromTaskId);
      }

      // Update sprint with task IDs
      const sprintTaskIds = sprintBoardTasks
        .map((task) => task.id)
        .filter((taskId) => !item || taskId !== item.id); // Exclude the current item if it's being removed
      if (newStatus === "sprint" && (type === "TASK" || type === "SUBTASK")) {
        if (!sprintTaskIds.includes(taskId)) {
          sprintTaskIds.push(taskId);
        }
      }

      if ((type === "TASK" || type === "SUBTASK") && sprintTaskIds.length > 0) {
        const payload = {
          sprint: {
            project_id: selectedProject.id,
          },
          task_ids: sprintTaskIds,
        };

        try {
          await dispatch(putSprint({ token, id, payload })).unwrap();
        } catch (error) {
          console.error("Failed to update sprint:", error);
        }
      }
    },
    [
      taskData,
      sprintBoardTasks,
      debouncedUpdateTaskField,
      selectedSprint,
      id,
      dispatch,
      selectedProject,
    ]
  );

  const handleLink = (sourceId, targetIds = []) => {
    if (targetIds.length === 0) return;

    setArrowLinks((prevLinks) => {
      const areAllLinksActive = targetIds.every((targetId) =>
        prevLinks.some(
          (link) => link.sourceId === sourceId && link.targetId === targetId
        )
      );

      if (areAllLinksActive) {
        return prevLinks.filter(
          (link) =>
            !(link.sourceId === sourceId && targetIds.includes(link.targetId))
        );
      } else {
        const newLinks = targetIds
          .filter(
            (targetId) =>
              !prevLinks.some(
                (link) =>
                  link.sourceId === sourceId && link.targetId === targetId
              )
          )
          .map((targetId) => ({ sourceId, targetId }));
        return [...prevLinks, ...newLinks];
      }
    });
  };

  const buildDependencyArrows = () => {
    const arrows = [];

    arrowLinks.forEach((link) => {
      const sourceNum = parseInt(link.sourceId.replace("task-", ""));
      const targetNum = parseInt(link.targetId.replace("task-", ""));
      const sourceTask = [...taskData, ...sprintBoardTasks].find(
        (t) => t.id === sourceNum
      );
      const targetTask = [...taskData, ...sprintBoardTasks].find(
        (t) => t.id === targetNum
      );

      if (targetTask && Array.isArray(targetTask.predecessor_task)) {
        const flatPredecessors = targetTask.predecessor_task.flat();
        if (flatPredecessors.includes(sourceNum)) {
          arrows.push({
            sourceId: `task-${sourceNum}`,
            targetId: `task-${targetNum}`,
            type: "completed",
          });
        }
      }

      if (sourceTask && Array.isArray(sourceTask.successor_task)) {
        const flatSuccessors = sourceTask.successor_task.flat();
        if (flatSuccessors.includes(targetNum)) {
          arrows.push({
            sourceId: `task-${sourceNum}`,
            targetId: `task-${targetNum}`,
            type: "successor",
          });
        }
      }
    });
    return arrows;
  };

  const dependencyArrows = buildDependencyArrows();
  const allArrows = [
    ...arrowLinks,
    ...dependencyArrows.filter(
      (dep) =>
        !arrowLinks.some(
          (link) =>
            link.sourceId === dep.sourceId && link.targetId === dep.targetId
        )
    ),
  ];

  const getColor = (index) => {
    const colors = [
      "#F9C863",
      "#B4EB77",
      "#B7E0D4",
      "#B3B3FF",
      "#D1A1FF",
      "#D9B1FF",
      "#FF9FBF",
    ];
    return colors[index % colors.length];
  };

  const projectState = useSelector(
    (state) => state.fetchProjects.fetchProjects
  );

  useEffect(() => {
    dispatch(fetchSpirintById({ token, id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (newSprint) {
      setSelectedSprint(newSprint);
    }
  }, [newSprint]);

  const calculateCountdown = useCallback(() => {
    if (
      !selectedSprint?.end_date ||
      selectedSprint?.status === "completed" ||
      selectedSprint?.status === "stopped"
    ) {
      setCountdown("00d:00h:00m:00s");
      return;
    }

    const endDate = new Date(selectedSprint.end_date);
    const now = new Date();
    const timeDiff = endDate - now;

    if (timeDiff <= 0) {
      setCountdown("00d:00h:00m:00s");
      return;
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    setCountdown(
      `${days.toString().padStart(2, "0")}d:${hours
        .toString()
        .padStart(2, "0")}h:${minutes.toString().padStart(2, "0")}m:${seconds
          .toString()
          .padStart(2, "0")}s`
    );
  }, [selectedSprint]);

  useEffect(() => {
    if (selectedSprint?.status === "started") {
      calculateCountdown();
      const interval = setInterval(calculateCountdown, 1000);
      return () => clearInterval(interval);
    } else {
      setCountdown("00d:00h:00m:00s");
    }
  }, [calculateCountdown, selectedSprint?.status]);

  useDeepCompareEffect(() => {
    if (selectedProject === "Kalpataru customer app : Post sales") {
      setProjects([]);
    } else if (selectedProject === "Project Management Revamp") {
      setProjects(projectState);
    } else {
      setProjects(projectState);
    }
  }, [projectState, selectedProject]);

  const contributors = selectedSprint?.contributors || [
    "S",
    "A",
    "B",
    "M",
    "K",
    "D",
    "CB",
  ];

  const handleIconClick = useCallback(
    debounce(async (newStatus) => {
      if (!id) {
        return;
      }
      const payload = { status: newStatus };
      try {
        const response = await dispatch(putSprint({ token, id, payload })).unwrap();
        setSelectedSprint((prev) => ({
          ...prev,
          status: newStatus,
        }));
        if (newStatus === "stopped" || newStatus === "completed") {
          setCountdown("00d:00h:00m:00s");
        }
      } catch (error) {
        console.error("Failed to update sprint status:", error);
        dispatch(fetchSpirints({ token }));
      }
    }, 300),
    [id, dispatch]
  );

  const handlePlayClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmStart = () => {
    setIsModalOpen(false);
    handleIconClick("started");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const ConfirmationModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-[500px]">
          <div className="flex justify-end p-4">
            <button onClick={handleCancel}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="text-center px-8 pb-6">
            <p className="text-sm text-black">
              Are you sure you want to start this sprint. <br />
              You cannot add or remove tasks from sprint bucket later.
            </p>
          </div>
          <div className="bg-gray-200 py-4 flex justify-center gap-4">
            <button
              onClick={handleConfirmStart}
              className="border border-red-500 text-black px-6 py-2"
            >
              Yes
            </button>
            <button
              onClick={handleCancel}
              className="border border-red-500 text-black px-6 py-2"
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {isModalOpen && <ConfirmationModal />}
      <div
        className="h-[80%] mx-3 my-3 flex items-start gap-1 max-w-full overflow-x-auto overflow-y-auto flex-nowrap"
        style={{ height: "75vh" }}
      >
        <div
          className="flex flex-col gap-2 h-full overflow-y-auto no-scrollbar"
          style={{ minWidth: "300px" }}
        >
          <div className="bg-[#DEE6E8] rounded-md px-3 py-4 flex flex-col gap-5 h-full">
            <div className="w-full relative">
              <h3
                className="text-white py-2 px-4 rounded-md text-xs absolute top-0 left-0 z-10"
                style={{
                  backgroundColor:
                    selectedSprint?.status === "completed"
                      ? "green"
                      : "#88D760",
                }}
              >
                {selectedSprint?.status === "completed"
                  ? "Completed"
                  : "Active"}
              </h3>
              <div className="absolute top-2 right-2 flex gap-2">
                {selectedSprint && (
                  <>
                    {selectedSprint.status === "completed" ? (
                      <CircleCheck size={15} color="green" />
                    ) : selectedSprint.status === "stopped" ? (
                      <button onClick={handlePlayClick} title="Start">
                        <Play
                          size={15}
                          fill="#000"
                          className="cursor-pointer"
                        />
                      </button>
                    ) : (
                      <>
                        <button onClick={() => handleIconClick("stopped")} title="Stop">
                          <Square
                            size={15}
                            fill="#000"
                            className="cursor-pointer"
                          />
                        </button>
                        <button onClick={() => handleIconClick("completed")} title="Complete">
                          <Circle
                            size={15}
                            className="cursor-pointer"
                          />
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {selectedSprint ? (
              <div className="text-[13px] space-y-3 mt-6 bg-white p-5 pt-2">
                <div className="flex justify-center items-center">
                  <GripHorizontal
                    size={15}
                    fill="#000"
                    className="cursor-pointer"
                  />
                </div>
                <p>
                  <span className="text-[#62bbec] font-medium">
                    S-{selectedSprint.id}
                  </span>{" "}
                  {selectedSprint.name}
                </p>
                <div className="flex items-center gap-2 text-[#B00020]">
                  <CalendarDays size={14} />
                  <span className="text-black">
                    {selectedSprint.start_date} to {selectedSprint.end_date}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#D32F2F]">
                  <User size={14} />
                  <span className="text-black">{newSprint?.sprint_owner_name}</span>
                </div>
                <div className="flex items-center gap-2 text-[#029464]">
                  <Timer size={14} />
                  <span className="text-[11px]">{countdown}</span>
                </div>
                <div className="border-t border-gray-300 my-4"></div>
                <div className="flex justify-between items-center">
                  <p className="text-[xs] mb-1">Contributors</p>
                  <div className="flex -space-x-2">
                    {contributors.map((char, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full text-xs flex items-center justify-center border border-white text-black"
                        style={{ backgroundColor: getColor(i) }}
                      >
                        {char}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[13px] space-y-3 mt-6 bg-white p-5 pt-2">
                <div className="flex justify-center items-center">
                  <GripHorizontal
                    size={15}
                    fill="#000"
                    className="cursor-pointer"
                  />
                </div>
                <p>
                  <span className="text-[#62bbec] font-medium">
                    No Sprint Selected
                  </span>
                </p>
                <div className="border-t border-gray-300 my-4"></div>
                <div className="flex justify-between items-center">
                  <p className="text-[xs] mb-1">Contributors</p>
                  <div className="flex -space-x-2">
                    {["S", "A", "B", "M", "K", "D", "CB"].map((char, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full text-xs flex items-center justify-center border border-white text-black"
                        style={{ backgroundColor: getColor(i) }}
                      >
                        {char}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div
              ref={selectedSprint?.status === "stopped" ? drop : null}
              className={`w-full h-max bg-white p-3 shadow-xl space-y-2 mb-2 rounded-md flex flex-col items-center justify-start text-center px-2 text-gray-500 text-sm overflow-y-auto no-scrollbar
              ${isOver && canDrop && selectedSprint?.status === "stopped"
                  ? "ring-2 ring-blue-400"
                  : ""
                }`}
              style={{ minHeight: 120 }}
            >
              {sprintBoardTasks.length === 0 &&
                (!selectedSprint?.sprint_tasks ||
                  selectedSprint.sprint_tasks.length === 0) ? (
                <span className="text-gray-500 mt-3">
                  Drag from respective statuses
                  <br />
                  and drop your Task here.
                </span>
              ) : (
                <>
                  {sprintBoardTasks.map((task) => {
                    const taskId = `task-${task.id}`;
                    const visibleSubtasks = (
                      task.sub_tasks_managements || []
                    ).filter((subtask) => subtask.status === "sprint");
                    return (
                      <div
                        key={`task-${task.id}`}
                        id={taskId}
                        className="w-full my-2"
                      >
                        <TaskCard
                          task={task}
                          toggleSubCard={() => toggleSubCard(task.id)}
                        />
                        {visibleSubtasks.length > 0 &&
                          subCardVisibility[task.id] && (
                            <div className="ml-5 mt-1">
                              {visibleSubtasks.map((subtask) => (
                                <div
                                  key={`subtask-${subtask.id}`}
                                  id={`subtask-${subtask.id}`}
                                  draggable={
                                    selectedSprint?.status === "stopped"
                                  }
                                  onDragStart={(e) => {
                                    if (selectedSprint?.status !== "stopped")
                                      return;
                                    console.log(
                                      "Dragging subtask:",
                                      subtask.id,
                                      "from task:",
                                      task.id
                                    );
                                    e.dataTransfer.setData(
                                      "application/reactflow",
                                      JSON.stringify({
                                        type: "SUBTASK",
                                        id: subtask.id,
                                        fromTaskId: task.id,
                                      })
                                    );
                                    e.dataTransfer.effectAllowed = "move";
                                  }}
                                  className="mb-2 cursor-move relative"
                                  style={{ pointerEvents: "auto" }}
                                >
                                  <TaskSubCard
                                    subtask={subtask}
                                    isVisible={true}
                                  />
                                  <div className="text-[8px] font-medium text-gray-500 mb-1 me-2 pt-1 text-end italic">
                                    Subcard of Task-{task.id}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    );
                  })}
                  {selectedSprint?.sprint_tasks?.length > 0 &&
                    selectedSprint.sprint_tasks.map((sprintTask) => {
                      const taskId = `task-${sprintTask.task_id}`;
                      const task = sprintTask.task_management;
                      const visibleSubtasks = (
                        task.sub_tasks_managements || []
                      ).filter((subtask) => subtask.status === "sprint");
                      return (
                        <div
                          key={`sprint-task-${sprintTask.id}`}
                          id={taskId}
                          className="w-full my-2"
                        >
                          <TaskCard
                            id={sprintTask.task_id}
                            task={task}
                            toggleSubCard={() =>
                              toggleSubCard(sprintTask.task_id)
                            }
                          />
                          {visibleSubtasks.length > 0 &&
                            subCardVisibility[sprintTask.task_id] && (
                              <div className="ml-5 mt-1">
                                {visibleSubtasks.map((subtask) => (
                                  <div
                                    key={`subtask-${subtask.id}`}
                                    id={`subtask-${subtask.id}`}
                                    draggable={
                                      selectedSprint?.status === "stopped"
                                    }
                                    onDragStart={(e) => {
                                      if (selectedSprint?.status !== "stopped")
                                        return;
                                      console.log(
                                        "Dragging subtask:",
                                        subtask.id,
                                        "from task:",
                                        sprintTask.task_id
                                      );
                                      e.dataTransfer.setData(
                                        "application/reactflow",
                                        JSON.stringify({
                                          type: "SUBTASK",
                                          id: subtask.id,
                                          fromTaskId: sprintTask.task_id,
                                        })
                                      );
                                      e.dataTransfer.effectAllowed = "move";
                                    }}
                                    className="mb-2 cursor-move relative"
                                    style={{ pointerEvents: "auto" }}
                                  >
                                    <TaskSubCard
                                      subtask={subtask}
                                      isVisible={true}
                                    />
                                    <div className="text-[8px] font-medium text-gray-500 mb-1 me-2 pt-1 text-end italic">
                                      Subcard of Task-{sprintTask.task_id}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      );
                    })}
                </>
              )}
            </div>
          </div>
        </div>

        {sprintTitle.map((card) => {
          const sprintTaskIds =
            newSprint?.sprint_tasks?.map((sprintTask) => sprintTask.task_id) ||
            [];
          const cardStatus = card.title.toLowerCase().replace(" ", "_");
          const filteredTasks = taskData.filter((task) => {
            const notInSprint = !sprintTaskIds.includes(task.id);
            const matchesStatus =
              cardStatus === "active"
                ? task.status === "open"
                : task.status === cardStatus;
            return notInSprint && matchesStatus;
          });

          const filteredSubtasks = taskData
            .flatMap((task) =>
              (task.sub_tasks_managements || []).map((subtask) => ({
                ...subtask,
                parentTaskId: task.id,
                parentTaskStatus: task.status,
              }))
            )
            .filter(
              (subtask) =>
                (cardStatus === "active"
                  ? subtask.status === "open"
                  : subtask.status === cardStatus) &&
                subtask.status !== subtask.parentTaskStatus &&
                !sprintTaskIds.includes(subtask.id)
            );

          return (
            <Boards
              key={card.id}
              add={card.add}
              color={card.color}
              count={filteredTasks.length + filteredSubtasks.length}
              title={card.title}
              onDrop={(item) =>
                handleDrop(item, cardStatus === "active" ? "open" : cardStatus)
              }
            >
              {filteredTasks.length + filteredSubtasks.length > 0 ? (
                <>
                  {filteredTasks.map((task) => {
                    const taskId = `task-${task.id}`;
                    let dependsOnArr = [];

                    if (Array.isArray(task.predecessor_task)) {
                      dependsOnArr = [
                        ...dependsOnArr,
                        ...task.predecessor_task.flat().filter(Boolean),
                      ];
                    }
                    if (Array.isArray(task.successor_task)) {
                      dependsOnArr = [
                        ...dependsOnArr,
                        ...task.successor_task.flat().filter(Boolean),
                      ];
                    }

                    dependsOnArr = [
                      ...new Set(
                        dependsOnArr.filter((id) => id && id !== task.id)
                      ),
                    ];
                    const formattedDependsOn = dependsOnArr.map(
                      (dep) => `task-${dep}`
                    );

                    const allLinked =
                      formattedDependsOn.length > 0 &&
                      formattedDependsOn.every((depId) =>
                        arrowLinks.some(
                          (link) =>
                            (link.sourceId === depId &&
                              link.targetId === taskId) ||
                            (link.sourceId === taskId &&
                              link.targetId === depId)
                        )
                      );

                    const visibleSubtasks = (
                      task.sub_tasks_managements || []
                    ).filter((subtask) =>
                      cardStatus === "active"
                        ? subtask.status === "open"
                        : subtask.status === cardStatus
                    );

                    return (
                      <div key={task.id} id={taskId} className="relative">
                        <TaskCard
                          task={task}
                          toggleSubCard={() => toggleSubCard(task.id)}
                          {...(formattedDependsOn.length > 0 && {
                            handleLink: () =>
                              handleLink(taskId, formattedDependsOn),
                            iconColor: allLinked ? "#A0A0A0" : "#DA2400",
                          })}
                        />
                        {visibleSubtasks.length > 0 &&
                          subCardVisibility[task.id] && (
                            <div className="ml-5 mt-1">
                              {visibleSubtasks.map((subtask) => (
                                <div
                                  key={`subtask-${subtask.id}`}
                                  id={`subtask-${subtask.id}`}
                                  draggable
                                  onDragStart={(e) => {
                                    console.log(
                                      "Dragging subtask:",
                                      subtask.id,
                                      "from task:",
                                      task.id
                                    );
                                    e.dataTransfer.setData(
                                      "application/reactflow",
                                      JSON.stringify({
                                        type: "SUBTASK",
                                        id: subtask.id,
                                        fromTaskId: task.id,
                                      })
                                    );
                                    e.dataTransfer.effectAllowed = "move";
                                  }}
                                  className="mb-2 cursor-move relative"
                                  style={{ pointerEvents: "auto" }}
                                >
                                  <div className="text-[8px] font-medium text-gray-500 mb-1 me-2 pt-1 text-end italic">
                                    Subcard of Task-{task.id}
                                  </div>
                                  <TaskSubCard
                                    subtask={subtask}
                                    isVisible={true}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    );
                  })}
                  {filteredSubtasks.map((subtask) => (
                    <div
                      key={`subtask-${subtask.id}`}
                      id={`subtask-${subtask.id}`}
                      draggable
                      onDragStart={(e) => {
                        console.log(
                          "Dragging independent subtask:",
                          subtask.id,
                          "from task:",
                          subtask.parentTaskId
                        );
                        e.dataTransfer.setData(
                          "application/reactflow",
                          JSON.stringify({
                            type: "SUBTASK",
                            id: subtask.id,
                            fromTaskId: subtask.parentTaskId,
                          })
                        );
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      className="mb-2 cursor-move relative"
                      style={{ pointerEvents: "auto" }}
                    >
                      <div className="text-[8px] font-medium text-gray-500 mb-1 me-2 pt-1 text-end italic">
                        Subcard of Task-{subtask.parentTaskId}
                      </div>
                      <TaskSubCard subtask={subtask} isVisible={true} />
                    </div>
                  ))}
                </>
              ) : (
                <img src="/draganddrop.svg" alt="svg" className="w-full" />
              )}
            </Boards>
          );
        })}
      </div>

      {allArrows.map((link, index) => {
        const isDependencyArrow = dependencyArrows.some(
          (dep) =>
            dep.sourceId === link.sourceId && dep.targetId === link.targetId
        );

        let dashness = false;
        let strokeWidth = 1.5;
        let color = "#DA2400";

        if (isDependencyArrow) {
          const dependency = dependencyArrows.find(
            (dep) =>
              dep.sourceId === link.sourceId && dep.targetId === link.targetId
          );

          if (dependency?.type === "completed") {
            dashness = false;
            strokeWidth = 1;
            color = "#A0A0A0";
          } else if (dependency?.type === "successor") {
            dashness = { strokeLen: 8, nonStrokeLen: 6 };
            strokeWidth = 1.5;
            color = "#DA2400";
          }
        }

        return (
          <Xarrow
            key={`${link.sourceId}-${link.targetId}-${index}`}
            start={link.sourceId}
            end={link.targetId}
            strokeWidth={strokeWidth}
            headSize={6}
            curveness={0.3}
            color={color}
            lineColor={color}
            showHead={true}
            dashness={dashness}
            path="smooth"
            className="custom-xarrow"
          />
        );
      })}
    </div>
  );
};

export default SprintBoardSection