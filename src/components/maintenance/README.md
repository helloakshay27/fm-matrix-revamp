# Calendar PDF Generator

## Overview
The `CalendarPDFGenerator.tsx` component provides comprehensive PDF export functionality for the Scheduled Task Calendar. It can dynamically handle any number of tasks and automatically paginate them for optimal viewing.

## Features

### Dynamic Task Display
- **All Tasks Included**: Shows all tasks in the dataset, no artificial limits
- **Smart Pagination**: Automatically breaks into pages with 40 tasks per page for optimal readability
- **Compact Layout**: Reduced font sizes and padding to fit more content per page

### Multiple View Types
- **List View**: Comprehensive table format showing all task details
- **Monthly View**: Traditional calendar grid for monthly overview
- **Yearly View**: 12-month calendar grid for year-long planning

### Enhanced Content
- **Task Statistics**: Shows PPM, AMC, and Other task counts
- **Status Indicators**: Color-coded status dots for easy identification
- **Task Type Badges**: Visual categorization of task types
- **Pagination Info**: Clear page numbering and task ranges
- **Summary Footer**: Total counts and distribution on final page

### Optimized Performance
- **JPEG Compression**: Uses 70% quality JPEG for smaller file sizes
- **A4 Page Format**: Optimized for standard printing
- **Page Breaks**: Smart page breaks every 40 tasks
- **Responsive Headers**: Each page has proper headers with context

## Usage

```typescript
import { useCalendarPDFGenerator } from './CalendarPDFGenerator';

const { generatePDF } = useCalendarPDFGenerator();

await generatePDF({
  events: calendarEvents,
  view: 'listWeek', // or 'dayGridMonth', 'timeGridWeek', 'year'
  date: new Date(),
  activeFilters: filters,
  onUpdateToast: (message, show) => {
    // Handle toast messages
  }
});
```

## Technical Details

### Page Layout
- **40 tasks per page**: Optimal balance between content and readability
- **Reduced font sizes**: 11px for content, 9-10px for details
- **Compact table cells**: 5-6px padding for efficiency
- **Smart column widths**: Optimized percentages for content distribution

### File Naming
Files are automatically named with format:
`Scheduled-Tasks-Calendar-{ViewName}-{DateRange}.pdf`

Examples:
- `Scheduled-Tasks-Calendar-List-View-Aug-2025.pdf`
- `Scheduled-Tasks-Calendar-Year-View-2025.pdf`

### Task Categories
- **PPM Tasks**: Purple badges (#a78bfa)
- **AMC Tasks**: Green badges (#84cc16)  
- **Other Tasks**: Pink badges (#f472b6)

### Status Colors
- **Scheduled**: Yellow (#facc15)
- **Open**: Pink (#ec4899)
- **In Progress**: Blue (#3b82f6)
- **Completed/Closed**: Green (#22c55e)
- **Overdue**: Red (#ef4444)

## Benefits
1. **Complete Data Export**: No task limits, all data included
2. **Professional Layout**: Clean, organized table format
3. **Efficient Pagination**: Readable pages without cramming
4. **Rich Information**: Comprehensive task details and statistics
5. **Print-Ready**: Optimized for A4 printing and digital viewing
