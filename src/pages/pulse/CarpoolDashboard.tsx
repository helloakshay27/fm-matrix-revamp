import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Users,
  Calendar,
  MapPin,
  AlertCircle,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import carGrayImage from "@/assets/car_gray.png";
import carRedImage from "@/assets/car_red.png";
import carBlackImage from "@/assets/car_black.png";
import carBeigeImage from "@/assets/car_beige.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";

interface RideRecord {
  id: string;
  driver: string;
  registrationNumber: string;
  passengers: string;
  leavingFrom: string;
  destination: string;
  carImage: string;
  status: string;
  reportedBy?: string;
  reportedAgainst?: string;
  issueDescription?: string;
  reportTime?: string;
  reportDate?: string;
  reporterContact?: string;
  location?: string;
  alertTime?: string;
  departureTime?: string;
  expectedArrivalTime?: string;
  rideDate?: string;
  bookingDate?: string;
  seat?: string;
  pricePerPerson?: string;
}

interface UserRecord {
  id: string;
  accessCardNumber: string;
  name: string;
  mobileNumber: string;
  emailAddress: string;
  employeeNumber: string;
  gender: string;
}

interface CalendarDay {
  date: string;
  day: string;
  fullDate: string;
  isOff?: boolean;
}

// Helper function to generate calendar days
const generateCalendarDays = (
  startDate: Date,
  numDays: number = 14
): CalendarDay[] => {
  const days: CalendarDay[] = [];
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  for (let i = 0; i < numDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const dayName = dayNames[currentDate.getDay()];
    const isOff = dayName === "Sunday";

    days.push({
      date: `${currentDate.getDate().toString().padStart(2, "0")}/${(currentDate.getMonth() + 1).toString().padStart(2, "0")}/${currentDate.getFullYear().toString().slice(-2)}`,
      day: dayName,
      fullDate: `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`,
      isOff,
    });
  }

  return days;
};

const statusCards = [
  {
    title: "Today's Rides",
    count: 11,
    icon: Car,
    status: "today",
  },
  {
    title: "Total Rides",
    count: 12049,
    icon: Car,
    status: "total",
  },
  {
    title: "Total Users",
    count: 9658,
    icon: Users,
    status: "users",
  },
  {
    title: "Upcoming Rides",
    count: 21,
    icon: Calendar,
    status: "upcoming",
  },
  {
    title: "Active Now",
    count: 4,
    icon: MapPin,
    status: "active",
  },
  {
    title: "Active Report's",
    count: 18,
    icon: AlertCircle,
    status: "reports",
  },
  // {
  //   title: "Pending KYC",
  //   count: 23,
  //   icon: Users,
  //   status: "kyc",
  // },
  {
    title: "Active SOS",
    count: 1,
    icon: AlertCircle,
    status: "sos",
  },
];

// Mock data for different views
const mockTodayRides: RideRecord[] = [
  {
    id: "1",
    driver: "Hamza",
    registrationNumber: "MH 01 AB 2345",
    passengers: "Raj, Tiwari, Pooja",
    leavingFrom: "Panchshil Tech Park One",
    destination: "Pune Rly Station",
    carImage: carGrayImage,
    status: "scheduled",
  },
  {
    id: "2",
    driver: "Shahab",
    registrationNumber: "MH 12 CD 6789",
    passengers: "Raj, Tiwari, Pooja, Rohan",
    leavingFrom: "Panchshil Tech Park One",
    destination: "Pune Rly Station",
    carImage: carBlackImage,
    status: "scheduled",
  },
  {
    id: "3",
    driver: "Yukta",
    registrationNumber: "MH 04 GH 4455",
    passengers: "Raj, Tiwari, Pooja, Rohan",
    leavingFrom: "Panchshil Tech Park One",
    destination: "Pune Rly Station",
    carImage: carRedImage,
    status: "scheduled",
  },
  {
    id: "4",
    driver: "Rahul",
    registrationNumber: "MH 12 ST 1010",
    passengers: "Raj, Tiwari, Pooja, Rohan",
    leavingFrom: "Panchshil Tech Park One",
    destination: "Pune Rly Station",
    carImage: carBeigeImage,
    status: "scheduled",
  },
];

const mockUpcomingRides: RideRecord[] = [
  {
    id: "1",
    driver: "",
    registrationNumber: "",
    passengers: "",
    leavingFrom: "",
    destination: "Pune Rly Station",
    carImage: "",
    status: "Active",
    departureTime: "10:00 AM",
    expectedArrivalTime: "10:30 AM",
    rideDate: "13 October 2025",
    bookingDate: "12 October 2025",
    seat: "3/4",
    pricePerPerson: "₹250",
  },
  {
    id: "2",
    driver: "",
    registrationNumber: "",
    passengers: "",
    leavingFrom: "",
    destination: "Pune Rly Station",
    carImage: "",
    status: "Inactive",
    departureTime: "2:00 PM",
    expectedArrivalTime: "2:45 PM",
    rideDate: "13 October 2025",
    bookingDate: "13 October 2025",
    seat: "4/4",
    pricePerPerson: "₹260",
  },
  {
    id: "3",
    driver: "",
    registrationNumber: "",
    passengers: "",
    leavingFrom: "",
    destination: "Pune Rly Station",
    carImage: "",
    status: "Active",
    departureTime: "5:00 PM",
    expectedArrivalTime: "5:40 PM",
    rideDate: "13 October 2025",
    bookingDate: "11 October 2025",
    seat: "7/7",
    pricePerPerson: "₹250",
  },
  {
    id: "4",
    driver: "",
    registrationNumber: "",
    passengers: "",
    leavingFrom: "",
    destination: "Pune Rly Station",
    carImage: "",
    status: "Active",
    departureTime: "6:00 PM",
    expectedArrivalTime: "6:30 PM",
    rideDate: "13 October 2025",
    bookingDate: "13 October 2025",
    seat: "4/4",
    pricePerPerson: "₹270",
  },
];

const mockActiveNowRides: RideRecord[] = [
  {
    id: "1",
    driver: "Hamza",
    registrationNumber: "MH 01 AB 2345",
    passengers: "Raj, Tiwari, Pooja",
    leavingFrom: "Panchshil Tech Park One",
    destination: "Pune Rly Station",
    carImage: carGrayImage,
    status: "active",
  },
  {
    id: "2",
    driver: "Shahab",
    registrationNumber: "MH 12 CD 6789",
    passengers: "Raj, Tiwari, Pooja, Rohan",
    leavingFrom: "Panchshil Tech Park One",
    destination: "Pune Rly Station",
    carImage: carBlackImage,
    status: "active",
  },
  {
    id: "3",
    driver: "Yukta",
    registrationNumber: "MH 04 GH 4455",
    passengers: "Raj, Tiwari, Pooja, Rohan",
    leavingFrom: "Panchshil Tech Park One",
    destination: "Pune Rly Station",
    carImage: carRedImage,
    status: "active",
  },
  {
    id: "4",
    driver: "Rahul",
    registrationNumber: "MH 12 ST 1010",
    passengers: "Raj, Tiwari, Pooja, Rohan",
    leavingFrom: "Panchshil Tech Park One",
    destination: "Pune Rly Station",
    carImage: carBeigeImage,
    status: "active",
  },
];

const mockActiveReports: RideRecord[] = [
  {
    id: "1",
    driver: "",
    registrationNumber: "MH 01 AB 2345",
    passengers: "",
    leavingFrom: "",
    destination: "",
    carImage: "",
    status: "Under Review",
    reportedBy: "Hamza (Passenger)",
    reportedAgainst: "Raj (Driver)",
    issueDescription: "Driver was using mobile phone while driving",
    reportTime: "10:00 AM",
    reportDate: "12 October 2025",
  },
  {
    id: "2",
    driver: "",
    registrationNumber: "MH 12 CD 6789",
    passengers: "",
    leavingFrom: "",
    destination: "",
    carImage: "",
    status: "Under Review",
    reportedBy: "Shahab (Driver)",
    reportedAgainst: "Priya (Passenger)",
    issueDescription: "Passenger was rude and disrespectful",
    reportTime: "2:00 PM",
    reportDate: "13 October 2025",
  },
  {
    id: "3",
    driver: "",
    registrationNumber: "MH 04 GH 4455",
    passengers: "",
    leavingFrom: "",
    destination: "",
    carImage: "",
    status: "Under Review",
    reportedBy: "Yukta (Passenger)",
    reportedAgainst: "Pooja (Passenger)",
    issueDescription: "Passenger arrived late at pickup point",
    reportTime: "5:00 PM",
    reportDate: "11 October 2025",
  },
  {
    id: "4",
    driver: "",
    registrationNumber: "MH 12 ST 1010",
    passengers: "",
    leavingFrom: "",
    destination: "",
    carImage: "",
    status: "Under Review",
    reportedBy: "Rahul (Passenger)",
    reportedAgainst: "Deepak (Driver)",
    issueDescription: "Driver took a different route without informing",
    reportTime: "6:00 PM",
    reportDate: "13 October 2025",
  },
];

const mockSOSAlerts: RideRecord[] = [
  {
    id: "1",
    driver: "",
    registrationNumber: "MH 01 AB 2345",
    passengers: "",
    leavingFrom: "",
    destination: "",
    carImage: "",
    status: "ACTIVE",
    reportedBy: "Priya Sharma (Rider)",
    location: "KR Puram Main Road",
    reporterContact: "+91 98765 43210",
    alertTime: "5 minutes ago",
    issueDescription: "User reported unsafe driving behavior",
  },
  {
    id: "2",
    driver: "",
    registrationNumber: "MH 01 AB 2345",
    passengers: "",
    leavingFrom: "",
    destination: "",
    carImage: "",
    status: "ACTIVE",
    reportedBy: "Deepak Kumar (Driver)",
    location: "Outer Ring Road, near Bellandur",
    reporterContact: "+91 98123 45678",
    alertTime: "12 minutes ago",
    issueDescription: "Vehicle breakdown reported",
  },
];

const mockUsers: UserRecord[] = [
  {
    id: "1",
    accessCardNumber: "54647",
    name: "Hamza",
    mobileNumber: "+91 1234567890",
    emailAddress: "hamza.quazi@lookated.com",
    employeeNumber: "346347",
    gender: "Male",
  },
  {
    id: "2",
    accessCardNumber: "54647",
    name: "Shahab",
    mobileNumber: "+91 1234567890",
    emailAddress: "hamza.quazi@lookated.com",
    employeeNumber: "346347",
    gender: "Male",
  },
  {
    id: "3",
    accessCardNumber: "54647",
    name: "Yukta",
    mobileNumber: "+91 1234567890",
    emailAddress: "hamza.quazi@lookated.com",
    employeeNumber: "346347",
    gender: "Female",
  },
  {
    id: "4",
    accessCardNumber: "54647",
    name: "Rahul",
    mobileNumber: "+91 1234567890",
    emailAddress: "hamza.quazi@lookated.com",
    employeeNumber: "346347",
    gender: "Male",
  },
];

const mockPendingKYC: UserRecord[] = [
  {
    id: "1",
    accessCardNumber: "54647",
    name: "Hamza",
    mobileNumber: "+91 1234567890",
    emailAddress: "hamza.quazi@lookated.com",
    employeeNumber: "346347",
    gender: "Male",
  },
  {
    id: "2",
    accessCardNumber: "54647",
    name: "Shahab",
    mobileNumber: "+91 1234567890",
    emailAddress: "hamza.quazi@lookated.com",
    employeeNumber: "346347",
    gender: "Male",
  },
  {
    id: "3",
    accessCardNumber: "54647",
    name: "Yukta",
    mobileNumber: "+91 1234567890",
    emailAddress: "hamza.quazi@lookated.com",
    employeeNumber: "346347",
    gender: "Female",
  },
  {
    id: "4",
    accessCardNumber: "54647",
    name: "Rahul",
    mobileNumber: "+91 1234567890",
    emailAddress: "hamza.quazi@lookated.com",
    employeeNumber: "346347",
    gender: "Male",
  },
];

// Mock data for live tracking
const mockTrackingRides = [
  {
    id: "1",
    registrationNumber: "MH 01 AB 2345",
    gender: "Male",
    driver: "Hamza",
    route: "Panchshil Tech Park → Pune Rly Station",
    currentLocation: "Domlur Junction",
    eta: "5 mins",
    progress: 45,
    passengers: ["Raj", "Tiwari", "Pooja"],
    status: "Active",
  },
  {
    id: "2",
    registrationNumber: "MH 12 CD 6789",
    gender: "Male",
    driver: "Shahab",
    route: "Panchshil Tech Park → Pune Rly Station",
    currentLocation: "Spice Garden Signal",
    eta: "5 mins",
    progress: 75,
    passengers: ["Raj", "Tiwari", "Pooja", "Rohan"],
    status: "Active",
  },
  {
    id: "3",
    registrationNumber: "MH 04 GH 4455",
    gender: "Female",
    driver: "Yukta",
    route: "Panchshil Tech Park → Pune Rly Station",
    currentLocation: "KS Puram",
    eta: "18 mins",
    progress: 25,
    passengers: ["Raj", "Tiwari", "Pooja", "Rohan"],
    status: "Active",
  },
  {
    id: "4",
    registrationNumber: "MH 12 ST 1010",
    gender: "Male",
    driver: "Rahul",
    route: "Panchshil Tech Park → Pune Rly Station",
    currentLocation: "Spice Garden Signal",
    eta: "5 mins",
    progress: 75,
    passengers: ["Raj", "Tiwari", "Pooja", "Rohan"],
    status: "Active",
  },
];

export const CarpoolDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ridesData, setRidesData] = useState<RideRecord[]>(mockTodayRides);
  const [usersData, setUsersData] = useState<UserRecord[]>(mockUsers);
  const [pendingKYCData, setPendingKYCData] =
    useState<UserRecord[]>(mockPendingKYC);
  const [selectedReportStatus, setSelectedReportStatus] = useState<{
    [key: string]: string;
  }>({});
  const [selectedRides, setSelectedRides] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [activeReportTab, setActiveReportTab] =
    useState<string>("Under Review");
  const itemsPerPage = 10;

  // Calendar states
  const [calendarDates, setCalendarDates] = useState<CalendarDay[]>([]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>("");
  const [selectedCalendarDateForApi, setSelectedCalendarDateForApi] =
    useState<string>("");
  const [calendarMonth, setCalendarMonth] = useState<string>("");
  const [calendarYear, setCalendarYear] = useState<number>(0);
  const datesContainerRef = useRef<HTMLDivElement | null>(null);
  const dateRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Initialize calendar dates
  useEffect(() => {
    const today = new Date();
    const initialDate = today.toLocaleDateString("en-GB");
    const initialApiDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const initialMonth = today.toLocaleString("default", { month: "long" });
    const initialYear = today.getFullYear();

    setSelectedCalendarDate(initialDate);
    setSelectedCalendarDateForApi(initialApiDate);
    setCalendarMonth(initialMonth);
    setCalendarYear(initialYear);
  }, []);

  // Fetch calendar data function
  const fetchCalendarData = useCallback(async () => {
    try {
      const monthIndex = new Date(
        `${calendarMonth} 1, ${calendarYear}`
      ).getMonth();
      const daysInMonth = new Date(calendarYear, monthIndex + 1, 0).getDate();
      const generatedDates = Array.from({ length: daysInMonth }, (_, i) => {
        const dateObj = new Date(calendarYear, monthIndex, i + 1);
        const dayName = dateObj.toLocaleDateString("en-US", {
          weekday: "short",
        });
        const isOff = dayName === "Sun";
        const formattedDate = dateObj.toLocaleDateString("en-GB");
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
        const dd = String(dateObj.getDate()).padStart(2, "0");
        const fullDate = `${yyyy}-${mm}-${dd}`;
        return { date: formattedDate, day: dayName, isOff, fullDate };
      });

      setCalendarDates(generatedDates);

      const selectedDateObj = selectedCalendarDate
        ? new Date(selectedCalendarDateForApi)
        : null;
      const isSelectedDateInCurrentMonth =
        selectedDateObj &&
        selectedDateObj.getMonth() === monthIndex &&
        selectedDateObj.getFullYear() === calendarYear;

      if (!isSelectedDateInCurrentMonth) {
        const today = new Date();
        const isTodayInCurrentMonth =
          today.getMonth() === monthIndex &&
          today.getFullYear() === calendarYear;

        if (isTodayInCurrentMonth) {
          const todayFormatted = today.toLocaleDateString("en-GB");
          const todayApiFormat = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
          setSelectedCalendarDate(todayFormatted);
          setSelectedCalendarDateForApi(todayApiFormat);
        } else {
          const firstAvailableDate = generatedDates.find((d) => !d.isOff);
          if (firstAvailableDate) {
            setSelectedCalendarDate(firstAvailableDate.date);
            setSelectedCalendarDateForApi(firstAvailableDate.fullDate);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  }, [
    calendarMonth,
    calendarYear,
    selectedCalendarDate,
    selectedCalendarDateForApi,
  ]);

  // Month navigation logic
  const handleMonthChange = (direction: "next" | "prev") => {
    const date = new Date(`${calendarMonth} 1, ${calendarYear}`);
    date.setMonth(date.getMonth() + (direction === "next" ? 1 : -1));
    const newMonth = date.toLocaleString("default", { month: "long" });
    const newYear = date.getFullYear();
    setCalendarMonth(newMonth);
    setCalendarYear(newYear);
  };

  useEffect(() => {
    // Update rides data based on active view
    switch (activeView) {
      case "today":
      case "total":
        setRidesData(mockTodayRides);
        break;
      case "upcoming":
        setRidesData(mockUpcomingRides);
        break;
      case "active":
        setRidesData(mockActiveNowRides);
        break;
      case "reports":
        setRidesData(mockActiveReports);
        break;
      case "sos":
        setRidesData(mockSOSAlerts);
        break;
      default:
        setRidesData(mockTodayRides);
    }
    setCurrentPage(1);
  }, [activeView]);

  // Fetch calendar data when month/year changes
  useEffect(() => {
    if (calendarMonth && calendarYear) {
      fetchCalendarData();
    }
  }, [calendarMonth, calendarYear, fetchCalendarData]);

  // Auto-scroll to selected date
  useEffect(() => {
    if (!datesContainerRef.current || !selectedCalendarDateForApi) return;

    const targetEl = dateRefs.current[selectedCalendarDateForApi];
    if (targetEl) {
      const container = datesContainerRef.current;
      const targetOffset = targetEl.offsetLeft - container.offsetLeft;
      const centerScroll =
        targetOffset - container.clientWidth / 2 + targetEl.clientWidth / 2;
      container.scrollTo({
        left: Math.max(centerScroll, 0),
        behavior: "smooth",
      });
    }
  }, [selectedCalendarDateForApi, calendarDates]);

  const handleStatusCardClick = (status: string) => {
    // If clicking the same card, toggle it off
    if (activeView === status) {
      setActiveView("");
    } else {
      setActiveView(status);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleTrackNow = (rideId: string) => {
    setActiveView("tracking");
  };

  const handleStatusChange = (reportId: string, newStatus: string) => {
    setSelectedReportStatus((prev) => ({
      ...prev,
      [reportId]: newStatus,
    }));
  };

  const filteredRides = ridesData.filter((ride) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      ride.driver?.toLowerCase().includes(searchLower) ||
      ride.registrationNumber.toLowerCase().includes(searchLower) ||
      ride.passengers?.toLowerCase().includes(searchLower) ||
      ride.reportedBy?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredRides.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRides = filteredRides.slice(startIndex, endIndex);

  const getViewTitle = () => {
    switch (activeView) {
      case "today":
        return "Today's Rides";
      case "total":
        return "All Rides";
      case "upcoming":
        return "Upcoming Rides";
      case "active":
        return "Active Now";
      case "reports":
        return "Active Reports";
      case "sos":
        return "Active SOS";
      case "kyc":
        return "Pending KYC";
      case "users":
        return "All Users";
      case "tracking":
        return "Live Tracking";
      default:
        return "Carpool";
    }
  };

  // Smart pagination rendering function
  const renderPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            className="cursor-pointer"
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show pages 2, 3, 4 if currentPage is 1, 2, or 3
      if (currentPage <= 3) {
        for (let i = 2; i <= 4 && i < totalPages; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                className="cursor-pointer"
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        if (totalPages > 5) {
          items.push(
            <PaginationItem key="ellipsis1">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
      } else if (currentPage >= totalPages - 2) {
        // Show ellipsis before last 4 pages
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = totalPages - 3; i < totalPages; i++) {
          if (i > 1) {
            items.push(
              <PaginationItem key={i}>
                <PaginationLink
                  className="cursor-pointer"
                  onClick={() => handlePageChange(i)}
                  isActive={currentPage === i}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      } else {
        // Show ellipsis, currentPage-1, currentPage, currentPage+1, ellipsis
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                className="cursor-pointer"
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page if more than 1 page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show all pages if less than or equal to 7
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {/* Status Cards - Always visible */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {statusCards.map((card, index) => (
          <div
            key={index}
            className={`bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all ${
              activeView === card.status
                ? "ring-2 ring-[#C72030] shadow-lg"
                : ""
            }`}
            onClick={() => handleStatusCardClick(card.status)}
          >
            <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
              <card.icon className="w-6 h-6 text-[#C72030]" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-[#1A1A1A]">
                {card.count.toLocaleString()}
              </div>
              <div className="text-sm font-medium text-[#1A1A1A]">
                {card.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Dates Filter - Always visible */}
      <div className="flex flex-col mb-6">
        <div
          ref={datesContainerRef}
          className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
        >
          <div className="min-w-fit flex bg-[#efe9dd] border border-[#c9c2b8] h-[40px] items-center">
            {/* Month Section */}
            <div className="w-36 flex-shrink-0 bg-[#efe9dd] border-r border-[#c9c2b8] px-3 py-0.5 sticky left-0 z-10">
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-transparent"
                  onClick={() => handleMonthChange("prev")}
                >
                  <ChevronLeft className="w-4 h-4 text-black" />
                </Button>

                <div className="text-[#C72030] font-semibold text-sm">
                  {calendarMonth}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-transparent"
                  onClick={() => handleMonthChange("next")}
                >
                  <ChevronRight className="w-4 h-4 text-black" />
                </Button>
              </div>
            </div>

            {/* Dates */}
            <div className="flex">
              {calendarDates.map((dateInfo, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    if (el && dateInfo.fullDate) {
                      dateRefs.current[dateInfo.fullDate] = el;
                    }
                  }}
                  onClick={() =>
                    !dateInfo.isOff &&
                    (setSelectedCalendarDate(dateInfo.date),
                    setSelectedCalendarDateForApi(dateInfo.fullDate))
                  }
                  className={`border-r border-[#c9c2b8] w-[115px] px-1 py-0.5 text-center cursor-pointer transition-all
            ${
              selectedCalendarDate === dateInfo.date
                ? "bg-[#f5f1ea] border-b-2 border-b-[#C72030]"
                : dateInfo.isOff
                  ? "bg-[#e6e6e6] text-gray-500 cursor-not-allowed"
                  : "bg-[#efe9dd] hover:bg-[#f5f1ea]"
            }`}
                >
                  <div className="text-xs font-medium">{dateInfo.date}</div>

                  <div className="text-[11px] font-semibold leading-none">
                    {new Date(dateInfo.fullDate).toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                    {dateInfo.isOff && (
                      <span className="block text-[11px] text-gray-500">
                        OFF
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data Section Title - Show when a view is active */}
      {activeView !== "" && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {getViewTitle()}
          </h2>
        </div>
      )}

      {/* Table Views */}
      {(activeView === "" ||
        activeView === "today" ||
        activeView === "total") && (
        <>
          <EnhancedTaskTable
            data={currentRides}
            columns={[
              {
                key: "actions",
                label: "Action",
                sortable: false,
                hideable: false,
                draggable: false,
              },
              {
                key: "carImage",
                label: "Car Image",
                sortable: false,
                hideable: true,
                draggable: true,
              },
              {
                key: "driver",
                label: "Driver",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "registrationNumber",
                label: "Registration Number",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "passengers",
                label: "Passenger's",
                sortable: false,
                hideable: true,
                draggable: true,
              },
              {
                key: "leavingFrom",
                label: "Leaving from",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "destination",
                label: "Destination",
                sortable: true,
                hideable: true,
                draggable: true,
              },
            ]}
            renderRow={(ride) => ({
              actions: (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/pulse/carpool/ride-detail?id=${ride.id}`);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              ),
              carImage: (
                <img
                  src={ride.carImage}
                  alt="Car"
                  className="w-10 h-auto object-contain"
                />
              ),
              driver: ride.driver,
              registrationNumber: ride.registrationNumber,
              passengers: (
                <div className="max-w-[200px]">{ride.passengers}</div>
              ),
              leavingFrom: ride.leavingFrom,
              destination: ride.destination,
            })}
            enableSearch={true}
            enableSelection={false}
            selectable={false}
            enableExport={true}
            hideTableSearch={false}
            storageKey="carpool-rides-table"
            searchTerm={searchQuery}
            onSearchChange={handleSearch}
            emptyMessage="No rides found"
            searchPlaceholder="Search rides..."
            exportFileName="carpool-rides"
          />
        </>
      )}

      {/* Upcoming Rides View with Different Columns */}
      {activeView === "upcoming" && (
        <>
          <EnhancedTaskTable
            data={currentRides}
            columns={[
              {
                key: "destination",
                label: "Destination",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "departureTime",
                label: "Departure Time",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "expectedArrivalTime",
                label: "Expected Arrival time",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "rideDate",
                label: "Ride Date",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "bookingDate",
                label: "Booking Date",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "seat",
                label: "Seat",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "pricePerPerson",
                label: "Price Per Person",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "status",
                label: "Status",
                sortable: true,
                hideable: true,
                draggable: true,
              },
            ]}
            renderRow={(ride) => ({
              destination: ride.destination,
              departureTime: ride.departureTime,
              expectedArrivalTime: ride.expectedArrivalTime,
              rideDate: ride.rideDate,
              bookingDate: ride.bookingDate,
              seat: ride.seat,
              pricePerPerson: ride.pricePerPerson,
              status: (
                <Badge
                  variant="secondary"
                  className={
                    ride.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {ride.status}
                </Badge>
              ),
            })}
            enableSearch={true}
            hideColumnsButton={true}
            enableSelection={false}
            hideTableExport={true}
            selectable={false}
            enableExport={true}
            hideTableSearch={true}
            storageKey="carpool-upcoming-rides-table"
            searchTerm={searchQuery}
            onSearchChange={handleSearch}
            emptyMessage="No upcoming rides found"
            searchPlaceholder="Search rides..."
            exportFileName="carpool-upcoming-rides"
          />
        </>
      )}

      {/* Active Now View */}
      {activeView === "active" && (
        <div className="space-y-4">
          <EnhancedTaskTable
            data={currentRides}
            columns={[
              {
                key: "actions",
                label: "Action",
                sortable: false,
                hideable: false,
                draggable: false,
              },
              {
                key: "carImage",
                label: "Car Image",
                sortable: false,
                hideable: true,
                draggable: true,
              },
              {
                key: "driver",
                label: "Driver",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "registrationNumber",
                label: "Registration Number",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "passengers",
                label: "Passenger's",
                sortable: false,
                hideable: true,
                draggable: true,
              },
              {
                key: "leavingFrom",
                label: "Leaving from",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "destination",
                label: "Destination",
                sortable: true,
                hideable: true,
                draggable: true,
              },
            ]}
            renderRow={(ride) => ({
              actions: (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/pulse/carpool/ride-detail?id=${ride.id}`);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              ),
              carImage: (
                <img
                  src={ride.carImage}
                  alt="Car"
                  className="w-10 h-auto object-contain"
                />
              ),
              driver: ride.driver,
              registrationNumber: ride.registrationNumber,
              passengers: (
                <div className="max-w-[200px]">{ride.passengers}</div>
              ),
              leavingFrom: ride.leavingFrom,
              destination: ride.destination,
            })}
            enableSearch={true}
            enableSelection={false}
            hideColumnsButton={true}
            selectable={false}
            enableExport={false}
            hideTableSearch={true}
            storageKey="carpool-active-rides-table"
            emptyMessage="No active rides"
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              className="bg-[#DC143C] hover:bg-[#B22222] text-white"
              onClick={() => handleTrackNow("all")}
            >
              Track Now
            </Button>
          </div>
        </div>
      )}

      {/* Active Reports View */}
      {activeView === "reports" && (
        <Tabs
          value={activeReportTab}
          onValueChange={setActiveReportTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white border">
            <TabsTrigger
              value="Under Review"
              className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
            >
              Under Review
            </TabsTrigger>
            <TabsTrigger
              value="Action in Progress"
              className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
            >
              Action in Progress
            </TabsTrigger>
            <TabsTrigger
              value="Resolved"
              className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
            >
              Resolved
            </TabsTrigger>
            <TabsTrigger
              value="Closed"
              className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
            >
              Closed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="Under Review">
            <EnhancedTaskTable
              data={currentRides}
              columns={[
                {
                  key: "actions",
                  label: "Action",
                  sortable: false,
                  hideable: false,
                  draggable: false,
                },
                {
                  key: "reportedBy",
                  label: "Reported by",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "reportedAgainst",
                  label: "Reported Against",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "issueDescription",
                  label: "Issue Description",
                  sortable: false,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "reportTime",
                  label: "Report Time",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "reportDate",
                  label: "Report Date",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "statusBadge",
                  label: "Status",
                  sortable: false,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "statusDropdown",
                  label: "Change Status",
                  sortable: false,
                  hideable: false,
                  draggable: false,
                },
              ]}
              renderRow={(report) => ({
                actions: (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pulse/carpool/ride-detail?id=${report.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                ),
                reportedBy: report.reportedBy,
                reportedAgainst: report.reportedAgainst,
                issueDescription: (
                  <div className="max-w-[250px]">{report.issueDescription}</div>
                ),
                reportTime: report.reportTime,
                reportDate: report.reportDate,
                statusBadge: (
                  <Badge variant="secondary" className="bg-gray-100">
                    Active
                  </Badge>
                ),
                statusDropdown: (
                  <div className="relative">
                    <select
                      value={selectedReportStatus[report.id] || report.status}
                      onChange={(e) =>
                        handleStatusChange(report.id, e.target.value)
                      }
                      className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent cursor-pointer"
                    >
                      <option value="Under Review">Under Review</option>
                      <option value="Action in Progress">
                        Action in Progress
                      </option>
                      <option value="Resolve">Resolve</option>
                      <option value="Closed">Closed</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                ),
              })}
              enableSearch={true}
              hideColumnsButton={true}
              enableSelection={false}
              hideTableExport={true}
              selectable={false}
              enableExport={true}
              hideTableSearch={true}
              storageKey="carpool-reports-table"
              emptyMessage="No reports found"
              exportFileName="carpool-reports"
            />
          </TabsContent>

          <TabsContent value="Action in Progress">
            <EnhancedTaskTable
              data={currentRides}
              columns={[
                {
                  key: "actions",
                  label: "Action",
                  sortable: false,
                  hideable: false,
                  draggable: false,
                },
                {
                  key: "reportedBy",
                  label: "Reported by",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "reportedAgainst",
                  label: "Reported Against",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "issueDescription",
                  label: "Issue Description",
                  sortable: false,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "reportTime",
                  label: "Report Time",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "reportDate",
                  label: "Report Date",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "statusBadge",
                  label: "Status",
                  sortable: false,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "statusDropdown",
                  label: "Change Status",
                  sortable: false,
                  hideable: false,
                  draggable: false,
                },
              ]}
              renderRow={(report) => ({
                actions: (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pulse/carpool/ride-detail?id=${report.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                ),
                reportedBy: report.reportedBy,
                reportedAgainst: report.reportedAgainst,
                issueDescription: (
                  <div className="max-w-[250px]">{report.issueDescription}</div>
                ),
                reportTime: report.reportTime,
                reportDate: report.reportDate,
                statusBadge: (
                  <Badge variant="secondary" className="bg-gray-100">
                    Active
                  </Badge>
                ),
                statusDropdown: (
                  <div className="relative">
                    <select
                      value={selectedReportStatus[report.id] || report.status}
                      onChange={(e) =>
                        handleStatusChange(report.id, e.target.value)
                      }
                      className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent cursor-pointer"
                    >
                      <option value="Under Review">Under Review</option>
                      <option value="Action in Progress">
                        Action in Progress
                      </option>
                      <option value="Resolve">Resolve</option>
                      <option value="Closed">Closed</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                ),
              })}
              enableSearch={true}
              hideColumnsButton={true}
              enableSelection={false}
              hideTableExport={true}
              selectable={false}
              enableExport={true}
              hideTableSearch={true}
              storageKey="carpool-reports-table"
              emptyMessage="No reports found"
              exportFileName="carpool-reports"
            />
          </TabsContent>

          <TabsContent value="Resolved">
            <EnhancedTaskTable
              data={currentRides}
              columns={[
                {
                  key: "actions",
                  label: "Action",
                  sortable: false,
                  hideable: false,
                  draggable: false,
                },
                {
                  key: "reportedBy",
                  label: "Reported by",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "reportedAgainst",
                  label: "Reported Against",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "issueDescription",
                  label: "Issue Description",
                  sortable: false,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "reportTime",
                  label: "Report Time",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "reportDate",
                  label: "Report Date",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "statusBadge",
                  label: "Status",
                  sortable: false,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "statusDropdown",
                  label: "Change Status",
                  sortable: false,
                  hideable: false,
                  draggable: false,
                },
              ]}
              renderRow={(report) => ({
                actions: (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pulse/carpool/ride-detail?id=${report.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                ),
                reportedBy: report.reportedBy,
                reportedAgainst: report.reportedAgainst,
                issueDescription: (
                  <div className="max-w-[250px]">{report.issueDescription}</div>
                ),
                reportTime: report.reportTime,
                reportDate: report.reportDate,
                statusBadge: (
                  <Badge variant="secondary" className="bg-gray-100">
                    Active
                  </Badge>
                ),
                statusDropdown: (
                  <div className="relative">
                    <select
                      value={selectedReportStatus[report.id] || report.status}
                      onChange={(e) =>
                        handleStatusChange(report.id, e.target.value)
                      }
                      className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent cursor-pointer"
                    >
                      <option value="Under Review">Under Review</option>
                      <option value="Action in Progress">
                        Action in Progress
                      </option>
                      <option value="Resolve">Resolve</option>
                      <option value="Closed">Closed</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                ),
              })}
              enableSearch={true}
              hideColumnsButton={true}
              enableSelection={false}
              hideTableExport={true}
              selectable={false}
              enableExport={true}
              hideTableSearch={true}
              storageKey="carpool-reports-table"
              emptyMessage="No reports found"
              exportFileName="carpool-reports"
            />
          </TabsContent>

          <TabsContent value="Closed">
            <EnhancedTaskTable
              data={currentRides}
              columns={[
                {
                  key: "actions",
                  label: "Action",
                  sortable: false,
                  hideable: false,
                  draggable: false,
                },
                {
                  key: "reportedBy",
                  label: "Reported by",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "reportedAgainst",
                  label: "Reported Against",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "issueDescription",
                  label: "Issue Description",
                  sortable: false,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "reportTime",
                  label: "Report Time",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "reportDate",
                  label: "Report Date",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "statusBadge",
                  label: "Status",
                  sortable: false,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "statusDropdown",
                  label: "Change Status",
                  sortable: false,
                  hideable: false,
                  draggable: false,
                },
              ]}
              renderRow={(report) => ({
                actions: (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pulse/carpool/ride-detail?id=${report.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                ),
                reportedBy: report.reportedBy,
                reportedAgainst: report.reportedAgainst,
                issueDescription: (
                  <div className="max-w-[250px]">{report.issueDescription}</div>
                ),
                reportTime: report.reportTime,
                reportDate: report.reportDate,
                statusBadge: (
                  <Badge variant="secondary" className="bg-gray-100">
                    Active
                  </Badge>
                ),
                statusDropdown: (
                  <div className="relative">
                    <select
                      value={selectedReportStatus[report.id] || report.status}
                      onChange={(e) =>
                        handleStatusChange(report.id, e.target.value)
                      }
                      className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent cursor-pointer"
                    >
                      <option value="Under Review">Under Review</option>
                      <option value="Action in Progress">
                        Action in Progress
                      </option>
                      <option value="Resolve">Resolve</option>
                      <option value="Closed">Closed</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                ),
              })}
              enableSearch={true}
              hideColumnsButton={true}
              enableSelection={false}
              hideTableExport={true}
              selectable={false}
              enableExport={true}
              hideTableSearch={true}
              storageKey="carpool-reports-table"
              emptyMessage="No reports found"
              exportFileName="carpool-reports"
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Active SOS View */}
      {activeView === "sos" && (
        <div className="space-y-4">
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-[#DC143C]">
              <div className="h-2 w-2 rounded-full bg-[#DC143C]"></div>
              Active Alerts
            </div>
          </div>

          <div className="space-y-4">
            {currentRides.map((alert) => (
              <Card
                key={alert.id}
                className="border-2 border-[#F2C6C3] bg-[#FAF1F0]"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#DC143C] p-3 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {alert.registrationNumber}
                          </h3>
                          <Badge className="bg-[#DC143C] text-white hover:bg-[#B22222]">
                            {alert.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {alert.alertTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-500">
                          Reported By
                        </p>
                      </div>
                      <p className="text-sm text-gray-900 font-medium">
                        {alert.reportedBy}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-500">
                          Contact
                        </p>
                      </div>
                      <p className="text-sm text-gray-900 font-medium">
                        {alert.reporterContact}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-500">
                        Location
                      </p>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">
                      {alert.location}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-900">
                      {alert.issueDescription}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      className="bg-[#DC143C] hover:bg-[#B22222] text-white"
                      onClick={() => handleTrackNow(alert.id)}
                    >
                      Track Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {activeView !== "sos" && totalPages > 1 && (
        <>
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          {/* Pagination Info */}
          <div className="text-center mt-2 text-sm text-gray-600">
            Showing page {currentPage} of {totalPages} ({filteredRides.length}{" "}
            total rides)
          </div>
        </>
      )}

      {/* Total Users View */}
      {activeView === "users" && (
        <>
          <EnhancedTaskTable
            data={usersData}
            columns={[
              {
                key: "actions",
                label: "Action",
                sortable: false,
                hideable: false,
                draggable: false,
              },
              {
                key: "accessCardNumber",
                label: "Access card Number",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "name",
                label: "Name",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "mobileNumber",
                label: "Mobile Number",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "emailAddress",
                label: "Email Address",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "employeeNumber",
                label: "Employee Number",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "gender",
                label: "Gender",
                sortable: true,
                hideable: true,
                draggable: true,
              },
            ]}
            renderRow={(user) => ({
              actions: (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
              ),
              accessCardNumber: user.accessCardNumber,
              name: user.name,
              mobileNumber: user.mobileNumber,
              emailAddress: user.emailAddress,
              employeeNumber: user.employeeNumber,
              gender: user.gender,
            })}
            enableSearch={true}
            hideTableExport={true}
            enableSelection={false}
            hideColumnsButton={true}
            selectable={false}
            enableExport={true}
            hideTableSearch={true}
            storageKey="carpool-users-table"
            searchTerm={searchQuery}
            onSearchChange={handleSearch}
            emptyMessage="No users found"
            searchPlaceholder="Search users..."
            exportFileName="carpool-users"
          />
        </>
      )}

      {/* Pending KYC View */}
      {activeView === "kyc" && (
        <>
          <EnhancedTaskTable
            data={pendingKYCData}
            columns={[
              {
                key: "actions",
                label: "Action",
                sortable: false,
                hideable: false,
                draggable: false,
              },
              {
                key: "accessCardNumber",
                label: "Access card Number",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "name",
                label: "Name",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "mobileNumber",
                label: "Mobile Number",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "emailAddress",
                label: "Email Address",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "employeeNumber",
                label: "Employee Number",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "gender",
                label: "Gender",
                sortable: true,
                hideable: true,
                draggable: true,
              },
            ]}
            renderRow={(user) => ({
              actions: (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
              ),
              accessCardNumber: user.accessCardNumber,
              name: user.name,
              mobileNumber: user.mobileNumber,
              emailAddress: user.emailAddress,
              employeeNumber: user.employeeNumber,
              gender: user.gender,
            })}
            enableSearch={true}
            hideColumnsButton={true}
            enableSelection={false}
            hideTableExport={true}
            selectable={false}
            enableExport={true}
            hideTableSearch={true}
            storageKey="carpool-pending-kyc-table"
            searchTerm={searchQuery}
            onSearchChange={handleSearch}
            emptyMessage="No pending KYC found"
            searchPlaceholder="Search pending KYC..."
            exportFileName="carpool-pending-kyc"
          />
        </>
      )}

      {/* Live Tracking View */}
      {activeView === "tracking" && (
        <div className="space-y-6">
          {/* Tracking Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockTrackingRides.map((ride) => (
              <Card key={ride.id} className="border shadow-sm">
                <CardContent className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {ride.registrationNumber}{" "}
                        <span className="text-gray-500">({ride.gender})</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 mt-1">
                        {ride.driver}
                      </div>
                    </div>
                    <Badge className="bg-[#DC143C] text-white hover:bg-[#B22222] text-xs">
                      {ride.status}
                    </Badge>
                  </div>

                  {/* Route */}
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Route</span>
                      <div className="mt-0.5">{ride.route}</div>
                    </div>
                  </div>

                  {/* Current Location */}
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Current Location</span>
                      <div className="mt-0.5">{ride.currentLocation}</div>
                    </div>
                  </div>

                  {/* ETA */}
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">ETA</span>
                      <div className="mt-0.5">{ride.eta}</div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 font-medium">
                        Progress
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {ride.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#DC143C] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${ride.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Passengers */}
                  <div className="space-y-1">
                    <div className="text-xs text-gray-600 font-medium">
                      Passengers
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {ride.passengers.map((passenger, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-gray-100 text-gray-700 text-xs font-normal"
                        >
                          {passenger}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map Section */}
          <Card className="border shadow-sm">
            <CardContent className="p-0">
              <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
                {/* Map Placeholder - You can integrate Google Maps or any other map service here */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
                  <div className="text-center space-y-2">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-500 font-medium">
                      Map View
                    </p>
                    <p className="text-xs text-gray-400">
                      Integrate Google Maps or similar service for live tracking
                    </p>
                  </div>
                </div>

                {/* Sample Map Markers for demonstration */}
                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white rounded px-2 py-1 shadow-md text-xs whitespace-nowrap">
                      MH 01 AB 2345
                      <div className="text-[10px] text-gray-500">Hamza</div>
                    </div>
                    <Car className="w-8 h-8 text-red-600" />
                  </div>
                </div>

                <div className="absolute top-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white rounded px-2 py-1 shadow-md text-xs whitespace-nowrap">
                      MH 04 GH 4455
                      <div className="text-[10px] text-gray-500">Yukta</div>
                    </div>
                    <Car className="w-8 h-8 text-red-600" />
                  </div>
                </div>

                <div className="absolute bottom-1/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white rounded px-2 py-1 shadow-md text-xs whitespace-nowrap">
                      MH 12 ST 1010
                      <div className="text-[10px] text-gray-500">Rahul</div>
                    </div>
                    <Car className="w-8 h-8 text-red-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
