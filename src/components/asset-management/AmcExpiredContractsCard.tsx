import React from 'react';

interface Props { data: any }

// AMC Contract Summary – Expired
const AmcExpiredContractsCard: React.FC<Props> = ({ data }) => {
  const root = data?.data ?? data ?? {};
  let arr: any =
    root?.expired_contracts ??
    root?.expired_contract_details ??
    (root?.expired && root?.expired?.contract_details) ??
    root?.contract_details ??
    [];
  arr = Array.isArray(arr) ? arr : [];
  const rows = (arr as any[]).filter(row => String(row?.status ?? row?.contract_status ?? '').toLowerCase().replace(/_/g,' ').trim() === 'expired');

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 overflow-x-auto">
      <h3 className="font-semibold text-base mb-4">AMC Contract Summary – Expired</h3>
      <table className="min-w-[900px] w-full text-sm border">
        <thead className="bg-[#DAD6C9] text-[#C72030]">
          <tr>
            {['Site Name','AMC Name','Contract Start Date','Contract End Date','Renewal Reminder','Projected Renewal Cost (₹)','Vendor Contact','Status'].map(h => (
              <th key={h} className="border px-2 py-2 text-center">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!rows.length ? (
            <tr><td colSpan={8} className="border px-2 py-4 text-center">No data available</td></tr>
          ) : rows.map((r, i) => (
            <tr key={i}>
              <td className="border px-2 py-2 text-left">{r.site_name || r.center_name || r.site || '-'}</td>
              <td className="border px-2 py-2 text-left">{r.amc_name || r.contract_name || r.asset_name || r.service_name || '-'}</td>
              <td className="border px-2 py-2">{r.contract_start_date || r.start_date || ''}</td>
              <td className="border px-2 py-2">{r.contract_end_date || r.end_date || ''}</td>
              <td className="border px-2 py-2">{r.renewal_reminder || r.renewal_alert || r.renewal_status || ''}</td>
              <td className="border px-2 py-2">{Number(r.projected_renewal_cost ?? r.contract_value ?? r.projected_value ?? 0).toLocaleString()}</td>
              <td className="border px-2 py-2">{r.vendor_contact || r.vendor_name || r.vendor_email || r.vendor_details || ''}</td>
              <td className="border px-2 py-2">{r.status || r.contract_status || 'Expired'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AmcExpiredContractsCard;
