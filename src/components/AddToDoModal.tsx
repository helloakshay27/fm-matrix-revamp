import axios from 'axios';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const AddToDoModal = ({ isModalOpen, setIsModalOpen, getTodos }) => {
    const baseURL = localStorage.getItem('baseUrl');
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (!title || !date) {
                toast.error('Please fill in all fields');
                return;
            }

            setIsSubmitting(true);

            const payload = {
                todo: {
                    title,
                    target_date: date,
                    status: 'open',
                },
            };

            await axios.post(`https://${baseURL}/todos.json`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.success('To-Do added successfully');
            closeModal();
            getTodos();
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            open={isModalOpen}
            onClose={closeModal}
            maxWidth={false}
            PaperProps={{
                sx: {
                    width: '35%',
                    height: '100%',
                    maxHeight: '100%',
                    margin: 0,
                    borderRadius: 0,
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    bottom: 0,
                },
            }}
            TransitionProps={{
                timeout: {
                    enter: 500,
                    exit: 500,
                },
            }}
        >
            <DialogTitle className="relative py-6 !px-0">
                <h3 className="text-lg font-medium text-center">Add ToDo</h3>
                <X
                    className="absolute top-6 right-8 cursor-pointer"
                    onClick={closeModal}
                />
                <hr className="border border-[#E95420] mt-4" />
            </DialogTitle>

            <DialogContent
                sx={{
                    padding: 0,
                    overflow: 'auto',
                }}
            >
                <form className="pt-2 pb-12" onSubmit={handleSubmit}>
                    <div className="max-w-[90%] mx-auto pr-3 text-[12px]">
                        <div className="space-y-2">
                            <label className="block">
                                Title <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Title"
                                className="w-full border h-[40px] outline-none border-gray-300 p-2 text-sm"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 mt-4">
                            <label className="block">
                                Target Date <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="date"
                                placeholder="Target Date"
                                className="w-full border h-[40px] outline-none border-gray-300 p-2 text-sm"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-center gap-4 w-full py-3 bg-white mt-10">
                            <button
                                type="submit"
                                className="flex items-center justify-center border-2 text-[black] border-[red] px-4 py-2 w-[100px]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Add Todo'}
                            </button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddToDoModal;
