# Sidebar Permission Management System

## Overview

This system implements dynamic sidebar management based on user roles and permissions fetched from the `/pms/users/get_user_role.json` API endpoint. The sidebar now automatically shows/hides menu items based on the current user's permissions, and refreshes permissions on every page navigation.

## Architecture

### 1. Permission Service (`/src/services/permissionService.ts`)
- Fetches user role data from the API
- Provides utility functions to check module, function, and sub-function permissions
- Maps navigation paths to permission requirements

### 2. Permissions Context (`/src/contexts/PermissionsContext.tsx`)
- Manages user role state globally
- Automatically fetches permissions on app load and page navigation
- Provides permission checking functions to components

### 3. Sidebar Permission Filter (`/src/utils/sidebarPermissionFilter.ts`)
- Filters sidebar navigation structure based on user permissions
- Recursively filters nested menu items
- Handles permission metadata attached to sidebar items

### 4. Updated Sidebar Component (`/src/components/Sidebar.tsx`)
- Uses permissions context to filter navigation items
- Shows loading state while permissions are being fetched
- Renders only items the user has access to

## API Response Structure

The system expects the following API response structure from `/pms/users/get_user_role.json`:

```json
{
  "success": true,
  "role_name": "Test Abhishek -1",
  "role_id": 2964,
  "display_name": "Test Abhishek -1",
  "active": 1,
  "lock_modules": [
    {
      "module_id": 10,
      "module_name": "safety",
      "module_active": 1,
      "lock_functions": [
        {
          "function_id": 137,
          "function_name": "M Safe",
          "function_active": 1,
          "sub_functions": [
            {
              "sub_function_id": 660,
              "sub_function_name": "m_safe_all",
              "sub_function_display_name": "all",
              "sub_function_active": 1,
              "enabled": false
            }
          ]
        }
      ]
    }
  ]
}
```

## How to Add Permissions to Sidebar Items

### Basic Module Permission
```typescript
{ 
  name: 'Safety Module', 
  icon: Shield, 
  href: '/safety', 
  moduleName: 'safety' // Maps to module_name in API
}
```

### Function-Level Permission
```typescript
{ 
  name: 'M Safe', 
  icon: Shield, 
  href: '/safety/m-safe', 
  moduleName: 'safety',
  functionName: 'M Safe' // Maps to function_name in API
}
```

### Sub-Function Level Permission
```typescript
{ 
  name: 'View All', 
  href: '/safety/m-safe/all', 
  moduleName: 'safety',
  functionName: 'M Safe',
  subFunctionName: 'm_safe_all' // Maps to sub_function_name in API
}
```

### Nested Menu with Mixed Permissions
```typescript
{
  name: 'M-Safe',
  icon: User,
  href: '/maintenance/m-safe',
  moduleName: 'safety',
  functionName: 'M Safe',
  subItems: [
    { 
      name: 'Internal User (FTE)', 
      href: '/maintenance/m-safe/internal', 
      moduleName: 'safety', 
      functionName: 'M Safe', 
      subFunctionName: 'm_safe_all' 
    },
    { 
      name: 'Create New', 
      href: '/maintenance/m-safe/create', 
      moduleName: 'safety', 
      functionName: 'M Safe', 
      subFunctionName: 'm_safe_create' 
    }
  ]
}
```

## Permission Checking Functions

The system provides several utility functions accessible through the `usePermissions` hook:

```typescript
const { 
  userRole, 
  loading, 
  error, 
  isModuleEnabled, 
  isFunctionEnabled, 
  isSubFunctionEnabled, 
  hasPermissionForPath 
} = usePermissions();

// Check if a module is enabled
const canAccessSafety = isModuleEnabled('safety');

// Check if a function is enabled within a module
const canAccessMSafe = isFunctionEnabled('safety', 'M Safe');

// Check if a sub-function is enabled
const canViewAll = isSubFunctionEnabled('safety', 'M Safe', 'm_safe_all');

// Check path-based permissions (for unmapped routes)
const canAccessPath = hasPermissionForPath('/safety/custom-page');
```

## Integration Steps Completed

### 1. ✅ App Setup
- Added `PermissionsProvider` to the app root in `App.tsx`
- Wrapped the application with permission context

### 2. ✅ Service Layer
- Created `permissionService.ts` with API integration
- Implemented permission checking utilities

### 3. ✅ Context Management
- Created `PermissionsContext.tsx` for global permission state
- Added automatic permission fetching on route changes

### 4. ✅ Sidebar Integration
- Updated `Sidebar.tsx` to use permissions
- Added permission metadata to key menu items
- Implemented permission-based filtering

### 5. ✅ Utilities
- Created `sidebarPermissionFilter.ts` for advanced filtering
- Added debugging components for testing

## Testing and Debugging

### Debug Component
A debug component is available at `/src/components/PermissionsDebugger.tsx`:

```typescript
import { PermissionsDebugToggle } from '@/components/PermissionsDebugger';

// Add to any page for debugging
<PermissionsDebugToggle />
```

This shows:
- Current user role information
- All available modules and their status
- All functions and sub-functions with their enabled status

### Console Logging
The system includes comprehensive logging:
- API call results
- Permission check results
- Filtering operations

### Manual Testing
1. **Login with different user roles**
2. **Navigate between pages** - permissions refresh automatically
3. **Check sidebar visibility** - items should show/hide based on permissions
4. **Verify API calls** - check Network tab for `/pms/users/get_user_role.json` calls

## Troubleshooting

### Sidebar Items Not Showing
1. Check if user is authenticated
2. Verify API response structure matches expected format
3. Ensure sidebar items have correct `moduleName`, `functionName`, `subFunctionName` metadata
4. Check browser console for permission service errors

### Permissions Not Refreshing
1. Verify `PermissionsProvider` is correctly wrapped around the app
2. Check if API endpoint is accessible and returning data
3. Ensure authentication tokens are valid

### API Integration Issues
1. Verify API base URL configuration in `apiConfig`
2. Check authentication headers are being sent
3. Confirm API endpoint URL is correct: `/pms/users/get_user_role.json`

## Performance Considerations

- **Caching**: User role data is cached until page navigation
- **Loading States**: Sidebar shows loading indicator while fetching permissions
- **Error Handling**: Graceful fallback when permissions can't be loaded
- **Filtering**: Sidebar filtering is memoized for performance

## Future Enhancements

1. **Permission Caching**: Add localStorage caching for better performance
2. **Role Hierarchy**: Support for role inheritance and hierarchy
3. **Dynamic Permissions**: Real-time permission updates via WebSocket
4. **Audit Logging**: Track permission checks for security auditing
5. **Permission Groups**: Support for grouping related permissions

## Example Usage in Components

```typescript
import { usePermissions } from '@/contexts/PermissionsContext';

const MyComponent = () => {
  const { isModuleEnabled, isFunctionEnabled, userRole } = usePermissions();
  
  if (!isModuleEnabled('safety')) {
    return <div>Access denied</div>;
  }
  
  return (
    <div>
      <h1>Safety Module</h1>
      {isFunctionEnabled('safety', 'M Safe') && (
        <button>Access M Safe</button>
      )}
      {userRole && (
        <p>Welcome, {userRole.role_name}</p>
      )}
    </div>
  );
};
```

This system provides a robust, scalable foundation for managing user permissions throughout the FM Matrix application.
