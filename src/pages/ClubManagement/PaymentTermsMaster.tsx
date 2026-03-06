import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit ,Trash2} from 'lucide-react';	

const columns: ColumnConfig[] = [
	{ key: 'actions', label: 'Action', sortable: false, hideable: false, draggable: false },
	{ key: 'name', label: 'Term Name', sortable: true, hideable: true, draggable: true },
	{ key: 'days', label: 'Number of Days', sortable: true, hideable: true, draggable: true },
];

interface PaymentTerm {
	id?: number;
	name: string;
	days: number | string;
}

const PaymentTermsMaster = () => {
	const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [totalRecords, setTotalRecords] = useState(0);
	const [loading, setLoading] = useState(false);

	// Modal logic (unchanged)
	const [editTerms, setEditTerms] = useState<PaymentTerm[]>([]);
	const [showConfig, setShowConfig] = useState(false);

	useEffect(() => {
		fetchPaymentTerms();
	}, []);

	const fetchPaymentTerms = async () => {
		setLoading(true);
		const baseUrl = localStorage.getItem("baseUrl");
		const token = localStorage.getItem("token");
		try {
			const res = await axios.get(`https://${baseUrl}/payment_terms.json?lock_account_id=1`, {
				headers: {
					Authorization: token ? `Bearer ${token}` : undefined,
					"Content-Type": "application/json",
				},
			});
			if (res && res.data && Array.isArray(res.data)) {
				setPaymentTerms(res.data.map(pt => ({ id: pt.id, name: pt.name, days: pt.no_of_days })));
				setTotalRecords(res.data.length);
				setTotalPages(Math.ceil(res.data.length / perPage));
			}
		} catch (err) {
			setPaymentTerms([]);
		} finally {
			setLoading(false);
		}
	};

	const handleAddNewTerm = () => {
		setEditTerms([...editTerms, { name: "", days: "" }]);
	};

	const handleNewRowChange = (idx, field, value) => {
		setEditTerms(rows => rows.map((row, i) => i === idx ? { ...row, [field]: value } : row));
	};

	const handleRemoveNewRow = (idx) => {
		setEditTerms(rows => rows.filter((_, i) => i !== idx));
	};

	const handleRemovePaymentTerm = async (id, idx) => {
		const baseUrl = localStorage.getItem("baseUrl");
		const token = localStorage.getItem("token");
		try {
			await axios.patch(
				`https://${baseUrl}/payment_terms/${id}.json?lock_account_id=1`,
				{ active: false },
				{
					headers: {
						Authorization: token ? `Bearer ${token}` : undefined,
						"Content-Type": "application/json",
					},
				}
			);
			fetchPaymentTerms();
		} catch (err) {
			alert("Failed to remove payment term");
		}
	};

	const handleSaveTerms = async () => {
		const validEdit = editTerms.filter(row => row.name.trim());
		setEditTerms([]);
		setShowConfig(false);
		const baseUrl = localStorage.getItem("baseUrl");
		const token = localStorage.getItem("token");
		const paymentTermsPayload = validEdit.map(term => ({
			id: term.id ?? null,
			name: term.name,
			no_of_days: term.days || 0,
		}));
		const payload = {
			payment_terms: paymentTermsPayload,
			lock_account_id: 1,
		};
		try {
			await axios.post(
				`https://${baseUrl}/payment_terms.json?lock_account_id=1`,
				payload,
				{
					headers: {
						Authorization: token ? `Bearer ${token}` : undefined,
						"Content-Type": "application/json",
					},
				}
			);
			fetchPaymentTerms();
		} catch (err) {
			alert("Failed to save payment terms");
		}
	};

    // Edit modal state
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [editForm, setEditForm] = useState<PaymentTerm>({ id: 0, name: '', days: '' });
	const [editErrors, setEditErrors] = useState<{ name?: string; days?: string }>({});
	const [editSubmitting, setEditSubmitting] = useState(false);
	const [editLoading, setEditLoading] = useState(false);
	// Open edit modal and fetch by ID
	const handleOpenEdit = async (id?: number) => {
		if (!id) return;
		setEditModalOpen(true);
		setEditLoading(true);
		try {
			const baseUrl = localStorage.getItem('baseUrl');
			const token = localStorage.getItem('token');
			const res = await axios.get(`https://${baseUrl}/payment_terms/${id}.json?lock_account_id=1`, {
				headers: {
					Authorization: token ? `Bearer ${token}` : undefined,
					'Content-Type': 'application/json',
				},
			});
			if (res && res.data) {
				setEditForm({ id: res.data.id, name: res.data.name, days: res.data.no_of_days });
			}
		} catch (err) {
			alert('Failed to load payment term details');
			setEditModalOpen(false);
		} finally {
			setEditLoading(false);
		}
	};

	// Update payment term
	const handleEditPaymentTerm = async () => {
		const errs: { name?: string; days?: string } = {};
		if (!editForm.name.trim()) errs.name = 'Term Name is required';
		if (!editForm.days || Number(editForm.days) < 1) errs.days = 'Number of Days is required';
		if (Object.keys(errs).length > 0) {
			setEditErrors(errs);
			return;
		}
		setEditErrors({});
		setEditSubmitting(true);
		try {
			const baseUrl = localStorage.getItem('baseUrl');
			const token = localStorage.getItem('token');
			await axios.put(
				`https://${baseUrl}/payment_terms/${editForm.id}.json?lock_account_id=1`,
				{
					payment_term: {
						name: editForm.name,
						no_of_days: Number(editForm.days),
					},
				},
				{
					headers: {
						Authorization: token ? `Bearer ${token}` : undefined,
						'Content-Type': 'application/json',
					},
				}
			);
			setEditModalOpen(false);
			fetchPaymentTerms();
		} catch (err) {
			alert('Failed to update payment term');
		} finally {
			setEditSubmitting(false);
		}
	};

	const paginatedTerms = paymentTerms.slice((currentPage - 1) * perPage, currentPage * perPage);

	const renderRow = (term: PaymentTerm) => ({
		actions: (
			<div className="flex items-center gap-2">
				<Button size="icon" variant="ghost" title="Edit" onClick={() => handleOpenEdit(term.id)}>
					<Edit className="w-4 h-4" />
				</Button>
				<Button size="icon" variant="ghost" title="Remove" onClick={() => handleRemovePaymentTerm(term.id)}>
					{/* <span className="text-red-600">Remove</span> */}
                    <Trash2 className="w-4 h-4 text-red-600" />
                                                        
				</Button>
			</div>
		),
		name: <span>{term.name}</span>,
		days: <span>{term.days}</span>,
	});

	return (
		<div className="p-6 space-y-6">
			<header className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Payment Terms </h1>
			</header>

			<EnhancedTaskTable
				data={paginatedTerms}
				columns={columns}
				renderRow={renderRow}
				storageKey="payment-terms-master-dashboard-v1"
				hideTableExport={true}
				hideTableSearch={false}
				enableSearch={true}
				loading={loading}
				leftActions={(
					<Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { setEditTerms([]); setShowConfig(true); }}>
						<Plus className="w-4 h-4 mr-2" /> Add
					</Button>
				)}
			/>

			{totalRecords > 0 && (
				<TicketPagination
					currentPage={currentPage}
					totalPages={totalPages}
					totalRecords={totalRecords}
					perPage={perPage}
					isLoading={loading}
					onPageChange={(page) => setCurrentPage(page)}
					onPerPageChange={(pp) => {
						setPerPage(pp);
						setCurrentPage(1);
						setTotalPages(Math.ceil(totalRecords / pp));
					}}
				/>
			)}

			{/* Edit Modal */}
			<Dialog open={editModalOpen} onOpenChange={(open) => { setEditModalOpen(open); if (!open) setEditErrors({}); }}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Payment Term</DialogTitle>
					</DialogHeader>
					{editLoading ? (
						<div className="flex items-center justify-center py-8">
							<span className="text-sm text-muted-foreground">Loading...</span>
						</div>
					) : (
						<table className="w-full mb-4 text-sm">
							<thead>
								<tr className="bg-gray-100">
									<th className="p-2 border">Term Name</th>
									<th className="p-2 border">Number of Days</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className="border p-2">
										<Input
											className="border rounded px-2 py-1 w-full"
											placeholder="Term Name"
											value={editForm.name}
											onChange={e => { setEditForm((s) => ({ ...s, name: e.target.value })); if (e.target.value.trim()) setEditErrors((s) => ({ ...s, name: undefined })); }}
										/>
										{editErrors.name && <p className="text-xs text-red-500">{editErrors.name}</p>}
									</td>
									<td className="border p-2">
										<Input
											className="border rounded px-2 py-1 w-full"
											placeholder="Days"
											type="number"
											value={editForm.days}
											onChange={e => { setEditForm((s) => ({ ...s, days: e.target.value })); if (Number(e.target.value) > 0) setEditErrors((s) => ({ ...s, days: undefined })); }}
										/>
										{editErrors.days && <p className="text-xs text-red-500">{editErrors.days}</p>}
									</td>
								</tr>
							</tbody>
						</table>
					)}
					<DialogFooter>
						<Button className="bg-[#C72030] hover:bg-[#A01020] text-white px-4 py-2 rounded" onClick={handleEditPaymentTerm} disabled={editSubmitting || editLoading}>
							{editSubmitting ? 'Saving...' : 'Save'}
						</Button>
						<Button className="bg-gray-200 px-4 py-2 rounded" variant="ghost" onClick={() => { setEditModalOpen(false); setEditErrors({}); }} disabled={editSubmitting || editLoading}>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Modal for Add/Edit Payment Terms */}
			{showConfig && (
				<Dialog open={showConfig} onOpenChange={(open) => { setShowConfig(open); if (!open) setEditTerms([]); }}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add Payment Term</DialogTitle>
						</DialogHeader>
						<table className="w-full mb-4 text-sm">
							<thead>
								<tr className="bg-gray-100">
									<th className="p-2 border">Term Name</th>
									<th className="p-2 border">Number of Days</th>
									<th className="p-2 border"></th>
								</tr>
							</thead>
							<tbody>
								{editTerms.map((row, idx) => (
									<tr key={idx}>
										<td className="border p-2">
											<Input
												className="border rounded px-2 py-1 w-full"
												placeholder="Term Name"
												value={row.name}
												onChange={e => handleNewRowChange(idx, "name", e.target.value)}
											/>
										</td>
										<td className="border p-2">
											<Input
												className="border rounded px-2 py-1 w-full"
												placeholder="Days"
												type="number"
												value={row.days}
												onChange={e => handleNewRowChange(idx, "days", e.target.value)}
											/>
										</td>
										<td className="border p-2">
											<Button size="icon" variant="ghost" title="Remove" onClick={() => handleRemoveNewRow(idx)}>
												{/* <span className="text-red-600 text-xs">Remove</span> */}
                                                <Trash2 className="w-4 h-4 text-red-600" />
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<div className="flex gap-2 mb-2">
							<Button className="text-blue-600 text-sm" variant="ghost" onClick={handleAddNewTerm}>+ Add New</Button>
						</div>
						<DialogFooter>
							<Button className="bg-[#C72030] hover:bg-[#A01020] text-white px-4 py-2 rounded" onClick={handleSaveTerms}>Save</Button>
							<Button className="bg-gray-200 px-4 py-2 rounded" variant="ghost" onClick={() => { setEditTerms([]); setShowConfig(false); }}>Cancel</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
};

export default PaymentTermsMaster;
