import React, { useEffect, useState } from 'react';
import RoleConfigHeader from '../components/RoleConfigHeader';
import { getAuthHeader, getFullUrl } from '../config/apiConfig';

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

const createLockSubFunction = async (payload: any) => {
  const url = getFullUrl('/lock_sub_functions.json');
  const body = {
    lock_sub_function: payload
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to create lock sub function');
  return await response.json();
};

const LockSubFunctionCreate: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    sub_function_name: '',
    lock_function_id: '',
    active: 1,
  });
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchLockFunctions().then(setFunctions);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await createLockSubFunction(form);
    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#8B5CF6]/10 rounded-lg">
          <svg className="w-6 h-6 text-[#8B5CF6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Create Lock Sub Function</h1>
          <p className="text-gray-600">Add a new lock sub function</p>
        </div>
      </header>
      <form className="max-w-md mx-auto bg-white p-6 rounded-lg shadow" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Sub Function Name</label>
          <input
            type="text"
            name="sub_function_name"
            value={form.sub_function_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Lock Function</label>
          <select
            name="lock_function_id"
            value={form.lock_function_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
            required
          >
            <option value="">Select Function</option>
            {functions.map((fn: any) => (
              <option key={fn.id} value={fn.id}>{fn.name}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
            onClick={() => setForm({ name: '', sub_function_name: '', lock_function_id: '', active: 1 })}
            disabled={loading}
          >
            Clear
          </button>
          <button
            type="submit"
            className="bg-[#8B5CF6] text-white px-4 py-2 rounded hover:bg-[#8B5CF6]/90"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
        {success && <div className="mt-4 text-green-600">Created successfully!</div>}
      </form>
    </div>
  );
};

export default LockSubFunctionCreate;
