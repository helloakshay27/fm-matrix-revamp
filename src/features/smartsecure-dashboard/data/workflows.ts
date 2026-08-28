export interface Workflow {
  key: string;
  name: string;
  bucket: string;
  steps: string[];
  /** ILLUSTRATIVE sample figures — there is no live PostHog project behind SmartSecure yet. */
  adoption: number;
  completionRate: number;
  dropoffRate: number;
  avgTime: string;
  completions: string;
  /** True for the 3 cards added after the design team's Figma review — see workflows[] note below. */
  proposed?: boolean;
  /** Set on Visitor Creation — the known gap vs. the real 5-step registration wizard. */
  incompleteNote?: string;
}

/**
 * Module names, bucket grouping, and every step[] event name below are real — taken
 * verbatim from SmartSecure_PostHog_Events.xlsx (180 events, 38 categories) via
 * SmartSecure_Chart_Calculation_Instrumentation.html §7.3.0. adoption / completionRate /
 * dropoffRate / avgTime / completions are ILLUSTRATIVE sample figures.
 *
 * 3 additional workflows (visitorAssetDeclare, visitorIdVerify, visitorNdaConsent) carry
 * proposed:true and use PROPOSED event names that do NOT appear in the PostHog Events
 * catalogue — see §7.3.0b. They exist so engineers have a concrete starting point for
 * instrumenting the missing steps of the real 5-step visitor-registration wizard; the
 * event names are suggestions, not confirmed instrumentation.
 */
export const WORKFLOWS: Workflow[] = [
  { key: 'devApproval', name: 'Device Gatekeeper Verification', bucket: 'Access & Device',
    steps: ['splash_routed_to_gatekeeper_verification', 'gatekeeper_verification_submit_attempted', 'gatekeeper_verification_submit_succeeded'],
    adoption: 18, completionRate: 74, dropoffRate: 26, avgTime: '2m 10s', completions: '340' },
  { key: 'staffFaceVerify', name: 'Staff Face Verification', bucket: 'Access & Device',
    steps: ['profile_verify_staff_attempted', 'profile_verify_staff_succeeded'],
    adoption: 41, completionRate: 88, dropoffRate: 12, avgTime: '15s', completions: '2,860' },
  { key: 'visitorCreate', name: 'Visitor Creation', bucket: 'Visitor Ops',
    steps: ['visitor_mobile_verify_attempted', 'visitor_tower_flat_list_viewed', 'visitor_tower_flat_selection_confirmed', 'visitor_create_attempted', 'visitor_create_succeeded'],
    adoption: 92, completionRate: 81, dropoffRate: 19, avgTime: '1m 35s', completions: '18,240',
    incompleteNote: 'The Figma screens for visitor registration show this is actually step 1 of a 5-step wizard (Registration → Additional Visitors/Vehicle → Asset Declaration → Identity Verification → Preview/Submit, then either a Gate Pass or an NDA-acceptance step depending on who fills the form). Only this first step’s events are in the current PostHog catalogue — see the 3 proposed workflow cards below (Visitor Asset Declaration, Visitor Identity Verification, Visitor NDA Consent) for the missing steps.' },
  { key: 'visitorCheckin', name: 'Visitor Check-in', bucket: 'Visitor Ops',
    steps: ['visitor_otp_send_attempted', 'visitor_otp_verify_attempted', 'visitor_check_in_attempted', 'visitor_check_in_confirmed'],
    adoption: 88, completionRate: 90, dropoffRate: 10, avgTime: '45s', completions: '21,560' },
  { key: 'visitorCheckout', name: 'Visitor Checkout', bucket: 'Visitor Ops',
    steps: ['visitor_checkout_list_viewed', 'visitor_checkout_attempted', 'visitor_checkout_succeeded'],
    adoption: 74, completionRate: 93, dropoffRate: 7, avgTime: '20s', completions: '16,980' },
  { key: 'visitorAssetDeclare', name: 'Visitor Asset Declaration', bucket: 'Visitor Ops', proposed: true,
    steps: ['visitor_asset_declaration_opened', 'visitor_asset_category_selected', 'visitor_asset_details_entered', 'visitor_asset_added', 'visitor_asset_declaration_completed'],
    adoption: 38, completionRate: 71, dropoffRate: 29, avgTime: '1m 20s', completions: '6,940' },
  { key: 'visitorIdVerify', name: 'Visitor Identity Verification', bucket: 'Visitor Ops', proposed: true,
    steps: ['visitor_id_type_selected', 'visitor_id_photo_captured', 'visitor_id_verification_attempted', 'visitor_id_verification_succeeded'],
    adoption: 81, completionRate: 76, dropoffRate: 24, avgTime: '1m 05s', completions: '15,120' },
  { key: 'visitorNdaConsent', name: 'Visitor NDA Consent', bucket: 'Visitor Ops', proposed: true,
    steps: ['visitor_nda_screen_viewed', 'visitor_nda_accepted', 'visitor_selfservice_registration_submitted'],
    adoption: 29, completionRate: 87, dropoffRate: 13, avgTime: '35s', completions: '3,260' },
  { key: 'staffCreate', name: 'Staff Creation', bucket: 'Staff Ops',
    steps: ['staff_create_screen_viewed', 'staff_create_attempted', 'staff_create_succeeded'],
    adoption: 23, completionRate: 69, dropoffRate: 31, avgTime: '2m 50s', completions: '560' },
  { key: 'staffCheckin', name: 'Staff Check-in', bucket: 'Staff Ops',
    steps: ['staff_in_list_viewed', 'staff_check_in_attempted', 'staff_check_in_succeeded'],
    adoption: 66, completionRate: 91, dropoffRate: 9, avgTime: '25s', completions: '9,840' },
  { key: 'staffCheckout', name: 'Staff Check-out', bucket: 'Staff Ops',
    steps: ['staff_out_list_viewed', 'staff_check_out_attempted', 'staff_check_out_succeeded'],
    adoption: 63, completionRate: 94, dropoffRate: 6, avgTime: '18s', completions: '9,320' },
  { key: 'memberVehIn', name: 'Member Vehicle Check-in', bucket: 'Vehicle Ops',
    steps: ['member_vehicle_check_in_list_viewed', 'member_vehicle_check_in_attempted', 'member_vehicle_check_in_succeeded'],
    adoption: 48, completionRate: 89, dropoffRate: 11, avgTime: '22s', completions: '7,120' },
  { key: 'memberVehOut', name: 'Member Vehicle Check-out', bucket: 'Vehicle Ops',
    steps: ['member_vehicle_check_out_list_viewed', 'member_vehicle_check_out_attempted', 'member_vehicle_check_out_succeeded'],
    adoption: 46, completionRate: 92, dropoffRate: 8, avgTime: '18s', completions: '6,880' },
  { key: 'visitorVehCreate', name: 'Visitor Vehicle Creation', bucket: 'Vehicle Ops',
    steps: ['visitor_vehicle_create_screen_viewed', 'visitor_vehicle_create_attempted', 'visitor_vehicle_create_succeeded'],
    adoption: 31, completionRate: 76, dropoffRate: 24, avgTime: '1m 05s', completions: '3,420' },
  { key: 'visitorVehIn', name: 'Visitor Vehicle In', bucket: 'Vehicle Ops',
    steps: ['visitor_vehicle_in_list_viewed', 'visitor_vehicle_check_in_attempted', 'visitor_vehicle_check_in_succeeded'],
    adoption: 34, completionRate: 87, dropoffRate: 13, avgTime: '20s', completions: '4,060' },
  { key: 'visitorVehOut', name: 'Visitor Vehicle Out', bucket: 'Vehicle Ops',
    steps: ['visitor_vehicle_out_list_viewed', 'visitor_vehicle_check_out_attempted', 'visitor_vehicle_check_out_succeeded'],
    adoption: 33, completionRate: 90, dropoffRate: 10, avgTime: '16s', completions: '3,980' },
  { key: 'qrGateEntry', name: 'QR Gate Entry', bucket: 'Security & Assets',
    steps: ['qr_scan_verify_attempted', 'qr_scan_verify_succeeded'],
    adoption: 57, completionRate: 85, dropoffRate: 15, avgTime: '8s', completions: '12,640' },
  { key: 'patrollingRound', name: 'Patrolling Round', bucket: 'Security & Assets',
    steps: ['patrolling_comment_submit_attempted', 'home_qr_scan_patrolling_comment_submitted'],
    adoption: 29, completionRate: 79, dropoffRate: 21, avgTime: '1m 40s', completions: '2,140' },
  { key: 'goodsOutward', name: 'Goods Outward', bucket: 'Security & Assets',
    steps: ['goods_outward_list_viewed', 'goods_outward_mark_out_attempted', 'goods_outward_mark_out_succeeded'],
    adoption: 21, completionRate: 82, dropoffRate: 18, avgTime: '50s', completions: '1,480' },
  { key: 'setupVisitPurpose', name: 'Setup - Visit Purpose', bucket: 'Configuration',
    steps: ['setup_visit_purpose_list_viewed', 'setup_visit_purpose_add_attempted', 'setup_visit_purpose_add_succeeded'],
    adoption: 11, completionRate: 88, dropoffRate: 12, avgTime: '40s', completions: '310' },
  { key: 'setupWorkType', name: 'Setup - Work Type', bucket: 'Configuration',
    steps: ['setup_work_type_list_viewed', 'setup_work_type_add_attempted', 'setup_work_type_add_succeeded'],
    adoption: 9, completionRate: 86, dropoffRate: 14, avgTime: '45s', completions: '250' },
  { key: 'setupMoveInOut', name: 'Setup - Move In/Out', bucket: 'Configuration',
    steps: ['setup_move_in_out_list_viewed', 'setup_move_in_out_add_attempted', 'setup_move_in_out_add_succeeded'],
    adoption: 14, completionRate: 84, dropoffRate: 16, avgTime: '42s', completions: '390' },
];

/**
 * Home, Authentication, Notifications, Help Center, History Filter (shared) and Shared
 * Utilities are deliberately excluded from WORKFLOWS above: Home's events are lateral
 * navigation/dashboard impressions with no single directional funnel of their own;
 * Authentication is a single login/logout action pair rather than a multi-step process;
 * Notifications, Help Center, History Filter and Shared Utilities are cross-cutting
 * utility surfaces reused across other modules' real workflows. App Lifecycle
 * (app_launched, the first event of every session) is excluded for the same reason.
 */
export const WORKFLOW_BUCKETS = [...new Set(WORKFLOWS.map((w) => w.bucket))];
