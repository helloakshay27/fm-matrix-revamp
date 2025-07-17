import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';

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

  const handleSubmit = () => {
    if (comment.trim()) {
      console.log(`Adding comment to ${itemType} ${itemId}:`, comment);
      // Here you would typically call an API to save the comment
      setComment('');
      handleOpenChange(false);
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
              disabled={!comment.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Add Comment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};