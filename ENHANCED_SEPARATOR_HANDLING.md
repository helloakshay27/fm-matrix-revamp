# Enhanced Separator Handling for Permission Matching

## Overview
The permission system now includes comprehensive handling for different separator patterns in function names, including spaces, underscores, and hyphens. This ensures maximum compatibility with various API naming conventions.

## Separator Handling Features

### 1. **Automatic Separator Conversion**
The system automatically generates variants for any function name with different separators:

#### Input: `"line manager check"`
Generated Variants:
- `"line manager check"` (original)
- `"line_manager_check"` (spaces to underscores)
- `"line-manager-check"` (spaces to hyphens)  
- `"linemanagercheck"` (spaces removed)

#### Input: `"pms_assets"`
Generated Variants:
- `"pms_assets"` (original)
- `"pms assets"` (underscores to spaces)
- `"pms-assets"` (underscores to hyphens)
- `"pmsassets"` (underscores removed)

#### Input: `"m-safe"`
Generated Variants:
- `"m-safe"` (original)
- `"m safe"` (hyphens to spaces)
- `"m_safe"` (hyphens to underscores)
- `"msafe"` (hyphens removed)

### 2. **Comprehensive Function Mappings**

Each function now supports multiple separator variations:

#### Assets Function
```typescript
// Sidebar Configuration
functionName: 'assets'

// Matches ALL these API variations:
- "assets", "asset"
- "pms_assets", "pms-assets", "pms assets"
- "pmsassets", "pms_asset", "pms-asset"
- And many more combinations...
```

#### M-Safe Function
```typescript
// Sidebar Configuration  
functionName: 'Msafe'

// Matches ALL these API variations:
- "Msafe", "msafe"
- "m-safe", "m_safe", "m safe"
- "pms_msafe", "pms-msafe", "pms msafe"
- "pms_m_safe", "pms-m-safe", "pms m safe"
- "pmsmsafe", "pmsm_safe", "pmsm-safe"
- And many more combinations...
```

#### Line Manager Check Function
```typescript
// Sidebar Configuration
functionName: 'Line Manager Check'

// Matches ALL these API variations:
- "Line Manager Check", "line manager check"
- "line_manager_check", "line-manager-check"
- "linemanagercheck", "lmc"
- "pms_line_manager_check", "pms-line-manager-check"
- "pms line manager check", "pmslinemanagercheck"
- And many more combinations...
```

### 3. **Smart Pattern Recognition**

The system uses intelligent pattern recognition for complex function names:

#### Non-FTE Users
```typescript
// Recognizes any combination containing "non" + "fte" or "user":
- "Non Fte Users" ✅
- "non_fte_users" ✅
- "non-fte-users" ✅
- "nonfteusers" ✅
- "non fte" ✅
- "pms_non_fte_users" ✅
```

#### Senior Management Tour
```typescript
// Recognizes any combination containing "senior" + "management":
- "Senior Management Tour" ✅
- "senior_management_tour" ✅
- "senior-management-tour" ✅
- "seniormanagementtour" ✅
- "smt" ✅
- "pms_senior_management_tour" ✅
```

#### Training Functions
```typescript
// Recognizes any combination containing "training":
- "training_list" ✅
- "training-list" ✅
- "training list" ✅
- "traininglist" ✅
- "training" ✅
- "pms_training_list" ✅
- "pms-training" ✅
```

## API Compatibility Examples

### Example 1: Underscore Convention
```json
{
  "lock_modules": [
    {
      "module_name": "PMS",
      "lock_functions": [
        {
          "function_name": "pms_assets",
          "action_name": "asset_management"
        },
        {
          "function_name": "line_manager_check",
          "action_name": "lmc_operations"
        }
      ]
    }
  ]
}
```

### Example 2: Hyphen Convention
```json
{
  "lock_modules": [
    {
      "module_name": "PMS", 
      "lock_functions": [
        {
          "function_name": "pms-assets",
          "action_name": "asset-management"
        },
        {
          "function_name": "m-safe",
          "action_name": "safety-management"
        }
      ]
    }
  ]
}
```

### Example 3: Space Convention
```json
{
  "lock_modules": [
    {
      "module_name": "PMS",
      "lock_functions": [
        {
          "function_name": "pms assets", 
          "action_name": "asset management"
        },
        {
          "function_name": "senior management tour",
          "action_name": "smt operations"  
        }
      ]
    }
  ]
}
```

### Example 4: Mixed Conventions
```json
{
  "lock_modules": [
    {
      "module_name": "PMS",
      "lock_functions": [
        {
          "function_name": "Line Manager Check",
          "action_name": "lmc_operations"
        },
        {
          "function_name": "non-fte-users",
          "action_name": "external_user_management"
        }
      ]
    }
  ]
}
```

## How It Works

### 1. **Input Processing**
```
Sidebar Item: functionName: "Line Manager Check"
↓
Normalize: "line manager check"
↓
Generate Base Variants: ["Line Manager Check", "line manager check"]
```

### 2. **Separator Conversion**  
```
Apply Separator Conversion:
- "line manager check" → "line_manager_check"
- "line manager check" → "line-manager-check"  
- "line manager check" → "linemanagercheck"
```

### 3. **Special Mappings**
```
Apply Special Mappings (Line Manager Check):
- Add: "lmc", "pms_line_manager_check"
- Add: "pms-line-manager-check", "pms line manager check"
```

### 4. **Final Variant Generation**
```
Apply Separator Conversion to All Variants:
- Generate 50+ possible combinations
- Remove duplicates
- Return unique variant list
```

### 5. **API Matching**
```
Check API Response:
For each function in lock_functions:
  - Check function_name against all variants
  - Check action_name against all variants
  - Use flexible string matching (contains, equals)
```

## Benefits

1. **🔄 Maximum Compatibility**: Works with ANY separator convention
2. **🎯 Intelligent Matching**: Recognizes patterns beyond exact matches
3. **🚀 Future-Proof**: Automatically handles new separator variations
4. **🔍 Comprehensive Coverage**: Generates 20-50+ variants per function
5. **⚡ Performance Optimized**: Removes duplicates and caches results
6. **🛠️ Debugging Friendly**: Detailed console logs show all matched variants

## Testing the Enhanced System

### Navigate to Permission Tester
Go to `/permissions-test` and check the "Enhanced Permission Testing" section.

You'll now see 32+ test cases covering various separator combinations:

- ✅ Assets (using "pms-assets")
- ✅ Assets (using "pms assets") 
- ✅ Tickets (using "pms-complaints")
- ✅ Services (using "pms-services")
- ✅ M-Safe (using "m_safe")
- ✅ M-Safe (using "pms-msafe")
- ✅ Non FTE Users (using "non-fte-users")
- ✅ LMC (using "line-manager-check")
- ✅ SMT (using "senior-management-tour")
- ✅ Training List (using "training-list")
- And many more...

### Console Debugging
```
✅ Permission check for "Assets": variants=[assets,asset,pms_assets,pms-assets,pms assets,pmsassets,...], matched=pms-assets
✅ Permission check for "LMC": variants=[line manager check,line_manager_check,lmc,...], matched=line-manager-check
```

## Ready for Any API! 🎉
The enhanced separator handling ensures your permission system will work regardless of how your API names its functions - whether using spaces, underscores, hyphens, or any combination thereof!
