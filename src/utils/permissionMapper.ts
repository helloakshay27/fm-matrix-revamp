// Permission mapping utilities for transforming UI permissions to API format

// Maps display names to API permission keys
export const permissionDisplayToApiKeyMap: Record<string, string> = {
  // All Functions mappings
  'Broadcast': 'notices',
  'Asset': 'assets',
  'Documents': 'documents',
  'Tickets': 'tickets',
  'Supplier': 'suppliers',
  'Tasks': 'tasks',
  'Service': 'services',
  'Meters': 'meters',
  'AMC': 'amcs',
  'Schedule': 'schedules',
  'Materials': 'materials',
  'PO': 'purchase_orders',
  'WO': 'work_orders',
  'Report': 'reports',
  'Attendance': 'attendance',
  'Business Directory': 'business_directory',
  'PO Approval': 'po_approvals',
  'Dashboard': 'dashboard',
  'Tracing': 'tracing',
  'BI Reports': 'bi_reports',
  'Restaurants': 'restaurants',
  'My Ledgers': 'my_ledgers',
  'Letter Of Indent': 'letter_of_indent',
  'Wo Invoices': 'wo_invoices',
  'Bill': 'bills',
  'Engineering Reports': 'engineering_reports',
  'Events': 'events',
  'Customers': 'customers',
  'QuickGate Report': 'quickgate_reports',
  'Task Management': 'task_management',
  'CEO Dashboard': 'ceo_dashboard',
  'Operational Audit': 'operational_audit',
  'Mom Details': 'mom_details',
  'Pms Design Inputs': 'pms_design_inputs',
  'Vendor Audit': 'vendor_audit',
  'Permits': 'permits',
  'Pending Approvals': 'pending_approvals',
  'Accounts': 'accounts',
  'Customer Bills': 'customer_bills',
  'My Bills': 'my_bills',
  'Water': 'water',
  'STP': 'stp',
  'Daily Readings': 'daily_readings',
  'Utility Consumption': 'utility_consumption',
  'Utility Request': 'utility_request',
  'Space': 'space',
  'Project Management': 'project_management',
  'Pms Incidents': 'pms_incidents',
  'Site Dashboard': 'site_dashboard',
  'Steppstone Dashboard': 'steppstone_dashboard',
  'Transport': 'transport',
  'Waste Generation': 'waste_generation',
  'GDN': 'gdn',
  'Parking': 'parking',
  'GDN Dispatch': 'gdn_dispatch',
  'EV Consumption': 'ev_consumption',
  'Msafe': 'msafe',
  'Permit Extend': 'permit_extend',
  'Local Travel Module': 'local_travel_module',
  'KRCC': 'krcc',
  'Training': 'training',
  'Approve Krcc': 'approve_krcc',
  'Vi Register User': 'vi_register_user',
  'Vi DeRegister User': 'vi_deregister_user',
  'Line Manager Check': 'line_manager_check',
  'Senior Management Tour': 'senior_management_tour',
  'Solar Generator': 'solar_generator',
  'Customer Permit': 'customer_permit',
  'Customer Parkings': 'customer_parkings',
  'Customer Wallet': 'customer_wallet',
  'Site Banners': 'banners',
  'Testimonials': 'testimonials',
  'Group And Channel Config': 'group_channel_config',
  'Shared Content Config': 'shared_content_config',
  'Site And Facility Config': 'site_facility_config',
  'Occupant Users': 'occupant_users',
  'Clear SnagAnswers': 'clear_snag_answers',
  'Non Re Users': 'non_re_users',
  'Download Msafe Report': 'download_msafe_report',
  'Download Msafe Detailed Report': 'download_msafe_detailed_report',
  'training_list': 'training_list',
  'Vi Miles': 'vi_miles',
  'Krcc List': 'krcc_list',
  'Vi MSafe Dashboard': 'vi_msafe_dashboard',
  'Vi Miles Dashboard': 'vi_miles_dashboard',
  'Resume Permit': 'resume_permit',
  'Permit Checklist': 'permit_checklist',
  'Send To Sap': 'send_to_sap',
  'Community Module': 'community_module',
  'Facility Setup': 'facility_setup',
  'Mail Room': 'mail_room',
  'Parking Setup': 'parking_setup',

  // Inventory mappings
  'Inventory': 'inventory',
  'GRN': 'grn',
  'SRNS': 'srns',
  'Consumption': 'consumption',
  'Update Partial Inventory': 'update_partial_inventory',
  'Update All Inventory': 'update_all_inventory',
  'Clone Inventory': 'clone_inventory',

  // Setup mappings
  'Account': 'account',
  'User & Roles': 'user_roles',
  'Meter Types': 'meter_types',
  'Asset Groups': 'asset_groups',
  'Ticket': 'ticket',
  'Email Rule': 'email_rule',
  'FM Groups': 'fm_groups',
  'Export': 'export',
  'SAC/HSN Setup': 'sac_hsn_setup',
  'Addresses': 'addresses',
  'Master Checklist': 'master_checklist',

  // Quickgate mappings
  'Visitors': 'visitors',
  'R Vehicles': 'r_vehicles',
  'G Vehicles': 'g_vehicles',
  'Staffs': 'staffs',
  'Goods In Out': 'goods_in_out',
  'Patrolling': 'patrolling',
}

// Maps UI permission fields to API permission fields
export const permissionFieldMap: Record<string, string> = {
  'add': 'create',
  'view': 'show',
  'edit': 'update',
  'disable': 'destroy',
  'all': 'all'
}

export interface UIPermission {
  name: string;
  all: boolean;
  add: boolean;
  view: boolean;
  edit: boolean;
  disable: boolean;
}

// Transform UI permissions to API format
export const transformPermissionsToApiFormat = (uiPermissions: { [key: string]: UIPermission[] }): Record<string, any> => {
  const apiPermissions: Record<string, any> = {}
  
  // Process all permission categories
  Object.values(uiPermissions).forEach(permissionList => {
    permissionList.forEach(permission => {
      // Skip if no permissions are selected
      if (!permission.all && !permission.add && !permission.view && !permission.edit && !permission.disable) {
        return
      }
      
      const apiKey = permissionDisplayToApiKeyMap[permission.name]
      if (apiKey) {
        apiPermissions[apiKey] = {
          all: permission.all ? "true" : "false",
          create: permission.add ? "true" : "false",
          show: permission.view ? "true" : "false",
          update: permission.edit ? "true" : "false",
          destroy: permission.disable ? "true" : "false",
        }
      }
    })
  })
  
  return apiPermissions
}