import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDailyReport } from "../context/DailyReportContext";

export const CalendarCard = () => {
  const {
    formattedSelectedDate,
    isAbsent,
    setIsAbsent,
    markDraftDirty,
    days,
    handlePrevWeek,
    handleNextWeek,
    isDragging,
    hasDraggedRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    startDate,
    getNextWorkingDay,
    tomorrowScheduledItems,
    handleSelectDate,
    selfRating,
    setSelfRating,
  } = useDailyReport();

  return (
    <div className="bc-daily-card">
      <div className="bc-daily-card-header">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-[#1a1a1a]">
            Daily Report for {formattedSelectedDate}
          </span>
        </div>
        <button
          type="button"
          className="bc-absent-btn"
          onClick={() => {
            markDraftDirty();
            setIsAbsent(!isAbsent);
          }}
        >
          <Checkbox
            checked={isAbsent}
            className="h-4 w-4 rounded border-[#DA7756]/50 data-[state=checked]:bg-[#DA7756] data-[state=checked]:border-[#DA7756]"
            onCheckedChange={() => {}}
          />
          Mark as Absent
        </button>
      </div>
      <div className="bc-daily-card-body">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
          <button
            onClick={handlePrevWeek}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 flex-shrink-0 transition-colors"
          >
            <ChevronLeft size={13} />
          </button>
          <div
            className="flex-1 flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar"
            style={{
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: "none",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            {days.map((item, index) => {
              let cardBg = "#F5F5F5";
              let borderColor = "transparent";
              let topBarColor = "transparent";

              if (item.type === "filled") {
                topBarColor = "#61CDBB";
              } else if (item.type === "missed" && !item.isToday) {
                topBarColor = "#E28B8B";
              } else if (item.type === "holiday") {
                topBarColor = "#D1D5DB";
              }

              const isSelected = startDate === item.fullDate;
              const nextWorkDay = getNextWorkingDay(startDate);
              const hasScheduledForDay =
                item.fullDate === nextWorkDay &&
                tomorrowScheduledItems.length > 0;
              const showUpcomingDot =
                item.isFuture &&
                item.type !== "holiday" &&
                (hasScheduledForDay || item.type === "upcoming");

              if (isSelected) {
                cardBg = "#FFFFFF";
                borderColor = "#DA7756";
              }

              return (
                <div
                  key={index}
                  onClick={() =>
                    !hasDraggedRef.current &&
                    !item.isFuture &&
                    item.type !== "holiday" &&
                    handleSelectDate(item)
                  }
                  className="shrink-0 w-[46px] sm:w-auto sm:flex-1 flex flex-col items-center justify-center cursor-pointer rounded-[12px] relative"
                  style={{
                    background: cardBg,
                    border: isSelected
                      ? `1.5px solid ${borderColor}`
                      : "1.5px solid transparent",
                    padding: "6px 2px",
                    minHeight: "60px",
                    opacity:
                      item.isFuture && item.type !== "holiday" ? 0.6 : 1,
                    cursor:
                      item.isFuture || item.type === "holiday"
                        ? "default"
                        : "pointer",
                  }}
                >
                  {topBarColor !== "transparent" && (
                    <div
                      className="absolute top-0 left-0 right-0 h-2 rounded-t-[12px]"
                      style={{ backgroundColor: topBarColor }}
                    />
                  )}
                  {showUpcomingDot && (
                    <div
                      className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full border border-white"
                      style={{
                        backgroundColor: "#E28B8B",
                        transform: "translate(30%, -30%)",
                      }}
                    />
                  )}
                  <span className="text-[10px] sm:text-[11px] font-medium text-gray-700 mt-1">
                    {item.day}
                  </span>
                  <span className="text-[14px] sm:text-[16px] font-bold text-gray-900 leading-tight">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
          <button
            onClick={handleNextWeek}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 flex-shrink-0 transition-colors"
          >
            <ChevronRight size={13} />
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 mt-6 mb-2 flex-wrap">
          {[
            { color: "#61CDBB", label: "Filled", isCircle: false },
            { color: "#E28B8B", label: "Missed", isCircle: false },
            { color: "#D1D5DB", label: "Holiday", isCircle: false },
            { color: "#E28B8B", label: "Upcoming", isCircle: true },
          ].map(({ color, label, isCircle }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className={`w-2.5 h-2.5 flex-shrink-0 ${isCircle ? "rounded-full" : "rounded-[2px]"}`}
                style={{ backgroundColor: color }}
              />
              <span className="text-[11px] text-gray-500 font-medium">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-5 mt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold text-[#1a1a1a]">
              Self Rating (1-10)
            </Label>
            <span className="text-sm font-bold text-[#DA7756]">
              {selfRating[0]}/10
            </span>
          </div>
          <Slider
            value={selfRating}
            onValueChange={(value) => {
              markDraftDirty();
              setSelfRating(value);
            }}
            max={10}
            step={1}
            className="cursor-pointer [&>span:first-of-type]:h-1.5 [&>span:first-of-type]:bg-[#e5e7eb] [&>span:first-of-type>span]:bg-[#DA7756] [&_[role=slider]]:bg-[#DA7756] [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:shadow-md [&_[role=slider]]:cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
