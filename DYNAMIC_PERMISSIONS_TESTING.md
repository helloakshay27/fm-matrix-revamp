# 🔍 Dynamic Permission Checking System

## 🚀 How to Test Dynamic Permissions

Your sidebar now dynamically checks permissions on every page load and hides/shows menu items based on the user's role from the API `/pms/users/get_user_role.json`.

### 1. **Testing Tools Available**

#### **A. Debug Toggle (Top-Right Corner)**
- Click "Show Permissions Debug" button on Dashboard
- Shows complete role and permission structure
- Displays all modules, functions, and sub-functions with their status

#### **B. Dynamic Permission Checker (Bottom-Left Corner)**  
- Interactive permission tester
- Test any module/function/sub-function combination
- Real-time permission checking with instant feedback
- Quick test buttons for common scenarios

#### **C. Full Test Page** 
- Navigate to: `/permissions-test`
- Comprehensive testing interface
- Live permission results
- Current user role details

### 2. **Real-Time Features**

#### **Automatic API Calls**
- ✅ API called on every page navigation
- ✅ Permissions refreshed automatically
- ✅ Sidebar updates instantly based on new permissions

#### **Console Logging** 
Open browser DevTools Console to see:
```
🔍 Dynamic Permission Check - 2:30:15 PM
  ✅ Module "safety": true
  ✅ Function "M Safe": true  
  ❌ Sub-Function "m_safe_all": false
  ✅ Path "/safety/m-safe": true
```

#### **Live Sidebar Filtering**
- Menu items appear/disappear based on permissions
- Nested items are filtered recursively
- Loading state shown while fetching permissions

### 3. **Test Your API Response**

Your API response shows:
```json
{
  "success": true,
  "role_name": "Test Abhishek -1", 
  "role_id": 2964,
  "lock_modules": [
    {
      "module_name": "safety",
      "module_active": 1,
      "lock_functions": [
        {
          "function_name": "M Safe",
          "function_active": 1,
          "sub_functions": [
            {
              "sub_function_name": "m_safe_all",
              "enabled": false  // ❌ This will hide related sub-items
            }
          ]
        }
      ]
    }
  ]
}
```

**Expected Results:**
- ✅ **Safety section**: Visible (module_active: 1)
- ✅ **M Safe menu**: Visible (function_active: 1)  
- ❌ **M Safe sub-items**: Hidden (enabled: false)

### 4. **Testing Different Scenarios**

#### **Test A: Enable Sub-Functions**
Change your API response to:
```json
"enabled": true
```
Result: Sub-items should appear in sidebar

#### **Test B: Disable Function** 
Change your API response to:
```json
"function_active": 0  
```
Result: Entire M Safe section should disappear

#### **Test C: Disable Module**
Change your API response to:
```json
"module_active": 0
```
Result: Entire Safety section should disappear

### 5. **Dynamic Testing Steps**

1. **Open Dashboard** → Click "Show Permissions Debug"
2. **Check Current Role** → Verify your role data matches API
3. **Test Sidebar** → Navigate between sections, watch items appear/disappear
4. **Use Dynamic Checker** → Click blue eye icon (bottom-left)
5. **Try Quick Tests** → Use preset test buttons
6. **Custom Tests** → Enter your own module/function/sub-function names
7. **Watch Console** → Real-time permission check logs
8. **Navigate Pages** → See permissions refresh on each route change

### 6. **Console Commands for Testing**

Open browser console and try these commands:
```javascript
// Manual permission checks
window.permissionTest = {
  checkModule: (name) => console.log(`Module "${name}":`, /* result */),
  checkFunction: (module, func) => console.log(`Function "${func}" in "${module}":`, /* result */),
  refresh: () => /* refresh permissions */
};
```

### 7. **What You Should See**

#### **In Sidebar:**
- Safety section appears (module is active)
- M Safe menu item appears (function is active)
- M Safe sub-items may be hidden (depends on enabled flags)

#### **In Console:**
```
✅ Permission check for "M Safe": module:safety=true, function:M Safe=true
❌ Permission check for "Internal User (FTE)": subFunction:m_safe_all=false
🔄 Refreshing permissions for route: /dashboard
📡 API call: /pms/users/get_user_role.json
```

#### **In Debug Panel:**
- Complete role structure
- Module status indicators  
- Function availability
- Sub-function enabled/disabled status

### 8. **Customizing Permissions**

To add permissions to more sidebar items, edit `Sidebar.tsx`:

```typescript
// Add permission metadata to any sidebar item
{ 
  name: 'Your Menu Item', 
  href: '/your/path',
  moduleName: 'your_module',      // Maps to API module_name
  functionName: 'your_function',   // Maps to API function_name  
  subFunctionName: 'your_sub_func' // Maps to API sub_function_name
}
```

The system will automatically:
- ✅ Check module_active status
- ✅ Check function_active status  
- ✅ Check sub_function enabled status
- ✅ Show/hide items accordingly
- ✅ Log results to console

### 9. **Key Benefits**

- 🔄 **Real-time**: Permissions update on every page load
- 🎯 **Granular**: Module → Function → Sub-Function level control
- 🔍 **Transparent**: See exactly why items are shown/hidden
- ⚡ **Performance**: Efficient filtering and caching
- 🛡️ **Security**: Server-side permission enforcement
- 🧪 **Testable**: Multiple debugging tools included

Your dynamic permission system is now fully operational! 🎉
