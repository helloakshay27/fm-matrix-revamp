import React, { useEffect, useState } from 'react';
import { getAuthHeader, getFullUrl } from '../config/apiConfig';

const fetchLockModules = async () => {
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

const createLockFunction = async (payload: any) => {
  const url = getFullUrl('/lock_functions.json');
  const body = {
    lock_function: payload
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to create lock function');
  return await response.json();
};

const LockFunctionCreate: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    module_id: '',
    description: '',
    action_name: '',
    parent_function: '',
  });
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchLockModules().then(setModules);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await createLockFunction(form);
    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#C72030]/10 rounded-lg">
          <svg className="w-6 h-6 text-[#C72030]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15l2 5L9 17l5-2z" /></svg>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Create Lock Function</h1>
          <p className="text-gray-600">Add a new lock function</p>
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
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Lock Module</label>
          <select
            name="module_id"
            value={form.module_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
            required
          >
            <option value="">Select Module</option>
            {modules.map((mod: any) => (
              <option key={mod.id} value={mod.id}>{mod.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Action Name</label>
          <input
            type="text"
            name="action_name"
            value={form.action_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Parent Function</label>
          <input
            type="text"
            name="parent_function"
            value={form.parent_function}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
            onClick={() => setForm({ name: '', module_id: '', description: '', action_name: '', parent_function: '' })}
            disabled={loading}
          >
            Clear
          </button>
          <button
            type="submit"
            className="bg-[#C72030] text-white px-4 py-2 rounded hover:bg-[#C72030]/90"
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

export default LockFunctionCreate;
