import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

// Simple details page for a Payment Received (uses existing theme / tailwind styles)
const mockData = [
    { id: 6, payment_number: 6, date: '2026-02-03', type: 'Invoice Payment', reference_number: '', customer_name: 'Lockated', invoice_number: '', mode: 'Cash', amount: 1000, unused_amount: 1000, status: 'PAID' },
    { id: 5, payment_number: 5, date: '2025-11-13', type: 'Invoice Payment', reference_number: '', customer_name: 'Lockated', invoice_number: 'INV-000003', mode: 'Cash', amount: 100, unused_amount: 0, status: 'PAID' },
    { id: 4, payment_number: 4, date: '2025-11-13', type: 'Invoice Payment', reference_number: '', customer_name: 'Lockated', invoice_number: 'INV-000003', mode: 'Cash', amount: 159.87, unused_amount: 0, status: 'PAID' },
    { id: 3, payment_number: 3, date: '2025-11-13', type: 'Invoice Payment', reference_number: '', customer_name: 'Lockated', invoice_number: '', mode: 'Cash', amount: 100, unused_amount: 100, status: 'PAID' },
    { id: 2, payment_number: 2, date: '2025-11-13', type: 'Invoice Payment', reference_number: '', customer_name: 'Lockated', invoice_number: 'INV-000002', mode: 'Cash', amount: 300, unused_amount: 0, status: 'PAID' },
    { id: 1, payment_number: 1, date: '2025-11-12', type: 'Invoice Payment', reference_number: '', customer_name: 'Lockated', invoice_number: 'INV-000001', mode: 'Cash', amount: 1665, unused_amount: 0, status: 'PAID' },
];

export const PaymentReceivedDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const payment = useMemo(() => mockData.find(p => String(p.id) === String(id)) || mockData[0], [id]);

    const amountFormatted = `₹${payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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
                        {mockData.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => navigate(`/accounting/payments-received/${item.id}`)}
                                className={`w-full text-left p-4 border-b hover:bg-gray-50 flex items-center justify-between ${String(item.id) === String(payment.id) ? 'bg-gray-50' : ''}`}
                            >
                                <div>
                                    <div className="font-medium">{item.customer_name}</div>
                                    <div className="text-xs text-gray-500 mt-1">{item.payment_number} · {format(new Date(item.date), 'dd/MM/yyyy')}</div>
                                    <div className="text-xs text-green-600 font-semibold mt-1">PAID · {item.mode}</div>
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
                            <h2 className="text-2xl font-semibold">Payment Received - {payment.payment_number}</h2>
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
                                            <div className="font-semibold">{format(new Date(payment.date), 'dd/MM/yyyy')}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Reference Number</div>
                                            <div className="font-semibold">{payment.reference_number || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Payment Mode</div>
                                            <div className="font-semibold">{payment.mode}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Amount Received In Words</div>
                                            <div className="font-semibold">{/* Simple placeholder; in real app convert number to words */}
                                                {`Indian Rupee ${payment.amount} Only`}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-6">
                                        <div className="text-sm text-gray-600">Received From</div>
                                        <div className="mt-2"><a className="text-blue-600 font-medium">{payment.customer_name}</a></div>
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
                                                    <td className="p-3 text-blue-600">{payment.invoice_number || '—'}</td>
                                                    <td className="p-3">{payment.invoice_number ? format(new Date(payment.date), 'dd/MM/yyyy') : '—'}</td>
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
