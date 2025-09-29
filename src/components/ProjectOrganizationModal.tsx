import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material"
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { createOrganization, updateOrganization } from "@/store/slices/organizationsSlice";

const ProjectOrganizationModal = ({ openDialog, handleCloseDialog, fetchData, isEditing, record }) => {
    const dispatch = useAppDispatch();
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        organizationName: '',
        domain: '',
    })

    useEffect(() => {
        if (isEditing && record) {
            setFormData({
                organizationName: record.name,
                domain: record.domain,
            });
            setPreviewUrl(null);
        }
    }, [isEditing, record]);

    const handleClose = () => {
        setFormData({
            organizationName: '',
            domain: '',
        });
        setPreviewUrl(null);
        setSelectedFile(null);
        handleCloseDialog();
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                toast.error('Please upload a valid image file (JPEG, PNG, JPG)');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size exceeds 5MB limit');
                return;
            }
            setSelectedFile(file);
        }
    };

    useEffect(() => {
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [selectedFile]);

    const handleSubmit = async () => {
        const formDataToSubmit = new FormData();
        if (isEditing) {
            try {
                formDataToSubmit.append('organization[name]', formData.organizationName);
                formDataToSubmit.append('organization[domain]', formData.domain);
                formDataToSubmit.append('organization[org_image]', selectedFile);
                await dispatch(updateOrganization({ data: formDataToSubmit, baseUrl, token, id: record.id })).unwrap();
                toast.success('Organization updated successfully');
                fetchData();
                handleCloseDialog();
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                formDataToSubmit.append('organization[name]', formData.organizationName);
                formDataToSubmit.append('organization[domain]', formData.domain);
                formDataToSubmit.append('organization[org_image]', selectedFile);
                formDataToSubmit.append("organization[active]", 'true');
                formDataToSubmit.append(
                    "organization[created_by_id]",
                    JSON.parse(localStorage.getItem("user")).id
                );

                await dispatch(createOrganization({ data: formDataToSubmit, baseUrl, token })).unwrap();
                toast.success('Organization created successfully');
                fetchData();
                handleCloseDialog();
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Organization</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="organizationName"
                    label="Organization Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.organizationName}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{
                        style: { backgroundColor: '#fff', borderRadius: '4px' },
                    }}
                />
                <TextField
                    margin="dense"
                    name="domain"
                    label="Organization Domain"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.domain}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{
                        style: { backgroundColor: '#fff', borderRadius: '4px' },
                    }}
                />

                <div className="space-y-2">
                    <Label className="text-sm">Image Upload</Label>
                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-orange-50">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            accept="image/jpeg,image/png,image/jpg"
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer text-gray-600 hover:text-gray-800"
                        >
                            <div className="text-sm">
                                {selectedFile ? (
                                    <span className="text-green-600">Selected: {selectedFile.name}</span>
                                ) : (
                                    <>
                                        Drag & Drop or <span className="text-orange-500">Choose File</span> No file chosen
                                    </>
                                )}
                            </div>
                        </label>
                    </div>
                    {previewUrl && (
                        <div className="mt-4">
                            <div className="relative w-[200px]">
                                <img
                                    src={previewUrl}
                                    alt="Selected preview"
                                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setPreviewUrl(null);
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>

            <div className="flex justify-center gap-3 mb-4">
                <Button
                    variant="outline"
                    onClick={handleCloseDialog}
                    className="px-6"
                >
                    Cancel
                </Button>
                <Button
                    className="bg-green-500 hover:bg-green-600 text-white px-6"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </div>
        </Dialog>
    )
}

export default ProjectOrganizationModal