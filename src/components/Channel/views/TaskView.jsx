const TaskView = () => {
  return (
    <div>
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr className="text-left text-sm text-black border-t border-b border-gray-300">
            <th className="px-4 py-4 font-semibold bg-transparent">Task Title</th>
            <th className="px-4 py-4 font-semibold bg-transparent">Project</th>
            <th className="px-4 py-4 font-semibold bg-transparent">Milestone</th>
            <th className="px-4 py-4 font-semibold bg-transparent">Responsible Person</th>
            <th className="px-4 py-4 font-semibold bg-transparent">Duration</th>
            <th className="px-4 py-4 font-semibold bg-transparent">End Date</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-sm text-gray-800 border-b border-gray-200">
            <td className="px-4 py-4 font-normal text-black">Please complete that today</td>
            <td className="px-4 py-4 italic text-gray-600">Unassigned</td>
            <td className="italic text-gray-600 text-center">Unassigned</td>
            <td className="px-4 py-4 italic text-gray-600">Unassigned</td>
            <td className="px-4 py-4">
              <div className="inline-block bg-gray-100 text-gray-600 italic px-4 py-2 rounded-sm">
                Enter Duration
              </div>
            </td>
            <td className="px-4 py-4 italic text-gray-600">Unassigned</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TaskView;
