# Patrolling API Integration Guide

## Overview
The PatrollingCreatePage now includes mock API integration with a structured payload that's ready for real API integration.

## How to Test

### 1. Fill the Form and Submit
1. Open the application in your browser
2. Navigate to the Patrolling Create Page
3. Fill out the form with sample data:
   - **Patrol Name**: "Night Security Patrol"
   - **Start Date**: Today's date
   - **End Date**: A future date
   - **Grace Period**: "30"
   - Add questions, shifts, and checkpoints
4. Click Submit
5. Check the browser console (F12 → Console) to see the payload structure

### 2. Test Payload Structure from Console
1. Open browser console (F12 → Console)
2. Run: `window.testPatrollingPayload()`
3. This will log a complete test payload structure

## Console Output

When you submit the form, you'll see detailed console logs:

```
🔄 Starting Patrolling Creation...
📋 Form Data Summary:
- Patrol Name: Night Security Patrol
- Date Range: 2025-08-13 to 2025-08-20
- Grace Period: 30
- Questions: 2
- Shifts: 1
- Checkpoints: 1
- Auto Ticket: true
📊 Detailed Form Data: {...}
🚀 API Call - Create Patrolling
📤 Payload Structure: {...}
📥 API Response: {...}
✅ Patrolling created successfully!
🎯 Created ID: patrol_1723456789
```

## Payload Structure

The generated payload follows this structure:

```json
{
  "patrolling": {
    "name": "Night Security Patrol",
    "autoTicket": true,
    "validity": {
      "startDate": "2025-08-13",
      "endDate": "2025-08-20",
      "gracePeriod": "30"
    },
    "questions": [
      {
        "id": 1,
        "task": "Check main entrance",
        "inputType": "checkbox",
        "mandatory": true
      }
    ],
    "shifts": [
      {
        "id": 1,
        "name": "Night Shift",
        "startTime": "22:00",
        "endTime": "06:00",
        "assignee": "user1",
        "supervisor": "sup1"
      }
    ],
    "checkpoints": [
      {
        "id": 1,
        "building": "b1",
        "wing": "w1",
        "floor": "f1",
        "area": "a1",
        "room": "r1",
        "shift": "shift-1"
      }
    ]
  },
  "metadata": {
    "createdAt": "2025-08-13T10:30:00.000Z",
    "createdBy": "current-user-id",
    "version": "1.0"
  }
}
```

## Integrating with Real API

When you get your real API, follow these steps:

### 1. Replace Mock API Service
In `PatrollingCreatePage.tsx`, replace the `mockPatrollingAPI` object:

```typescript
// Replace this mock service
const mockPatrollingAPI = {
  createPatrolling: async (payload: any) => {
    // Mock implementation
  }
};

// With your real API service
const patrollingAPI = {
  createPatrolling: async (payload: any) => {
    const response = await fetch('/api/patrolling/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`, // Add if needed
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  }
};
```

### 2. Update the API Call
In the `handleSubmit` function, change:
```typescript
const response = await mockPatrollingAPI.createPatrolling(payload);
```
to:
```typescript
const response = await patrollingAPI.createPatrolling(payload);
```

### 3. Handle Real API Responses
Update the response handling based on your API's response format:

```typescript
if (response.success) {
  // Handle success
} else {
  // Handle error
}
```

## Form Validation

The form includes basic validation for:
- ✅ Patrol name is required
- ✅ Start and end dates are required  
- ✅ All questions must have a task
- ✅ Loading state during submission

## Features

- 🔄 **Loading State**: Submit button shows "Submitting..." during API call
- 📝 **Form Validation**: Basic validation before submission
- 🔍 **Console Logging**: Detailed logging for debugging
- 🧪 **Test Function**: `window.testPatrollingPayload()` for testing
- 📊 **Structured Payload**: Clean, organized data structure
- 🎯 **Easy Integration**: Just change the API endpoint and you're ready

## Next Steps

1. Get your real API endpoint from the backend team
2. Test the payload structure with your API
3. Adjust field mappings if needed
4. Add authentication headers if required
5. Handle specific error responses from your API

The payload structure is designed to be flexible and should work with most REST APIs. If your API expects a different structure, you can easily modify the `buildPayload()` function.
