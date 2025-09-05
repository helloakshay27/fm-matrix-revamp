# Enhanced MUI Select Implementation Guide

This implementation provides **Short Height Control**, **Internal Scroll**, and **Search Functionality** for all MUI Select components in the project.

## 🚀 Quick Implementation

### Method 1: Using Enhanced Select Component (Recommended for new components)

```tsx
import { SearchableSelect, EnhancedSelect } from '@/components/ui/enhanced-select';

// Searchable Select with auto-complete
<SearchableSelect
  label="Select Building"
  value={formData.building}
  onChange={(value) => handleChange('building', value)}
  options={[
    { value: 'tower1', label: 'Tower 1' },
    { value: 'tower2', label: 'Tower 2' },
    // ... more options
  ]}
  placeholder="Search and select building..."
  searchable
/>

// Standard Select with enhanced features
<EnhancedSelect
  label="Select Category"
  value={formData.category}
  onChange={(value) => handleChange('category', value)}
  options={categoryOptions}
  placeholder="Select category..."
/>
```

### Method 2: Using Hook with Existing MUI Components (Recommended for existing code)

```tsx
import { useEnhancedSelectStyles } from '@/hooks/useEnhancedSelectStyles';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const MyComponent = () => {
  const { fieldStyles, menuProps } = useEnhancedSelectStyles();

  return (
    <FormControl fullWidth>
      <InputLabel shrink>Select Option</InputLabel>
      <MuiSelect
        value={value}
        onChange={handleChange}
        label="Select Option"
        sx={fieldStyles}          // ✅ Short Height Control
        MenuProps={menuProps}     // ✅ Internal Scroll
      >
        <MenuItem value="">Select Option</MenuItem>
        <MenuItem value="option1">Option 1</MenuItem>
        <MenuItem value="option2">Option 2</MenuItem>
        {/* ... more options */}
      </MuiSelect>
    </FormControl>
  );
};
```

### Method 3: Using Utility Functions (Quickest for existing components)

```tsx
import { getEnhancedSelectProps } from '@/utils/enhancedSelectUtils';

// Simply spread the enhanced props into existing Select
<MuiSelect
  value={value}
  onChange={handleChange}
  label="Select Option"
  {...getEnhancedSelectProps()}  // ✅ All features applied
>
  <MenuItem value="">Select Option</MenuItem>
  {/* ... options */}
</MuiSelect>
```

### Method 4: Using Global CSS Classes (For quick styling without code changes)

```tsx
// Add className to existing FormControl/Select
<FormControl className="enhanced-select-global">
  <InputLabel>Select Option</InputLabel>
  <MuiSelect
    value={value}
    onChange={handleChange}
    MenuProps={{ className: 'enhanced-select-menu' }}
  >
    {/* ... options */}
  </MuiSelect>
</FormControl>
```

## 📋 Features Provided

### 1. Short Height Control
- **Mobile**: 36px height
- **Tablet**: 40px height  
- **Desktop**: 45px height
- Responsive padding adjustments

### 2. Internal Scroll
- Maximum dropdown height: 200px
- Automatic scrollbar when content exceeds height
- Smooth scrolling experience
- Consistent z-index management

### 3. Search Functionality
- Type-ahead search in dropdown options
- Real-time filtering as you type
- Works with large option lists
- Maintains keyboard navigation

## 🔧 Advanced Usage

### Creating Options Arrays

```tsx
import { createEnhancedOptions } from '@/utils/enhancedSelectUtils';

// From simple string array
const simpleOptions = createEnhancedOptions(['Option 1', 'Option 2', 'Option 3']);

// From custom objects
const complexOptions = [
  { value: 'id1', label: 'Display Name 1', disabled: false },
  { value: 'id2', label: 'Display Name 2', disabled: true },
];
```

### Custom Styling Override

```tsx
const { fieldStyles, menuProps } = useEnhancedSelectStyles();

const customFieldStyles = {
  ...fieldStyles,
  '& .MuiOutlinedInput-root': {
    ...fieldStyles['& .MuiOutlinedInput-root'],
    backgroundColor: '#f5f5f5', // Custom background
  },
};

<MuiSelect
  sx={customFieldStyles}
  MenuProps={menuProps}
  // ... other props
/>
```

### Searchable Select with Custom Filter

```tsx
<SearchableSelect
  label="Advanced Search"
  value={value}
  onChange={onChange}
  options={options}
  freeSolo={true}               // Allow custom input
  multiple={false}              // Single selection
  placeholder="Type to search..."
/>
```

## 🎯 Migration Guide

### For Existing Components

1. **Add the import**:
   ```tsx
   import { useEnhancedSelectStyles } from '@/hooks/useEnhancedSelectStyles';
   ```

2. **Add the hook**:
   ```tsx
   const { fieldStyles, menuProps } = useEnhancedSelectStyles();
   ```

3. **Update your Select**:
   ```tsx
   // Before
   <MuiSelect sx={fieldStyles}>
   
   // After  
   <MuiSelect sx={fieldStyles} MenuProps={menuProps}>
   ```

### Batch Update Script

For updating multiple files at once, you can use this pattern:

```tsx
// Find all instances of MuiSelect and add MenuProps
// Before:
<MuiSelect sx={existingStyles}>

// After:
<MuiSelect sx={existingStyles} MenuProps={enhancedMenuProps}>
```

## 🎨 Styling Reference

### CSS Classes Available
- `.enhanced-select-global` - Apply to FormControl
- `.enhanced-select-menu` - Apply to MenuProps.className
- `.enhanced-autocomplete-global` - Apply to Autocomplete

### Default Styling Variables
```css
/* Height Control */
--select-height-mobile: 36px;
--select-height-tablet: 40px; 
--select-height-desktop: 45px;

/* Scroll Control */
--menu-max-height: 200px;
--menu-z-index: 9999;
```

## 🔍 Examples in Codebase

Check these files for implementation examples:

1. **`/src/components/SnaggingFilterDialog.tsx`** - Using useEnhancedSelectStyles hook
2. **`/src/pages/UnitMasterPage.tsx`** - Using SearchableSelect component  
3. **`/src/pages/AddInventoryPage.tsx`** - Using enhanced hooks with existing MUI components

## 🎪 Benefits

✅ **Consistent UI** - All selects have the same height and behavior  
✅ **Better UX** - No more endless scrolling through long lists  
✅ **Search Capability** - Quick filtering for better usability  
✅ **Responsive** - Works great on all screen sizes  
✅ **Easy Migration** - Multiple implementation methods for different needs  
✅ **Performance** - Optimized rendering for large option lists

## 🚨 Notes

- Import the enhanced select CSS in your main CSS file
- The hook uses `useMemo` for performance optimization
- All components maintain existing prop compatibility
- Z-index is managed globally to prevent dropdown overlay issues
- Search is case-insensitive and searches through option labels
