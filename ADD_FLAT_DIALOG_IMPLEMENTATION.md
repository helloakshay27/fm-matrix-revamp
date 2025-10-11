# Add Flat Dialog Implementation

## Overview
Implemented a comprehensive "Add Flat" dialog that appears when clicking the "Add" button in the Manage Flats page. The dialog follows the design principles used throughout the application and matches the reference image provided.

## Features Implemented

### 1. **Dialog Structure**
- Clean, professional layout with proper spacing
- Red X close button in the top-right corner
- Scrollable content for better UX
- White background with border separation
- Maximum width: 768px (max-w-3xl)
- Maximum height: 90vh with overflow scroll

### 2. **Form Fields**

#### **Toggle Switches (Top Row)**
Three toggle switches aligned horizontally:
- **Status**: Active/Inactive toggle (default: Active/Green)
- **Possession**: Yes/No toggle (default: Yes/Green)
- **Sold**: Yes/No toggle (default: No/Red)

#### **Primary Fields** (Required marked with *)
1. **Tower*** (Dropdown)
   - Options: FM, MLCP1, Tower A, Tower B
   - Placeholder: "Select Tower"
   
2. **Flat*** (Text Input)
   - Placeholder: "Enter Flat Number"
   - Examples: 101, 102, Soc_office, G-4, etc.

3. **Carpet Area** (Text Input)
   - Placeholder: "Enter Carpet Area"
   - For square footage entry

4. **Built up Area** (Text Input)
   - Placeholder: "Enter Built up Area"
   - For square footage entry

5. **Flat Type** (Dropdown)
   - Options:
     - 1 BHK - Apartment
     - 2 BHK - Apartment
     - 3 BHK - Apartment
     - 3 BHK Luxe-Deck - Apartment
   - Placeholder: "Select Flat Type"

6. **Occupied** (Dropdown)
   - Options: Yes, No
   - Placeholder: "Please Select"

7. **Name on Bill** (Text Input)
   - Placeholder: "Enter Name on Bill"

8. **Date of possession** (Date Input)
   - Date picker field
   - Placeholder: "Date of Possession"

9. **Rm User** (Dropdown)
   - Options: User 1, User 2, User 3
   - Placeholder: "Select"

### 3. **File Attachment Section**
- **Section Title**: "Attachment Documents"
- **File Input**: Hidden, triggered by label click
- **Upload Button**: Styled outline button
- **File Selection**: Multiple files supported
- **Visual Feedback**: Upload icon with "Choose a file..." text

### 4. **Submit Button**
- Centered blue button
- Color: #0EA5E9 (Sky blue)
- Hover: #0284C7 (Darker blue)
- Text: "Submit"
- Validates required fields before submission

## Implementation Details

### State Management

```typescript
// Dialog visibility
const [showAddFlatDialog, setShowAddFlatDialog] = useState(false);

// Form data
const [addFlatFormData, setAddFlatFormData] = useState({
  status: true,           // Toggle: Active/Inactive
  possession: true,       // Toggle: Possession status
  sold: false,           // Toggle: Sold status
  tower: "",             // Dropdown: Tower selection
  flat: "",              // Input: Flat number
  carpetArea: "",        // Input: Carpet area
  builtUpArea: "",       // Input: Built up area
  flatType: "",          // Dropdown: Flat type
  occupied: "",          // Dropdown: Occupied status
  nameOnBill: "",        // Input: Name on bill
  dateOfPossession: "", // Date: Possession date
  rmUser: "",           // Dropdown: RM user
});
```

### Event Handlers

```typescript
// Open dialog
const handleAddFlat = () => {
  setShowAddFlatDialog(true);
  setShowActionPanel(false);
};

// Handle input changes
const handleAddFlatInputChange = (field: string, value: string | boolean) => {
  setAddFlatFormData(prev => ({ ...prev, [field]: value }));
};

// Submit form
const handleSubmitAddFlat = () => {
  // Validate required fields
  if (!addFlatFormData.tower || !addFlatFormData.flat) {
    toast.error("Please fill in required fields");
    return;
  }
  
  // Create new flat object
  const newFlat = {
    id: (flats.length + 1).toString(),
    tower: addFlatFormData.tower,
    flat: addFlatFormData.flat,
    flatType: addFlatFormData.flatType,
    builtUpArea: addFlatFormData.builtUpArea,
    carpetArea: addFlatFormData.carpetArea,
    nameOnBill: addFlatFormData.nameOnBill,
    possession: addFlatFormData.possession ? "Yes" : "No",
    occupancy: addFlatFormData.occupied ? "Yes" : "No",
    occupiedBy: "",
    ownerTenant: "",
    siteVisits: "0",
    sold: addFlatFormData.sold ? "Yes" : "No",
    status: addFlatFormData.status ? "active" : "inactive",
  };
  
  // Add to flats list
  setFlats([...flats, newFlat]);
  
  // Close dialog
  setShowAddFlatDialog(false);
  
  // Reset form
  setAddFlatFormData({...default values...});
  
  // Show success notification
  toast.success("Flat added successfully!");
};
```

### Components Used

#### New Import Added:
```typescript
import { Switch } from "@/components/ui/switch";
```

#### Existing Components:
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle` - Dialog wrapper
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue` - Dropdowns
- `Input` - Text and date inputs
- `Label` - Form labels
- `Button` - Submit and upload buttons
- `Switch` - Toggle switches
- `X`, `Upload` - Icons from lucide-react
- `toast` - Notification system from sonner

## User Flow

```
Manage Flats Page
      ↓
Click "Add" Button (Action Panel)
      ↓
Add Flat Dialog Opens
      ↓
User Fills Form:
  1. Toggle Status, Possession, Sold
  2. Select Tower* (Required)
  3. Enter Flat Number* (Required)
  4. Enter Carpet Area (Optional)
  5. Enter Built up Area (Optional)
  6. Select Flat Type (Optional)
  7. Select Occupied (Optional)
  8. Enter Name on Bill (Optional)
  9. Select Date of Possession (Optional)
  10. Select RM User (Optional)
  11. Upload Documents (Optional)
      ↓
Click "Submit"
      ↓
Validation:
  - If required fields missing → Error toast
  - If valid → Continue
      ↓
New Flat Added to Table
      ↓
Success Toast Shown
      ↓
Dialog Closes
      ↓
Form Reset
```

## Design Principles Applied

### 1. **Consistency**
- Matches AddFMUserModal design pattern
- Uses same component library (shadcn/ui)
- Consistent spacing and typography
- Same color scheme

### 2. **User Experience**
- Clear labels with required field indicators (*)
- Placeholder text for guidance
- Toast notifications for feedback
- Form validation
- Auto-reset after submission
- Scrollable for longer forms

### 3. **Visual Hierarchy**
- Header with title and close button
- Grouped related fields
- Toggle switches at the top
- Submit button centered and prominent
- Attachment section separated by border

### 4. **Accessibility**
- Proper label associations
- Keyboard navigation support
- Focus management
- ARIA labels from shadcn components
- Clear error messages

## Grid Layout

```
┌────────────────────────────────────────────────────┐
│  Add Flat                                    [X]   │
├────────────────────────────────────────────────────┤
│                                                    │
│  Status: [○] Possession: [○] Sold: [○]            │
│                                                    │
│  ┌──────────────────┐  ┌──────────────────┐      │
│  │ Tower*           │  │ Flat*            │      │
│  │ [Select Tower▼]  │  │ [Enter Flat...  ]│      │
│  └──────────────────┘  └──────────────────┘      │
│                                                    │
│  ┌──────────────────┐  ┌──────────────────┐      │
│  │ Carpet Area      │  │ Built up Area    │      │
│  │ [Enter...       ]│  │ [Enter...       ]│      │
│  └──────────────────┘  └──────────────────┘      │
│                                                    │
│  ┌──────────────────┐  ┌──────────────────┐      │
│  │ Flat Type        │  │ Occupied         │      │
│  │ [Select Type▼]   │  │ [Please Select▼] │      │
│  └──────────────────┘  └──────────────────┘      │
│                                                    │
│  ┌──────────────────┐  ┌──────────────────┐      │
│  │ Name on Bill     │  │ Date of possession│     │
│  │ [Enter Name...  ]│  │ [MM/DD/YYYY     ]│      │
│  └──────────────────┘  └──────────────────┘      │
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │ Rm User                                   │    │
│  │ [Select▼]                                 │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│              ┌────────────┐                       │
│              │   Submit   │                       │
│              └────────────┘                       │
│  ─────────────────────────────────────────────   │
│                                                    │
│  Attachment Documents                             │
│  📎 Choose a file...                              │
│  ┌─────────┐                                     │
│  │ upload  │                                     │
│  └─────────┘                                     │
└────────────────────────────────────────────────────┘
```

## Validation Rules

### Current Implementation:
- **Tower**: Required field
- **Flat**: Required field
- Both must be filled before submission

### Future Enhancements:
```typescript
// Additional validation ideas
const validateForm = () => {
  const errors: string[] = [];
  
  // Required fields
  if (!addFlatFormData.tower) errors.push("Tower is required");
  if (!addFlatFormData.flat) errors.push("Flat number is required");
  
  // Format validation
  if (addFlatFormData.carpetArea && isNaN(Number(addFlatFormData.carpetArea))) {
    errors.push("Carpet area must be a number");
  }
  if (addFlatFormData.builtUpArea && isNaN(Number(addFlatFormData.builtUpArea))) {
    errors.push("Built up area must be a number");
  }
  
  // Business logic validation
  if (addFlatFormData.carpetArea && addFlatFormData.builtUpArea) {
    if (Number(addFlatFormData.carpetArea) > Number(addFlatFormData.builtUpArea)) {
      errors.push("Carpet area cannot be greater than built up area");
    }
  }
  
  // Date validation
  if (addFlatFormData.dateOfPossession) {
    const possessionDate = new Date(addFlatFormData.dateOfPossession);
    if (possessionDate > new Date()) {
      errors.push("Possession date cannot be in the future");
    }
  }
  
  return errors;
};
```

## API Integration (Future)

```typescript
// POST endpoint for adding new flat
const handleSubmitAddFlat = async () => {
  try {
    // Validate
    if (!addFlatFormData.tower || !addFlatFormData.flat) {
      toast.error("Please fill in required fields");
      return;
    }
    
    // Prepare data
    const flatData = {
      tower: addFlatFormData.tower,
      flat: addFlatFormData.flat,
      flatType: addFlatFormData.flatType,
      builtUpArea: addFlatFormData.builtUpArea,
      carpetArea: addFlatFormData.carpetArea,
      nameOnBill: addFlatFormData.nameOnBill,
      possession: addFlatFormData.possession,
      occupancy: addFlatFormData.occupied,
      sold: addFlatFormData.sold,
      status: addFlatFormData.status,
      dateOfPossession: addFlatFormData.dateOfPossession,
      rmUser: addFlatFormData.rmUser,
    };
    
    // API call
    const response = await fetch('/api/flats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flatData),
    });
    
    if (!response.ok) throw new Error('Failed to add flat');
    
    const newFlat = await response.json();
    
    // Update local state
    setFlats([...flats, newFlat]);
    
    // Close and reset
    setShowAddFlatDialog(false);
    setAddFlatFormData({...defaults...});
    
    // Success notification
    toast.success("Flat added successfully!");
    
  } catch (error) {
    console.error('Error adding flat:', error);
    toast.error("Failed to add flat. Please try again.");
  }
};
```

## File Upload Implementation (Future)

```typescript
const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const files = Array.from(e.target.files);
    setAttachedFiles([...attachedFiles, ...files]);
  }
};

const handleFileUpload = async () => {
  const formData = new FormData();
  attachedFiles.forEach((file, index) => {
    formData.append(`file${index}`, file);
  });
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.fileUrls;
  } catch (error) {
    console.error('Upload error:', error);
    toast.error("Failed to upload files");
    return [];
  }
};
```

## Testing Checklist

- [x] Dialog opens when clicking Add button
- [x] Dialog has proper title "Add Flat"
- [x] Red X close button works
- [x] Status toggle works (default: true/green)
- [x] Possession toggle works (default: true/green)
- [x] Sold toggle works (default: false/red)
- [x] Tower dropdown populated and functional
- [x] Flat input accepts text
- [x] Carpet Area input accepts text
- [x] Built up Area input accepts text
- [x] Flat Type dropdown populated and functional
- [x] Occupied dropdown populated and functional
- [x] Name on Bill input accepts text
- [x] Date of Possession shows date picker
- [x] Rm User dropdown populated and functional
- [x] File upload section visible
- [x] Submit button centered
- [x] Required field validation works
- [x] Success toast shows on submit
- [x] New flat added to table
- [x] Dialog closes after submit
- [x] Form resets after submit
- [x] No TypeScript errors
- [ ] API integration (pending)
- [ ] File upload functionality (pending)
- [ ] Advanced validation (pending)

## Color Scheme

- **Primary Button**: #0EA5E9 (Sky Blue)
- **Button Hover**: #0284C7 (Dark Sky Blue)
- **Close Button**: Red (#EF4444)
- **Active Switch**: Green
- **Inactive Switch**: Red
- **Background**: White
- **Border**: Gray-200
- **Text**: Gray-900
- **Labels**: Gray-700
- **Placeholders**: Gray-400

## Responsive Design

The dialog is responsive and adapts to different screen sizes:
- **Desktop**: 768px width (max-w-3xl)
- **Tablet**: Adjusts to screen width with padding
- **Mobile**: Full width with vertical scroll
- **Max Height**: 90vh to prevent overflow

## Files Modified

### `src/pages/setup/ManageFlatsPage.tsx`

**Changes Made:**
1. Added `Switch` component import
2. Added state for dialog visibility (`showAddFlatDialog`)
3. Added state for form data (`addFlatFormData`)
4. Updated `handleAddFlat` function to open dialog
5. Added `handleAddFlatInputChange` function
6. Added `handleSubmitAddFlat` function
7. Added complete Add Flat Dialog UI
8. Integrated with existing SelectionPanel

**Lines Added**: ~250 lines
**New Functions**: 3
**New State Variables**: 2

## Integration Points

### 1. **Action Panel Integration**
The Add button in the SelectionPanel triggers the dialog:
```typescript
const handleAddFlat = () => {
  setShowAddFlatDialog(true);
  setShowActionPanel(false);
};
```

### 2. **Table Integration**
New flats are added to the existing table:
```typescript
setFlats([...flats, newFlat]);
```

### 3. **Toast Notifications**
Uses sonner for user feedback:
```typescript
toast.success("Flat added successfully!");
toast.error("Please fill in required fields");
```

## Summary

✅ **Implemented**: Complete Add Flat dialog with all fields from reference image
✅ **Design**: Follows application design principles
✅ **Validation**: Required field validation
✅ **Feedback**: Toast notifications for user actions
✅ **State Management**: Proper state handling and reset
✅ **Integration**: Seamlessly integrated with Manage Flats page
✅ **Accessibility**: Proper labels, keyboard navigation, focus management
✅ **Responsive**: Works on all screen sizes

🚀 **Ready for**: Testing, API integration, file upload implementation
