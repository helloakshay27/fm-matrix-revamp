import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TextField } from '@mui/material';
import { X, Plus } from 'lucide-react';
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
  const [comments, setComments] = useState<string[]>(['']);
  const [status, setStatus] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (commentData && isOpen) {
      // Split the comment string by pipe separator or use single comment
      const commentArray = commentData.comment.includes('|') 
        ? commentData.comment.split('|') 
        : [commentData.comment];
      setComments(commentArray);
      setStatus(commentData.status);
    } else {
      setComments(['']);
      setStatus(true);
    }
  }, [commentData, isOpen]);

  const handleSubmit = () => {
    const validComments = comments.filter(c => c.trim());
    
    if (validComments.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one comment",
        variant: "destructive"
      });
      return;
    }

    if (commentData) {
      const updatedData = {
        ...commentData,
        comment: validComments.join('|'),
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
    setComments(['']);
    setStatus(true);
    onClose();
  };

  const addComment = () => {
    setComments([...comments, '']);
  };

  const removeComment = (index: number) => {
    if (comments.length > 1) {
      const newComments = comments.filter((_, i) => i !== index);
      setComments(newComments);
    }
  };

  const updateComment = (index: number, value: string) => {
    const newComments = [...comments];
    newComments[index] = value;
    setComments(newComments);
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
          {/* Multiple Comment Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Comment</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addComment}
                className="text-primary border-primary hover:bg-primary/10"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="space-y-3">
              {comments.map((comment, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <TextField
                      placeholder="Enter visitor comment"
                      value={comment}
                      onChange={(e) => updateComment(index, e.target.value)}
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={2}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#d1d5db',
                          },
                          '&:hover fieldset': {
                            borderColor: '#C72030',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#C72030',
                          },
                        },
                      }}
                    />
                  </div>
                  {comments.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeComment(index)}
                      className="text-destructive border-destructive hover:bg-destructive/10 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
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
            disabled={comments.every(c => !c.trim())}
          >
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};