
import React from 'react';
import { TextField } from '@mui/material';
import { AttachmentsSection } from './AttachmentsSection';

interface CommentsAttachmentsSectionProps {
  comments: string;
  onCommentsChange: (comments: string) => void;
}

export const CommentsAttachmentsSection: React.FC<CommentsAttachmentsSectionProps> = ({
  comments,
  onCommentsChange
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Comments - 50% width */}
      <div className="flex-1 space-y-2">
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
      <div className="flex-1 space-y-2">
        <AttachmentsSection />
      </div>
    </div>
  );
};
