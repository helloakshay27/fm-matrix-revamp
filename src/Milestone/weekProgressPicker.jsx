// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { addDays, format } from 'date-fns'

// const WeekProgressPicker = () => {
//   const [startDate, setStartDate] = useState(new Date());
//   const [weekData, setWeekData] = useState([]);
//   const [selectedIndex, setSelectedIndex] = useState(0);

//   useEffect(() => {
//     fetchWeekProgress(startDate);
//   }, [startDate]);

//   // Simulated API call
//   const fetchWeekProgress = async (date) => {
//     try {
//       const startDateStr = format(date, 'yyyy-MM-dd');

//       // Replace this with your real API
//       const response = await simulateApiCall(startDateStr);
//       // const response = await fetch(`https://your-api.com/progress?start_date=${startDateStr}`);
//       // const json = await response.json();
//       // [
//       //   { "date": "2025-06-01", "percentage": 40 },
//       //   ...
//       // ]


//       const data = response.map((item) => {
//         const dateObj = new Date(item.date);
//         return {
//           day: format(dateObj, 'EEE').charAt(0),
//           date: format(dateObj, 'dd'),
//           percent: item.percentage,
//         };
//       });

//       setWeekData(data);
//       setSelectedIndex(0);
//     } catch (err) {
//       console.error('Failed to load progress data:', err);
//     }
//   };

//   // Simulated API response (you can replace this with real API fetch)
//   const simulateApiCall = async (startDateStr) => {
//     const start = new Date(startDateStr);
//     const percentages = [0, 40, 80];

//     return new Promise((resolve) => {
//       const result = Array.from({ length: 7 }).map((_, i) => ({
//         date: format(addDays(start, i), 'yyyy-MM-dd'),
//         percentage: percentages[Math.floor(Math.random() * percentages.length)],
//       }));
//       setTimeout(() => resolve(result), 500); // Simulate network delay
//     });
//   };

//   const getBadgeColor = (percent) => {
//     if (percent === 0) return 'bg-gray-300 text-gray-600';
//     if (percent <= 40) return 'bg-green-400 text-white';
//     return 'bg-red-400 text-white';
//   };

//   return (
//     <div className="w-full max-w-3xl mx-auto mt-6 p-4 border rounded-lg">
//       <label className="block text-sm font-medium mb-2">Pick a Start Date</label>
//       {/* <DatePicker
//         selected={startDate}
//         onChange={(date) => setStartDate(date)}
//         className="border px-2 py-1 rounded mb-4 d-none"
//         dateFormat="yyyy-MM-dd"
//       /> */}

//       <div className="flex items-center gap-3 overflow-x-auto">
//         <button type='button' className="p-2" onClick={() => setStartDate(addDays(startDate, -7))}>
//           <ChevronLeft size={20} />
//         </button>

//         {weekData.map((item, index) => (
//           <div
//             key={index}
//             onClick={() => setSelectedIndex(index)}
//             className={`flex flex-col items-center cursor-pointer px-2 py-1 rounded-lg min-w-[40px] ${selectedIndex === index ? 'border border-red-400' : ''
//               }`}
//           >
//             <span className="text-xs font-medium">{item.day}</span>
//             <span className="text-sm">{item.date}</span>
//             <div
//               className={`mt-1 text-xs px-2 py-1 rounded-full ${getBadgeColor(item.percent)}`}
//             >
//               {item.percent === 0 ? 'OFF' : `${item.percent}%`}
//             </div>
//           </div>
//         ))}

//         <button type='button' className="p-2" onClick={() => setStartDate(addDays(startDate, 7))}>
//           <ChevronRight size={20} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default WeekProgressPicker;



import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, format } from 'date-fns';

const WeekProgressPicker = ({ onDateSelect, selectedDate }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [weekData, setWeekData] = useState([]);

  useEffect(() => {
    fetchWeekProgress(startDate);
  }, [startDate]);

  const fetchWeekProgress = async (date) => {
    try {
      const startDateStr = format(date, 'yyyy-MM-dd');
      const response = await simulateApiCall(startDateStr);
      const data = response.map((item) => {
        const dateObj = new Date(item.date);
        return {
          fullDate: item.date, // Store the full date (e.g., "2025-06-01")
          day: format(dateObj, 'EEE').charAt(0),
          date: format(dateObj, 'dd'),
          percent: item.percentage,
        };
      });
      setWeekData(data);
    } catch (err) {
      console.error('Failed to load progress data:', err);
    }
  };

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
    <div className="w-full max-w-3xl mx-auto  mt-3  rounded-lg">
      <label className="block text-sm font-medium mb-2"> End Date</label>
      <div className="flex items-center gap-3 overflow-x-auto">
        <button
          type="button"
          className="p-2"
          onClick={() => setStartDate(addDays(startDate, -7))}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.48756 2.5646L5.45293 6.66398C5.36445 6.75342 5.31481 6.87416 5.31481 6.99998C5.31481 7.12579 5.36445 7.24653 5.45293 7.33598L9.48668 11.4354C9.57512 11.5253 9.62468 11.6465 9.62468 11.7727C9.62468 11.8988 9.57512 12.02 9.48668 12.11C9.44348 12.1543 9.39184 12.1895 9.33481 12.2136C9.27778 12.2376 9.21651 12.25 9.15462 12.25C9.09273 12.25 9.03146 12.2376 8.97443 12.2136C8.9174 12.1895 8.86576 12.1543 8.82256 12.11L4.78881 8.01148C4.52375 7.74152 4.37524 7.37831 4.37524 6.99998C4.37524 6.62165 4.52375 6.25843 4.78881 5.98848L8.82256 1.88997C8.86578 1.84552 8.91747 1.81019 8.97458 1.78606C9.03169 1.76193 9.09306 1.7495 9.15506 1.7495C9.21706 1.7495 9.27843 1.76193 9.33554 1.78606C9.39265 1.81019 9.44434 1.84552 9.48756 1.88997C9.576 1.97997 9.62556 2.10111 9.62556 2.22729C9.62556 2.35347 9.576 2.4746 9.48756 2.5646Z" fill="black" />
          </svg>

        </button>

        {weekData.map((item, index) => (
          <div
            key={index}
            onClick={() => onDateSelect(item.fullDate)}
            className={`flex flex-col items-center cursor-pointer p-3 py-1 rounded-lg min-w-[40px] ${selectedDate === item.fullDate ? 'border border-black-400  bg-gray-100 ' : ''
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

        <button
          type="button"
          className="p-2"
          onClick={() => setStartDate(addDays(startDate, 7))}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.51232 2.5646L8.54694 6.66398C8.63543 6.75342 8.68506 6.87416 8.68506 6.99998C8.68506 7.12579 8.63543 7.24653 8.54694 7.33598L4.51319 11.4354C4.42475 11.5253 4.3752 11.6465 4.3752 11.7727C4.3752 11.8988 4.42475 12.02 4.51319 12.11C4.5564 12.1543 4.60804 12.1895 4.66507 12.2136C4.7221 12.2376 4.78336 12.25 4.84526 12.25C4.90715 12.25 4.96842 12.2376 5.02545 12.2136C5.08248 12.1895 5.13411 12.1543 5.17732 12.11L9.21107 8.01148C9.47613 7.74152 9.62463 7.37831 9.62463 6.99998C9.62463 6.62165 9.47613 6.25843 9.21107 5.98848L5.17732 1.88997C5.1341 1.84552 5.08241 1.81019 5.0253 1.78606C4.96819 1.76193 4.90682 1.7495 4.84482 1.7495C4.78282 1.7495 4.72145 1.76193 4.66434 1.78606C4.60723 1.81019 4.55554 1.84552 4.51232 1.88997C4.42388 1.97997 4.37432 2.10111 4.37432 2.22729C4.37432 2.35347 4.42388 2.4746 4.51232 2.5646Z" fill="black" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WeekProgressPicker;