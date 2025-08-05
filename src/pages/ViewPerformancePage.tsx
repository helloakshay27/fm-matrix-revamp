
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

// Helper to get last month's start and end dates in yyyy-mm-dd and dd/mm/yyyy
function getLastMonthRange() {
  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayLastMonth = new Date(firstDayThisMonth.getTime() - 1);
  const firstDayLastMonth = new Date(lastDayLastMonth.getFullYear(), lastDayLastMonth.getMonth(), 1);
  // Format as yyyy-mm-dd and dd/mm/yyyy
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy_mm_dd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const dd_mm_yyyy = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  return {
    start: yyyy_mm_dd(firstDayLastMonth),
    end: yyyy_mm_dd(lastDayLastMonth),
    startDMY: dd_mm_yyyy(firstDayLastMonth),
    endDMY: dd_mm_yyyy(lastDayLastMonth),
  };
}

function formatDateInput(date: string) {
  // Accepts yyyy-mm-dd or dd/mm/yyyy, returns yyyy-mm-dd
  if (date.includes('/')) {
    const [dd, mm, yyyy] = date.split('/');
    return `${yyyy}-${mm}-${dd}`;
  }
  return date;
}

function formatDMY(date: string) {
  // Accepts yyyy-mm-dd, returns dd/mm/yyyy
  if (date.includes('-')) {
    const [yyyy, mm, dd] = date.split('-');
    return `${dd}/${mm}/${yyyy}`;
  }
  return date;
}

export const ViewPerformancePage = () => {
  const location = useLocation();
  // Get custom_form_code and asset_id from navigation state or query param
  const customFormCode = location.state?.formCode || location.state?.custom_form_code;
  // asset_id will be selected from dropdown, but can default to first in task_options

  // Date state
  const lastMonth = getLastMonthRange();
  const [startDate, setStartDate] = useState(lastMonth.start);
  const [endDate, setEndDate] = useState(lastMonth.end);
  const [selectedTaskId, setSelectedTaskId] = useState<string | number>('');
  const [dropdownOptions, setDropdownOptions] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch performance data
  const fetchPerformance = async (params?: { start?: string, end?: string, asset_id?: string | number }) => {
    if (!customFormCode) return;
    setLoading(true);
    setError(null);
    try {
      // Use params or state
      const startDMY = params?.start ? formatDMY(params.start) : formatDMY(startDate);
      const endDMY = params?.end ? formatDMY(params.end) : formatDMY(endDate);
      const assetId = params?.asset_id || selectedTaskId;
      const url = `${API_CONFIG.BASE_URL}/pms/custom_forms/${customFormCode}/performance.json?q[start_date_gteq]=${startDMY}&q[start_date_lteq]=${endDMY}&asset_id=${assetId}&access_token=${API_CONFIG.TOKEN}`;
      const res = await fetch(url, {
        headers: {
          Authorization: getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch performance data');
      const data = await res.json();
      setPerformanceData(data);
      // Set dropdown options and default selected
      if (data.task_options && data.task_options.length > 0) {
        setDropdownOptions(data.task_options);
        const selected = data.task_options.find((t: any) => t.selected) || data.task_options[0];
        setSelectedTaskId(selected.task_of_id);
      }
    } catch (e: any) {
      setError(e.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // On mount, fetch with default last month and first asset
  useEffect(() => {
    fetchPerformance();
    // eslint-disable-next-line
  }, [customFormCode]);

  // On dropdown change, refetch
  useEffect(() => {
    if (selectedTaskId && performanceData) {
      fetchPerformance({ asset_id: selectedTaskId });
    }
    // eslint-disable-next-line
  }, [selectedTaskId]);

  // Handlers
  const handleApply = () => {
    fetchPerformance({ start: startDate, end: endDate, asset_id: selectedTaskId });
  };
  const handleReset = () => {
    setStartDate(lastMonth.start);
    setEndDate(lastMonth.end);
    if (dropdownOptions.length > 0) {
      setSelectedTaskId(dropdownOptions[0].task_of_id);
    }
    fetchPerformance({ start: lastMonth.start, end: lastMonth.end, asset_id: dropdownOptions[0]?.task_of_id });
  };

  // Table data
  const tableData = performanceData?.table_data;
  const dateHeaders = tableData?.date_headers || [];
  const activities = tableData?.activities || [];
  const assetName = performanceData?.asset_name || '';
  const formName = performanceData?.form_name || '';

  return (
    <div className="p-6 mx-auto">
      <div className="flex gap-4 mb-4 items-center">
        <Input type="date" className="w-48 border border-gray-300 rounded" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <Input type="date" className="w-48 border border-gray-300 rounded" value={endDate} onChange={e => setEndDate(e.target.value)} />
        {/* Dropdown for task/asset */}
        <select
          className="w-64 border border-gray-300 rounded px-2 py-2"
          value={selectedTaskId}
          onChange={e => setSelectedTaskId(e.target.value)}
        >
          {dropdownOptions.map(opt => (
            <option key={opt.task_of_id} value={opt.task_of_id}>{opt.name}</option>
          ))}
        </select>
        <Button className="bg-green-600 text-white px-6" onClick={handleApply}>Apply</Button>
        <Button className="bg-yellow-500 text-white px-6" onClick={handleReset}>Reset</Button>
        {/* Export, Verify, Download can be implemented as needed */}
        <Button className="bg-[#3B82F6] text-white px-6" onClick={async () => {
          if (!customFormCode || !selectedTaskId) return;
          // Use current date range in dd/mm/yyyy
          const startDMY = formatDMY(startDate);
          const endDMY = formatDMY(endDate);
          const url = `${API_CONFIG.BASE_URL}/pms/custom_forms/${customFormCode}/export_performance?asset_id=${selectedTaskId}&q[start_date_gteq]=${encodeURIComponent(startDMY)}&q[start_date_lteq]=${encodeURIComponent(endDMY)}&access_token=${API_CONFIG.TOKEN}`;
          try {
            const res = await fetch(url, {
              headers: {
                Authorization: getAuthHeader(),
              },
            });
            if (!res.ok) throw new Error('Failed to export performance data');
            const blob = await res.blob();
            // Try to get filename from content-disposition
            let filename = 'performance_export.xlsx';
            const disposition = res.headers.get('content-disposition');
            if (disposition && disposition.indexOf('filename=') !== -1) {
              filename = disposition.split('filename=')[1].replace(/"/g, '').trim();
            }
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
          } catch (e: any) {
            alert(e.message || 'Export failed');
          }
        }}>Export</Button>
        {/* <Button className="bg-[#2563EB] text-white px-6">Verify</Button>
        <Button className="bg-[#2563EB] text-white px-6">Download</Button> */}
      </div>
      <h2 className="text-xl font-bold mb-2 text-black">{formName || 'Performance Checklist'}</h2>
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="overflow-x-auto">
        <Table className="min-w-full border border-gray-300">
          <TableHeader>
            <TableRow>
              <TableHead className="bg-[#334155] text-center border-r border-gray-300">Asset Name</TableHead>
              <TableHead className="bg-[#334155] text-center border-r border-gray-300">Activity</TableHead>
              {dateHeaders.map((date: any, idx: number) => (
                <TableHead key={idx} className="bg-[#F3F4F6] text-gray-900 text-center border-r border-gray-300">{date.date_formatted || date.date}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Asset row */}
            <TableRow>
              <TableCell className="border-r border-gray-300 text-center font-semibold">{assetName}</TableCell>
              <TableCell className="border-r border-gray-300"></TableCell>
              {dateHeaders.map((_, idx: number) => (
                <TableCell key={idx} className="border-r border-gray-300"></TableCell>
              ))}
            </TableRow>
            {/* Activities */}
            {activities.map((activity: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell className="border-r border-gray-300"></TableCell>
                <TableCell className="border-r border-gray-300 text-left">{activity.label}</TableCell>
                {activity.date_data.map((dateObj: any, dIdx: number) => (
                  <TableCell key={dIdx} className="border-r border-gray-300">
                    {/* If there are time slots, show value(s) */}
                    {dateObj.time_slot_data && dateObj.time_slot_data.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {dateObj.time_slot_data.map((slot: any, sIdx: number) => (
                          <div key={sIdx} className="text-xs">
                            <span className="font-semibold">{slot.time_slot}:</span> {slot.value ?? '-'}
                            {slot.comment && <span className="ml-1 text-gray-400">({slot.comment})</span>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ViewPerformancePage;
