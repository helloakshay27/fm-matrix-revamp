
import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { Upload } from 'lucide-react';

export const AttachmentsSection: React.FC = () => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log('Files selected:', Array.from(files));
      // Handle file upload logic here
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Attachments
      </label>
      <Box
        sx={{
          border: '2px dashed #dc2626',
          borderRadius: '6px',
          backgroundColor: '#f9fafb',
          minHeight: '96px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#f3f4f6',
          },
        }}
        onClick={() => document.getElementById('file-upload-attachments')?.click()}
      >
        <Upload className="w-8 h-8 text-gray-400 mb-2" />
        <Typography variant="body2" sx={{ color: '#374151', textAlign: 'center' }}>
          Click to upload files or drag and drop
        </Typography>
        <Typography variant="caption" sx={{ color: '#9ca3af', textAlign: 'center' }}>
          PNG, JPG, PDF up to 10MB
        </Typography>
        <input
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.pdf"
          id="file-upload-attachments"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <Button
          variant="outlined"
          size="small"
          sx={{
            mt: 1,
            borderColor: '#dc2626',
            color: '#dc2626',
            '&:hover': {
              borderColor: '#b91c1c',
              backgroundColor: 'rgba(220, 38, 38, 0.04)',
            },
          }}
        >
          Choose Files
        </Button>
      </Box>
    </div>
  );
};
