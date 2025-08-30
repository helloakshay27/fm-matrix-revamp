# M-Safe Module Permission Mappings

## Overview
The M-Safe module has been added to the enhanced permission checking system with comprehensive function name mappings to handle various API naming conventions.

## M-Safe Function Mappings

### Main M-Safe Module
```typescript
// Sidebar Configuration
{
  name: 'M-Safe',
  functionName: 'Msafe'
}

// API Matching Variants:
// - 'Msafe'
// - 'msafe'
// - 'm-safe'
// - 'm safe'
// - 'pms_msafe'
// - 'pms_m_safe'
```

### Sub-Functions in M-Safe Module

#### 1. Internal User (FTE)
```typescript
// Sidebar Configuration
{
  name: 'Internal User (FTE)',
  functionName: 'Msafe',
  subFunctionName: 'msafe_all'
}
```

#### 2. External User (NON FTE)
```typescript
// Sidebar Configuration
{
  name: 'External User (NON FTE)',
  functionName: 'Non Fte Users',
  subFunctionName: 'non_fte_users_all'
}

// API Matching Variants:
// - 'Non Fte Users'
// - 'non fte users'
// - 'non_fte_users'
// - 'non fte'
// - 'pms_non_fte_users'
```

#### 3. Line Manager Check (LMC)
```typescript
// Sidebar Configuration
{
  name: 'LMC',
  functionName: 'Line Manager Check',
  subFunctionName: 'line_manager_check_all'
}

// API Matching Variants:
// - 'Line Manager Check'
// - 'line manager check'
// - 'line_manager_check'
// - 'lmc'
// - 'pms_line_manager_check'
```

#### 4. Senior Management Tour (SMT)
```typescript
// Sidebar Configuration
{
  name: 'SMT',
  functionName: 'Senior Management Tour',
  subFunctionName: 'senior_management_tour_all'
}

// API Matching Variants:
// - 'Senior Management Tour'
// - 'senior management tour'
// - 'senior_management_tour'
// - 'smt'
// - 'pms_senior_management_tour'
```

#### 5. KRCC List
```typescript
// Sidebar Configuration
{
  name: 'Krcc List',
  functionName: 'Krcc List',
  subFunctionName: 'krcc_list_all'
}

// API Matching Variants:
// - 'Krcc List'
// - 'krcc list'
// - 'krcc_list'
// - 'krcc'
// - 'pms_krcc_list'
```

#### 6. Training List
```typescript
// Sidebar Configuration
{
  name: 'Training List',
  functionName: 'training_list',
  subFunctionName: 'training_list_all'
}

// API Matching Variants:
// - 'training_list'
// - 'training list'
// - 'training'
// - 'pms_training_list'
// - 'pms_training'
```

#### 7. Reportees Reassign
```typescript
// Sidebar Configuration
{
  name: 'Reportees Reassign',
  functionName: 'Msafe'
}
```

## Expected API Structure Examples

### Example 1: Direct Function Names
```json
{
  "lock_modules": [
    {
      "module_name": "PMS",
      "lock_functions": [
        {
          "function_name": "Msafe",
          "function_active": 1
        },
        {
          "function_name": "Non Fte Users", 
          "function_active": 1
        },
        {
          "function_name": "Line Manager Check",
          "function_active": 1
        }
      ]
    }
  ]
}
```

### Example 2: PMS Prefixed Functions
```json
{
  "lock_modules": [
    {
      "module_name": "PMS",
      "lock_functions": [
        {
          "function_name": "M-Safe Management",
          "action_name": "pms_msafe",
          "function_active": 1
        },
        {
          "function_name": "Employee Management",
          "action_name": "pms_non_fte_users",
          "function_active": 1
        }
      ]
    }
  ]
}
```

### Example 3: Underscore Format
```json
{
  "lock_modules": [
    {
      "module_name": "PMS",
      "lock_functions": [
        {
          "function_name": "line_manager_check",
          "function_active": 1
        },
        {
          "function_name": "senior_management_tour",
          "function_active": 1
        },
        {
          "function_name": "training_list",
          "function_active": 1
        }
      ]
    }
  ]
}
```

## How Permission Checking Works

1. **Normalization**: Function names are normalized to lowercase
2. **Variant Generation**: Multiple variants are generated based on patterns
3. **API Matching**: Both `function_name` and `action_name` are checked
4. **Flexible Matching**: Includes, contains, and exact matches are supported

### Example Permission Check Flow
```
Sidebar Item: functionName: 'Msafe'
↓
Generate Variants: ['Msafe', 'msafe', 'm-safe', 'm safe', 'pms_msafe', 'pms_m_safe']
↓
API Check: Look for any function where:
- function_name matches any variant
- action_name matches any variant
↓
Result: ✅ Granted if match found and function_active = 1
```

## Testing M-Safe Permissions

### Use the Permission Tester
Navigate to `/permissions-test` and check the "Enhanced Permission Testing" section for:

- ✅ M-Safe (using "Msafe")
- ✅ M-Safe (using "m-safe") 
- ✅ M-Safe (using "pms_msafe")
- ✅ Non FTE Users (using "Non Fte Users")
- ✅ LMC (using "Line Manager Check")
- ✅ SMT (using "Senior Management Tour")
- ✅ KRCC List (using "Krcc List")
- ✅ Training List (using "training_list")

### Console Debugging
Enable browser console to see detailed matching:
```
✅ Permission check for "M-Safe": module:PMS=active, function:pms_msafe=active
✅ Permission check for "LMC": module:PMS=active, function:line_manager_check=active
```

## Benefits for M-Safe Module

1. **Flexible API Support**: Works with various naming conventions
2. **Backward Compatibility**: Existing function names still work
3. **Abbreviation Support**: LMC, SMT abbreviations are recognized
4. **PMS Prefix Handling**: Handles pms_* prefixed function names
5. **Case Insensitive**: Works regardless of case variations

The M-Safe module permissions are now fully integrated with the enhanced permission system! 🔒
