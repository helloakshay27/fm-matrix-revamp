import React from 'react';
import { Download } from 'lucide-react';

interface Props { 
  data: any;
  onDownload?: () => void;
}

// AMC Contract Summary (counts row only)
const AmcContractSummaryCard: React.FC<Props> = ({ data, onDownload }) => {
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
    <div className="bg-white border border-gray-200 rounded-md p-4 overflow-x-auto">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200 -mx-4 px-4 pt-3">
        <h3 className="flex-1"
          style={{
            fontFamily: 'Work Sans, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '100%',
            letterSpacing: '0%'
          }}
        >
          AMC Contract Summary
        </h3>
        {onDownload && (
          <Download
            data-no-drag="true"
            className="w-5 h-5 cursor-pointer text-[#000000] hover:text-[#333333] transition-colors z-50 flex-shrink-0"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDownload();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            style={{ pointerEvents: 'auto' }}
          />
        )}
      </div>
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
    </div>
  );
};

export default AmcContractSummaryCard;
