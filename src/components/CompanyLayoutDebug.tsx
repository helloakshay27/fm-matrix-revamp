import React from 'react';
import { useCompanyLayout } from '@/hooks/useCompanyLayout';
import { Badge } from '@/components/ui/badge';
import { Building2, Settings, Eye, EyeOff } from 'lucide-react';

/**
 * Company Layout Debug Component
 * Shows current company layout configuration and available features
 * This can be used for debugging or as an admin panel component
 */
export const CompanyLayoutDebug: React.FC = () => {
  const {
    companyId,
    companyName,
    sidebarComponent,
    headerComponent,
    theme,
    hasAdvancedFeatures,
    hasBetaFeatures,
    availableModules,
    hasModule,
    getThemeColor
  } = useCompanyLayout();

  if (!companyId) {
    return (
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-gray-600">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-4 h-4" />
          <span className="text-sm font-medium">No Company Selected</span>
        </div>
        <p className="text-xs">Please select a company to see layout configuration.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Company Layout Config</h3>
      </div>

      <div className="space-y-3">
        {/* Company Info */}
        <div>
          <label className="text-sm font-medium text-gray-700">Company:</label>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm">{companyName}</span>
            <Badge variant="outline" className="text-xs">ID: {companyId}</Badge>
          </div>
        </div>

        {/* Layout Components */}
        <div>
          <label className="text-sm font-medium text-gray-700">Layout Components:</label>
          <div className="flex gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              Sidebar: {sidebarComponent}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Header: {headerComponent}
            </Badge>
          </div>
        </div>

        {/* Theme Colors */}
        {theme && (
          <div>
            <label className="text-sm font-medium text-gray-700">Theme:</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {theme.primaryColor && (
                <div className="flex items-center gap-1">
                  <div 
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <span className="text-xs text-gray-600">{theme.primaryColor}</span>
                </div>
              )}
              {theme.backgroundColor && (
                <div className="flex items-center gap-1">
                  <div 
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: theme.backgroundColor }}
                  />
                  <span className="text-xs text-gray-600">{theme.backgroundColor}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features */}
        <div>
          <label className="text-sm font-medium text-gray-700">Features:</label>
          <div className="flex gap-2 mt-1">
            <div className="flex items-center gap-1">
              {hasAdvancedFeatures ? (
                <Eye className="w-3 h-3 text-green-600" />
              ) : (
                <EyeOff className="w-3 h-3 text-gray-400" />
              )}
              <span className="text-xs">Advanced</span>
            </div>
            <div className="flex items-center gap-1">
              {hasBetaFeatures ? (
                <Eye className="w-3 h-3 text-green-600" />
              ) : (
                <EyeOff className="w-3 h-3 text-gray-400" />
              )}
              <span className="text-xs">Beta</span>
            </div>
          </div>
        </div>

        {/* Available Modules */}
        <div>
          <label className="text-sm font-medium text-gray-700">Available Modules:</label>
          <div className="flex flex-wrap gap-1 mt-1">
            {availableModules.map((module) => (
              <Badge 
                key={module} 
                variant={hasModule(module) ? "default" : "secondary"}
                className="text-xs capitalize"
              >
                {module}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
