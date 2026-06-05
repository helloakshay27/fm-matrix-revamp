import React, { useMemo } from "react";

type DateRange = { startDate: Date; endDate: Date };

interface MeetingRoomUtilizationCardProps {
  data: any;
  dateRange?: DateRange;
}

const getCellColor = (range: string): string => {
  if (range === "Less 30%" || range === "30%-39%") return "#E3909026";
  if (range === "40%-50%" || range === "50%-60%" || range === "60%-69%") return "#EFEFFB";
  return "#F6F4EE";
};

const parseRange = (label: string) => {
  if (!label || typeof label !== "string")
    return { min: -Infinity, max: Infinity };
  const lessMatch = label.match(/Less\s*(\d+)%?/i);
  if (lessMatch) {
    const max = Number(lessMatch[1]);
    return { min: -Infinity, max };
  }
  const rangeMatch = label.match(/(\d+)[^\d]*(\d+)?/);
  if (rangeMatch) {
    const a = Number(rangeMatch[1]);
    const b = rangeMatch[2] ? Number(rangeMatch[2]) : a;
    return { min: a, max: b };
  }
  return { min: -Infinity, max: Infinity };
};

export const MeetingRoomUtilizationCard: React.FC<
  MeetingRoomUtilizationCardProps
> = ({ data }) => {
  const centerList = useMemo(() => {
    const apiCenters =
      data?.data?.center_utilization_data ??
      data?.center_utilization_data ??
      null;
    return Array.isArray(apiCenters) ? apiCenters : [];
  }, [data]);

  const rangeList = useMemo(() => {
    const ranges =
      data?.data?.utilization_ranges ?? data?.utilization_ranges ?? null;
    if (ranges && typeof ranges === "object") return Object.keys(ranges);
    return [] as string[];
  }, [data]);

  const getRoomsForRange = (center: any, rangeLabel: string) => {
    const rooms = center?.rooms ?? [];
    if (!Array.isArray(rooms) || rooms.length === 0) return "";
    const { min, max } = parseRange(rangeLabel);
    const matched = rooms
      .filter((r: any) => {
        const pct = Number(
          r.utilization_percentage ?? r.utilization_percentage_percentage ?? NaN
        );
        if (Number.isNaN(pct)) return false;
        return pct >= min && pct <= max;
      })
      .map((r: any) => r.room_name || "")
      .filter(Boolean);
    return matched.join(", ");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3
          className="text-base font-semibold text-gray-900"
          style={{ fontFamily: "Work Sans, sans-serif" }}
        >
          Center Wise - Meeting Room Utilization
        </h3>
        <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm border border-gray-200" style={{ backgroundColor: '#E3909026' }} />
            0–39%
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm border border-gray-200" style={{ backgroundColor: '#EFEFFB' }} />
            40–69%
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm border border-gray-200" style={{ backgroundColor: '#F6F4EE' }} />
            70–100%
          </div>
        </div>
      </div>
      <div className="p-5">
        {centerList.length === 0 || rangeList.length === 0 ? (
          <div className="text-sm text-gray-600">
            No utilization data available.
          </div>
        ) : (
          <div className="border border-gray-300">
            {centerList.map((center: any, siteIndex: number) => (
              <div
                key={siteIndex}
                className="grid grid-cols-9 border-b border-gray-300"
              >
                <div className="p-3 font-medium text-sm text-right border-b border-gray-300 bg-[#F6F4EE]">
                  {center.center_name ||
                    center.site_name ||
                    center.name ||
                    `Center ${siteIndex + 1}`}
                </div>
                {rangeList
                  .slice(0, 8)
                  .map((range: string, rangeIndex: number) => {
                    const roomName = getRoomsForRange(center, range);
                    const cellColor = getCellColor(range);
                    return (
                      <div
                        key={rangeIndex}
                        className="border-l border-t border-gray-300 p-2 text-xs font-semibold text-center min-h-[80px] flex items-center justify-center"
                        style={{ backgroundColor: cellColor }}
                      >
                        {roomName ? (
                          <div className="leading-tight">
                            {roomName.includes(",")
                              ? roomName
                                  .split(",")
                                  .map((name: string, i: number) => (
                                    <div key={i}>{name.trim()}</div>
                                  ))
                              : roomName}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
              </div>
            ))}
            <div className="grid grid-cols-9">
              <div className="p-3 font-semibold text-center"></div>
              {rangeList.slice(0, 8).map((range, index) => (
                <div
                  key={index}
                  className="border-t border-l border-gray-300 p-2 text-xs font-semibold text-center min-h-[40px] flex items-center justify-center"
                >
                  {range}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="px-4 py-3 text-xs text-gray-600 border-t">
        Note: This table presents meeting room-wise utilization along with
        corresponding utilization percentages, providing a center-wise
        comparison.
      </div>
    </div>
  );
};

export default MeetingRoomUtilizationCard;
