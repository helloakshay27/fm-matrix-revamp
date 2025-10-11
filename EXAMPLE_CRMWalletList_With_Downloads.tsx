/**
 * EXAMPLE: How to add download functionality to CRMWalletList.tsx
 * 
 * This file shows the complete implementation with download buttons on each card.
 * Copy the relevant parts to your actual CRMWalletList.tsx file.
 */

import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { StatsCard } from "@/components/StatsCard";
import TopupModal from "@/components/TopupModal";
import { Button } from "@/components/ui/button";
import { SelectionPanel } from "@/components/water-asset-details/PannelTab";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
    fetchCardCount,
    fetchTransactionHistory,
    fetchWalletList,
} from "@/store/slices/walletListSlice";
import axios from "axios";
import { format } from "date-fns";
import { Coins, Download, Eye, Plus, Star, Users, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ... (keep your existing columns config)

const CRMWalletList = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const baseUrl = localStorage.getItem("baseUrl");

    const [showActionPanel, setShowActionPanel] = useState<boolean>(false);
    const [isTransactionHistoryVisible, setIsTransactionHistoryVisible] = useState(false);
    const [walletList, setWalletList] = useState([]);
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [showTopupModal, setShowTopupModal] = useState(false);
    const [walletCardCount, setWalletCardCount] = useState({
        total_users: 0,
        total_amount: 0,
        paid_points: 0,
        complimentary_points: 0,
        expiry_points: 0,
    });

    // ... (keep your existing useEffect for fetching data)

    // ===== NEW: Download handlers for each card =====
    
    // Option 1: Simple data transformation for automatic CSV export
    const getTotalUsersData = () => {
        return walletList.map(wallet => ({
            'Entity Name': wallet.entity_name,
            'Current Balance': wallet.current_balance,
            'Active Users': wallet.active_users,
            'Last Transaction Value': wallet.last_transaction_value || 'N/A',
            'Last Transaction Date': wallet.last_transaction_date 
                ? format(new Date(wallet.last_transaction_date), 'dd/MM/yyyy') 
                : 'N/A'
        }));
    };

    const getTotalBalanceData = () => {
        return walletList.map(wallet => ({
            'Entity Name': wallet.entity_name,
            'Balance (Points)': wallet.current_balance,
            'Status': wallet.active_users > 0 ? 'Active' : 'Inactive'
        }));
    };

    const getPaidPointsData = () => {
        // Filter transactions for paid points (assuming credit transactions are paid)
        return transactionHistory
            .filter(tx => tx.transaction_type?.toLowerCase() === 'credit')
            .map(tx => ({
                'Transaction ID': tx.id,
                'Company': tx.company_name,
                'User': tx.user_name,
                'Amount': tx.amount,
                'Date': tx.created_at ? format(new Date(tx.created_at), 'dd/MM/yyyy hh:mm a') : 'N/A'
            }));
    };

    const getComplimentaryPointsData = () => {
        // Example: Filter for complimentary transactions
        // Adjust the filter logic based on your actual data structure
        return transactionHistory
            .filter(tx => tx.is_complimentary === true || tx.transaction_type?.toLowerCase() === 'complimentary')
            .map(tx => ({
                'Transaction ID': tx.id,
                'Company': tx.company_name,
                'User': tx.user_name,
                'Points': tx.amount,
                'Date': tx.created_at ? format(new Date(tx.created_at), 'dd/MM/yyyy hh:mm a') : 'N/A',
                'Type': 'Complimentary'
            }));
    };

    const getExpiredPointsData = () => {
        // Example: Filter for expired points
        return transactionHistory
            .filter(tx => tx.is_expired === true || tx.status === 'expired')
            .map(tx => ({
                'Transaction ID': tx.id,
                'Company': tx.company_name,
                'User': tx.user_name,
                'Expired Points': tx.amount,
                'Expiry Date': tx.created_at ? format(new Date(tx.created_at), 'dd/MM/yyyy') : 'N/A'
            }));
    };

    // Option 2: Custom download handler with API call (example)
    const handleDownloadTotalUsersReport = async () => {
        try {
            toast.loading("Generating report...");
            
            const response = await axios.get(`${baseUrl}api/wallet/total-users-report`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob' // Important for file downloads
            });
            
            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Total_Wallet_Users_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            toast.dismiss();
            toast.success("Report downloaded successfully!");
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to download report");
            console.error("Download error:", error);
        }
    };

    // ... (keep your existing render functions)

    return (
        <div className="w-full p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-[#1a1a1a]">Wallet List</h1>
            </div>

            {/* ===== UPDATED: StatsCards with download functionality ===== */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Card 1: Total Wallet Users - Using data transformation */}
                <StatsCard
                    title="Total Wallet Users"
                    value={walletCardCount.total_users}
                    icon={<Users className="w-6 h-6" />}
                    className="cursor-pointer"
                    downloadData={getTotalUsersData()} // Automatic CSV export
                />

                {/* Card 2: Total Wallet Balance - Using data transformation */}
                <StatsCard
                    title="Total Wallet Balance"
                    value={walletCardCount.total_amount}
                    icon={<Wallet className="w-6 h-6" />}
                    className="cursor-pointer"
                    downloadData={getTotalBalanceData()} // Automatic CSV export
                />

                {/* Card 3: Paid Points - Using custom API handler */}
                <StatsCard
                    title="Paid Points"
                    value={walletCardCount.paid_points}
                    icon={<Coins className="w-6 h-6" />}
                    className="cursor-pointer"
                    downloadData={getPaidPointsData()} // Can use either method
                    // OR use: onDownload={handleDownloadTotalUsersReport}
                />

                {/* Card 4: Complimentary Points - Using data transformation */}
                <StatsCard
                    title="Complimentary Points"
                    value={walletCardCount.complimentary_points}
                    icon={<Star className="w-6 h-6" />}
                    className="cursor-pointer"
                    downloadData={getComplimentaryPointsData()}
                />

                {/* Card 5: Expired Points - Using data transformation */}
                <StatsCard
                    title="Expired Points"
                    value={walletCardCount.expiry_points}
                    icon={<Users className="w-6 h-6" />}
                    className="cursor-pointer"
                    downloadData={getExpiredPointsData()}
                />
            </div>

            {/* ... (keep your existing table and modal code) */}
        </div>
    );
};

export default CRMWalletList;

/**
 * SUMMARY OF CHANGES:
 * 
 * 1. Added 5 helper functions to prepare data for each card:
 *    - getTotalUsersData()
 *    - getTotalBalanceData()
 *    - getPaidPointsData()
 *    - getComplimentaryPointsData()
 *    - getExpiredPointsData()
 * 
 * 2. Added downloadData prop to each StatsCard
 * 
 * 3. (Optional) Added example of custom download handler with API call
 * 
 * WHAT USERS WILL SEE:
 * - Small download icon appears at bottom right of each card
 * - Icon shows on hover with color change effect
 * - Clicking download button doesn't trigger card's onClick
 * - Downloads CSV file with card title and current date in filename
 * 
 * CUSTOMIZATION:
 * - Adjust data transformation in helper functions to match your needs
 * - Change CSV column names by modifying the object keys
 * - Filter data based on specific conditions
 * - Add custom API calls if needed
 */
