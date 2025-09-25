
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Box, Dialog, DialogContent, IconButton, TextField, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { toast } from 'sonner';
import { createCompanyPartner, editCompanyPartner } from '@/store/slices/companyPartnerSlice';
import { useAppDispatch } from '@/store/hooks';

interface AddCompanyPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchData: () => void;
  isEditing?: boolean;
  record?: any;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

export const AddCompanyPartnerModal = ({ isOpen, onClose, fetchData, isEditing, record }: AddCompanyPartnerModalProps) => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');

  const [companyName, setCompanyName] = useState("")
  const [attachmentPreview, setAttachmentPreview] = useState<{ file?: File; preview: string } | null>(null);

  useEffect(() => {
    if (isEditing && record) {
      setCompanyName(record.category_name);
      setAttachmentPreview({ file: undefined, preview: record?.image });
    }
  }, [isEditing, record]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : '';
      setAttachmentPreview({ file, preview });
    }
  };

  const handleClose = () => {
    setCompanyName('');
    setAttachmentPreview(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    if (isEditing) {
      payload.append('pms_generic_tag[category_name]', companyName);
      if (attachmentPreview?.file) {
        payload.append('pms_generic_tag[image]', attachmentPreview.file);
      }

      try {
        await dispatch(editCompanyPartner({ baseUrl, token, data: payload, id: record.id })).unwrap();
        toast.success("Company partner updated successfully");
        fetchData();
        handleClose();
      } catch (error) {
        console.log(error);
        toast.dismiss();
        toast.error(error);
      }
    } else {
      payload.append('pms_generic_tag[category_name]', companyName);
      if (attachmentPreview?.file) {
        payload.append('pms_generic_tag[image]', attachmentPreview.file);
      }
      payload.append('pms_generic_tag[active]', String(1));
      payload.append('pms_generic_tag[tag_type]', 'partner_company');
      payload.append('pms_generic_tag[resource_type]', "Pms::CompanySetup");
      payload.append('pms_generic_tag[resource_id]', localStorage.getItem("selectedCompanyId") || '');

      try {
        await dispatch(createCompanyPartner({ baseUrl, token, data: payload })).unwrap();
        toast.success("Company partner added successfully");
        fetchData();
        handleClose();
      } catch (error) {
        console.log(error);
        toast.dismiss();
        toast.error(error);
      }
    }
  };

  const handleRemoveAttachment = () => {
    setAttachmentPreview(null);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <div>
          <h1 className='text-xl mb-6 mt-2 font-semibold'>{isEditing ? 'Edit Company Partner' : 'Add Company Partner'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Company Name*"
            name="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
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

            <div>
              <input
                type="file"
                accept="image/*,application/pdf,.xlsx,.xls"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-orange-50 hover:bg-orange-100 transition-colors">
                  <span className="text-gray-600">
                    Drag & Drop or{" "}
                    <span className="text-red-500 underline">Choose file</span>{" "}
                  </span>
                </div>
              </label>

              {attachmentPreview && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box
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
                      src={attachmentPreview.preview}
                      alt={attachmentPreview.file?.name || 'Attachment'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <IconButton
                      onClick={handleRemoveAttachment}
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
