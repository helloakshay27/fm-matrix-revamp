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
  name: string;
  start_time: string;
  end_time: string;
}

interface RosterTemplate {
  id: number;
  name: string;
  working_days: string[];
  day_type: 'Weekdays' | 'Weekends' | 'Recurring';
  week_selection: string[];
  location: string;
  department_ids: number[];
  shift_id: number;
  employee_ids: number[];
  roster_type: string;
  active: boolean;
  created_at: string;
  updated_at?: string;
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
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    if (id) {
      fetchRosterTemplate();
      fetchFMUsers();
      fetchDepartments();
      fetchShifts();
    }
  }, [id]);

  // Fetch Roster Template
  const fetchRosterTemplate = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration - replace with actual API call
      const mockTemplate: RosterTemplate = {
        id: parseInt(id!),
        name: 'Security Team Morning Shift',
        working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        day_type: 'Weekdays',
        week_selection: ['1st Week', '2nd Week', '3rd Week', '4th Week', 'All'],
        location: 'Corporate Office - Tower A',
        department_ids: [1, 2],
        shift_id: 1,
        employee_ids: [101, 102, 103],
        roster_type: 'Permanent',
        active: true,
        created_at: '2025-08-01T10:00:00Z',
        updated_at: '2025-08-15T14:30:00Z'
      };

      setRosterTemplate(mockTemplate);
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

  // Fetch Shifts
  const fetchShifts = async () => {
    try {
      // Mock shift data - replace with actual API call
      const mockShifts = [
        { id: 1, name: 'Morning Shift', start_time: '09:00', end_time: '17:00' },
        { id: 2, name: 'Evening Shift', start_time: '17:00', end_time: '01:00' },
        { id: 3, name: 'Night Shift', start_time: '01:00', end_time: '09:00' },
        { id: 4, name: 'Extended Shift', start_time: '10:00', end_time: '20:00' }
      ];
      setShifts(mockShifts);
    } catch (error) {
      console.error('Error fetching shifts:', error);
      setShifts([]);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this roster template?')) {
      return;
    }

    try {
      // API call to delete roster template would go here
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
    if (!rosterTemplate) return [];
    return departments.filter(dept => rosterTemplate.department_ids.includes(dept.id!));
  };

  const getSelectedEmployees = () => {
    if (!rosterTemplate) return [];
    return fmUsers.filter(user => rosterTemplate.employee_ids.includes(user.id));
  };

  const getSelectedShift = () => {
    if (!rosterTemplate) return null;
    return shifts.find(shift => shift.id === rosterTemplate.shift_id);
  };

  const formatWorkingDays = () => {
    if (!rosterTemplate) return '';
    
    if (rosterTemplate.day_type === 'Weekdays') {
      return 'Monday - Friday';
    } else if (rosterTemplate.day_type === 'Weekends') {
      return 'Saturday - Sunday';
    } else {
      return `${rosterTemplate.working_days.length} custom days selected`;
    }
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
                <span className="text-sm text-gray-600">{rosterTemplate.location}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className={`text-sm px-2 py-1 rounded-full ${rosterTemplate.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {rosterTemplate.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleEdit} variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button onClick={handleDelete} variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
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
              <p className="text-gray-900">{rosterTemplate.roster_type}</p>
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
                  <span className="font-medium text-gray-900">{rosterTemplate.day_type}</span>
                  <span className="text-sm text-gray-500">({formatWorkingDays()})</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Frequency</label>
                <div className="flex flex-wrap gap-2">
                  {rosterTemplate.week_selection.map((week) => (
                    <span
                      key={week}
                      className="inline-block px-2 py-1 bg-[#C72030] text-white text-xs rounded-md"
                    >
                      {week}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {rosterTemplate.day_type === 'Recurring' && rosterTemplate.working_days.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Custom Days Selected</label>
                <div className="flex flex-wrap gap-2">
                  {rosterTemplate.working_days.map((day) => (
                    <span
                      key={day}
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
                <span className="text-gray-900">{rosterTemplate.location}</span>
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
                  <span className="font-medium text-gray-900">{getSelectedShift()?.name}</span>
                  <span className="text-sm text-gray-600">
                    ({getSelectedShift()?.start_time} - {getSelectedShift()?.end_time})
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Assigned Employees ({getSelectedEmployees().length})
              </label>
              <div className="space-y-2">
                {getSelectedEmployees().map((user) => (
                  <div 
                    key={user.id}
                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Users className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{user.email || 'No email available'}</div>
                      <div className="text-sm text-gray-600">{user.name}</div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {user.department || 'No dept'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Metadata */}
        <Section title="Metadata" icon={<Calendar className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Created Date</label>
              <p className="text-gray-900">{new Date(rosterTemplate.created_at).toLocaleString()}</p>
            </div>
            {rosterTemplate.updated_at && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Last Updated</label>
                <p className="text-gray-900">{new Date(rosterTemplate.updated_at).toLocaleString()}</p>
              </div>
            )}
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
