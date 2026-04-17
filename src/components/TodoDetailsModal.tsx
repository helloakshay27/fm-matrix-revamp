import { Dialog, DialogContent, DialogTitle, Slide } from '@mui/material';
import { X, CheckCircle2, AlertCircle, Calendar, User, Link2, Clock, Flag, Edit } from 'lucide-react';
import { forwardRef, useEffect, useRef } from 'react';
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { TransitionProps } from '@mui/material/transitions';

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const TodoDetailsModal = ({ isModalOpen, setIsModalOpen, todo = null, onEditClick }: { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void; todo: any | null; onEditClick?: () => void }) => {
    const quillRef = useRef<HTMLDivElement>(null);
    const quillEditorRef = useRef<Quill | null>(null);

    const getPriorityLabel = (priority: string) => {
        const priorityMap: { [key: string]: string } = {
            'P1': 'Q1: Urgent & Important',
            'P2': 'Q2: Important, Not Urgent',
            'P3': 'Q3: Urgent, Not Important',
            'P4': 'Q4: Not Urgent or Important',
        };
        return priorityMap[priority] || priority;
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'P1':
                return 'text-red-600 bg-red-50';
            case 'P2':
                return 'text-green-600 bg-green-50';
            case 'P3':
                return 'text-yellow-600 bg-yellow-50';
            case 'P4':
                return 'text-gray-600 bg-gray-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'text-blue-600 bg-blue-50';
            case 'completed':
                return 'text-green-600 bg-green-50';
            case 'paused':
                return 'text-orange-600 bg-orange-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    // Initialize Quill Editor for display only
    useEffect(() => {
        if (isModalOpen && todo?.description) {
            const initTimer = setTimeout(() => {
                if (quillRef.current && !quillEditorRef.current) {
                    quillEditorRef.current = new Quill(quillRef.current, {
                        theme: "snow",
                        readOnly: true,
                        modules: {
                            toolbar: false,
                        },
                    });

                    // Set description content
                    if (todo.description) {
                        quillEditorRef.current.root.innerHTML = todo.description;
                    }
                }
            }, 100);

            return () => {
                clearTimeout(initTimer);
            };
        } else {
            // Clean up editor ref when modal closes
            if (quillEditorRef.current) {
                quillEditorRef.current = null;
            }
        }
    }, [isModalOpen, todo]);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (!todo) return null;

    return (
        <Dialog
            open={isModalOpen}
            onClose={closeModal}
            maxWidth={false}
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    width: '40%',
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
                <h3 className="text-lg font-medium text-center">Todo Details</h3>
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
                <div className="pb-12 px-8">
                    <div className="space-y-6">
                        {/* Title Section with Status */}
                        <div>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 leading-tight pr-8">
                                    {todo.title || 'Untitled'}
                                </h2>
                                {
                                    onEditClick && (
                                        <Edit
                                            size={20}
                                            className="text-[#c72030] cursor-pointer"
                                            onClick={() => {
                                                onEditClick();
                                                closeModal();
                                            }}
                                        />
                                    )
                                }
                            </div>
                            <div className="flex flex-wrap gap-2 items-center">
                                {/* Priority Badge */}
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-[10px] font-semibold text-sm transition-all ${getPriorityColor(todo.priority)}`}>
                                    <Flag size={16} />
                                    {getPriorityLabel(todo.priority) || 'N/A'}
                                </div>

                                {/* Status Badge */}
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-[10px] font-semibold text-sm capitalize transition-all ${getStatusColor(todo.status)}`}>
                                    {todo.status === 'completed' ? (
                                        <CheckCircle2 size={16} />
                                    ) : (
                                        <AlertCircle size={16} />
                                    )}
                                    {todo.status || 'N/A'}
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="bg-white rounded-[10px] border border-gray-200 p-5 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">📝 Description</h3>
                            <div
                                className="prose prose-sm max-w-none quill-content"
                                dangerouslySetInnerHTML={{
                                    __html: todo?.description || '<p>No description provided</p>'
                                }}
                            />
                        </div>

                        {/* Key Details Section */}
                        <div className="bg-white rounded-[10px] border border-gray-200 p-5 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-600 mb-5 uppercase tracking-wider">ℹ️ Details</h3>
                            <div className="grid grid-cols-2 gap-6">
                                {/* Target Date */}
                                {todo.target_date && (
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0">
                                            <Calendar className="text-orange-500" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Target Date</p>
                                            <p className="text-base font-semibold text-gray-900">{todo.target_date}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Responsible Person */}
                                {todo.user && (
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0">
                                            <User className="text-blue-500" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Responsible Person</p>
                                            <p className="text-base font-semibold text-gray-900">{todo.user}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Assigned By */}
                                {todo.created_by && (
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0">
                                            <User className="text-purple-500" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Assigned By</p>
                                            <p className="text-base font-semibold text-gray-900">{todo.created_by}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Task ID */}
                                {todo.task_management_id && (
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0">
                                            <Link2 className="text-red-500" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Linked Task</p>
                                            <p className="text-base font-semibold text-[#c72030]">Task #{todo.task_management_id}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Timeline Footer */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-[10px] border border-gray-200 p-5 space-y-4">
                            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">⏱️ Timeline</h3>
                            <div className="space-y-3">
                                {todo.created_at && (
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-300">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-green-600" />
                                            <span className="text-sm font-medium text-gray-700">Created</span>
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium">
                                            {new Date(todo.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                            <span className="text-gray-500 ml-1">
                                                {new Date(todo.created_at).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </span>
                                    </div>
                                )}
                                {todo.updated_at && (
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-blue-600" />
                                            <span className="text-sm font-medium text-gray-700">Last Updated</span>
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium">
                                            {new Date(todo.updated_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                            <span className="text-gray-500 ml-1">
                                                {new Date(todo.updated_at).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TodoDetailsModal;
