
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Box, Dialog, DialogContent, IconButton, TextField, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

interface AddCompanyPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

export const AddCompanyPartnerModal = ({ isOpen, onClose }: AddCompanyPartnerModalProps) => {
  const [attachmentPreviews, setAttachmentPreviews] = useState<{ file: File, preview: string }[]>([]);
  const [formData, setFormData] = useState({
    companyName: '',
    banner: null as File | null
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      const newPreviews = files.map(file => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
      }));
      setAttachmentPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    onClose();
  };

  const handleRemoveAttachment = (fileToRemove: File) => {
    setAttachmentPreviews(prev => prev.filter(({ file }) => file !== fileToRemove));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <div>
          <h1 className='text-xl mb-6 mt-2 font-semibold'>Add Company Partner</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Company Name*"
            name="companyName"
            type='text'
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />


          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 2, color: 'hsl(var(--label-text))', fontWeight: 500 }}>
              Attachment
            </Typography>

            <div className="">
              <input
                type="file"
                multiple
                accept="image/*,application/pdf,.xlsx,.xls"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-orange-50 hover:bg-orange-100 transition-colors">
                  <span className="text-gray-600">
                    Drag & Drop or{" "}
                    <span className="text-red-500 underline">Choose files</span>{" "}
                  </span>
                </div>
              </label>

              {/* Attachment Previews */}
              {attachmentPreviews.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {attachmentPreviews.map(({ file, preview }, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 100,
                        height: 100,
                        border: '1px solid hsl(var(--form-border))',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'hsl(var(--background))'
                      }}
                    >
                      <img
                        src={preview}
                        alt={file.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />

                      <IconButton
                        onClick={() => handleRemoveAttachment(file)}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          backgroundColor: 'hsl(var(--background))',
                          '&:hover': { backgroundColor: 'hsl(var(--destructive))', color: 'white' }
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </div>
          </Box>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white w-full"
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
