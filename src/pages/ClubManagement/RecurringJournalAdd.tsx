import React, { useState, useRef } from 'react';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import Card from '@mui/material/Card';
// import CardMedia from '@mui/material/CardMedia';
import AttachFile from '@mui/icons-material/AttachFile';
import Delete from '@mui/icons-material/Delete';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import TextField from '@mui/material/TextField';
// import InputLabel from '@mui/material/InputLabel';
import { Button } from '@/components/ui/button';
import { TextField, Select, MenuItem, FormControl, FormControlLabel, Checkbox, Box, Typography, IconButton, Card, CardMedia, InputLabel } from '@mui/material';

const initialRow = { account: '', description: '', contact: '', debit: '', credit: '' };


const RecurringJournalAdd = () => {
    const [date, setDate] = useState('');
    const [journalNo, setJournalNo] = useState('');
    const [reference, setReference] = useState('');
    const [notes, setNotes] = useState('');
    const [reportingMethod, setReportingMethod] = useState('Accrual and Cash');
    const [currency, setCurrency] = useState('INR- Indian Rupee');
    const [rows, setRows] = useState([{ ...initialRow }]);
    const [attachments, setAttachments] = useState([]);
    const [profileName, setProfileName] = useState("");
    const [repeatEvery, setRepeatEvery] = useState("Week");
    const [startsOn, setStartsOn] = useState("");
    const [endsOn, setEndsOn] = useState("");
    const [neverExpires, setNeverExpires] = useState(false);
    const fileInputRef = useRef(null);

    const handleRowChange = (idx, field, value) => {
        const updated = rows.map((row, i) => i === idx ? { ...row, [field]: value } : row);
        setRows(updated);
    };

    const addRow = () => setRows([...rows, { ...initialRow }]);
    const removeRow = (idx) => setRows(rows.filter((_, i) => i !== idx));

    const handleFileChange = (e) => {
        setAttachments(Array.from(e.target.files));
    };

    const handleFileUpload = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleRemoveFile = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit logic here
    };

        return (
            <div className="w-full min-h-screen bg-gray-50 p-0 m-0">
                <div className="w-full max-w-full px-8 py-8 mx-auto">
                    <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">New Recurring Journal</h2>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextField
                                label={<span>Profile Name<span style={{ color: '#C72030' }}>*</span></span>}
                                value={profileName}
                                onChange={e => setProfileName(e.target.value)}
                                variant="outlined"
                                // required
                                className="w-full"
                            />
                            <FormControl fullWidth >
                                <InputLabel>Repeat Every<span style={{ color: '#C72030' }}>*</span></InputLabel>
                                <Select
                                    value={repeatEvery}
                                    label="Repeat Every"
                                    onChange={e => setRepeatEvery(e.target.value)}
                                >
                                    <MenuItem value="Week">Week</MenuItem>
                                    <MenuItem value="Month">Month</MenuItem>
                                    <MenuItem value="Year">Year</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label={<span>Starts<span style={{ color: '#C72030' }}>*</span></span>}
                                type="date"
                                value={startsOn}
                                onChange={e => setStartsOn(e.target.value)}
                                variant="outlined"
                                // required
                                InputLabelProps={{ shrink: true }}
                                className="w-full"
                            />
                            <div className="flex items-center gap-4">
                                <TextField
                                    label="Ends On"
                                    type="date"
                                    value={endsOn}
                                    onChange={e => setEndsOn(e.target.value)}
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    className="w-full"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={neverExpires}
                                            onChange={e => setNeverExpires(e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Never Expires"
                                />
                            </div>
                            <TextField
                                label="Reference#"
                                value={reference}
                                onChange={e => setReference(e.target.value)}
                                variant="outlined"
                                className="w-full"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextField
                                label={<span>Notes<span style={{ color: '#C72030' }}>*</span></span>}
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ maxLength: 500 }}
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
                                helperText={<span style={{ textAlign: 'right', display: 'block' }}>{`${notes.length}/500 characters`}</span>}
                                error={notes.length > 500}
                            />
                        </div>

                       
                        <div>
                            <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Reporting Method</label>
                            <div className="flex gap-6">
                                {['Accrual and Cash', 'Accrual Only', 'Cash Only'].map(method => (
                                    <label key={method} className="flex items-center gap-1">
                                        <input type="radio" name="reportingMethod" value={method} checked={reportingMethod === method} onChange={() => setReportingMethod(method)} className="accent-[#C72030]" />
                                        <span>{method}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Currency</label>
                            <FormControl size="small" sx={{ mt: 2, width: 400 }}>
                                <Select
                                    value={currency}
                                    displayEmpty
                                    onChange={e => setCurrency(e.target.value)}
                                    inputProps={{ 'aria-label': 'Select Currency' }}
                                >
                                    <MenuItem value="INR- Indian Rupee">INR- Indian Rupee</MenuItem>
                                    {/* Add more currencies as needed */}
                                    <MenuItem value="USD- US Dollar">USD- US Dollar</MenuItem>
                                    <MenuItem value="EUR- Euro">EUR- Euro</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            {/* <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Journal Entries</label> */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300 rounded-lg">
                                    <thead>
                                        <tr className="bg-[#E5E0D3]">
                                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Account</th>
                                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Description</th>
                                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Contact (INR)</th>
                                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Debits</th>
                                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Credits</th>
                                            <th className="border border-gray-300 px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="border border-gray-300 px-4 py-3">
                                                    <FormControl size="small" fullWidth>
                                                        <Select
                                                            value={row.account}
                                                            displayEmpty
                                                            onChange={e => handleRowChange(idx, 'account', e.target.value)}
                                                            inputProps={{ 'aria-label': 'Select Account' }}
                                                        >
                                                            <MenuItem value=""><em>Select an account</em></MenuItem>
                                                            {/* Replace with your account options */}
                                                            <MenuItem value="Account1">Account 1</MenuItem>
                                                            <MenuItem value="Account2">Account 2</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3">
                                                    <TextField
                                                        size="small"
                                                        variant="outlined"
                                                        value={row.description}
                                                        onChange={e => handleRowChange(idx, 'description', e.target.value)}
                                                        className="w-full"
                                                        placeholder="Description"
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3">
                                                    <FormControl size="small" fullWidth>
                                                        <Select
                                                            value={row.contact}
                                                            displayEmpty
                                                            onChange={e => handleRowChange(idx, 'contact', e.target.value)}
                                                            inputProps={{ 'aria-label': 'Select Contact' }}
                                                        >
                                                            <MenuItem value=""><em>Select Contact</em></MenuItem>
                                                            {/* Replace with your contact options */}
                                                            <MenuItem value="Contact1">Contact 1</MenuItem>
                                                            <MenuItem value="Contact2">Contact 2</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3">
                                                    <TextField
                                                        size="small"
                                                        variant="outlined"
                                                        type="number"
                                                        value={row.debit}
                                                        onChange={e => handleRowChange(idx, 'debit', e.target.value)}
                                                        className="w-full"
                                                        placeholder="Debit"
                                                        inputProps={{ min: 0 }}
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3">
                                                    <TextField
                                                        size="small"
                                                        variant="outlined"
                                                        type="number"
                                                        value={row.credit}
                                                        onChange={e => handleRowChange(idx, 'credit', e.target.value)}
                                                        className="w-full"
                                                        placeholder="Credit"
                                                        inputProps={{ min: 0 }}
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3">
                                                    {rows.length > 1 && (
                                                        <button type="button" className="text-red-500" onClick={() => removeRow(idx)}>✕</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <Button
                                    type="button"
                                    className="bg-[#C72030] hover:bg-[#A01020] text-white min-w-[140px] mt-2"
                                    onClick={addRow}
                                >
                                    Add New Row
                                </Button>

                                {/* Calculation Summary Box */}
                                <div className="flex justify-end mt-6">
                                    <div className="bg-white rounded-lg shadow p-6 min-w-[320px] max-w-[500px] w-[500px]">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-medium text-gray-700">Sub Total</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="font-semibold text-lg">Total (₹)</span>
                                            <span className="font-semibold text-lg">{rows.reduce((sum, r) => sum + Number(r.debit || 0), 0).toFixed(2)}&nbsp;&nbsp;{rows.reduce((sum, r) => sum + Number(r.credit || 0), 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-500">Debits</span>
                                            <span className="text-gray-700">{rows.reduce((sum, r) => sum + Number(r.debit || 0), 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-500">Credits</span>
                                            <span className="text-gray-700">{rows.reduce((sum, r) => sum + Number(r.credit || 0), 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between mt-4">
                                            <span className="font-medium text-gray-700">Difference</span>
                                            <span className="font-semibold text-red-500">{(rows.reduce((sum, r) => sum + Number(r.debit || 0), 0) - rows.reduce((sum, r) => sum + Number(r.credit || 0), 0)).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <Box
                            sx={{
                                bgcolor: "white",
                                borderRadius: 2,
                                p: 4,
                                mb: 3,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>

                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: "bold", textTransform: "uppercase", color: "black" }}
                                >
                                    Attachments
                                </Typography>
                            </Box>

                            <Box
                                onClick={handleFileUpload}
                                sx={{
                                    border: "2px dashed #ccc",
                                    borderRadius: 2,
                                    p: 4,
                                    textAlign: "center",
                                    cursor: "pointer",
                                    "&:hover": { borderColor: "#999" },
                                }}
                            >
                                <AttachFile sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
                                <Typography variant="body2" color="text.secondary">
                                    Choose files | {attachments.length > 0 ? `${attachments.length} file(s) chosen` : "No file chosen"}
                                </Typography>
                            </Box>

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                hidden
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />

                            {attachments.length > 0 && (
                                <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 2 }}>
                                    {attachments.map((file, index) => (
                                        <Card
                                            key={index}
                                            sx={{
                                                width: 150,
                                                position: "relative",
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                height="100"
                                                image={URL.createObjectURL(file)}
                                                alt={file.name}
                                                sx={{ objectFit: "cover" }}
                                            />
                                            <IconButton
                                                sx={{
                                                    position: "absolute",
                                                    top: 5,
                                                    right: 5,
                                                    bgcolor: "rgba(255,255,255,0.7)",
                                                    "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                                                }}
                                                onClick={() => handleRemoveFile(index)}
                                            >
                                                <Delete color="error" />
                                            </IconButton>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    display: "block",
                                                    textAlign: "center",
                                                    p: 1,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {file.name}
                                            </Typography>
                                        </Card>
                                    ))}
                                </Box>
                            )}
                        </Box> */}
                        <div className="flex gap-3 pt-4 justify-center">
                            <Button
                                type="submit"
                                className="bg-[#C72030] hover:bg-[#A01020] text-white min-w-[140px]"
                            >
                                Save 
                            </Button>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => window.history.back()}
                                className="min-w-[100px]"
                            >
                                Cancel
                            </Button>
                            
                            {/* <Button
                                variant="outline"
                                type="button"
                                className="min-w-[120px]"
                                // onClick={handleSaveDraft} // Add your draft handler if needed
                            >
                                Save as Draft
                            </Button> */}
                        </div>
                    </form>
                </div>
            </div>
        );
};

export default RecurringJournalAdd;
