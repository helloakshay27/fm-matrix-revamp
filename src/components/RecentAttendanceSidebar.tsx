import React, { useState, useEffect } from 'react';
import { Building2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type RecentUser = {
  id: number;
  firstname?: string;
  lastname?: string;
  full_name?: string;
  department_name?: string;
};

export function RecentAttendanceSidebar() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) {
          setLoading(false);
          return;
        }
        const url = `https://${baseUrl}/pms/attendances.json?recent=true`;
        const res = await fetch(url, { signal: controller.signal, headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          setError('Failed to load recent attendance');
          setUsers([]);
          setLoading(false);
          return;
        }
        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('application/json')) {
          setError('Unexpected response');
          setUsers([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        const list = Array.isArray(data?.users) ? (data.users as RecentUser[]) : [];
        setUsers(list);
        setLoading(false);
      } catch (e: any) {
        if (e?.name === 'AbortError') return;
        setError('Failed to load recent attendance');
        setUsers([]);
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const viewDetails = (id: number) => {
    navigate(`/maintenance/attendance/details/${id}`);
  };

  return (
    <div className="w-full bg-[#C4B89D]/25 border-l border-gray-200 p-4 h-full xl:max-h-[1208px] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Recent Attendance</h2>
        <div className="text-sm font-medium text-gray-800">{new Date().toLocaleDateString('en-GB')}</div>
      </div>

      {/* Attendance List */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {loading ? (
          <div className="text-sm text-gray-600">Loading…</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-sm text-gray-600">No recent attendance found.</div>
        ) : (
          users.map((u) => {
            const name = (u.full_name && String(u.full_name).trim().length > 0)
              ? String(u.full_name).trim()
              : `${(u.firstname || '').trim()} ${(u.lastname || '').trim()}`.trim() || '-';
            return (
              <div
                key={u.id}
                className="bg-[#C4B89D] rounded-lg p-4 shadow-sm border border-[#E7D8C5]"
                style={{ borderWidth: '0.6px' }}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-700 min-w-[100px]">Employee</span>
                    <span className="text-sm text-gray-700">:</span>
                    <span className="text-sm text-gray-900 font-semibold">{name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-700 min-w-[100px]">Department</span>
                    <span className="text-sm text-gray-700">:</span>
                    <span className="text-sm text-gray-900">{u.department_name || '-'}</span>
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <button
                    className="text-blue-600 text-sm font-medium underline hover:text-blue-800"
                    onClick={() => viewDetails(u.id)}
                  >
                    View Detail&gt;&gt;
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}