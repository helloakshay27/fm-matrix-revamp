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
    costInvolved: false,
    selectedStatus: '',
    rootCause: '',
    correction: '',
    selectedAsset: ''
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

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Row 1 */}
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <textarea
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Feedback: Tap Faulty, Wc Choked, Hand Dryer Faulty, Tissue Paper Missing"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
              />
            </div>

            {/* Preventive Action */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preventive Action</label>
              <input
                type="text"
                value={formData.preventiveAction}
                onChange={(e) => handleInputChange('preventiveAction', e.target.value)}
                placeholder="nn"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.selectedStatus}
                onChange={(e) => handleInputChange('selectedStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
              >
                <option value="">Closed</option>
                {complaintStatuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 2 */}
            {/* Responsible Person */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Responsible Person</label>
              <select
                value={formData.responsiblePerson}
                onChange={(e) => handleInputChange('responsiblePerson', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
              >
                <option value="">Select Responsible Person Name</option>
                {fmUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstname} {user.lastname}
                  </option>
                ))}
              </select>
            </div>

            {/* Review (Tracking) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Review (Tracking)</label>
              <div className="flex">
                <Button 
                  variant="outline" 
                  className="text-sm border-gray-300 text-blue-600 hover:bg-blue-50"
                >
                  Review Date
                </Button>
              </div>
            </div>

            {/* Category Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category Type</label>
              <select
                value={formData.categoryType}
                onChange={(e) => handleInputChange('categoryType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
              >
                <option value="">Air Conditioner</option>
                <option value="Air Conditioner">Air Conditioner</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
              </select>
            </div>

            {/* Row 3 */}
            {/* Proactive/Reactive */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proactive/Reactive</label>
              <select
                value={formData.proactiveReactive}
                onChange={(e) => handleInputChange('proactiveReactive', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
              >
                <option value="">Select Proactive/Reactive</option>
                <option value="Proactive">Proactive</option>
                <option value="Reactive">Reactive</option>
              </select>
            </div>

            {/* Sub Category Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category Type</label>
              <select
                value={formData.subCategoryType}
                onChange={(e) => handleInputChange('subCategoryType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
              >
                <option value="">Select Sub Category</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Repair">Repair</option>
              </select>
            </div>

            {/* Assign To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
              <select
                value={formData.assignTo}
                onChange={(e) => handleInputChange('assignTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
              >
                <option value="">Vinayak Mane</option>
                {fmUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstname} {user.lastname}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 4 */}
            {/* Admin Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Priority</label>
              <select
                value={formData.adminPriority}
                onChange={(e) => handleInputChange('adminPriority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* External Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">External Priority</label>
              <select
                value={formData.externalPriority}
                onChange={(e) => handleInputChange('externalPriority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
              >
                <option value="">Select External Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
              <select
                value={formData.mode}
                onChange={(e) => handleInputChange('mode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
              >
                <option value="">Select Complaint Mode</option>
                <option value="Phone">Phone</option>
                <option value="Email">Email</option>
                <option value="App">App</option>
              </select>
            </div>

            {/* Row 5 */}
            {/* Root Cause */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Root Cause</label>
              <input
                type="text"
                value={formData.rootCause}
                onChange={(e) => handleInputChange('rootCause', e.target.value)}
                placeholder="ghj"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
              />
            </div>

            {/* Impact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Impact</label>
              <input
                type="text"
                value={formData.impact}
                onChange={(e) => handleInputChange('impact', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
              />
            </div>

            {/* Correction */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Correction</label>
              <input
                type="text"
                value={formData.correction}
                onChange={(e) => handleInputChange('correction', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
              />
            </div>

            {/* Row 6 */}
            {/* Reference Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
              <input
                type="text"
                value={formData.refNumber}
                onChange={(e) => handleInputChange('refNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
              />
            </div>

            {/* Corrective Action */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Corrective Action</label>
              <input
                type="text"
                value={formData.correctiveAction}
                onChange={(e) => handleInputChange('correctiveAction', e.target.value)}
                placeholder="hko"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
              />
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <select
                value={formData.serviceType}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
              >
                <option value="">Select Service Type</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Repair">Repair</option>
                <option value="Installation">Installation</option>
              </select>
            </div>
          </div>

          {/* Issue Related To */}
          <div className="mt-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 min-w-[120px]">Issue Related To</span>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="issueRelatedTo"
                    value="project"
                    checked={formData.issueRelatedTo.project}
                    onChange={(e) => handleCheckboxChange('issueRelatedTo', 'project', e.target.checked)}
                    className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                  />
                  <span className="text-sm text-gray-700">Project</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="issueRelatedTo"
                    value="fm"
                    checked={formData.issueRelatedTo.pm}
                    onChange={(e) => handleCheckboxChange('issueRelatedTo', 'pm', e.target.checked)}
                    className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                  />
                  <span className="text-sm text-gray-700">FM</span>
                </label>
              </div>
            </div>
          </div>

          {/* Associated To */}
          <div className="mt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 min-w-[120px]">Associated To</span>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="associatedTo"
                    value="asset"
                    checked={formData.associatedTo.asset}
                    onChange={(e) => handleCheckboxChange('associatedTo', 'asset', e.target.checked)}
                    className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                  />
                  <span className="text-sm text-gray-700">Asset</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="associatedTo"
                    value="service"
                    checked={formData.associatedTo.service}
                    onChange={(e) => handleCheckboxChange('associatedTo', 'service', e.target.checked)}
                    className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                  />
                  <span className="text-sm text-gray-700">Service</span>
                </label>
              </div>
            </div>
          </div>

          {/* Select Asset */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Asset</label>
            <select
              value={formData.selectedAsset}
              onChange={(e) => handleInputChange('selectedAsset', e.target.value)}
              className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] bg-white text-sm"
            >
              <option value="">Select Asset</option>
              <option value="asset1">Asset 1</option>
              <option value="asset2">Asset 2</option>
            </select>
          </div>

          {/* Comments */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
            <textarea
              value={formData.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
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
                <h3 className="text-lg font-medium text-gray-900">Cost involved</h3>
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