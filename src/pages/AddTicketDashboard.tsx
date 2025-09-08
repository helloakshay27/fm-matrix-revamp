import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, Paperclip, X, User, Ticket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ticketManagementAPI, CategoryResponse, SubCategoryResponse, UserAccountResponse, OccupantUserResponse } from '@/services/ticketManagementAPI';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';

interface ComplaintModeResponse {
  id: number;
  name: string;
}

const PRIORITY_OPTIONS = [
  { value: 'P1', label: 'P1 - Critical' },
  { value: 'P2', label: 'P2 - Very High' },
  { value: 'P3', label: 'P3 - High' },
  { value: 'P4', label: 'P4 - Medium' },
  { value: 'P5', label: 'P5 - Low' }
];

const PROACTIVE_REACTIVE_OPTIONS = [
  { value: 'Proactive', label: 'Proactive' },
  { value: 'Reactive', label: 'Reactive' }
];

// Field styles for Material-UI components
const fieldStyles = {
  height: '45px',
  backgroundColor: '#fff',
  borderRadius: '4px',
  '& .MuiOutlinedInput-root': {
    height: '45px',
    '& fieldset': {
      borderColor: '#ddd',
    },
    '&:hover fieldset': {
      borderColor: '#C72030',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
};

export const AddTicketDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [onBehalfOf, setOnBehalfOf] = useState('self');
  const [ticketType, setTicketType] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFieldsReadOnly, setIsFieldsReadOnly] = useState(false);

  // Dropdown data states
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategoryResponse[]>([]);
  const [fmUsers, setFmUsers] = useState<any[]>([]);
  const [occupantUsers, setOccupantUsers] = useState<OccupantUserResponse[]>([]);
  const [userAccount, setUserAccount] = useState<UserAccountResponse | null>(null);
  const [complaintModes, setComplaintModes] = useState<ComplaintModeResponse[]>([]);
  const [isGoldenTicket, setIsGoldenTicket] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);

  // Loading states
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [loadingComplaintModes, setLoadingComplaintModes] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    site: 'Lockated',
    department: '',
    unit: '',
    categoryType: '',
    subCategoryType: '',
    description: '',
    assignedTo: '',
    proactiveReactive: '',
    adminPriority: '',
    referenceNumber: '',
    mode: '',
    complaintMode: ''
  });

  // Load initial data
  useEffect(() => {
    loadCategories();
    loadFMUsers();
    loadOccupantUsers();
    loadComplaintModes();
    if (onBehalfOf === 'self') {
      loadUserAccount();
    }
  }, [onBehalfOf]);

  // Reset form when behalf selection changes
  useEffect(() => {
    setSelectedUser('');
    setSelectedUserId(null);
    setIsFieldsReadOnly(false);

    if (onBehalfOf === 'self') {
      loadUserAccount();
    } else {
      // Clear form data when switching to behalf of others
      setFormData(prev => ({
        ...prev,
        name: '',
        contactNumber: '',
        department: '',
        unit: ''
      }));
    }
  }, [onBehalfOf]);

  // Load categories
  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await ticketManagementAPI.getCategories();
      setCategories(response.helpdesk_categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  // Load subcategories when category changes
  const loadSubcategories = async (categoryId: number) => {
    setLoadingSubcategories(true);
    try {
      const subcats = await ticketManagementAPI.getSubCategoriesByCategory(categoryId);
      setSubcategories(subcats);
    } catch (error) {
      console.error('Error loading subcategories:', error);
      toast({
        title: "Error",
        description: "Failed to load subcategories",
        variant: "destructive"
      });
    } finally {
      setLoadingSubcategories(false);
    }
  };

  // Load FM users
  const loadFMUsers = async () => {
    try {
      const response = await ticketManagementAPI.getEngineers();
      setFmUsers(response.fm_users || []);
    } catch (error) {
      console.error('Error loading FM users:', error);
    }
  };

  // Load complaint modes
  const loadComplaintModes = async () => {
    setLoadingComplaintModes(true);
    try {
      const url = getFullUrl(API_CONFIG.ENDPOINTS.COMPLAINT_MODE);
      const options = getAuthenticatedFetchOptions('GET');

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Failed to fetch complaint modes: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Complaint modes response:', data);

      // The API returns an array directly, not wrapped in complaint_modes property
      setComplaintModes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading complaint modes:', error);
      toast({
        title: "Error",
        description: "Failed to load complaint modes",
        variant: "destructive"
      });
    } finally {
      setLoadingComplaintModes(false);
    }
  };

  // Load occupant users
  const loadOccupantUsers = async () => {
    setLoadingUsers(true);
    try {
      const users = await ticketManagementAPI.getOccupantUsers();
      setOccupantUsers(users);
    } catch (error) {
      console.error('Error loading occupant users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load user account details
  const loadUserAccount = async () => {
    setLoadingAccount(true);
    try {
      const account = await ticketManagementAPI.getUserAccount();
      setUserAccount(account);
      setFormData(prev => ({
        ...prev,
        name: `${account.firstname} ${account.lastname}`,
        department: account.department_name || '',
        contactNumber: account.mobile || ''
      }));
      setIsFieldsReadOnly(true);
    } catch (error) {
      console.error('Error loading user account:', error);
    } finally {
      setLoadingAccount(false);
    }
  };

  // Handle user selection and populate details
  const handleUserSelection = (userId: string) => {
    setSelectedUser(userId);
    const userIdNum = parseInt(userId);
    setSelectedUserId(userIdNum);

    if (onBehalfOf === 'fm-user') {
      const selectedFmUser = fmUsers.find(user => user.id === userIdNum);
      if (selectedFmUser) {
        setFormData(prev => ({
          ...prev,
          name: `${selectedFmUser.firstname} ${selectedFmUser.lastname}`,
          contactNumber: selectedFmUser.mobile || '',
          department: selectedFmUser.lock_user_permission?.designation || selectedFmUser.designation || '',
          unit: `Unit ${selectedFmUser.unit_id || ''}`,
          site: selectedFmUser.company_name || 'Lockated'
        }));
        setIsFieldsReadOnly(true);
      }
    } else if (onBehalfOf === 'occupant-user') {
      const selectedOccupantUser = occupantUsers.find(user => user.id === userIdNum);
      if (selectedOccupantUser) {
        setFormData(prev => ({
          ...prev,
          name: `${selectedOccupantUser.firstname} ${selectedOccupantUser.lastname}`,
          contactNumber: selectedOccupantUser.mobile || '',
          department: selectedOccupantUser.lock_user_permission?.designation || '',
          unit: `Unit ${selectedOccupantUser.unit_id || ''}`,
          site: selectedOccupantUser.company || 'Lockated'
        }));
        setIsFieldsReadOnly(true);
      }
    }
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({ ...prev, categoryType: categoryId, subCategoryType: '' }));
    setSubcategories([]);
    if (categoryId) {
      loadSubcategories(parseInt(categoryId));
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  // Remove file from attachments
  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!ticketType || !formData.categoryType || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate complaint mode is selected
    if (!formData.complaintMode) {
      toast({
        title: "Validation Error",
        description: "Please select a complaint mode",
        variant: "destructive"
      });
      return;
    }

    // Validate user selection for behalf of others
    if (onBehalfOf !== 'self' && !selectedUserId) {
      toast({
        title: "Validation Error",
        description: "Please select a user when creating ticket on behalf of others",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Ensure user account is loaded to get site_id
      if (!userAccount) {
        await loadUserAccount();
      }

      // Get site_id from user account API response
      const siteId = userAccount?.site_id?.toString();

      if (!siteId) {
        toast({
          title: "Error",
          description: "Unable to determine site ID from user account. Please refresh and try again.",
          variant: "destructive"
        });
        return;
      }

      const ticketData = {
        of_phase: 'pms',
        site_id: parseInt(siteId),
        on_behalf_of: onBehalfOf === 'self' ? 'admin' : onBehalfOf,
        complaint_type: ticketType,
        category_type_id: parseInt(formData.categoryType),
        priority: formData.adminPriority || '',
        society_staff_type: 'User',
        proactive_reactive: formData.proactiveReactive || '',
        heading: formData.description,
        ...(formData.complaintMode && { complaint_mode_id: parseInt(formData.complaintMode) }),
        room_id: 1,
        wing_id: 1,
        area_id: 1,
        floor_id: 1,
        // Add user parameters based on selection type
        ...(onBehalfOf === 'self' && userAccount?.id && { id_user: userAccount.id }),
        ...(onBehalfOf !== 'self' && selectedUserId && {
          sel_id_user: selectedUserId,
          id_user: selectedUserId
        }),
        ...(formData.assignedTo && { assigned_to: parseInt(formData.assignedTo) }),
        ...(formData.referenceNumber && { reference_number: formData.referenceNumber }),
        ...(formData.subCategoryType && { sub_category_id: parseInt(formData.subCategoryType) }),
        // Add golden ticket and flagged parameters
        is_golden_ticket: isGoldenTicket,
        is_flagged: isFlagged
      };

      console.log('Ticket payload before API call:', ticketData);
      console.log('Using site ID from user account:', siteId);
      console.log('User account info:', userAccount);
      console.log('Form data:', formData);
      console.log('Golden Ticket:', isGoldenTicket);
      console.log('Is Flagged:', isFlagged);

      const response = await ticketManagementAPI.createTicket(ticketData, attachedFiles);
      console.log('Create ticket response:', response);

      // Extract ticket number from response - common patterns are ticket_number, complaint_number, or number
      const ticketNumber = response?.ticket_number || response?.complaint_number || response?.number || response?.complaint?.ticket_number;

      toast({
        title: "Success",
        description: ticketNumber
          ? `Ticket created successfully - ${ticketNumber}`
          : "Ticket created successfully!"
      });

      // navigate('/maintenance/ticket');
      const currentPath = window.location.pathname;

      if (currentPath.includes("tickets")) {
        navigate("/tickets");
      } else {
        navigate("/maintenance/ticket");
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get users for dropdown based on behalf selection
  const getUsersForDropdown = () => {
    if (onBehalfOf === 'occupant-user') {
      return occupantUsers.map(user => ({
        id: user.id.toString(),
        name: `${user.firstname} ${user.lastname}`,
        type: 'occupant'
      }));
    } else if (onBehalfOf === 'fm-user') {
      return fmUsers.map(user => ({
        id: user.id.toString(),
        name: `${user.firstname} ${user.lastname}`,
        type: 'fm'
      }));
    }
    return [];
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">NEW TICKET</h1>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
        {/* Section 1: Requestor Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <User size={16} color="#C72030" />
              </span>
              Requestor Details
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Create Ticket On Behalf Of with Name and Department in same row */}
            <div className="grid grid-cols-3 gap-6">
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Create Ticket on Behalf of</InputLabel>
                <MuiSelect
                  value={onBehalfOf}
                  onChange={(e) => setOnBehalfOf(e.target.value)}
                  label="Create Ticket on Behalf of"
                  notched
                  displayEmpty
                  sx={{ backgroundColor: '#C4B89D59' }}
                >
                  <MenuItem value="self">Self</MenuItem>
                  <MenuItem value="occupant-user">Occupant User</MenuItem>
                  <MenuItem value="fm-user">FM User</MenuItem>
                </MuiSelect>
              </FormControl>
              <TextField
                label="Name"
                placeholder="Anamika Singh"
                value={formData.name}
                onChange={(e) => !isFieldsReadOnly && setFormData({ ...formData, name: e.target.value })}
                disabled={isFieldsReadOnly || (onBehalfOf === 'self' && loadingAccount)}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: {
                    ...fieldStyles,
                    backgroundColor: isFieldsReadOnly ? '#f9fafb' : '#fff',
                  },
                }}
              />
              <TextField
                label="Department"
                placeholder="Technical"
                value={formData.department}
                onChange={(e) => !isFieldsReadOnly && setFormData({ ...formData, department: e.target.value })}
                disabled={isFieldsReadOnly}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: {
                    ...fieldStyles,
                    backgroundColor: isFieldsReadOnly ? '#f9fafb' : '#fff',
                  },
                }}
              />
            </div>

            {/* User Selection Dropdown for behalf of others */}
            {onBehalfOf !== 'self' && (
              <FormControl
                fullWidth
                variant="outlined"
                required
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Select User</InputLabel>
                <MuiSelect
                  value={selectedUser}
                  onChange={(e) => handleUserSelection(e.target.value)}
                  label="Select User"
                  notched
                  displayEmpty
                  disabled={loadingUsers}
                >
                  <MenuItem value="">
                    {loadingUsers ? "Loading users..." : "Select User"}
                  </MenuItem>
                  {getUsersForDropdown().map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            )}
          </div>
        </div>

        {/* Section 2: Tickets Type */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <Ticket size={16} color="#C72030" />
              </span>
              Tickets Type
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Radio buttons for ticket type and flags */}
            <div className="flex gap-8">
              <RadioGroup value={ticketType} onValueChange={setTicketType} className="flex gap-8">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="request" id="request" className="text-[#C72030] border-[#C72030]" />
                  <label htmlFor="request" className="text-sm font-medium">Request</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="complaint" id="complaint" className="text-[#C72030] border-[#C72030]" />
                  <label htmlFor="complaint" className="text-sm font-medium">Complaint</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="suggestion" id="suggestion" className="text-[#C72030] border-[#C72030]" />
                  <label htmlFor="suggestion" className="text-sm font-medium">Suggestion</label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-8">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="golden"
                  checked={isGoldenTicket}
                  onChange={(e) => setIsGoldenTicket(e.target.checked)}
                  className="w-3 h-3 rounded border-2 border-[#C72030] text-[#C72030] focus:ring-[#C72030]"
                  style={{
                    accentColor: '#C72030'
                  }}
                />
                <label htmlFor="golden" className="text-sm font-medium">Golden Ticket</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="flagged"
                  checked={isFlagged}
                  onChange={(e) => setIsFlagged(e.target.checked)}
                  className="w-3 h-3 rounded border-2 border-[#C72030] text-[#C72030]"
                  style={{
                    accentColor: '#C72030'
                  }}
                />
                <label htmlFor="flagged" className="text-sm font-medium">Is Flagged</label>
              </div>
            </div>

            {/* Golden Ticket and Is Flagged radio buttons */}

            {/* <div className="flex items-center space-x-2">
                  <RadioGroupItem value="golden" id="golden" className="text-red-500 border-red-500" 
                    checked={isGoldenTicket}
                    onClick={() => setIsGoldenTicket(!isGoldenTicket)}
                  />
                  <label htmlFor="golden" className="text-sm font-medium">Golden Ticket</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flagged" id="flagged" className="text-red-500 border-red-500"
                    checked={isFlagged}
                    onClick={() => setIsFlagged(!isFlagged)}
                  />
                  <label htmlFor="flagged" className="text-sm font-medium">Is Flagged</label>
                </div> */}



            {/* Form fields in exact layout as per image */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Row 1: Category Type, Sub Category Type, Assigned To, Mode */}
              <FormControl
                fullWidth
                variant="outlined"
                required
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Category Type</InputLabel>
                <MuiSelect
                  value={formData.categoryType}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  label="Category Type"
                  notched
                  displayEmpty
                  disabled={loadingCategories}
                >
                  <MenuItem value="">Select Category Type</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Sub Category Type</InputLabel>
                <MuiSelect
                  value={formData.subCategoryType}
                  onChange={(e) => setFormData({ ...formData, subCategoryType: e.target.value })}
                  label="Sub Category Type"
                  notched
                  displayEmpty
                  disabled={loadingSubcategories || !formData.categoryType}
                >
                  <MenuItem value="" sx={{ fontSize: '14px' }}>
                    {loadingSubcategories ? "Loading..." :
                      !formData.categoryType ? "Select Category First" :
                        "Select Sub Category Type"}
                  </MenuItem>
                  {subcategories.map((subcategory) => (
                    <MenuItem key={subcategory.id} value={subcategory.id.toString()}>
                      {subcategory.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Assigned To</InputLabel>
                <MuiSelect
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  label="Assigned To"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">Select Assigned To</MenuItem>
                  {fmUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id.toString()}>
                      {user.firstname} {user.lastname}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl
                fullWidth
                variant="outlined"
                required
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Mode</InputLabel>
                <MuiSelect
                  value={formData.complaintMode}
                  onChange={(e) => setFormData({ ...formData, complaintMode: e.target.value })}
                  label="Mode*"
                  notched
                  displayEmpty
                  disabled={loadingComplaintModes}
                >
                  <MenuItem value="">
                    {loadingComplaintModes ? "Loading..." : "Select Mode"}
                  </MenuItem>
                  {complaintModes.map((mode) => (
                    <MenuItem key={mode.id} value={mode.id.toString()}>
                      {mode.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>


              {/* Row 2: Proactive/Reactive, Admin Priority, Reference Number */}

              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Proactive/Reactive</InputLabel>
                <MuiSelect
                  value={formData.proactiveReactive}
                  onChange={(e) => setFormData({ ...formData, proactiveReactive: e.target.value })}
                  label="Proactive/Reactive"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">Select Proactive/Reactive</MenuItem>
                  {PROACTIVE_REACTIVE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Admin Priority</InputLabel>
                <MuiSelect
                  value={formData.adminPriority}
                  onChange={(e) => setFormData({ ...formData, adminPriority: e.target.value })}
                  label="Admin Priority"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">Select Admin Priority</MenuItem>
                  {PRIORITY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <TextField
                label="Reference Number"
                placeholder="Enter Reference Number"
                value={formData.referenceNumber}
                onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />
            </div>

            {/* Description - Full width */}
            <TextField
              label="Descriptions"
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              InputProps={{
                sx: {
                  ...fieldStyles,
                  height: 'auto',
                  '& .MuiOutlinedInput-root': {
                    height: 'auto',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Section 3: Add Attachments */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 2C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V5.41421C14 5.149 13.8946 4.89464 13.7071 4.70711L11.2929 2.29289C11.1054 2.10536 10.851 2 10.5858 2H3Z" fill="#C72030" />
                  <path d="M10 2V5C10 5.55228 10.4477 6 11 6H14" fill="#E5E0D3" />
                </svg>
              </span>
              Add Attachments
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                type="button"
                onClick={() => document.getElementById('file-upload')?.click()}
                variant="outline"
                className="border-dashed border-2 border-gray-300 hover:border-gray-400 text-gray-600 bg-white hover:bg-gray-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>

              {/* Display attached files */}
              {attachedFiles.length > 0 && (
                <div className="space-y-2">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded border">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                        <span>{file.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-2"
          >
            {isSubmitting ? 'Creating...' : 'Create Tickets'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};