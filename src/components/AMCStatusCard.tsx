import React from 'react';
import { ANALYTICS_PALETTE } from '@/styles/chartPalette';
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
}

export const AMCStatusCard: React.FC<AMCStatusCardProps> = ({ data, className, onDownload }) => {
  const { toast } = useToast();

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

  // Force explicit palette order per requirement
  const BASE_COLORS = ['#C4B89D', '#D5DBDB', '#C4AE9D', '#C4AE9D'];
  const toBg = (hex: string) => {
    // Generate a subtle translucent background from hex
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r}, ${g}, ${b}, 0.18)`;
  };

  const cards: Array<{ label: string; value: number; color: string; key: string }> = data ? [
    { key: 'total', label: 'Total AMCs', value: data.totalAMCs, color: BASE_COLORS[0] },
    { key: 'active', label: 'Active', value: data.activeAMCs, color: BASE_COLORS[1] },
    { key: 'inactive', label: 'Inactive', value: data.inactiveAMCs, color: BASE_COLORS[2] },
    { key: 'critical', label: 'Critical Assets Under AMC', value: data.criticalAssetsUnderAMC, color: BASE_COLORS[3] },
    { key: 'missing', label: 'Missing AMC', value: data.missingAMC, color: BASE_COLORS[0] },
    { key: 'comp', label: 'Comprehensive', value: data.comprehensiveAMCs, color: BASE_COLORS[1] },
    { key: 'noncomp', label: 'Non-Comprehensive', value: data.nonComprehensiveAMCs, color: BASE_COLORS[2] },
  ] : [];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6 p-3 sm:p-4 lg:p-6 pb-0">
        <h3 className="text-sm sm:text-base lg:text-lg font-bold text-black truncate flex-1">AMC Status Overview</h3>
        {onDownload && (
          <Download
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:opacity-80 text-black flex-shrink-0 ml-2"
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
                className="text-center p-2 sm:p-3 lg:p-4 rounded-lg border shadow-sm"
                style={{ background: toBg(card.color), borderColor: card.color + '55' }}
              >
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-black">{card.value}</div>
                <div className="text-xs sm:text-sm font-medium mt-1 text-black line-clamp-2">{card.label}</div>
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
