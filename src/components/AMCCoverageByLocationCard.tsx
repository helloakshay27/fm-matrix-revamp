import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, MapPin, ChevronRight, ChevronDown, Building2, Home, Map } from 'lucide-react';
import { AMCLocationCoverageNode } from '@/services/amcAnalyticsAPI';

interface AMCCoverageByLocationCardProps {
  data: AMCLocationCoverageNode[] | null;
  onDownload: () => Promise<void>;
}

interface ExpandedNodes {
  [key: string]: boolean;
}

export function AMCCoverageByLocationCard({ data, onDownload }: AMCCoverageByLocationCardProps) {
  const [expandedNodes, setExpandedNodes] = useState<ExpandedNodes>({});

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const getLocationIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'site':
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'building':
        return <Home className="w-4 h-4 text-green-600" />;
      case 'floor':
        return <Map className="w-4 h-4 text-purple-600" />;
      default:
        return <MapPin className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCoverageColor = (coveragePercentage: number) => {
    if (coveragePercentage >= 80) return 'text-green-600 bg-green-50';
    if (coveragePercentage >= 60) return 'text-yellow-600 bg-yellow-50';
    if (coveragePercentage >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const renderLocationNode = (node: AMCLocationCoverageNode, level: number = 0, parentId: string = '') => {
    const nodeId = `${parentId}-${node.name}-${level}`;
    const isExpanded = expandedNodes[nodeId];
    const hasChildren = node.children && node.children.length > 0;

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
              {getLocationIcon(node.level)}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{node.name}</div>
              <div className="text-sm text-gray-500 capitalize">{node.level}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{node.total}</div>
              <div className="text-xs text-gray-500">Assets</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{node.covered}</div>
              <div className="text-xs text-gray-500">Under AMC</div>
            </div>
            <div className="text-center">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCoverageColor(node.percent)}`}>
                {node.percent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2">
            {node.children!.map(child => renderLocationNode(child, level + 1, nodeId))}
          </div>
        )}
      </div>
    );
  };

  // Calculate summary statistics
  const totalLocations = data?.length || 0;
  const totalAssets = data?.reduce((sum, location) => sum + location.total, 0) || 0;
  const totalAssetsUnderAMC = data?.reduce((sum, location) => sum + location.covered, 0) || 0;
  const overallCoverage = totalAssets > 0 ? (totalAssetsUnderAMC / totalAssets) * 100 : 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
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
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Locations</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">{totalLocations}</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Home className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">Total Assets</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalAssets}</div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Under AMC</span>
            </div>
            <div className="text-2xl font-bold text-green-900">{totalAssetsUnderAMC}</div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Map className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Coverage</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">{overallCoverage.toFixed(1)}%</div>
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
          {!data || data.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No location coverage data available</p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-auto">
              {data.map(location => renderLocationNode(location))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
