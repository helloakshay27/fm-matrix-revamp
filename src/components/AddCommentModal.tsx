import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send } from 'lucide-react';
import { toast } from 'sonner';

interface AddCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
}

export function AddCommentModal({ isOpen, onClose, ticketId }: AddCommentModalProps) {
  const [comment, setComment] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = () => {
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    // Simulate API call
    toast.success('Comment added successfully');
    setComment('');
    setAttachments([]);
    onClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border border-[hsl(var(--analytics-border))] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[hsl(var(--analytics-text))] font-medium">
            Add Comment - Ticket #{ticketId}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Textarea
            placeholder="Enter your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px] border-[hsl(var(--analytics-border))] bg-white text-[hsl(var(--analytics-text))]"
          />
          
          <div className="flex items-center gap-2">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="attachment-upload"
            />
            <label
              htmlFor="attachment-upload"
              className="flex items-center gap-2 px-3 py-2 border border-[hsl(var(--analytics-border))] rounded-md cursor-pointer hover:bg-[hsl(var(--analytics-background))] text-sm text-[hsl(var(--analytics-text))]"
            >
              <Paperclip className="h-4 w-4" />
              Attach Files
            </label>
            {attachments.length > 0 && (
              <span className="text-sm text-[hsl(var(--analytics-text))]">
                {attachments.length} file(s) selected
              </span>
            )}
          </div>

          {attachments.length > 0 && (
            <div className="space-y-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-[hsl(var(--analytics-background))] rounded">
                  <span className="text-sm text-[hsl(var(--analytics-text))]">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[hsl(var(--analytics-border))] text-[hsl(var(--analytics-text))] hover:bg-[hsl(var(--analytics-background))]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[hsl(var(--analytics-accent))] hover:bg-[hsl(var(--analytics-accent))]/90 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}