import { useLocation, useNavigate, useParams } from 'react-router-dom';

const InternalDetails = () => {

  const { state } = useLocation();
  const location = useLocation();
  const navigate = useNavigate()
  const userData = location.state || JSON.parse(sessionStorage.getItem('selectedUser'));

  if (!state) {
    return <p>No user selected. Go back to the <button onClick={() => navigate('/')}>Table</button>.</p>;
  }
  const { name, email, role, reportingManager } = userData;

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex justify-between">
          <div className="flex items-start gap-4">
            <div className="w-[60px] h-[60px] rounded-full bg-[#D5DBDB] flex items-center justify-center text-lg font-bold text-gray-700">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{name}</h2>
              <p className="text-sm text-gray-600">Email id : {email}</p>
              <p className="text-sm text-gray-600">Role : {role}</p>
              <p className="text-sm text-gray-600">Reports To : {reportingManager}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-green-500 font-semibold text-sm cursor-pointer">
              Active <span className="inline-block rotate-180">^</span>
            </span>
            <span
              className="text-sm text-gray-500 underline cursor-pointer"
              onClick={() => navigate(-1)}
            >
              Back
            </span>
          </div>
        </div>

        {/* Stats Boxes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#f9f9f9] p-4 rounded-md">
            <p className="text-sm text-gray-500">Planned Hours</p>
            <p className="text-lg font-bold">00 : 00</p>
          </div>
          <div className="bg-[#f9f9f9] p-4 rounded-md">
            <p className="text-sm text-gray-500">Actual Hours</p>
            <p className="text-lg font-bold">00 : 00</p>
          </div>
          <div className="bg-[#f9f9f9] p-4 rounded-md">
            <p className="text-sm text-gray-500 mb-1">Milestones</p>
            <p className="text-sm">Open : 0</p>
            <p className="text-sm">Closed : 0</p>
          </div>
          <div className="bg-[#f9f9f9] p-4 rounded-md">
            <p className="text-sm text-gray-500 mb-1">Tasks</p>
            <p className="text-sm">Open : 0</p>
            <p className="text-sm">Closed : 0</p>
          </div>
        </div>

        {/* Projects Table */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Associated Projects</h3>
          <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Project Title</th>
                  <th className="text-left px-4 py-2 font-medium">Project Type</th>
                  <th className="text-left px-4 py-2 font-medium">Created On</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-t">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="mr-2" />
                    Project Title
                  </td>
                  <td className="px-4 py-3">Internal</td>
                  <td className="px-4 py-3">DD/MM/YYYY</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end text-sm text-orange-400 gap-6 mt-3 pr-2">
            <button className="hover:underline">Clone</button>
            <button className="hover:underline">Reassign To</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalDetails;
