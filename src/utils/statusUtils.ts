export const getStatusBadgeColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "breakdown":
    case "under repair":
    case "under_repair":
      return "bg-red-600 text-white"; // Critical/Alert

    case "in use":
    case "in_use":
      return "bg-green-600 text-white"; // Active/Healthy

    case "in store":
    case "in_store":
    case "in_storage":
      return "bg-blue-600 text-white"; // Informational/Storage

    case "maintenance":
      return "bg-orange-500 text-white"; // Warning/Maintenance

    case "out of order":
    case "out_of_order":
      return "bg-gray-700 text-white"; // Disabled/Error state

    case "available":
      return "bg-emerald-600 text-white"; // Success/Available

    case "reserved":
      return "bg-purple-600 text-white"; // Reserved/Pending

    case "under maintenance":
    case "under_maintenance":
      return "bg-yellow-500 text-black"; // Notice/Progressing

    default:
      return "bg-gray-500 text-white"; // Unknown/Other
  }
};

export const formatStatusText = (status: string) => {
  // Handle specific status cases with proper capitalization
  if (!status) return "Unknown";

  switch (status.toLowerCase()) {
    case "in_use":
      return "In Use";
    case "in_store":
      return "In Store";
    case "in_storage":
      return "In Storage";
    case "out_of_order":
      return "Out Of Order";
    case "under_maintenance":
      return "Under Maintenance";
    case "under_repair":
      return "Under Repair";
    case "breakdown":
      return "Breakdown";
    case "maintenance":
      return "Maintenance";
    case "available":
      return "Available";
    case "reserved":
      return "Reserved";
    default:
      return status
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
};

export const getStatusButtonColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "breakdown":
    case "under repair":
    case "under_repair":
      return "bg-red-600 text-white cursor-pointer";
    case "in use":
    case "in_use":
      return "bg-green-600 text-white cursor-default";
    case "in store":
    case "in_store":
    case "in_storage":
      return "bg-blue-600 text-white cursor-default";
    case "maintenance":
      return "bg-orange-500 text-white cursor-default";
    case "out of order":
    case "out_of_order":
      return "bg-gray-700 text-white cursor-default";
    case "available":
      return "bg-emerald-600 text-white cursor-default";
    case "reserved":
      return "bg-purple-600 text-white cursor-default";
    case "under maintenance":
    case "under_maintenance":
      return "bg-yellow-500 text-black cursor-default";
    default:
      return "bg-gray-500 text-white cursor-default";
  }
};
