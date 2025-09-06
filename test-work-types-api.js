// Test file to document the expected API response structure for work types
// This file can be removed after testing

const testWorkTypesResponse = {
  // Expected API response structure for /pms/society_staff_types.json
  example: {
    "success": true,
    "data": [
      {
        "id": 126,
        "staff_type": "MILK DELIVERY",
        "active": 1,
        "related_to": null,
        "resource_id": null,
        "resource_type": "Society"
      },
      {
        "id": 146,
        "staff_type": "Shift Engineer",
        "active": 1,
        "related_to": null,
        "resource_id": null,
        "resource_type": "Society"
      },
      {
        "id": 147,
        "staff_type": "Security Guard",
        "active": 1,
        "related_to": null,
        "resource_id": null,
        "resource_type": "Society"
      }
    ]
  }
};

console.log('Expected API structure:', testWorkTypesResponse);
