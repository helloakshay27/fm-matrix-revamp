
import React from 'react';
import { FileText } from 'lucide-react';

export const LogsTab = () => {
  const logEntries = [
    {
      id: 1,
      user: 'Anushree',
      action: 'created an Asset "Dell Laptop"',
      date: '26th Nov, 2020, 12:30 pm'
    },
    {
      id: 2,
      user: 'Rakesh K.',
      action: 'made a visit on "01/01/2021" and updated the Remarks as "Demo Remarks"',
      date: '01st Jan, 2021, 04:19 pm'
    },
    {
      id: 3,
      user: 'Nupura W.',
      action: 'updated the no. of visits to "3"',
      date: '18th Oct, 2021, 10:52 am'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-[#C72030] uppercase">LOGS</h3>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-[#C72030]"></div>
        
        <div className="space-y-8">
          {logEntries.map((entry, index) => (
            <div key={entry.id} className="flex items-start gap-4 relative">
              {/* Timeline dot */}
              <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center z-10 flex-shrink-0">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="bg-white">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-gray-900 text-base leading-relaxed">
                        <span className="font-medium">{entry.user}</span> {entry.action}.
                      </p>
                    </div>
                    <div className="text-gray-400 text-sm whitespace-nowrap">
                      {entry.date}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
