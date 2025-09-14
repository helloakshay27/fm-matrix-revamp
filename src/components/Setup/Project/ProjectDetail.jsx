import { useLocation, useNavigate } from "react-router-dom";

const ProjectDetail = () => {

  const location = useLocation();
  const navigate = useNavigate()
  const userData = location.state || JSON.parse(sessionStorage.getItem('ProjectUser'));

  const { teamName, teamLead, associatedProjects, teamMembers } = userData;

  return (
    <div className="p-6 bg-[#f9f9f9] min-h-screen">
      <div className="bg-white rounded shadow-md p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-200 text-gray-700 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-semibold">
              CS
            </div>
            <div>
              <h1 className="text-lg font-medium">{teamName}</h1>
              <p className="text-sm text-gray-500">
                Total Team Members : {teamMembers} &nbsp;&nbsp;|&nbsp;&nbsp; Associated Projects : {associatedProjects}
              </p>
            </div>
          </div>
          <button className="text-gray-600 text-sm" onClick={() => navigate(-1)}>&lt; Back</button>
        </div>

        {/* Milestones and Tasks */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="font-semibold mb-2">Milestones</h2>
            <p className="text-sm text-gray-600">Open : 0</p>
            <p className="text-sm text-gray-600">Closed : 0</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="font-semibold mb-2">Tasks</h2>
            <p className="text-sm text-gray-600">Open : 0</p>
            <p className="text-sm text-gray-600">Closed : 0</p>
          </div>
        </div>

        {/* Team Section */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="font-semibold mb-2">Team Lead</h2>
            <p className="text-sm text-gray-700">{teamLead}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="font-semibold mb-2">Team Members</h2>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>Komal</li>
              <li>Bilal</li>
              <li>Deepak</li>
              <li>Dinesh</li>
              <li>Devesh</li>
            </ul>
          </div>
        </div>

        {/* Associated Projects Table */}
        <div>
          <h2 className="text-md font-semibold mb-4">Associated Projects</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-2 border-r">Project Title</th>
                  <th className="px-4 py-2 border-r">Project Type</th>
                  <th className="px-4 py-2">Created On</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-r">Project Title</td>
                  <td className="px-4 py-2 border-r">Internal</td>
                  <td className="px-4 py-2">DD/MM/YYYY</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
