# Testing the Sidebar Permission System

## Quick Start Test Guide

### 1. Launch the Application
The development server should be running. If not, run:
```bash
npm run dev
```

### 2. Sign In
- Navigate to the login page
- Sign in with user credentials that have the API endpoint configured
- The system will automatically call `/pms/users/get_user_role.json` on every page load

### 3. View Permissions Debug Info
- Navigate to the Dashboard page
- Look for the "Show Permissions Debug" button in the top-right corner
- Click it to see the current user's role and permission details
- This will show you:
  - Role name and ID
  - All available modules and their status
  - Functions within each module
  - Sub-functions and their enabled/disabled status

### 4. Test Sidebar Filtering

#### Test with Safety Module (from your API example):
Based on your API response, the user has access to the "safety" module but most sub-functions are disabled (`"enabled": false`).

Expected behavior:
- ✅ Safety section should be visible in sidebar
- ✅ M Safe menu item should be visible (function is active)
- ❌ Most M Safe sub-items should be hidden (sub-functions have `enabled: false`)

#### Test Navigation:
1. **Navigate to different sections** (Settings, Maintenance, Safety, Security, etc.)
2. **Observe sidebar changes** - only permitted items should show
3. **Check console logs** - permission checks are logged for debugging

### 5. Testing Different Scenarios

#### Scenario A: User with Limited Permissions
If your API returns modules with `"module_active": 0` or functions with `"function_active": 0`:
- Those modules/functions should not appear in the sidebar

#### Scenario B: User with Full Permissions  
If API returns all modules active and sub-functions enabled:
- All sidebar items should be visible

#### Scenario C: No Permissions Data
If API call fails or returns no data:
- System falls back to showing all items (you can modify this behavior in the code)

### 6. Console Debug Information

Open browser DevTools Console to see:
```
✅ Permission check: safety module -> true
✅ Permission check: safety.M Safe function -> true  
❌ Permission check: safety.M Safe.m_safe_all -> false
🔄 Refreshing permissions for route: /dashboard
📡 API call: /pms/users/get_user_role.json
```

### 7. Manual API Testing

You can also test the API directly:
```bash
# Using curl (replace with your actual API endpoint and auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     https://fm-uat-api.lockated.com/pms/users/get_user_role.json
```

Expected response should match the structure:
```json
{
  "success": true,
  "role_name": "Test Abhishek -1",
  "role_id": 2964,
  "display_name": "Test Abhishek -1", 
  "active": 1,
  "lock_modules": [...]
}
```

### 8. Common Test Cases

#### Test Case 1: Module Level Permissions
- User has `safety` module active but `maintenance` module inactive
- Expected: Safety sidebar section visible, Maintenance section hidden

#### Test Case 2: Function Level Permissions  
- User has `safety` module active, `M Safe` function active
- Expected: M Safe menu item visible under Safety section

#### Test Case 3: Sub-Function Level Permissions
- User has `m_safe_all` enabled but `m_safe_create` disabled
- Expected: "View All" sub-item visible, "Create New" sub-item hidden

#### Test Case 4: Route Changes
- Navigate between pages (Dashboard → Settings → Maintenance)
- Expected: Permissions refreshed on each navigation, API called each time

### 9. Troubleshooting

#### Sidebar Items Not Filtering:
1. Check browser console for API errors
2. Verify authentication tokens are valid
3. Confirm API endpoint URL is correct
4. Check if PermissionsProvider is properly wrapping the app

#### API Not Being Called:
1. Check Network tab in DevTools
2. Verify user is authenticated (`isAuthenticated()` returns true)
3. Check if API base URL is configured correctly

#### Debug Component Not Showing:
1. Make sure you're on the Dashboard page
2. Look for the blue "Show Permissions Debug" button in top-right
3. Check console for React errors

### 10. Expected Files Modified

The implementation includes these new/modified files:

**New Files:**
- `src/services/permissionService.ts` - API integration and permission utilities
- `src/contexts/PermissionsContext.tsx` - Global permission state management  
- `src/utils/sidebarPermissionFilter.ts` - Sidebar filtering utilities
- `src/components/PermissionsDebugger.tsx` - Debug component
- `src/hooks/usePermissionAwareNavigation.tsx` - Custom hook for permission checking
- `SIDEBAR_PERMISSIONS_GUIDE.md` - Complete documentation

**Modified Files:**
- `src/App.tsx` - Added PermissionsProvider wrapper
- `src/components/Sidebar.tsx` - Added permission-based filtering
- `src/pages/Dashboard.tsx` - Added debug component for testing

All changes are backward compatible and gracefully handle cases where permission data is not available.

### 11. Next Steps After Testing

Once you've verified the basic functionality works:

1. **Add More Permission Mappings**: Update more sidebar items with `moduleName`, `functionName`, `subFunctionName` metadata
2. **Customize Permission Logic**: Modify filtering behavior in `sidebarPermissionFilter.ts`
3. **Add Permission Gates**: Use the `PermissionGate` component to protect page content
4. **Implement Caching**: Add localStorage caching for better performance
5. **Error Handling**: Enhance error handling for failed API calls

This system provides a solid foundation that can be expanded as needed for your specific requirements.
