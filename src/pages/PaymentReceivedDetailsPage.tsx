import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

// Simple details page for a Payment Received (uses existing theme / tailwind styles)
// We'll load data from API instead of using static mock data
interface PaymentReceived {
    id: number;
    payment_number: number;
    date: string;
    type: string;
    reference_number: string;
    customer_name: string;
    invoice_number: string;
    mode: string;
    amount: number;
    unused_amount: number;
    status: 'PAID' | 'DRAFT' | 'VOID';
    notes?: string;
}

interface LockPaymentAPI {
    id: number;
    payment_number?: string;
    receipt_number?: string;
    order_number?: string;
    payment_of?: string;
    payment_status?: string;
    created_at?: string;
    payment_mode?: string;
    payment_method?: string;
    total_amount?: string;
    paid_amount?: string;
    neft_reference?: string;
    pg_transaction_id?: string;
    payment_gateway?: string;
    bank_name?: string;
    invoice_number?: string;
    notes?: string;
}

const mapLockPayment = (lp: LockPaymentAPI): PaymentReceived => {
    const statusRaw = (lp.payment_status || '').toLowerCase();
    let status: PaymentReceived['status'] = 'DRAFT';
    if (statusRaw === 'paid' || statusRaw === 'success') status = 'PAID';
    else if (statusRaw === 'void' || statusRaw === 'failed') status = 'VOID';

    const date = lp.created_at
        ? new Date(lp.created_at).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
          })
        : '-';

    return {
        id: lp.id,
        payment_number: Number(lp.payment_number || lp.receipt_number || lp.order_number || lp.id),
        date,
        type: lp.payment_of || 'Invoice Payment',
        reference_number: lp.order_number || '',
        customer_name: lp.payment_of || '',
        invoice_number: lp.invoice_number || '',
        mode: lp.payment_mode || lp.payment_method || '',
        amount: parseFloat(lp.paid_amount || lp.total_amount || '0') || 0,
        unused_amount: 0,
        status,
    };
};

export const PaymentReceivedDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
const lock_account_id = localStorage.getItem("lock_account_id");
    const [payment, setPayment] = React.useState<PaymentReceived | null>(null);
    const [sidebarList, setSidebarList] = React.useState<PaymentReceived[]>([]);

    // fetch details
    React.useEffect(() => {
        if (!id) return;
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        axios
            .get(`https://${baseUrl}/lock_payments/${id}.json`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const data: LockPaymentAPI = res.data.lock_payment || res.data || {};
                setPayment(mapLockPayment(data));
            })
            .catch((e) => console.error('Failed to fetch payment detail', e));
    }, [id]);

    // fetch sidebar list of recent received payments
    React.useEffect(() => {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        axios
            .get(`https://${baseUrl}/lock_payments.json`, {
                params: { lock_account_id , 'q[payment_made_eq]': 0, per_page: 20 },
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const list: LockPaymentAPI[] = res.data.lock_payments || res.data || [];
                setSidebarList(list.map(mapLockPayment));
            })
            .catch((e) => console.error('Failed to load sidebar payments', e));
    }, []);

    const selected = payment || sidebarList[0] || null;

    const amountFormatted = selected
        ? `₹${selected.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : '₹0.00';

    const notesText = selected?.notes || '';

    return (
        <div className="p-6">
            <div className="flex gap-6">
                {/* Left sidebar - static for now, clickable items navigate to detail route */}
                <aside className="w-72 bg-white border rounded shadow-sm overflow-auto h-[80vh]">
                    <div className="p-4 border-b">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Paid Payments</h3>
                            <button className="text-sm text-gray-500">+</button>
                        </div>
                    </div>
                    <div>
                        {sidebarList?.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => navigate(`/accounting/payments-received/${item.id}`)}
                                className={`w-full text-left p-4 border-b hover:bg-gray-50 flex items-center justify-between ${String(item.id) === String(selected?.id) ? 'bg-gray-50' : ''}`}
                            >
                                <div>
                                    <div className="font-medium">{item?.customer_name}</div>
                                    {/* <div className="text-xs text-gray-500 mt-1">{item?.payment_number} · {format(new Date(item?.date), 'dd/MM/yyyy')}</div> */}
                                    <div className="text-xs text-green-600 font-semibold mt-1">PAID · {item?.mode}</div>
                                </div>
                                <div className="text-sm font-semibold">₹{item.amount.toLocaleString('en-IN')}</div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" className="p-2" onClick={() => navigate(-1)}>
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <h2 className="text-2xl font-semibold">
                                Payment Received - {selected ? selected.payment_number : '-'}
                            </h2>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm border rounded">
                        {/* Ribbon */}
                        <div className="relative">
                            <div className="absolute -top-3 left-0">
                                <div className="bg-green-500 text-white px-3 py-1 rotate-[-45deg] transform origin-left shadow">Paid</div>
                            </div>
                            <div className="p-10">
                                <div className="grid grid-cols-12 gap-6 items-start">
                                    <div className="col-span-8">
                                        <h3 className="text-xl font-semibold">Lockated</h3>
                                        <div className="text-sm text-gray-500 mt-2">pune Maharashtra 411006<br />India<br />ajay.pihulkar@lockated.com</div>
                                    </div>

                                    <div className="col-span-4 flex justify-end">
                                        <div className="bg-green-500 text-white p-6 rounded shadow text-center">
                                            <div className="text-sm">Amount Received</div>
                                            <div className="text-2xl font-semibold mt-2">{amountFormatted}</div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-6" />

                                <h4 className="text-center text-lg font-semibold mb-6">PAYMENT RECEIPT</h4>

                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-6 space-y-4 text-sm text-gray-600">
                                        <div>
                                            <div className="text-gray-500">Payment Date</div>
                                            <div className="font-semibold">
                                                {/* {selected ? format(new Date(selected?.date), 'dd/MM/yyyy') : '-'} */}
                                            </div>                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Notes</div>
                                            <div className="font-semibold">{notesText || '-'}</div>                                        </div>
                                        <div>
                                            <div className="text-gray-500">Reference Number</div>
                                            <div className="font-semibold">{selected ? selected.reference_number || '-' : '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Payment Mode</div>
                                            <div className="font-semibold">{selected ? selected.mode : '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Amount Received In Words</div>
                                            <div className="font-semibold">{/* Simple placeholder; in real app convert number to words */}
                                                {selected ? `Indian Rupee ${selected.amount} Only` : ''}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-6">
                                        <div className="text-sm text-gray-600">Received From</div>
                                        <div className="mt-2"><a className="text-blue-600 font-medium">{selected ? selected.customer_name : ''}</a></div>
                                        <div className="mt-8 text-gray-400 text-sm text-right">Authorized Signature</div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <div className="text-lg font-semibold mb-3">Payment for</div>
                                    <div className="overflow-x-auto border rounded">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="p-3 text-left">Invoice Number</th>
                                                    <th className="p-3 text-left">Invoice Date</th>
                                                    <th className="p-3 text-right">Invoice Amount</th>
                                                    <th className="p-3 text-right">Payment Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-t">
                                                    <td className="p-3 text-blue-600">{selected?.invoice_number || '—'}</td>
                                                    <td className="p-3">{selected?.invoice_number ? format(new Date(selected.date), 'dd/MM/yyyy') : '—'}</td>
                                                    <td className="p-3 text-right">{amountFormatted}</td>
                                                    <td className="p-3 text-right">{amountFormatted}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="mt-8 border-t pt-6">
                                    <div className="text-lg font-semibold mb-4">More Information</div>
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-6 text-sm text-gray-600">Deposit To: <span className="font-medium text-gray-900">Petty Cash</span></div>
                                        <div className="col-span-6" />
                                    </div>

                                    <div className="mt-6 overflow-x-auto border rounded">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="p-3 text-left">Account</th>
                                                    <th className="p-3 text-right">Debit</th>
                                                    <th className="p-3 text-right">Credit</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-t">
                                                    <td className="p-3">Petty Cash</td>
                                                    <td className="p-3 text-right">{amountFormatted}</td>
                                                    <td className="p-3 text-right">0.00</td>
                                                </tr>
                                                <tr className="border-t">
                                                    <td className="p-3">Accounts Receivable</td>
                                                    <td className="p-3 text-right">0.00</td>
                                                    <td className="p-3 text-right">{amountFormatted}</td>
                                                </tr>
                                                <tr className="border-t font-semibold">
                                                    <td className="p-3">Total</td>
                                                    <td className="p-3 text-right">{amountFormatted}</td>
                                                    <td className="p-3 text-right">{amountFormatted}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PaymentReceivedDetailsPage;
