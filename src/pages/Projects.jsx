import { useState } from "react";
import EditProjectModal from "../components/EditProjectModal";
import TaskActions from "../components/TaskActions";
import ProjectList from "../components/ProjectList";
import BoardsSection from "../components/BoardsSection";
import { projects } from "../data/Data";

const tasks = [
    {
        id: 23123,
        projectName: "Internal Project",
        status: "Active",
        task: 70,
        startDate: "01/01/2002",
        endDate: "01/01/2002",
        projectOwner: "Sagar Singh",
        projectCreatedOn: "01/01/2024  09:00 AM"
    },
    {
        id: 23125,
        projectName: "Internal Project",
        status: "Active",
        task: 70,
        startDate: "01/01/2002",
        endDate: "01/01/2002",
        projectOwner: "Sagar Singh",
        projectCreatedOn: "01/01/2024  09:00 AM"
    },
    {
        id: 23925,
        projectName: "Internal Project",
        status: "Active",
        task: 70,
        startDate: "01/01/2002",
        endDate: "01/01/2002",
        projectOwner: "Sagar Singh",
        projectCreatedOn: "01/01/2024  09:00 AM"
    },
    {
        id: 93125,
        projectName: "Internal Project",
        status: "Active",
        task: 70,
        startDate: "01/01/2002",
        endDate: "01/01/2002",
        projectOwner: "Sagar Singh",
        projectCreatedOn: "01/01/2024  09:00 AM"
    },
]

const Projects = () => {
    const [selectedType, setSelectedType] = useState("List")
    const [isEdit, setIsEdit] = useState(false)


    return (
        <div className="h-full overflow-y-auto no-scrollbar">
            <h3 className="text-base mx-4 mt-3 mb-2">Projects</h3>
            <hr className="border border-gray-200" />

            <TaskActions selectedType={selectedType} setSelectedType={setSelectedType} addType={"Project"} />

            {
                selectedType === 'List' ? (
                    <ProjectList tasks={tasks} setIsEdit={setIsEdit} />
                ) : (
                    <BoardsSection tasks={projects} section={"Projects"} />
                )
            }


            {
                isEdit && (
                    <EditProjectModal
                        isModalOpen={isEdit}
                        setIsModalOpen={setIsEdit}
                    />
                )
            }
        </div>
    )
}

export default Projects