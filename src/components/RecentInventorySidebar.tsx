import React, { useState } from 'react';
import { MessageSquare, Flag, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AddCommentModal } from './AddCommentModal';

interface InventoryItem {
  id: string;
  name: string;
  group: string;
  subGroup: string;
  criticality: 'Critical' | 'Non-Critical';
  quantity: string;
  stockStatus: 'Low' | 'Normal' | 'High';
  value: number;
  lastActivity: string;
  tat: number;
}

interface RecentInventorySidebarProps {
  className?: string;
}

export const RecentInventorySidebar: React.FC<RecentInventorySidebarProps> = ({
  className = ''
}) => {
  const [flaggedItems, setFlaggedItems] = useState<Set<string>>(new Set());
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem("sidebarCollapsed") === "true"; } catch { return false; }
  });

  const recentInventory: InventoryItem[] = [
    {
      id: '97100',
      name: 'test12',
      group: 'CCTV',
      subGroup: 'CCTV Camera',
      criticality: 'Critical',
      quantity: '8.0',
      stockStatus: 'Normal',
      value: 15000,
      lastActivity: '2 hours ago',
      tat: 2
    },
    {
      id: '96856',
      name: 'Test Abhi',
      group: 'Security',
      subGroup: 'Access Control',
      criticality: 'Critical',
      quantity: '10.0',
      stockStatus: 'High',
      value: 25000,
      lastActivity: '4 hours ago',
      tat: 1
    },
    {
      id: '96067',
      name: 'Laptop',
      group: 'Electronic Devices',
      subGroup: 'Laptops',
      criticality: 'Non-Critical',
      quantity: '46.0',
      stockStatus: 'Normal',
      value: 920000,
      lastActivity: '1 day ago',
      tat: 5
    },
    {
      id: '96855',
      name: 'Test Tap',
      group: 'Daikin',
      subGroup: 'Daikin AC',
      criticality: 'Non-Critical',
      quantity: '0.0',
      stockStatus: 'Low',
      value: 0,
      lastActivity: '2 days ago',
      tat: 8
    },
    {
      id: '69988',
      name: 'Drainex Power',
      group: 'Cleaning',
      subGroup: 'Housekeeping',
      criticality: 'Non-Critical',
      quantity: '64.0',
      stockStatus: 'High',
      value: 115200,
      lastActivity: '3 days ago',
      tat: 3
    }
  ];

  const handleFlagToggle = (itemId: string) => {
    const newFlaggedItems = new Set(flaggedItems);
    if (newFlaggedItems.has(itemId)) {
      newFlaggedItems.delete(itemId);
    } else {
      newFlaggedItems.add(itemId);
    }
    setFlaggedItems(newFlaggedItems);
  };

  const handleAddComment = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowCommentModal(true);
  };

  const handleViewDetails = (itemId: string) => {
    window.location.href = `/maintenance/inventory/details/${itemId}`;
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'Low': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'Normal': return 'bg-secondary/20 text-secondary-foreground border-secondary/30';
      case 'High': return 'bg-green-500/20 text-green-700 border-green-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'Critical': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'Non-Critical': return 'bg-muted/20 text-muted-foreground border-muted/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getTatColor = (tat: number) => {
    if (tat <= 2) return 'text-green-600';
    if (tat <= 5) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div
      className="bg-white border flex flex-col transition-all duration-300"
      style={{
        boxShadow: "0px 4px 14.2px 0px #0000001A",
        width: isCollapsed ? 48 : 350,
        minWidth: isCollapsed ? 48 : 350,
        maxWidth: isCollapsed ? 48 : 350,
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-3 py-3 border-b border-gray-100 flex-shrink-0 ${isCollapsed ? "flex-col gap-2" : ""}`}>
        {!isCollapsed && (
          <h3 className="text-base font-semibold" style={{ color: "#c72030" }}>Recent Inventory</h3>
        )}
        <button
          onClick={() => setIsCollapsed((v) => {
            const next = !v;
            try { localStorage.setItem("sidebarCollapsed", String(next)); } catch {}
            return next;
          })}
          title={isCollapsed ? "Expand" : "Collapse"}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Collapsed vertical label */}
      {isCollapsed && (
        <div className="flex-1 flex items-center justify-center">
          <span
            className="text-xs font-semibold tracking-widest"
            style={{ writingMode: "vertical-rl", color: "#c72030", transform: "rotate(180deg)" }}
          >
            Recent Inventory
          </span>
        </div>
      )}

      {!isCollapsed && (
      <div className="flex-1 space-y-4 overflow-y-auto p-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {recentInventory.map((item) => (
          <div
            key={item.id}
            className="bg-background/40 backdrop-blur-sm rounded-lg p-4 border border-primary/10 hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-foreground">{item.name}</h4>
                <p className="text-xs text-muted-foreground">ID: {item.id}</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => handleAddComment(item)}
                >
                  <MessageSquare className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-7 w-7 p-0 ${flaggedItems.has(item.id) ? 'text-amber-500' : ''}`}
                  onClick={() => handleFlagToggle(item.id)}
                >
                  <Flag className={`h-3 w-3 ${flaggedItems.has(item.id) ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => handleViewDetails(item.id)}
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={getCriticalityColor(item.criticality)}>
                  {item.criticality}
                </Badge>
                <Badge variant="outline" className={getStockStatusColor(item.stockStatus)}>
                  {item.stockStatus} Stock
                </Badge>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Group:</span>
                  <span className="font-medium">{item.group || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sub Group:</span>
                  <span className="font-medium">{item.subGroup || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="font-medium">{item.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Value:</span>
                  <span className="font-medium">${localStorage.getItem('currency')}{item.value.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-2 border-t border-primary/10">
              <span className="text-muted-foreground">{item.lastActivity}</span>
              <span className={`font-medium ${getTatColor(item.tat)}`}>
                TAT: {item.tat}d
              </span>
            </div>
          </div>
        ))}
      </div>
      )}

      <AddCommentModal
        open={showCommentModal}
        onOpenChange={setShowCommentModal}
        title={`Add Comment - ${selectedItem?.name || ''}`}
        itemType="inventory"
      />
    </div>
  );
};