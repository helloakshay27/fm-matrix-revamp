
// import React from 'react';
// import { Label } from '@/components/ui/label';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import { VendorBiddingSection } from './VendorBiddingSection';

// interface VendorBid {
//   vendorName: string;
//   biddingCost: string;
// }

// interface HandedOverToSectionProps {
//   handedOverTo: string;
//   onHandedOverToChange: (value: string) => void;
//   vendor: string;
//   onVendorChange: (vendor: string) => void;
//   vendorBids: VendorBid[];
//   onVendorBidsChange: (bids: VendorBid[]) => void;
// }

// export const HandedOverToSection: React.FC<HandedOverToSectionProps> = ({
//   handedOverTo,
//   onHandedOverToChange,
//   vendor,
//   onVendorChange,
//   vendorBids,
//   onVendorBidsChange
// }) => {
//   const vendors = [
//     'ABC Disposal Services',
//     'Green Recycling Co.',
//     'Tech Waste Solutions',
//     'EcoFriendly Disposal',
//     'Secure Asset Disposal'
//   ];

//   return (
//     <>
//       {/* Handed Over To */}
//       <div className="space-y-4">
//         <Label className="text-sm font-medium text-gray-700">
//           Handed Over To
//         </Label>
//         <RadioGroup
//           value={handedOverTo}
//           onValueChange={onHandedOverToChange}
//           className="flex gap-6"
//         >
//           <div className="flex items-center space-x-2">
//             <RadioGroupItem value="vendor" id="vendor" />
//             <Label htmlFor="vendor" className="text-sm">Vendor</Label>
//           </div>
//           <div className="flex items-center space-x-2">
//             <RadioGroupItem value="user" id="user" />
//             <Label htmlFor="user" className="text-sm">User</Label>
//           </div>
//         </RadioGroup>
//       </div>

//       {/* Vendor Selection */}
//       <div className="space-y-2">
//         <FormControl className="max-w-sm">
//           <InputLabel shrink>Vendor *</InputLabel>
//           <Select
//             value={vendor}
//             onChange={(e) => onVendorChange(e.target.value)}
//             label="Vendor *"
//             displayEmpty
//           >
//             <MenuItem value="" disabled>
//               Select Vendor
//             </MenuItem>
//             {vendors.map((vendorName) => (
//               <MenuItem key={vendorName} value={vendorName}>
//                 {vendorName}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </div>

//       {/* Vendor Bidding Section */}
//       <VendorBiddingSection
//         vendorBids={vendorBids}
//         onVendorBidsChange={onVendorBidsChange}
//       />
//     </>
//   );
// };
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { VendorBiddingSection } from './VendorBiddingSection';
import axios from 'axios';


interface VendorBid {
  vendor_name: string;
  bidding_cost: string;
}


interface HandedOverToSectionProps {
  handedOverTo: string;
  onHandedOverToChange: (value: string) => void;
  vendor: string;
  onVendorChange: (vendor: string) => void;
  vendorBids: VendorBid[];
  onVendorBidsChange: (bids: VendorBid[]) => void;
}

interface Supplier {
  id: number;
  name: string;
}

interface User {
  id: number;
  full_name: string;
}

export const HandedOverToSection: React.FC<HandedOverToSectionProps> = ({
  handedOverTo,
  onHandedOverToChange,
  vendor,
  onVendorChange,
  vendorBids,
  onVendorBidsChange
}) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  // Fetch supplier list
  useEffect(() => {
    if (handedOverTo === 'vendor') {
      axios.get(`https://${baseUrl}/pms/suppliers/get_suppliers.json`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          setSuppliers(res.data || []);
        })
        .catch((err) => console.error('Error fetching suppliers', err));
    }
  }, [handedOverTo]);

  // Fetch users list
  useEffect(() => {
    if (handedOverTo === 'user') {
      axios.get(`https://${baseUrl}/pms/users/get_escalate_to_users.json`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
        .then((res) => {
          setUsers(res.data.users || []);
        })
        .catch((err) => console.error('Error fetching users', err));
    }
  }, [handedOverTo]);

  return (
    <>
      {/* Handed Over To */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">
          Handed Over To
        </Label>
        <RadioGroup
          value={handedOverTo}
          onValueChange={onHandedOverToChange}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vendor" id="vendor" />
            <Label htmlFor="vendor" className="text-sm">Vendor</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="user" id="user" />
            <Label htmlFor="user" className="text-sm">User</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Vendor Dropdown */}
      {handedOverTo === 'vendor' && (
        <div className="space-y-2 md:col-span-3">
          <FormControl className="w-full">
            <InputLabel shrink>Vendor *</InputLabel>
            <Select
              value={vendor}
              onChange={(e) => onVendorChange(e.target.value)}
              displayEmpty
              label="Vendor *"
              fullWidth
            >
              <MenuItem value="" disabled>Select Vendor</MenuItem>
              {suppliers.map((s) => (
                <MenuItem key={s.id} value={s.name}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Vendor Bidding Section */}
          <VendorBiddingSection
            vendorBids={vendorBids}
            onVendorBidsChange={onVendorBidsChange}
          />
        </div>
      )}

      {/* User Dropdown */}
      {handedOverTo === 'user' && (
        <div className="space-y-2 md:col-span-3">
         <FormControl className="w-full">
  <InputLabel shrink>User *</InputLabel>
  <Select
    value={vendor}
    onChange={(e) => onVendorChange(e.target.value)} // consider renaming for clarity
    displayEmpty
    label="User *"
    fullWidth
  >
    <MenuItem value="" disabled>Select User</MenuItem>
    {users.map((u) => (
      <MenuItem key={u.id} value={u.full_name}>
        {u.full_name}
      </MenuItem>
    ))}
  </Select>
</FormControl>

        </div>
      )}
    </>
  );
};
