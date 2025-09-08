# Edit Staff API Integration Summary

## API Endpoint
- **URL**: `/pms/admin/society_staffs/{id}.json`
- **Method**: PUT
- **Base URL**: Retrieved from `API_CONFIG.BASE_URL` (localStorage)
- **Authorization**: Bearer token from `API_CONFIG.TOKEN` (localStorage)

## Request Body Format
The API expects FormData with the following structure:

### Required Staff Fields
```
society_staff[first_name]: string
society_staff[last_name]: string  
society_staff[mobile]: string
society_staff[email]: string
```

### Optional Staff Fields
```
society_staff[soc_staff_id]: string
society_staff[department_id]: number (auto-resolved from department name)
society_staff[type_id]: number (work type ID)
society_staff[pms_unit_id]: number (auto-resolved from unit name)
society_staff[vendor_name]: string
society_staff[valid_from]: date string (YYYY-MM-DD)
society_staff[expiry]: date string (YYYY-MM-DD)
society_staff[status]: string
society_staff[password]: string (optional, only if changing)
```

### File Attachments
```
staffimage: File (profile picture)
attachments[]: File[] (documents)
```

### File Management
```
removed_files: string (comma-separated IDs of files to remove, e.g., "45,46,50")
```

## Implementation Details

### API Configuration
- Base URL and token are dynamically retrieved from localStorage via `API_CONFIG`
- Authentication header is automatically added: `Bearer {token}`
- Content-Type is automatically set by browser for FormData

### Form Data Preparation
The EditStaffPage automatically:
1. Maps dropdown selections (unit, department, work type) to their IDs
2. Formats all form fields according to API specification
3. Handles file uploads and removal tracking
4. Includes comprehensive logging for debugging

### Error Handling
- Network errors are caught and displayed via toast notifications
- API errors (4xx, 5xx) are parsed and shown to user
- Detailed console logging for debugging

### Success Flow
1. Form data is validated
2. FormData object is constructed with proper field names
3. PUT request is made to `/pms/admin/society_staffs/{id}.json`
4. Success response navigates back to staff list
5. Success toast notification is shown

## Usage Example
```typescript
// The API is automatically called when the form is submitted
const handleSubmit = async () => {
  // Form validation...
  
  const formDataToSend = new FormData();
  formDataToSend.append('society_staff[first_name]', 'UpdatedJohn');
  formDataToSend.append('society_staff[last_name]', 'UpdatedDoe');
  formDataToSend.append('society_staff[mobile]', '9876543211');
  formDataToSend.append('society_staff[email]', 'updated.john@example.com');
  formDataToSend.append('society_staff[department_id]', '5');
  formDataToSend.append('society_staff[status]', 'inactive');
  formDataToSend.append('removed_files', '45,46,50');
  
  await staffService.updateStaff(staffId, formDataToSend);
};
```

## Configuration Dependencies
- `@/config/apiConfig` - Provides BASE_URL, TOKEN, and ENDPOINTS
- `@/utils/auth` - Handles localStorage token/URL management  
- `@/services/staffService` - Contains the updateStaff method

## Files Modified
- `src/services/staffService.ts` - Enhanced updateStaff method
- `src/pages/EditStaffPage.tsx` - Updated form submission and data preparation
- `src/config/apiConfig.ts` - Already had correct endpoint configuration

## Testing
The integration includes comprehensive console logging to verify:
- Form data structure before API call
- API endpoint URL being used
- Response status and data
- Error handling and user feedback
