import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, format } from 'date-fns'

const WeekProgressPicker = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [weekData, setWeekData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetchWeekProgress(startDate);
  }, [startDate]);

  // Simulated API call
  const fetchWeekProgress = async (date) => {
    try {
      const startDateStr = format(date, 'yyyy-MM-dd');

      // Replace this with your real API
      const response = await simulateApiCall(startDateStr);
      // const response = await fetch(`https://your-api.com/progress?start_date=${startDateStr}`);
      // const json = await response.json();
      // [
      //   { "date": "2025-06-01", "percentage": 40 },
      //   ...
      // ]


      const data = response.map((item) => {
        const dateObj = new Date(item.date);
        return {
          day: format(dateObj, 'EEE').charAt(0),
          date: format(dateObj, 'dd'),
          percent: item.percentage,
        };
      });

      setWeekData(data);
      setSelectedIndex(0);
    } catch (err) {
      console.error('Failed to load progress data:', err);
    }
  };

  // Simulated API response (you can replace this with real API fetch)
  const simulateApiCall = async (startDateStr) => {
    const start = new Date(startDateStr);
    const percentages = [0, 40, 80];

    return new Promise((resolve) => {
      const result = Array.from({ length: 7 }).map((_, i) => ({
        date: format(addDays(start, i), 'yyyy-MM-dd'),
        percentage: percentages[Math.floor(Math.random() * percentages.length)],
      }));
      setTimeout(() => resolve(result), 500); // Simulate network delay
    });
  };

  const getBadgeColor = (percent) => {
    if (percent === 0) return 'bg-gray-300 text-gray-600';
    if (percent <= 40) return 'bg-green-400 text-white';
    return 'bg-red-400 text-white';
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 p-4 border rounded-lg">
      <label className="block text-sm font-medium mb-2">Pick a Start Date</label>
      {/* <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        className="border px-2 py-1 rounded mb-4 d-none"
        dateFormat="yyyy-MM-dd"
      /> */}

      <div className="flex items-center gap-3 overflow-x-auto">
        <button type='button' className="p-2" onClick={() => setStartDate(addDays(startDate, -7))}>
          <ChevronLeft size={20} />
        </button>

        {weekData.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`flex flex-col items-center cursor-pointer px-2 py-1 rounded-lg min-w-[40px] ${selectedIndex === index ? 'border border-red-400' : ''
              }`}
          >
            <span className="text-xs font-medium">{item.day}</span>
            <span className="text-sm">{item.date}</span>
            <div
              className={`mt-1 text-xs px-2 py-1 rounded-full ${getBadgeColor(item.percent)}`}
            >
              {item.percent === 0 ? 'OFF' : `${item.percent}%`}
            </div>
          </div>
        ))}

        <button type='button' className="p-2" onClick={() => setStartDate(addDays(startDate, 7))}>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default WeekProgressPicker;
