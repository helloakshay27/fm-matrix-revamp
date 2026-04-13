export interface KPICardData {
  id: string;
  name: string;
  owner: string;
  target: string | number;
  value: string | number;
  unit: string;
  status: "on-target" | "at-risk" | "off-target";
  frequency: "Monthly" | "Weekly" | "Quarterly";
  badge: string;
  color: string;
  tags: string[];
  priority: "low" | "medium" | "high";
  // Optional API fields
  departmentId?: number | null;
  assigneeId?: number | null;
  assigneeIds?: number[];
  description?: string;
  weight?: number;
  _raw?: any;
}

export interface ArchivedKPIEntry extends KPICardData {
  archivedDate: string;
  reason: string;
}

export const initialKpiCards: KPICardData[] = [
  {
    id: "1",
    name: "hql",
    owner: "Mahendra Lugariya",
    target: "7854878",
    value: "7854878",
    unit: "Monthly",
    status: "on-target",
    frequency: "Monthly",
    badge: "Active",
    color: "bg-blue-100",
    tags: ["Sales", "Individual"],
    priority: "medium",
  },
  {
    id: "2",
    name: "Invoices Raised",
    owner: "Mahendra Lugariya",
    target: "1000000",
    value: "10000000",
    unit: "Monthly",
    status: "on-target",
    frequency: "Monthly",
    badge: "Active",
    color: "bg-purple-100",
    tags: ["Accounts", "Departmental"],
    priority: "high",
  },
  {
    id: "3",
    name: "AI Task Completion Rate",
    owner: "Mahendra Lugariya",
    target: "80 #",
    value: "80 #",
    unit: "Weekly",
    status: "at-risk",
    frequency: "Weekly",
    badge: "In Deployment",
    color: "bg-pink-100",
    tags: ["Operations", "Individual"],
    priority: "medium",
  },
  {
    id: "4",
    name: "Customer Satisfaction Score",
    owner: "Mahendra Lugariya",
    target: "85 #",
    value: "85 #",
    unit: "Weekly",
    status: "at-risk",
    frequency: "Weekly",
    badge: "Escalated",
    color: "bg-red-100",
    tags: ["Support", "Departmental"],
    priority: "high",
  },
  {
    id: "5",
    name: "Lead Conversion Rate",
    owner: "Mahendra Lugariya",
    target: "20 #",
    value: "20 #",
    unit: "Weekly",
    status: "at-risk",
    frequency: "Weekly",
    badge: "In Deployment",
    color: "bg-blue-100",
    tags: ["Sales", "Individual"],
    priority: "medium",
  },
  {
    id: "6",
    name: "Monthly Revenue",
    owner: "Mahendra Lugariya",
    target: "500K",
    value: "500K",
    unit: "Monthly",
    status: "on-target",
    frequency: "Monthly",
    badge: "Escalated",
    color: "bg-yellow-100",
    tags: ["Finance", "Departmental"],
    priority: "high",
  },
  {
    id: "7",
    name: "New Partnerships Formed",
    owner: "Mahendra Lugariya",
    target: "5 #",
    value: "5 #",
    unit: "Weekly",
    status: "on-target",
    frequency: "Weekly",
    badge: "Escalated",
    color: "bg-orange-100",
    tags: ["Sales", "Individual"],
    priority: "low",
  },
  {
    id: "8",
    name: "Project Completion Rate",
    owner: "Mahendra Lugariya",
    target: "90 #",
    value: "90 #",
    unit: "Weekly",
    status: "on-target",
    frequency: "Weekly",
    badge: "Escalated",
    color: "bg-teal-100",
    tags: ["Delivery", "Departmental"],
    priority: "medium",
  },
];
