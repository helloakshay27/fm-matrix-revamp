import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { Button } from "./ui/button"

const DebitCreditModal = ({ openDebitCreditModal, handleCloseDebitCreditModal, debitCreditForm, handleDebitCreditChange, handleSubmitDebitCredit, options }) => {
    return (
        <Dialog
      PaperProps={{ sx: { borderRadius: "8px" } }}
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
            <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1.5, justifyContent: "flex-end", "& > :not(style) ~ :not(style)": { ml: 0 } }}>
                <Button
                  onClick={handleCloseDebitCreditModal}
                  variant="outline"
                  className="h-[42px] sm:h-[42px] px-[22px] text-[13px] font-semibold rounded-[8px]"
                >
                  Close
                </Button>
                <Button
                  onClick={handleSubmitDebitCredit}
                  className="fm-action-primary"
                >
                  Submit
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DebitCreditModal