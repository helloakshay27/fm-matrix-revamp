const MomTasks = ({ tasks = [] }) => {
  return (
    <div className="text-[14px] font-light my-4">
      <div className="overflow-x-auto rounded-md border border-gray-300">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-4">Task ID</th>
              <th className="px-4 py-4 w-[25%]">Task</th>
              <th className="px-4 py-4">Raised By</th>
              <th className="px-4 py-4 w-[15%]">Responsible Person</th>
              <th className="px-4 py-4">End Date</th>
              <th className="px-4 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.filter(task => task.save_task === true).length > 0 ? (
              tasks.filter(task => task.save_task === true).map(task => (
                <tr>
                  <td className="p-4">{task.id}</td>
                  <td className="p-4">{task.description}</td>
                  <td className="p-4" style={{ padding: "1rem" }}>{task.raised_by || "N/A"}</td>
                  <td className="p-4">{task.responsible_person_name || "N/A"}</td>
                  <td className="p-4">{task.target_date}</td>
                  <td className="p-4">{task.status || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No Tasks
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  )
}

export default MomTasks