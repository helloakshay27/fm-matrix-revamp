import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import axios from "axios";
import { ArrowUpDown, Bell, ChevronLeft, ChevronRight, Filter, Plus, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BookingCalenderView = () => {
    const navigate = useNavigate();
    const baseUrl = localStorage.getItem("baseUrl")
    const token = localStorage.getItem("token")

    // Initialize today's date
    const today = new Date();
    const initialDate = today.toLocaleDateString("en-GB"); // dd/mm/yyyy
    const initialApiDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const initialMonth = today.toLocaleString("default", { month: "long" });
    const initialYear = today.getFullYear();

    const [bookingType, setBookingType] = useState("bookable");
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [selectedDateForApi, setSelectedDateForApi] = useState(initialApiDate)
    const [dates, setDates] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [bookings, setBookings] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(initialMonth);
    const [currentYear, setCurrentYear] = useState(initialYear);
    const [showActionPanel, setShowActionPanel] = useState(false);

    const getFacilities = async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/admin/facility_setups.json?q[fac_type_eq]=${bookingType}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            setFacilities(response.data.facility_setups)
        } catch (error) {
            console.log(error)
        }
    }

    // Fetch facilities and initial time slots
    useEffect(() => {
        const init = async () => {
            await getFacilities();
            if (selectedDate && selectedDateForApi) {
                fetchTimeSlotsForDate(selectedDateForApi);
            }
        };
        init();
    }, [bookingType]);

    // Fetch dates for the calendar
    useEffect(() => {
        fetchCalendarData();
    }, [currentMonth, currentYear]);

    // Fetch time slots when date changes
    useEffect(() => {
        if (selectedDate && selectedDateForApi) {
            fetchTimeSlotsForDate(selectedDateForApi);
        }
    }, [selectedDate, facilities]);

    const fetchCalendarData = async () => {
        try {
            setLoading(true);

            // ✅ Dynamically generate all days for the selected month
            const monthIndex = new Date(`${currentMonth} 1, ${currentYear}`).getMonth();
            const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();

            const generatedDates = Array.from({ length: daysInMonth }, (_, i) => {
                const dateObj = new Date(currentYear, monthIndex, i + 1);
                const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
                const isOff = dayName === "Sunday"; // Example: Sundays off
                const formattedDate = dateObj.toLocaleDateString("en-GB"); // dd/mm/yyyy
                const yyyy = dateObj.getFullYear();
                const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
                const dd = String(dateObj.getDate()).padStart(2, "0");
                const fullDate = `${yyyy}-${mm}-${dd}`;
                return { date: formattedDate, day: dayName, isOff, fullDate, isBlocked: false };
            });

            setDates(generatedDates);

            // Check if the selected date is in the current month
            const selectedDateObj = selectedDate ? new Date(selectedDateForApi) : null;
            const isSelectedDateInCurrentMonth = selectedDateObj &&
                selectedDateObj.getMonth() === monthIndex &&
                selectedDateObj.getFullYear() === currentYear;

            // If selected date is not in current month, select today's date if it's in current month
            if (!isSelectedDateInCurrentMonth) {
                const today = new Date();
                const isTodayInCurrentMonth =
                    today.getMonth() === monthIndex &&
                    today.getFullYear() === currentYear;

                if (isTodayInCurrentMonth) {
                    const todayFormatted = today.toLocaleDateString("en-GB");
                    const todayApiFormat = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
                    setSelectedDate(todayFormatted);
                    setSelectedDateForApi(todayApiFormat);
                } else {
                    // If today is not in current month, select first available date
                    const firstAvailableDate = generatedDates.find((d) => !d.isOff);
                    if (firstAvailableDate) {
                        setSelectedDate(firstAvailableDate.date);
                        setSelectedDateForApi(firstAvailableDate.fullDate);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching calendar data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTimeSlotsForDate = async (date) => {
        try {
            // Generate time slots from 9 AM to 9 PM with 15-minute intervals
            const timeSlots = [];
            for (let i = 0; i < 12; i++) {
                const startHour = i + 9;
                const startAmPm = startHour < 12 ? "AM" : "PM";

                // Create 4 fifteen-minute slots for each hour
                for (let minute = 0; minute < 60; minute += 15) {
                    const displayHour = startHour > 12 ? startHour - 12 : startHour;
                    const slotId = `${i + 1}_${minute / 15}`;

                    const endHour = minute === 45 ? startHour + 1 : startHour;
                    const endMinute = minute === 45 ? 0 : minute + 15;
                    const endAmPm = endHour < 12 ? "AM" : "PM";
                    const displayEndHour = endHour > 12 ? endHour - 12 : endHour;

                    timeSlots.push({
                        id: slotId,
                        start_hour: startHour,
                        start_minute: minute,
                        end_hour: endHour,
                        end_minute: endMinute,
                        start: `${displayHour}:${minute.toString().padStart(2, '0')}${startAmPm}`,
                        end: `${displayEndHour}:${endMinute.toString().padStart(2, '0')}${endAmPm}`,
                        time_text: `${displayHour}:${minute.toString().padStart(2, '0')}${startAmPm} - ${displayEndHour}:${endMinute.toString().padStart(2, '0')}${endAmPm}`,
                        quarter: Math.floor(minute / 15) // 0, 1, 2, or 3 for each quarter
                    });
                }
            };

            setTimeSlots(timeSlots);
            // Fetch bookings for all facilities
            facilities.forEach(facility => {
                fetchBookingsForDate(date, facility.id);
            });
        } catch (error) {
            console.error("Error fetching time slots:", error);
        }
    };

    const fetchBookingsForDate = async (date, facilityId) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/facility_bookings/slots_status.json?facility_id=${facilityId}&date=${date}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            // Update bookings state by merging new data
            setBookings(prev => ({
                ...prev,
                [facilityId]: {
                    booked: response.data.booked || [],
                    vacant: response.data.vacant || [],
                    is_blocked: response.data.is_blocked || false
                }
            }));
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    const isBooked = (facilityId, timeSlot) => {
        const facilityBookings = bookings[facilityId];
        if (!facilityBookings) return false;

        return facilityBookings.booked.some(bookedSlot => {
            // Convert booking times to minutes since midnight for easier comparison
            const bookedStart = bookedSlot.start_hour * 60 + bookedSlot.start_minute;
            const bookedEnd = bookedSlot.end_hour * 60 + bookedSlot.end_minute;
            const slotStart = timeSlot.start_hour * 60 + timeSlot.start_minute;
            const slotEnd = timeSlot.end_hour * 60 + timeSlot.end_minute;

            // Check if the current 15-minute slot overlaps with any booked slot
            return (slotStart >= bookedStart && slotStart < bookedEnd) ||
                (slotEnd > bookedStart && slotEnd <= bookedEnd) ||
                (slotStart <= bookedStart && slotEnd >= bookedEnd);
        });
    };

    const handleSlotClick = (facilityId, slotId, isBooked, facilityBookingId, slot) => {
        if (isBooked && facilityBookingId) {
            // Redirect to booking details page
            const currentPath = window.location.pathname;
            if (currentPath.includes("bookings")) {
                navigate(`/bookings/${facilityBookingId}`);
            } else if (currentPath.includes("club-management")) {
                navigate(`/club-management/amenities-booking/${facilityBookingId}`);
            } else {
                navigate(`/vas/booking/${facilityBookingId}`);
            }
        } else if (!isBooked) {
            // Navigate to add facility booking page with dynamic parameters
            const currentPath = window.location.pathname;
            const queryParams = `facility_id=${facilityId}&date=${selectedDate}&slot_time=${encodeURIComponent(slot.time_text)}`;

            if (currentPath.includes("bookings")) {
                navigate(`/bookings/add?${queryParams}`);
            } else if (currentPath.includes("club-management")) {
                navigate(`/club-management/amenities-booking/add?${queryParams}`);
            } else {
                navigate(`/vas/booking/add?${queryParams}`);
            }
        }
    };

    const handleAddBooking = () => {
        const currentPath = window.location.pathname;
        if (currentPath.includes("bookings")) navigate("/bookings/add");
        else if (currentPath.includes("club-management")) navigate("/club-management/amenities-booking/add");
        else navigate("/vas/booking/add");
    };

    // Month navigation logic with year handling
    const handleMonthChange = (direction) => {
        const date = new Date(`${currentMonth} 1, ${currentYear}`);
        date.setMonth(date.getMonth() + (direction === "next" ? 1 : -1));
        const newMonth = date.toLocaleString("default", { month: "long" });
        const newYear = date.getFullYear();
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);

        // Reset selected date when month changes
        const newDate = date.toLocaleDateString("en-GB");
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const fullDate = `${yyyy}-${mm}-${dd}`;
        setSelectedDate(newDate);
        setSelectedDateForApi(fullDate);
    };

    const selectedDateInfo = dates.find((d) => d.date === selectedDate);

    return (
        <div className="pt-2 space-y-6">
            <div className="flex items-center justify-end">
                <Button variant="outline" className="w-[40px] h-[40px]">
                    <Bell className="w-5 h-5" />
                </Button>
            </div>

            {/* Header Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Button
                        className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white w-[106px] h-[36px]"
                        onClick={handleAddBooking}
                    >
                        <Plus className="w-4 h-4" />
                        Add
                    </Button>

                    <RadioGroup row value={bookingType} onChange={(e) => setBookingType(e.target.value)}>
                        <FormControlLabel
                            value="bookable"
                            control={<Radio size="small" color="error" />}
                            label="Bookable"
                            className="text-[14px]"
                        />
                        <FormControlLabel
                            value="request"
                            control={<Radio size="small" color="error" />}
                            label="Request"
                            className="text-[14px]"
                        />
                    </RadioGroup>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input placeholder="Search..." className="pl-10 pr-10" />
                    </div>
                    <Button className="text-[14px]">
                        <ArrowUpDown size={16} />
                        Advance Search
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 flex items-center gap-2"
                        title="Filter"
                    >
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {showActionPanel && (
                <SelectionPanel onAdd={handleAddBooking} onClearSelection={() => setShowActionPanel(false)} />
            )}

            {/* Calendar Container */}
            <div className="flex flex-col gap-0">
                {/* Dates Header - Separate Scrolling */}
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    <div className="min-w-fit flex">
                        <div className="w-32 flex-shrink-0 bg-[#d8d8d8] border border-gray-400 py-1 sticky left-0 z-10">
                            <div className="flex items-center justify-between gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => handleMonthChange('prev')}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <div className="text-[#C72030] font-semibold text-sm">{currentMonth}</div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => handleMonthChange('next')}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 flex">
                            {dates.map((dateInfo, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => !dateInfo.isOff && !dateInfo.isBlocked && (
                                        setSelectedDate(dateInfo.date),
                                        setSelectedDateForApi(dateInfo.fullDate)
                                    )}
                                    className={`relative border bg-[rgba(86,86,86,0.2)] border-gray-400 px-2 py-1 text-center w-[110px] transition-colors ${selectedDate === dateInfo.date
                                        ? 'bg-[rgba(86,86,86,0.3)] border-b-[2px] !border-b-[#C72030]'
                                        : dateInfo.isOff || dateInfo.isBlocked
                                            ? '!bg-gray-100 cursor-not-allowed'
                                            : '!bg-white hover:bg-gray-50 cursor-pointer'
                                        }`}
                                >
                                    {selectedDate === dateInfo.date && !dateInfo.isBlocked && (
                                        <span className="absolute top-0 left-0 w-0 h-0 border-t-[20px] border-t-[#C72030] border-r-[10px] border-r-transparent"></span>
                                    )}
                                    {dateInfo.isBlocked && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <X className="w-8 h-8 text-red-600" strokeWidth={3} />
                                        </div>
                                    )}
                                    <div className="text-xs">{dateInfo.date}</div>
                                    <div className="text-sm font-medium">{dateInfo.day}{dateInfo.isOff && <span className="text-xs text-gray-500 ml-2">OFF</span>}{dateInfo.isBlocked && <span className="text-xs text-red-600 ml-2">BLOCKED</span>}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="my-4"></div>

                {/* Slots Container - Separate Scrolling */}
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    <div className="min-w-fit">
                        {/* Time Slots Header */}
                        <div className="flex">
                            <div className="w-32 flex-shrink-0 bg-[#EDE9E3] text-[#C72030] border border-gray-300 p-2 sticky left-0 z-10 flex flex-col justify-center">
                                <div className="text-xs text-center">{selectedDate}</div>
                                <div className="text-sm text-center">{selectedDateInfo?.day}</div>
                            </div>

                            <div className="flex-1 flex">
                                {timeSlots.filter(slot => slot.quarter === 0).map((slot) => {
                                    const startHour = slot.start_hour;
                                    const endHour = startHour + 1;
                                    const startDisplay = `${startHour > 12 ? startHour - 12 : startHour}:00${startHour < 12 ? 'AM' : 'PM'}`;
                                    const endDisplay = `${endHour > 12 ? endHour - 12 : endHour}:00${endHour < 12 ? 'AM' : 'PM'}`;

                                    return (
                                        <div key={slot.id} className="border border-gray-400 bg-[rgba(86,86,86,0.2)] px-1 py-2 w-[110px]">
                                            <div className="text-[11px] text-gray-600 font-medium text-center">
                                                {startDisplay}
                                            </div>
                                            <div className="text-[10px] text-gray-500 text-center">to</div>
                                            <div className="text-[11px] text-gray-600 font-medium text-center">
                                                {endDisplay}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Facility Rows */}
                        {facilities?.map((facility) => (
                            <div key={facility.id} className="flex">
                                <div className="w-32 flex-shrink-0 border border-gray-300 sticky left-0 z-10 bg-white">
                                    <div className="relative h-16">
                                        <img src={facility.cover_image?.document} alt={facility.fac_name} className="w-full h-full object-cover" />
                                        <span className="text-xs font-medium whitespace-nowrap absolute bottom-0 text-white backdrop-blur-md bg-white/40 px-2 w-full">
                                            {facility.fac_name}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 flex">
                                    {/* Group slots by hour */}
                                    {timeSlots.filter(slot => slot.quarter === 0).map((hourSlot) => {
                                        const hourSlots = timeSlots.filter(
                                            s => s.start_hour === hourSlot.start_hour
                                        );

                                        return (
                                            <div key={hourSlot.id} className="flex flex-col w-[110px]">
                                                {/* Four 15-minute slots */}
                                                <div className="flex h-16">
                                                    {hourSlots.map((slot) => {
                                                        const facilityBookings = bookings[facility.id] || { booked: [], vacant: [] };
                                                        const bookedSlot = facilityBookings.booked.find(bookedBooking => {
                                                            // Convert booking times to minutes since midnight for easier comparison
                                                            const bookedStart = bookedBooking.start_hour * 60 + bookedBooking.start_minute;
                                                            const bookedEnd = bookedBooking.end_hour * 60 + bookedBooking.end_minute;
                                                            const slotStart = slot.start_hour * 60 + slot.start_minute;
                                                            const slotEnd = slot.end_hour * 60 + slot.end_minute;

                                                            // Check if the current 15-minute slot overlaps with any booked slot
                                                            return (slotStart >= bookedStart && slotStart < bookedEnd) ||
                                                                (slotEnd > bookedStart && slotEnd <= bookedEnd) ||
                                                                (slotStart <= bookedStart && slotEnd >= bookedEnd);
                                                        });
                                                        const slotBooked = !!bookedSlot;
                                                        const isSlotBlocked = facilityBookings.is_blocked || bookedSlot?.is_blocked || false;

                                                        return (
                                                            <div
                                                                key={slot.id}
                                                                onClick={() => !isSlotBlocked && handleSlotClick(facility.id, slot.id, slotBooked, bookedSlot?.facility_booking_id, slot)}
                                                                className={`relative flex-1 border border-gray-200 transition-colors
                                                                    ${selectedDateInfo?.isOff || isSlotBlocked
                                                                        ? "bg-gray-100 cursor-not-allowed"
                                                                        : slotBooked
                                                                            ? "bg-gray-400 cursor-pointer hover:bg-gray-500"
                                                                            : "bg-white hover:bg-blue-50 cursor-pointer"
                                                                    }
                                                                    ${slot.quarter === 0 ? 'border-l border-l-gray-400' : ''}
                                                                    ${slot.quarter === 3 ? 'border-r border-r-gray-400' : ''}
                                                                `}
                                                            >
                                                                {isSlotBlocked && (
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                        <X className="w-3 h-3 text-red-600" strokeWidth={3} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingCalenderView;