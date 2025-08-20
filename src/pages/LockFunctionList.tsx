import React, { useEffect, useState } from 'react';
import { getAuthHeader, getFullUrl } from '../config/apiConfig';
import RoleConfigHeader from '../components/RoleConfigHeader';

const fetchLockFunctions = async () => {
  const url = getFullUrl('/lock_functions.json');
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch lock functions');
  const data = await response.json();
  return Array.isArray(data) ? data : data.lock_functions || [];
};

const LockFunctionList: React.FC = () => {
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLockFunctions().then((data) => {
      setFunctions(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#8B5CF6]/10 rounded-lg">
          <svg className="w-6 h-6 text-[#8B5CF6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Lock Functions</h1>
          <p className="text-gray-600">List of all lock functions</p>
        </div>
      </header>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <span className="text-gray-500">Loading...</span>
        </div>
      ) : (
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Action Name</th>
              <th className="px-4 py-2 border">Module ID</th>
              <th className="px-4 py-2 border">Parent Function</th>
            </tr>
          </thead>
          <tbody>
            {functions.map((fn: any) => (
              <tr key={fn.id}>
                <td className="px-4 py-2 border">{fn.name}</td>
                <td className="px-4 py-2 border">{fn.action_name}</td>
                <td className="px-4 py-2 border">{fn.module_id}</td>
                <td className="px-4 py-2 border">{fn.parent_function}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LockFunctionList;
