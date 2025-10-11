# Manage Flats - Center Alignment & Configure Flat Type Dialog

## Updates Made

### 1. **Center-Aligned Table Cells**

All table cells in the main Manage Flats table are now center-aligned for better visual presentation.

#### Changes in `renderCell` function:
- **Actions column**: Added `justify-center` to center the edit icon
- **Status column**: Already centered (toggle switch)
- **All other columns**: Wrapped content in `<div className="text-center">` for center alignment

**Before**:
```tsx
default:
  return <span className="text-sm text-gray-900">{flat[columnKey] || "-"}</span>;
```

**After**:
```tsx
default:
  return (
    <div className="text-center">
      <span className="text-sm text-gray-900">{flat[columnKey] || "-"}</span>
    </div>
  );
```

### 2. **Configure Flat Type Dialog**

The "Unit" button now opens a comprehensive dialog for managing flat/unit types.

#### Dialog Features:

**Header Section**:
- Title: "Configure Flat Type"
- Red X close button (top-right)

**Form Section** (3 fields):
1. **Flat/Unit Type**
   - Text input field
   - Placeholder: "Enter Flat Type"

2. **Configuration**
   - Dropdown/Select field
   - Placeholder: "Select any"
   - Options: Various flat configurations

3. **Apartment Type**
   - Dropdown/Select field
   - Placeholder: "Select Type"
   - Options:
     - Apartment
     - Villa
     - Penthouse
     - Studio
     - Office
     - Shop
     - Parking

**Submit Button**:
- Green button to add new flat type
- Position: Below form fields

#### Flat/Unit Type List Table

Displays all configured flat types in a table format:

**Columns** (5 total):
1. **Id**: Unique identifier (center-aligned)
2. **Flat/Unit Type**: Name (e.g., "2 BHK", "1301") (center-aligned)
3. **Apartment Type**: Type selection dropdown (center-aligned)
4. **Status**: Checkbox for active/inactive (center-aligned)
5. **Edit**: Edit icon button (center-aligned)

**Table Features**:
- ✅ All columns center-aligned
- ✅ Hover effect on rows (gray background)
- ✅ Border and rounded corners
- ✅ Edit mode for Apartment Type
- ✅ Status checkboxes (red with white checkmark when active)
- ✅ Edit/Save button toggle

**Sample Data** (7 flat types):
- 549: 2 BHK → Apartment
- 585: 1 BHK → Apartment
- 586: 3 BHK → Apartment
- 587: 3 BHK Luxe-Deck → Apartment
- 588: NA BHK → Apartment
- 614: 1301 → Select Apartment
- 839: 403 BHK → Apartment

## Implementation Details

### State Management

```typescript
interface FlatType {
  id: number;
  flatUnitType: string;
  apartmentType: string;
  status: boolean;
}

// State variables
const [showConfigureDialog, setShowConfigureDialog] = useState(false);
const [flatTypes, setFlatTypes] = useState<FlatType[]>([...]);
const [newFlatType, setNewFlatType] = useState("");
const [newConfiguration, setNewConfiguration] = useState("");
const [newApartmentType, setNewApartmentType] = useState("");
const [editingFlatType, setEditingFlatType] = useState<number | null>(null);
const [editedApartmentType, setEditedApartmentType] = useState("");
```

### Event Handlers

```typescript
handleAddUnit()
  - Opens the Configure Flat Type dialog
  - Sets showConfigureDialog to true

handleSubmitFlatType()
  - Adds new flat type to the list
  - Shows success toast notification
  - Clears form fields

handleEditFlatType(id)
  - Enables edit mode for specific flat type
  - Allows changing apartment type via dropdown

handleSaveEdit(id)
  - Saves edited apartment type
  - Exits edit mode
  - Shows success toast

handleToggleFlatTypeStatus(id)
  - Toggles active/inactive status
  - Updates checkbox state
```

### Center Alignment Implementation

**Main Table**:
```tsx
// Actions column
<div className="flex items-center justify-center gap-2">
  {/* Edit button */}
</div>

// All other columns
<div className="text-center">
  <span className="text-sm text-gray-900">{content}</span>
</div>
```

**Dialog Table**:
```tsx
// Table headers
<th className="px-4 py-3 text-center text-sm font-medium text-gray-700">

// Table cells
<td className="px-4 py-3 text-sm text-gray-900 text-center">

// Centered status checkbox
<td className="px-4 py-3 text-center">
  <div className="flex items-center justify-center">
    <Checkbox />
  </div>
</td>

// Centered edit button
<td className="px-4 py-3 text-center">
  <button className="inline-flex items-center justify-center">
    <Edit2 />
  </button>
</td>
```

## UI/UX Improvements

### 1. Center Alignment Benefits
- **Better Visual Hierarchy**: Content is easier to scan
- **Professional Look**: Cleaner, more organized appearance
- **Consistency**: Matches modern table design patterns
- **Improved Readability**: Especially for short text and icons

### 2. Dialog Design
- **Clean Layout**: Well-organized form fields
- **Clear Labels**: Each field properly labeled
- **Intuitive Controls**: Dropdown selections for predefined values
- **Immediate Feedback**: Toast notifications for actions
- **Edit-in-Place**: Inline editing for apartment types
- **Visual Status**: Checkboxes clearly show active/inactive state

### 3. Interactive Features
- **Edit Mode Toggle**: Click edit icon → dropdown appears → save with check icon
- **Status Management**: Click checkbox to toggle active/inactive
- **Form Validation**: Ready for validation rules (to be added)
- **Responsive Design**: Dialog adapts to screen size

## Components Used

### New Imports Added:
- `Check` from lucide-react (for save button icon)
- `X` from lucide-react (for close button)
- `Edit2` from lucide-react (for edit button)
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle` from shadcn/ui
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue` from shadcn/ui
- `Input` from shadcn/ui
- `Label` from shadcn/ui
- `Checkbox` from shadcn/ui
- `toast` from sonner

## User Flow

```
Manage Flats Page
      ↓
Click "+ Unit" Button
      ↓
Configure Flat Type Dialog Opens
      ↓
Options:
  1. Add New Flat Type
     - Enter flat type
     - Select configuration
     - Select apartment type
     - Click Submit
     → New flat type added
     → Success notification
     → Form clears
  
  2. Edit Existing Flat Type
     - Click Edit icon (✏️)
     - Dropdown appears for apartment type
     - Select new type
     - Click Save (✓)
     → Type updated
     → Success notification
     → Edit mode exits
  
  3. Toggle Status
     - Click checkbox
     → Status toggled
     → Checkbox updates visually
  
  4. Close Dialog
     - Click X button
     - Click outside dialog
     - Press Escape key
     → Dialog closes
```

## Future Enhancements

### Form Validation
- Required field validation
- Duplicate flat type check
- Format validation for flat type names
- Configuration validation

### API Integration
```typescript
// GET flat types
const fetchFlatTypes = async () => {
  const response = await fetch('/api/flat-types');
  const data = await response.json();
  setFlatTypes(data.flatTypes);
};

// POST new flat type
const createFlatType = async (flatType: FlatType) => {
  const response = await fetch('/api/flat-types', {
    method: 'POST',
    body: JSON.stringify(flatType),
  });
  return response.json();
};

// PUT update flat type
const updateFlatType = async (id: number, data: Partial<FlatType>) => {
  const response = await fetch(`/api/flat-types/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
};

// DELETE flat type
const deleteFlatType = async (id: number) => {
  await fetch(`/api/flat-types/${id}`, { method: 'DELETE' });
};
```

### Additional Features
- Bulk delete flat types
- Sort flat types list
- Search/filter flat types
- Export flat types configuration
- Import flat types from file
- Drag-and-drop reordering
- Duplicate flat type option
- Archive instead of delete

## Testing Checklist

- [x] Main table cells center-aligned
- [x] "Unit" button opens dialog
- [x] Dialog displays correctly
- [x] Form fields functional
- [x] Submit button adds new flat type
- [x] Flat types list displays
- [x] All 5 columns shown
- [x] Table cells center-aligned in dialog
- [x] Edit button enables edit mode
- [x] Apartment type dropdown works
- [x] Save button updates type
- [x] Status checkbox toggles
- [x] Toast notifications show
- [x] Close button works
- [x] No TypeScript errors
- [ ] API integration (pending)
- [ ] Form validation (pending)
- [ ] Data persistence (pending)

## Files Modified

- `src/pages/setup/ManageFlatsPage.tsx`
  - Added new imports (Dialog, Select, Input, Label, Checkbox, icons)
  - Updated `renderCell` function for center alignment
  - Dialog already implemented (was present in file)
  - Fixed duplicate imports issue

## Visual Improvements

### Before:
- Table cells left-aligned
- Inconsistent visual hierarchy
- "Unit" button didn't do anything

### After:
- ✅ All table cells center-aligned
- ✅ Professional, balanced appearance
- ✅ "Unit" button opens functional dialog
- ✅ Complete flat type management system
- ✅ Inline editing capability
- ✅ Status management
- ✅ Form for adding new types
- ✅ Toast notifications for feedback

## Accessibility

- ✅ Keyboard navigation in dialog
- ✅ Tab order is logical
- ✅ Escape key closes dialog
- ✅ Focus management
- ✅ ARIA labels from shadcn components
- ✅ Screen reader support
- ✅ Proper form labels
- ✅ Button titles for icons

## Notes

- Center alignment improves visual consistency across the table
- Dialog provides comprehensive flat type management in one place
- Edit-in-place functionality reduces navigation steps
- Toast notifications provide immediate user feedback
- All UI components are from shadcn/ui for consistency
- Ready for backend API integration
- Matches design patterns from reference image
