import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
} from '@mui/material';
import { useState } from 'react';
import { Button } from './ui/button';

const TopupModal = ({ open, onClose }) => {
    const [customer, setCustomer] = useState('');
    const [creditPoints, setCreditPoints] = useState('');
    const [notes, setNotes] = useState('');
    const [recurring, setRecurring] = useState(false);

    const handleSubmit = () => {
        // Handle form submission logic here
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Top-Up Wallet</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Customer Name</InputLabel>
                    <Select
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        label="Customer Name"
                        required
                    >
                        <MenuItem value="Select Customer">Select Customer</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Credit Points"
                    type="number"
                    value={creditPoints}
                    onChange={(e) => setCreditPoints(e.target.value)}
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Transaction Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    multiline
                    rows={2}
                    sx={{
                        mt: 1,
                        "& .MuiOutlinedInput-root": {
                            height: "auto !important",
                            padding: "2px !important",
                        },
                    }}
                />
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}>
                    <Switch
                        checked={recurring}
                        onChange={(e) => setRecurring(e.target.checked)}
                        color="primary"
                    />
                    <span>Active Recurring Points : {recurring ? 1 : 0}</span>
                </div>
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <Button
                        onClick={handleSubmit}
                        style={{ backgroundColor: '#C72030' }}
                        className="text-white hover:bg-[#C72030]/90 flex-1"
                    >
                        Submit
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1 border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
                    >
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default TopupModal