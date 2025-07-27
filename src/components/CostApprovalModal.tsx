import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getToken } from '@/utils/auth';
import { getFullUrl, getAuthHeader, ENDPOINTS } from '@/config/apiConfig';

interface CostApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTickets: number[];
}

export const CostApprovalModal: React.FC<CostApprovalModalProps> = ({
  isOpen,
  onClose,
  selectedTickets
}) => {
  const [cost, setCost] = useState('');
  const [description, setDescription] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!cost || !description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (selectedTickets.length === 0) {
      toast({
        title: "Validation Error", 
        description: "No tickets selected for cost approval.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('💰 Creating cost approval for tickets:', selectedTickets);
      console.log('💰 Cost data:', { cost, description, attachments: attachedFiles.length });

      // Prepare FormData for API submission
      const formData = new FormData();
      
      // Add complaint_ids[] for each selected ticket
      selectedTickets.forEach(ticketId => {
        formData.append('complaint_ids[]', ticketId.toString());
      });
      
      // Add cost and comment
      formData.append('cost', cost);
      formData.append('comment', description);
      
      // Add attachments[] if any
      attachedFiles.forEach(file => {
        formData.append('attachments[]', file);
      });

      // Log FormData contents for debugging
      console.log('📤 Cost Approval API FormData:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Make API call using the configured endpoint
      const response = await fetch(getFullUrl(ENDPOINTS.COST_APPROVALS_CREATE), {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
        },
        body: formData
      });

      console.log('📊 API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Cost Approval API error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Cost Approval API response:', result);

      // Show success message
      toast({
        title: "Success",
        description: `Cost approval created successfully for ${selectedTickets.length} ticket(s).`
      });
      
      // Reset form 
      setCost('');
      setDescription('');
      setAttachedFiles([]);
      
      // Close modal first
      onClose();
      
      // Navigate after a small delay to ensure modal is closed
      setTimeout(() => {
        navigate('/maintenance/ticket');
      }, 100);
      
    } catch (error) {
      console.error('❌ Error creating cost approval:', error);
      toast({
        title: "Error",
        description: `Failed to create cost approval: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-medium">Cost Approval</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Cost Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost*
            </label>
            <Input
              placeholder="Enter Cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description*
            </label>
            <Textarea
              placeholder="Enter Cost"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px] resize-none"
            />
          </div>

          {/* Attachment Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachment*
            </label>
            <div className="space-y-2">
              <input 
                type="file" 
                multiple 
                onChange={handleFileUpload}
                className="hidden"
                id="cost-file-upload"
              />
              <Button
                type="button"
                onClick={() => document.getElementById('cost-file-upload')?.click()}
                variant="outline"
                className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400 text-gray-600 bg-white hover:bg-gray-50 h-12"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
              
              {/* Display attached files */}
              {attachedFiles.length > 0 && (
                <div className="space-y-1">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded border">
                      <span className="truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-2"
              disabled={!cost || !description || isSubmitting}
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};