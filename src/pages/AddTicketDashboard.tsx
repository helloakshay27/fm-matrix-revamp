
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, Paperclip, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ticketManagementAPI, CategoryResponse, SubCategoryResponse, UserAccountResponse, OccupantUserResponse } from '@/services/ticketManagementAPI';

const PRIORITY_OPTIONS = [
  { value: 'P1', label: 'P1 - Critical' },
  { value: 'P2', label: 'P2 - Very High' },
  { value: 'P3', label: 'P3 - High' },
  { value: 'P4', label: 'P4 - Medium' },
  { value: 'P5', label: 'P5 - Low' }
];

const PROACTIVE_REACTIVE_OPTIONS = [
  { value: 'proactive', label: 'Proactive' },
  { value: 'reactive', label: 'Reactive' }
];

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
  
  // Loading states
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(false);

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
    mode: ''
  });

  // Load initial data
  useEffect(() => {
    loadCategories();
    loadFMUsers();
    loadOccupantUsers();
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
      const siteId = localStorage.getItem('siteId') || '2189';
      
      const ticketData = {
        of_phase: 'pms',
        site_id: parseInt(siteId),
        on_behalf_of: onBehalfOf === 'self' ? 'admin' : onBehalfOf,
        complaint_type: ticketType,
        category_type_id: parseInt(formData.categoryType),
        priority: formData.adminPriority,
        society_staff_type: 'User',
        proactive_reactive: formData.proactiveReactive,
        heading: formData.description,
        complaint_mode_id: 75,
        room_id: 1,
        wing_id: 1,
        area_id: 1,
        floor_id: 1,
        // Add sel_id_user for behalf of others
        ...(onBehalfOf !== 'self' && selectedUserId && { sel_id_user: selectedUserId }),
        // Optional fields
        ...(selectedUser && { id_user: parseInt(selectedUser) }),
        ...(formData.assignedTo && { assigned_to: parseInt(formData.assignedTo) }),
        ...(formData.referenceNumber && { reference_number: formData.referenceNumber }),
        ...(formData.subCategoryType && { sub_category_id: parseInt(formData.subCategoryType) })
      };

      console.log('Ticket payload:', ticketData);

      await ticketManagementAPI.createTicket(ticketData, attachedFiles);
      
      toast({
        title: "Success",
        description: "Ticket created successfully!"
      });
      
      navigate('/maintenance/ticket');
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
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/maintenance/ticket')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ticket List
          </Button>
          <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">
            NEW TICKET
          </h1>
        </div>

        {/* Ticket Details Section */}
        <div className="p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-semibold text-orange-800">TICKET DETAILS</h2>
          </div>

          {/* On Behalf Of */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Create Ticket On Behalf Of</label>
            <RadioGroup value={onBehalfOf} onValueChange={setOnBehalfOf} className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="self" id="self" />
                <label htmlFor="self">Self</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="occupant-user" id="occupant-user" />
                <label htmlFor="occupant-user">Occupant User</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fm-user" id="fm-user" />
                <label htmlFor="fm-user">FM User</label>
              </div>
            </RadioGroup>
          </div>

          {/* User Selection Dropdown */}
          {onBehalfOf !== 'self' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select User *</label>
              <Select value={selectedUser} onValueChange={handleUserSelection} disabled={loadingUsers}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingUsers ? "Loading users..." : "Select User"} />
                </SelectTrigger>
                <SelectContent>
                  {getUsersForDropdown().map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Requestor Details */}
          <h3 className="font-medium mb-3">
            Requestor Details
            {isFieldsReadOnly && (
              <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Auto-populated
              </span>
            )}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Input
                placeholder="Enter Name"
                value={formData.name}
                onChange={(e) => !isFieldsReadOnly && setFormData({ ...formData, name: e.target.value })}
                disabled={isFieldsReadOnly || (onBehalfOf === 'self' && loadingAccount)}
                className={isFieldsReadOnly ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <Input
                placeholder="Enter Contact Number"
                value={formData.contactNumber}
                onChange={(e) => !isFieldsReadOnly && setFormData({ ...formData, contactNumber: e.target.value })}
                disabled={isFieldsReadOnly}
                className={isFieldsReadOnly ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
              <Input
                placeholder="Enter Site"
                value={formData.site}
                onChange={(e) => !isFieldsReadOnly && setFormData({ ...formData, site: e.target.value })}
                disabled={isFieldsReadOnly}
                className={isFieldsReadOnly ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <Input
                placeholder="Enter Department"
                value={formData.department}
                onChange={(e) => !isFieldsReadOnly && setFormData({ ...formData, department: e.target.value })}
                disabled={isFieldsReadOnly}
                className={isFieldsReadOnly ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <Input
                placeholder="Enter Unit"
                value={formData.unit}
                onChange={(e) => !isFieldsReadOnly && setFormData({ ...formData, unit: e.target.value })}
                disabled={isFieldsReadOnly}
                className={isFieldsReadOnly ? "bg-gray-50" : ""}
              />
            </div>
          </div>

          {/* Ticket Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Type *</label>
            <RadioGroup value={ticketType} onValueChange={setTicketType} className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="request" id="request" />
                <label htmlFor="request">Request</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="suggestion" id="suggestion" />
                <label htmlFor="suggestion">Suggestion</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="complaint" id="complaint" />
                <label htmlFor="complaint">Complaint</label>
              </div>
            </RadioGroup>
          </div>

          {/* Category and Other Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Type *</label>
              <Select value={formData.categoryType} onValueChange={handleCategoryChange} disabled={loadingCategories}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingCategories ? "Loading..." : "Select Category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category Type</label>
              <Select 
                value={formData.subCategoryType} 
                onValueChange={(value) => setFormData({ ...formData, subCategoryType: value })}
                disabled={!formData.categoryType || loadingSubcategories}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingSubcategories ? "Loading..." : "Select SubCategory"} />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((subcat) => (
                    <SelectItem key={subcat.id} value={subcat.id.toString()}>
                      {subcat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <Select value={formData.adminPriority} onValueChange={(value) => setFormData({ ...formData, adminPriority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
              <Select value={formData.assignedTo} onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Assignee" />
                </SelectTrigger>
                <SelectContent>
                  {fmUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.firstname} {user.lastname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proactive/Reactive</label>
              <Select value={formData.proactiveReactive} onValueChange={(value) => setFormData({ ...formData, proactiveReactive: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {PROACTIVE_REACTIVE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
              <Input
                placeholder="Enter Reference Number"
                value={formData.referenceNumber}
                onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              className="min-h-[120px]"
            />
          </div>
        </div>

        {/* Attachment Section */}
        <div className="p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full flex items-center justify-center">
              <Paperclip className="w-4 h-4 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-semibold text-orange-800">ATTACHMENTS</h2>
          </div>

          <div className="border-2 border-dashed border-[#C72030] rounded-lg p-8 text-center">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Drag & Drop or{' '}
                <span className="text-[#C72030] underline">Choose Files</span>
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, PDF up to 10MB
              </p>
            </label>
          </div>

          {/* Selected Files */}
          {attachedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">Selected Files:</h4>
              <div className="space-y-2">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90 px-8 py-2"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/maintenance/ticket')}
            className="px-8 py-2"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
