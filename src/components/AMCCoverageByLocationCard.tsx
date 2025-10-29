import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, MapPin, ChevronRight, ChevronDown, Building2, Home, Map } from 'lucide-react';
import { AMCLocationCoverageNode } from '@/services/amcAnalyticsAPI';

interface AMCCoverageByLocationCardProps {
  data: AMCLocationCoverageNode[] | null;
  onDownload: () => Promise<void>;
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

interface ExpandedNodes {
  [key: string]: boolean;
}

export function AMCCoverageByLocationCard({ data, onDownload, colorPalette, headerClassName }: AMCCoverageByLocationCardProps) {
  const [expandedNodes, setExpandedNodes] = useState<ExpandedNodes>({});

  const palette = colorPalette || {
    primary: '#C4B99D',
    secondary: '#DAD6CA',
    tertiary: '#D5DBDB',
    primaryLight: '#DDD4C4',
    secondaryLight: '#E8E5DD',
    tertiaryLight: '#E5E9E9',
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Safely map level to an icon (handles undefined/null)
  const getLocationIcon = (level?: string) => {
    const l = String(level || '').toLowerCase();
    switch (l) {
      case 'site':
        return <Building2 className="w-4 h-4" style={{ color: palette.primaryLight }} />;
      case 'building':
        return <Home className="w-4 h-4" style={{ color: palette.primary }} />;
      case 'floor':
        return <Map className="w-4 h-4" style={{ color: palette.secondary }} />;
      default:
        return <MapPin className="w-4 h-4" style={{ color: palette.tertiary }} />;
    }
  };

  // Safely compute coverage color
  const getCoverageColor = (coveragePercentage?: number) => {
    const p = Number(coveragePercentage ?? 0);
    if (p >= 80) return 'text-green-600 bg-green-50';
    if (p >= 60) return 'text-yellow-600 bg-yellow-50';
    if (p >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const renderLocationNode = (node: AMCLocationCoverageNode, level: number = 0, parentId: string = '') => {
    const nodeId = `${parentId}-${String((node as any)?.name ?? 'node')}-${level}`;
    const isExpanded = expandedNodes[nodeId];
    const hasChildren = Array.isArray((node as any)?.children) && (node as any).children.length > 0;

    // Safe numeric values
    const total = Number((node as any)?.total ?? 0);
    const covered = Number((node as any)?.covered ?? 0);
    const percent = Number.isFinite(Number((node as any)?.percent))
      ? Number((node as any)?.percent)
      : (total > 0 ? (covered / total) * 100 : 0);

    return (
      <div key={nodeId} className="mb-2">
        <div 
          className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer ${
            level === 0 ? 'bg-blue-50 border-l-4 border-blue-200' : 
            level === 1 ? 'bg-green-50 border-l-4 border-green-200 ml-4' : 
            'bg-purple-50 border-l-4 border-purple-200 ml-8'
          }`}
          onClick={() => hasChildren && toggleNode(nodeId)}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              {hasChildren && (
                isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
              {getLocationIcon((node as any)?.level)}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{(node as any)?.name ?? '—'}</div>
              <div className="text-sm text-gray-500 capitalize">{(node as any)?.level ?? 'location'}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{total}</div>
              <div className="text-xs text-gray-500">Assets</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{covered}</div>
              <div className="text-xs text-gray-500">Under AMC</div>
            </div>
            <div className="text-center">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCoverageColor(percent)}`}>
                {percent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2">
            {(node as any).children!.map((child: AMCLocationCoverageNode, idx: number) => (
              <React.Fragment key={`${nodeId}-${idx}`}>
                {renderLocationNode(child, level + 1, nodeId)}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Calculate summary statistics safely
  const totalLocations = Array.isArray(data) ? data.length : 0;
  const totalAssets = (Array.isArray(data) ? data : []).reduce((sum, location: any) => sum + Number(location?.total ?? 0), 0);
  const totalAssetsUnderAMC = (Array.isArray(data) ? data : []).reduce((sum, location: any) => sum + Number(location?.covered ?? 0), 0);
  const overallCoverage = totalAssets > 0 ? (totalAssetsUnderAMC / totalAssets) * 100 : 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${headerClassName || 'text-[#1A1A1A]'}`}> 
            <MapPin className="w-5 h-5" style={{ color: palette.tertiary }} />
            Coverage by Location
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            data-download-button
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-3 rounded-lg" style={{ background: palette.primaryLight }}>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4" style={{ color: palette.primaryLight }} />
              <span className="text-sm font-medium text-[#1A1A1A]">Locations</span>
            </div>
            <div className="text-2xl font-bold text-[#1A1A1A]">{totalLocations}</div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: palette.primary }}>
            <div className="flex items-center gap-2 mb-1">
              <Home className="w-4 h-4" style={{ color: palette.primary }} />
              <span className="text-sm font-medium text-[#1A1A1A]">Total Assets</span>
            </div>
            <div className="text-2xl font-bold text-[#1A1A1A]">{totalAssets}</div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: palette.tertiary }}>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4" style={{ color: palette.tertiary }} />
              <span className="text-sm font-medium text-[#1A1A1A]">Under AMC</span>
            </div>
            <div className="text-2xl font-bold text-[#1A1A1A]">{totalAssetsUnderAMC}</div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: palette.secondary }}>
            <div className="flex items-center gap-2 mb-1">
              <Map className="w-4 h-4" style={{ color: palette.secondary }} />
              <span className="text-sm font-medium text-[#1A1A1A]">Coverage</span>
            </div>
            <div className="text-2xl font-bold text-[#1A1A1A]">{overallCoverage.toFixed(1)}%</div>
          </div>
        </div>

        {/* Coverage Legend */}
        <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700">Coverage Levels:</div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <span className="text-xs text-gray-600">80%+</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-200 rounded"></div>
            <span className="text-xs text-gray-600">60-79%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-200 rounded"></div>
            <span className="text-xs text-gray-600">40-59%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-200 rounded"></div>
            <span className="text-xs text-gray-600">&lt;40%</span>
          </div>
        </div>

        {/* Location Tree */}
        <div className="flex-1 overflow-hidden">
          {!data || (Array.isArray(data) ? data.length === 0 : false) ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No location coverage data available</p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-auto">
              {(() => {
                const list = Array.isArray(data) ? data : (data ? [data as any] : []);
                return list.map((location, idx) => (
                  <React.Fragment key={`root-${idx}`}>
                    {renderLocationNode(location as any)}
                  </React.Fragment>
                ));
              })()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
