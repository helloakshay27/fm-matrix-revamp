import { useEffect, useState, useCallback } from "react";
import Boards from "./Boards";
import TaskCard from "./Task/TaskCard";
import ProjectCard from "./Projects/ProjectCard";
import Xarrow from "react-xarrows";
import { cardsTitle } from "../../data/Data";
import TaskSubCard from "./Task/TaskSubCard";
import { useDispatch, useSelector, batch } from "react-redux";
import { changeProjectStatus, fetchProjects } from "../../redux/slices/projectSlice";
import { changeTaskStatus, fetchTasks } from "../../redux/slices/taskSlice";
import useDeepCompareEffect from "use-deep-compare-effect";
import { debounce } from "lodash";
import { useParams } from "react-router-dom";

const BoardsSection = ({ section }) => {
  const token = localStorage.getItem("token");
  const { mid } = useParams();
  const [subCardVisibility, setSubCardVisibility] = useState({});
  const [arrowLinks, setArrowLinks] = useState([]);
  const dispatch = useDispatch();

  const [projects, setProjects] = useState([]);
  const [taskData, setTaskData] = useState([]);

  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  const [localError, setLocalError] = useState(null);
  const projectState = useSelector((state) => state.fetchProjects.fetchProjects);
  const taskState = useSelector((state) => state.fetchTasks.fetchTasks);
  const { filterProjects, success } = useSelector((state) => state.filterProjects);
  const { filterTask, success: taskSuccess } = useSelector((state) => state.filterTask);

  useEffect(() => {
    batch(() => {
      if (section === "Tasks") {
        if (mid) {
          dispatch(fetchTasks({ token, id: mid }));
        } else {
          dispatch(fetchTasks({ token, id: "" }));
        }
      } else {
        dispatch(fetchProjects({ token }));
      }
    });
  }, [dispatch, section]);

  useDeepCompareEffect(() => {
    if (success && filterProjects.length > 0) {
      setProjects(filterProjects);
    } else {
      setProjects(projectState);
    }
  }, [projectState, success, filterProjects]);

  useDeepCompareEffect(() => {
    if (taskSuccess && filterTask.length > 0) {
      setTaskData(filterTask);
    } else {
      setTaskData(taskState);
    }
  }, [taskState, taskSuccess, filterTask]);

  const toggleSubCard = useCallback((taskId) => {
    setSubCardVisibility((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  }, []);

  const updateTaskDataField = useCallback((taskId, fieldName, newValue) => {
    setTaskData((prev) => {
      let changed = false;
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
              console.log(`Updating subtask ${taskId} with ${fieldName}: ${newValue}`);
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
    debounce(async (taskId, fieldName, newValue, isSubtask = false, parentTaskId = null) => {
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
        setLocalError(
          `Update failed: ${error?.response?.data?.errors || error?.message || "Server error"}`
        );
        if (mid) {
          dispatch(fetchTasks({ token, id: mid }));
        } else {
          dispatch(fetchTasks({ token, id: "" }));
        }
      }
    }, 300),
    [dispatch]
  );

  const handleUpdateTaskFieldCell = useCallback(
    (taskId, fieldName, newValue, isSubtask = false, parentTaskId = null) => {
      if (isUpdatingTask) return;

      setIsUpdatingTask(true);
      setLocalError(null);

      updateTaskDataField(taskId, fieldName, newValue);
      debouncedUpdateTaskField(taskId, fieldName, newValue, isSubtask, parentTaskId);
      setIsUpdatingTask(false);
    },
    [debouncedUpdateTaskField, isUpdatingTask, updateTaskDataField]
  );

  const handleStatusChange = useCallback(
    async ({ id: rowId, payload: newValue }) => {
      const actualProjectId = rowId.replace("P-", "");
      const apiCompatibleValue = newValue.toLowerCase().replace(/\s+/g, "_");

      try {
        await dispatch(
          changeProjectStatus({
            token,
            id: actualProjectId,
            payload: { status: apiCompatibleValue },
          })
        ).unwrap();
        dispatch(fetchProjects({ token }));
      } catch (err) {
        console.error(`Failed to update project status for ID ${actualProjectId}:`, err);
      }
    },
    [dispatch]
  );

  const handleProjectStatusChange = useCallback(
    ({ id, status }) => {
      setProjects((prev) =>
        prev.map((proj) => (proj.id === id ? { ...proj, status } : proj))
      );
      handleStatusChange({
        id: `P-${id}`,
        payload: status,
      });
    },
    [handleStatusChange]
  );

  const handleDrop = useCallback(
    (item, newStatus) => {
      // Prevent dropping on the "Overdue" board
      if (newStatus.toLowerCase() === "overdue") {
        console.log("Dropping on Overdue board is disabled");
        return;
      }

      const { type, id, fromTaskId } = item;
      if (type === "TASK" || type === "SUBTASK") {
        handleUpdateTaskFieldCell(id, "status", newStatus);
      } else if (type === "PROJECT") {
        handleProjectStatusChange({ id, status: newStatus === "open" ? "active" : newStatus });
      }
    },
    [handleUpdateTaskFieldCell, handleProjectStatusChange]
  );

  const handleLink = (sourceId, targetIds = []) => {
    if (targetIds.length === 0) return;

    setArrowLinks((prevLinks) => {
      const areAllLinksActive = targetIds.every((targetId) =>
        prevLinks.some((link) => link.sourceId === sourceId && link.targetId === targetId)
      );

      if (areAllLinksActive) {
        return prevLinks.filter(
          (link) => !(link.sourceId === sourceId && targetIds.includes(link.targetId))
        );
      } else {
        const newLinks = targetIds
          .filter((targetId) => !prevLinks.some((link) => link.sourceId === sourceId && link.targetId === targetId))
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
      const sourceTask = taskData.find((t) => t.id === sourceNum);
      const targetTask = taskData.find((t) => t.id === targetNum);

      if (targetTask && Array.isArray(targetTask.predecessor_task)) {
        const flatPredecessors = targetTask.predecessor_task.flat();
        if (flatPredecessors.includes(sourceNum)) {
          arrows.push({
            sourceId: `task-${sourceNum}`,
            targetId: `task-${targetNum}`,
            type: "predecessor",
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
      (dep) => !arrowLinks.some((link) => link.sourceId === dep.sourceId && link.targetId === dep.targetId)
    ),
  ];

  return (
    <div className="relative">
      <div
        className="h-[80%] mx-3 my-3 flex items-start gap-1 max-w-full overflow-x-auto overflow-y-auto flex-nowrap"
        style={{ height: "75vh" }}
      >
        {cardsTitle.map((card) => {
          const cardStatus = card.title.toLowerCase().replace(" ", "_");

          const filteredTasks = (taskData || []).filter((task) =>
            cardStatus === "active" ? task.status === "open" : task.status === cardStatus
          );

          const filteredSubtasks = (taskData || []).flatMap((task) =>
            (task.sub_tasks_managements || [])
              .filter((subtask) => subtask.status !== task.status)
              .map((subtask) => ({
                ...subtask,
                parentTaskId: task.id,
              }))
          ).filter((subtask) => subtask.status === cardStatus);

          const filteredProjects = projects && projects.filter(
            (project) => cardStatus === "open" ? project.status === "active" : project.status === cardStatus
          );

          return (
            <Boards
              key={card.id}
              add={card.add}
              color={card.color}
              count={
                section === "Tasks"
                  ? filteredTasks.length + filteredSubtasks.length
                  : filteredProjects.length
              }
              title={card.title}
              onDrop={handleDrop}
              isDropDisabled={card.title.toLowerCase() === "overdue"} // Pass flag to disable drop
            >
              {section === "Tasks" ? (
                filteredTasks.length + filteredSubtasks.length > 0 ? (
                  <>
                    {filteredTasks.map((task) => {
                      const taskId = `task-${task.id}`;
                      let dependsOnArr = [];

                      if (Array.isArray(task.predecessor_task)) {
                        dependsOnArr = [...dependsOnArr, ...task.predecessor_task.flat().filter(Boolean)];
                      }
                      if (Array.isArray(task.successor_task)) {
                        dependsOnArr = [...dependsOnArr, ...task.successor_task.flat().filter(Boolean)];
                      }

                      dependsOnArr = [...new Set(dependsOnArr.filter((id) => id && id !== task.id))];
                      const formattedDependsOn = dependsOnArr.map((dep) => `task-${dep}`);

                      const allLinked =
                        formattedDependsOn.length > 0 &&
                        formattedDependsOn.every((depId) =>
                          arrowLinks.some(
                            (link) =>
                              (link.sourceId === depId && link.targetId === taskId) ||
                              (link.sourceId === taskId && link.targetId === depId)
                          )
                        );

                      const visibleSubtasks = (task.sub_tasks_managements || []).filter((subtask) =>
                        cardStatus === "active" ? subtask.status === "open" : subtask.status === cardStatus
                      );

                      return (
                        <div key={task.id} id={taskId} className="relative">
                          <TaskCard
                            task={task}
                            toggleSubCard={() => toggleSubCard(task.id)}
                            {...(formattedDependsOn.length > 0 && {
                              handleLink: () => handleLink(taskId, formattedDependsOn),
                              iconColor: allLinked ? "#A0A0A0" : "#DA2400",
                            })}
                            count={visibleSubtasks.length}
                          />
                          {visibleSubtasks.length > 0 && subCardVisibility[task.id] && (
                            <div className="ml-5 mt-1">
                              {visibleSubtasks.map((subtask) => (
                                <div
                                  key={`subtask-${subtask.id}`}
                                  id={`subtask-${subtask.id}`}
                                  draggable
                                  onDragStart={(e) => {
                                    console.log('Dragging subtask:', subtask.id, 'from task:', task.id);
                                    e.dataTransfer.setData(
                                      "application/reactflow",
                                      JSON.stringify({ type: "SUBTASK", id: subtask.id, fromTaskId: task.id })
                                    );
                                    e.dataTransfer.effectAllowed = "move";
                                  }}
                                  className="mb-2 cursor-move relative"
                                  style={{ pointerEvents: 'auto' }}
                                >
                                  <TaskSubCard subtask={subtask} isVisible={true} />
                                  <div
                                    className="text-[8px] font-medium text-gray-500 mb-1 me-2 pt-1 text-end italic"
                                  >
                                    Subcard of Task-{task.id}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {filteredSubtasks &&
                      filteredSubtasks.map((subtask) => (
                        <div
                          key={`subtask-${subtask.id}`}
                          id={`subtask-${subtask.id}`}
                          draggable
                          onDragStart={(e) => {
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
                          style={{ pointerEvents: 'auto' }}
                        >
                          <TaskSubCard subtask={subtask} isVisible={true} />
                          <div
                            className="text-[8px] font-medium text-gray-500 mb-1 me-2 pt-1 text-end italic"
                          >
                            Subcard of Task-{subtask.parentTaskId}
                          </div>
                        </div>
                      ))}
                  </>
                ) : (
                  <img src="/draganddrop.svg" alt="svg" className="w-full" />
                )
              ) : (
                (filteredProjects || []).map((project) => (
                  <div key={project.id} id={`project-${project.id}`} className="relative">
                    <ProjectCard project={project} />
                  </div>
                ))
              )}
            </Boards>
          );
        })}
      </div>
      {allArrows.map((link, index) => {
        const isDependencyArrow = dependencyArrows.some(
          (dep) => dep.sourceId === link.sourceId && dep.targetId === link.targetId
        );

        let dashness = false;
        let strokeWidth = 1.5;
        let color = "#DA2400";

        if (isDependencyArrow) {
          const dependency = dependencyArrows.find(
            (dep) => dep.sourceId === link.sourceId && dep.targetId === link.targetId
          );

          if (dependency?.type === "predecessor") {
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

export default BoardsSection;