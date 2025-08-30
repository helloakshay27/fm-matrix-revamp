# Company Layout Configuration Summary

## Current Layout Mapping (Based on API Data)

Based on the API response from `https://fm-uat-api.lockated.com/allowed_companies.json`, the following company layout configuration is now active:

### Company ID 111 - "Lockated HO" → DEFAULT LAYOUT
- **Sidebar**: `<Sidebar />` (Default sidebar with standard navigation)
- **Header**: `<DynamicHeader />` (Standard dynamic header)
- **Theme**: Standard FM Matrix theme (#C72030)
- **Features**: Full feature access (Advanced features enabled)
- **Modules**: All modules available (maintenance, safety, finance, crm, utility, security, transitioning)

### Company ID 193 - "Panchshil" → STATIC LAYOUT
- **Sidebar**: `<StacticSidebar />` (Static sidebar with all modules visible)
- **Header**: `<StaticDynamicHeader />` (Static header)
- **Theme**: Standard FM Matrix theme (#C72030)
- **Features**: Basic features only
- **Modules**: Limited (maintenance, safety)

### Company ID 199 - "Customer Support" → STATIC LAYOUT
- **Sidebar**: `<StacticSidebar />` (Static sidebar with all modules visible)
- **Header**: `<StaticDynamicHeader />` (Static header)
- **Theme**: Standard FM Matrix theme (#C72030)
- **Features**: Basic features only
- **Modules**: Limited (maintenance, safety, finance)

### Company ID 204 - "GoPhygital.work" → STATIC LAYOUT
- **Sidebar**: `<StacticSidebar />` (Static sidebar with all modules visible)
- **Header**: `<StaticDynamicHeader />` (Static header)
- **Theme**: Standard FM Matrix theme (#C72030)
- **Features**: Basic features only
- **Modules**: Limited (maintenance, safety, finance)

## Key Points

✅ **Company ID 111 (Lockated HO)** is the ONLY company that gets the default layout with `<Sidebar />` and `<DynamicHeader />`

✅ **All other companies** (193, 199, 204) get the static layout with `<StacticSidebar />` and `<StaticDynamicHeader />`

✅ **Backward compatibility** maintained - domain-based logic still takes precedence for existing domains

✅ **Fallback behavior** - Any unknown company IDs will default to static layout

## Testing

You can test the layout switching by:
1. Using the Company Layout Selector component in the Dashboard
2. Switching between different companies to see layout changes
3. Verifying that only Company ID 111 shows the default layout
4. Confirming all other companies show the static layout

## API Integration

The system now matches the real company data from your API:
- **Selected Company**: 111 (Lockated HO) - Uses default layout ✅
- **Other Companies**: 193, 199, 204 - All use static layout ✅

This configuration ensures that only "Lockated HO" users see the standard dynamic interface, while all other companies see the comprehensive static interface with all modules visible.
