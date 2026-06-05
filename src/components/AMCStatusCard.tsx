import React from 'react';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AMCStatusCardProps {
  data: {
    totalAMCs: number;
    activeAMCs: number;
    inactiveAMCs: number;
    criticalAssetsUnderAMC: number;
    missingAMC: number;
    comprehensiveAMCs: number;
    nonComprehensiveAMCs: number;
  } | null;
  className?: string;
  onDownload?: () => Promise<void>;
  colorPalette?: {
    primary: string;
    secondary: string;
    tertiary: string;
    primaryLight: string;
    secondaryLight: string;
    tertiaryLight: string;
  };
  headerClassName?: string;
}

const CARD_COLORS = [
  { bg: '#B7DCD44D', text: '#2E7D6B' },
  { bg: '#E3909026', text: '#D97655' },
  { bg: '#85BDF633', text: '#85BDF6' },
  { bg: '#EFEFFB',   text: '#6B5EA8' },
];

export const AMCStatusCard: React.FC<AMCStatusCardProps> = ({ data, className, onDownload, colorPalette: _colorPalette, headerClassName }) => {
  const { toast } = useToast();

  const cards: Array<{ label: string; value: number; bg: string; text: string; key: string }> = data ? [
    { key: 'total',    label: 'Total AMCs',               value: data.totalAMCs,               ...CARD_COLORS[0] },
    { key: 'active',   label: 'Active',                   value: data.activeAMCs,              ...CARD_COLORS[1] },
    { key: 'inactive', label: 'Inactive',                 value: data.inactiveAMCs,            ...CARD_COLORS[2] },
    { key: 'critical', label: 'Critical Assets Under AMC',value: data.criticalAssetsUnderAMC,  ...CARD_COLORS[3] },
    { key: 'missing',  label: 'Missed Visit',             value: data.missingAMC,              ...CARD_COLORS[0] },
    { key: 'comp',     label: 'Comprehensive',            value: data.comprehensiveAMCs,       ...CARD_COLORS[1] },
    { key: 'noncomp',  label: 'Non-Comprehensive',        value: data.nonComprehensiveAMCs,    ...CARD_COLORS[2] },
  ] : [];

  const handleDownload = async () => {
    if (onDownload) {
      try {
        await onDownload();
        toast({
          title: "Success",
          description: "AMC status data downloaded successfully"
        });
      } catch (error) {
        console.error('Error downloading AMC status data:', error);
        toast({
          title: "Error", 
          description: "Failed to download AMC status data",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6 p-3 sm:p-4 lg:p-6 pb-0">
        <h3 className={`text-sm sm:text-base lg:text-lg font-bold truncate flex-1 ${headerClassName || 'text-[#1A1A1A]'}`}>AMC Status Overview</h3>
        {onDownload && (
          <Download
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:opacity-80 flex-shrink-0 ml-2 text-[#1A1A1A]"
            onClick={handleDownload}
          />
        )}
      </div>

      <div className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6 pt-0">
        {data ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
            {cards.map(card => (
              <div
                key={card.key}
                className="text-center p-2 sm:p-3 lg:p-4 rounded-lg"
                style={{ backgroundColor: card.bg }}
              >
                <div className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: card.text }}>{card.value}</div>
                <div className="text-xs sm:text-sm font-medium mt-1 text-gray-700 line-clamp-2">{card.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
            No AMC status data available for the selected date range
          </div>
        )}
      </div>
    </div>
  );
};
