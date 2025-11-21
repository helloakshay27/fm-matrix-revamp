// import React, { useState } from 'react';
// import { Download } from 'lucide-react';
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// interface Props { data: any }

// // AMC Contract Summary – Expiry in 90 Days
// const AmcExpiringContractsCard: React.FC<Props> = ({ data }) => {
//   const [activeTab, setActiveTab] = useState<string>('90days');

//   const root = data?.data ?? data ?? {};
//   let arr: any =
//     root?.expiring_contracts ??
//     root?.contract_details ??
//     root?.expiring_in_90_days ??
//     [];
//   arr = Array.isArray(arr) ? arr : [];

//   // Filter rows based on expiry period
//   const filterByDays = (days: number) => {
//     return (arr as any[]).filter(row => {
//       const endDate = new Date(row?.contract_end_date || row?.end_date || '');
//       const today = new Date();
//       const diffTime = endDate.getTime() - today.getTime();
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
//       if (days === 90) return diffDays > 0 && diffDays <= 90;
//       if (days === 45) return diffDays > 0 && diffDays <= 45;
//       if (days === 30) return diffDays > 0 && diffDays <= 30;
//       if (days === 15) return diffDays > 0 && diffDays <= 15;
//       if (days === 0) return diffDays <= 0; // Expired
//       return false;
//     });
//   };

//   const tabs = [
//     { id: '90days', label: 'Expiring in 90 Days', data: filterByDays(90) },
//     { id: '45days', label: 'Expiring in 45 Days', data: filterByDays(45) },
//     { id: '30days', label: 'Expiring in 30 Days', data: filterByDays(30) },
//     { id: '15days', label: 'Expiring in 15 Days', data: filterByDays(15) },
//     { id: 'expired', label: 'Expired', data: filterByDays(0) },
//   ];

//   return (
//     <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         {/* Tabs */}
//         <TabsList className="grid w-full grid-cols-5 bg-white border-b border-gray-200 rounded-none h-auto p-0">
//           {tabs.map(tab => (
//             <TabsTrigger
//               key={tab.id}
//               value={tab.id}
//               className="group flex items-center justify-center gap-2 data-[state=active]:bg-[#DAD6C9] data-[state=active]:text-gray-900 data-[state=inactive]:bg-white data-[state=inactive]:text-gray-600 border-none font-medium rounded-none px-2 sm:px-3 md:px-5 py-3 text-xs sm:text-sm hover:bg-gray-100 data-[state=active]:shadow-none transition-colors whitespace-normal text-center leading-tight min-h-[60px] sm:min-h-[50px]"
//             >
//               {tab.label}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         {/* Tab Content */}
//         {tabs.map(tab => (
//           <TabsContent key={tab.id} value={tab.id} className="p-4 mt-0">
//             {/* Header with Title and Download */}
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="font-semibold text-base text-[#C72030]">
//                 AMC Contract Summary – {tab.label}
//               </h3>
//               <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
//                 <Download className="w-4 h-4 text-[#C72030]" />
//               </button>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto h-[400px] overflow-y-auto">
//               <table className="min-w-[900px] w-full text-sm border border-gray-200">
//                 <thead className="bg-[#DAD6C9]">
//                   <tr>
//                     <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-900" style={{ width: '100px' }}>
//                       Site Name
//                     </th>
//                     {[
//                       'AMC Name',
//                       'Contract Start Date',
//                       'Contract End Date',
//                       'Renewal Reminder',
//                       'Projected Renewal Cost (₹)',
//                       'Vendor Contact'
//                     ].map(h => (
//                       <th key={h} className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-900">
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {!tab.data.length ? (
//                     <tr>
//                       <td colSpan={7} className="border border-gray-300 px-2 py-8 text-center text-gray-500">
//                         No data available
//                       </td>
//                     </tr>
//                   ) : (
//                     tab.data.map((r, i) => {
//                       // Check if expiring soon (within 30 days or less)
//                       const endDate = new Date(r?.contract_end_date || r?.end_date || '');
//                       const today = new Date();
//                       const diffDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
//                       const isExpiringSoon = diffDays > 0 && diffDays <= 30;
//                       const isExpired = diffDays <= 0;

//                       return (
//                         <tr key={i} className="hover:bg-gray-50">
//                           <td className="border border-gray-300 px-3 py-2 text-left">
//                             {r.site_name || r.center_name || r.site || '-'}
//                           </td>
//                           <td className="border border-gray-300 px-3 py-2 text-left">
//                             {r.amc_name || r.contract_name || r.asset_name || r.service_name || '-'}
//                           </td>
//                           <td className="border border-gray-300 px-3 py-2 text-center">
//                             {r.contract_start_date || r.start_date || '-'}
//                           </td>
//                           <td className="border border-gray-300 px-3 py-2 text-center">
//                             {r.contract_end_date || r.end_date || '-'}
//                           </td>
//                           <td className="border border-gray-300 px-3 py-2 text-center">
//                             <span className={`${
//                               isExpired ? 'text-red-600 font-semibold' :
//                               isExpiringSoon ? 'text-red-600 font-semibold' : 
//                               'text-gray-900'
//                             }`}>
//                               {r.renewal_reminder || r.renewal_alert || r.renewal_status || 
//                                 (isExpired ? 'Expired' : isExpiringSoon ? `Expires in ${diffDays} ${diffDays === 1 ? 'day' : 'days'}` : `Expires in ${diffDays} days`)}
//                             </span>
//                           </td>
//                           <td className="border border-gray-300 px-3 py-2 text-right">
//                             ₹{Number(r.projected_renewal_cost ?? r.contract_value ?? r.projected_value ?? 0).toLocaleString()}
//                           </td>
//                           <td className="border border-gray-300 px-3 py-2 text-left">
//                             {r.vendor_contact || r.vendor_name || r.vendor_email || r.vendor_details || '-'}
//                           </td>
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Note */}
//             <div className="mt-4 text-xs text-gray-600 flex items-start gap-2">
//               <span className="font-semibold">Note:</span>
//               <span>
//                 This table provides a site-wise summary of AMC contracts set to expire within the selected period, 
//                 supporting proactive renewal planning and vendor coordination.
//               </span>
//             </div>
//           </TabsContent>
//         ))}
//       </Tabs>
//     </div>
//   );
// };

// export default AmcExpiringContractsCard;

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface Props { data: any }

// Combined AMC Overview Card (Summary + Expiring Contracts)
const AmcExpiringContractsCard: React.FC<Props> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<string>('90days');

  const root = data ?? {};

  // Compute summary totals
  const legacy = root?.data?.summary ?? root?.summary ?? null;
  const cards = root?.card_overview ?? root?.data?.card_overview ?? null;

  const summary = legacy
    ? {
        active: Number(legacy.active_amc_contracts ?? 0),
        expiry90: Number(legacy.contract_expiry_in_90_days ?? 0),
        expired: Number(legacy.contract_expired ?? 0),
      }
    : cards
    ? {
        active: Number(cards?.active_contracts?.count ?? 0),
        expiry90: Number(cards?.expiring_soon?.count ?? 0),
        expired: Number(cards?.expired_contracts?.count ?? 0),
      }
    : {
        active: Number(root.active_amc_contracts ?? 0),
        expiry90: Number(root.contract_expiry_in_90_days ?? 0),
        expired: Number(root.contract_expired ?? 0),
      };

  // Get expiring contracts data
  const dataRoot = data?.data ?? data ?? {};
  let arr: any =
    dataRoot?.expiring_contracts ??
    dataRoot?.contract_details ??
    dataRoot?.expiring_in_90_days ??
    [];
  arr = Array.isArray(arr) ? arr : [];

  // Filter rows based on expiry period
  const filterByDays = (days: number) => {
    return (arr as any[]).filter(row => {
      const endDate = new Date(row?.contract_end_date || row?.end_date || '');
      const today = new Date();
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (days === 90) return diffDays > 0 && diffDays <= 90;
      if (days === 45) return diffDays > 0 && diffDays <= 45;
      if (days === 30) return diffDays > 0 && diffDays <= 30;
      if (days === 15) return diffDays > 0 && diffDays <= 15;
      if (days === 0) return diffDays <= 0; // Expired
      return false;
    });
  };

  const tabs = [
    { id: '90days', label: 'Expiring in 90 Days', data: filterByDays(90) },
    { id: '45days', label: 'Expiring in 45 Days', data: filterByDays(45) },
    { id: '30days', label: 'Expiring in 30 Days', data: filterByDays(30) },
    { id: '15days', label: 'Expiring in 15 Days', data: filterByDays(15) },
    { id: 'expired', label: 'Expired', data: filterByDays(0) },
  ];

  const currentTabData = tabs.find(t => t.id === activeTab)?.data || [];

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 overflow-x-auto">
      {/* Header */}
       <h3
        className="mb-6 pb-3 border-b border-gray-200 -mx-4 px-4 pt-3"
        style={{
          fontFamily: 'Work Sans, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '100%',
          letterSpacing: '0%'
        }}
      >
        AMC Overview
      </h3>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-[#f2f0eb] border border-gray-300 py-6 px-4 text-center">
          <div className="text-xl text-black font-semibold mb-4">Active AMC Contracts</div>
          <div className="text-4xl font-bold text-[#C72030]">{summary.active.toLocaleString()}</div>
        </div>
        <div className="bg-[#f2f0eb] border border-gray-300 py-6 px-4 text-center">
          <div className="text-xl text-black font-semibold mb-4">Contract Expiry in 90 Days</div>
          <div className="text-4xl font-bold text-[#C72030]">{summary.expiry90.toLocaleString()}</div>
        </div>
        <div className="bg-[#f2f0eb] border border-gray-300 py-6 px-4 text-center">
          <div className="text-xl text-black font-semibold mb-4">Contract Expired</div>
          <div className="text-4xl font-bold text-[#C72030]">{summary.expired.toLocaleString()}</div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200 rounded-none h-auto p-0">
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="group flex items-center justify-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-black data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold rounded-none px-2 sm:px-3 md:px-5 py-3 text-xs sm:text-sm transition-colors whitespace-normal text-center leading-tight min-h-[60px] sm:min-h-[50px]"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Content */}
        {tabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="p-4 mt-0">
            {/* Header with Title and Download */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-[#C72030]">
                AMC Contract Summary – {tab.label}
              </h3>
              <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                <Download className="w-4 h-4 text-[#C72030]" />
              </button>
            </div>

            {/* Table with scrollable body, only one scrollbar */}
            <div className="overflow-x-auto">
              <div style={{ maxHeight: 6 * 48 + 'px', overflowY: 'auto', minWidth: '900px' }}>
                <table className="w-full text-sm border border-gray-200">
                  <thead className="bg-[#DAD6C9] sticky top-0 z-10">
                    <tr>
                      <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-900" style={{ width: '100px' }}>
                        Site Name
                      </th>
                      {[
                        'AMC Name',
                        'Contract Start Date',
                        'Contract End Date',
                        'Renewal Reminder',
                        'Projected Renewal Cost (₹)',
                        'Vendor Contact'
                      ].map(h => (
                        <th key={h} className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-900">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {!tab.data.length ? (
                      <tr>
                        <td colSpan={7} className="border border-gray-300 px-2 py-8 text-center text-gray-500">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      tab.data.map((r, i) => {
                        const endDate = new Date(r?.contract_end_date || r?.end_date || '');
                        const today = new Date();
                        const diffDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                        const isExpiringSoon = diffDays > 0 && diffDays <= 30;
                        const isExpired = diffDays <= 0;

                        return (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-3 py-2 text-left">
                              {r.site_name || r.center_name || r.site || '-'}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-left">
                              {r.amc_name || r.contract_name || r.asset_name || r.service_name || '-'}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center">
                              {r.contract_start_date || r.start_date || '-'}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center">
                              {r.contract_end_date || r.end_date || '-'}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center">
                              <span className={`$${
                                isExpired ? 'text-red-600 font-semibold' :
                                isExpiringSoon ? 'text-red-600 font-semibold' : 
                                'text-gray-900'
                              }`}>
                                {r.renewal_reminder || r.renewal_alert || r.renewal_status || 
                                  (isExpired ? 'Expired' : isExpiringSoon ? `Expires in ${diffDays} ${diffDays === 1 ? 'day' : 'days'}` : `Expires in ${diffDays} days`)}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-right">
                              ₹{Number(r.projected_renewal_cost ?? r.contract_value ?? r.projected_value ?? 0).toLocaleString()}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-left">
                              {r.vendor_contact || r.vendor_name || r.vendor_email || r.vendor_details || '-'}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Note */}
            <div className="mt-4 text-xs text-gray-600 flex items-start gap-2">
              <span className="font-semibold">Note:</span>
              <span>
                This table provides a site-wise summary of AMC contracts set to expire within the selected period, 
                supporting proactive renewal planning and vendor coordination.
              </span>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AmcExpiringContractsCard;
