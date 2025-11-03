import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Activity,
  TrendingUp,
  AlertTriangle,
  Wrench,
  Package,
  BarChart3,
  Download,
  Info,
} from 'lucide-react';
import { assetAnalyticsAPI } from '@/services/assetAnalyticsAPI';
import { assetAnalyticsDownloadAPI } from '@/services/assetAnalyticsDownloadAPI';
import { toast } from 'sonner';

interface AssetStatistics {
  total_assets?: {
    assets_total_count: number;
    assets_total_count_info: string;
  };
  total_assets_count?: {
    info: string;
    total_assets_count: number;
  };
  assets_in_use?: {
    assets_in_use_total: number;
    assets_in_use_info: string;
  };
  assets_in_breakdown?: {
    assets_in_breakdown_total: number;
    assets_in_breakdown_info: string;
  };
  critical_assets_breakdown?: {
    critical_assets_breakdown_total: number;
    critical_assets_breakdown_info: string;
  };
  ppm_conduct_assets_count?: {
    // info: string;
    // overdue_assets: string;
    // total: number;
    ppm_conduct_assets_count:number;
    ppm_conduct_assets_info: string;
  };
  ppm_overdue_assets?: {
    ppm_conduct_assets_count: number;
    ppm_conduct_assets_info: {
      info: string;
      total: number;
    };
  };
  amc_assets?: {
    assets_under_amc: number;
    assets_missing_amc: number;
    info: string;
  };
  // Legacy support for transformed data
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
  {
    id: 'amc_assets',
    label: 'AMC Assets',
    icon: BarChart3,
    color: 'text-[#C72030]',
    bgColor: 'bg-[#F6F4EE]',
    borderColor: 'border-gray-200',
    iconBgColor: 'bg-[#C4B89D54]',
    downloadType: 'card_amc_assets',
  },
];

export const AssetStatisticsSelector: React.FC<AssetStatisticsSelectorProps> = ({
  dateRange,
  selectedMetrics = [
    'total_assets_count', 
    'assets_in_use', 
    'assets_in_breakdown', 
    'critical_assets_in_breakdown', 
    'ppm_conduct_assets_count',
    'amc_assets'
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
      // Handle new API structure where each field contains both count and info
      const transformedData: AssetStatistics = {
        ...data,
        // Keep the original structures for new API
        total_assets: data.total_assets,
        assets_in_use: data.assets_in_use,
        assets_in_breakdown: data.assets_in_breakdown,
        critical_assets_breakdown: data.critical_assets_breakdown,
        ppm_overdue_assets: data.ppm_overdue_assets,
        // Transform ppm_conduct_assets_count to match our interface
        ppm_conduct_assets_count: data.ppm_conduct_assets_count ? {
          ppm_conduct_assets_count: (data.ppm_conduct_assets_count as any)?.total || 0,
          ppm_conduct_assets_info: (data.ppm_conduct_assets_count as any)?.info || ''
        } : undefined,
        // Also map to old structure for compatibility
        total_assets_count: data.total_assets ? {
          info: data.total_assets.assets_total_count_info || '',
          total_assets_count: data.total_assets.assets_total_count || 0
        } : data.total_assets_count
      };
      setStatistics(transformedData);
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
        case 'card_amc_assets':
          await assetAnalyticsDownloadAPI.downloadCardAMCAssets(dateRange.startDate, dateRange.endDate);
          toast.success('AMC assets data downloaded successfully!');
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
          // Check for new structure first, then fallback to old structure
          return (value as any).assets_total_count?.toLocaleString() || 
                 (value as any).total_assets_count?.toLocaleString() || 'N/A';
        case 'assets_in_use':
          return (value as any).assets_in_use_total?.toLocaleString() || 'N/A';
        case 'assets_in_breakdown':
          return (value as any).assets_in_breakdown_total?.toLocaleString() || 'N/A';
        case 'critical_assets_in_breakdown':
          return (value as any).critical_assets_breakdown_total?.toLocaleString() || 'N/A';
        case 'ppm_conduct_assets_count':
          // Check for new structure first, then fallback to old structure
          return (value as any).ppm_conduct_assets_count?.toLocaleString() || 
                 (value as any).total?.toLocaleString() || 'N/A';
        case 'amc_assets':
          // Special handling for AMC assets - return the object itself
          return value;
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
    switch (metricId) {
      case 'total_assets_count':
        return statistics.total_assets || statistics.total_assets_count;
      case 'assets_in_use':
        return statistics.assets_in_use;
      case 'assets_in_breakdown':
        return statistics.assets_in_breakdown;
      case 'critical_assets_in_breakdown':
        return statistics.critical_assets_breakdown;
      case 'ppm_conduct_assets_count':
        return statistics.ppm_overdue_assets || statistics.ppm_conduct_assets_count;
      case 'amc_assets':
        return statistics.amc_assets;
      default:
        return statistics[metricId as keyof AssetStatistics];
    }
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

    // Special rendering for AMC Assets card with two values
    if (metric.id === 'amc_assets' && value && typeof value === 'object') {
      const amcData = value as { assets_under_amc?: number; assets_missing_amc?: number; info?: string };
      const underAmc = amcData.assets_under_amc ?? 0;
      const missingAmc = amcData.assets_missing_amc ?? 0;
      const hasData = underAmc > 0 || missingAmc > 0;

      return (
        <div
          key={metric.id}
          className={`group relative bg-[#F6F4EE] rounded-lg border border-[#E5E5E5] hover:shadow-md transition-all duration-200 overflow-hidden ${
            !hasData ? 'opacity-60' : ''
          }`}
        >
          <div className="p-6">
            {/* Icon and Actions Row */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#C4B89D54] flex items-center justify-center">
                <Icon className="w-6 h-6 text-[#C72030]" />
              </div>
              <div className="flex items-center gap-1">
                {amcData.info && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-white/50"
                        >
                          <Info className="w-4 h-4 text-[#6B7280]" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-white border-gray-700 max-w-xs">
                        <p className="text-sm font-medium">{amcData.info}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {hasDownload && showDownload && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(metric.downloadType);
                    }}
                    className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-white/50"
                    title={`Download ${metric.label} data`}
                    disabled={!hasData}
                  >
                    <Download className="w-4 h-4 text-[#C72030]" />
                  </Button>
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-sm font-medium text-[#6B7280] leading-tight mb-4">
              {metric.label}
            </h3>

            {/* Two-part divided display */}
            <div className="grid grid-cols-2 gap-3">
              {/* Assets Under AMC */}
              <div className="border-r border-gray-300 pr-3">
                <div className="text-xs text-[#6B7280] mb-1">Assets Under AMC</div>
                <div className="text-2xl font-semibold text-[#1F2937]">
                  {underAmc.toLocaleString()}
                </div>
              </div>
              {/* Assets Missing AMC */}
              <div className="pl-3">
                <div className="text-xs text-[#6B7280] mb-1">Assets Missing AMC</div>
                <div className="text-2xl font-semibold text-[#1F2937]">
                  {missingAmc.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={metric.id}
        className={`group relative bg-[#F6F4EE] rounded-lg border border-[#E5E5E5] hover:shadow-md transition-all duration-200 overflow-hidden ${
          !isDataAvailable ? 'opacity-60' : ''
        }`}
      >
        {/* Card Content */}
        <div className="p-6">
          {/* Icon and Actions Row */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#C4B89D54] flex items-center justify-center">
              <Icon className="w-6 h-6 text-[#C72030]" />
            </div>
            <div className="flex items-center gap-1">
              {/* Info tooltip for each metric */}
              {metric.id === 'total_assets_count' && statistics.total_assets?.assets_total_count_info && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-white/50"
                      >
                        <Info className="w-4 h-4 text-[#6B7280]" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white border-gray-700 max-w-xs">
                      <p className="text-sm font-medium">
                        {statistics.total_assets.assets_total_count_info}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {metric.id === 'assets_in_use' && statistics.assets_in_use?.assets_in_use_info && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-white/50"
                      >
                        <Info className="w-4 h-4 text-[#6B7280]" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white border-gray-700 max-w-xs">
                      <p className="text-sm font-medium">
                        {statistics.assets_in_use.assets_in_use_info}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {metric.id === 'assets_in_breakdown' && statistics.assets_in_breakdown?.assets_in_breakdown_info && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-white/50"
                      >
                        <Info className="w-4 h-4 text-[#6B7280]" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white border-gray-700 max-w-xs">
                      <p className="text-sm font-medium">
                        {statistics.assets_in_breakdown.assets_in_breakdown_info}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {metric.id === 'critical_assets_in_breakdown' && statistics.critical_assets_breakdown?.critical_assets_breakdown_info && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-white/50"
                      >
                        <Info className="w-4 h-4 text-[#6B7280]" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white border-gray-700 max-w-xs">
                      <p className="text-sm font-medium">
                        {statistics.critical_assets_breakdown.critical_assets_breakdown_info}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {metric.id === 'ppm_conduct_assets_count' && (statistics.ppm_overdue_assets?.ppm_conduct_assets_info?.info || statistics.ppm_conduct_assets_count?.ppm_conduct_assets_info) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-white/50"
                      >
                        <Info className="w-4 h-4 text-[#6B7280]" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white border-gray-700 max-w-xs">
                      <p className="text-sm font-medium">
                        {statistics.ppm_overdue_assets?.ppm_conduct_assets_info?.info || statistics.ppm_conduct_assets_count?.ppm_conduct_assets_info}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {hasDownload && showDownload && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(metric.downloadType);
                  }}
                  className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-white/50"
                  title={`Download ${metric.label} data`}
                  disabled={!isDataAvailable}
                >
                  <Download className="w-4 h-4 text-[#C72030]" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Title and Value */}
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-[#6B7280] leading-tight">
              {metric.label}
            </h3>
            <div className="text-3xl font-semibold text-[#1F2937]">
              {displayValue}
            </div>
          
          </div>
        </div>
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

    // Default grid layout - responsive grid for 6 cards
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
            <Download className="w-4 h-4 !text-[#C72030]" style={{ color: '#C72030' }} />
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
