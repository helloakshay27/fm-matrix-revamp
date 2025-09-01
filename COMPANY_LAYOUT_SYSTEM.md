# Company-Based Layout System

This system allows the application to dynamically switch between different layouts, sidebars, headers, and themes based on the selected company ID.

## Overview

The company-based layout system consists of several key components:

1. **Company Layout Configuration** (`/src/config/companyLayouts.ts`)
2. **Layout Context** (`/src/contexts/LayoutContext.tsx`)
3. **Company Layout Hook** (`/src/hooks/useCompanyLayout.ts`)
4. **Main Layout Component** (`/src/components/Layout.tsx`)

## How It Works

### 1. Company Selection
When a user selects a company from the Header dropdown, the selected company is stored in the Redux store (`projectSlice`).

### 2. Layout Configuration
Each company ID is mapped to specific layout configurations in `/src/config/companyLayouts.ts`:

```typescript
export const COMPANY_LAYOUTS: Record<number, LayoutConfig> = {
  1: { // Default layout for Company ID 1
    sidebarComponent: 'default',
    headerComponent: 'default',
    theme: {
      primaryColor: '#C72030',
      backgroundColor: '#fafafa'
    }
  },
  2: { // Oman layout for Company ID 2
    sidebarComponent: 'oman',
    headerComponent: 'oman',
    theme: {
      primaryColor: '#1a1a1a',
      backgroundColor: '#f6f4ee'
    }
  }
  // ... more companies
};
```

### 3. Dynamic Layout Rendering
The main `Layout` component reads the selected company ID and renders the appropriate sidebar and header components:

```typescript
// Get layout configuration based on company ID
const layoutConfig = getLayoutByCompanyId(selectedCompany?.id || null);

// Render sidebar based on configuration
switch (layoutConfig.sidebarComponent) {
  case 'oman':
    return <OmanSidebar />;
  case 'vi':
    return <ViSidebar />;
  case 'static':
    return <StacticSidebar />;
  case 'default':
  default:
    return <Sidebar />;
}
```

## Available Layout Components

### Sidebar Components
- `default` - Standard sidebar (`<Sidebar />`)
- `oman` - Oman-specific sidebar (`<OmanSidebar />`)
- `vi` - Vi-specific sidebar (`<ViSidebar />`)
- `static` - Static sidebar with all modules (`<StacticSidebar />`)

### Header Components
- `default` - Standard header (`<DynamicHeader />`)
- `oman` - Oman-specific header (`<OmanDynamicHeader />`)
- `vi` - Vi-specific header (`<ViDynamicHeader />`)
- `static` - Static header (`<StaticDynamicHeader />`)

## Using the Company Layout Hook

The `useCompanyLayout` hook provides easy access to company-specific configurations:

```typescript
import { useCompanyLayout } from '@/hooks/useCompanyLayout';

const MyComponent = () => {
  const {
    companyId,
    companyName,
    sidebarComponent,
    headerComponent,
    theme,
    hasAdvancedFeatures,
    hasBetaFeatures,
    hasModule,
    availableModules
  } = useCompanyLayout();

  // Use company-specific logic
  if (hasModule('maintenance')) {
    // Show maintenance-related features
  }

  if (hasAdvancedFeatures) {
    // Show advanced features
  }

  return (
    <div style={{ color: theme?.primaryColor }}>
      Company: {companyName}
    </div>
  );
};
```

## Feature Management

Each company can have different features enabled:

```typescript
features: {
  enableAdvancedFeatures: true,
  enableBetaFeatures: false,
  customModules: ['maintenance', 'safety', 'finance']
}
```

Use the helper functions to check features:
- `hasCompanyFeature(companyId, 'enableAdvancedFeatures')`
- `hasCompanyModule(companyId, 'maintenance')`

## Testing Components

For development and testing, two components are available:

### CompanyLayoutSelector
Allows switching between different companies to test layouts:
```typescript
import { CompanyLayoutSelector } from '@/components/CompanyLayoutSelector';
```

### CompanyLayoutDebug
Shows current company layout configuration:
```typescript
import { CompanyLayoutDebug } from '@/components/CompanyLayoutDebug';
```

## Adding New Company Layouts

To add a new company layout:

1. **Add the company configuration** in `/src/config/companyLayouts.ts`:
```typescript
export const COMPANY_LAYOUTS: Record<number, LayoutConfig> = {
  // ... existing companies
  5: { // New company
    sidebarComponent: 'custom',
    headerComponent: 'custom',
    theme: {
      primaryColor: '#ff6b6b',
      backgroundColor: '#f8f9fa'
    },
    features: {
      enableAdvancedFeatures: true,
      enableBetaFeatures: true,
      customModules: ['maintenance', 'safety', 'finance', 'crm']
    }
  }
};
```

2. **Create custom components** (if needed):
```typescript
// /src/components/CustomSidebar.tsx
// /src/components/CustomDynamicHeader.tsx
```

3. **Update the Layout component** to handle the new component types:
```typescript
switch (layoutConfig.sidebarComponent) {
  case 'custom':
    return <CustomSidebar />;
  // ... other cases
}
```

## Backward Compatibility

The system maintains backward compatibility with domain-based layouts:
- `oig.gophygital.work` → Oman layout
- `web.gophygital.work` → Vi layout

Domain-based logic takes precedence over company ID-based logic.

## Environment-Specific Features

The testing components (`CompanyLayoutSelector`, `CompanyLayoutDebug`) should only be visible in development environments or for admin users. Consider wrapping them in environment checks:

```typescript
{process.env.NODE_ENV === 'development' && (
  <CompanyLayoutSelector />
)}
```

## Best Practices

1. **Fallback Handling**: Always provide fallback layouts for unknown company IDs
2. **Performance**: Layout switching is instant as it only changes which components are rendered
3. **Consistency**: Maintain consistent API interfaces across different layout components
4. **Testing**: Use the provided testing components to verify layouts work correctly
5. **Configuration**: Keep all company-specific configurations in the central config file

## Future Enhancements

Potential future improvements:
- Database-driven layout configurations
- User role-based layout restrictions
- Custom theme builder interface
- Layout preview functionality
- A/B testing support for different layouts
