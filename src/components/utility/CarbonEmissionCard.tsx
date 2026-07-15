import React from 'react';

interface Props { data: any }

const CARD_STYLES = [
  { bg: '#EFEFFB', numColor: '#6B5EA8' },
  { bg: 'rgba(183,220,212,0.30)', numColor: '#2E7D6B' },
];

const CarbonEmissionCard: React.FC<Props> = ({ data }) => {
  const root = data?.data ?? data ?? {};
  const kpi = root?.response ?? root ?? {};

  const formatCo2 = (val: any) =>
    val ? `${Number(val).toLocaleString(undefined, { maximumFractionDigits: 2 })} kg CO2` : '0 kg CO2';

  const stats = [
    { label: 'Scope 1 (DG Diesel)', value: formatCo2(kpi.scope1) },
    { label: 'Scope 2 (Grid Electricity)', value: formatCo2(kpi.scope2) },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Carbon Emission Scopes
        </h3>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((s, i) => {
            const style = CARD_STYLES[i % CARD_STYLES.length];
            return (
              <div
                key={s.label}
                className="rounded-2xl px-4 py-6 text-center"
                style={{ backgroundColor: style.bg }}
              >
                <div
                  className="text-xl font-bold mb-1 break-words leading-tight"
                  style={{ color: style.numColor, fontFamily: 'Work Sans, sans-serif' }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-gray-500 mt-1 leading-snug">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CarbonEmissionCard;
