import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { Button } from "./ui/button"

const DebitCreditModal = ({ openDebitCreditModal, handleCloseDebitCreditModal, debitCreditForm, handleDebitCreditChange, handleSubmitDebitCredit, options }) => {
    return (
        <Dialog
            open={openDebitCreditModal}
            onClose={handleCloseDebitCreditModal}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Debit/Credit Notes</DialogTitle>
            <DialogContent>
                <FormControl
                    fullWidth
                    variant="outlined"
                    sx={{
                        my: 1,
                    }}
                >
                    <InputLabel shrink>Select Type</InputLabel>
                    <Select
                        label="Select Type"
                        value={debitCreditForm.type}
                        onChange={handleDebitCreditChange}
                        displayEmpty
                        name="type"
                        sx={{
                            height: {
                                xs: 28,
                                sm: 36,
                                md: 45,
                            },
                            "& .MuiInputBase-input, & .MuiSelect-select": {
                                padding: {
                                    xs: "8px",
                                    sm: "10px",
                                    md: "12px",
                                },
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>Select Type</em>
                        </MenuItem>
                        {
                            options.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <TextField
                    margin="dense"
                    name="amount"
                    label="Amount"
                    type="number"
                    fullWidth
                    value={debitCreditForm.amount}
                    onChange={handleDebitCreditChange}
                />
                <TextField
                    margin="dense"
                    name="description"
                    label="Description"
                    type="text"
                    fullWidth
                    value={debitCreditForm.description}
                    onChange={handleDebitCreditChange}
                    multiline
                    rows={2}
                    sx={{
                        mt: 1,
                        "& .MuiOutlinedInput-root": {
                            height: "auto !important",
                            padding: "2px !important",
                            display: "flex",
                        },
                        "& .MuiInputBase-input[aria-hidden='true']": {
                            flex: 0,
                            width: 0,
                            height: 0,
                            padding: "0 !important",
                            margin: 0,
                            display: "none",
                        },
                        "& .MuiInputBase-input": {
                            resize: "none !important",
                        },
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDebitCreditModal}>Close</Button>
                <Button
                    onClick={handleSubmitDebitCredit}
                    style={{ backgroundColor: "#6B46C1", color: "white" }}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DebitCreditModal