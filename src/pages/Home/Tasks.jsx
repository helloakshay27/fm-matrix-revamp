import { useEffect, useState } from 'react';
import TaskActions from '../../components/Home/TaskActions.jsx';
import BoardsSection from '../../components/Home/BoardsSection.jsx';
import TasksList from '../../components/Home/Task/TasksList.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProjectDetails } from '../../redux/slices/projectSlice.js';
import { fetchMilestoneById } from '../../redux/slices/milestoneSlice.js';

const Tasks = ({ setIsSidebarOpen }) => {
    const token = localStorage.getItem("token");
    const { id, mid } = useParams();
    const dispatch = useDispatch();

    const { fetchProjectDetails: project } = useSelector(state => state.fetchProjectDetails)
    const { fetchMilestoneById: milestone } = useSelector(
        (state) => state.fetchMilestoneById
    );

    useEffect(() => {
        dispatch(fetchProjectDetails({ token, id }))
        dispatch(fetchMilestoneById({ token, id: mid }));
    }, [dispatch])

    const [selectedType, setSelectedType] = useState(() => {
        return localStorage.getItem("selectedTaskType") || "List";
    });

    return (
        <div className="h-full overflow-y-auto no-scrollbar">
            <h3 className="text-[11px] text-gray-400 mx-6 my-4">
                {project?.title && milestone?.title
                    ? `${project.title} / ${milestone.title} / Tasks`
                    : 'Tasks'}
            </h3>
            <hr className="border border-gray-200" />

            <TaskActions
                setIsSidebarOpen={setIsSidebarOpen}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                addType={"Task"}
                context="Tasks"
            />

            {
                selectedType === "Kanban" ? (
                    <BoardsSection section={"Tasks"} />
                ) : selectedType === "List" ? (
                    <TasksList />
                ) : <></>
            }
        </div>
    );
};

export default Tasks;
