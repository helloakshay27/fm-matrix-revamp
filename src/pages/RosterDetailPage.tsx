import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, Building2, Clock, Users, Edit, Download, Trash2, Eye } from 'lucide-react';
import { Chip, Box } from '@mui/material';
import { toast } from 'sonner';
import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { departmentService, Department } from '@/services/departmentService';
import { RootState } from '@/store/store';

// Section component for consistent layout
const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <section className="bg-card rounded-lg border border-border shadow-sm">
    <div className="px-6 py-4 border-b border-border flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-sm font-semibold tracking-wide uppercase">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </section>
);

// Types
interface FMUser {
  id: number;
  name: string;
  email?: string;
  department?: string;
}

interface Shift {
  id: number;
  start_hour: number;
  start_min: number;
  end_hour: number;
  end_min: number;
  timings: string;
  total_hour: number;
}

interface RosterTemplate {
  id: number;
  name: string;
  no_of_days: any[];
  allocation_type: string;
  roaster_type: 'Weekdays' | 'Weekends' | 'Recurring';
  start_date: string;
  end_date: string;
  created_by_id: number;
  resource_id: number;
  resource_type: string;
  department_id: number[] | number | null;
  user_shift_id: number;
  seat_type: string | null;
  active: boolean;
  seat_category_id: number;
  created_at: string;
  updated_at: string;
}

export const RosterDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Redux state for site information
  const { selectedSite } = useSelector((state: RootState) => state.site);

  // Set document title
  useEffect(() => { 
    document.title = 'Roster Template Details'; 
  }, []);

  // Data states
  const [rosterTemplate, setRosterTemplate] = useState<RosterTemplate | null>(null);
  const [fmUsers, setFMUsers] = useState<FMUser[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    if (id) {
      fetchRosterTemplate();
      fetchFMUsers();
      fetchDepartments();
      fetchShifts();
      fetchCurrentLocation();
    }
  }, [id]);

  // Fetch Roster Template
  const fetchRosterTemplate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/admin/user_roasters/${id}.json`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Roster Template API Response:', data);
      setRosterTemplate(data);
    } catch (error) {
      console.error('Error fetching roster template:', error);
      toast.error('Failed to load roster template details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch FM Users
  const fetchFMUsers = async () => {
    try {
      const apiUrl = getFullUrl(API_CONFIG.ENDPOINTS.FM_USERS);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Adapt the response to our expected format
      const users = data.fm_users || data.users || data || [];
      setFMUsers(users.map((user: any) => ({
        id: user.id,
        name: user.name || user.full_name || `${user.firstname || ''} ${user.lastname || ''}`.trim(),
        email: user.email,
        department: user.department ? user.department.department_name : undefined
      })));
    } catch (error) {
      console.error('Error fetching FM Users:', error);
      setFMUsers([]);
    }
  };

  // Fetch Departments
  const fetchDepartments = async () => {
    try {
      const departmentData = await departmentService.fetchDepartments();
      setDepartments(departmentData);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    }
  };

  // Fetch Shifts from the API
  const fetchShifts = async () => {
    try {
      const apiUrl = getFullUrl('/pms/admin/user_shifts.json');
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Shifts API Response:', data);

      // Adapt the response to our expected format
      const shiftsData = data.user_shifts || data.shifts || data || [];
      setShifts(shiftsData.map((shift: any) => ({
        id: shift.id,
        start_hour: shift.start_hour,
        start_min: shift.start_min,
        end_hour: shift.end_hour,
        end_min: shift.end_min,
        timings: shift.timings,
        total_hour: shift.total_hour
      })));
    } catch (error) {
      console.error('Error fetching shifts:', error);
      toast.error('Failed to load shifts');
      setShifts([]);
    }
  };

  // Fetch Current Location (from site context)
  const fetchCurrentLocation = async () => {
    try {
      // First try to get from Redux state
      if (selectedSite?.name) {
        setCurrentLocation(selectedSite.name);
        return;
      }

      // Fallback to localStorage
      const siteId = localStorage.getItem('selectedSiteId');
      const siteName = localStorage.getItem('selectedSiteName');
      const companyName = localStorage.getItem('selectedCompanyName');

      let locationName = 'Current Site';

      if (siteName && siteName !== 'null' && siteName !== '') {
        locationName = siteName;
      } else if (companyName && companyName !== 'null' && companyName !== '') {
        locationName = companyName;
      }

      // Try to get from DOM if localStorage doesn't have it
      if (locationName === 'Current Site') {
        const headerSiteElement = document.querySelector('[data-site-name]');
        if (headerSiteElement) {
          locationName = headerSiteElement.textContent?.trim() || 'Current Site';
        }
      }

      setCurrentLocation(locationName);
    } catch (error) {
      console.error('Error fetching current location:', error);
      setCurrentLocation('Current Site');
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this roster template?')) {
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/admin/user_roasters/${id}.json`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete roster template');
      }

      toast.success('Roster template deleted successfully!');
      navigate('/roster');
    } catch (error) {
      console.error('Error deleting roster template:', error);
      toast.error('Failed to delete roster template');
    }
  };

  // Handle edit
  const handleEdit = () => {
    navigate(`/roster/edit/${id}`);
  };

  // Handle export
  const handleExport = () => {
    toast.success('Export functionality coming soon!');
  };

  // Helper functions
  const getSelectedDepartments = () => {
    if (!rosterTemplate || !rosterTemplate.department_id) return [];
    const deptIds = Array.isArray(rosterTemplate.department_id) 
      ? rosterTemplate.department_id 
      : [rosterTemplate.department_id];
    return departments.filter(dept => deptIds.includes(dept.id!));
  };

  const getSelectedEmployee = () => {
    if (!rosterTemplate || !rosterTemplate.resource_id) return null;
    return fmUsers.find(user => user.id === rosterTemplate.resource_id);
  };

  const getSelectedShift = () => {
    if (!rosterTemplate || !rosterTemplate.user_shift_id) return null;
    return shifts.find(shift => shift.id === rosterTemplate.user_shift_id);
  };

  const formatWorkingDays = () => {
    if (!rosterTemplate) return '';
    
    if (rosterTemplate.roaster_type === 'Weekdays') {
      return 'Monday - Friday';
    } else if (rosterTemplate.roaster_type === 'Weekends') {
      return 'Saturday - Sunday';
    } else if (rosterTemplate.roaster_type === 'Recurring') {
      // Parse recurring data from no_of_days
      if (rosterTemplate.no_of_days && Array.isArray(rosterTemplate.no_of_days) && rosterTemplate.no_of_days.length > 0) {
        const recurringData = rosterTemplate.no_of_days[0];
        const totalDays = Object.keys(recurringData).reduce((acc, weekNum) => {
          return acc + recurringData[weekNum].length;
        }, 0);
        return `${totalDays} custom days across ${Object.keys(recurringData).length} weeks`;
      }
      return 'Custom recurring pattern';
    }
    return 'Not specified';
  };

  const getWeekSelectionDisplay = () => {
    if (!rosterTemplate || !rosterTemplate.no_of_days) return [];
    
    if (rosterTemplate.roaster_type === 'Recurring') {
      if (Array.isArray(rosterTemplate.no_of_days) && rosterTemplate.no_of_days.length > 0) {
        const recurringData = rosterTemplate.no_of_days[0];
        return Object.keys(recurringData).map(weekNum => `Week ${weekNum}`);
      }
    } else if (rosterTemplate.roaster_type === 'Weekdays') {
      if (Array.isArray(rosterTemplate.no_of_days)) {
        return rosterTemplate.no_of_days.map((weekNum: string) => 
          `${weekNum}${weekNum === '1' ? 'st' : weekNum === '2' ? 'nd' : weekNum === '3' ? 'rd' : 'th'} Week`
        );
      }
    } else if (rosterTemplate.roaster_type === 'Weekends') {
      if (Array.isArray(rosterTemplate.no_of_days)) {
        return rosterTemplate.no_of_days.map((weekendNum: string) => 
          `${weekendNum}${weekendNum === '1' ? 'st' : weekendNum === '2' ? 'nd' : weekendNum === '3' ? 'rd' : 'th'} Weekend`
        );
      }
    }
    return [];
  };

  const getCustomWorkingDays = () => {
    if (!rosterTemplate || rosterTemplate.roaster_type !== 'Recurring' || !rosterTemplate.no_of_days) return [];
    
    if (Array.isArray(rosterTemplate.no_of_days) && rosterTemplate.no_of_days.length > 0) {
      const recurringData = rosterTemplate.no_of_days[0];
      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const customDays: string[] = [];
      
      Object.keys(recurringData).forEach(weekNum => {
        const dayNumbers = recurringData[weekNum];
        dayNumbers.forEach((dayNum: string) => {
          const dayName = dayNames[parseInt(dayNum) - 1];
          if (dayName) {
            customDays.push(`Week ${weekNum} - ${dayName}`);
          }
        });
      });
      
      return customDays;
    }
    return [];
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading roster template details...</p>
        </div>
      </div>
    );
  }

  if (!rosterTemplate) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Roster template not found</p>
          <Button onClick={() => navigate('/roster')} variant="outline">
            Back to Roster Management
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/roster')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Back to Roster Management"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C72030]/10 text-[#C72030] flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide uppercase">Roster Template Details</h1>
              <div className="flex items-center gap-2 mt-1">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{currentLocation}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className={`text-sm px-2 py-1 rounded-full ${rosterTemplate.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {rosterTemplate.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
         
          <Button onClick={handleEdit} variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          {/* <Button onClick={handleDelete} variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button> */}
        </div>
      </header>

      {/* Content */}
      <div className="space-y-6">
        {/* Basic Information */}
        <Section title="Basic Information" icon={<Calendar className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Template Name</label>
              <p className="text-gray-900 font-medium">{rosterTemplate.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Roster Type</label>
              <p className="text-gray-900">{rosterTemplate.allocation_type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Status</label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${rosterTemplate.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {rosterTemplate.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </Section>

        {/* Working Days */}
        <Section title="Working Days Configuration" icon={<Calendar className="w-4 h-4" />}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Day Type</label>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-[#C72030]"></span>
                  <span className="font-medium text-gray-900">{rosterTemplate.roaster_type}</span>
                  <span className="text-sm text-gray-500">({formatWorkingDays()})</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Frequency</label>
                <div className="flex flex-wrap gap-2">
                  {getWeekSelectionDisplay().map((week, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 bg-[#C72030] text-white text-xs rounded-md"
                    >
                      {week}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {rosterTemplate.roaster_type === 'Recurring' && getCustomWorkingDays().length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Custom Days Selected</label>
                <div className="flex flex-wrap gap-2">
                  {getCustomWorkingDays().map((day, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md border"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* Location & Department */}
        <Section title="Location & Department" icon={<MapPin className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Location</label>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{currentLocation}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Departments</label>
              <div className="flex flex-wrap gap-2">
                {getSelectedDepartments().map((dept) => (
                  <Chip 
                    key={dept.id}
                    label={dept.department_name}
                    size="small"
                    sx={{ backgroundColor: '#C72030', color: 'white' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Shift & Employees */}
        <Section title="Shift & Employees" icon={<Clock className="w-4 h-4" />}>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Assigned Shift</label>
              {getSelectedShift() && (
                <div className="flex items-center gap-2 p-3 bg-[#f6f4ee] border border-[#D5DbDB] rounded-lg">
                  <Clock className="w-4 h-4 text-[#C72030]" />
                  <span className="font-medium text-gray-900">{getSelectedShift()?.timings}</span>
                  <span className="text-sm text-gray-600">
                    ({getSelectedShift()?.total_hour}h)
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Assigned Employee ({getSelectedEmployee() ? 1 : 0})
              </label>
              {getSelectedEmployee() && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{getSelectedEmployee()?.name || 'No name available'}</div>
                      <div className="text-sm text-gray-600">{getSelectedEmployee()?.email}</div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {getSelectedEmployee()?.department || 'No dept'}
                    </span>
                  </div>
                </div>
              )}
              {!getSelectedEmployee() && (
                <p className="text-gray-500 italic">No employee assigned</p>
              )}
            </div>
          </div>
        </Section>

        {/* Date Range */}
        <Section title="Date Range" icon={<Calendar className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Start Date</label>
              <p className="text-gray-900">{new Date(rosterTemplate.start_date).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">End Date</label>
              <p className="text-gray-900">{new Date(rosterTemplate.end_date).toLocaleDateString()}</p>
            </div>
          </div>
        </Section>

    
      </div>

      {/* Footer Actions */}
      <div className="flex items-center gap-3 justify-center pt-2 border-t border-gray-200">
        <Button onClick={handleEdit} className="px-8">
          <Edit className="w-4 h-4 mr-2" />
          Edit Template
        </Button>
        <Button onClick={() => navigate('/roster')} variant="outline" className="px-8">
          Back to Roster List
        </Button>
      </div>
    </div>
  );
};
