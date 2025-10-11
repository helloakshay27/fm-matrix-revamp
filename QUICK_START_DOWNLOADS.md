# Quick Implementation Guide - Download Buttons on StatsCards

## ✅ What's Been Done

The `StatsCard` component has been updated with:
- Download button in bottom right corner (matching your reference image)
- Automatic CSV export functionality
- Custom download handler support
- Proper event handling (download button doesn't trigger card click)

## 🚀 How to Use (3 Simple Steps)

### Step 1: Import the Updated Component
```tsx
import { StatsCard } from "@/components/StatsCard";
```

### Step 2: Prepare Your Data
```tsx
// Option A: Simple array of objects
const myData = [
  { Name: "John", Points: 100, Status: "Active" },
  { Name: "Jane", Points: 200, Status: "Active" }
];

// Option B: Transform existing data
const transformedData = walletList.map(item => ({
  'Entity Name': item.entity_name,
  'Balance': item.current_balance,
  'Users': item.active_users
}));
```

### Step 3: Add downloadData Prop
```tsx
<StatsCard
  title="Total Users"
  value={1405}
  icon={<Users className="w-6 h-6" />}
  downloadData={myData} // 👈 Just add this!
/>
```

That's it! The download button will automatically appear.

---

## 📋 Real Example: Update Your Existing Code

### BEFORE (Current Code):
```tsx
<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
  <StatsCard
    title="Total Wallet Users"
    value={walletCardCount.total_users}
    icon={<Users className="w-6 h-6" />}
    className="cursor-pointer"
  />
  
  <StatsCard
    title="Total Wallet Balance"
    value={walletCardCount.total_amount}
    icon={<Wallet className="w-6 h-6" />}
    className="cursor-pointer"
  />
</div>
```

### AFTER (With Downloads):
```tsx
<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
  <StatsCard
    title="Total Wallet Users"
    value={walletCardCount.total_users}
    icon={<Users className="w-6 h-6" />}
    className="cursor-pointer"
    downloadData={walletList.map(w => ({
      'Entity': w.entity_name,
      'Balance': w.current_balance,
      'Active Users': w.active_users
    }))}
  />
  
  <StatsCard
    title="Total Wallet Balance"
    value={walletCardCount.total_amount}
    icon={<Wallet className="w-6 h-6" />}
    className="cursor-pointer"
    downloadData={walletList.map(w => ({
      'Entity': w.entity_name,
      'Current Balance': w.current_balance
    }))}
  />
</div>
```

---

## 🎨 Visual Reference (Matching Your Image)

```
┌─────────────────────────────────────────┐
│  👤  1405                               │
│      Total Users                        │
│                                         │
│                            ↓ Download   │ 👈 Button appears here
└─────────────────────────────────────────┘
```

---

## 💡 Pro Tips

### Tip 1: Clean Data Format
```tsx
// Good: Clear column names
downloadData={users.map(u => ({
  'Full Name': u.name,
  'Email Address': u.email,
  'Registration Date': format(u.created_at, 'dd/MM/yyyy')
}))}

// Not ideal: Technical field names
downloadData={users} // { user_id: 1, created_at: "2024-..." }
```

### Tip 2: Filter Before Download
```tsx
// Only download active users
downloadData={users
  .filter(u => u.status === 'active')
  .map(u => ({
    'Name': u.name,
    'Points': u.points
  }))}
```

### Tip 3: Add Calculated Fields
```tsx
downloadData={wallets.map(w => ({
  'Entity': w.entity_name,
  'Balance': w.current_balance,
  'Average per User': (w.current_balance / w.active_users).toFixed(2)
}))}
```

---

## 🔧 Advanced: Custom Download Handler

If you need to call an API or do complex processing:

```tsx
const handleDownload = async () => {
  try {
    const response = await axios.get(`${baseUrl}api/export/users`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `Users_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Download failed:', error);
  }
};

// Use it:
<StatsCard
  title="Total Users"
  value={1405}
  icon={<Users />}
  onDownload={handleDownload} // 👈 Custom handler
/>
```

---

## 📁 Output Files

Downloads will be named automatically:
- `Total_Wallet_Users_2025-10-03.csv`
- `Total_Wallet_Balance_2025-10-03.csv`
- etc.

CSV format:
```csv
Entity Name,Current Balance,Active Users
Company A,5000,25
Company B,3500,18
Company C,7200,42
```

---

## ❓ FAQ

**Q: Can I hide the download button on some cards?**
A: Yes! Just don't add `downloadData` or `onDownload` prop.

**Q: Will the download button trigger the card's onClick?**
A: No, it's already handled with `stopPropagation`.

**Q: Can I customize the filename?**
A: The title is used automatically, but you can use `onDownload` for full control.

**Q: Does it work with empty data?**
A: Yes, but it will show a console warning. Add a check:
```tsx
downloadData={myData.length > 0 ? myData : undefined}
```

---

## 🎯 Next Steps

1. ✅ Component is ready to use
2. ✅ Examples provided
3. 📝 Update your pages with `downloadData` prop
4. 🧪 Test downloads
5. 🎉 Done!

Need help? Check `EXAMPLE_CRMWalletList_With_Downloads.tsx` for a complete working example.
