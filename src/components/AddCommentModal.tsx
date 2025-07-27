import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';
import { getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { toast } from 'sonner';

interface AddCommentModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
  itemId?: string;
  title?: string;
  itemType?: 'asset' | 'ticket' | 'schedule' | 'inventory';
}

export const AddCommentModal: React.FC<AddCommentModalProps> = ({
  open,
  onOpenChange,
  isOpen,
  onClose,
  itemId,
  title,
  itemType = 'inventory'
}) => {
  const modalOpen = open !== undefined ? open : isOpen || false;
  const handleOpenChange = onOpenChange || ((open: boolean) => !open && onClose?.());
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim() || !itemId) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const url = getFullUrl('/complaint_logs.json');
      const requestBody = {
        complaint_log: {
          complaint_id: itemId,
          comment: comment.trim()
        }
      };

      const response = await fetch(url, getAuthenticatedFetchOptions('POST', requestBody));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      toast.success('Comment added successfully');
      setComment('');
      handleOpenChange(false);
      
      // Refresh the page to show the updated comment
      window.location.reload();
      
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setComment('');
    handleOpenChange(false);
  };

  return (
    <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {title || `Add Comment to ${itemType === 'asset' ? 'Asset' : itemType === 'ticket' ? 'Ticket' : itemType === 'schedule' ? 'Schedule' : 'Inventory'}`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Comment
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Enter your comment for this ${itemType}...`}
              rows={4}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!comment.trim() || isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? 'Adding...' : 'Add Comment'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};