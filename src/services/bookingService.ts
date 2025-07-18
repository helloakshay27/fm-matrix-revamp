import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';

export interface FacilityBookingResponse {
  id: number;
  book_by: string;
  book_for?: string;
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
    bookedBy: safeValue(apiData.book_by),
    bookedFor: safeValue(apiData.book_for),
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

export const fetchFacilityBookings = async (): Promise<BookingData[]> => {
  try {
    const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.FACILITY_BOOKINGS), {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle both direct array and nested structure
    const bookings = data.facility_bookings || data;
    
    if (!Array.isArray(bookings)) {
      console.error('Expected array of bookings, got:', typeof bookings);
      return [];
    }

    return bookings.map(transformBookingData);
  } catch (error) {
    console.error('Error fetching facility bookings:', error);
    throw error;
  }
};