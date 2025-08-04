
import React from 'react';
import { TextField } from '@mui/material';
import { AttachmentsSection } from './AttachmentsSection';

interface CommentsAttachmentsSectionProps {
  comments: string;
  onCommentsChange: (comments: string) => void;
  attachments: File[];
  onAttachmentsChange: (attachments: File[]) => void;
}

export const CommentsAttachmentsSection: React.FC<CommentsAttachmentsSectionProps> = ({
  comments,
  onCommentsChange,
  attachments,
  onAttachmentsChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-6 items-start">
      {/* Comments - 50% width */}
      <div className="space-y-2">
        <TextField
          label="Comments"
          multiline
          rows={4}
          placeholder="Type a comment.."
          value={comments}
          onChange={(e) => onCommentsChange(e.target.value)}
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              height: 'auto',
              minHeight: '96px',
            },
          }}
        />
      </div>

      {/* Attachments - 50% width */}
      <div className="space-y-2">
        <AttachmentsSection attachments={attachments} onAttachmentsChange={onAttachmentsChange} />
      </div>
    </div>
  );
};
