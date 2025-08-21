import React, { useEffect, useState } from 'react';
import { getAuthHeader, getFullUrl } from '../config/apiConfig';

const fetchLockSubFunctions = async () => {
  const url = getFullUrl('/lock_sub_functions.json');
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch lock sub functions');
  const data = await response.json();
  return Array.isArray(data) ? data : data.lock_sub_functions || [];
};

const LockSubFunctionList: React.FC = () => {
  const [subFunctions, setSubFunctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLockSubFunctions().then((data) => {
      setSubFunctions(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#C72030]/10 rounded-lg">
          <svg className="w-6 h-6 text-[#C72030]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15l2 5L9 17l5-2z" /></svg>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Lock Sub Functions</h1>
          <p className="text-gray-600">List of all lock sub functions</p>
        </div>
      </header>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
        </div>
      ) : (
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Sub Function Name</th>
              <th className="px-4 py-2 border">Lock Function ID</th>
              <th className="px-4 py-2 border">Active</th>
            </tr>
          </thead>
          <tbody>
            {subFunctions.map((sf: any) => (
              <tr key={sf.id}>
                <td className="px-4 py-2 border">{sf.name}</td>
                <td className="px-4 py-2 border">{sf.sub_function_name}</td>
                <td className="px-4 py-2 border">{sf.lock_function_id}</td>
                <td className="px-4 py-2 border">{sf.active ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LockSubFunctionList;
