import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material"
import { useState } from "react"
import { Button } from "./ui/button"

const ProjectTypeModal = ({ openDialog, handleCloseDialog }) => {
    const [type, setType] = useState("")

    const handleSubmit = () => {
        handleCloseDialog()
        setType("")
    }

    const handleClose = () => {
        handleCloseDialog()
        setType("")
    }

    return (
        <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Project Type</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="type"
                    label="New Project Type"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{
                        style: { backgroundColor: '#fff', borderRadius: '4px' },
                    }}
                />
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

export default ProjectTypeModal