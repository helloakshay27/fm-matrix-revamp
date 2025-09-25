import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Download as DownloadIcon } from 'lucide-react';

const formatDate = (d: Date) => d.toISOString().slice(0, 10);

const PDFDownloadPage: React.FC = () => {
  const navigate = useNavigate();

  const defaults = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start: formatDate(start), end: formatDate(end) };
  }, []);

  const [startDate, setStartDate] = useState<string>(defaults.start);
  const [endDate, setEndDate] = useState<string>(defaults.end);
  const [error, setError] = useState<string>('');

  const onView = () => {
    setError('');
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date must be before or equal to end date.');
      return;
    }
    navigate(`/thepdf?start_date=${startDate}&end_date=${endDate}`);
  };

  const onDownload = () => {
    setError('');
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date must be before or equal to end date.');
      return;
    }
    const params = `start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}&auto=1`;
    const w = window.open(`/thepdf?${params}`, '_blank', 'noopener,noreferrer,width=1200,height=900');
    if (!w) {
      setError('Popup blocked. Please allow popups for this site and try again.');
      return;
    }
    try { w.focus(); } catch {}
  };

  return (
    <div className="p-6 max-w-3xl ">
      <h1 className="text-xl font-semibold mb-4">Report PDF</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Start date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">End date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onView}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap h-10 px-3 text-sm font-medium bg-[#F6F4EE] text-[#C72030] border border-[#C72030] rounded-md shadow-sm w-full md:w-auto"
          >
            <Eye className="w-4 h-4" />
            <span>View PDF</span>
          </button>
          <button
            onClick={onDownload}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap h-10 px-3 text-sm font-medium bg-[#F6F4EE] text-[#C72030] border border-[#C72030] rounded-md  shadow-sm w-full md:w-auto"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
      {error ? <p className="text-red-600 text-sm mt-3">{error}</p> : null}
      <p className="text-gray-500 text-sm mt-6">Use the date range above, then click View PDF to open the full report. The report will load all sections before displaying.</p>
    </div>
  );
};

export default PDFDownloadPage;