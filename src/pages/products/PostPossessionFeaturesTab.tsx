import React from "react";

type FeatureRow = {
  number: number;
  module: string;
  feature: string;
  howItWorks: string;
  usp: string;
  userType: string;
  isUsp: boolean;
};

const featureRows: FeatureRow[] = [
  {
    "number": 1,
    "module": "Onboarding",
    "feature": "OTP Login",
    "howItWorks": "The system checks whether the entered email or phone number belongs to a pre-registered user in the developer CRM. If matched, it sends an OTP to the registered number. On successful OTP entry, the user is redirected to the relevant post-sales or post-possession interface. Unregistered numbers are blocked from access, ensuring only verified residents and authorised users can onboard.",
    "usp": "",
    "userType": "Resident, Tenant, Family Member",
    "isUsp": false
  },
  {
    "number": 2,
    "module": "",
    "feature": "App Tutorial / Guided Onboarding Screens",
    "howItWorks": "First-time users see a guided walkthrough of the app covering helpdesk, visitor management, club booking, bill payments, and other key app sections on login. Users can skip or complete the tutorial at their own pace. Completion status is tracked so the tutorial does not repeat on subsequent logins.",
    "usp": "",
    "userType": "Resident",
    "isUsp": false
  },
  {
    "number": 3,
    "module": "",
    "feature": "* White-Label Mobile App",
    "howItWorks": "The app is deployed as a branded Android and iOS application using the client's name, logo, colour palette, and project identity. Residents see the developer's brand throughout the app experience, not the Lockated name. The white-label configuration is managed by the admin team and can be updated without requiring a new app build.",
    "usp": "* USP",
    "userType": "Admin, Resident",
    "isUsp": true
  },
  {
    "number": 4,
    "module": "",
    "feature": "Rolling Banners",
    "howItWorks": "Admins configure app banners from the web console for announcements, promotions, project updates, event highlights, or important resident-facing communication. Banners cycle through a rolling display on the resident home screen. Each banner can carry an image, a headline, and an optional action link.",
    "usp": "",
    "userType": "Admin, Resident",
    "isUsp": false
  },
  {
    "number": 5,
    "module": "Community Management",
    "feature": "Communication - Notice Board",
    "howItWorks": "Admins create notices via app or web console and publish them to all residents, selected towers, selected units, or specific user groups. Notices may include multi-format attachments such as images, PDFs, and documents. The system tracks read and unread status per resident so admins can verify delivery reach.",
    "usp": "",
    "userType": "Admin, Resident",
    "isUsp": false
  },
  {
    "number": 6,
    "module": "",
    "feature": "Send and Receive Communication on the Go",
    "howItWorks": "Residents and admins exchange community-related communication from the mobile app without depending on email or offline notices. Messages and notices are delivered as push notifications in real time. Admins can broadcast one-way messages or enable two-way communication threads depending on the configuration.",
    "usp": "",
    "userType": "Admin, Resident",
    "isUsp": false
  },
  {
    "number": 7,
    "module": "",
    "feature": "Events Management",
    "howItWorks": "Admins create community events via app or web with event name, date, time, description, venue, attachments, and RSVP options. Events can be targeted to all residents or selected groups. Residents can like, share, and view upcoming and past events, and feedback can be collected after events close.",
    "usp": "",
    "userType": "Admin, Resident",
    "isUsp": false
  },
  {
    "number": 8,
    "module": "",
    "feature": "Polls",
    "howItWorks": "Admins create polls on community topics with configurable answer options and publishing rules. Role-based access controls who can create polls. Residents submit responses from the mobile app and real-time results are visible to admins for community decision-making.",
    "usp": "",
    "userType": "Admin, Resident",
    "isUsp": false
  },
  {
    "number": 9,
    "module": "",
    "feature": "Delivery Reports",
    "howItWorks": "Admins view delivery reports for communication, notices, polls, or engagement campaigns. Reports show who received the message, who opened it, and read percentages. This data supports communication strategy and helps admins verify that critical notices have reached their intended recipients.",
    "usp": "",
    "userType": "Admin",
    "isUsp": false
  },
  {
    "number": 10,
    "module": "",
    "feature": "Meeting Communication",
    "howItWorks": "Community or operational meeting details are shared with relevant stakeholders as structured communication updates. Meeting scheduling and participant notification are handled from the console. Full MOM creation and task tracking is managed under the MOM module for post-meeting follow-up.",
    "usp": "",
    "userType": "Admin, Facility Manager",
    "isUsp": false
  },
  {
    "number": 11,
    "module": "",
    "feature": "Feedback and Survey-Linked Action",
    "howItWorks": "Residents provide feedback with comments on events, services, communication, or community experience. Residents access surveys through QR codes placed at facilities, events, or service locations. Negative survey submissions automatically trigger helpdesk tickets for resolution and tracking, closing the loop between feedback and operational action.",
    "usp": "",
    "userType": "Resident, Admin, Facility Staff",
    "isUsp": false
  },
  {
    "number": 12,
    "module": "",
    "feature": "News / Announcements / Broadcasts",
    "howItWorks": "Admins publish news, announcements, broadcast messages, and event highlights to all residents or selected groups through structured communication channels. Messages are delivered via push notification and stored in the resident's in-app notification feed. Broadcast history is retained for audit and reference.",
    "usp": "",
    "userType": "Admin, Resident",
    "isUsp": false
  },
  {
    "number": 13,
    "module": "e-Marketing and Customer Loyalty",
    "feature": "Marketing Analytics",
    "howItWorks": "Admins view analytics on customer engagement, campaign performance, referral response, and loyalty activity from the management console. Data covers campaign reach, click-through on referral links, and event participation rates. Marketing teams use this data to optimise resident engagement campaigns and new project launches.",
    "usp": "",
    "userType": "Admin, Marketing Team",
    "isUsp": false
  },
  {
    "number": 14,
    "module": "",
    "feature": "Referral Marketing",
    "howItWorks": "Residents refer new leads or prospective buyers through referral campaigns configured by the admin. Residents receive shareable referral links or codes from the app. The admin console tracks lead submissions, attribution, and conversion so that sales teams can follow up and the referring resident can receive any configured incentive.",
    "usp": "",
    "userType": "Resident, Marketing Team",
    "isUsp": false
  },
  {
    "number": 15,
    "module": "",
    "feature": "New Project Updates",
    "howItWorks": "Admins share new project launches, project updates, or promotional communication with existing residents through the platform. Residents who are existing buyers are a high-conversion audience for re-purchase and referral. The platform enables developers to use the resident app as a direct marketing channel for new inventory.",
    "usp": "",
    "userType": "Admin, Marketing Team, Resident",
    "isUsp": false
  },
  {
    "number": 16,
    "module": "",
    "feature": "New Lead Generation",
    "howItWorks": "The platform captures interest or lead data from campaigns, referral responses, or resident interactions within the app. Lead data is structured for export to the developer's CRM or sales team for follow-up. This converts the post-possession platform into an active sales channel for the developer's future projects.",
    "usp": "",
    "userType": "Admin, Sales Team",
    "isUsp": false
  },
  {
    "number": 17,
    "module": "",
    "feature": "Customer Loyalty",
    "howItWorks": "Loyalty-related campaigns, offers, or engagement programs are configured by admins to improve resident retention and referral behaviour. Loyalty points, redemption rules, and campaign eligibility can be defined by the developer. Residents view their loyalty status and offers within the app.",
    "usp": "",
    "userType": "Admin, Marketing Team",
    "isUsp": false
  },
  {
    "number": 18,
    "module": "BI Reporting",
    "feature": "Detailed BI Reports for Each Function",
    "howItWorks": "Admins access function-wise BI reports across helpdesk, billing, communication, gate, facility booking, assets, operations, and all enabled modules. Reports cover ticket volumes, resolution times, collection rates, visitor logs, occupancy, and operational KPIs. Management teams use these reports for monthly reviews and performance tracking.",
    "usp": "",
    "userType": "Admin, Management",
    "isUsp": false
  },
  {
    "number": 19,
    "module": "",
    "feature": "Underlying Data View and Download",
    "howItWorks": "Users with appropriate access can view report-level underlying data and download it in supported formats such as CSV or Excel for external analysis, audit, or presentation. Data exports respect user role permissions and do not expose restricted resident information to unauthorised roles.",
    "usp": "",
    "userType": "Admin, Management",
    "isUsp": false
  },
  {
    "number": 20,
    "module": "",
    "feature": "Chart-Based Reporting Views",
    "howItWorks": "Reports can be viewed using different chart types including bar, line, pie, and trend charts to support analysis and operational review. Admins switch between chart and table views depending on reporting needs. Chart-based views are available for ticket trends, billing status, facility usage, and gate activity.",
    "usp": "",
    "userType": "Admin, Management",
    "isUsp": false
  },
  {
    "number": 21,
    "module": "Helpdesk - Ticketing and Complaint Management",
    "feature": "* Ticket Creation and Complaint Management",
    "howItWorks": "Residents create support tickets through multiple channels by selecting a category, issue type, complaint mode, location, and description, and attaching images, videos, PDFs, or documents. All complaints are tracked under a single management system with status visibility for both the resident and the admin team. Every ticket carries a unique ID, a timestamp, and a full audit trail from creation to closure.",
    "usp": "* USP",
    "userType": "Resident, Admin, Facility Staff",
    "isUsp": true
  },
  {
    "number": 22,
    "module": "",
    "feature": "Ticket Classification and Category Mapping",
    "howItWorks": "Tickets are classified as complaint, suggestion, request, or other configured types. Admins map categories, subcategories, and issue types to structured routing and reporting rules. Correct classification enables SLA application, assignment routing, and meaningful reporting on complaint trends by type and location.",
    "usp": "",
    "userType": "Admin, Facility Staff",
    "isUsp": false
  },
  {
    "number": 23,
    "module": "",
    "feature": "Priority and Golden Ticket Identification",
    "howItWorks": "Admins assign priority levels based on urgency, category, resident type, or configured rules. Complaints from senior citizens, differently-abled residents, or pregnant residents can be tagged separately as golden tickets for priority handling. The system surfaces these tickets at the top of the queue and triggers faster escalation timelines.",
    "usp": "",
    "userType": "Resident, Admin, Facility Staff",
    "isUsp": false
  },
  {
    "number": 24,
    "module": "",
    "feature": "Ticket Assignment and Vendor Routing",
    "howItWorks": "Tickets are assigned manually or automatically to internal teams, service engineers, staff, or external vendors based on category, location, roster, availability, or configured rules. Vendors are configured and mapped to relevant categories and ticket types. Auto-assignment reduces manual routing effort and ensures the right team receives every ticket at the moment it is raised.",
    "usp": "",
    "userType": "Admin, Vendor, Facility Staff",
    "isUsp": false
  },
  {
    "number": 25,
    "module": "",
    "feature": "Service Engineer App Access",
    "howItWorks": "Service engineers access assigned tickets through the mobile app and update progress, photos, and status in real time from the field. Engineers receive push notifications for new assignments and escalations. All updates made by the engineer appear instantly in the ticket history visible to the admin and the resident.",
    "usp": "",
    "userType": "Service Engineer, Facility Staff",
    "isUsp": false
  },
  {
    "number": 26,
    "module": "",
    "feature": "Ticket Case History and Collaboration",
    "howItWorks": "Every ticket maintains a complete history including creation, assignment, comments, attachments, review tracking, status changes, follow-ups, and closure details. Residents, admins, vendors, and service teams comment on tickets to keep all communication linked to the specific issue. The case history serves as a permanent audit record for escalations, compliance checks, and service quality reviews.",
    "usp": "",
    "userType": "Admin, Facility Staff, Resident",
    "isUsp": false
  },
  {
    "number": 27,
    "module": "",
    "feature": "Ticket Reopen and Feedback",
    "howItWorks": "Residents or admins reopen a closed ticket if the issue is unresolved or recurs within a configurable window. Residents provide star-rating feedback and comments after ticket closure. Feedback scores are aggregated into service quality reports and can be used to trigger CSAT improvement workflows.",
    "usp": "",
    "userType": "Resident, Admin",
    "isUsp": false
  },
  {
    "number": 28,
    "module": "",
    "feature": "CAPA and Root Cause Analysis",
    "howItWorks": "Critical, repeated, or serious complaints require root cause analysis and corrective and preventive action tracking before closure. The CAPA module captures the root cause, corrective action taken, preventive measure defined, and responsible owner. This reduces repeat complaints and supports ISO compliance for IFM companies.",
    "usp": "",
    "userType": "Admin, Facility Staff",
    "isUsp": false
  },
  {
    "number": 29,
    "module": "",
    "feature": "Project / FM Ticket Segregation",
    "howItWorks": "Tickets are segregated based on whether they belong to project teams, facility management, or other departments. This prevents cross-department confusion and ensures the right team handles each issue. Segregation also enables department-wise SLA tracking and performance reporting.",
    "usp": "",
    "userType": "Admin, Facility Manager",
    "isUsp": false
  },
  {
    "number": 30,
    "module": "",
    "feature": "TAT Configuration and Calculation",
    "howItWorks": "Admins define separate response and resolution TAT rules by category or issue type. Ticket TAT is calculated using configured working days, working hours, holidays, and service schedules. TAT breach triggers escalation to the next level in the escalation matrix automatically.",
    "usp": "",
    "userType": "Admin, Facility Staff",
    "isUsp": false
  },
  {
    "number": 31,
    "module": "",
    "feature": "Notifications and Escalation Matrix",
    "howItWorks": "Users, admins, vendors, service engineers, FM teams, project teams, community heads, branch directors, and senior management receive notifications, email and SMS alerts, assignments, escalations, and closure updates based on configured rules and escalation levels. The multi-level escalation matrix ensures no ticket is ignored regardless of assignee response.",
    "usp": "",
    "userType": "Resident, Admin, Facility Staff, Management",
    "isUsp": false
  },
  {
    "number": 32,
    "module": "",
    "feature": "Role-Based Helpdesk Access",
    "howItWorks": "Ticket visibility and actions are controlled by user role, department, and responsibility. A service engineer sees only their assigned tickets. A branch director sees all tickets across their portfolio. Role-based access prevents data leakage and ensures each user operates within their defined scope.",
    "usp": "",
    "userType": "Admin, Facility Staff",
    "isUsp": false
  },
  {
    "number": 33,
    "module": "Club Facility Booking",
    "feature": "* Facility Booking",
    "howItWorks": "All configured facilities such as gym, pool, party hall, sports courts, and common areas are visible to residents with availability, booking rules, and payment options. Residents book instantly or submit a request depending on facility configuration. Booking confirmation and calendar reminders are sent automatically to the resident and the facility manager.",
    "usp": "* USP",
    "userType": "Resident, Admin, Facility Manager",
    "isUsp": true
  },
  {
    "number": 34,
    "module": "",
    "feature": "Facility Configuration and Booking Rules",
    "howItWorks": "Admins define whether each facility is instantly bookable or request-based, configure schedules, slots, capacity, cancellation rules, booking limits, advance booking windows, resident eligibility, and sub-facility structures. Configuration changes take effect immediately across the resident app without requiring a platform update.",
    "usp": "",
    "userType": "Admin",
    "isUsp": false
  },
  {
    "number": 35,
    "module": "",
    "feature": "Multiple Payment Options",
    "howItWorks": "Facility bookings support online payment, partial payment, offline payment, or configured payment modes depending on the facility setup. Payment status is reflected in billing and accounting records automatically. Residents receive a digital receipt on payment confirmation.",
    "usp": "",
    "userType": "Resident, Admin",
    "isUsp": false
  },
  {
    "number": 36,
    "module": "",
    "feature": "Facility Bill Accounting",
    "howItWorks": "Facility charges are linked to billing and accounting records within the CAM billing module. Charges appear on the resident's account ledger and can be included in the consolidated maintenance invoice. Finance teams have full visibility of facility revenue by facility type and billing period.",
    "usp": "",
    "userType": "Admin, Finance Team",
    "isUsp": false
  },
  {
    "number": 37,
    "module": "",
    "feature": "Club Membership Management",
    "howItWorks": "Admins manage membership plans, eligibility rules, member access, validity periods, and expiry alerts. Membership tiers can carry different booking privileges, priority access, or fee waivers. Expiry alerts prompt residents to renew and prompt admins to review eligibility before each renewal cycle.",
    "usp": "",
    "userType": "Admin, Resident",
    "isUsp": false
  },
  {
    "number": 38,
    "module": "",
    "feature": "Automated Usage-Based Charges",
    "howItWorks": "Charges are automatically calculated based on facility usage or booking duration as defined in the configuration rules. The system posts charges to the resident's ledger without manual finance team intervention. This eliminates billing errors and reduces the effort required for month-end facility charge reconciliation.",
    "usp": "",
    "userType": "Admin, Finance Team",
    "isUsp": false
  },
  {
    "number": 39,
    "module": "Other Service Request - Concierge Bookings",
    "feature": "* Convenience Services / Concierge Bookings",
    "howItWorks": "Residents browse, order, book, or request services such as salon appointments, housekeeping, plumbing, food, utility services, local providers, and other concierge services from the app. Service providers receive booking notifications and confirmation. The admin console shows booking volumes, status, and service provider performance.",
    "usp": "* USP",
    "userType": "Resident, Facility Manager, Service Provider",
    "isUsp": true
  },
  {
    "number": 40,
    "module": "",
    "feature": "Integrated E-Commerce Facilities",
    "howItWorks": "Food, utility services, and other local service providers are integrated for resident convenience within the app. Residents order food, book services, and pay through a single in-app experience. Integration with local providers enables hyperlocal commerce without the developer needing to manage fulfilment directly.",
    "usp": "",
    "userType": "Resident, Admin, Service Provider",
    "isUsp": false
  },
  {
    "number": 41,
    "module": "",
    "feature": "Hyperlocal and Important Directory",
    "howItWorks": "Admins configure category-wise and subcategory-wise local service providers, emergency numbers, community contacts, and important phone numbers with one-tap click-to-call access. The directory serves as a curated resource for residents to find trusted local services without searching externally. Entries are managed and updated by the admin team.",
    "usp": "",
    "userType": "Admin, Resident",
    "isUsp": false
  },
  {
    "number": 42,
    "module": "",
    "feature": "Service Category and Subcategory Setup",
    "howItWorks": "Admins configure service categories, subcategories, charges, service types, and provider mapping. Category setup controls what residents see in their service menu. Subcategory mapping enables precise routing of bookings to the correct provider or internal team.",
    "usp": "",
    "userType": "Admin",
    "isUsp": false
  },
  {
    "number": 43,
    "module": "",
    "feature": "Service Slot Scheduling",
    "howItWorks": "Admins create concurrent service slots based on staff bandwidth and availability to prevent overbooking. Slot rules limit how many bookings can be accepted per time window. Residents see real-time slot availability and can only book within open windows.",
    "usp": "",
    "userType": "Admin, Service Provider",
    "isUsp": false
  },
  {
    "number": 44,
    "module": "",
    "feature": "Service Cancellation Rules",
    "howItWorks": "Cancellation rules are configured by admins for each service type including cut-off time, refund policy, and cancellation window. Residents are notified of cancellation terms before confirming a booking. Cancellation requests outside the allowed window can be escalated for admin approval.",
    "usp": "",
    "userType": "Admin",
    "isUsp": false
  },
  {
    "number": 45,
    "module": "",
    "feature": "Service Booking Payment Options",
    "howItWorks": "Services support multiple payment modes including online, offline, and post-service billing depending on the service configuration. Payment status updates are reflected in the resident's account and in the admin billing view. Invoices and receipts are generated automatically on payment confirmation.",
    "usp": "",
    "userType": "Resident, Admin",
    "isUsp": false
  },
  {
    "number": 46,
    "module": "",
    "feature": "Service Reminder Alerts",
    "howItWorks": "Reminder alerts are sent to residents, service providers, and admins for scheduled services at configured intervals before the service slot. Reminders reduce no-shows and enable service providers to prepare. Residents can confirm, reschedule, or cancel from the reminder notification.",
    "usp": "",
    "userType": "Resident, Admin, Service Provider",
    "isUsp": false
  },
  {
    "number": 47,
    "module": "",
    "feature": "Service Invoice and Receipt Download",
    "howItWorks": "Residents view and download digital invoices and receipts for all booked services from the app. Invoices carry service details, provider information, payment amount, and date. Download options include PDF for filing or sharing.",
    "usp": "",
    "userType": "Resident, Admin",
    "isUsp": false
  },
  {
    "number": 48,
    "module": "",
    "feature": "Service Feedback",
    "howItWorks": "Residents submit star ratings and written comments after service completion. Feedback is linked to the service booking record and visible to the admin and the service provider. Low feedback scores can trigger a follow-up action or be escalated as a helpdesk ticket.",
    "usp": "",
    "userType": "Resident, Admin",
    "isUsp": false
  },
  {
    "number": 49,
    "module": "",
    "feature": "Service Reporting",
    "howItWorks": "Admins view reports on bookings, service usage, payments, cancellations, and feedback across all service categories. Reports support capacity planning, provider performance evaluation, and revenue analysis. Data can be downloaded for period-wise review.",
    "usp": "",
    "userType": "Admin",
    "isUsp": false
  },
  {
    "number": 50,
    "module": "",
    "feature": "Food and Beverage - Restaurant Management",
    "howItWorks": "Admins configure one or multiple restaurants with operating hours, table bookings, food ordering, menu details, images, gallery content, pax rules, delivery options, status rules, payment options, and feedback. Residents browse menus, place orders, book tables, and track order status from the app. Restaurant operations are managed entirely within the platform without a third-party food ordering integration.",
    "usp": "",
    "userType": "Resident, F&B Admin",
    "isUsp": false
  },
  {
    "number": 51,
    "module": "Parking Management",
    "feature": "Parking Allocation",
    "howItWorks": "Admins allocate parking slots to units, residents, visitors, or service vehicles based on entitlement, membership, ownership, user type, slot type, or configured allocation logic. Allocation is visible to the gate team and the resident. Changes to allocation are logged with a timestamp for audit purposes.",
    "usp": "",
    "userType": "Admin, Resident, Gate Staff",
    "isUsp": false
  },
  {
    "number": 52,
    "module": "",
    "feature": "Vehicle Type Classification",
    "howItWorks": "Vehicles are classified by type such as two-wheeler, four-wheeler, resident vehicle, visitor vehicle, or service vehicle. Classification controls entry permissions, parking slot eligibility, and reporting. Gate staff use vehicle type filters when managing entries during peak inflow periods.",
    "usp": "",
    "userType": "Admin, Gate Staff",
    "isUsp": false
  },
  {
    "number": 53,
    "module": "",
    "feature": "Parking Charges Configuration",
    "howItWorks": "Admins configure parking charges by vehicle type, user type, slot type, or usage pattern. Charges are linked to billing automatically. Finance teams can view parking revenue by tower or unit type in the billing reports.",
    "usp": "",
    "userType": "Admin, Finance Team",
    "isUsp": false
  },
  {
    "number": 54,
    "module": "",
    "feature": "Smart Parking Configuration and Real-Time View",
    "howItWorks": "Admins configure smart parking rules, allocation logic, and occupancy visibility. Gate teams and admins view real-time parking lot availability from the console. Occupancy data supports peak-time management and helps residents find available slots during high-traffic periods.",
    "usp": "",
    "userType": "Admin, Gate Staff",
    "isUsp": false
  },
  {
    "number": 55,
    "module": "",
    "feature": "Resident Vehicle Updates",
    "howItWorks": "Residents update vehicle details such as registration number and vehicle type from the app subject to admin approval or configured rules. Updated vehicle details appear in the gate management system immediately on approval. This reduces manual data entry at the gate and keeps vehicle records current.",
    "usp": "",
    "userType": "Resident, Admin",
    "isUsp": false
  },
  {
    "number": 56,
    "module": "",
    "feature": "Boom Barrier / RFID Integration",
    "howItWorks": "Parking and vehicle access integrates with boom barriers, RFID readers, or other API-based access control systems. Integration enables automated barrier lift on vehicle recognition. The platform acts as the management layer controlling which vehicles are authorised for automated entry.",
    "usp": "",
    "userType": "Admin, Gate Staff",
    "isUsp": false
  },
  {
    "number": 57,
    "module": "Emergency Directory",
    "feature": "Emergency Directory",
    "howItWorks": "Admins configure critical contact numbers such as police, ambulance, fire, maintenance, security, and management contacts within the app. Residents access these contacts instantly with a single tap from the app home screen. The directory is always available without requiring any search or navigation.",
    "usp": "",
    "userType": "Resident, Admin",
    "isUsp": false
  },
  {
    "number": 58,
    "module": "Setup",
    "feature": "* Project and Unit Configuration",
    "howItWorks": "Admins create and manage the full property structure including projects, towers, floors, units, flats, occupancy structure, unit-user mapping, and flat and tower hierarchy through manual creation or bulk upload. This configuration forms the master data layer that all other modules reference for targeting, billing, access control, and reporting. Changes to the structure are applied across all active modules without requiring reconfiguration.",
    "usp": "* USP",
    "userType": "Admin, Developer CRM Team",
    "isUsp": true
  },
  {
    "number": 59,
    "module": "",
    "feature": "Bulk Upload",
    "howItWorks": "Large sets of units, users, assets, or configuration data are uploaded in bulk using configured Excel templates. Bulk upload reduces onboarding time for large projects with hundreds or thousands of units. Upload errors are flagged with row-level error descriptions so admins can correct and re-upload.",
    "usp": "",
    "userType": "Admin",
    "isUsp": false
  },
  {
    "number": 60,
    "module": "",
    "feature": "Occupancy Status",
    "howItWorks": "Each unit is marked with occupancy status such as owner-occupied, tenant-occupied, vacant, or under fitout. Occupancy status is used across modules to control communication targeting, billing applicability, and gate access rules. Finance teams use occupancy data to reconcile CAM billing eligibility.",
    "usp": "",
    "userType": "Admin, Facility Manager",
    "isUsp": false
  },
  {
    "number": 61,
    "module": "",
    "feature": "e-Group Creation",
    "howItWorks": "Admins create digital groups for communication, access control, or operational segmentation - for example, tower-wise groups, resident type groups, or committee groups. Groups are used to target notices, polls, and events to specific subsets of residents. Group membership can be updated at any time without affecting the underlying unit or user records.",
    "usp": "",
    "userType": "Admin",
    "isUsp": false
  },
  {
    "number": 62,
    "module": "",
    "feature": "User Configuration",
    "howItWorks": "Admins create user accounts with name, email, phone, password, resident type, access role, primary or secondary user classification, and role-wise access permissions for app, web console, operational teams, service engineers, vendors, and management users. Role configuration controls exactly what each user can see and do across all modules.",
    "usp": "",
    "userType": "Admin",
    "isUsp": false
  },
  {
    "number": 63,
    "module": "",
    "feature": "* Owner Profiling",
    "howItWorks": "Admins create detailed owner profiles covering contact details, unit details, ownership data, unit association, and communication preferences. Owner profiles are linked to billing, gate management, visitor management, and document repository records. Comprehensive owner data enables personalised communication and accurate CAM billing.",
    "usp": "* USP",
    "userType": "Admin, Facility Manager",
    "isUsp": true
  },
  {
    "number": 64,
    "module": "",
    "feature": "Family Member Addition",
    "howItWorks": "Primary residents add family members through the app with the family member's details. Added family members receive their own app credentials and can perform configured actions such as visitor approval and facility booking. The primary resident retains control over family member access levels.",
    "usp": "",
    "userType": "Resident",
    "isUsp": false
  },
  {
    "number": 65,
    "module": "",
    "feature": "* Tenant Profiling",
    "howItWorks": "Admins or owners create tenant profiles with contact details, agreement details, validity, unit association, lease status, and expiry notifications. Tenant records are linked to the owner's unit profile and to the gate management and billing modules. Expiry alerts remind admins and owners of upcoming lease renewals or expirations.",
    "usp": "* USP",
    "userType": "Admin, Owner",
    "isUsp": true
  },
  {
    "number": 66,
    "module": "Gate Management",
    "feature": "* Visitor Management",
    "howItWorks": "Residents pre-register expected visitors and gate staff manage visitor entry, approval, and authentication through multiple methods including OTP, IVR, push notification, digital intercom, visit codes, and digital gate passes. The system handles expected visitors, unexpected visitors, group visitors, frequent visitors, favourites, cab pre-approvals, leave-at-gate instructions, and exit logs in a single guard app interface.",
    "usp": "* USP",
    "userType": "Resident, Gatekeeper, Security Admin",
    "isUsp": true
  },
  {
    "number": 67,
    "module": "",
    "feature": "Visitor Approval and Authentication",
    "howItWorks": "Visitor approval is processed through OTP, IVR call to resident, push notification with approve/reject button, digital intercom, visit code, or digital gate pass workflows. The resident receives a real-time alert the moment a visitor arrives at the gate. Approval decisions are logged with timestamp for security audit purposes.",
    "usp": "",
    "userType": "Visitor, Resident, Gatekeeper",
    "isUsp": false
  },
  {
    "number": 68,
    "module": "",
    "feature": "Visitor Health and Compliance Capture",
    "howItWorks": "Gate staff capture visitor temperature and mask compliance where required by community rules. Compliance data is recorded against the visitor entry log. Communities with health or hygiene protocols use this feature to maintain digital compliance records for regulatory or internal audit purposes.",
    "usp": "",
    "userType": "Gatekeeper",
    "isUsp": false
  },
  {
    "number": 69,
    "module": "",
    "feature": "Overstay Alerts",
    "howItWorks": "The system alerts residents or security when visitors exceed their permitted stay duration. Overstay threshold is configured per visitor type or community rule. Alerts are sent as push notifications to the resident and as a security flag in the guard app.",
    "usp": "",
    "userType": "Resident, Gatekeeper, Security Admin",
    "isUsp": false
  },
  {
    "number": 70,
    "module": "",
    "feature": "Offline Guard App Mode",
    "howItWorks": "Gate staff continue using the guard app during low or no network conditions with all core entry and exit functions available offline. Data syncs automatically when connectivity is restored. Offline mode ensures that gate operations are never interrupted by network outages.",
    "usp": "",
    "userType": "Gatekeeper",
    "isUsp": false
  },
  {
    "number": 71,
    "module": "",
    "feature": "* Goods In / Out Movement Tracing",
    "howItWorks": "Goods movement is tracked for inward and outward movement at the gate with approval workflows, item-level description and images, real-time entry and exit capture, digital logs, registered and guest goods classification, and a complete traceable movement record. Residents receive a notification when goods leave the premises on their behalf. The digital goods log is available to admins for dispute resolution and security audit.",
    "usp": "* USP",
    "userType": "Resident, Gatekeeper, Admin",
    "isUsp": true
  },
  {
    "number": 72,
    "module": "",
    "feature": "* Household Staff Management",
    "howItWorks": "Residents search, add, associate, rate, block, red-flag, categorise, and manage household staff such as maids, cooks, drivers, helpers, shared community staff, and personal household staff entirely from the app. Staff profiles include photo, ID, contact details, unit association, and service category. Admins can view all household staff registered within the community and approve or reject additions.",
    "usp": "* USP",
    "userType": "Resident, Admin, Security Staff",
    "isUsp": true
  },
  {
    "number": 73,
    "module": "",
    "feature": "Staff Attendance and Access Management",
    "howItWorks": "Staff entry and exit, attendance, selfie verification, access validity, unit association, rule-based time allocation, notifications, roster management, planned and unplanned offs, holidays, and access schedules are managed digitally through the guard app and admin console. The attendance record is available to the resident and the admin team. Access validity controls ensure that expired staff profiles are automatically blocked at the gate.",
    "usp": "",
    "userType": "Resident, Admin, Security Staff",
    "isUsp": false
  },
  {
    "number": 74,
    "module": "",
    "feature": "Daily Help Payment and Recording",
    "howItWorks": "Payments to daily help staff are recorded and tracked by the resident within the app. Payment records carry date, amount, and staff association for the resident's reference. This feature provides a digital alternative to cash payment tracking for households with multiple daily help staff.",
    "usp": "",
    "userType": "Resident, Admin",
    "isUsp": false
  },
  {
    "number": 75,
    "module": "",
    "feature": "Vehicle Entry / Exit Management",
    "howItWorks": "Resident, visitor, registered, guest, and service vehicle movement is captured for inward and outward tracking at the gate with timestamp, vehicle type, and unit association. Gate staff record vehicle details through the guard app. Vehicle movement logs are available to admins and security managers for audit and incident investigation.",
    "usp": "",
    "userType": "Gatekeeper, Admin",
    "isUsp": false
  },
  {
    "number": 76,
    "module": "",
    "feature": "Child Safety and Exit Control",
    "howItWorks": "Residents pre-approve or restrict their children's exit from the premises from the app. Alerts are triggered for child movement or exit events based on configured rules. Gate staff receive an alert in the guard app when a restricted child attempts to exit without the resident's pre-approval.",
    "usp": "",
    "userType": "Resident, Gatekeeper",
    "isUsp": false
  },
  {
    "number": 77,
    "module": "",
    "feature": "Panic Button / Security Alert",
    "howItWorks": "Residents trigger a security alert from the app during emergencies with a single tap. The panic alert is received immediately by the security team with the resident's unit and contact details. Security teams are trained to respond to panic alerts as a priority event.",
    "usp": "",
    "userType": "Resident, Security Team",
    "isUsp": false
  },
  {
    "number": 78,
    "module": "",
    "feature": "Controlled Resident Calling",
    "howItWorks": "Residents use controlled in-app calling or communication where the feature is enabled by the admin. Calling is routed through the platform to protect resident phone number privacy. Admins can enable or restrict this feature based on community rules.",
    "usp": "",
    "userType": "Resident",
    "isUsp": false
  },
  {
    "number": 79,
    "module": "",
    "feature": "Guard Patrolling and Security Audits",
    "howItWorks": "Security teams conduct QR-based patrolling using scheduled checkpoints with digital completion logs. Audits cover parking areas, no-honking zones, vehicle movement, and exception reporting. Each checkpoint scan generates a timestamped record, and missed checkpoints trigger escalation alerts to the security supervisor.",
    "usp": "",
    "userType": "Security Staff, Admin",
    "isUsp": false
  },
  {
    "number": 80,
    "module": "Accounting and Billing",
    "feature": "* CAM Billing and Accounting",
    "howItWorks": "Admins build the accounting structure, configure CAM charges, generate invoices, collect payments, reconcile dues, track resident billing, and integrate billing and accounting workflows with operational modules. The module supports group, subgroup, and ledger creation for complex multi-tower billing structures. All billing data is stored on the client's own servers as part of the data sovereignty architecture.",
    "usp": "* USP",
    "userType": "Admin, Finance Team",
    "isUsp": true
  },
  {
    "number": 81,
    "module": "",
    "feature": "CAM Charges Configuration",
    "howItWorks": "Admins configure CAM charges based on unit, area, tower, usage, category, or billing rules. Charges can be set as flat, per square foot, or usage-linked. Configuration changes are versioned so that historical invoice calculations remain accurate even after a billing rule change.",
    "usp": "",
    "userType": "Admin, Finance Team",
    "isUsp": false
  },
  {
    "number": 82,
    "module": "",
    "feature": "* Automated Invoice and Receipt Generation",
    "howItWorks": "Invoices and receipts are automatically generated and shared with residents based on configured charge rules covering maintenance, sinking fund, utility, parking, club, or service charges. Invoice generation runs on the configured billing cycle without manual trigger. Residents receive a push notification and email with the invoice PDF on generation.",
    "usp": "* USP",
    "userType": "Admin, Resident, Finance Team",
    "isUsp": true
  },
  {
    "number": 83,
    "module": "",
    "feature": "* Resident Bill Payment",
    "howItWorks": "Residents view outstanding and paid invoices and complete full or partial payment through supported payment modes including UPI, cards, net banking, wallets, and EMI. Payment confirmation is immediate and the ledger updates in real time. Residents can view complete payment history and download past receipts.",
    "usp": "* USP",
    "userType": "Resident, Admin",
    "isUsp": true
  },
  {
    "number": 84,
    "module": "",
    "feature": "Payment Gateway and Bank Account Configuration",
    "howItWorks": "Admins activate payment gateway options, map different modules or payment categories to specific bank accounts, and support direct settlement to the client's configured bank account. Payment gateway setup does not route funds through Lockated accounts. Funds flow directly from the resident to the community or developer's designated account.",
    "usp": "",
    "userType": "Admin, Finance Team",
    "isUsp": false
  },
  {
    "number": 85,
    "module": "",
    "feature": "Payment Reminders",
    "howItWorks": "Residents receive automated reminders for pending dues or upcoming payments at configured intervals before and after the due date. Reminder cadence and message content are configurable by the admin team. Reminder delivery uses push notification, SMS, or email depending on the resident's notification preferences.",
    "usp": "",
    "userType": "Resident, Admin",
    "isUsp": false
  },
  {
    "number": 86,
    "module": "",
    "feature": "Transaction and Reconciliation Management",
    "howItWorks": "Finance teams track payment transactions, status, settlement timing, offline payment recording, and reconciliation against invoices. The reconciliation view shows matched, unmatched, and pending transactions for each billing period. Offline payments such as cheques or bank transfers are manually recorded and matched to the corresponding invoice.",
    "usp": "",
    "userType": "Finance Team",
    "isUsp": false
  },
  {
    "number": 87,
    "module": "",
    "feature": "Payment and Financial Reports",
    "howItWorks": "Finance users view and download payment reports, income and expense reports, financial reports, and management-level accounting reports from the console. Report filters cover billing period, tower, unit type, charge category, and payment mode. Management reports are formatted for board-level review.",
    "usp": "",
    "userType": "Admin, Finance Team, Management",
    "isUsp": false
  },
  {
    "number": 88,
    "module": "",
    "feature": "Prepaid Meter Integration",
    "howItWorks": "Billing integrates with prepaid meter systems where available in the project. Meter consumption data feeds into the billing module to calculate utility charges automatically. Prepaid meter integration eliminates manual reading and calculation for electricity and water utility billing.",
    "usp": "",
    "userType": "Admin, Finance Team",
    "isUsp": false
  },
  {
    "number": 89,
    "module": "",
    "feature": "Assets and Liabilities Management",
    "howItWorks": "Accounting teams maintain assets and liabilities records within the platform. Asset values, depreciation, and liability schedules are tracked over time. This supports balance sheet preparation and management-level financial reporting for community associations and RWA committees.",
    "usp": "",
    "userType": "Finance Team",
    "isUsp": false
  },
  {
    "number": 90,
    "module": "",
    "feature": "Chart of Accounts",
    "howItWorks": "Admins configure the chart of accounts for structured accounting with income, expense, asset, and liability categories. The chart of accounts forms the foundation of all financial reporting within the billing module. Configuration can be aligned to the community's existing accounting structure.",
    "usp": "",
    "userType": "Finance Team",
    "isUsp": false
  },
  {
    "number": 91,
    "module": "",
    "feature": "Tax and GST Configuration",
    "howItWorks": "Finance users configure applicable tax slabs and GST-related billing and invoicing setup. GST is applied automatically to relevant charge categories based on the configured rate. Invoice PDFs carry the correct GST breakdown and GSTIN details as required for resident compliance.",
    "usp": "",
    "userType": "Finance Team",
    "isUsp": false
  },
  {
    "number": 92,
    "module": "",
    "feature": "ERP Export",
    "howItWorks": "Accounting and billing data is exported from the platform for use in external ERP systems such as Tally or SAP. Export formats are configured to match the receiving ERP's import requirements. This eliminates double entry and keeps the community's accounting records synchronised between the platform and the ERP.",
    "usp": "",
    "userType": "Finance Team, Admin",
    "isUsp": false
  },
  {
    "number": 93,
    "module": "",
    "feature": "Defaulter Status and Service Restriction",
    "howItWorks": "Residents with overdue bills beyond a configured threshold are marked as defaulters in the system. Defaulter status can restrict selected app actions such as facility bookings or certain service requests. Finance teams use the defaulter list for targeted collection follow-up communication.",
    "usp": "",
    "userType": "Admin, Finance Team",
    "isUsp": false
  },
  {
    "number": 94,
    "module": "Document Repository",
    "feature": "* Digital Repository Management",
    "howItWorks": "Admins create and maintain a digital repository of common community documents and flat-level documents with access control rules. Community documents include club manuals, fitout guides, pet policies, and circulars. Flat-level documents include electricity bills, warranties, lease agreements, and ownership records. Residents access only their own flat documents and community-wide documents, not other residents' private files.",
    "usp": "* USP",
    "userType": "Resident, Admin",
    "isUsp": true
  },
  {
    "number": 95,
    "module": "User Profile and Settings",
    "feature": "My Profile Management",
    "howItWorks": "Residents manage their personal profile including contact details, communication preferences, notification settings, and app display preferences. Profile updates are subject to admin verification rules where configured. Residents can view their own unit details, family member associations, and linked vehicle records.",
    "usp": "",
    "userType": "Resident, Admin",
    "isUsp": false
  },
  {
    "number": 96,
    "module": "",
    "feature": "Tenant Management Interface",
    "howItWorks": "Owners managing tenanted units access tenant details, lease status, agreement validity, and related unit information from their profile view. Owners can initiate tenant profile creation requests and view pending approvals. This supports owner oversight of their tenanted units without requiring direct admin involvement.",
    "usp": "",
    "userType": "Owner, Admin",
    "isUsp": false
  },
  {
    "number": 97,
    "module": "",
    "feature": "Multi-Project Navigation",
    "howItWorks": "Users linked to multiple projects switch between projects from a single interface without logging out and back in. Navigation preserves each project's context including unread notifications and pending actions. Investors or owners with units across multiple properties benefit most from this feature.",
    "usp": "",
    "userType": "Resident, Admin, Facility Manager",
    "isUsp": false
  },
  {
    "number": 98,
    "module": "Fitout Workflow Management",
    "feature": "* Fitout Workflow Management",
    "howItWorks": "Residents raise fitout requests for interior works, installation, renovation, or related activities through the app. Admins track approvals, deviations, notices, SOPs, manuals, labour entry requests, status updates, and payment integration for fitout-related fees or security deposits. The full fitout lifecycle from request to completion is managed digitally, replacing paper-based processes with a traceable workflow.",
    "usp": "* USP",
    "userType": "Resident, Admin, Facility Manager",
    "isUsp": true
  },
  {
    "number": 99,
    "module": "Personalisation and Engagement",
    "feature": "Personalised Greetings",
    "howItWorks": "The app displays personalised greeting messages to residents during login or at key moments such as birthdays, festivals, or move-in anniversaries based on profile data. Personalised greetings improve resident emotional connection to the developer brand. Greeting templates are configured by the admin team.",
    "usp": "",
    "userType": "Resident",
    "isUsp": false
  },
  {
    "number": 100,
    "module": "",
    "feature": "Notification Preferences",
    "howItWorks": "Residents configure which categories of notifications they want to receive across all enabled modules. Preferences are saved per module so residents can mute less relevant notifications without disabling all alerts. Admin-sent critical notices can be configured to bypass user mute preferences.",
    "usp": "",
    "userType": "Resident",
    "isUsp": false
  },
  {
    "number": 101,
    "module": "",
    "feature": "Theme Selection",
    "howItWorks": "Residents switch between light mode and dark mode from app settings at any time. Theme preference is saved to the user profile and persists across sessions. The white-label app design adapts to the selected theme while retaining the developer's brand colours.",
    "usp": "",
    "userType": "Resident",
    "isUsp": false
  },
  {
    "number": 102,
    "module": "Incident Management",
    "feature": "Incident Reporting",
    "howItWorks": "Facility teams log incidents with auto-captured property name, location at wing, tower, floor, or area level, incident type, category, subcategory, sub-subcategory, description, photos, videos, voice notes, and supporting evidence. Incidents are classified as operations, safety, security, or infrastructure events. The system distinguishes incidents from helpdesk tickets - incidents are facility-reported events requiring internal escalation rather than resident-raised complaints.",
    "usp": "",
    "userType": "Admin, Facility Manager, Security Team",
    "isUsp": false
  },
  {
    "number": 103,
    "module": "",
    "feature": "Escalation, Approval and Rejection",
    "howItWorks": "Incident reports trigger escalation and approval or rejection workflows for senior roles such as branch director or head of operations. Approvers receive notifications with full incident details and can approve, reject, or request additional information from the console or mobile. All approval actions are logged with timestamp and approver identity.",
    "usp": "",
    "userType": "Admin, Management",
    "isUsp": false
  },
  {
    "number": 104,
    "module": "Asset Management",
    "feature": "Global Asset Setup",
    "howItWorks": "Admins configure asset masters, categories, locations, global asset structures, site-wise tracking, critical and non-critical classification, comprehensive and non-comprehensive classification, and ownership and location mapping. The asset master forms the foundation for maintenance scheduling, warranty tracking, and compliance reporting.",
    "usp": "",
    "userType": "Admin, Facility Manager",
    "isUsp": false
  },
  {
    "number": 105,
    "module": "",
    "feature": "Asset Tagging and Registration",
    "howItWorks": "Assets are tagged, registered, and mapped to locations or owners with QR code generation and scanning where enabled. QR tags enable field staff to pull up asset records instantly from the mobile app during maintenance or inspection. Each asset carries a registration record with purchase date, value, and installation details.",
    "usp": "",
    "userType": "Admin, Facility Staff",
    "isUsp": false
  },
  {
    "number": 106,
    "module": "",
    "feature": "Warranty / Guarantee Alerts",
    "howItWorks": "Warranty and guarantee details are captured against each asset with validation alerts sent before expiry dates. Admins receive advance alerts to initiate renewal or replacement processes before warranty lapses. Expiry tracking prevents uncovered assets from remaining in service without the admin team's awareness.",
    "usp": "",
    "userType": "Admin, Facility Manager",
    "isUsp": false
  },
  {
    "number": 107,
    "module": "",
    "feature": "Asset Maintenance",
    "howItWorks": "Asset maintenance activities are scheduled, tracked, and recorded against the asset record. Maintenance history is available for each asset with dates, actions taken, and technician records. Scheduled maintenance generates tasks in the checklist module for assignment and completion tracking.",
    "usp": "",
    "userType": "Facility Manager, Facility Staff",
    "isUsp": false
  },
  {
    "number": 108,
    "module": "",
    "feature": "Asset Document Storage",
    "howItWorks": "Manuals, invoices, warranty documents, and asset information are stored centrally and linked to the specific asset record. Field staff access asset documents from the mobile app without returning to a physical store room or shared drive. Document storage supports compliance and audit requirements for critical or regulated assets.",
    "usp": "",
    "userType": "Admin, Facility Manager",
    "isUsp": false
  },
  {
    "number": 109,
    "module": "",
    "feature": "Bulk Asset Upload",
    "howItWorks": "Multiple assets are uploaded in bulk using the configured template. Bulk upload is used during project onboarding when hundreds of assets are transferred from a handover register into the platform. Upload errors are reported with row-level descriptions.",
    "usp": "",
    "userType": "Admin",
    "isUsp": false
  },
  {
    "number": 110,
    "module": "Soft Services",
    "feature": "Soft Service Location Configuration",
    "howItWorks": "Soft service areas and locations such as lobby, garden, corridor, and parking are tagged and configured for scheduling purposes. Location tagging enables precise scheduling of cleaning, housekeeping, and landscaping by area. Configurations are used by the scheduling module to assign the correct team to the correct location.",
    "usp": "",
    "userType": "Admin, Facility Manager",
    "isUsp": false
  },
  {
    "number": 111,
    "module": "",
    "feature": "Soft Service Scheduling and Alerts",
    "howItWorks": "Soft service tasks are scheduled by frequency, location, and team with automated alerts for pending or upcoming tasks. Schedules cover daily, weekly, and monthly services. Missed tasks trigger escalation alerts to the facility manager and appear in the exception report.",
    "usp": "",
    "userType": "Facility Manager, Staff",
    "isUsp": false
  },
  {
    "number": 112,
    "module": "",
    "feature": "Soft Service Checklist Maintenance",
    "howItWorks": "Soft service checklists are configured and maintained for execution teams covering completion criteria, photo evidence requirements, and supervisor sign-off. Checklists ensure consistent service delivery across all locations and shifts. Completion records serve as evidence for contractual SLA reporting.",
    "usp": "",
    "userType": "Facility Manager, Staff",
    "isUsp": false
  },
  {
    "number": 113,
    "module": "",
    "feature": "Soft Service Bulk Upload",
    "howItWorks": "Soft service tasks or configuration data are uploaded in bulk for initial onboarding or schedule restructuring. Bulk upload accelerates setup when multiple locations and task types are being configured simultaneously. Upload templates are available from the admin console.",
    "usp": "",
    "userType": "Admin",
    "isUsp": false
  },
  {
    "number": 114,
    "module": "Meter Management",
    "feature": "Meter Management and Reading Logs",
    "howItWorks": "Meter readings are recorded and tracked over time with parent and sub-meter tagging across assets, units, and locations. Reading logs carry date, reading value, and the staff member who recorded the reading. The system calculates consumption between consecutive readings automatically.",
    "usp": "",
    "userType": "Facility Staff, Admin",
    "isUsp": false
  },
  {
    "number": 115,
    "module": "",
    "feature": "Consumption Reporting and Alerts",
    "howItWorks": "Reports show usage, non-usage, abnormal consumption, month-wise power consumption, tower-wise consumption, meter-wise electric, DG, and water consumption, client-wise consumption, meter trends, and minimum and maximum threshold alerts. Abnormal consumption alerts notify the admin team of potential equipment malfunction or billing anomalies. Reports support sustainability reporting and utility cost optimisation.",
    "usp": "",
    "userType": "Admin, Facility Manager",
    "isUsp": false
  },
  {
    "number": 116,
    "module": "",
    "feature": "Multiple Factor Configuration",
    "howItWorks": "Multiple factors are added for consumption calculation or reporting to handle complex tariff structures, time-of-use billing, or different unit types within the same project. Factor configuration enables accurate consumption calculations without manual spreadsheet workarounds.",
    "usp": "",
    "userType": "Admin",
    "isUsp": false
  },
  {
    "number": 117,
    "module": "Digital Checklist",
    "feature": "Checklist Configuration",
    "howItWorks": "Admins configure checklists for PPM, AMC, preparedness, audits, soft services, and recurring operational tasks with multiple input types including text, image, number, selection, and attachment. Configured checklists are assigned to locations, teams, and schedules. Input type flexibility ensures that evidence requirements such as photos are captured at the task level rather than relying on manual supervisor reporting.",
    "usp": "",
    "userType": "Admin, Facility Manager",
    "isUsp": false
  },
  {
    "number": 118,
    "module": "",
    "feature": "Checklist Task Management",
    "howItWorks": "Checklist items generate and manage operational tasks with auto-assignment based on rules, location, role, schedule, defined timelines, mandatory task controls, grace periods, locking, and escalation. Tasks appear in the assigned staff member's app queue with deadline and completion requirements. Overdue tasks escalate automatically through the configured escalation matrix.",
    "usp": "",
    "userType": "Facility Manager, Staff",
    "isUsp": false
  },
  {
    "number": 119,
    "module": "",
    "feature": "Task Review and Verification",
    "howItWorks": "Supervisors review checklist tasks before closure through QR code scan, NFC scan, or supervisor sign-off verification. Verification adds an independent confirmation layer that the task was completed as required. Completion records carry the verifier's identity and timestamp.",
    "usp": "",
    "userType": "Facility Staff, Supervisor",
    "isUsp": false
  },
  {
    "number": 120,
    "module": "",
    "feature": "Task Reports",
    "howItWorks": "Reports are generated for checklist compliance rates, missed tasks, completion status, and task performance by location, team, and period. Non-compliance reports highlight areas or teams with recurring missed tasks. Reports are used for SLA reporting to IFM clients and for internal performance reviews.",
    "usp": "",
    "userType": "Admin, Facility Manager",
    "isUsp": false
  },
  {
    "number": 121,
    "module": "",
    "feature": "Checklist Reminders",
    "howItWorks": "Vendors, admins, and FM teams receive email reminders for checklist tasks at configured intervals before the scheduled deadline. Reminders reduce missed tasks caused by staff forgetting scheduled duties. Reminder frequency is configurable per checklist type.",
    "usp": "",
    "userType": "Admin, Vendor, Facility Staff",
    "isUsp": false
  },
  {
    "number": 122,
    "module": "Cost Approval System",
    "feature": "R&M Cost Tracking",
    "howItWorks": "Repair and maintenance costs are captured against specific assets, locations, or work orders for approval tracking. Cost records carry amount, description, vendor, and work details. Approved costs feed into the finance module for budget tracking and vendor payment processing.",
    "usp": "",
    "userType": "Admin, Facility Manager, Finance Team",
    "isUsp": false
  },
  {
    "number": 123,
    "module": "",
    "feature": "Approval Hierarchy and Multi-Layer Approval",
    "howItWorks": "Cost approvals follow configured role-based and multi-level approval hierarchies especially for high-value costs. Each approval level is notified in sequence. High-value thresholds trigger additional approval layers automatically without requiring manual escalation.",
    "usp": "",
    "userType": "Admin, Approver",
    "isUsp": false
  },
  {
    "number": 124,
    "module": "",
    "feature": "Escalation Setup",
    "howItWorks": "Pending cost approvals are escalated based on configured timelines if the approver does not respond within the defined window. Escalation alerts are sent to the next level approver. Escalation history is logged against the cost approval record for audit purposes.",
    "usp": "",
    "userType": "Admin",
    "isUsp": false
  },
  {
    "number": 125,
    "module": "",
    "feature": "Real-Time Response",
    "howItWorks": "Approvers respond to cost approval requests in real time from the mobile app or web console. Approval, rejection, or request for additional information actions are captured instantly. Real-time response capability reduces procurement delays caused by approvers being away from their desks.",
    "usp": "",
    "userType": "Approver",
    "isUsp": false
  },
  {
    "number": 126,
    "module": "",
    "feature": "Approval Reports",
    "howItWorks": "Reports show approved, rejected, pending, and escalated cost approvals by period, approver, and cost category. Finance teams use approval reports for budget utilisation analysis. Management teams review approval reports to identify bottlenecks in the maintenance spend approval process.",
    "usp": "",
    "userType": "Admin, Management",
    "isUsp": false
  },
  {
    "number": 127,
    "module": "Inventory Management",
    "feature": "PO / WO Tracking",
    "howItWorks": "Purchase orders and work orders are tracked against inventory, procurement, or operational requirements from creation through closure. PO tracking includes vendor details, line items, expected delivery, and receipt status. Work order tracking covers scope, assigned vendor or staff, and completion confirmation.",
    "usp": "",
    "userType": "Admin, Procurement Team",
    "isUsp": false
  },
  {
    "number": 128,
    "module": "",
    "feature": "Spares and Consumables Tracking",
    "howItWorks": "Spares and consumables are tracked by stock level, usage, and location across the property. Stock records are updated on issue or receipt. Low stock alerts prompt procurement requests before critical items run out.",
    "usp": "",
    "userType": "Store Team, Facility Manager",
    "isUsp": false
  },
  {
    "number": 129,
    "module": "",
    "feature": "Inventory Consumption Tracking and Reports",
    "howItWorks": "Inventory consumption is tracked after issue or usage with reports showing consumption trends and usage by asset, location, and period. Consumption data supports procurement planning and budget forecasting. Unusual consumption patterns can be flagged for review.",
    "usp": "",
    "userType": "Store Team, Admin, Procurement Team",
    "isUsp": false
  },
  {
    "number": 130,
    "module": "",
    "feature": "GRN / GDN Tracking",
    "howItWorks": "Goods receipt notes and goods delivery notes are tracked and recorded against POs and WOs. GRN creation confirms that ordered items have been received and matches quantities against the PO. GDN creation records items leaving the store for use in maintenance or operations.",
    "usp": "",
    "userType": "Store Team, Procurement Team",
    "isUsp": false
  },
  {
    "number": 131,
    "module": "",
    "feature": "Insufficient Stock Alerts",
    "howItWorks": "Alerts are triggered automatically when stock levels fall below configured minimum thresholds. Alerts are sent to the store team and the facility manager. Minimum thresholds are configured per item based on consumption rates and lead times.",
    "usp": "",
    "userType": "Store Team, Facility Manager",
    "isUsp": false
  },
  {
    "number": 132,
    "module": "Design Input",
    "feature": "Category and Subcategory Entry",
    "howItWorks": "Admins enter design-related categories and subcategories for observation and recommendation capture during project handover or fitout review activities. Category structure ensures that design observations are organised consistently across projects. This module is primarily used by developer design teams during post-possession snagging and punch-list processes.",
    "usp": "",
    "userType": "Admin, Design Team",
    "isUsp": false
  },
  {
    "number": 133,
    "module": "",
    "feature": "Observation and Recommendation Capture",
    "howItWorks": "Users select category, subcategory, site, and location to capture design observations and recommendations with supporting notes and attachments. Observations are linked to the specific location within the property structure. Captured observations are available for download and review by the design and project team.",
    "usp": "",
    "userType": "Design Team, Admin",
    "isUsp": false
  },
  {
    "number": 134,
    "module": "",
    "feature": "Design Input Report Download and Export",
    "howItWorks": "Design input reports are downloaded with or without pictures and data exported for review or reporting. Reports carry all observations with location, category, and recommendation details. Photo-embedded reports are used for client-facing snagging reviews and project handover documentation.",
    "usp": "",
    "userType": "Admin, Design Team",
    "isUsp": false
  },
  {
    "number": 135,
    "module": "MOM",
    "feature": "Minutes of Meeting Creation",
    "howItWorks": "Users add meeting minutes with agenda, discussion points, attendees, action items, responsible persons, and target completion dates. MOM records are stored digitally and linked to the relevant project or community. All meeting records are searchable and available for audit and follow-up.",
    "usp": "",
    "userType": "Admin, Facility Manager",
    "isUsp": false
  },
  {
    "number": 136,
    "module": "",
    "feature": "MOM Auto Task Creation and Follow-Up Trigger",
    "howItWorks": "MOM action points automatically create tasks in the task management module and trigger notifications or follow-up workflows to assigned owners. Task creation eliminates the manual step of converting MOM action items into operational tasks. Task owners receive reminders as deadlines approach.",
    "usp": "",
    "userType": "Admin, Facility Manager",
    "isUsp": false
  },
  {
    "number": 137,
    "module": "Operational Audit",
    "feature": "Operational Audit Setup and Scheduling",
    "howItWorks": "Admins configure audit templates, schedules, locations, responsibilities, critical environment checks, short audits, and project-level operational checks. Audits are scheduled on a recurring basis to ensure consistent operational standards across the property. Audit templates are reusable and can be applied across multiple properties.",
    "usp": "",
    "userType": "Admin, Auditor, Facility Manager",
    "isUsp": false
  },
  {
    "number": 138,
    "module": "",
    "feature": "Audit Task Assignment",
    "howItWorks": "Audit tasks are assigned to community heads or responsible users with deadline and location details. Assigned users receive app notifications when audit tasks are due. Assignment records ensure accountability for audit completion.",
    "usp": "",
    "userType": "Admin, Auditor",
    "isUsp": false
  },
  {
    "number": 139,
    "module": "",
    "feature": "Audit Completion and Approval",
    "howItWorks": "Assigned users complete audit tasks and trigger an approval workflow for closure. Approvers review completion evidence and approve or reject the audit submission. Rejected submissions are returned with comments for correction and resubmission.",
    "usp": "",
    "userType": "Auditor, Community Head, Approver",
    "isUsp": false
  },
  {
    "number": 140,
    "module": "",
    "feature": "Audit Report Download",
    "howItWorks": "Completed audit reports are available for download after approval. Reports carry audit scores, findings, evidence, and closure details. Downloaded reports are used for management review, accreditation submissions, and client SLA reporting.",
    "usp": "",
    "userType": "Admin, Auditor",
    "isUsp": false
  },
  {
    "number": 141,
    "module": "Permit to Work",
    "feature": "PTW Checklist",
    "howItWorks": "Permit-to-work checklists are configured for hazardous or controlled work activities specific to the property. Checklists cover safety precautions, equipment requirements, protective gear, and clearance confirmations. PTW checklists ensure that no hazardous work begins without documented safety verification.",
    "usp": "",
    "userType": "Admin, Safety Team, Contractor",
    "isUsp": false
  },
  {
    "number": 142,
    "module": "",
    "feature": "Hazardous Area and Work Type Configuration",
    "howItWorks": "Hazardous work areas and work types such as electrical, hot work, height work, confined space, and excavation are defined and configured by the safety team. Configuration ensures that the correct PTW template is applied to each work type automatically. Admins can update hazardous area definitions as the property layout changes.",
    "usp": "",
    "userType": "Admin, Safety Team",
    "isUsp": false
  },
  {
    "number": 143,
    "module": "",
    "feature": "Scope and Risk Identification",
    "howItWorks": "Users capture the scope of work and associated risks before permit approval including tools, methods, and risk level. Risk identification forces a structured pre-work review before approval is granted. Captured risk data is retained against the permit record for regulatory and insurance purposes.",
    "usp": "",
    "userType": "Contractor, Safety Team",
    "isUsp": false
  },
  {
    "number": 144,
    "module": "",
    "feature": "Work Authorization",
    "howItWorks": "Authorised personnel approve or reject hazardous work permits after reviewing the scope, risk, and checklist submissions. Approval is documented with the approver's identity and timestamp. Rejected permits carry documented rejection reason and must be resubmitted with corrections before work can proceed.",
    "usp": "",
    "userType": "Approver, Safety Team",
    "isUsp": false
  },
  {
    "number": 145,
    "module": "",
    "feature": "Supervisor and Worker Assignment",
    "howItWorks": "Work supervisors and individuals conducting the work are assigned and recorded against approved permits. Assignment records ensure traceability of who was on site for a specific hazardous activity. Worker lists are used for emergency mustering and incident investigation if an accident occurs.",
    "usp": "",
    "userType": "Contractor, Safety Team",
    "isUsp": false
  },
  {
    "number": 146,
    "module": "",
    "feature": "Training and Instruction Confirmation",
    "howItWorks": "The system captures confirmation that proper training and safety instructions have been completed before work begins. Confirmation is recorded digitally against the permit. This provides documentation of due diligence for regulatory compliance and insurance claims.",
    "usp": "",
    "userType": "Safety Team, Contractor",
    "isUsp": false
  },
  {
    "number": 147,
    "module": "Waste Generation",
    "feature": "Waste Generation Entry",
    "howItWorks": "Users add waste generation records with date, type, quantity, and location. Waste records build a history of waste generation patterns across the property. The module supports ESG reporting requirements for REIT-grade properties and sustainability certifications.",
    "usp": "",
    "userType": "Facility Staff, Admin",
    "isUsp": false
  },
  {
    "number": 148,
    "module": "",
    "feature": "Waste Tracking",
    "howItWorks": "Waste generation is tracked over time by location, waste type, and project for trend analysis and compliance reporting. Reports show monthly and annual waste volumes by category. Tracking data supports Municipal Solid Waste compliance obligations under Indian environmental regulations.",
    "usp": "",
    "userType": "Facility Manager, Admin",
    "isUsp": false
  },
  {
    "number": 149,
    "module": "Procurement",
    "feature": "Inventory Request",
    "howItWorks": "Users raise requests for inventory or materials with item description, quantity, and urgency level. Requests are routed to the store team or procurement team based on item type. Approved requests generate a picking or procurement action depending on current stock availability.",
    "usp": "",
    "userType": "Facility Staff, Procurement Team",
    "isUsp": false
  },
  {
    "number": 150,
    "module": "",
    "feature": "Procurement Approval Process",
    "howItWorks": "Inventory or procurement requests follow a configured approval workflow with role-based approval levels. Approvers review request details and approve, reject, or modify before purchase. Approval audit trails support budget accountability and prevent unauthorised procurement.",
    "usp": "",
    "userType": "Admin, Approver, Procurement Team",
    "isUsp": false
  },
  {
    "number": 151,
    "module": "Mailroom Management",
    "feature": "Mailroom Inward and Outward Management",
    "howItWorks": "Outbound mail, inbound mail, package entries, and incoming and outgoing mail records are created, tracked, and maintained from receipt to handover. Each mail item carries a barcode or reference number for tracking. Residents receive notification when mail or packages arrive and are ready for collection.",
    "usp": "",
    "userType": "Mailroom Staff, Admin",
    "isUsp": false
  },
  {
    "number": 152,
    "module": "",
    "feature": "Mailroom Notifications and Alerts",
    "howItWorks": "Residents and teams receive alerts for mailroom activity including package arrivals, collection reminders, and pending pickup notifications. Alerts are sent via push notification with package details. Uncollected packages trigger a follow-up alert after a configured number of days.",
    "usp": "",
    "userType": "Resident, Mailroom Staff",
    "isUsp": false
  },
  {
    "number": 153,
    "module": "",
    "feature": "Delegate Package",
    "howItWorks": "Users delegate package pickup or handling to another authorised person with the delegation record stored against the mail item. The delegate receives a notification with pickup authorisation details. The mailroom logs delegation against the item to confirm authorised handover.",
    "usp": "",
    "userType": "Resident, Mailroom Staff",
    "isUsp": false
  },
  {
    "number": 154,
    "module": "",
    "feature": "Mailroom Reports",
    "howItWorks": "Weekly, monthly, and daily mailroom reports show volumes, pending collections, handover rates, and activity trends. Reports support mailroom staff allocation decisions and SLA reporting for property management companies. Download option is available for all report periods.",
    "usp": "",
    "userType": "Mailroom Staff, Admin",
    "isUsp": false
  },
  {
    "number": 155,
    "module": "",
    "feature": "OTP-Based Package Delivery Verification",
    "howItWorks": "Package handover is verified through OTP sent to the registered resident or authorised delegate. OTP verification creates a digital proof of delivery record. This eliminates disputes about whether a package was received and provides the developer or property manager with a liability-free handover audit trail.",
    "usp": "",
    "userType": "Resident, Mailroom Staff",
    "isUsp": false
  },
  {
    "number": 156,
    "module": "Compliance Tracker",
    "feature": "Automated Compliance Alerts",
    "howItWorks": "Automated alerts and email reminders are sent to FM teams, admins, vendors, and AMC vendors for upcoming or pending compliance deadlines and actions. Alert timelines are configured per compliance item type. Compliance records carry status, responsible owner, and evidence attachment capability.",
    "usp": "",
    "userType": "Admin, Facility Manager, Vendor",
    "isUsp": false
  },
  {
    "number": 157,
    "module": "Integrations",
    "feature": "Access Control Integration",
    "howItWorks": "The platform integrates with boom barriers, flap barriers, RFID readers, and access control systems via API. Integration enables automated gate control triggered by visitor approvals or resident vehicle recognition. The platform acts as the authorisation layer that controls which access control events the hardware executes.",
    "usp": "",
    "userType": "Admin, Security Team",
    "isUsp": false
  },
  {
    "number": 158,
    "module": "",
    "feature": "IT / IoT Integration",
    "howItWorks": "The platform integrates with APIs, ERP systems, OPC servers, historians, third-party systems, and customised IoT integrations based on project requirements. Integration capabilities allow the platform to receive sensor data, push accounting data to ERPs, and exchange records with developer CRM systems. Custom integrations are scoped and delivered as project-specific implementation work.",
    "usp": "",
    "userType": "Admin, IT Team",
    "isUsp": false
  }
];

const PostPossessionFeaturesTab: React.FC = () => {
  const styles: Record<string, React.CSSProperties> = {
    headerCell: {
      backgroundColor: "#F6F4EE",
      borderBottom: "2px solid #C4B89D",
      borderRight: "1px solid rgba(196,184,157,0.5)",
      color: "#1f1f1f",
      fontFamily: "inherit",
      fontSize: "10pt",
      fontWeight: "bold",
      letterSpacing: "0.05em",
      padding: "12px 8px",
      textAlign: "left",
      textTransform: "uppercase",
      verticalAlign: "middle",
      whiteSpace: "normal",
    },
    numberHeader: {
      backgroundColor: "#F6F4EE",
      borderBottom: "2px solid #C4B89D",
      borderRight: "1px solid rgba(196,184,157,0.5)",
      color: "#1f1f1f",
      fontFamily: "inherit",
      fontSize: "10pt",
      fontWeight: "bold",
      letterSpacing: "0.05em",
      padding: "12px 8px",
      textAlign: "right",
      textTransform: "uppercase",
      verticalAlign: "middle",
      whiteSpace: "normal",
    },
    cell: {
      backgroundColor: "#ffffff",
      borderBottom: "1px solid rgba(196,184,157,0.35)",
      borderRight: "1px solid rgba(196,184,157,0.35)",
      color: "#1f1f1f",
      fontFamily: "inherit",
      fontSize: "10pt",
      lineHeight: 1.55,
      padding: "12px 8px",
      textAlign: "left",
      verticalAlign: "top",
      whiteSpace: "normal",
      wordWrap: "break-word",
    },
    altCell: {
      backgroundColor: "#F6F4EE",
      borderBottom: "1px solid rgba(196,184,157,0.35)",
      borderRight: "1px solid rgba(196,184,157,0.35)",
      color: "#1f1f1f",
      fontFamily: "inherit",
      fontSize: "10pt",
      lineHeight: 1.55,
      padding: "12px 8px",
      textAlign: "left",
      verticalAlign: "top",
      whiteSpace: "normal",
      wordWrap: "break-word",
    },
    uspCell: {
      backgroundColor: "#F6F4EE",
      borderBottom: "1px solid rgba(218,119,86,0.35)",
      borderRight: "1px solid rgba(218,119,86,0.25)",
      color: "#1f1f1f",
      fontFamily: "inherit",
      fontSize: "10pt",
      fontWeight: "bold",
      lineHeight: 1.55,
      padding: "12px 8px",
      textAlign: "left",
      verticalAlign: "top",
      whiteSpace: "normal",
      wordWrap: "break-word",
    },
    numberCell: {
      borderBottom: "1px solid rgba(196,184,157,0.35)",
      borderRight: "1px solid rgba(196,184,157,0.35)",
      color: "#1f1f1f",
      fontFamily: "inherit",
      fontSize: "10pt",
      lineHeight: 1.55,
      padding: "12px 8px",
      textAlign: "right",
      verticalAlign: "top",
      whiteSpace: "normal",
    },
    uspBadgeCell: {
      borderBottom: "1px solid rgba(196,184,157,0.35)",
      borderRight: "1px solid rgba(196,184,157,0.35)",
      color: "#DA7756",
      fontFamily: "inherit",
      fontSize: "10pt",
      fontWeight: "bold",
      lineHeight: 1.55,
      padding: "12px 8px",
      textAlign: "center",
      verticalAlign: "top",
      whiteSpace: "normal",
    },
  };

  const headers = [
    "#",
    "Module / Section",
    "Feature Name",
    "How It Currently Works",
    "USP",
    "User Type",
  ];

  return (
    <div className="w-full font-sans">
      <div className="mb-6">
        <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
          <h2 className="text-xl font-bold uppercase tracking-wider">
            POST POSSESSION - COMPLETE FEATURE LIST
          </h2>
          <p className="text-xs opacity-70 italic mt-2 font-medium">
            Star USP features are highlighted across the row. All other features use alternating white and light backgrounds.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table
          style={{
            borderCollapse: "collapse",
            tableLayout: "fixed",
            width: "100%",
            minWidth: "1320px",
            backgroundColor: "white",
          }}
          cellSpacing={0}
          cellPadding={0}
        >
          <colgroup>
            <col style={{ width: "56px" }} />
            <col style={{ width: "170px" }} />
            <col style={{ width: "230px" }} />
            <col style={{ width: "640px" }} />
            <col style={{ width: "92px" }} />
            <col style={{ width: "210px" }} />
          </colgroup>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={header}
                  style={index === 0 ? styles.numberHeader : styles.headerCell}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featureRows.map((row, index) => {
              const baseCellStyle = row.isUsp
                ? styles.uspCell
                : index % 2 === 0
                  ? styles.altCell
                  : styles.cell;
              const numberStyle = {
                ...styles.numberCell,
                backgroundColor: row.isUsp ? "#F6F4EE" : index % 2 === 0 ? "#F6F4EE" : "#ffffff",
                fontWeight: row.isUsp ? "bold" : "normal",
              };
              const uspStyle = {
                ...styles.uspBadgeCell,
                backgroundColor: row.isUsp ? "#F6F4EE" : index % 2 === 0 ? "#F6F4EE" : "#ffffff",
              };

              return (
                <tr key={row.number} className="align-top">
                  <td style={numberStyle}>{row.number}</td>
                  <td style={baseCellStyle}>{row.module}</td>
                  <td style={baseCellStyle}>{row.feature}</td>
                  <td style={baseCellStyle}>{row.howItWorks}</td>
                  <td style={uspStyle}>{row.usp}</td>
                  <td style={baseCellStyle}>{row.userType}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostPossessionFeaturesTab;
