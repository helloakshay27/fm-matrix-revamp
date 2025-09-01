import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useLayout } from '@/contexts/LayoutContext';
import { getCompanyLayout, hasCompanyFeature, hasCompanyModule, LayoutConfig } from '@/config/companyLayouts';

/**
 * Custom hook for accessing company-specific layout and feature configurations
 */
export const useCompanyLayout = () => {
  const { selectedCompany } = useSelector((state: RootState) => state.project);
  const { getLayoutByCompanyId } = useLayout();

  const companyId = selectedCompany?.id || null;
  const layoutConfig = getLayoutByCompanyId(companyId);

  return {
    companyId,
    selectedCompany,
    layoutConfig,
    
    // Layout configuration
    sidebarComponent: layoutConfig.sidebarComponent,
    headerComponent: layoutConfig.headerComponent,
    theme: layoutConfig.theme,
    
    // Feature checks
    hasAdvancedFeatures: hasCompanyFeature(companyId, 'enableAdvancedFeatures'),
    hasBetaFeatures: hasCompanyFeature(companyId, 'enableBetaFeatures'),
    
    // Module checks
    hasModule: (module: string) => hasCompanyModule(companyId, module),
    availableModules: layoutConfig.features?.customModules || [],
    
    // Utility functions
    getThemeColor: (colorKey: keyof NonNullable<LayoutConfig['theme']>) => 
      layoutConfig.theme?.[colorKey],
      
    // Check if current company is a specific company
    isCompany: (id: number) => companyId === id,
    
    // Get company name
    companyName: selectedCompany?.name || 'Unknown Company'
  };
};
