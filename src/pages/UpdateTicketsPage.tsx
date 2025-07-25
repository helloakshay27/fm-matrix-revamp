import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/utils/apiClient';

interface SelectedTicket {
  id: number;
  ticket_number: string;
  heading: string;
  category_type: string;
  sub_category_type: string;
  site_name: string;
  posted_by: string;
  assigned_to: string | null;
  issue_status: string;
  priority: string;
  created_at: string;
  issue_type: string;
  complaint_mode: string;
  service_or_asset: string | null;
  asset_task_occurrence_id: string | null;
  proactive_reactive: string | null;
  review_tracking_date: string | null;
}

interface ComplaintStatus {
  id: number;
  society_id: number;
  name: string;
  color_code: string;
  fixed_state: string;
  active: number;
  created_at: string;
  updated_at: string;
  position: number;
  of_phase: string;
  of_atype: string;
  email: boolean;
}

interface FMUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  login: string;
}

const UpdateTicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    responsiblePerson: '',
    proactiveReactive: '',
    adminPriority: '',
    softClose: '',
    refNumber: '',
    issueRelatedTo: { project: false, pm: false },
    associatedTo: { asset: false, service: false },
    comments: '',
    cost: '',
    description: '',
    preventiveAction: '',
    reviewTracking: '',
    categoryType: '',
    subCategoryType: '',
    externalPriority: '',
    impact: '',
    correctiveAction: '',
    assignTo: '',
    mode: '',
    serviceType: '',
    costInvolved: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complaintStatuses, setComplaintStatuses] = useState<ComplaintStatus[]>([]);
  const [fmUsers, setFmUsers] = useState<FMUser[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showCostPopup, setShowCostPopup] = useState(false);
  const [costPopupData, setCostPopupData] = useState({
    cost: '',
    description: '',
    attachments: [] as File[]
  });

  useEffect(() => {
    if (location.state?.selectedTickets) {
      setSelectedTickets(location.state.selectedTickets);
      // Pre-populate form with first ticket's data if available
      const firstTicket = location.state.selectedTickets[0];
      if (firstTicket) {
        setFormData(prev => ({
          ...prev,
          title: firstTicket.heading || '',
          categoryType: firstTicket.category_type || '',
          subCategoryType: firstTicket.sub_category_type || '',
          proactiveReactive: firstTicket.proactive_reactive || '',
          assignTo: firstTicket.assigned_to || '',
          mode: firstTicket.complaint_mode || '',
          serviceType: firstTicket.service_or_asset || ''
        }));
      }
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusResponse, usersResponse] = await Promise.all([
          apiClient.get('/pms/admin/complaint_statuses.json'),
          apiClient.get('/pms/account_setups/fm_users.json')
        ]);
        
        setComplaintStatuses(statusResponse.data || []);
        setFmUsers(usersResponse.data.fm_users || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load form data.",
          variant: "destructive"
        });
      }
    };

    fetchData();
  }, [toast]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (group: string, field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [group]: {
        ...prev[group as keyof typeof prev] as any,
        [field]: checked
      }
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments(prev => [...prev, ...Array.from(event.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleCostInvolvedChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, costInvolved: checked }));
    if (checked) {
      setShowCostPopup(true);
    } else {
      setCostPopupData({ cost: '', description: '', attachments: [] });
    }
  };

  const handleCostPopupFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setCostPopupData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(event.target.files!)]
      }));
    }
  };

  const removeCostPopupAttachment = (index: number) => {
    setCostPopupData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleCostPopupSubmit = () => {
    // Update main form data with popup data
    setFormData(prev => ({
      ...prev,
      cost: costPopupData.cost,
      description: costPopupData.description
    }));
    setAttachments(prev => [...prev, ...costPopupData.attachments]);
    setShowCostPopup(false);
  };

  const handleCostPopupClose = () => {
    setShowCostPopup(false);
    setFormData(prev => ({ ...prev, costInvolved: false }));
    setCostPopupData({ cost: '', description: '', attachments: [] });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Here you would implement the actual update API call
      // For now, just showing success message
      toast({
        title: "Success",
        description: `Successfully updated ${selectedTickets.length} ticket(s).`,
      });
      
      navigate(-1);
    } catch (error) {
      console.error('Error updating tickets:', error);
      toast({
        title: "Error",
        description: "Failed to update tickets. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">COMPLAINT EDIT</h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Title */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
              />
            </div>

            {/* Responsible Person */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Responsible Person</label>
              <select
                value={formData.responsiblePerson}
                onChange={(e) => handleInputChange('responsiblePerson', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white"
              >
                <option value="">Select Responsible Person Name</option>
                {fmUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstname} {user.lastname}
                  </option>
                ))}
              </select>
            </div>

            {/* Proactive/Reactive */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proactive/Reactive</label>
              <select
                value={formData.proactiveReactive}
                onChange={(e) => handleInputChange('proactiveReactive', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white"
              >
                <option value="">Select Proactive/Reactive</option>
                <option value="Proactive">Proactive</option>
                <option value="Reactive">Reactive</option>
              </select>
            </div>

            {/* Admin Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Priority</label>
              <select
                value={formData.adminPriority}
                onChange={(e) => handleInputChange('adminPriority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white"
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Soft Close */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Soft Close</label>
              <select
                value={formData.softClose}
                onChange={(e) => handleInputChange('softClose', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white"
              >
                <option value="">CF1</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Reference Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
              <input
                type="text"
                value={formData.refNumber}
                onChange={(e) => handleInputChange('refNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
              />
            </div>

            {/* Issue Related To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Issue Related To</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.issueRelatedTo.project}
                    onChange={(e) => handleCheckboxChange('issueRelatedTo', 'project', e.target.checked)}
                    className="mr-2"
                  />
                  Project
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.issueRelatedTo.pm}
                    onChange={(e) => handleCheckboxChange('issueRelatedTo', 'pm', e.target.checked)}
                    className="mr-2"
                  />
                  PM
                </label>
              </div>
            </div>

            {/* Associated To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Associated To</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.associatedTo.asset}
                    onChange={(e) => handleCheckboxChange('associatedTo', 'asset', e.target.checked)}
                    className="mr-2"
                  />
                  Asset
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.associatedTo.service}
                    onChange={(e) => handleCheckboxChange('associatedTo', 'service', e.target.checked)}
                    className="mr-2"
                  />
                  Service
                </label>
              </div>
            </div>

            {/* Category Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category Type</label>
              <select
                value={formData.categoryType}
                onChange={(e) => handleInputChange('categoryType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white"
              >
                <option value="">Air Conditioner</option>
                <option value="Air Conditioner">Air Conditioner</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
              </select>
            </div>

            {/* Comments */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
              <textarea
                value={formData.comments}
                onChange={(e) => handleInputChange('comments', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                placeholder="Add comment"
              />
              <div className="mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.costInvolved}
                    onChange={(e) => handleCostInvolvedChange(e.target.checked)}
                    className="mr-2"
                  />
                  Cost Involved
                </label>
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              <span className="text-[#C72030]">⚠</span> ATTACHMENTS
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-gray-600 hover:text-gray-800"
                >
                  Choose Files
                </label>
                <p className="text-sm text-gray-500 mt-2">No file chosen</p>
              </div>
            </div>
            
            {/* Display uploaded files */}
            {attachments.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Attachments</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <Button className="bg-[#C72030] text-white hover:bg-[#C72030]/90 mb-4">
                    Add
                  </Button>
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <Button
                        onClick={() => removeAttachment(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cost and Description Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
              <input
                type="text"
                value={formData.cost}
                onChange={(e) => handleInputChange('cost', e.target.value)}
                placeholder="Add Cost"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter Description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleSubmit}
              className="bg-[#C72030] text-white hover:bg-[#C72030]/90 px-8 py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'SAVING...' : 'SAVE'}
            </Button>
          </div>
        </div>

        {/* Cost Popup Modal */}
        {showCostPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 max-w-md mx-4">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Popup Name</h3>
                <button
                  onClick={handleCostPopupClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Cost Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={costPopupData.cost}
                    onChange={(e) => setCostPopupData(prev => ({ ...prev, cost: e.target.value }))}
                    placeholder="Enter Cost"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={costPopupData.description}
                    onChange={(e) => setCostPopupData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter Description"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                  />
                </div>

                {/* Attachment Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attachment<span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      id="cost-popup-file-upload"
                      multiple
                      onChange={handleCostPopupFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="cost-popup-file-upload"
                      className="cursor-pointer flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Files
                    </label>
                  </div>
                  
                  {/* Display uploaded files in popup */}
                  {costPopupData.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {costPopupData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <span className="text-gray-700">{file.name}</span>
                          <Button
                            onClick={() => removeCostPopupAttachment(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t">
                <div className="flex justify-center">
                  <Button
                    onClick={handleCostPopupSubmit}
                    className="bg-[#C72030] text-white hover:bg-[#C72030]/90 px-8 py-2"
                    disabled={!costPopupData.cost || !costPopupData.description}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateTicketsPage;