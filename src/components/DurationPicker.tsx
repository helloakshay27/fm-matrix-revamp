import { ChevronDown, ChevronUp, Clock, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export const DurationPicker = ({
    value = 0,
    onChange,
    className = "",
    onDateWiseHoursChange,
    startDate,
    endDate,
    disabled = false,
    placeholder = "Select duration",
    resposiblePerson = "Unassigned",
    totalWorkingHours,
    setTotalWorkingHours,
    shift = {},
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [taskType, setTaskType] = useState("standard");
    const [dailyHours, setDailyHours] = useState([]);
    const [daysList, setDaysList] = useState([]);
    const pickerRef = useRef(null);

    const parseHours = (val) => {
        if (!val) return 0;
        if (typeof val === "number") return val;
        if (typeof val === "string" && val.includes(":")) {
            const [h, m] = val.split(":").map(Number);
            if (isNaN(h) || isNaN(m)) return 0;
            return h + m / 60;
        }
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
    };

    const formatTotalHours = (total) => {
        const totalMinutes = Math.round(total * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}:${String(minutes).padStart(2, "0")}`;
    };

    const parseShiftNoOfDays = (shift) => {
        if (!shift || !shift.no_of_days) return null;

        const roasterType = (shift.roaster_type || shift.roasterType || "").toString();

        if (roasterType === "Recurring") {
            let obj = null;
            if (Array.isArray(shift.no_of_days) && typeof shift.no_of_days[0] === "object") {
                obj = shift.no_of_days[0] || {};
            } else if (typeof shift.no_of_days === "object") {
                obj = shift.no_of_days;
            }
            if (!obj) return { roasterType };

            const recurring = {};
            Object.keys(obj).forEach((k) => {
                const arr = Array.isArray(obj[k]) ? obj[k] : [];
                recurring[k] = arr.map((v) => Number(v)).filter(Boolean);
            });

            return { roasterType: "Recurring", recurring };
        }

        const arr = Array.isArray(shift.no_of_days) ? shift.no_of_days : [];
        const working = arr.map((v) => Number(v)).filter(Boolean);
        return { roasterType: roasterType || "Weekdays/Weekends", working };
    };

    const getWeekOfMonth = (date) => {
        const day = date.getDate();
        return Math.floor((day - 1) / 7) + 1;
    };

    const isDateWorking = (date, shift) => {
        const parsed = parseShiftNoOfDays(shift);
        if (!parsed) {
            const jsDay = date.getDay();
            return jsDay !== 0 && jsDay !== 6;
        }

        const jsDay = date.getDay();
        const dayNumber = jsDay === 0 ? 7 : jsDay;

        if (parsed.roasterType === "Recurring") {
            const week = String(getWeekOfMonth(date));
            const arr = parsed.recurring[week] || [];
            return arr.includes(dayNumber);
        }

        // Weekdays/Weekends mode
        return parsed.working.includes(dayNumber);
    };

    /** Generate all days (inclusive) using shift rules to mark working days */
    const getAllDays = (startDate, endDate, shiftInfo) => {
        if (!endDate) return [];

        const start = new Date(startDate?.year, startDate?.month, startDate?.date, 23, 59, 59, 999);
        const end = new Date(endDate?.year, endDate?.month, endDate?.date, 23, 59, 59, 999); // include full day
        if (end < start) return [];

        const days = [];
        const current = new Date(start);

        while (current <= end) {
            const formatted = current.toLocaleDateString("en-GB").replace(/\//g, "-");
            const working = isDateWorking(current, shiftInfo);
            days.push({
                date: new Date(current),
                formatted,
                isWorking: working,
            });
            current.setDate(current.getDate() + 1);
        }

        return days;
    };

    /** ✅ Format local date safely */
    const formatLocalDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
            date.getDate()
        ).padStart(2, "0")}`;
    };

    let hoursPerDay = 8;
    if (!Array.isArray(shift) && shift?.shift) {
        const [startTime, endTime] = shift.shift.split(" to ");

        // If split didn't produce valid start/end, keep default hoursPerDay
        if (!startTime || !endTime) {
            hoursPerDay = 8;
        } else {
            const parseTime = (timeStr) => {
                const [time, modifier] = timeStr.split(" ");
                const [hoursRaw, minutesRaw] = (time || "0:0").split(":").map(Number);
                let hours = Number.isFinite(hoursRaw) ? hoursRaw : 0;
                const minutes = Number.isFinite(minutesRaw) ? minutesRaw : 0;

                if (modifier === "PM" && hours !== 12) hours += 12;
                if (modifier === "AM" && hours === 12) hours = 0;

                return hours + minutes / 60;
            };

            const start = parseTime(startTime);
            const end = parseTime(endTime);

            let breakDuration = 1; // hours
            if (shift.user_shift && (shift.user_shift.break_start_hour != null || shift.user_shift.break_end_hour != null)) {
                const bsH = Number(shift.user_shift.break_start_hour) || 0;
                const bsM = Number(shift.user_shift.break_start_min) || 0;
                const beH = Number(shift.user_shift.break_end_hour) || 0;
                const beM = Number(shift.user_shift.break_end_min) || 0;

                const breakStart = bsH + bsM / 60;
                const breakEnd = beH + beM / 60;

                // Ensure non-negative; if breakEnd < breakStart treat as 0
                breakDuration = Math.max(breakEnd - breakStart, 0);

                // Clamp break to not exceed shift length
                const shiftLength = Math.max(end - start, 0);
                breakDuration = Math.min(breakDuration, shiftLength);
            }

            hoursPerDay = Math.max(end - start - breakDuration, 0);
        }
    }

    /** ✅ When start/end changes */
    useEffect(() => {
        if (taskType === "standard") {
            if (startDate && endDate) {
                const allDays = getAllDays(startDate, endDate, shift);
                const workingDays = allDays.filter((d) => d.isWorking);
                const hrs = workingDays.length * hoursPerDay;

                console.log(hrs)

                setTotalWorkingHours(hrs);
                if (onChange) onChange(hrs);

                // ✅ Send hoursPerDay per working day (as decimal hours)
                if (onDateWiseHoursChange) {
                    const perDayDecimal = parseHours(formatTotalHours(hoursPerDay));
                    const dateWise = workingDays.map((d) => ({
                        hours: perDayDecimal,
                        minutes: 0,
                        date: formatLocalDate(d.date),
                    }));
                    onDateWiseHoursChange(dateWise);
                }

                setDaysList(allDays);
            } else if (startDate || endDate) {
                setTotalWorkingHours(hoursPerDay);
            } else {
                setDaysList([]);
                if (onChange) onChange(0);
                if (onDateWiseHoursChange) onDateWiseHoursChange([]);
            }
        } else {
            // ✅ Flexible logic
            if (endDate) {
                const allDays = getAllDays(startDate, endDate, shift);
                setDaysList(allDays);
                const defaultHours = allDays.map((d) => (d.isWorking ? formatTotalHours(hoursPerDay) : ""));
                setDailyHours(defaultHours);

                const total = defaultHours.reduce((sum, h) => sum + parseHours(h), 0);
                setTotalWorkingHours(total);
                if (onChange) onChange(total);

                if (onDateWiseHoursChange) {
                    const dateWise = allDays.map((d, idx) => ({
                        hours: parseHours(defaultHours[idx]),
                        minutes: 0,
                        date: formatLocalDate(d.date),
                    }));
                    onDateWiseHoursChange(dateWise);
                }
            } else {
                setDaysList([]);
                setDailyHours([]);
                setTotalWorkingHours(0);
                if (onChange) onChange(0);
                if (onDateWiseHoursChange) onDateWiseHoursChange([]);
            }
        }
    }, [startDate, endDate, taskType, shift]);

    /** ✅ Update total & date-wise data when flexible hours change */
    useEffect(() => {
        if (taskType === "flexible") {
            const total = dailyHours.reduce((sum, h) => sum + parseHours(h), 0);
            setTotalWorkingHours(total);
            if (onChange) onChange(total);

            if (onDateWiseHoursChange && daysList.length > 0) {
                const dateWise = daysList.map((d, idx) => ({
                    hours: parseHours(dailyHours[idx]),
                    minutes: 0,
                    date: formatLocalDate(d.date),
                }));
                onDateWiseHoursChange(dateWise);
            }
        }
    }, [dailyHours, taskType]);

    /** ✅ Close picker on outside click */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div className={`relative ${className}`} ref={pickerRef}>
            {/* === Main Button === */}
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                type="button"
                className={`w-full px-4 py-[10px] bg-white border border-gray-300 shadow-sm focus:outline-none rounded transition-colors flex items-center justify-between ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    }`}
            >
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span
                        className={`${totalWorkingHours === 0 ? "text-gray-400" : "text-gray-700 font-medium"
                            }`}
                    >
                        {totalWorkingHours > 0
                            ? `${formatTotalHours(totalWorkingHours)} Hrs${(taskType === "standard" && !startDate && !endDate) ? "/Day" : ""}`
                            : placeholder}
                    </span>
                </div>
                <span className="text-gray-400">
                    {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                </span>
            </button>

            {/* === Dropdown === */}
            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-sm shadow-xl border border-gray-200 py-6 px-3 z-50">
                    {/* Task Type */}
                    <RadioGroup
                        value={taskType}
                        onValueChange={(val) => setTaskType(val)}
                        className="flex gap-3 mb-8"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="standard" id="standard" />
                            <Label htmlFor="standard">Standard</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="flexible" id="flexible" />
                            <Label htmlFor="flexible">Flexible</Label>
                        </div>
                    </RadioGroup>

                    {/* === Flexible Table === */}
                    {taskType === "flexible" ? (
                        !endDate ? (
                            <div className="text-sm text-gray-500 bg-red-100 px-3 py-2 flex items-center gap-2">
                                <Info size={16} /> Please select at least an end date to enable flexible work hours.
                            </div>
                        ) : (
                            <div className="relative w-full overflow-x-auto">
                                <Table className="min-w-full border-collapse">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="sticky left-0 bg-white w-[200px] border-r !z-20">
                                                Owner
                                            </TableHead>
                                            {daysList.map((d, i) => (
                                                <TableHead
                                                    key={i}
                                                    className={`min-w-[120px] text-center ${!d.isWorking ? "bg-gray-100 text-gray-500" : "bg-white"
                                                        }`}
                                                >
                                                    {d.formatted}
                                                </TableHead>
                                            ))}
                                            <TableHead className="sticky right-0 bg-white border-l">Hrs</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="sticky left-0 bg-white border-r font-medium flex items-center gap-2 !pl-2">
                                                <div className="w-[35px] h-[55px] flex items-center justify-center text-sm font-bold">
                                                    <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center !justify-center">
                                                        {resposiblePerson.charAt(0).toUpperCase() || "U"}
                                                    </div>
                                                </div>
                                                {resposiblePerson || "Unassigned"}
                                            </TableCell>

                                            {daysList.map((d, idx) => (
                                                <TableCell
                                                    key={idx}
                                                    className={`text-center bg-white ${!d.isWorking ? "bg-gray-100" : ""
                                                        }`}
                                                >
                                                    <input
                                                        type="text"
                                                        value={dailyHours[idx]}
                                                        onChange={(e) => {
                                                            const input = e.target.value;
                                                            const newHours = [...dailyHours];
                                                            newHours[idx] = input;
                                                            setDailyHours(newHours);
                                                        }}
                                                        disabled={!d.isWorking}
                                                        className={`w-16 border rounded-md text-center py-1 text-sm ${!d.isWorking
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                            : ""
                                                            }`}
                                                    />
                                                    <div className="text-xs text-gray-500 mt-1 !text-center">
                                                        {hoursPerDay > 0 ? ((parseHours(dailyHours[idx]) / hoursPerDay) * 100).toFixed(2) : "0.00"}%
                                                    </div>
                                                </TableCell>
                                            ))}

                                            <TableCell className="sticky right-0 bg-white border-l text-center font-medium">
                                                {formatTotalHours(totalWorkingHours)}h
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        )
                    ) : (
                        <div className="relative w-full overflow-x-auto">
                            <Table className="min-w-full border-collapse">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="sticky left-0 !z-20 bg-white w-[200px] border-r">
                                            Owner
                                        </TableHead>
                                        <TableHead className="min-w-[150px] bg-white">Business Hours</TableHead>
                                        <TableHead className="min-w-[150px] bg-white">Work Hours Per Day</TableHead>
                                        <TableHead className="min-w-[40px] bg-white">Duration</TableHead>
                                        <TableHead className="sticky right-0 z-20 bg-white border-l">
                                            Total Hours
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="text-xs">
                                        <TableCell className="sticky left-0 bg-white border-r font-medium flex items-center gap-2 !pl-0">
                                            <div className="w-[35px] h-[55px] flex items-center justify-center text-sm font-bold">
                                                <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center !justify-center">
                                                    {resposiblePerson.charAt(0).toUpperCase() || "U"}
                                                </div>
                                            </div>
                                            {resposiblePerson || "Unassigned"}
                                        </TableCell>
                                        <TableCell className="bg-white px-2">Standard Business Hours</TableCell>
                                        <TableCell className="!px-2 bg-white">{formatTotalHours(hoursPerDay)} hr/day (100% day)</TableCell>
                                        <TableCell className="bg-white">
                                            {daysList.length > 0
                                                ? `${daysList.filter((d) => d.isWorking).length}d`
                                                : "--"}
                                        </TableCell>
                                        <TableCell className="text-right sticky right-0 bg-white border-l z-10">
                                            {totalWorkingHours > 0
                                                ? `${formatTotalHours(totalWorkingHours)} hrs`
                                                : "--"}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={() => {
                                setDailyHours([]);
                                setDaysList([]);
                                setTotalWorkingHours(0);
                                if (onChange) onChange(0);
                                if (onDateWiseHoursChange) onDateWiseHoursChange([]);
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                            type="button"
                        >
                            Clear
                        </button>
                        <button
                            onClick={() => {
                                if (taskType === "standard") {
                                    setTotalWorkingHours(hoursPerDay);
                                    if (onChange) onChange(hoursPerDay);

                                    if (onDateWiseHoursChange && startDate && endDate) {
                                        const allDays = getAllDays(startDate, endDate, shift);
                                        const workingDays = allDays.filter((d) => d.isWorking);
                                        const perDayDecimal = parseHours(formatTotalHours(hoursPerDay));
                                        const dateWise = workingDays.map((d) => ({
                                            hours: perDayDecimal,
                                            minutes: 0,
                                            date: formatLocalDate(d.date),
                                        }));
                                        onDateWiseHoursChange(dateWise);
                                    }
                                }
                                setIsOpen(false);
                            }}
                            className="flex-1 px-4 py-2 bg-[#c72030] text-white rounded-lg transition-colors font-medium"
                            type="button"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
