import React, { useState } from 'react';
import RoleConfigHeader from '../components/RoleConfigHeader';
import {  getAuthHeader, getFullUrl } from '../config/apiConfig';



export const createLockModule = async (payload: { name: string; abbreviation: string }) => {
  const url = getFullUrl('/lock_modules.json');
  const body = {
    lock_module: {
      name: payload.name,
      abbreviation: payload.abbreviation,
      active: true,
      phase_id: 1,
      show_name: payload.name,
      module_type: 'standard',
      charged_per: 'user',
      no_of_licences: 5,
      min_billing: 50.0,
      rate: 25.0,
      max_billing: 500.0,
      total_billing: 125.0,
      rate_type: 'variable',
    },
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to create lock module');
  return await response.json();
};

const RoleConfigCreate: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    abbreviation: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await createLockModule(form);
    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#8B5CF6]/10 rounded-lg">
          {/* Use a relevant icon for Role Config, fallback to Settings */}
          <svg className="w-6 h-6 text-[#8B5CF6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Create Role Config</h1>
          <p className="text-gray-600">Add a new role configuration module</p>
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
          <label className="block mb-2 text-sm font-medium text-gray-700">Abbreviation</label>
          <input
            type="text"
            name="abbreviation"
            value={form.abbreviation}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]"
            required
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
            onClick={() => setForm({ name: '', abbreviation: '' })}
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

export default RoleConfigCreate;
