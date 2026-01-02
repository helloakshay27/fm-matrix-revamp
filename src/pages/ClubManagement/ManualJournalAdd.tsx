import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const initialRow = { account: '', description: '', contact: '', debit: '', credit: '' };

const ManualJournalAdd = () => {
	const [date, setDate] = useState('');
	const [journalNo, setJournalNo] = useState('');
	const [reference, setReference] = useState('');
	const [notes, setNotes] = useState('');
	const [reportingMethod, setReportingMethod] = useState('Accrual and Cash');
	const [currency, setCurrency] = useState('INR- Indian Rupee');
	const [rows, setRows] = useState([{ ...initialRow }]);
	const [attachments, setAttachments] = useState([]);

	const handleRowChange = (idx, field, value) => {
		const updated = rows.map((row, i) => i === idx ? { ...row, [field]: value } : row);
		setRows(updated);
	};

	const addRow = () => setRows([...rows, { ...initialRow }]);
	const removeRow = (idx) => setRows(rows.filter((_, i) => i !== idx));

	const handleFileChange = (e) => {
		setAttachments([...e.target.files]);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Submit logic here
	};

		return (
			<div className="w-full min-h-screen bg-gray-50 p-0 m-0">
				<div className="w-full max-w-full px-8 py-8 mx-auto">
					<h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">New Journal</h2>
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-[#1a1a1a] mb-1">Date<span className="text-red-500">*</span></label>
								<input type="date" className="w-full px-3 py-2 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]" value={date} onChange={e => setDate(e.target.value)} required />
							</div>
							<div>
								<label className="block text-sm font-medium text-[#1a1a1a] mb-1">Journal#<span className="text-red-500">*</span></label>
								<input type="number" className="w-full px-3 py-2 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]" value={journalNo} onChange={e => setJournalNo(e.target.value)} required />
							</div>
							<div>
								<label className="block text-sm font-medium text-[#1a1a1a] mb-1">Reference#</label>
								<input type="text" className="w-full px-3 py-2 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]" value={reference} onChange={e => setReference(e.target.value)} />
							</div>
							<div>
								<label className="block text-sm font-medium text-[#1a1a1a] mb-1">Notes</label>
								<textarea className="w-full px-3 py-2 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]" maxLength={500} value={notes} onChange={e => setNotes(e.target.value)} />
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-[#1a1a1a] mb-1">Reporting Method</label>
							<div className="flex gap-6">
								{['Accrual and Cash', 'Accrual Only', 'Cash Only'].map(method => (
									<label key={method} className="flex items-center gap-1">
										<input type="radio" name="reportingMethod" value={method} checked={reportingMethod === method} onChange={() => setReportingMethod(method)} />
										{method}
									</label>
								))}
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-[#1a1a1a] mb-1">Currency</label>
							<select className="w-full px-3 py-2 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]" value={currency} onChange={e => setCurrency(e.target.value)}>
								<option>INR- Indian Rupee</option>
								{/* Add more currencies as needed */}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-[#1a1a1a] mb-1">Journal Entries</label>
							<div className="overflow-x-auto">
								<table className="min-w-full border border-[#D5DbDB] rounded-lg">
									<thead className="bg-gray-100">
										<tr>
											<th className="px-2 py-1 text-left text-xs font-medium text-gray-700">Account</th>
											<th className="px-2 py-1 text-left text-xs font-medium text-gray-700">Description</th>
											<th className="px-2 py-1 text-left text-xs font-medium text-gray-700">Contact (INR)</th>
											<th className="px-2 py-1 text-left text-xs font-medium text-gray-700">Debits</th>
											<th className="px-2 py-1 text-left text-xs font-medium text-gray-700">Credits</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										{rows.map((row, idx) => (
											<tr key={idx}>
												<td className="px-2 py-1"><input type="text" className="w-full border border-[#D5DbDB] rounded-lg px-2 py-1" value={row.account} onChange={e => handleRowChange(idx, 'account', e.target.value)} placeholder="Select an account" /></td>
												<td className="px-2 py-1"><input type="text" className="w-full border border-[#D5DbDB] rounded-lg px-2 py-1" value={row.description} onChange={e => handleRowChange(idx, 'description', e.target.value)} placeholder="Description" /></td>
												<td className="px-2 py-1"><input type="text" className="w-full border border-[#D5DbDB] rounded-lg px-2 py-1" value={row.contact} onChange={e => handleRowChange(idx, 'contact', e.target.value)} placeholder="Select Contact" /></td>
												<td className="px-2 py-1"><input type="number" className="w-full border border-[#D5DbDB] rounded-lg px-2 py-1" value={row.debit} onChange={e => handleRowChange(idx, 'debit', e.target.value)} /></td>
												<td className="px-2 py-1"><input type="number" className="w-full border border-[#D5DbDB] rounded-lg px-2 py-1" value={row.credit} onChange={e => handleRowChange(idx, 'credit', e.target.value)} /></td>
												<td className="px-2 py-1">
													{rows.length > 1 && (
														<button type="button" className="text-red-500" onClick={() => removeRow(idx)}>✕</button>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
								<button type="button" className="mt-2 px-3 py-1 border border-[#D5DbDB] rounded-lg text-[#1a1a1a] hover:bg-[#f6f4ee]" onClick={addRow}>Add New Row</button>
							</div>
						</div>
						<div className="flex flex-col md:flex-row md:items-center gap-4">
							<div className="flex-1">
								<label className="block text-sm font-medium text-[#1a1a1a] mb-1">Attachments</label>
								<input type="file" multiple onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#f6f4ee] file:text-[#1a1a1a] hover:file:bg-[#e5e7eb]" />
								<div className="text-xs text-gray-400 mt-1">You can upload a maximum of 5 files, 10MB each</div>
							</div>
						</div>
						<div className="flex gap-3 pt-4 justify-end">
							<Button
								variant="outline"
								type="button"
								onClick={() => window.history.back()}
								className="min-w-[100px]"
							>
								Cancel
							</Button>
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
						</div>
					</form>
				</div>
			</div>
		);
};

export default ManualJournalAdd;
