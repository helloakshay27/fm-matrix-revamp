import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material"
import { Button } from "./ui/button"
import { useState } from "react"

const ProjectStatusModal = ({ openDialog, handleCloseDialog, isEditing, record }) => {
    const [formData, setFormData] = useState({
        status: "",
        colorCode: "#FF0000",
    })

    const handleClose = () => {
        setFormData({
            status: "",
            colorCode: "",
        })
        handleCloseDialog()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = () => {

    }

    return (
        <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Organization</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="status"
                    label="Status"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ style: { color: '#000000' } }}
                    InputProps={{
                        style: { backgroundColor: '#fff', borderRadius: '4px' },
                    }}
                />
                <TextField
                    margin="dense"
                    name="colorCode"
                    label="Pick Color"
                    type="color"
                    fullWidth
                    variant="outlined"
                    value={formData.colorCode}
                    onChange={handleChange}
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

export default ProjectStatusModal