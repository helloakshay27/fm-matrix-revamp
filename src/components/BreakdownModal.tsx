import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import axios from "axios";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import { toast } from "sonner";

interface BreakdownModalProps {
  isOpen: boolean;
  assetId: string | number;
  onClose: () => void;
  onSuccess?: () => void;
}

interface BreakdownData {
  reason: string;
  date: string;
  breakdown_type: string;
  severity: string;
  expected_repair_duration: string;
  attachments: File[];
}

const BREAKDOWN_TYPES = [
  "Electrical",
  "Mechanical",
  "HVAC",
  "Plumbing",
  "Utility",
  "Control/System",
  "Physical Damage",
  "Wear & Tear",
  "Vendor Related",
  "Other",
];

const SEVERITY_OPTIONS = ["Critical", "High", "Medium", "Low"];

export const BreakdownModal: React.FC<BreakdownModalProps> = ({
  isOpen,
  assetId,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<BreakdownData>({
    reason: "",
    date: new Date().toISOString().slice(0, 16),
    breakdown_type: "",
    severity: "",
    expected_repair_duration: "",
    attachments: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.breakdown_type) {
      newErrors.breakdown_type = "Breakdown type is required";
    }
    if (!formData.severity) {
      newErrors.severity = "Severity is required";
    }
    if (!formData.expected_repair_duration.trim()) {
      newErrors.expected_repair_duration =
        "Expected repair duration is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Validation Error", {
        description: "Please fill in all required fields",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format the date to ISO 8601 with timezone
      const dateObj = new Date(formData.date);
      const isoDate = dateObj.toISOString();

      // Create FormData to send everything in one request
      const formDataRequest = new FormData();
      
      // Add breakdown data as JSON string
      formDataRequest.append("pms_asset[status]", "breakdown");
      formDataRequest.append("pms_asset[breakdown]", "true");
      formDataRequest.append("pms_asset[reason]", formData.reason);
      formDataRequest.append("pms_asset[date]", isoDate);
      formDataRequest.append("pms_asset[breakdown_type]", formData.breakdown_type);
      formDataRequest.append("pms_asset[severity]", formData.severity);
      formDataRequest.append("pms_asset[expected_repair_duration]", formData.expected_repair_duration);

      // Add attachments to the same request
      formData.attachments.forEach((file, index) => {
        formDataRequest.append(`attachments[${index}]`, file);
      });

      console.log("Sending combined payload with attachments");
      
      const response = await axios.put(
        `${API_CONFIG.BASE_URL}/pms/assets/${assetId}.json`,
        formDataRequest,
        {
          headers: {
            Authorization: getAuthHeader(),
            // Don't set Content-Type, let axios set it for FormData
          },
        }
      );

      console.log("API Response:", response.status, response.data);

      // Accept 200/201 as success
      if (response.status === 200 || response.status === 201) {
        console.log("Breakdown recorded with attachments successfully");
        
        toast.success("Breakdown Recorded", {
          description: "Asset breakdown has been recorded successfully with all attachments",
        });
      } else {
        throw new Error(`API returned status ${response.status}`);
      }

      // Reset form
      setFormData({
        reason: "",
        date: new Date().toISOString().slice(0, 16),
        breakdown_type: "",
        severity: "",
        expected_repair_duration: "",
        attachments: [],
      });

      // Call success callback and close modal
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Error submitting breakdown:", error);
      const errorMessage = error instanceof axios.AxiosError 
        ? error.response?.data?.message || error.message
        : error instanceof Error
        ? error.message
        : "Failed to record breakdown. Please try again.";
      
      toast.error("Submission Failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1a1a1a]">
            Record Asset Breakdown
          </DialogTitle>
          <DialogDescription>
            Please provide details about the asset breakdown
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reason */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Failure Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Describe the reason for breakdown"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] ${
                errors.reason ? "border-red-500" : "border-gray-300"
              }`}
              rows={3}
            />
            {errors.reason && (
              <p className="text-sm text-red-500">{errors.reason}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
               Breakdown Date <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] ${
                errors.date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Breakdown Type and Severity - Two Columns */}
          <div className="grid grid-cols-2 gap-4">
            {/* Breakdown Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Breakdown Type <span className="text-red-500">*</span>
              </label>
              <select
                name="breakdown_type"
                value={formData.breakdown_type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] ${
                  errors.breakdown_type
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select breakdown type</option>
                {BREAKDOWN_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.breakdown_type && (
                <p className="text-sm text-red-500">{errors.breakdown_type}</p>
              )}
            </div>

            {/* Severity */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Severity Level<span className="text-red-500">*</span>
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] ${
                  errors.severity ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select severity</option>
                {SEVERITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.severity && (
                <p className="text-sm text-red-500">{errors.severity}</p>
              )}
            </div>
          </div>

          {/* Expected Repair Duration */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Target Restoration Date{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="expected_repair_duration"
              value={formData.expected_repair_duration}
              onChange={handleInputChange}
              placeholder="e.g., 2"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] ${
                errors.expected_repair_duration
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.expected_repair_duration && (
              <p className="text-sm text-red-500">
                {errors.expected_repair_duration}
              </p>
            )}
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
              <input
                type="file"
                id="file-input"
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.xls,.xlsx"
              />
              <label
                htmlFor="file-input"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload files or drag and drop
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Supported: PDF, DOC, DOCX, JPG, PNG, GIF, XLS, XLSX
                </span>
              </label>
            </div>

            {/* Attachment List */}
            {formData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  Attached Files ({formData.attachments.length})
                </p>
                {formData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200"
                  >
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Record Breakdown"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
