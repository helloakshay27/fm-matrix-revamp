# Staff Search API Integration Summary

## API Endpoint
- **URL**: `/pms/admin/society_staffs.json`
- **Method**: GET
- **Search Parameter**: `q[full_name_or_first_name_or_last_name_or_mobile_or_soc_staff_id_cont]`
- **Pagination**: `page` parameter for pagination support

## Search Query Structure
```
GET /pms/admin/society_staffs.json?q[full_name_or_first_name_or_last_name_or_mobile_or_soc_staff_id_cont]=John&page=1
```

## Implementation Details

### API Service Enhancement
**File**: `src/services/societyStaffsAPI.ts`

#### Updated Functions:
1. **`fetchSocietyStaffs(page, searchQuery)`**
   - Enhanced to accept optional search query parameter
   - Dynamically builds URL with search parameters
   - Maintains pagination support during search

2. **`searchSocietyStaffs(searchQuery, page)`**
   - Dedicated search function
   - Wrapper around fetchSocietyStaffs with search query

#### Query Parameter Building:
```typescript
const params = new URLSearchParams();
if (page > 1) {
  params.append('page', page.toString());
}
if (searchQuery && searchQuery.trim()) {
  params.append('q[full_name_or_first_name_or_last_name_or_mobile_or_soc_staff_id_cont]', searchQuery.trim());
}
```

### Dashboard Integration
**File**: `src/pages/StaffsDashboard.tsx`

#### New State Variables:
- `isSearching`: Loading state for search operations
- `activeSearchQuery`: Current active search query for API calls

#### Search Functionality:
1. **Dynamic Search Input**
   - Real-time input binding with `searchTerm` state
   - Enter key support for quick search
   - Search button with loading state

2. **API Integration**
   - Search triggers API call with query parameter
   - Maintains pagination during search results
   - Automatic page reset to 1 when new search is performed

3. **Search State Management**
   - Clear search functionality to return to full list
   - Search results summary showing active query and result count
   - Loading states differentiate between regular loading and searching

#### User Interface Enhancements:
- Search bar positioned above the table
- Search results summary banner
- Clear button when search is active
- Loading indicator shows "Searching..." during search operations

## Search Capabilities
The API searches across multiple fields:
- **Full Name** (`full_name`)
- **First Name** (`first_name`) 
- **Last Name** (`last_name`)
- **Mobile Number** (`mobile`)
- **Staff ID** (`soc_staff_id`)

## User Experience Features

### Search Flow:
1. User types in search input
2. User presses Enter or clicks Search button
3. API call made with search query
4. Results displayed with search summary
5. Pagination works within search results
6. User can clear search to return to full list

### Visual Feedback:
- Search button shows "Searching..." during API call
- Search results banner shows active query and count
- Clear button available when search is active
- Empty state message adapts to search context

### Performance Optimizations:
- Search query trimmed to remove whitespace
- Page reset to 1 on new search
- Selection state cleared when searching
- API calls debounced through user interaction (Enter/Button click)

## Example Usage

### Search for staff named "John":
```
GET /pms/admin/society_staffs.json?q[full_name_or_first_name_or_last_name_or_mobile_or_soc_staff_id_cont]=John
```

### Search with pagination:
```
GET /pms/admin/society_staffs.json?q[full_name_or_first_name_or_last_name_or_mobile_or_soc_staff_id_cont]=John&page=2
```

### Search by mobile number:
```
GET /pms/admin/society_staffs.json?q[full_name_or_first_name_or_last_name_or_mobile_or_soc_staff_id_cont]=9876543210
```

## Testing Instructions

1. **Navigate to Staff Dashboard**
2. **Use Search Bar**: Enter search terms in the search input above the table
3. **Test Search Methods**:
   - Press Enter in search input
   - Click Search button
4. **Verify Results**: Check search results banner and table content
5. **Test Pagination**: Navigate through search result pages
6. **Clear Search**: Click Clear button to return to full list
7. **Check Console**: Verify API calls and parameters in browser console

## Files Modified
- `src/services/societyStaffsAPI.ts` - Enhanced API service with search
- `src/pages/StaffsDashboard.tsx` - Integrated search UI and functionality

## Dependencies
- Existing API configuration from `@/config/apiConfig`
- UI components from shadcn/ui
- Toast notifications from sonner
