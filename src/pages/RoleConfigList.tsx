import React, { useEffect, useState } from 'react';
import RoleConfigHeader from '../components/RoleConfigHeader';
import { getAuthHeader, getFullUrl } from '../config/apiConfig';


// API for Role Config (Lock Modules)
export const getLockModules = async () => {
  const url = getFullUrl('/lock_modules.json');
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch lock modules');
  const data = await response.json();
  return Array.isArray(data) ? data : data.lock_modules || [];
};



const RoleConfigList: React.FC = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLockModules().then((data) => {
      setModules(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <RoleConfigHeader name="Role Config List" abbreviation="List" />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full mt-4 bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Abbreviation</th>
              <th className="px-4 py-2 border">Active</th>
              <th className="px-4 py-2 border">Rate Type</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((mod: any) => (
              <tr key={mod.id}>
                <td className="px-4 py-2 border">{mod.name}</td>
                <td className="px-4 py-2 border">{mod.abbreviation}</td>
                <td className="px-4 py-2 border">{mod.active ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 border">{mod.rate_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RoleConfigList;
