import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import AttachFile from '@mui/icons-material/AttachFile';
import Delete from '@mui/icons-material/Delete';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { Button } from '@/components/ui/button';
import { API_CONFIG } from '@/config/apiConfig';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router-dom';


const initialRow = { account: '', description: '', contact: '', debit: '', credit: '' };




const ManualJournalAdd = () => {
	const [date, setDate] = useState('');
	 const navigate = useNavigate();
	const [journalNo, setJournalNo] = useState('');
	const [reference, setReference] = useState('');
	const [notes, setNotes] = useState('');
	const [reportingMethod, setReportingMethod] = useState('Accrual and Cash');
	const [currency, setCurrency] = useState('INR- Indian Rupee');
	const [rows, setRows] = useState([{ ...initialRow }, { ...initialRow }]);
	const [attachments, setAttachments] = useState([]);
	const [accountOptions, setAccountOptions] = useState([]);
	const fileInputRef = useRef(null);
	// Fetch account options from API using axios, with baseUrl and token
	useEffect(() => {
		const fetchAccounts = async () => {
			const baseUrl = API_CONFIG.BASE_URL;
			const token = API_CONFIG.TOKEN;
			try {
				const url = `${baseUrl}/lock_accounts/1/lock_account_ledgers.json`;
				const response = await axios.get(url, {
					headers: {
					'Content-Type': 'application/json',
					...(token ? { Authorization: `Bearer ${token}` } : {}),
					// If API expects token as query param, use params: { access_token: token }
				},
				});
				setAccountOptions(response.data);
			} catch (error) {
				console.error('Error fetching account options:', error);
			}
		};
		fetchAccounts();
	}, []);

	// const handleRowChange = (idx, field, value) => {
	// 	setRows(prevRows => prevRows.map((row, i) => {
	// 		if (i !== idx) return row;
	// 		if (field === 'debit') {
	// 			return { ...row, debit: value, credit: value && Number(value) > 0 ? '' : row.credit };
	// 		}
	// 		if (field === 'credit') {
	// 			return { ...row, credit: value, debit: value && Number(value) > 0 ? '' : row.debit };
	// 		}
	// 		return { ...row, [field]: value };
	// 	}));
	// };
	  const handleRowChange = (idx, field, value) => {
        // Prevent negative values for debit/credit
        if ((field === 'debit' || field === 'credit')) {
            let val = value;
            // Remove minus sign if present
            if (typeof val === 'string') {
                val = val.replace(/-/g, '');
            }
            // Prevent negative numbers
            if (Number(val) < 0) val = '';
            // Format to 2 decimal places if not empty and is a number
            if (val !== '' && !isNaN(Number(val))) {
                // Only format if not typing decimal point
                if (!val.endsWith('.')) {
                    val = Number(val).toFixed(2);
                }
            }
            setRows(prevRows => prevRows.map((row, i) => {
                if (i !== idx) return row;
                if (field === 'debit') {
                    return { ...row, debit: val, credit: val && Number(val) > 0 ? '' : row.credit };
                }
                if (field === 'credit') {
                    return { ...row, credit: val, debit: val && Number(val) > 0 ? '' : row.debit };
                }
                return { ...row, [field]: val };
            }));
            return;
        }
        setRows(prevRows => prevRows.map((row, i) => i === idx ? { ...row, [field]: value } : row));
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


	// Helper to build the payload for API
	const buildJournalPayload = () => {
		return {
			lock_account_transaction: {
				transaction_type: 'Journal Entry',
				transaction_date: date,
				voucher_number: journalNo,
				description: notes,
				reference: reference,
				publish: false, // Set true if publishing
				lock_account_id: 1, // You may want to make this dynamic
			},
			lock_account_transaction_records: rows.map(row => {
				const record = {
					ledger_id: row.account ? Number(row.account) : undefined,
					cost_centre_id: 1, // Set as needed or make dynamic
				};
				if (row.debit && Number(row.debit) > 0) record.dr = row.debit;
				if (row.credit && Number(row.credit) > 0) record.cr = row.credit;
				return record;
			}).filter(r => r.ledger_id),
		};
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Required field validation
		if (!date) {
			toast.error('Date is required.');
			return;
		}
		if (!journalNo) {
			toast.error('Journal# is required.');
			return;
		}
		if (!notes) {
			toast.error('Notes are required.');
			return;
		}
		// Validation: Debits and Credits must be equal
		const totalDebit = rows.reduce((sum, r) => sum + Number(r.debit || 0), 0);
		const totalCredit = rows.reduce((sum, r) => sum + Number(r.credit || 0), 0);
		if (totalDebit !== totalCredit) {
			toast.error('Please ensure that the Debits and Credits are equal.');
			return;
		}
		const payload = buildJournalPayload();
		console.log('Payload to send:', payload);
		const baseUrl = API_CONFIG.BASE_URL;
		const token = API_CONFIG.TOKEN;
		try {
			const url = `${baseUrl}/lock_accounts/1/lock_account_transactions.json`;
			const response = await axios.post(url, payload, {
				headers: {
					'Content-Type': 'application/json',
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
			});
			console.log('API response:', response.data);
			 navigate('/accounting/manual-journal');
			// Optionally show success message or redirect
		} catch (error) {
			console.error('Error submitting journal entry:', error);
			toast.error('Failed to create journal entry');
			// Optionally show error message
		}
	};

		return (
			<div className="w-full min-h-screen bg-gray-50 p-0 m-0">
				<div className="w-full max-w-full px-8 py-8 mx-auto">
					<h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">New Journal</h2>
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<TextField
								label={<span>Date<span style={{ color: '#C72030' }}>*</span></span>}
								type="date"
								value={date}
								onChange={e => setDate(e.target.value)}
								variant="outlined"
								// required
								InputLabelProps={{ shrink: true }}
								className="w-full"
							/>
							<TextField
								label={<span>Journal#<span style={{ color: '#C72030' }}>*</span></span>}
								type="number"
								value={journalNo}
								onChange={e => {
									let val = e.target.value.replace(/-/g, '');
									if (Number(val) < 0) val = '';
									if (val !== '' && !isNaN(Number(val))) {
										if (!val.endsWith('.')) {
											val = Number(val).toFixed(2);
										}
									}
									setJournalNo(val);
								}}
								variant="outlined"
								className="w-full"
								inputProps={{ min: 0, step: '0.01', onKeyDown: (e) => { if (e.key === '-') e.preventDefault(); } }}
							/>
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
												<td className="border border-gray-300 px-4 py-3" style={{ minWidth: 250, maxWidth: 300, width: 200 }}>
													<FormControl size="small" fullWidth sx={{ minWidth: 250, maxWidth: 300, width: 200 }}>
														<Select
															value={row.account}
															displayEmpty
															onChange={e => handleRowChange(idx, 'account', e.target.value)}
															inputProps={{ 'aria-label': 'Select Account' }}
															MenuProps={{
																PaperProps: {
																	sx: {
																		minWidth: 250,
																		maxWidth: 300,
																		width: 200,
																		// overflowX: 'auto',
																		// whiteSpace: 'nowrap',
																	},
																},
															}}
														>
															<MenuItem value=""><em>Select an account</em></MenuItem>
															{accountOptions.map(option => (
																<MenuItem 
																	key={option.id} 
																	value={option.id} 
																	sx={{ minWidth: 180, maxWidth: 240, width: 200 }}
																	title={option.formatted_name || option.name}
																>
																	{option.formatted_name}
																</MenuItem>
															))}
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
														// inputProps={{ min: 0 }}
													inputProps={{ min: 0, step: '0.01', onKeyDown: (e) => { if (e.key === '-') e.preventDefault(); } }}
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
														// inputProps={{ min: 0 }}
														inputProps={{ min: 0, step: '0.01', onKeyDown: (e) => { if (e.key === '-') e.preventDefault(); } }}
													/>
												</td>
												<td className="border border-gray-300 px-4 py-3">
													{rows.length > 2 && (
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
						<Box
							sx={{
								bgcolor: "white",
								borderRadius: 2,
								p: 4,
								mb: 3,
								boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
							}}


						>
							<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
								{/* <Box
									sx={{
										width: 32,
										height: 32,
										borderRadius: "50%",
										bgcolor: "#dc2626",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "white",
										fontSize: "16px",
										fontWeight: "bold",
									}}
								>
									3
								</Box> */}
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
						</Box>
						<div className="flex gap-3 pt-4 justify-center">
							
							<Button
								type="submit"
								className="bg-[#C72030] hover:bg-[#A01020] text-white min-w-[140px]"
							>
								Save and Publish
							</Button>
							<Button
								variant="outline"
								type="button"
								className="min-w-[120px]"
								// onClick={handleSaveDraft} // Add your draft handler if needed
							>
								Save as Draft
							</Button>
							<Button
								variant="outline"
								type="button"
								onClick={() => window.history.back()}
								className="min-w-[100px]"
							>
								Cancel
							</Button>
						</div>
					</form>
				</div>
			</div>
		);
};

export default ManualJournalAdd;
