import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';

interface AddPermitCommentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddComment: (comment: string) => Promise<void>;
    title: string;
    isSubmitting?: boolean;
}

export const AddPermitCommentModal: React.FC<AddPermitCommentModalProps> = ({
    open,
    onOpenChange,
    onAddComment,
    title,
    isSubmitting = false
}) => {
    const [comment, setComment] = useState('');

    const handleSubmit = async () => {
        if (!comment.trim()) {
            return;
        }

        try {
            await onAddComment(comment.trim());
            setComment('');
        } catch (error) {
            // Error handling is done in the parent component
        }
    };

    const handleCancel = () => {
        setComment('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        {title}
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
                            placeholder="Enter your comment for this permit..."
                            rows={4}
                            className="w-full"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!comment.trim() || isSubmitting}
                            className="bg-[#C72030] hover:bg-[#B01D2A] text-white"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Comment'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
