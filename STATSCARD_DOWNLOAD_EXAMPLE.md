# StatsCard Download Feature - Implementation Guide

The StatsCard component now includes a download button that appears at the bottom right of each card. Here are three ways to use it:

## Method 1: Pass Data Directly (Automatic CSV Export)

The simplest method - just pass the data array and the component will handle CSV export automatically:

```tsx
import { StatsCard } from "@/components/StatsCard";
import { Users, Wallet } from "lucide-react";

// Your component
const MyDashboard = () => {
  const [walletList, setWalletList] = useState([]);
  
  // Example: Fetch your data
  useEffect(() => {
    fetchWalletData().then(data => setWalletList(data));
  }, []);

  return (
    <div className="grid grid-cols-5 gap-4">
      <StatsCard
        title="Total Wallet Users"
        value={1405}
        icon={<Users className="w-6 h-6" />}
        downloadData={walletList} // Pass your data array
      />
      
      <StatsCard
        title="Total Balance"
        value={651}
        icon={<Wallet className="w-6 h-6" />}
        downloadData={balanceData} // Each card can have different data
      />
    </div>
  );
};
```

## Method 2: Custom Download Handler

For more control (API calls, custom formatting, etc.):

```tsx
import { StatsCard } from "@/components/StatsCard";
import { Download } from "lucide-react";
import axios from "axios";

const MyDashboard = () => {
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  // Custom download function
  const handleDownloadTotalUsers = async () => {
    try {
      const response = await axios.get(`${baseUrl}api/wallet/users/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Total_Users_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Report downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download report");
      console.error(error);
    }
  };

  return (
    <StatsCard
      title="Total Wallet Users"
      value={1405}
      icon={<Users className="w-6 h-6" />}
      onDownload={handleDownloadTotalUsers} // Custom handler
    />
  );
};
```

## Method 3: Combined Approach (Filtered Data)

Filter or transform data before passing to the card:

```tsx
const MyDashboard = () => {
  const [allWalletData, setAllWalletData] = useState([]);
  
  // Calculate stats
  const totalUsers = allWalletData.length;
  const approvedUsers = allWalletData.filter(u => u.status === 'approved');
  const pendingUsers = allWalletData.filter(u => u.status === 'pending');
  
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatsCard
        title="Total Users"
        value={totalUsers}
        icon={<Users className="w-6 h-6" />}
        downloadData={allWalletData} // All data
      />
      
      <StatsCard
        title="Approved Users"
        value={approvedUsers.length}
        icon={<Users className="w-6 h-6 text-green-600" />}
        downloadData={approvedUsers} // Only approved
      />
      
      <StatsCard
        title="Pending Users"
        value={pendingUsers.length}
        icon={<Users className="w-6 h-6 text-orange-600" />}
        downloadData={pendingUsers} // Only pending
      />
    </div>
  );
};
```

## Real Example: CRMWalletList Implementation

Here's how to update your existing CRMWalletList.tsx:

```tsx
// In CRMWalletList.tsx

// Add download handlers
const handleDownloadTotalUsers = () => {
  const userData = walletList.map(w => ({
    'Entity Name': w.entity_name,
    'Current Balance': w.current_balance,
    'Active Users': w.active_users,
    'Last Transaction': w.last_transaction_value,
    'Last Transaction Date': w.last_transaction_date 
      ? format(w.last_transaction_date, 'dd/MM/yyyy') 
      : 'N/A'
  }));
  
  // The card will handle CSV export automatically
  return userData;
};

// Update your StatsCard components:
<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
  <StatsCard
    title="Total Wallet Users"
    value={walletCardCount.total_users}
    icon={<Users className="w-6 h-6" />}
    downloadData={handleDownloadTotalUsers()}
  />
  
  <StatsCard
    title="Total Wallet Balance"
    value={walletCardCount.total_amount}
    icon={<Wallet className="w-6 h-6" />}
    downloadData={walletList.map(w => ({
      'Entity': w.entity_name,
      'Balance': w.current_balance
    }))}
  />
  
  <StatsCard
    title="Paid Points"
    value={walletCardCount.paid_points}
    icon={<Coins className="w-6 h-6" />}
    onDownload={async () => {
      // Custom API call
      const response = await axios.get(`${baseUrl}api/wallet/paid-points/export`);
      // Handle download...
    }}
  />
</div>
```

## Features

✅ **Automatic CSV Export** - Pass data and get instant CSV downloads
✅ **Custom Handlers** - Full control over download logic
✅ **Stop Propagation** - Download button doesn't trigger card click
✅ **Filename Generation** - Auto-generates filenames with date stamps
✅ **CSV Formatting** - Handles commas, quotes, and special characters
✅ **Hover Effects** - Button changes color on hover
✅ **Optional** - Only shows if `onDownload` or `downloadData` is provided

## CSV Output Format

The CSV file will include:
- **Filename**: `{Title}_YYYY-MM-DD.csv`
- **Headers**: First row contains column names
- **Data**: Subsequent rows contain the data
- **Escaping**: Handles commas, quotes, and newlines properly

Example output for "Total_Wallet_Users_2025-10-03.csv":
```csv
Entity Name,Current Balance,Active Users,Last Transaction,Last Transaction Date
Company A,5000,25,1200,03/10/2025
Company B,3500,18,800,02/10/2025
```

## Troubleshooting

**No download button appears?**
- Make sure you've added either `downloadData` or `onDownload` prop

**Empty CSV file?**
- Check that your data array isn't empty
- Verify data structure has the expected properties

**Download not working in custom handler?**
- Check browser console for errors
- Verify API endpoint and token are correct
- Ensure response type is 'blob' for binary data
