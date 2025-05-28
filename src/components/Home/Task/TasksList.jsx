import TaskTable from "./Table";

const TasksList = () => {
    return (
        <div className="m-3">
            <div className="overflow-x-auto ">
                <TaskTable />
            </div>
        </div>
    );
};

export default TasksList;