# Dynamic Header Permission-Based Display

## Overview

Enhanced the DynamicHeader component to conditionally show/hide the header based on user permissions and display only the modules the user has access to.

## Key Features

### 1. Conditional Header Display
- **Show Header**: Only when user has access to at least one function
- **Hide Header**: When user has no function access at all

### 2. Dynamic Module Detection
The system now intelligently maps functions to their corresponding header modules:

#### Function-to-Module Mapping
- **Maintenance**: assets, work_orders, preventive_maintenance, tasks
- **Safety**: msafe, m-safe, safety_incidents, lmc, smt, krcc, training, non_fte_users  
- **CRM**: tickets, customer_management, customer_feedback, broadcast
- **Finance**: invoices, payments, budgets, cost_centers
- **Utility**: utility_bills, meter_readings, consumption_reports
- **Security**: access_control, visitor_management, security_incidents
- **Value Added Services**: services, service_requests
- **Master**: users, roles, categories, locations
- **Settings**: system_settings, user_preferences, configurations

### 3. Smart Module Selection
1. **Primary**: Shows the module corresponding to user's first accessible function
2. **Fallback**: Shows first accessible module if primary mapping not found
3. **Default**: Shows Maintenance if no specific mapping exists

### 4. Filtered Module Display
- Only shows modules the user has access to
- Hides modules where user has no function permissions
- Maintains responsive design for all screen sizes

## Implementation Details

### Files Modified

#### `/src/utils/moduleDetection.ts`
- `getModuleForFunction()`: Maps function names to header modules
- `hasAnyFunctionAccess()`: Checks if user has any function access
- `getActiveModuleForUser()`: Determines primary module for user
- `getAccessibleModules()`: Returns all accessible modules

#### `/src/components/DynamicHeader.tsx`
- Added permission checking logic
- Conditional rendering based on access
- Dynamic module filtering
- Automatic section selection

### Key Logic Flow

```typescript
// 1. Check if user has any function access
const hasAccess = hasAnyFunctionAccess(userRole);

// 2. If no access, hide header completely
if (!hasAccess) return null;

// 3. Get accessible modules
const userAccessibleModules = getAccessibleModules(userRole);

// 4. Set active module based on user's functions
const activeModule = getActiveModuleForUser(userRole);

// 5. Filter visible packages to only show accessible ones
const visiblePackages = accessibleModules.length > 0 ? 
  packages.filter(pkg => accessibleModules.includes(pkg)) : 
  packages;
```

## Benefits

### For Users
- See only relevant modules they can access
- No confusion with inaccessible modules
- Automatic selection of appropriate starting module

### For System
- Dynamic permission-based UI
- Reduced UI clutter
- Better user experience
- Consistent with backend permissions

### For Developers
- Centralized function-to-module mapping
- Reusable utility functions
- Maintainable and extensible code

## Usage Examples

### Scenario 1: User with Asset Management Access
- Functions: `pms_assets`, `work_orders`
- Result: Header shows with "Maintenance" selected
- Visible modules: Only "Maintenance" and other accessible modules

### Scenario 2: User with M-Safe Access
- Functions: `msafe`, `lmc`, `smt`
- Result: Header shows with "Safety" selected
- Visible modules: "Safety" and other accessible modules

### Scenario 3: User with No Function Access
- Functions: None active
- Result: Header is completely hidden
- Visible modules: None

### Scenario 4: User with Multiple Module Access
- Functions: `pms_assets`, `tickets`, `invoices`
- Result: Header shows with first mapped module selected
- Visible modules: "Maintenance", "CRM", "Finance"

## Configuration

### Adding New Function Mappings
To map a new function to a module, add it to `FUNCTION_TO_MODULE_MAP` in `/src/utils/moduleDetection.ts`:

```typescript
const FUNCTION_TO_MODULE_MAP: Record<string, string> = {
  // ...existing mappings...
  'new_function_name': 'Target Module',
  'another_function': 'Another Module'
};
```

### Adding New Header Modules
Add new modules to the `packages` array in `DynamicHeader.tsx`:

```typescript
const packages = [
  // ...existing packages...
  'New Module Name'
];
```

## Testing

The enhanced dynamic header can be tested by:
1. Logging in with different user roles
2. Checking which functions are enabled in permissions
3. Verifying correct module selection and header visibility
4. Testing with users having no permissions

## Future Enhancements

- Add breadcrumb navigation based on current function
- Implement module-specific styling or icons
- Add transition animations for module switching
- Cache module mappings for better performance
