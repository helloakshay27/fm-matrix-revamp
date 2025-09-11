import { Dialog, DialogTitle, DialogContent, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { Button } from './ui/button';

const RuleCreateForm = ({ id, customerNames, ruleFormData, setRuleFormData, open, onClose, handleSubmit }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                COMPLIMENTARY POINTS
            </DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Customer Name</InputLabel>
                    <Select
                        value={id}
                        label="Customer Name"
                        required
                        disabled
                    >
                        <MenuItem value="Select Customer">Select Customer</MenuItem>
                        {customerNames.map((customer) => (
                            <MenuItem key={customer.id} value={customer.id}>
                                {customer.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Credit Points"
                    type="number"
                    value={ruleFormData.points}
                    onChange={(e) => setRuleFormData({ ...ruleFormData, points: e.target.value })}
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Transaction Notes"
                    value={ruleFormData.transaction_note}
                    onChange={(e) => setRuleFormData({ ...ruleFormData, transaction_note: e.target.value })}
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
    );
};

export default RuleCreateForm;