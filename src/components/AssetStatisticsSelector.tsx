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
  Star,
} from 'lucide-react';
import { assetAnalyticsAPI } from '@/services/assetAnalyticsAPI';

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
  average_customer_rating?: {
    info: string;
    avg_rating: number;
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
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 'assets_in_use',
    label: 'Assets in Use',
    icon: Activity,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    id: 'assets_in_breakdown',
    label: 'Assets in Breakdown',
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  {
    id: 'critical_assets_in_breakdown',
    label: 'Critical Assets in Breakdown',
    icon: TrendingUp,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  {
    id: 'ppm_conduct_assets_count',
    label: 'PPM Assets',
    icon: Wrench,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    id: 'average_customer_rating',
    label: 'Avg. Rating',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
];

export const AssetStatisticsSelector: React.FC<AssetStatisticsSelectorProps> = ({
  dateRange,
  selectedMetrics = ['total_assets_count', 'assets_in_use', 'assets_in_breakdown', 'critical_assets_in_breakdown'],
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
        case 'average_customer_rating':
          return (value as any).avg_rating?.toFixed(1) || 'N/A';
        default:
          return 'N/A';
      }
    }
    
    // Handle legacy format
    if (key === 'total_value') {
      return typeof value === 'string' ? value : `₹${value.toLocaleString()}`;
    }
    
    if (key === 'average_rating' || key === 'average_customer_rating') {
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

    return (
      <Card
        key={metric.id}
        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
          isSelected
            ? `${metric.bgColor} ${metric.borderColor} border-2`
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => handleMetricToggle(metric.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${metric.color}`} />
                <span className="text-sm font-medium text-gray-600">
                  {metric.label}
                </span>
                {isSelected && (
                  <Badge variant="secondary" className="text-xs">
                    Selected
                  </Badge>
                )}
              </div>
              <div className="text-xl font-bold text-gray-900">
                {formatValue(metric.id, value)}
              </div>
            </div>
            {showDownload && onDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(metric.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render layout
  const renderLayout = () => {
    const visibleMetrics = METRICS_CONFIG.filter(metric => {
      const value = getMetricValue(metric.id);
      return value !== undefined && value !== null;
    });

    if (layout === 'horizontal') {
      return (
        <div className="flex flex-wrap gap-4">
          {visibleMetrics.map(renderMetricCard)}
        </div>
      );
    }

    if (layout === 'vertical') {
      return (
        <div className="space-y-4">
          {visibleMetrics.map(renderMetricCard)}
        </div>
      );
    }

    // Default grid layout
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {visibleMetrics.map(renderMetricCard)}
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
