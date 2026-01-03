import { forwardRef, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { createProjectsTags, fetchProjectsTags } from "@/store/slices/projectTagSlice";



interface AddTagModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTagCreated?: () => void;
}

export const AddTagModal = ({ isOpen, onClose, onTagCreated }: AddTagModalProps) => {
    const dispatch = useAppDispatch();
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');

    const [tagName, setTagName] = useState('');
    const [tagDescription, setTagDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const closeDialog = () => {
        setTagName('');
        setTagDescription('');
        onClose();
    };

    const handleSubmit = async () => {
        if (!tagName.trim()) {
            toast.error('Please enter tag name');
            return;
        }

        const payload = {
            name: tagName,
            description: tagDescription,
        };

        try {
            setLoading(true);
            // Assuming there's a create tag API
            await dispatch(createProjectsTags(payload)).unwrap();
            toast.success('Tag created successfully');
            await dispatch(fetchProjectsTags()).unwrap();
            if (onTagCreated) {
                onTagCreated();
            }
            closeDialog();
        } catch (error) {
            console.error("Error creating tag:", error);
            toast.error("Failed to create tag");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
            <DialogContent
                className="bg-[#fff] text-sm"
                sx={{
                    padding: "24px !important"
                }}
            >
                <h3 className="text-[16px] font-medium text-center mb-4">
                    Add Tag
                </h3>
                <button
                    onClick={closeDialog}
                    className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>
                {/* Tag Name */}
                <div className="mt-6 space-y-2">
                    <label className="block text-sm font-medium">
                        Tag Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                        placeholder="Enter Tag Name"
                        className="w-full px-4 py-1.5 border-2 border-gray-300 rounded focus:outline-none placeholder-gray-400 text-base"
                    />
                </div>

                {/* Tag Description */}
                <div className="mt-4 space-y-2">
                    <label className="block text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        value={tagDescription}
                        onChange={(e) => setTagDescription(e.target.value)}
                        placeholder="Enter Tag Description (optional)"
                        rows={4}
                        className="w-full px-4 py-1.5 border-2 border-gray-300 rounded focus:outline-none placeholder-gray-400 text-base resize-none"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-3 mb-6 mt-8">
                    <Button
                        variant="outline"
                        onClick={closeDialog}
                        className="px-6"
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-[#C72030] hover:bg-[#A01020] text-white px-6"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Tag'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddTagModal;
