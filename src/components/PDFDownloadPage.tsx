import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Download as DownloadIcon, CalendarRange, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const validateRange = () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return false;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date must be before or equal to end date.');
      return false;
    }
    setError('');
    return true;
  };

  const onView = () => {
    if (!validateRange()) return;
    navigate(`/thepdf?start_date=${startDate}&end_date=${endDate}`);
  };

  // const onDownload = () => {
  //   if (!validateRange()) return;
  //   const params = `start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}&auto=1`;
  //   const w = window.open(`/thepdf?${params}`, '_blank', 'noopener,noreferrer,width=1200,height=900');
  //   // if (!w) {
  //   //   setError('Popup blocked. Please allow popups for this site and try again.');
  //   //   return;
  //   // }
  //   try { w.focus(); } catch { /* noop */ }
  // };

  const onDownload = () => {
    if (!validateRange()) return;
    const params = `start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}&auto=1`;
    const w = window.open(`/thepdf?${params}`, '_blank', 'noopener,noreferrer');
    try {
      w?.focus();
    } catch {
      /* noop */
    }
  };


  // Weekly download (assumes /weeklypdf supports auto=1 like monthly endpoint)
  // const onWeeklyDownload = () => {
  //   setError('');
  //   const w = window.open('/weeklypdf?auto=1', '_blank', 'noopener,noreferrer,width=1200,height=900');
  //   try { w?.focus(); } catch { /* noop */ }
  // };

  const onWeeklyDownload = () => {
    setError('');
    const w = window.open('/weeklypdf?auto=1', '_blank', 'noopener,noreferrer');
    try {
      w?.focus();
    } catch {
      /* noop */
    }
  };

  // Daily report open and download
  const onDailyView = () => {
    setError('');
    navigate('/dailypdf');
  };

  const onDailyDownload = () => {
    setError('');
    const w = window.open('/dailypdf?auto=1', '_blank', 'noopener,noreferrer');
    try { w?.focus(); } catch { /* noop */ }
  };



  // Quick range helpers
  const applyRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days + 1);
    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
  };

  return (
    <div className="p-4 sm:p-6 mx-auto ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">REPORT PDF GENERATOR</h1>
          <p className="text-sm text-gray-600 mt-1">Generate and download period based PDF or weekly summaries.</p>
        </div>
      </div>
{/* 
      <div className="bg-white rounded-lg border mt-6 mb-6">
        <div className="flex p-4 items-center border-b">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
            <Clock className="w-5 h-5 text-[#C72030]" />
          </div>
          <h2 className="text-lg font-bold">DAILY REPORT</h2>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <p className="text-sm text-gray-600 max-w-2xl">View or download the Daily Report. Download opens the page and triggers print automatically.</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={onDailyView} className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex items-center gap-2">
              <Eye className="w-4 h-4" /> View Daily Report
            </Button>
            <Button onClick={onDailyDownload} variant="outline" className="border-[#C72030] text-[#C72030] hover:bg-[#EDEAE3] flex items-center gap-2">
              <DownloadIcon className="w-4 h-4" /> Download Daily
            </Button>
          </div>
        </div>
      </div> */}

            {/* Weekly Report Card */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="flex p-4 items-center border-b">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
            <Clock className="w-5 h-5 text-[#C72030]" />
          </div>
          <h2 className="text-lg font-bold">WEEKLY REPORT</h2>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <p className="text-sm text-gray-600 max-w-2xl">View or download the consolidated weekly PDF report generated from rolling weekly metrics.</p>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => navigate('/weeklypdf')}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex items-center gap-2"
            >
              <Eye className="w-4 h-4" /> View Weekly Report
            </Button>
            <Button
              onClick={onWeeklyDownload}
              variant="outline"
              className="border-[#C72030] text-[#C72030] hover:bg-[#EDEAE3] flex items-center gap-2"
            >
              <DownloadIcon className="w-4 h-4" /> Download Weekly
            </Button>
          </div>
        </div>
      </div>

      {/* Date Range Card */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="flex p-4 items-center border-b">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
            <CalendarRange className="w-5 h-5 text-[#C72030]" />
          </div>
          <h2 className="text-lg font-bold">MONTHLY REPORT</h2>
        </div>
        <div className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 font-medium">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030]/40 focus:border-[#C72030]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 font-medium">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030]/40 focus:border-[#C72030]"
              />
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              <Button
                onClick={onView}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-10 px-4 flex items-center gap-2 shadow-sm"
              >
                <Eye className="w-4 h-4" /> View
              </Button>
              <Button
                onClick={onDownload}
                variant="outline"
                className="border-[#C72030] text-[#C72030] hover:bg-[#EDEAE3] h-10 px-4 flex items-center gap-2"
              >
                <DownloadIcon className="w-4 h-4" /> Download
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs items-center">
            <span className="text-gray-500 mr-2 font-medium">Quick Ranges:</span>
            {[
              { label: 'Last 7 Days', days: 7 },
              { label: 'Last 15 Days', days: 15 },
              { label: 'Last 30 Days', days: 30 },
              { label: 'This Month', days: new Date().getDate() },
            ].map(r => (
              <button
                key={r.label}
                type="button"
                onClick={() => applyRange(r.days)}
                className="px-3 py-1 rounded-full border border-gray-300 bg-white hover:border-[#C72030] hover:text-[#C72030] transition text-[11px] font-medium"
              >
                {r.label}
              </button>
            ))}
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <p className="text-gray-500 text-xs leading-relaxed">Choose a start and end date then click View to open a new tab with the generated PDF. Download opens the PDF in a new tab and triggers the save dialog automatically.</p>
        </div>
      </div>



      {/* Daily Report Card */}

    </div>
  );
};

export default PDFDownloadPage;