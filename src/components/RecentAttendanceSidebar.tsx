import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2 } from 'lucide-react';

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
    <div className="w-full h-full flex flex-col bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#C72030] mb-1">Recent Attendance</h2>
        <div className="text-sm font-semibold text-black tracking-wide">
          {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </div>
      </div>

      {/* Attendance List */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
        {loading ? (
          <div className="text-sm text-black">Loading…</div>
        ) : error ? (
          <div className="text-sm text-[#E4626F]">{error}</div>
        ) : users.length === 0 ? (
          <div className="text-sm text-black">No recent attendance found.</div>
        ) : (
          users.map((u) => {
            const name = (u.full_name && String(u.full_name).trim().length > 0)
              ? String(u.full_name).trim()
              : `${(u.firstname || '').trim()} ${(u.lastname || '').trim()}`.trim() || '-';
            return (
              <div
                key={u.id}
                className="bg-white rounded-lg p-4 shadow-sm border border-[#C4B89D] border-opacity-60"
                style={{ borderWidth: '0.6px' }}
              >
                {/* Header ID (mirroring ticket number style) */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-800 text-sm">{u.id || '-'}</span>
                  {/* Right side left intentionally empty to keep layout consistent without adding new features */}
                  <span className="text-xs font-medium px-4 py-1 rounded-full bg-[#D5DBDB] text-black/70 tracking-wide">EMP</span>
                </div>
                {/* Details */}
                <div className="space-y-4 mb-2">
                  {/* Employee Row */}
                  <div className="grid grid-cols-[16px_95px_8px_1fr] gap-x-2 items-start">
                    <User className="h-4 w-4 text-[#C72030] flex-shrink-0 mt-[2px]" />
                    <span className="text-sm font-medium text-gray-700 leading-snug">Employee</span>
                    <span className="text-sm text-gray-700 leading-snug">:</span>
                    <span
                      className="text-sm text-gray-900 font-semibold leading-snug break-words"
                      style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                    >
                      {name}
                    </span>
                  </div>
                  {/* Department Row */}
                  <div className="grid grid-cols-[16px_95px_8px_1fr] gap-x-2 items-start">
                    <Building2 className="h-4 w-4 text-[#C72030] flex-shrink-0 mt-[2px]" />
                    <span className="text-sm font-medium text-gray-700 leading-snug">Department</span>
                    <span className="text-sm text-gray-700 leading-snug">:</span>
                    <span className="text-sm text-gray-900 leading-snug break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{u.department_name || '-'}</span>
                  </div>
                </div>
                {/* Footer Action */}
                <div className="flex justify-end mt-4">
                  <button
                    className="text-sm font-medium underline hover:opacity-80"
                    style={{ color: '#c72030' }}
                    onClick={() => viewDetails(u.id)}
                  >
                    View Details »
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