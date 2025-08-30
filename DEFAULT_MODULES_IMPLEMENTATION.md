# Default Modules in Dynamic Header

## Overview
Enhanced the DynamicHeader component to show certain modules by default, regardless of whether the user has specific function permissions mapped to them.

## Default Modules Added
- **Master**: Always visible - typically contains user management, roles, categories, locations
- **Settings**: Always visible - typically contains system configurations, role configs, permissions

## Implementation Logic

### Before (Permission-Only Approach)
```typescript
// Only showed modules that had explicit function mappings
const visibleModules = getAccessibleModules(userRole);
```

### After (Hybrid Approach)
```typescript
// Get modules user has access to via function mappings
const userAccessibleModules = getAccessibleModules(userRole);

// Add default modules if not already included
const modulesWithDefaults = [...userAccessibleModules];
const defaultModules = ['Master', 'Settings'];

defaultModules.forEach(defaultModule => {
  if (!modulesWithDefaults.includes(defaultModule)) {
    modulesWithDefaults.push(defaultModule);
  }
});

setAccessibleModules(modulesWithDefaults);
```

## Benefits

### For Users
- **Consistent Access**: Master and Settings are always available for common administrative tasks
- **Predictable UI**: Users always know where to find user management and system settings
- **Better UX**: No confusion about missing essential modules

### For Administrators
- **Always Available**: Critical admin functions always accessible
- **Centralized Management**: User, role, and system management consistently available
- **Fallback Access**: Even if function mappings are incomplete, essential modules remain accessible

### For System
- **Hybrid Approach**: Combines permission-based filtering with essential defaults
- **Flexible Configuration**: Easy to add/remove default modules
- **Maintains Security**: Other modules still require proper permissions

## Debug Information

The enhanced logging shows:
- `originalModules`: Modules detected via function permissions
- `modulesWithDefaults`: Final list including defaults
- `addedDefaults`: Which modules were added as defaults
- `totalModules`: Total API modules available
- `activeFunctions`: All active functions from API

## Configuration

### To Add More Default Modules
```typescript
const defaultModules = ['Master', 'Settings', 'Finance']; // Add more as needed
```

### To Remove Default Modules
```typescript
const defaultModules = ['Master']; // Remove unwanted defaults
```

### To Make All Modules Default (Not Recommended)
```typescript
const defaultModules = packages; // Shows all modules regardless of permissions
```

## Use Cases

### Scenario 1: User with Limited Permissions
- **Function Access**: Only has 'assets' function
- **Result**: Shows 'Maintenance', 'Master', 'Settings'
- **Benefit**: User can still access user management and settings

### Scenario 2: User with Full Permissions
- **Function Access**: Multiple functions across modules
- **Result**: Shows all mapped modules + 'Master', 'Settings' (if not already included)
- **Benefit**: No duplication, comprehensive access

### Scenario 3: User with No Mapped Functions
- **Function Access**: Functions exist but no mappings defined
- **Result**: Shows only 'Master', 'Settings'
- **Benefit**: User isn't completely locked out

## Security Considerations

- **UI Level Only**: Default modules only show in header navigation
- **Backend Validation**: Actual page access still controlled by API permissions
- **Function Level**: Individual functions within modules still require proper permissions
- **Audit Trail**: Debug logs track which modules were added by default vs permissions

## Future Enhancements

- Add role-based default modules (admin users get more defaults)
- Make default modules configurable via API/settings
- Add module-level permissions in addition to function-level
- Implement graceful degradation for restricted access within default modules

## Testing

To test the default module functionality:
1. Check console logs for `addedDefaults` array
2. Verify Master and Settings appear in header regardless of function mappings
3. Confirm other modules still require proper function permissions
4. Test with users having different permission levels
