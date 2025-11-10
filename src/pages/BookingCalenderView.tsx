import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import axios from "axios";
import { ArrowUpDown, Bell, ChevronLeft, ChevronRight, Filter, Plus, Search } from "lucide-react";
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
                return { date: formattedDate, day: dayName, isOff, fullDate };
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
            // Generate time slots from 9 AM to 9 PM
            const timeSlots = Array.from({ length: 12 }, (_, i) => {
                const startHour = i + 9;
                const startAmPm = startHour < 12 ? "AM" : "PM";
                const endHour = startHour + 1;
                const endAmPm = endHour < 12 ? "AM" : "PM";

                return {
                    id: i + 1,
                    start_hour: startHour,
                    start_minute: 0,
                    end_hour: endHour,
                    end_minute: 0,
                    start: `${startHour > 12 ? startHour - 12 : startHour}:00${startAmPm}`,
                    end: `${endHour > 12 ? endHour - 12 : endHour}:00${endAmPm}`,
                    time_text: `${startHour > 12 ? startHour - 12 : startHour}:00 ${startAmPm} to ${endHour > 12 ? endHour - 12 : endHour}:00 ${endAmPm}`
                };
            });

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
            const response = await axios.get(`https://${baseUrl}/pms/facility_bookings/slots_status?facility_id=${facilityId}&date=${date}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            // Update bookings state by merging new data
            setBookings(prev => ({
                ...prev,
                [facilityId]: {
                    booked: response.data.booked || [],
                    vacant: response.data.vacant || []
                }
            }));
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    const isBooked = (facilityId, timeSlot) => {
        const facilityBookings = bookings[facilityId];
        if (!facilityBookings) return false;

        return facilityBookings.booked.some(
            bookedSlot =>
                bookedSlot.start_hour === timeSlot.start_hour &&
                bookedSlot.start_minute === timeSlot.start_minute &&
                bookedSlot.end_hour === timeSlot.end_hour &&
                bookedSlot.end_minute === timeSlot.end_minute
        );
    };

    const handleSlotClick = (facilityId, slotId, isBooked) => {
        if (isBooked) {
            console.log("View/Cancel booking:", { facilityId, slotId, date: selectedDate });
        } else {
            console.log("Create new booking:", { facilityId, slotId, date: selectedDate });
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
                        <div className="w-32 flex-shrink-0 bg-[#d8d8d8] border border-gray-400 py-1 sticky left-0 z-20">
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
                                    onClick={() => !dateInfo.isOff && (
                                        setSelectedDate(dateInfo.date),
                                        setSelectedDateForApi(dateInfo.fullDate)
                                    )}
                                    className={`relative border bg-[rgba(86,86,86,0.2)] border-gray-400 px-2 py-1 text-center w-[110px] transition-colors ${selectedDate === dateInfo.date
                                        ? 'bg-[rgba(86,86,86,0.3)] border-b-[2px] !border-b-[#C72030]'
                                        : dateInfo.isOff
                                            ? 'bg-gray-100 cursor-not-allowed'
                                            : 'bg-white hover:bg-gray-50 cursor-pointer'
                                        }`}
                                >
                                    {selectedDate === dateInfo.date && (
                                        <span className="absolute top-0 left-0 w-0 h-0 border-t-[20px] border-t-[#C72030] border-r-[10px] border-r-transparent"></span>
                                    )}
                                    <div className="text-xs">{dateInfo.date}</div>
                                    <div className="text-sm font-medium">{dateInfo.day}{dateInfo.isOff && <span className="text-xs text-gray-500 ml-2">OFF</span>}</div>
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
                            <div className="w-32 flex-shrink-0 bg-[#EDE9E3] text-[#C72030] border border-gray-300 p-2 sticky left-0 z-20 flex flex-col justify-center">
                                <div className="text-xs text-center">{selectedDate}</div>
                                <div className="text-sm text-center">{selectedDateInfo?.day}</div>
                            </div>

                            <div className="flex-1 flex">
                                {timeSlots.map((slot) => (
                                    <div key={slot.id} className="border border-gray-400 bg-[rgba(86,86,86,0.2)] px-1 py-3 w-[110px]">
                                        <div className="text-[12px] text-gray-600 font-normal text-center">{slot.start}</div>
                                        <div className="text-[12px] text-gray-600 font-normal text-center">-</div>
                                        <div className="text-[12px] text-gray-600 font-normal text-center">{slot.end}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Facility Rows */}
                        {facilities?.map((facility) => (
                            <div key={facility.id} className="flex">
                                <div className="w-32 flex-shrink-0 border border-gray-300 sticky left-0 z-20 bg-white">
                                    <div className="relative h-16">
                                        <img src={facility.cover_image?.document} alt={facility.fac_name} className="w-full h-full object-cover" />
                                        <span className="text-xs font-medium whitespace-nowrap absolute bottom-0 text-white backdrop-blur-md bg-white/40 px-2 w-full">
                                            {facility.fac_name}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 flex">
                                    {timeSlots.map((slot) => {
                                        const slotBooked = isBooked(facility.id, slot);
                                        const facilityBookings = bookings[facility.id] || { booked: [], vacant: [] };
                                        const bookedSlot = facilityBookings.booked.find(
                                            b => b.start_hour === slot.start_hour && b.start_minute === slot.start_minute
                                        );
                                        const vacantSlot = facilityBookings.vacant.find(
                                            v => v.start_hour === slot.start_hour && v.start_minute === slot.start_minute
                                        );

                                        return (
                                            <div
                                                key={slot.id}
                                                onClick={() => handleSlotClick(facility.id, slot.id, slotBooked)}
                                                className={`border border-gray-400 h-16 w-[110px] flex items-center justify-center transition-colors ${selectedDateInfo?.isOff
                                                    ? "bg-gray-100 cursor-not-allowed"
                                                    : slotBooked
                                                        ? "bg-[rgba(26,26,26,0.1)] cursor-pointer"
                                                        : vacantSlot
                                                            ? "bg-white hover:bg-blue-50 cursor-pointer"
                                                            : "bg-white hover:bg-blue-50 cursor-pointer"
                                                    }`}
                                            >
                                                {!selectedDateInfo?.isOff && (
                                                    <div className={`text-center ${slotBooked ? 'text-[#000]' : 'text-[#2E7D32]'}`}>
                                                        {slotBooked ? 'Booked' : vacantSlot ? '' : ''}
                                                    </div>
                                                )}
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
