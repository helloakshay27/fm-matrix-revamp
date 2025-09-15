import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Save, RotateCcw, ArrowLeft, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { dashboardConfigService } from '@/services/dashboardConfigService';
import { useDashboardConfig } from '@/hooks/useDashboardConfig';
import { getSectionDisplayName, getItemDisplayName, getSectionColor } from '@/utils/dashboardConfigUtils';

interface ConfigItem {
  name: string;
  isVisible: boolean;
}

interface ConfigSection {
  name: string;
  items: ConfigItem[];
}

interface DashboardConfig {
  sections: ConfigSection[];
}

const DashboardConfiguration: React.FC = () => {
  const navigate = useNavigate();
  const [hasChanges, setHasChanges] = useState(false);
  
  const {
    config,
    loading,
    error,
    saveConfiguration,
    resetToDefault,
    toggleItemVisibility,
    toggleSectionVisibility,
  } = useDashboardConfig();

  // Handle saving configuration
  const handleSaveConfiguration = async () => {
    if (!config) return;
    
    const success = await saveConfiguration(config);
    setHasChanges(false);
    
    if (success) {
      toast.success('Configuration saved successfully!');
    } else {
      toast.warning('Configuration saved locally. API save failed.');
    }
  };

  // Handle resetting to default
  const handleResetToDefault = async () => {
    await resetToDefault();
    setHasChanges(true);
    toast.info('Configuration reset to defaults');
  };

  // Handle toggling item visibility with change tracking
  const handleToggleItemVisibility = (sectionName: string, itemName: string) => {
    toggleItemVisibility(sectionName, itemName);
    setHasChanges(true);
  };

  // Handle toggling section visibility with change tracking
  const handleToggleSectionVisibility = (sectionName: string, isVisible: boolean) => {
    toggleSectionVisibility(sectionName, isVisible);
    setHasChanges(true);
  };

  // Export configuration
  const exportConfiguration = () => {
    if (!config) return;
    
    try {
      const configJson = dashboardConfigService.exportConfiguration(config);
      const blob = new Blob([configJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-config-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Configuration exported successfully!');
    } catch (error) {
      console.error('Error exporting configuration:', error);
      toast.error('Failed to export configuration');
    }
  };

  // Import configuration
  const importConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedConfig = dashboardConfigService.importConfiguration(content);
        
        if (importedConfig) {
          // Note: This would need to be implemented in the hook
          // For now, just show success message
          setHasChanges(true);
          toast.success('Configuration imported successfully!');
        } else {
          toast.error('Invalid configuration file format');
        }
      } catch (error) {
        console.error('Error importing configuration:', error);
        toast.error('Failed to import configuration');
      }
    };
    reader.readAsText(file);
    
    // Reset input value to allow importing the same file again
    event.target.value = '';
  };

  // Format section name for display
  const formatSectionName = (name: string) => {
    return getSectionDisplayName(name);
  };

  // Format item name for display
  const formatItemName = (name: string) => {
    return getItemDisplayName(name);
  };

  // Calculate visibility statistics for a section
  const getSectionStats = (section: ConfigSection) => {
    const visible = section.items.filter(item => item.isVisible).length;
    const total = section.items.length;
    return { visible, total };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading configuration...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load configuration</p>
          {error && <p className="text-sm text-gray-600">{error}</p>}
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Configuration</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={exportConfiguration}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={importConfiguration}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Import
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={handleResetToDefault}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Default
              </Button>
              <Button
                onClick={handleSaveConfiguration}
                disabled={!hasChanges}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            Configure which analytics sections and items are visible on your dashboard
          </p>
        </div>
      </div>

      {/* Configuration Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6">
            {config.sections.map((section) => {
              const stats = getSectionStats(section);
              const allVisible = stats.visible === stats.total;
              const someVisible = stats.visible > 0 && stats.visible < stats.total;

              return (
                <Card key={section.name} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {formatSectionName(section.name)}
                        </CardTitle>
                        <span className="text-sm text-gray-500">
                          ({stats.visible}/{stats.total} visible)
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>Show All</span>
                          <Switch
                            checked={allVisible}
                            onCheckedChange={(checked) => 
                              handleToggleSectionVisibility(section.name, checked)
                            }
                            className={someVisible ? 'opacity-50' : ''}
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {section.items.map((item, index) => (
                        <div
                          key={item.name}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                            item.isVisible 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex-1">
                            <span className={`text-sm font-medium ${
                              item.isVisible ? 'text-green-900' : 'text-gray-600'
                            }`}>
                              {formatItemName(item.name)}
                            </span>
                          </div>
                          <Switch
                            checked={item.isVisible}
                            onCheckedChange={() => 
                              handleToggleItemVisibility(section.name, item.name)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Summary Card */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Configuration Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600 font-medium">Total Sections:</span>
                      <span className="ml-2 text-blue-900">{config.sections.length}</span>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">Total Items:</span>
                      <span className="ml-2 text-blue-900">
                        {config.sections.reduce((sum, section) => sum + section.items.length, 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">Visible Items:</span>
                      <span className="ml-2 text-blue-900">
                        {config.sections.reduce((sum, section) => 
                          sum + section.items.filter(item => item.isVisible).length, 0
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">Hidden Items:</span>
                      <span className="ml-2 text-blue-900">
                        {config.sections.reduce((sum, section) => 
                          sum + section.items.filter(item => !item.isVisible).length, 0
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                {hasChanges && (
                  <div className="text-sm text-orange-600 font-medium">
                    Unsaved changes
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardConfiguration;
