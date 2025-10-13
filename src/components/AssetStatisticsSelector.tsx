import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity,
  TrendingUp,
  AlertTriangle,
  Wrench,
  Package,
  BarChart3,
  Download,
} from 'lucide-react';
import { assetAnalyticsAPI } from '@/services/assetAnalyticsAPI';
import { assetAnalyticsDownloadAPI } from '@/services/assetAnalyticsDownloadAPI';
import { toast } from 'sonner';

interface AssetStatistics {
  total_assets_count?: {
    info: string;
    total_assets_count: number;
  };
  assets_in_use?: {
    info: string;
    total_assets_in_use: number;
  };
  assets_in_breakdown?: {
    info: string;
    total_assets_in_breakdown: number;
  };
  critical_assets_in_breakdown?: {
    info: string;
    total_assets_in_breakdown: number;
  };
  ppm_conduct_assets_count?: {
    info: string;
    overdue_assets: string;
    total: number;
  };
  // Legacy support for transformed data
  total_assets?: number;
  total_value?: string;
  it_assets?: number;
  non_it_assets?: number;
  critical_assets?: number;
  ppm_assets?: number;
  average_rating?: number;
}

interface AssetStatisticsSelectorProps {
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  selectedMetrics?: string[];
  onMetricsChange?: (metrics: string[]) => void;
  onDownload?: (type: string) => void;
  showDownload?: boolean;
  layout?: 'grid' | 'horizontal' | 'vertical';
  className?: string;
}

const METRICS_CONFIG = [
  {
    id: 'total_assets_count',
    label: 'Total Assets',
    icon: Package,
    color: 'text-[#C72030]',
    bgColor: 'bg-[#F6F4EE]',
    borderColor: 'border-gray-200',
    iconBgColor: 'bg-[#C4B89D54]',
    downloadType: 'card_total_assets',
  },
  {
    id: 'assets_in_use',
    label: 'Assets in Use',
    icon: Activity,
    color: 'text-[#C72030]',
    bgColor: 'bg-[#F6F4EE]',
    borderColor: 'border-gray-200',
    iconBgColor: 'bg-[#C4B89D54]',
    downloadType: 'card_assets_in_use',
  },
  {
    id: 'assets_in_breakdown',
    label: 'Assets in Breakdown',
    icon: AlertTriangle,
    color: 'text-[#C72030]',
    bgColor: 'bg-[#F6F4EE]',
    borderColor: 'border-gray-200',
    iconBgColor: 'bg-[#C4B89D54]',
    downloadType: 'card_assets_in_breakdown',
  },
  {
    id: 'critical_assets_in_breakdown',
    label: 'Critical Assets in Breakdown',
    icon: TrendingUp,
    color: 'text-[#C72030]',
    bgColor: 'bg-[#F6F4EE]',
    borderColor: 'border-gray-200',
    iconBgColor: 'bg-[#C4B89D54]',
    downloadType: 'card_critical_assets_in_breakdown',
  },
  {
    id: 'ppm_conduct_assets_count',
    label: 'PPM Conduct Assets',
    icon: Wrench,
    color: 'text-[#C72030]',
    bgColor: 'bg-[#F6F4EE]',
    borderColor: 'border-gray-200',
    iconBgColor: 'bg-[#C4B89D54]',
    downloadType: 'card_ppm_conduct_assets',
  },
];

export const AssetStatisticsSelector: React.FC<AssetStatisticsSelectorProps> = ({
  dateRange,
  selectedMetrics = [
    'total_assets_count', 
    'assets_in_use', 
    'assets_in_breakdown', 
    'critical_assets_in_breakdown', 
    'ppm_conduct_assets_count'
  ],
  onMetricsChange,
  onDownload,
  showDownload = true,
  layout = 'grid',
  className = '',
}) => {
  const [statistics, setStatistics] = useState<AssetStatistics>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSelectedMetrics, setCurrentSelectedMetrics] = useState<string[]>(selectedMetrics);

  // Fetch asset statistics
  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await assetAnalyticsAPI.getAssetStatistics(
        dateRange.startDate,
        dateRange.endDate
      );
      
      // Transform the API response to our interface if needed
      setStatistics(data as AssetStatistics);
    } catch (err) {
      console.error('Error fetching asset statistics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  // Handle metric selection
  const handleMetricToggle = (metricId: string) => {
    const newSelection = currentSelectedMetrics.includes(metricId)
      ? currentSelectedMetrics.filter(id => id !== metricId)
      : [...currentSelectedMetrics, metricId];
    
    setCurrentSelectedMetrics(newSelection);
    if (onMetricsChange) {
      onMetricsChange(newSelection);
    }
  };

  // Handle download for specific metric
  const handleDownload = async (downloadType: string) => {
    try {
      toast.info('Preparing download...');
      
      switch (downloadType) {
        case 'card_total_assets':
          await assetAnalyticsDownloadAPI.downloadCardTotalAssets(dateRange.startDate, dateRange.endDate);
          toast.success('Total assets data downloaded successfully!');
          break;
        case 'card_assets_in_use':
          await assetAnalyticsDownloadAPI.downloadCardAssetsInUse(dateRange.startDate, dateRange.endDate);
          toast.success('Assets in use data downloaded successfully!');
          break;
        case 'card_assets_in_breakdown':
          await assetAnalyticsDownloadAPI.downloadCardAssetsInBreakdown(dateRange.startDate, dateRange.endDate);
          toast.success('Assets in breakdown data downloaded successfully!');
          break;
        case 'card_critical_assets_in_breakdown':
          await assetAnalyticsDownloadAPI.downloadCardCriticalAssetsInBreakdown(dateRange.startDate, dateRange.endDate);
          toast.success('Critical assets in breakdown data downloaded successfully!');
          break;
        case 'card_ppm_conduct_assets':
          await assetAnalyticsDownloadAPI.downloadCardPPMConductAssets(dateRange.startDate, dateRange.endDate);
          toast.success('PPM conduct assets data downloaded successfully!');
          break;
        default:
          toast.info('Download not available for this metric');
      }
    } catch (error) {
      console.error('Error downloading data:', error);
      toast.error('Failed to download data. Please try again.');
    }
  };

  // Format values
  const formatValue = (key: string, value: number | string | object | undefined) => {
    if (value === undefined || value === null) return 'N/A';
    
    // Handle new API structure
    if (typeof value === 'object' && value !== null) {
      switch (key) {
        case 'total_assets_count':
          return (value as any).total_assets_count?.toLocaleString() || 'N/A';
        case 'assets_in_use':
          return (value as any).total_assets_in_use?.toLocaleString() || 'N/A';
        case 'assets_in_breakdown':
          return (value as any).total_assets_in_breakdown?.toLocaleString() || 'N/A';
        case 'critical_assets_in_breakdown':
          return (value as any).total_assets_in_breakdown?.toLocaleString() || 'N/A';
        case 'ppm_conduct_assets_count':
          return (value as any).total?.toLocaleString() || 'N/A';
        default:
          return 'N/A';
      }
    }
    
    // Handle legacy format
    if (key === 'total_value') {
      return typeof value === 'string' ? value : `₹${value.toLocaleString()}`;
    }
    
    if (key === 'average_rating') {
      return typeof value === 'number' ? value.toFixed(1) : value;
    }
    
    return typeof value === 'number' ? value.toLocaleString() : value;
  };

  // Extract metric value from statistics
  const getMetricValue = (metricId: string) => {
    return statistics[metricId as keyof AssetStatistics];
  };

  // Effects
  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  // Render loading state
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Asset Statistics</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="text-sm">Failed to load asset statistics: {error}</p>
          <button
            onClick={fetchStatistics}
            className="text-red-800 underline text-sm mt-1 hover:text-red-900"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render metric cards
  const renderMetricCard = (metric: typeof METRICS_CONFIG[0]) => {
    const isSelected = currentSelectedMetrics.includes(metric.id);
    const value = getMetricValue(metric.id);
    const Icon = metric.icon;
    const hasDownload = metric.downloadType !== 'average_rating';
    const displayValue = formatValue(metric.id, value);
    const isDataAvailable = displayValue !== 'N/A' && displayValue !== '0';

    return (
      <div
        key={metric.id}
        className={`group ${metric.bgColor} p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow ${
          isSelected
            ? "shadow-lg"
            : ""
        } ${!isDataAvailable ? 'opacity-60' : ''}`}
        onClick={() => handleMetricToggle(metric.id)}
      >
        <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
          <Icon className="w-6 h-6 text-[#C72030]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-[#1A1A1A]">
              {metric.label}
            </span>
            {isSelected && (
              <Badge variant="secondary" className="text-xs">
                Selected
              </Badge>
            )}
          </div>
          <div className="text-2xl font-semibold text-[#1A1A1A]">
            {displayValue}
          </div>
          {!isDataAvailable && (
            <div className="text-xs text-gray-500">
              No data available for the selected period
            </div>
          )}
        </div>
        {hasDownload && showDownload && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(metric.downloadType);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-gray-100"
            title={`Download ${metric.label} data`}
            disabled={!isDataAvailable}
          >
            <Download className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  };

  // Render layout
  const renderLayout = () => {
    // Always show all 6 metrics in the configured order, even if some have no data
    const allMetrics = METRICS_CONFIG;

    if (layout === 'horizontal') {
      return (
        <div className="flex flex-wrap gap-4">
          {allMetrics.map(renderMetricCard)}
        </div>
      );
    }

    if (layout === 'vertical') {
      return (
        <div className="space-y-4">
          {allMetrics.map(renderMetricCard)}
        </div>
      );
    }

    // Default grid layout - responsive grid for 5 cards
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[300px]">
        {allMetrics.map(renderMetricCard)}
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Asset Statistics</h3>
          <p className="text-sm text-gray-600">
            Data from {dateRange.startDate.toLocaleDateString()} to {dateRange.endDate.toLocaleDateString()}
          </p>
        </div>
        {showDownload && onDownload && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload('all')}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download All
          </Button>
        )}
      </div> */}

      {renderLayout()}

      {/* {currentSelectedMetrics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Selected metrics:</span>
          {currentSelectedMetrics.map(metricId => {
            const metric = METRICS_CONFIG.find(m => m.id === metricId);
            return metric ? (
              <Badge key={metricId} variant="secondary" className="text-xs">
                {metric.label}
              </Badge>
            ) : null;
          })}
        </div>
      )} */}
    </div>
  );
};

export default AssetStatisticsSelector;
