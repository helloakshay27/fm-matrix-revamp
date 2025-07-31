import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';
import axios from 'axios';
export interface PaginationInfo {
  current_page: number;
  total_count: number;
  total_pages: number;
}

export interface FacilityBookingResponse {
  id: number;
  created_by_name: string;
  booked_by_name?: string;
  facility_name: string;
  fac_type: string;
  startdate: string;
  show_schedule_24_hour: string;
  current_status: string;
  created_at: string;
  company_name: string;
  source: string;
}

export interface BookingData {
  id: number;
  bookedBy: string;
  bookedFor: string;
  companyName: string;
  facility: string;
  facilityType: string;
  scheduledDate: string;
  scheduledTime: string;
  bookingStatus: 'Confirmed' | 'Pending' | 'Cancelled';
  createdOn: string;
  source: string;
}

export interface FacilityBookingsResponse {
  bookings: BookingData[];
  pagination: PaginationInfo;
}


// Helper function to format date from ISO string to "9 June 2025" format
const formatDate = (dateString: string): string => {
  if (!dateString) return '-';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    return '-';
  }
};

// Helper function to safely get value or return "-"
const safeValue = (value: any): string => {
  return value && value.toString().trim() ? value.toString() : '-';
};

// Transform API response to BookingData format
const transformBookingData = (apiData: FacilityBookingResponse): BookingData => {
  return {
    id: apiData.id,
    bookedBy: safeValue(apiData.created_by_name),
    bookedFor: safeValue(apiData.booked_by_name),
    companyName: safeValue(apiData.company_name),
    facility: safeValue(apiData.facility_name),
    facilityType: safeValue(apiData.fac_type),
    scheduledDate: formatDate(apiData.startdate),
    scheduledTime: safeValue(apiData.show_schedule_24_hour),
    bookingStatus: (apiData.current_status as 'Confirmed' | 'Pending' | 'Cancelled') || 'Pending',
    createdOn: formatDate(apiData.created_at),
    source: safeValue(apiData.source)
  };
};

export const fetchFacilityBookings = async ({ baseUrl, token, pageSize, currentPage }): Promise<FacilityBookingsResponse[]> => {
  try {
    const response = await axios.get(`https://${baseUrl}/pms/admin/facility_bookings.json?per_page=${pageSize}&page=${currentPage}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })

    console.log(response)

    const data = response.data;

    const bookingsRaw = data.facility_bookings || [];
    const pagination = data.pagination || {
      current_page: 1,
      total_count: bookingsRaw.length,
      total_pages: 1,
    };

    if (!Array.isArray(bookingsRaw)) {
      console.error('Expected array of bookings, got:', typeof bookingsRaw);
      return { bookings: [], pagination };
    }

    const bookings = bookingsRaw.map(transformBookingData);

    return { bookings, pagination };
  } catch (error) {
    console.error('Error fetching facility bookings:', error);
    throw error;
  }
};