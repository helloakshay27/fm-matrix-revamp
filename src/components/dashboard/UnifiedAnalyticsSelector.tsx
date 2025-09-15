// new comment //
import React, { useState } from 'react';
import { ChevronDown, BarChart3, Activity, Calendar, Package, Settings, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface SelectedAnalytic {
  id: string;
  module: 'tickets' | 'tasks' | 'schedule' | 'inventory' | 'amc' | 'assets' | 'meeting_room' | 'community' | 'helpdesk' | 'asset_management' | 'inventory_management' | 'consumables_overview' | 'parking_management' | 'visitor_management' | 'checklist_management';
  endpoint: string;
  title: string;
}

interface UnifiedAnalyticsSelectorProps {
  selectedAnalytics: SelectedAnalytic[];
  onSelectionChange: (analytics: SelectedAnalytic[]) => void;
}

const analyticsOptions = {
  tickets: {
    icon: Activity,
    label: 'Tickets',
    color: '#C72030',
    options: [
      { id: 'tickets_categorywise', endpoint: 'tickets_categorywise', label: 'Category-wise Tickets' },
      { id: 'ticket_status', endpoint: 'ticket_status', label: 'Ticket Status Overview' },
      { id: 'tickets_proactive_reactive', endpoint: 'tickets_proactive_reactive', label: 'Proactive/Reactive Tickets' },
      { id: 'ticket_aging_matrix', endpoint: 'ticket_aging_matrix', label: 'Ticket Aging Matrix' },
      { id: 'unit_categorywise', endpoint: 'unit_categorywise', label: 'Unit Category-wise' },
      { id: 'response_tat', endpoint: 'response_tat', label: 'Response TAT Report' },
      { id: 'resolution_tat', endpoint: 'resolution_tat', label: 'Resolution TAT Report' },
    ]
  },
  assets: {
    icon: Package,
    label: 'Assets',
    color: '#06B6D4',
    options: [
      { id: 'assets_status', endpoint: 'asset_status', label: 'Asset Status Distribution' },
      { id: 'assets_statistics', endpoint: 'asset_statistics', label: 'Asset Statistics Overview' },
      { id: 'assets_group_wise', endpoint: 'group_wise', label: 'Assets Group-Wise' },
      { id: 'assets_category_wise', endpoint: 'category_wise', label: 'Category Wise Assets' },
      { id: 'assets_distribution', endpoint: 'asset_distribution', label: 'Asset Distribution (IT vs Non-IT)' },
    ]
  },
  tasks: {
    icon: CheckSquare,
    label: 'Tasks',
    color: '#10B981',
    options: [
      { id: 'technical_checklist', endpoint: 'technical_checklist', label: 'Technical Checklist' },
      { id: 'non_technical_checklist', endpoint: 'non_technical_checklist', label: 'Non-Technical Checklist' },
      { id: 'top_ten_checklist', endpoint: 'top_ten_checklist', label: 'Top 10 Checklist' },
      { id: 'site_wise_checklist', endpoint: 'site_wise_checklist', label: 'Site-wise Checklist' },
    ]
  },
  // schedule: {
  //   icon: Calendar,
  //   label: 'Schedule',
  //   color: '#3B82F6',
  //   options: [
  //     { id: 'schedule_overview', endpoint: 'schedule_overview', label: 'Schedule Overview' },
  //     { id: 'schedule_completion', endpoint: 'schedule_completion', label: 'Schedule Completion' },
  //     { id: 'resource_utilization', endpoint: 'resource_utilization', label: 'Resource Utilization' },
  //   ]
  // },
  // inventory: {
  //   icon: Package,
  //   label: 'Inventory',
  //   color: '#F59E0B',
  //   options: [
  //     { id: 'items_status', endpoint: 'items_status', label: 'Items Status' },
  //     { id: 'category_wise', endpoint: 'category_wise', label: 'Category-wise' },
  //     { id: 'green_consumption', endpoint: 'green_consumption', label: 'Green Consumption' },
  //     { id: 'aging_matrix', endpoint: 'aging_matrix', label: 'Aging Matrix' },
  //     { id: 'low_stock', endpoint: 'low_stock', label: 'Low Stock Items' },
  //     { id: 'high_value', endpoint: 'high_value', label: 'High Value Items' },
  //   ]
  // },
  amc: {
    icon: Settings,
    label: 'AMC',
    color: '#8B5CF6',
    options: [
      { id: 'amc_status_overview', endpoint: 'status_overview', label: 'Status Overview' },
      { id: 'amc_type_distribution', endpoint: 'type_distribution', label: 'Type Distribution' },
      { id: 'amc_unit_resource_wise', endpoint: 'unit_resource_wise', label: 'Unit Resource Distribution' },
      { id: 'amc_service_stats', endpoint: 'service_stats', label: 'Service Statistics' },
      { id: 'amc_expiry_analysis', endpoint: 'expiry_analysis', label: 'Expiry Analysis' },
      // { id: 'amc_service_tracking', endpoint: 'service_tracking', label: 'Service Tracking' },
      { id: 'amc_coverage_by_location', endpoint: 'coverage_by_location', label: 'Coverage by Location' },
      // { id: 'amc_vendor_performance', endpoint: 'vendor_performance', label: 'Vendor Performance' },
    ]
  },
  meeting_room: {
    icon: BarChart3,
    label: 'Meeting Room',
    color: '#C4B89D',
    options: [
      { id: 'mr_revenue_overview', endpoint: 'revenue_generation_overview', label: 'Revenue Generation Overview' },
      { id: 'mr_center_performance', endpoint: 'center_performance_overview', label: 'Center Wise - Performance Overview' },
      { id: 'mr_center_wise_utilization', endpoint: 'center_wise_meeting_room_utilization', label: 'Center Wise - Meeting Room Utilization' },
      { id: 'mr_response_tat_quarterly', endpoint: 'response_tat_performance_quarterly', label: 'Response TAT Performance (Quarterly)' },
      { id: 'mr_resolution_tat_quarterly', endpoint: 'resolution_tat_performance_quarterly', label: 'Resolution TAT Performance (Quarterly)' },
    ]
  },
  community: {
    icon: BarChart3,
    label: 'Community Programs',
    color: '#DAD6C9',
    options: [
      { id: 'community_engagement_metrics', endpoint: 'engagement_metrics', label: 'Community Engagement Metrics' },
      { id: 'community_site_adoption', endpoint: 'site_wise_adoption_rate', label: 'Site Wise Adoption Rate' },
    ]
  },
  helpdesk: {
    icon: BarChart3,
    label: 'Helpdesk Management',
    color: '#F6F4EE',
    options: [
      { id: 'helpdesk_snapshot', endpoint: 'snapshot', label: 'Snapshot' },
      { id: 'helpdesk_aging_closure_feedback', endpoint: 'aging_closure_feedback', label: 'Ticket Ageing, Closure Efficiency & Feedback by Center' },
      { id: 'helpdesk_ticket_performance_metrics', endpoint: 'ticket_performance_metrics', label: 'Ticket Performance Metrics by Category – Volume, Closure Rate & Ageing' },
      { id: 'helpdesk_customer_experience_feedback', endpoint: 'customer_experience_feedback', label: 'Customer Experience Feedback' },
      { id: 'helpdesk_customer_rating_overview', endpoint: 'customer_rating_overview', label: 'Site Performance: Customer Rating Overview' },
    ]
  },

  asset_management: {
    icon: Package,
    label: 'Asset Management',
    color: '#06B6D4',
    options: [
      { id: 'am_company_asset_overview', endpoint: 'company_asset_overview', label: 'Company Wise Asset Overview' },
      { id: 'am_center_assets_downtime', endpoint: 'center_assets_downtime', label: 'Center Wise – Assets And Downtime Metrics' },
      { id: 'am_highest_maintenance_assets', endpoint: 'highest_maintenance_assets', label: 'Assets With Highest Maintenance Spend' },
      { id: 'am_amc_contract_summary', endpoint: 'amc_contract_summary', label: 'AMC Contract Summary' },
      { id: 'am_amc_contract_expiry_90', endpoint: 'amc_contract_expiry_90', label: 'AMC Contract Summary – Expiry in 90 Days' },
      { id: 'am_amc_contract_expired', endpoint: 'amc_contract_expired', label: 'AMC Contract Summary – Expired' },
    ]
  },

  inventory_management: {
    icon: Package,
    label: 'Inventory Management',
    color: '#F59E0B',
    options: [
      { id: 'inv_overview_summary', endpoint: 'inventory_overview_summary', label: 'Overview Summary' },
      { id: 'inv_overstock_top10', endpoint: 'inventory_overstock_top10', label: 'Overstock Analysis – Top 10 Items' },
    ]
  },

  consumables_overview: {
    icon: Package,
    label: 'Consumables Overview',
    color: '#C4B89D',
    options: [
      { id: 'consumables_top_center', endpoint: 'top_consumables_center', label: 'Top Consumables – Centre-wise Overview' },
      { id: 'consumables_value_quarterly', endpoint: 'consumable_inventory_value_quarterly', label: 'Consumable Inventory Value – Quarterly Comparison' },
    ]
  },

  parking_management: {
    icon: BarChart3,
    label: 'Parking Management',
    color: '#A0B5C1',
    options: [
      { id: 'parking_allocation_overview', endpoint: 'parking_allocation_overview', label: 'Parking Allocation Overview – Paid, Free & Vacant' },
    ]
  },

  visitor_management: {
    icon: BarChart3,
    label: 'Visitor Management',
    color: '#B8C4D9',
    options: [
      { id: 'visitor_trend_analysis', endpoint: 'visitor_trend_analysis', label: 'Visitor Trend Analysis' },
    ]
  },

  checklist_management: {
    icon: CheckSquare,
    label: 'Checklist Management',
    color: '#C4B89D',
    options: [
      { id: 'cm_progress_quarterly', endpoint: 'cm_progress_quarterly', label: 'Checklist Progress Status – Center-Wise Quarterly Comparison' },
      { id: 'cm_overdue_centerwise', endpoint: 'cm_overdue_centerwise', label: 'Top 10 Overdue Checklists – Center-wise Contribution Comparison' },
    ]
  },

} as const;

export const UnifiedAnalyticsSelector: React.FC<UnifiedAnalyticsSelectorProps> = ({
  selectedAnalytics,
  onSelectionChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const isAnalyticSelected = (moduleKey: string, optionId: string): boolean => {
    return selectedAnalytics.some(analytic => analytic.id === optionId);
  };

  const toggleAnalytic = (moduleKey: string, option: any) => {
    const analyticId = option.id;
    const isSelected = isAnalyticSelected(moduleKey, analyticId);

    if (isSelected) {
      // Remove from selection
      onSelectionChange(selectedAnalytics.filter(analytic => analytic.id !== analyticId));
    } else {
      // Add to selection
      const newAnalytic: SelectedAnalytic = {
        id: analyticId,
        module: moduleKey as any,
        endpoint: option.endpoint,
        title: option.label,
      };
      onSelectionChange([...selectedAnalytics, newAnalytic]);
    }
  };

  const selectAllForModule = (moduleKey: string, selected: boolean) => {
    const moduleOptions = analyticsOptions[moduleKey as keyof typeof analyticsOptions].options;

    if (selected) {
      // Add all options from this module
      const newAnalytics = moduleOptions.map(option => ({
        id: option.id,
        module: moduleKey as any,
        endpoint: option.endpoint,
        title: option.label,
      }));

      // Remove existing analytics from this module and add new ones
      const filteredAnalytics = selectedAnalytics.filter(analytic => analytic.module !== moduleKey);
      onSelectionChange([...filteredAnalytics, ...newAnalytics]);
    } else {
      // Remove all options from this module
      onSelectionChange(selectedAnalytics.filter(analytic => analytic.module !== moduleKey));
    }
  };

  const getModuleSelectionState = (moduleKey: string) => {
    const moduleOptions = analyticsOptions[moduleKey as keyof typeof analyticsOptions].options;
    const selectedCount = moduleOptions.filter(option => isAnalyticSelected(moduleKey, option.id)).length;

    if (selectedCount === 0) return 'none';
    if (selectedCount === moduleOptions.length) return 'all';
    return 'partial';
  };

  const getTotalSelectedCount = () => selectedAnalytics.length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-10 border-analytics-border hover:bg-analytics-secondary/50"
          data-analytics-selector
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics ({getTotalSelectedCount()})
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 bg-background border-analytics-border" align="end">
        <div className="p-4 border-b border-analytics-border">
          <h4 className="font-medium text-analytics-text">Select Analytics</h4>
          <p className="text-sm text-analytics-muted">Choose analytics from different modules</p>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {Object.entries(analyticsOptions).map(([moduleKey, module], index) => {
            const Icon = module.icon;
            const selectionState = getModuleSelectionState(moduleKey);

            return (
              <div key={moduleKey}>
                <div className="p-4">
                  {/* Module Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" style={{ color: module.color }} />
                      <span className="font-medium text-analytics-text">{module.label}</span>
                    </div>
                    <Checkbox
                      checked={selectionState === 'all'}
                      onCheckedChange={(checked) => selectAllForModule(moduleKey, checked as boolean)}
                      className={selectionState === 'partial' ? 'data-[state=checked]:bg-analytics-accent' : ''}
                    />
                  </div>

                  {/* Module Options */}
                  <div className="space-y-2 ml-6">
                    {module.options.map((option) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={isAnalyticSelected(moduleKey, option.id)}
                          onCheckedChange={() => toggleAnalytic(moduleKey, option)}
                          id={option.id}
                        />
                        <Label
                          htmlFor={option.id}
                          className="text-sm text-analytics-text cursor-pointer flex-1 hover:text-analytics-accent"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {index < Object.entries(analyticsOptions).length - 1 && (
                  <Separator className="bg-analytics-border" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-analytics-border bg-analytics-background">
          <div className="flex items-center justify-between">
            <span className="text-sm text-analytics-muted">
              {getTotalSelectedCount()} analytics selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectionChange([])}
                className="text-analytics-muted hover:text-analytics-text"
              >
                Clear All
              </Button>
              <Button
                size="sm"
                onClick={() => setIsOpen(false)}
                className="bg-primary hover:bg-primary/90"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};