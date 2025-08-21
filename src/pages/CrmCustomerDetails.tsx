import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLayout } from '../contexts/LayoutContext';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { ArrowLeft, Edit2, X } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';

export const CrmCustomerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setCurrentSection } = useLayout();
    const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState('');

    useEffect(() => {
        setCurrentSection('CRM');
    }, [setCurrentSection]);

    const handleTopUpClick = () => {
        setTopUpDialogOpen(true);
    };

    const handleTopUpClose = () => {
        setTopUpDialogOpen(false);
        setTopUpAmount('');
    };

    const handleTopUpSubmit = () => {
        console.log('Top-up amount:', topUpAmount);
        handleTopUpClose();
    };

    const customerData = {
        customerName: 'HSBC',
        customerEmail: 'hsbc@gmail.com',
        companyCode: '',
        colorCode: '#FFD700',
        mobileNumber: '1234561231',
        organizationCode: '',
        customerCode: ''
    };

    const leaseData = {
        leaseId: '85',
        leaseStartDate: '2024-07-01',
        leaseEndDate: '2024-09-29',
        freeParking: '10',
        paidParking: '20'
    };

    // Sample wallet transactions
    const walletTransactions = [
        {
            transactionId: '1220',
            bookingId: '',
            facilityName: '',
            personName: '',
            transactionDate: 'June 30, 2025',
            transactionTime: '23:50:23',
            amount: '100.0',
            transactionType: 'Debit',
            ccAvenueId: ''
        },
        {
            transactionId: '1212',
            bookingId: '',
            facilityName: '',
            personName: 'Vinayak Mane',
            transactionDate: 'June 04, 2025',
            transactionTime: '11:43:53',
            amount: '100.0',
            transactionType: 'Credit',
            ccAvenueId: ''
        },
        {
            transactionId: '1203',
            bookingId: '',
            facilityName: '',
            personName: '',
            transactionDate: 'June 03, 2025',
            transactionTime: '23:50:22',
            amount: '101.02',
            transactionType: 'Debit',
            ccAvenueId: ''
        },
        {
            transactionId: '1201',
            bookingId: '',
            facilityName: '',
            personName: 'Vinayak Mane',
            transactionDate: 'June 03, 2025',
            transactionTime: '17:35:31',
            amount: '100.0',
            transactionType: 'Credit',
            ccAvenueId: ''
        },
        {
            transactionId: '1199',
            bookingId: '',
            facilityName: '',
            personName: 'Vinayak testwallet guest',
            transactionDate: 'June 03, 2025',
            transactionTime: '14:54:09',
            amount: '1.02',
            transactionType: 'Credit',
            ccAvenueId: '11379116850'
        }
    ];

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <p className="text-gray-600 text-sm">Back</p>
                </button>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Wallet Balance: 0 Points</span>
                    <Button
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm"
                        onClick={handleTopUpClick}
                    >
                        Top-Up Wallet
                    </Button>
                    <Button variant="outline" size="sm" className="p-2" onClick={() => navigate(`/crm/customers/edit/${id}`)}>
                        <Edit2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="w-32 text-sm font-medium text-gray-700">Customer Name</label>
                            <span className="text-sm">:</span>
                            <span className="text-sm text-gray-900">{customerData.customerName}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-32 text-sm font-medium text-gray-700">Customer Email</label>
                            <span className="text-sm">:</span>
                            <span className="text-sm text-gray-900">{customerData.customerEmail}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-32 text-sm font-medium text-gray-700">Company Code</label>
                            <span className="text-sm">:</span>
                            <span className="text-sm text-gray-900">{customerData.companyCode}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-32 text-sm font-medium text-gray-700">Color Code</label>
                            <span className="text-sm">:</span>
                            <div
                                className="w-6 h-6 rounded border border-gray-300"
                                style={{ backgroundColor: customerData.colorCode }}
                            ></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="w-32 text-sm font-medium text-gray-700">Mobile Number</label>
                            <span className="text-sm">:</span>
                            <span className="text-sm text-gray-900">{customerData.mobileNumber}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-32 text-sm font-medium text-gray-700">Organization Code</label>
                            <span className="text-sm">:</span>
                            <span className="text-sm text-gray-900">{customerData.organizationCode}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-32 text-sm font-medium text-gray-700">Customer Code</label>
                            <span className="text-sm">:</span>
                            <span className="text-sm text-gray-900">{customerData.customerCode}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lease Information Table */}
            <div className="bg-white rounded-lg p-6 mb-6">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-purple-100">
                            <TableHead className="font-medium text-gray-700">Lease Id</TableHead>
                            <TableHead className="font-medium text-gray-700">Lease Start Date</TableHead>
                            <TableHead className="font-medium text-gray-700">Lease End Date</TableHead>
                            <TableHead className="font-medium text-gray-700">Free Parking</TableHead>
                            <TableHead className="font-medium text-gray-700">Paid Parking</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="text-sm">{leaseData.leaseId}</TableCell>
                            <TableCell className="text-sm">{leaseData.leaseStartDate}</TableCell>
                            <TableCell className="text-sm">{leaseData.leaseEndDate}</TableCell>
                            <TableCell className="text-sm">{leaseData.freeParking}</TableCell>
                            <TableCell className="text-sm">{leaseData.paidParking}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            {/* Wallet Transactions */}
            <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Transactions</h3>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead className="font-medium text-gray-700 text-sm">Transaction ID</TableHead>
                                <TableHead className="font-medium text-gray-700 text-sm">Booking Id</TableHead>
                                <TableHead className="font-medium text-gray-700 text-sm">Facility Name</TableHead>
                                <TableHead className="font-medium text-gray-700 text-sm">Person Name</TableHead>
                                <TableHead className="font-medium text-gray-700 text-sm">Transaction Date</TableHead>
                                <TableHead className="font-medium text-gray-700 text-sm">Transaction Time</TableHead>
                                <TableHead className="font-medium text-gray-700 text-sm">Amount</TableHead>
                                <TableHead className="font-medium text-gray-700 text-sm">Transaction Type</TableHead>
                                <TableHead className="font-medium text-gray-700 text-sm">Transaction ID (CC Avenue ID)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {walletTransactions.map((transaction, index) => (
                                <TableRow key={index} className="hover:bg-gray-50">
                                    <TableCell className="text-sm">{transaction.transactionId}</TableCell>
                                    <TableCell className="text-sm">{transaction.bookingId}</TableCell>
                                    <TableCell className="text-sm">{transaction.facilityName}</TableCell>
                                    <TableCell className="text-sm">{transaction.personName}</TableCell>
                                    <TableCell className="text-sm">{transaction.transactionDate}</TableCell>
                                    <TableCell className="text-sm">{transaction.transactionTime}</TableCell>
                                    <TableCell className="text-sm">{transaction.amount}</TableCell>
                                    <TableCell className="text-sm">
                                        <span className={`px-2 py-1 rounded text-xs ${transaction.transactionType === 'Credit'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {transaction.transactionType}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm">{transaction.ccAvenueId}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Top-Up Wallet Dialog */}
            <Dialog
                open={topUpDialogOpen}
                onClose={handleTopUpClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    style: {
                        borderRadius: '12px',
                        padding: '8px'
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        pb: 2
                    }}
                >
                    Top-Up Wallet
                    <IconButton
                        onClick={handleTopUpClose}
                        sx={{
                            color: 'gray',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
                        }}
                    >
                        <X size={20} />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ pb: 3 }}>
                    <TextField
                        label="Amount to Top-Up"
                        variant="outlined"
                        fullWidth
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        type="number"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px'
                            }
                        }}
                    />
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
                    <Button
                        variant="outline"
                        onClick={handleTopUpClose}
                        className="px-6 py-2"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleTopUpSubmit}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                        disabled={!topUpAmount}
                    >
                        Top-Up
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};