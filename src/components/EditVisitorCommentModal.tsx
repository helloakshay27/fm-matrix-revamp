import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VisitorCommentData {
  id: string;
  comment: string;
  status: boolean;
  createdOn: string;
  createdBy: string;
}

interface EditVisitorCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  commentData?: VisitorCommentData;
  onUpdate: (data: VisitorCommentData) => void;
}

export const EditVisitorCommentModal = ({ isOpen, onClose, commentData, onUpdate }: EditVisitorCommentModalProps) => {
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (commentData && isOpen) {
      setComment(commentData.comment);
      setStatus(commentData.status);
    }
  }, [commentData, isOpen]);

  const handleSubmit = () => {
    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive"
      });
      return;
    }

    if (commentData) {
      const updatedData = {
        ...commentData,
        comment: comment.trim(),
        status
      };
      onUpdate(updatedData);
      toast({
        title: "Success",
        description: "Visitor comment updated successfully",
      });
      onClose();
    }
  };

  const handleClose = () => {
    setComment('');
    setStatus(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium text-gray-900">Edit Visitor Comment</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="px-6 py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-medium text-gray-700">
              Comment
            </Label>
            <Textarea
              id="comment"
              placeholder="Enter visitor comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full min-h-[100px]"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={status}
              onCheckedChange={setStatus}
            />
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
              Active
            </Label>
          </div>
        </div>

        <div className="flex justify-center px-6 py-4 border-t border-gray-200">
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-8"
            disabled={!comment.trim()}
          >
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};