import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Upload, Filter, Search } from 'lucide-react';

export interface ActionButtonConfig {
  type: 'add' | 'import' | 'filters' | 'search' | 'custom';
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  show?: boolean;
  customElement?: React.ReactNode;
}

interface ListPageActionsProps {
  title: string;
  breadcrumb: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onAddClick?: () => void;
  onImportClick?: () => void;
  onFiltersClick?: () => void;
  customActions?: ActionButtonConfig[];
  showAdd?: boolean;
  showImport?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
}

export const ListPageActions: React.FC<ListPageActionsProps> = ({
  title,
  breadcrumb,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  onAddClick,
  onImportClick,
  onFiltersClick,
  customActions = [],
  showAdd = true,
  showImport = true,
  showFilters = true,
  showSearch = true,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2">{breadcrumb}</p>
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-[#1a1a1a] uppercase">
          {title}
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Add Button */}
          {showAdd && onAddClick && (
            <Button 
              onClick={onAddClick}
              className="bg-[#C72030] text-white hover:bg-[#C72030]/90 border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          )}

          {/* Import Button */}
          {showImport && onImportClick && (
            <Button 
              variant="outline"
              onClick={onImportClick}
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          )}

          {/* Filters Button */}
          {showFilters && onFiltersClick && (
            <Button 
              variant="outline"
              onClick={onFiltersClick}
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          )}

          {/* Custom Actions */}
          {customActions.map((action, index) => {
            if (action.show === false) return null;
            
            if (action.customElement) {
              return <div key={index}>{action.customElement}</div>;
            }

            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant || 'outline'}
                onClick={action.onClick}
                className={
                  action.variant === 'outline' 
                    ? "border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
                    : action.variant === 'default'
                    ? "bg-[#C72030] text-white hover:bg-[#C72030]/90 border-0"
                    : ""
                }
              >
                {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                {action.label}
              </Button>
            );
          })}
        </div>

        {/* Search */}
        {showSearch && onSearchChange && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};