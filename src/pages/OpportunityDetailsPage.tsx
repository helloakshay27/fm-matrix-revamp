import { ArrowLeft, ChevronDown, ChevronDownCircle, CircleCheckBig, LogOut, RefreshCw, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getFullUrl } from '@/config/apiConfig';
import { toast } from 'sonner';
import ConvertModal from '@/components/ConvertModal';
import { useLayout } from '@/contexts/LayoutContext';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

// Types
interface OpportunityDetailsData {
    id: number;
    title: string;
    description: string;
    status: string;
    created_by: {
        name: string;
    };
    created_at: string;
    task_created?: boolean;
    project_created?: boolean;
    project_management_id?: number;
    task_management_id?: number;
    milestone_id?: number;
    project_name?: string;
    task_name?: string;
    responsible_person?: {
        id: string;
        name: string;
    };
    task_tags?: Array<{
        company_tag_id: number;
        company_tag: {
            name: string;
        };
    }>;
    observers?: Array<{
        id: number;
        user_name: string;
    }>;
    attachments?: Array<{
        id: number;
        document_file_name?: string;
        filename?: string;
        document_url?: string;
        url?: string;
    }>;
    comments?: Array<{
        id: number;
        body: string;
        commentor_full_name: string;
        created_at: string;
    }>;
}

interface AttachmentFile {
    id: number;
    document_file_name?: string;
    filename?: string;
    document_url?: string;
    url?: string;
}

interface CommentData {
    id: number;
    body: string;
    commentor_full_name: string;
    created_at: string;
    updated_at?: string;
}

const Attachments = ({
    attachments,
    id,
    getOpportunity,
}: {
    attachments: AttachmentFile[];
    id: number;
    getOpportunity: () => void;
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const token = localStorage.getItem('token');
    const [files, setFiles] = useState(attachments);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setFiles(attachments);
    }, [attachments]);

    const handleAttachFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || []);
        if (!selectedFiles.length) return;

        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append('opportunity[attachments][]', file);
        });

        setIsUploading(true);
        toast.loading('Uploading files...', { id: 'file-upload' });

        try {
            await axios.put(getFullUrl(`/opportunities/${id}.json`), formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Files uploaded successfully.', { id: 'file-upload' });
            getOpportunity();
        } catch (error) {
            console.error('File upload failed:', error);
            toast.error('Failed to upload file.', { id: 'file-upload' });
        } finally {
            setIsUploading(false);
            // Reset the file input so the same file can be uploaded again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveFile = async (fileId: number) => {
        try {
            await axios.delete(getFullUrl(`/opportunities/${id}/attachments/${fileId}.json`), {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.dismiss();
            toast.success('File removed successfully.');
        } catch (error) {
            console.error('File deletion failed:', error);
            toast.error('Failed to delete file.');
        }
    };

    return (
        <div className="flex flex-col gap-3 p-5">
            {files && files.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 mt-4">
                        {files.map((file, index) => {
                            const fileName = file.document_file_name || file.filename;
                            const fileUrl = file.document_url || file.url;
                            const fileExt = fileName?.split('.').pop().toLowerCase();

                            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExt || '');
                            const isPdf = fileExt === 'pdf';
                            const isWord = ['doc', 'docx'].includes(fileExt || '');
                            const isExcel = ['xls', 'xlsx'].includes(fileExt || '');

                            return (
                                <div
                                    key={index}
                                    className="border rounded p-2 flex flex-col items-center justify-center text-center shadow-sm bg-white relative"
                                >
                                    <Trash2
                                        size={20}
                                        color="#C72030"
                                        className="absolute top-2 right-2 cursor-pointer"
                                        onClick={() => handleRemoveFile(file.id)}
                                    />

                                    <div className="w-[100px] h-[100px] flex items-center justify-center bg-gray-100 rounded mb-2 overflow-hidden">
                                        {isImage ? (
                                            <img src={fileUrl} alt={fileName} className="object-contain h-full" />
                                        ) : isPdf ? (
                                            <span className="text-red-600 font-bold">PDF</span>
                                        ) : isWord ? (
                                            <span className="text-blue-600 font-bold">DOC</span>
                                        ) : isExcel ? (
                                            <span className="text-green-600 font-bold">XLS</span>
                                        ) : (
                                            <span className="text-gray-500 font-bold">FILE</span>
                                        )}
                                    </div>

                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download={fileName}
                                        className="text-xs text-blue-700 hover:underline truncate w-full"
                                        title={fileName}
                                    >
                                        {fileName}
                                    </a>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        className="bg-[#C72030] h-[40px] w-[240px] text-white px-5 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleAttachFile}
                        disabled={isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Attach Files'}
                    </button>
                </>
            ) : (
                <div className="text-[14px] mt-2">
                    <span>No Documents Attached</span>
                    <div className="text-[#C2C2C2]">Drop or attach relevant documents here</div>
                    <button
                        className="bg-[#C72030] h-[40px] w-[240px] text-white px-5 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleAttachFile}
                        disabled={isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Attach Files'}
                    </button>
                </div>
            )}

            <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
};

function formatToDDMMYYYY_AMPM(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = String(hours).padStart(2, '0');

    return `${day}/${month}/${year} ${hoursStr}:${minutes} ${ampm}`;
}

const Comments = ({ comments, getOpportunity }: { comments: CommentData[]; getOpportunity: () => void }) => {
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const { id: opportunityId } = useParams();
    const [comment, setComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editedCommentText, setEditedCommentText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleAddComment = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!comment?.trim()) {
            toast.error('Comment cannot be empty', { duration: 1000 });
            return;
        }
        try {
            const payload = {
                comment: {
                    body: comment,
                    commentable_type: 'Opportunity',
                    commentor_id: JSON.parse(localStorage.getItem('user') || '{}')?.id,
                    active: true,
                    commentable_id: opportunityId,
                },
            };
            await axios.post(getFullUrl('/comments.json'), payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Comment added successfully');
            setComment('');
            getOpportunity();
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment');
        }
    };

    const handleEdit = (comment: CommentData) => {
        setEditingCommentId(comment.id);
        setEditedCommentText(comment.body);
    };

    const handleEditSave = async () => {
        if (!editedCommentText.trim()) {
            toast.error('Comment cannot be empty');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('comment[body]', editedCommentText);
            await axios.put(getFullUrl(`/comments/${editingCommentId}.json`), formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Comment updated successfully');
            setEditingCommentId(null);
            setEditedCommentText('');
            getOpportunity();
        } catch (error) {
            console.error('Error updating comment:', error);
            toast.error('Failed to update comment');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(getFullUrl(`/comments/${id}.json`), {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Comment deleted successfully');
            getOpportunity();
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment');
        }
    };

    const handleCancel = () => {
        setEditingCommentId(null);
        setComment('');
        setEditedCommentText('');
    };

    return (
        <div className="text-[14px] flex flex-col gap-2">
            <div className="flex justify-start m-2 gap-5">
                <div className="bg-[#01569E] h-[36px] w-[36px] rounded-full text-white text-center p-1.5">
                    <span>
                        {`${currentUser?.firstname?.charAt(0) || ''}${currentUser?.lastname?.charAt(0) || ''}`}
                    </span>
                </div>
                <textarea
                    ref={textareaRef}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-[95%] h-[70px] bg-[#F2F4F4] p-2 border-2 border-[#DFDFDF] focus:outline-none rounded"
                    placeholder="Add comment here..."
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-red-600 text-white h-[30px] px-3 cursor-pointer p-1 mr-2 rounded"
                    onClick={() => handleAddComment()}
                >
                    Add Comment
                </button>
                <button
                    className="border-2 border-[#C72030] h-[30px] cursor-pointer p-1 px-3 rounded"
                    onClick={handleCancel}
                >
                    Cancel
                </button>
            </div>

            {comments?.map((cmt) => {
                const isEditing = editingCommentId === cmt.id;
                return (
                    <div key={cmt.id} className="relative flex justify-start m-2 gap-5">
                        <div className="bg-[#01569E] h-[36px] w-[36px] rounded-full text-white text-center p-1.5">
                            <span>
                                {cmt?.commentor_full_name?.split(' ')[0]?.charAt(0)}
                                {cmt?.commentor_full_name?.split(' ')[1]?.charAt(0)}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2 w-full border-b-[2px] pb-3 border-[rgba(190, 190, 190, 1)]">
                            <h1 className="font-bold">{cmt.commentor_full_name}</h1>

                            {isEditing ? (
                                <textarea
                                    value={editedCommentText}
                                    onChange={(e) => setEditedCommentText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            setTimeout(() => {
                                                handleEditSave();
                                            }, 100);
                                        }
                                    }}
                                    onBlur={handleEditSave}
                                    className="w-full bg-white p-2 border-2 border-gray-300 rounded focus:outline-none"
                                    autoFocus
                                />
                            ) : (
                                <div>
                                    {cmt.body
                                        .replace(/@\[(.*?)\]\(\d+\)/g, '@$1')
                                        .replace(/#\[(.*?)\]\(\d+\)/g, '#$1')}
                                </div>
                            )}

                            <div className="flex gap-2 text-[10px]">
                                <span>{formatToDDMMYYYY_AMPM(cmt.created_at)}</span>
                                {cmt.updated_at && cmt.updated_at !== cmt.created_at && (
                                    <span className="text-gray-500 italic">(edited)</span>
                                )}
                                <span className="cursor-pointer hover:underline" onClick={() => handleEdit(cmt)}>
                                    Edit
                                </span>
                                <span className="cursor-pointer hover:underline" onClick={() => handleDelete(cmt.id)}>
                                    Delete
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const STATUS_COLORS: Record<string, string> = {
    open: 'bg-[#E4636A] text-white',
    in_progress: 'bg-[#08AEEA] text-white',
    on_hold: 'bg-[#7BD2B5] text-black',
    converted_to_task: 'bg-[#83D17A] text-white',
};

const mapStatusToDisplay = (rawStatus: string): string => {
    const statusMap: Record<string, string> = {
        open: 'Open',
        in_progress: 'In Progress',
        on_hold: 'On Hold',
        converted_to_task: 'Converted to Task',
    };
    return statusMap[rawStatus?.toLowerCase()] || 'Open';
};

const mapDisplayToApiStatus = (displayStatus: string): string => {
    const reverseStatusMap: Record<string, string> = {
        Open: 'open',
        'In Progress': 'in_progress',
        'On Hold': 'on_hold',
        'Converted to Task': 'converted_to_task',
    };
    return reverseStatusMap[displayStatus] || 'open';
};

const OpportunityDetailsPage = () => {
    const { setCurrentSection } = useLayout();

    const view = localStorage.getItem("selectedView");

    useEffect(() => {
        setCurrentSection(view === "admin" ? "Value Added Services" : "Project Task");
    }, [setCurrentSection]);

    const token = localStorage.getItem('token');
    const { id } = useParams();
    const navigate = useNavigate();
    const baseUrl = localStorage.getItem('baseUrl');

    const [isFirstCollapsed, setIsFirstCollapsed] = useState(false);
    const [isSecondCollapsed, setIsSecondCollapsed] = useState(false);
    const [isDetailsCollapsed, setIsDetailsCollapsed] = useState(true);
    const [tab, setTab] = useState('Comments');
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const firstContentRef = useRef<HTMLDivElement>(null);
    const secondContentRef = useRef<HTMLDivElement>(null);
    const detailsContentRef = useRef<HTMLDivElement>(null);

    const [openDropdown, setOpenDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Open');
    const [opportunityDetails, setOpportunityDetails] = useState<OpportunityDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addingTodo, setAddingTodo] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const getOpportunity = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(getFullUrl(`/opportunities/${id}.json`), {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOpportunityDetails(response.data);
            setSelectedOption(mapStatusToDisplay(response.data.status));
        } catch (err: any) {
            console.error('Error fetching opportunity:', err);
            setError(err.message || 'Failed to fetch opportunity details');
            toast.error('Failed to load opportunity details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOpportunity();
    }, [id, token]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const dropdownOptions = ['Open', 'In Progress', 'On Hold', 'Completed'];

    const handleOptionSelect = async (option: string) => {
        setSelectedOption(option);
        setOpenDropdown(false);
        const payload = {
            opportunity: {
                status: mapDisplayToApiStatus(option),
            },
        };
        try {
            await axios.put(getFullUrl(`/opportunities/${id}.json`), payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.dismiss();
            toast.success('Status updated successfully');
            await getOpportunity();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleConvertToTask = () => {
        setIsTaskModalOpen(true);
    };

    const handleAddToDo = async () => {
        if (addingTodo) return;
        setAddingTodo(true);
        try {
            const payload = {
                todo: {
                    title: opportunityDetails.title,
                    status: 'open',
                },
            };

            await axios.post(`https://${baseUrl}/todos.json`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('To-Do added successfully.');
        } catch (error) {
            console.log(error);
            const errorData = error.response.data;
            Object.keys(errorData).forEach((key) => {
                toast.error(`${key} ${errorData[key]} for todo`);
            });
        } finally {
            setAddingTodo(false);
        }
    }

    const handleGoToTask = () => {
        if (opportunityDetails?.project_management_id) {
            navigate(`/vas/projects/${opportunityDetails.project_management_id}`);
        } else if (opportunityDetails?.milestone_id) {
            navigate(`/vas/milestones/${opportunityDetails.milestone_id}`);
        } else if (opportunityDetails?.task_created) {
            navigate(`/vas/tasks/${opportunityDetails.task_management_id}`);
        }
    };

    const toggleFirstCollapse = () => {
        setIsFirstCollapsed(!isFirstCollapsed);
    };

    const toggleDetailsCollapse = () => {
        setIsDetailsCollapsed(!isDetailsCollapsed);
    };

    if (loading) {
        return (
            <div className="m-4 flex items-center justify-center py-12">
                <p className="text-gray-600">Loading opportunity details...</p>
            </div>
        );
    }

    return (
        <>
            <div className="m-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="p-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div className="px-4 pt-1">
                    <h2 className="text-[15px] p-3 px-0">
                        <span className="mr-3 text-[#c72030]">OP-{opportunityDetails?.id}</span>
                        <span>
                            {opportunityDetails?.title
                                .replace(/@\[(.*?)\]\(\d+\)/g, '@$1')
                                .replace(/#\[(.*?)\]\(\d+\)/g, '#$1')}
                        </span>
                    </h2>

                    <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>
                    <div className="flex items-center justify-between my-3 text-[12px]">
                        <div className="flex items-center gap-3 text-[#323232]">
                            <span>Created By : {opportunityDetails?.created_by?.name || 'N/A'}</span>

                            <span className="h-6 w-[1px] border border-gray-300"></span>

                            <span className="flex items-center gap-3">
                                Created On : {formatToDDMMYYYY_AMPM(opportunityDetails?.created_at)}
                            </span>

                            <span className="h-6 w-[1px] border border-gray-300"></span>

                            <span
                                className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md text-sm ${STATUS_COLORS[mapDisplayToApiStatus(selectedOption).toLowerCase()] ||
                                    'bg-gray-400 text-white'
                                    }`}
                            >
                                <div className="relative" ref={dropdownRef}>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer px-2 py-1"
                                        onClick={() => setOpenDropdown(!openDropdown)}
                                        role="button"
                                        aria-haspopup="true"
                                        aria-expanded={openDropdown}
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && setOpenDropdown(!openDropdown)}
                                    >
                                        <span className="text-[13px]">{selectedOption}</span>
                                        <ChevronDown
                                            size={15}
                                            className={`${openDropdown ? 'rotate-180' : ''} transition-transform`}
                                        />
                                    </div>
                                    <ul
                                        className={`dropdown-menu absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden ${openDropdown ? 'block' : 'hidden'
                                            }`}
                                        role="menu"
                                        style={{
                                            minWidth: '150px',
                                            maxHeight: '400px',
                                            overflowY: 'auto',
                                            zIndex: 1000,
                                        }}
                                    >
                                        {dropdownOptions.map((option, idx) => (
                                            <li key={idx} role="menuitem">
                                                <button
                                                    className={`dropdown-item w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 ${selectedOption === option ? 'bg-gray-100 font-semibold' : ''
                                                        }`}
                                                    onClick={() => handleOptionSelect(option)}
                                                >
                                                    {option}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </span>

                            <span className="h-6 w-[1px] border border-gray-300"></span>

                            {!opportunityDetails?.task_created ? (
                                <>
                                    <span
                                        className="cursor-pointer flex items-center gap-1"
                                        onClick={handleConvertToTask}
                                    >
                                        <RefreshCw className="mx-1" size={15} /> Convert
                                    </span>

                                    <span className="h-6 w-[1px] border border-gray-300"></span>

                                    <span
                                        className="flex items-center gap-1 cursor-pointer"
                                    // onClick={handleAddToDo}
                                    >
                                        <CircleCheckBig size={15} />
                                        <span>Add To Do</span>
                                    </span>
                                </>
                            ) : (
                                <span className="cursor-pointer flex items-center gap-1" onClick={handleGoToTask}>
                                    <LogOut className="mx-1" size={15} /> Go to{' '}
                                    {opportunityDetails.project_management_id
                                        ? 'Project'
                                        : opportunityDetails.milestone_id
                                            ? 'Milestone'
                                            : 'Task'}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="border-b-[3px] border-grey my-3"></div>

                    <div className="border rounded-[10px] shadow-md p-5 mb-4 text-[14px]">
                        <div className="font-[600] text-[16px] flex items-center gap-4">
                            <ChevronDownCircle
                                color="#c72030"
                                size={30}
                                className={`${isFirstCollapsed ? 'rotate-180' : 'rotate-0'
                                    } transition-transform cursor-pointer`}
                                onClick={toggleFirstCollapse}
                            />
                            Description
                        </div>
                        <div className="mt-3 overflow-hidden transition-all duration-300" style={{ maxHeight: isFirstCollapsed ? '0px' : '1000px' }}>
                            <div
                                className="prose prose-sm max-w-none quill-content"
                                dangerouslySetInnerHTML={{
                                    __html: opportunityDetails?.description || '<p>No description provided</p>'
                                }}
                            />
                        </div>
                    </div>

                    <div className="border rounded-[10px] shadow-md p-5 mb-4">
                        <div className="font-[600] text-[16px] flex items-center gap-10">
                            <div className="flex items-center gap-4">
                                <ChevronDownCircle
                                    color="#c72030"
                                    size={30}
                                    className={`${isDetailsCollapsed ? 'rotate-180' : 'rotate-0'} cursor-pointer transition-transform`}
                                    onClick={toggleDetailsCollapse}
                                />
                                Details
                            </div>
                            {isDetailsCollapsed && (
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center justify-start gap-3">
                                        <div className="text-right text-[12px] font-[500]">
                                            Responsible Person:
                                        </div>
                                        <div className="text-left text-[12px]">
                                            {opportunityDetails?.responsible_person ? (
                                                <span>{opportunityDetails.responsible_person.name}</span>
                                            ) : (
                                                <span className="text-gray-500">Not Assigned</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-start gap-3">
                                        <div className="text-right text-[12px] font-[500]">Tags:</div>
                                        <div className="text-left text-[12px]">
                                            {opportunityDetails?.task_tags && opportunityDetails.task_tags.length > 0 ? (
                                                <span>{opportunityDetails.task_tags.length} Tag(s)</span>
                                            ) : (
                                                <span className="text-gray-500">No Tags</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div
                            className="mt-3 overflow-hidden transition-all duration-500"
                            ref={detailsContentRef}
                            style={{
                                maxHeight: isDetailsCollapsed ? '0px' : '1000px',
                                opacity: isDetailsCollapsed ? 0 : 1,
                            }}
                        >
                            <div className="flex flex-col">
                                <div className="flex items-center ml-36">
                                    <div className="w-1/2 flex items-center justify-start gap-3">
                                        <div className="text-right text-[13px] font-[500]">
                                            Responsible Person :
                                        </div>
                                        <div className="text-left text-[13px]">
                                            {opportunityDetails?.responsible_person ? (
                                                <span>{opportunityDetails.responsible_person.name}</span>
                                            ) : (
                                                <span className="text-gray-500">Not Assigned</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <span className="border h-[1px] inline-block w-full my-4"></span>

                                <div className="flex items-center ml-36">
                                    <div className="w-1/2 flex items-start justify-start gap-3">
                                        <div className="text-right text-[13px] font-[500]">
                                            Tags :
                                        </div>
                                        <div className="text-left text-[13px]">
                                            {opportunityDetails?.task_tags && opportunityDetails.task_tags.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {opportunityDetails.task_tags.map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="bg-[#C72030] text-white px-4 py-1.5 rounded-full text-[12px] font-medium"
                                                        >
                                                            {tag.company_tag?.name || 'Unknown'}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">No tags assigned</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <span className="border h-[1px] inline-block w-full my-4"></span>

                                <div className="flex items-center ml-36">
                                    <div className="w-1/2 flex items-start justify-start gap-3">
                                        <div className="text-right text-[13px] font-[500]">
                                            Observers :
                                        </div>
                                        <div className="text-left text-[13px]">
                                            {opportunityDetails?.observers && opportunityDetails.observers.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {opportunityDetails.observers.map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="bg-[#C72030] text-white px-4 py-1.5 rounded-full text-[12px] font-medium"
                                                        >
                                                            {tag.user_name || 'Unknown'}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">No observers assigned</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between my-3">
                            <div className="flex items-center gap-10">
                                {['Comments', 'Documents'].map((item) => (
                                    <div
                                        key={item}
                                        className={`text-[14px] font-[400] ${tab === item ? 'selected' : 'cursor-pointer'
                                            }`}
                                        onClick={() => setTab(item)}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="border-b-[3px] border-[rgba(190, 190, 190, 1)]"></div>

                        <div>
                            {tab === 'Documents' && (
                                <Attachments
                                    attachments={opportunityDetails?.attachments || []}
                                    id={opportunityDetails?.id}
                                    getOpportunity={getOpportunity}
                                />
                            )}
                            {tab === 'Comments' && (
                                <Comments
                                    comments={opportunityDetails?.comments || []}
                                    getOpportunity={getOpportunity}
                                />
                            )}
                        </div>
                    </div>
                </div>
                {isTaskModalOpen && (
                    <ConvertModal
                        isModalOpen={isTaskModalOpen}
                        setIsModalOpen={setIsTaskModalOpen}
                        prefillData={{
                            title: opportunityDetails?.title,
                            project: opportunityDetails?.project_management_id,
                            projectName: opportunityDetails?.project_name,
                            task: opportunityDetails?.task_management_id,
                            taskName: opportunityDetails?.task_name,
                            description: opportunityDetails?.description,
                            responsible_person: {
                                id: opportunityDetails?.responsible_person?.id
                            },
                            tags: opportunityDetails?.task_tags
                        }}
                        opportunityId={Number(id)}
                    />
                )}
            </div>

            <style>{`
                .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
                    color: #1a1a1a;
                    font-weight: 600;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }

                .prose h1 {
                    font-size: 1.875rem;
                }

                .prose h2 {
                    font-size: 1.5rem;
                }

                .prose h3 {
                    font-size: 1.25rem;
                }

                .prose p {
                    margin: 0.75rem 0;
                    line-height: 1.6;
                    color: #333;
                }

                .prose strong {
                    font-weight: 700;
                    color: #1a1a1a;
                }

                .prose em {
                    font-style: italic;
                    color: #1a1a1a;
                }

                .prose u {
                    text-decoration: underline;
                }

                .prose s {
                    text-decoration: line-through;
                }

                .prose blockquote {
                    border-left: 4px solid #c72030;
                    padding-left: 1rem;
                    margin: 1rem 0;
                    color: #666;
                    font-style: italic;
                }

                .prose code {
                    background-color: #f5f5f5;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-family: monospace;
                    color: #d63384;
                }

                .prose pre {
                    background-color: #f5f5f5;
                    padding: 1rem;
                    border-radius: 4px;
                    overflow-x: auto;
                    margin: 1rem 0;
                }

                .prose pre code {
                    background-color: transparent;
                    color: #333;
                    padding: 0;
                }

                .prose ul, .prose ol {
                    margin: 1rem 0;
                    padding-left: 2rem;
                }

                .prose li {
                    margin: 0.5rem 0;
                }

                .prose a {
                    color: #01569E;
                    text-decoration: underline;
                }

                .prose a:hover {
                    color: #004080;
                }

                .prose img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 4px;
                    margin: 1rem 0;
                }
            `}</style>
        </>
    );
};

export default OpportunityDetailsPage;
