# Enhanced Permission Checking with function_name and action_name

## Overview
The permission system has been enhanced to check both `function_name` and `action_name` fields from the API response, with special mappings for common function names.

## Key Changes Made

### 1. Enhanced Permission Checking Logic
The `checkPermission` function in `Sidebar.tsx` now:
- Checks both `function_name` and `action_name` fields
- Includes special mappings for common function names
- Handles various name variations (plural/singular, case differences)

### 2. Function Name Mappings
Special mappings have been implemented for:

```typescript
// Assets mapping
'assets' | 'asset' → matches 'pms_assets', 'assets', 'asset'

// Tickets mapping  
'tickets' | 'ticket' → matches 'pms_complaints', 'tickets', 'ticket'

// Services mapping
'services' | 'service' → matches 'pms_services', 'services', 'service'

// Tasks mapping
'tasks' | 'task' → matches 'pms_tasks', 'tasks', 'task'

// Broadcast mapping
'broadcast' → matches 'pms_notices', 'broadcast'

// M-Safe mappings
'msafe' | 'm-safe' | 'm safe' → matches 'msafe', 'm-safe', 'pms_msafe', 'pms_m_safe'

// M-Safe Sub-functions
'non fte users' | 'non_fte_users' → matches 'non fte users', 'pms_non_fte_users', 'non fte'
'line manager check' | 'line_manager_check' → matches 'line manager check', 'lmc', 'pms_line_manager_check'
'senior management tour' | 'senior_management_tour' → matches 'senior management tour', 'smt', 'pms_senior_management_tour'
'krcc list' | 'krcc_list' → matches 'krcc list', 'krcc', 'pms_krcc_list'
'training_list' | 'training list' | 'training' → matches 'training_list', 'pms_training_list', 'pms_training'
```

### 3. API Structure Support
The system now supports:
```json
{
  "lock_modules": [
    {
      "module_name": "PMS",
      "module_active": 1,
      "lock_functions": [
        {
          "function_id": 1,
          "function_name": "Asset Management",
          "action_name": "pms_assets",  // ← Now checked
          "function_active": 1,
          "sub_functions": [...]
        }
      ]
    }
  ]
}
```

## How It Works

### 1. Permission Check Flow
1. **Module Check**: Verify the module exists and is active
2. **Function Check**: Look for function using both `function_name` and `action_name`
3. **Name Variants**: Generate multiple variants of the function name
4. **Pattern Matching**: Use flexible string matching (contains, equals, etc.)
5. **Sub-Function Check**: If specified, verify sub-function permissions

### 2. Example Matching Logic
For a sidebar item with `functionName: 'assets'`:

```typescript
// Generated variants: ['assets', 'assets', 'pms_assets', 'assets', 'asset']
// Matches against API functions where:
// - function_name contains any variant
// - action_name contains any variant
```

### 3. Console Logging
Enhanced logging shows:
- ✅ Permission granted with full path
- ❌ Permission denied with reason
- 🔄 Loading state when no role data

## Sidebar Items Updated

### Assets Example
```typescript
{ 
  name: 'Assets', 
  icon: Building, 
  href: '/maintenance/asset', 
  moduleName: 'PMS', 
  functionName: 'assets'  // Will match pms_assets
}
```

### Testing Examples
The system will now correctly match:
- API `function_name: "Asset Management"` with sidebar `functionName: "assets"`
- API `action_name: "pms_assets"` with sidebar `functionName: "assets"`
- Various case and plural variations

## Debugging
Enable browser console to see permission check logs:
- ✅ Successful matches show the matching criteria
- ❌ Failed matches show what was searched and why it failed
- All variants and API responses are logged for debugging

## Benefits
1. **Flexible Matching**: Handles various naming conventions
2. **Backward Compatible**: Existing function names still work
3. **Comprehensive**: Checks both `function_name` and `action_name`
4. **Debuggable**: Detailed console logging for troubleshooting
5. **Extensible**: Easy to add new mappings

## Usage Notes
- If you have `pms_assets` in your API, it will be matched by `functionName: 'assets'`
- Case-insensitive matching handles different naming styles
- Partial matching allows for flexible API responses
- Multiple variants increase matching success rate

## Next Steps
1. Test with your actual API data
2. Add more mappings as needed
3. Monitor console logs for unmatched functions
4. Update sidebar items to use the enhanced matching
