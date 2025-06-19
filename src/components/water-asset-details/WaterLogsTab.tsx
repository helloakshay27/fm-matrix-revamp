
import React from 'react';

export const WaterLogsTab = () => {
  const logEntries = [
    {
      id: 1,
      reason: "PMI is model/ Serial Changed",
      details: {
        modelNo: "",
        purchasedOn: "",
        building: "",
        wing: "",
        floor: "",
        area: "",
        group: "",
        serialNo: "",
        capacity: "",
        breakdown: "",
        meterCategory: "",
        meterType: "",
      },
      changes: {
        fromNA: "Changed to:7805",
        fromNAChanged: "to:01/04/2024",
        fromBuilding: "Changed to:Sarova",
        fromWing: "Changed to:SW1",
        fromFloor: "Changed to:FW1",
        fromArea: "Changed to:AW1",
        fromPrevious: "Changed to:Electrical",
        fromSN: "Changed to:540",
        fromCapacity: "Changed to:NA",
        fromPrevious2: "Changed to:NA",
        fromWater: "Changed to:NA",
        fromNA2: "Changed to:Sub Meter"
      },
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      reason: "Unique Meter made before Changes",
      details: {
        name: "",
        meterCategory: "",
        meterCategoryId: ""
      },
      changes: {
        fromPrevious: "Changed to:Borewell",
        fromElectricity: "Changed to:Water meter",
        from1S: "Changed to:1"
      },
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      reason: "demo demo Created this asset",
      avatar: "/placeholder.svg"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
          <span className="text-white text-xs">📄</span>
        </div>
        <h3 className="text-lg font-semibold text-[#C72030] uppercase">LOGS</h3>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        Showing the asset in
      </div>
      
      <div className="text-sm font-medium mb-4">
        Reason:
      </div>

      <div className="space-y-6">
        {logEntries.map((entry) => (
          <div key={entry.id} className="flex gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="w-12 h-12 bg-orange-300 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">👤</span>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="text-blue-600 text-sm mb-2 cursor-pointer">
                {entry.reason}
              </div>
              
              <div className="grid grid-cols-2 gap-8 text-sm">
                <div className="space-y-1">
                  {Object.entries(entry.details || {}).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="text-gray-700 min-w-24">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                      <span className="text-gray-600 ml-2">{value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-1">
                  {Object.entries(entry.changes || {}).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="text-blue-600">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                      <span className="text-blue-600 ml-2">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
