import React from 'react';

interface Props { data: any }

// AMC Contract Summary (counts row only)
const AmcContractSummaryCard: React.FC<Props> = ({ data }) => {
  const root = data ?? {};

  // Compute totals with defensive parsing following AllContent logic
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

  return (
    <div className="bg-white border border-gray-200 rounded-md">
      <div className="bg-[#DAD6C9] text-[#C72030] px-4 py-3 font-semibold">AMC Contract Summary</div>
      <div className="grid grid-cols-3 text-center bg-[#f2f0eb]">
        <div className="py-4 border-r">
          <div className="text-xs text-gray-600">Active AMC Contracts</div>
          <div className="text-2xl font-bold text-[#C72030]">{summary.active.toLocaleString()}</div>
        </div>
        <div className="py-4 border-r">
          <div className="text-xs text-gray-600">Contract Expiry in 90 Days</div>
          <div className="text-2xl font-bold text-[#C72030]">{summary.expiry90.toLocaleString()}</div>
        </div>
        <div className="py-4">
          <div className="text-xs text-gray-600">Contract Expired</div>
          <div className="text-2xl font-bold text-[#C72030]">{summary.expired.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default AmcContractSummaryCard;
