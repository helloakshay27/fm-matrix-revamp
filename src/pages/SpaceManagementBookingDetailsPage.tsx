import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, Clock, MapPin, User, ChevronDown, ChevronUp } from "lucide-react";
import { getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';

interface BookingDetails {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeePhone: string;
  scheduleDate: string;
  day: string;
  category: string;
  building: string;
  floor: string;
  designation: string;
  department: string;
  slotsAndSeat: string;
  status: string;
  createdOn: string;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
}

// API Response Interface
interface SeatBookingApiResponse {
  id: number;
  resource_id: number;
  resource_type: string;
  user_id: number;
  booking_date: string;
  status: string;
  cancelled_by_id: number | null;
  cancelled_at: string | null;
  seat_configuration_id: number;
  user_name: string;
  user_email: string;
  booking_day: string;
  category: string;
  building: string;
  floor: string;
  designation: string;
  department: string;
  slots: string;
  created_at: string;
}

export const SpaceManagementBookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Expandable sections state
  const [expandedSections, setExpandedSections] = useState({
    bookingInfo: true,
    employeeInfo: true,
    locationInfo: true,
    attendanceInfo: true,
    activityLog: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Booking data state
  const [booking, setBooking] = useState<BookingDetails>({
    id: "",
    employeeId: "",
    employeeName: "",
    employeeEmail: "",
    employeePhone: "",
    scheduleDate: "",
    day: "",
    category: "",
    building: "",
    floor: "",
    designation: "",
    department: "",
    slotsAndSeat: "",
    status: "",
    createdOn: "",
  });

  // Fetch booking details from API
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Get current user ID from localStorage
        const userData = localStorage.getItem('user');
        let currentUserId = null;
        if (userData) {
          try {
            const user = JSON.parse(userData);
            currentUserId = user.id ? user.id.toString() : null;
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }
        
        const url = getFullUrl(`/pms/admin/seat_bookings/${id}.json`);
        const options = getAuthenticatedFetchOptions();
        
        // Add query parameter for user_id
        const params = new URLSearchParams();
        if (currentUserId) {
          params.append('q[user_id_eq]', currentUserId);
        }
        
        const fullUrl = `${url}?${params.toString()}`;
        console.log('🔍 Fetching booking details from:', fullUrl);
        
        const response = await fetch(fullUrl, options);
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', response.headers);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Response error:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Check if response has content
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const responseText = await response.text();
          console.error('❌ Non-JSON response:', responseText);
          throw new Error('Response is not JSON');
        }
        
        const responseText = await response.text();
        console.log('📄 Response text:', responseText);
        
        if (!responseText || responseText.trim() === '') {
          console.error('❌ Empty response');
          throw new Error('Empty response from server');
        }
        
        const data: SeatBookingApiResponse = JSON.parse(responseText);
        console.log('📊 Booking details data:', data);
        
        // Transform API data to match UI structure
        setBooking({
          id: data.id.toString(),
          employeeId: data.user_id.toString(),
          employeeName: data.user_name,
          employeeEmail: data.user_email,
          employeePhone: "+91 98765 43210", // Not available in API, using placeholder
          scheduleDate: data.booking_date,
          day: data.booking_day,
          category: data.category,
          building: data.building,
          floor: data.floor,
          designation: data.designation,
          department: data.department,
          slotsAndSeat: data.slots,
          status: data.status,
          createdOn: data.created_at,
          checkInTime: undefined, // Not available in current API response
          checkOutTime: undefined, // Not available in current API response
          notes: undefined // Not available in current API response
        });
        
      } catch (error) {
        console.error('❌ Error fetching booking details:', error);
        toast.error('Failed to load booking details');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id, navigate]);

  const statusPill = (status: string): React.CSSProperties => {
    if (status === 'Cancelled') {
      return { backgroundColor: 'var(--color-error-bg)', color: 'var(--color-danger)' };
    }
    if (status === 'Confirmed') {
      return { backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-solid)' };
    }
    return { backgroundColor: 'var(--color-surface)', color: 'var(--color-ink-68)' };
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--color-ink-48)', margin: '0 0 4px' }}>
        {label}
      </p>
      <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--color-text)', lineHeight: 1.4 }}>
        {children}
      </div>
    </div>
  );

  const Section = ({
    title,
    icon: Icon,
    open,
    onToggle,
    children,
  }: {
    title: string;
    icon: React.ElementType;
    open: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => (
    <div
      className="bg-white"
      style={{
        border: '1px solid var(--color-divider)',
        borderRadius: 16,
        boxShadow: 'none',
        outline: 'none',
      }}
    >
      <div
        onClick={onToggle}
        className="flex cursor-pointer items-center justify-between"
        style={{ padding: '22px 24px', backgroundColor: '#fff' }}
      >
        <div className="flex items-center" style={{ gap: 8 }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-ink-68)]">
            <Icon className="h-4 w-4" />
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: 'var(--color-text)', margin: 0 }}>
            {title}
          </h3>
        </div>
        {open
          ? <ChevronUp className="h-4 w-4 text-[var(--color-ink-48)]" />
          : <ChevronDown className="h-4 w-4 text-[var(--color-ink-48)]" />}
      </div>
      {open && (
        <div style={{ padding: '0 24px 22px', backgroundColor: '#fff' }}>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 14 }}>
            {children}
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
          <p className="text-gray-700">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div style={{ padding: '24px 32px 48px' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 text-[12.5px] font-semibold text-[var(--color-ink-48)] hover:text-[var(--color-text)]"
          style={{ marginBottom: 12 }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex items-start justify-between" style={{ marginBottom: 22, gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.2, margin: 0, color: 'var(--color-text)' }}>
              Booking
            </h1>
            <p style={{ fontSize: 13.5, color: 'var(--color-ink-68)', margin: '4px 0 0' }}>{booking.employeeName}</p>
          </div>
          <span
            className="rounded-full"
            style={{ ...statusPill(booking.status), fontSize: 12, fontWeight: 600, padding: '4px 12px', border: 'none' }}
          >
            {booking.status}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Section
            title="Booking Information"
            icon={Calendar}
            open={expandedSections.bookingInfo}
            onToggle={() => toggleSection('bookingInfo')}
          >
            <Field label="Booking ID">{booking.id}</Field>
            <Field label="Schedule Date">{booking.scheduleDate}</Field>
            <Field label="Day">{booking.day}</Field>
            <Field label="Category">{booking.category}</Field>
            <Field label="Time Slot">{booking.slotsAndSeat}</Field>
            <Field label="Created On">{booking.createdOn}</Field>
            {booking.notes && <div className="md:col-span-3"><Field label="Notes">{booking.notes}</Field></div>}
          </Section>

          <Section
            title="Employee Information"
            icon={User}
            open={expandedSections.employeeInfo}
            onToggle={() => toggleSection('employeeInfo')}
          >
            <Field label="Employee ID">{booking.employeeId}</Field>
            <Field label="Employee Name">{booking.employeeName}</Field>
            <Field label="Email">{booking.employeeEmail}</Field>
            <Field label="Phone">{booking.employeePhone}</Field>
            <Field label="Designation">{booking.designation || 'Not specified'}</Field>
            <Field label="Department">{booking.department || 'Not specified'}</Field>
          </Section>

          <Section
            title="Location Information"
            icon={MapPin}
            open={expandedSections.locationInfo}
            onToggle={() => toggleSection('locationInfo')}
          >
            <Field label="Building">{booking.building}</Field>
            <Field label="Floor">{booking.floor}</Field>
            <Field label="Seat Details">{booking.slotsAndSeat}</Field>
          </Section>

          <Section
            title="Attendance Information"
            icon={Clock}
            open={expandedSections.attendanceInfo}
            onToggle={() => toggleSection('attendanceInfo')}
          >
            <Field label="Check-In Time">{booking.checkInTime || 'Not checked in yet'}</Field>
            <Field label="Check-Out Time">{booking.checkOutTime || 'Not checked out yet'}</Field>
            <Field label="Status">
              <span
                className="inline-flex rounded-full"
                style={{ ...statusPill(booking.status), fontSize: 12, fontWeight: 600, padding: '3px 10px' }}
              >
                {booking.status}
              </span>
            </Field>
          </Section>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-[42px] w-[160px] shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary)] px-[22px] text-[13px] font-semibold leading-none text-white hover:bg-[var(--color-primary-hover)]"
            style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff', boxShadow: 'none' }}
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};
