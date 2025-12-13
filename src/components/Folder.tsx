import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import UploadButton, { generateId } from './DocumentUploadButton';

const FolderNameModal = ({ isOpen, onClose, onSubmit }) => {
    const [folderName, setFolderName] = useState('');

    const handleSubmit = () => {
        if (folderName.trim()) {
            onSubmit(folderName.trim());
            setFolderName('');
            onClose();
        }
    };

    const handleClose = () => {
        setFolderName('');
        onClose();
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 0,
                    border: '1px solid #C0C0C0',
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 600, fontSize: '16px', color: '#1B1B1B' }}>
                Add New Folder
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
                <TextField
                    autoFocus
                    margin="dense"
                    placeholder="Enter folder name here..."
                    type="text"
                    fullWidth
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderColor: '#C0C0C0',
                            fontSize: '13px',
                        },
                        '& .MuiOutlinedInput-input::placeholder': {
                            color: '#999',
                            opacity: 1,
                        },
                    }}
                    slotProps={{
                        input: {
                            sx: {
                                padding: '12px 16px',
                                fontSize: '13px',
                                color: '#1B1B1B',
                            }
                        }
                    }}
                />
            </DialogContent>
            <DialogActions sx={{ backgroundColor: '#D5DBDB', p: 2, gap: 1 }}>
                <Button
                    onClick={handleClose}
                    sx={{
                        border: '1px solid #C72030',
                        color: '#1B1B1B',
                        fontSize: '14px',
                        textTransform: 'none',
                        px: 4,
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    sx={{
                        border: '1px solid #C72030',
                        color: '#1B1B1B',
                        fontSize: '14px',
                        textTransform: 'none',
                        px: 4,
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        }
                    }}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const Folder = ({ data, onAddFolder, onUploadFile }) => {
    const [expanded, setExpanded] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddFolder = (name) => {
        const newFolder = {
            id: generateId(),
            name,
            type: 'folder',
            children: [],
        };
        onAddFolder(data.id, newFolder);
    };

    return (
        <div className="relative pl-4 border-l border-dotted border-gray-400">
            <div className="relative flex items-center gap-2 py-1 before:absolute before:top-1/2 before:-left-4 before:w-4 before:border-t border-dotted border-gray-400">
                <span className="cursor-pointer text-sm" onClick={() => setExpanded(!expanded)}>
                    {expanded ? '▾' : '▸'}
                </span>
                <span className="text-sm">{data.name}</span>
                <button
                    className="text-xs bg-[#c72030] text-white px-2 py-0.5 rounded hover:bg-[#a91b27] transition-colors duration-200"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Folder
                </button>
                <UploadButton folderId={data.id} onUpload={onUploadFile} />
            </div>

            {expanded && (
                <div className="ml-4">
                    {data.children.map((item) =>
                        item.type === 'folder' ? (
                            <Folder
                                key={item.id}
                                data={item}
                                onAddFolder={onAddFolder}
                                onUploadFile={onUploadFile}
                            />
                        ) : (
                            <div
                                key={item.id}
                                className="relative ml-4 text-sm py-0.5 before:absolute before:top-1/2 before:-left-4 before:w-4 before:border-t border-dotted border-gray-400"
                            >
                                {item.name}
                            </div>
                        )
                    )}
                </div>
            )}

            <FolderNameModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddFolder}
            />
        </div>
    );
};

export default Folder;
