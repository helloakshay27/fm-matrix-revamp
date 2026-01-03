import { useEffect, useState } from 'react'
import { Wallet, RefreshCw, IndianRupee } from 'lucide-react'
import { EnhancedTable } from './enhanced-table/EnhancedTable'
import { ColumnConfig } from '@/hooks/useEnhancedTable'
import axios from 'axios'
import { toast } from 'sonner'

interface Transaction {
    id: string
    description: string
    amount: number
    type: 'debit' | 'credit'
    date: string
    status: 'completed' | 'pending' | 'failed'
}

const transactionColumns: ColumnConfig[] = [
    {
        key: 'date',
        label: 'Date',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'transactionPoints',
        label: 'Amount',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'point_type',
        label: 'Point Type',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'transactionType',
        label: 'Transaction Type',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'payment_mode',
        label: 'Payment Mode',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
]

const ProfileWallet = () => {
    const baseUrl = localStorage.getItem('baseUrl') || ''
    const token = localStorage.getItem('token') || ''
    const id = JSON.parse(localStorage.getItem('user') || '{}').id || ''

    const [availableBalance, setAvailableBalance] = useState(0)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isWalletExist, setIsWalletExist] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const fetchWalleteDetails = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get(`https://${baseUrl}/wallet/balance.json?user_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log(response.data)
            setAvailableBalance(response.data.available_amount)
            setTransactions(response.data.wallet_transactions || [])
            setIsWalletExist(true)
        } catch (error: any) {
            console.log(error)
            if (error.response?.data?.message === 'Wallet not found') {
                setIsWalletExist(false)
                toast.info('Wallet not found')
            } else {
                toast.error('Failed to load wallet details')
                setIsWalletExist(true)
            }
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }

    useEffect(() => {
        if (id && baseUrl && token) {
            fetchWalleteDetails()
        }
    }, [id, baseUrl, token])

    const handleRefresh = () => {
        setIsRefreshing(true)
        fetchWalleteDetails()
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-50'
            case 'pending':
                return 'text-yellow-600 bg-yellow-50'
            case 'failed':
                return 'text-red-600 bg-red-50'
            default:
                return 'text-gray-600 bg-gray-50'
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

    const renderCell = (item: Transaction, columnKey: string) => {
        switch (columnKey) {
            case 'amount':
                return (
                    <span
                        className={`font-semibold ${item.type === 'debit' ? 'text-red-600' : 'text-green-600'
                            }`}
                    >
                        {item.type === 'debit' ? '-' : '+'}${item?.amount?.toFixed(2)}
                    </span>
                )
            case 'type':
                return (
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${item.type === 'debit'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                            }`}
                    >
                        {item?.type?.charAt(0)?.toUpperCase() + item?.type?.slice(1)}
                    </span>
                )
            case 'status':
                return (
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            item.status
                        )}`}
                    >
                        {item?.status?.charAt(0)?.toUpperCase() + item?.status?.slice(1)}
                    </span>
                )
            default:
                return item[columnKey as keyof Transaction] || '-'
        }
    }

    return (
        <>
            {
                !isWalletExist ? (
                    <div className='bg-white flex items-center justify-center h-24'>
                        <h2 className="text-sm text-gray-500 mb-3">Wallet Not Found</h2>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5 mt-4">
                        {/* Available Balance Card */}
                        <div className="bg-[#C4B99D] rounded-2xl p-6 text-white shadow-lg max-w-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Wallet size={24} />
                                    <span className="text-base font-semibold">Available Balance</span>
                                </div>
                                <button
                                    onClick={handleRefresh}
                                    disabled={isRefreshing || isLoading}
                                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all disabled:opacity-50"
                                    title="Refresh balance"
                                >
                                    <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                                </button>
                            </div>
                            <div className="mb-6">
                                {isLoading ? (
                                    <div className="h-10 bg-white bg-opacity-20 rounded animate-pulse w-32"></div>
                                ) : (
                                    <h1 className="text-4xl font-bold flex items-center gap-2"><IndianRupee />{availableBalance.toFixed(2)}</h1>
                                )}
                            </div>
                        </div>

                        {/* Transactions Section */}
                        <div className="">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
                                <span className="text-sm text-gray-500">
                                    {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
                                </span>
                            </div>

                            {/* Transactions Table */}
                            {transactions.length > 0 ? (
                                <EnhancedTable
                                    data={transactions}
                                    columns={transactionColumns}
                                    renderCell={renderCell}
                                    hideTableSearch={true}
                                    hideColumnsButton={true}
                                    loading={isLoading}
                                    storageKey='employee-transaction-column'
                                />
                            ) : (
                                <div className="bg-white rounded-lg p-12 text-center">
                                    <p className="text-gray-500 text-sm">No transactions yet</p>
                                </div>
                            )}
                        </div>
                    </div >
                )
            }
        </>
    )
}

export default ProfileWallet