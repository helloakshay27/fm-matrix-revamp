import { forwardRef, useState } from "react";
import { Dialog, DialogContent, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { createProjectsTags, fetchProjectsTags } from "@/store/slices/projectTagSlice";

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

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
        <Dialog open={isOpen} onClose={closeDialog} TransitionComponent={Transition}>
            <DialogContent
                className="w-[35rem] h-full fixed right-0 top-0 rounded-none bg-[#fff] text-sm"
                style={{ margin: 0 }}
                sx={{
                    padding: "0 !important"
                }}
            >
                <h3 className="text-[14px] font-medium text-center mt-8">
                    Add Tag
                </h3>
                <button
                    onClick={closeDialog}
                    className="absolute top-[26px] right-8 cursor-pointer text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>

                <hr className="border border-[#E95420] mt-4" />

                <div className="overflow-y-auto" style={{ height: 'calc(100vh - 110px)' }}>
                    <div className="max-w-[90%] mx-auto pr-3">
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
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddTagModal;
