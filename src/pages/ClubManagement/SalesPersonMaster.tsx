import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_CONFIG } from '@/config/apiConfig';
import { toast } from 'sonner';

interface SalesPerson {
    id: number;
    name: string;
    email: string;
    active: boolean;
    lock_account_id: number;
}

const columns: ColumnConfig[] = [
    { key: 'actions', label: 'Action', sortable: false, hideable: false, draggable: false },
    { key: 'name', label: 'Salesperson Name', sortable: true, hideable: true, draggable: true },
    { key: 'email', label: 'Email', sortable: true, hideable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true },
];

const getFullUrl = (endpoint: string) => {
    const baseUrl = API_CONFIG.BASE_URL?.replace(/\/$/, '') || '';
    return `${baseUrl}${endpoint}`;
};

const getAuthOptions = (
    method: 'GET' | 'POST' | 'PATCH' = 'GET',
    body?: Record<string, unknown>
): RequestInit => {
    const token = API_CONFIG.TOKEN;

    return {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        ...(body && { body: JSON.stringify(body) }),
    };
};

export const SalesPersonMaster: React.FC = () => {
    const [salesPersons, setSalesPersons] = useState<SalesPerson[]>([]);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        id: 0,
        name: '',
        email: '',
        active: true,
    });

    const [submitting, setSubmitting] = useState(false);
	 const lock_account_id = localStorage.getItem("lock_account_id");
    const LOCK_ACCOUNT_ID = 1; // Hardcoded as per requirement

    // ================= FETCH LIST =================
    const fetchSalesPersons = useCallback(async () => {
        setLoading(true);
        try {
            const url = getFullUrl(
                `/sales_persons.json?lock_account_id=${lock_account_id}`
            );

            const response = await fetch(url, getAuthOptions('GET'));

            if (!response.ok) throw new Error('Failed to fetch');

            const data = await response.json();

            setSalesPersons(data);
            setTotalRecords(data.length);
        } catch (error) {
            toast.error('Failed to load sales persons');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSalesPersons();
    }, [fetchSalesPersons]);

    // ================= ADD =================
    const validateForm = () => {
        const nameRegex = /^[A-Za-z\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) {
            toast.error("Name is required");
            return false;
        }

        if (!nameRegex.test(formData.name)) {
            toast.error("Name field should accept alphabet characters only.");
            return false;
        }

        if (!formData.email.trim()) {
            toast.error("Email is required");
            return false;
        }

        if (!emailRegex.test(formData.email)) {
            toast.error("Invalid email format . Example: name@example.com");
            return false;
        }

        return true;
    };
    const handleAdd = async () => {
        // if (!formData.name.trim() || !formData.email.trim()) {
        //     toast.error('Name and Email are required');
        //     return;
        // }

        if (!validateForm()) return;
        setSubmitting(true);

        try {
            const url = getFullUrl('/sales_persons.json?lock_account_id=${lock_account_id}');

            const response = await fetch(
                url,
                getAuthOptions('POST', {
                    sales_person: {
                        name: formData.name,
                        email: formData.email,
                        lock_account_id: lock_account_id,
                    },
                })
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                throw new Error('Failed to add');
            }

            toast.success('Salesperson added successfully');

            setAddModalOpen(false);
            setFormData({ id: 0, name: '', email: '', active: true });

            fetchSalesPersons();
        } catch (error) {
            toast.error('Failed to add salesperson');
        } finally {
            setSubmitting(false);
        }
    };

    // ================= EDIT =================
    const handleUpdate = async () => {
        // if (!formData.name.trim() || !formData.email.trim()) {
        //     toast.error('Name and Email are required');
        //     return;
        // }

        if (!validateForm()) return;

        setSubmitting(true);

        try {
            const url = getFullUrl(`/sales_persons/${formData.id}.json?lock_account_id=${lock_account_id}`);

            const response = await fetch(
                url,
                getAuthOptions('PATCH', {
                    sales_person: {
                        name: formData.name,
                        email: formData.email,
                        active: formData.active,
                    },
                })
            );

            if (!response.ok) throw new Error('Failed to update');

            toast.success('Salesperson updated successfully');
            setEditModalOpen(false);
            fetchSalesPersons();
        } catch (error) {
            toast.error('Failed to update salesperson');
        } finally {
            setSubmitting(false);
        }
    };

    // ================= TOGGLE ACTIVE =================
    // const handleToggleStatus = async (sp: SalesPerson) => {
    //     try {
    //         const url = getFullUrl(`/sales_persons/${sp.id}.json?lock_account_id=1`);

    //         await fetch(
    //             url,
    //             getAuthOptions('PATCH', {
    //                 sales_person: { active: !sp.active },
    //             })
    //         );

    //         toast.success('Status updated');
    //         fetchSalesPersons();
    //     } catch {
    //         toast.error('Failed to update status');
    //     }
    // };
    const handleToggleStatus = async (sp: SalesPerson) => {
        try {
            const url = getFullUrl(`/sales_persons/${sp.id}.json?lock_account_id=${lock_account_id}`);

            await fetch(
                url,
                getAuthOptions('PATCH', {
                    sales_person: { active: !sp.active },
                })
            );

            toast.success('Status updated successfully');
            fetchSalesPersons();
        } catch {
            toast.error('Failed to update status');
        }
    };
    // ================= RENDER ROW =================
    const renderRow = (sp: SalesPerson) => ({
        actions: (
            <div className="flex items-center gap-2">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                        setFormData(sp);
                        setEditModalOpen(true);
                    }}
                >
                    <Edit className="w-4 h-4" />
                </Button>

                {/* <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleToggleStatus(sp)}
                >
                    <Trash2
                        className={`w-4 h-4 ${sp.active ? 'text-red-500' : 'text-green-600'
                            }`}
                    />
                </Button> */}

                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(sp)}
                >
                    <Trash2 className="w-4 h-4 text-red-500" />
                </Button>

            </div>
        ),
        name: <span>{sp.name}</span>,
        email: <span>{sp.email}</span>,
        // status: (
        //     <span
        //         className={`px-2 py-1 rounded text-xs font-medium ${sp.active
        //             ? 'bg-green-100 text-green-700'
        //             : 'bg-red-100 text-red-700'
        //             }`}
        //     >
        //         {sp.active ? 'Active' : 'Inactive'}
        //     </span>
        // ),

        status: (
            <div className="flex items-center justify-center">
                <div
                    className={`relative inline-flex items-center h-6 w-11 rounded-full cursor-pointer transition-colors ${sp.active ? "bg-green-500" : "bg-gray-300"
                        }`}
                    onClick={() => handleToggleStatus(sp)}
                >
                    <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${sp.active ? "translate-x-6" : "translate-x-1"
                            }`}
                    />
                </div>
            </div>
        ),
    });


    const handleDelete = async (sp: SalesPerson) => {
        try {
            const url = getFullUrl(`/sales_persons/${sp.id}.json?lock_account_id=${lock_account_id}`);

            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${API_CONFIG.TOKEN}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Delete failed");

            toast.success("Salesperson deleted successfully");

            fetchSalesPersons();
        } catch {
            toast.error("Failed to delete salesperson");
        }
    };


    return (
        <div className="p-6 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">
                    Sales Person
                </h1>
            </header>

            <EnhancedTaskTable
                data={salesPersons}
                columns={columns}
                renderRow={renderRow}
                storageKey="sales-person-master-dashboard-v1"
                hideTableExport
                enableSearch
                loading={loading}
                leftActions={
                    <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        // onClick={() => setAddModalOpen(true)}
                        onClick={() => {
                            setFormData({
                                id: 0,
                                name: "",
                                email: "",
                                active: true,
                            });
                            setAddModalOpen(true);
                        }}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                }
            />

            {/* Add Modal */}
            <Dialog open={addModalOpen}
                // onOpenChange={setAddModalOpen}
                onOpenChange={(open) => {
                    setAddModalOpen(open);
                    if (!open) {
                        setFormData({
                            id: 0,
                            name: "",
                            email: "",
                            active: true,
                        });
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Salesperson</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Name <span className="text-red-500">*</span></Label>
                            <Input
                                value={formData.name}
                                // onChange={(e) =>
                                //     setFormData((s) => ({ ...s, name: e.target.value }))
                                // }

                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[A-Za-z\s]*$/.test(value)) {
                                        setFormData((s) => ({ ...s, name: value }));
                                    }
                                }}

                            />
                        </div>

                        <div>
                            <Label>Email <span className="text-red-500">*</span></Label>
                            <Input
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData((s) => ({ ...s, email: e.target.value }))
                                }
                            />
                        </div>
                    </div>

                    <div className="flex justify-center mt-4 gap-3">
                        <Button onClick={handleAdd} disabled={submitting}>
                            {submitting ? 'Adding...' : 'Add'}
                        </Button>
                        <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Salesperson</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Name <span className="text-red-500">*</span></Label>
                            <Input
                                value={formData.name}
                                // onChange={(e) =>
                                //     setFormData((s) => ({ ...s, name: e.target.value }))
                                // }

                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^[A-Za-z\s]*$/.test(value)) {
                                        setFormData((s) => ({ ...s, name: value }));
                                    }
                                }}

                            />
                        </div>

                        <div>
                            <Label>Email <span className="text-red-500">*</span></Label>
                            <Input
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData((s) => ({ ...s, email: e.target.value }))
                                }
                            />
                        </div>
                    </div>

                    <div className="flex justify-center mt-4 gap-3">
                        <Button onClick={handleUpdate} disabled={submitting}>
                            {submitting ? 'Updating...' : 'Update'}
                        </Button>
                        <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SalesPersonMaster;
