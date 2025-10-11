import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, X, Edit2, Settings, CheckSquare, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Setup subtab type
type SetupSubTab = "related-to" | "category-type" | "status" | "operational-days" | "complaint-mode" | "location" | "project-emails" | "aging-rule";

// Category Type sub-sections
type CategoryTypeSection = "category" | "sub-category";

// Sample data for Related To tab (matching the image)
const relatedToSampleData = [
  {
    id: "1",
    sNo: "1",
    relatedTo: "",
    categoryType: "",
    status: "",
    operationalDays: "",
    complaintMode: "",
    location: "",
    projectEmails: "",
    agingRule: "",
    issueType: "Flat",
  },
  {
    id: "2",
    sNo: "2",
    relatedTo: "",
    categoryType: "",
    status: "",
    operationalDays: "",
    complaintMode: "",
    location: "",
    projectEmails: "",
    agingRule: "",
    issueType: "Common Area",
  },
];

// Sample data for Category section
const categorySampleData = [
  { id: "1", sNo: 1, issueType: "Flat", categoryType: "No Water Supply In Flat", fmResponseTime: 60, projectResponseTime: "", priority: "", icon: "" },
  { id: "2", sNo: 2, issueType: "Flat", categoryType: "No Power Supply In Flat", fmResponseTime: 60, projectResponseTime: "", priority: "", icon: "" },
  { id: "3", sNo: 3, issueType: "Common Area", categoryType: "Horticulture", fmResponseTime: 60, projectResponseTime: "", priority: "", icon: "" },
  { id: "4", sNo: 4, issueType: "Common Area", categoryType: "Pest Control", fmResponseTime: 60, projectResponseTime: "", priority: "", icon: "" },
  { id: "5", sNo: 5, issueType: "Common Area", categoryType: "Leakage", fmResponseTime: 60, projectResponseTime: "", priority: "", icon: "" },
  { id: "6", sNo: 6, issueType: "Common Area", categoryType: "Other", fmResponseTime: 60, projectResponseTime: "", priority: "", icon: "" },
  { id: "7", sNo: 7, issueType: "Common Area", categoryType: "General", fmResponseTime: 60, projectResponseTime: "", priority: "", icon: "" },
  { id: "8", sNo: 8, issueType: "Common Area", categoryType: "Common Area", fmResponseTime: 60, projectResponseTime: "", priority: "", icon: "" },
];

// Sample data for Sub Category section
const subCategorySampleData = [
  { id: "1", sNo: 1, issueType: "Flat", categoryType: "Carpentry", subCategory: "Window lock not working", helpdeskText: "" },
  { id: "2", sNo: 2, issueType: "Flat", categoryType: "Housekeeping", subCategory: "Flat Cleaning Required", helpdeskText: "" },
  { id: "3", sNo: 3, issueType: "Flat", categoryType: "Possession Complaint", subCategory: "Kitchen Granite Crack", helpdeskText: "" },
  { id: "4", sNo: 4, issueType: "Common Area", categoryType: "Lift", subCategory: "Lift", helpdeskText: "" },
  { id: "5", sNo: 5, issueType: "Common Area", categoryType: "Housekeeping", subCategory: "Lobby cleaning", helpdeskText: "" },
  { id: "6", sNo: 6, issueType: "Flat", categoryType: "Carpentry", subCategory: "Door sunmica damage", helpdeskText: "" },
  { id: "7", sNo: 7, issueType: "Flat", categoryType: "Civil", subCategory: "Umra Patti", helpdeskText: "" },
  { id: "8", sNo: 8, issueType: "Flat", categoryType: "Leakage", subCategory: "Window side silicon filing req", helpdeskText: "" },
  { id: "9", sNo: 9, issueType: "Common Area", categoryType: "Plumbing", subCategory: "Fire Fighting pipe leakage", helpdeskText: "" },
  { id: "10", sNo: 10, issueType: "Flat", categoryType: "Plumbing", subCategory: "Fire Fighting pipe leakage", helpdeskText: "" },
];

// Sample data for Status section
const statusSampleData = [
  { id: "1", order: 0, status: "Pending", fixedState: "", color: "#FF7744" },
  { id: "2", order: 1, status: "Received", fixedState: "", color: "#FFCC00" },
  { id: "3", order: 2, status: "Work In Progress", fixedState: "", color: "#00CB53" },
  { id: "4", order: 3, status: "Completed", fixedState: "Complete", color: "#248108" },
  { id: "5", order: 4, status: "Closed", fixedState: "Closed", color: "#248108" },
  { id: "6", order: 5, status: "Reopen", fixedState: "Reopen", color: "#00B8D4" },
  { id: "7", order: 6, status: "Customer Action Pending", fixedState: "Customer Action Pending", color: "#eb5768" },
  { id: "8", order: 7, status: "On Hold", fixedState: "", color: "#304FFE" },
  { id: "9", order: 8, status: "Not In Scope", fixedState: "", color: "#D50000" },
  { id: "10", order: 9, status: "Under Observation", fixedState: "", color: "#AAfAfA2" },
  { id: "11", order: 10, status: "Tat", fixedState: "", color: "#0033CC" },
];

// Sample data for Operational Days section
const operationalDaysSampleData = [
  { id: "1", day: "Monday", isActive: false, startHour: "09", startMinute: "30", endHour: "18", endMinute: "00" },
  { id: "2", day: "Tuesday", isActive: true, startHour: "09", startMinute: "30", endHour: "18", endMinute: "00" },
  { id: "3", day: "Wednesday", isActive: true, startHour: "09", startMinute: "30", endHour: "18", endMinute: "00" },
  { id: "4", day: "Thursday", isActive: true, startHour: "09", startMinute: "30", endHour: "18", endMinute: "00" },
  { id: "5", day: "Friday", isActive: true, startHour: "09", startMinute: "30", endHour: "18", endMinute: "00" },
  { id: "6", day: "Saturday", isActive: true, startHour: "09", startMinute: "30", endHour: "18", endMinute: "00" },
  { id: "7", day: "Sunday", isActive: false, startHour: "09", startMinute: "30", endHour: "18", endMinute: "00" },
];

// Sample data for Complaint Mode section
const complaintModeSampleData = [
  { id: "1", sNo: 1, complaintMode: "Post Possession Complaints" },
  { id: "2", sNo: 2, complaintMode: "Whats App" },
  { id: "3", sNo: 3, complaintMode: "Walk-In" },
  { id: "4", sNo: 4, complaintMode: "Verbal" },
  { id: "5", sNo: 5, complaintMode: "Email" },
  { id: "6", sNo: 6, complaintMode: "Phone" },
  { id: "7", sNo: 7, complaintMode: "App" },
];

// Sample data for Location section
const locationSampleData = [
  { id: "1", sNo: 1, level1: "T1" },
  { id: "2", sNo: 2, level1: "Common Area" },
];

// Sample data for Project Emails section
const projectEmailsSampleData = [
  { id: "1", sNo: 1, emailId: "Lalit.Patil@Runwalgroup.in" },
  { id: "2", sNo: 2, emailId: "Projects@Runwal.Com" },
];

// Sample data for Aging Rule section
const agingRuleSampleData = [
  { id: "1", sNo: 1, rule: "0 - 3 Days", color: "#800000" },
  { id: "2", sNo: 2, rule: "3 - 7 Days", color: "#304FFE" },
  { id: "3", sNo: 3, rule: "7 - 14 Days", color: "#248108" },
  { id: "4", sNo: 4, rule: "> 14 Days", color: "#00B8D4" },
];

// Sample data for other subtabs
const sampleData = {
  "related-to": relatedToSampleData,
  "category-type": [],
  "status": [],
  "operational-days": [],
  "complaint-mode": [],
  "location": [],
  "project-emails": [],
  "aging-rule": [],
};

export const HelpdeskSetupDashboard = () => {
  const navigate = useNavigate();
  const [activeSetupSubTab, setActiveSetupSubTab] = useState<SetupSubTab>("related-to");
  const [categoryTypeSection, setCategoryTypeSection] = useState<CategoryTypeSection>("category");
  const [data, setData] = useState(sampleData);
  const [categoryData, setCategoryData] = useState(categorySampleData);
  const [subCategoryData, setSubCategoryData] = useState(subCategorySampleData);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [itemName, setItemName] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  
  // Category Type specific states
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showSubCategoryDialog, setShowSubCategoryDialog] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingSubCategoryId, setEditingSubCategoryId] = useState<string | null>(null);
  
  // Form states for Category
  const [categoryIssueType, setCategoryIssueType] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryFmTime, setCategoryFmTime] = useState("");
  const [categoryProjectTime, setCategoryProjectTime] = useState("");
  
  // Form states for Sub Category
  const [subCategoryIssueType, setSubCategoryIssueType] = useState("");
  const [subCategoryType, setSubCategoryType] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryText, setSubCategoryText] = useState("");

  // Status specific states
  const [statusData, setStatusData] = useState(statusSampleData);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [statusOrder, setStatusOrder] = useState("");
  const [statusName, setStatusName] = useState("");
  const [statusFixedState, setStatusFixedState] = useState("");
  const [statusColor, setStatusColor] = useState("#000000");
  
  // Status settings states
  const [allowReopenAfterClosure, setAllowReopenAfterClosure] = useState(false);
  const [reopenDays, setReopenDays] = useState("");
  const [autoCloseTickets, setAutoCloseTickets] = useState(false);
  const [closeTicketsByUser, setCloseTicketsByUser] = useState(false);

  // Operational Days states
  const [operationalDaysData, setOperationalDaysData] = useState(operationalDaysSampleData);

  // Complaint Mode states
  const [complaintModeData, setComplaintModeData] = useState(complaintModeSampleData);
  const [showComplaintModeDialog, setShowComplaintModeDialog] = useState(false);
  const [editingComplaintModeId, setEditingComplaintModeId] = useState<string | null>(null);
  const [complaintModeName, setComplaintModeName] = useState("");

  // Location states
  const [locationData, setLocationData] = useState(locationSampleData);
  const [locationSection, setLocationSection] = useState<"level1" | "level2" | "level3">("level1");
  const [locationLevel1, setLocationLevel1] = useState("");

  // Project Emails states
  const [projectEmailsData, setProjectEmailsData] = useState(projectEmailsSampleData);
  const [showProjectEmailDialog, setShowProjectEmailDialog] = useState(false);
  const [editingProjectEmailId, setEditingProjectEmailId] = useState<string | null>(null);
  const [projectEmail, setProjectEmail] = useState("");

  // Aging Rule states
  const [agingRuleData, setAgingRuleData] = useState(agingRuleSampleData);
  const [showAgingRuleDialog, setShowAgingRuleDialog] = useState(false);
  const [editingAgingRuleId, setEditingAgingRuleId] = useState<string | null>(null);
  const [agingRuleType, setAgingRuleType] = useState("");
  const [agingRuleUnit, setAgingRuleUnit] = useState("");
  const [agingRuleColor, setAgingRuleColor] = useState("#000000");

  // Assign & Escalation states
  const [assignEscalationTab, setAssignEscalationTab] = useState<"resolution" | "response">("resolution");
  const [assignRuleTab, setAssignRuleTab] = useState<"assign-rule" | "escalation-rule">("assign-rule");
  const [responseTab, setResponseTab] = useState<"fm" | "project">("fm");
  const [executiveEscalationTab, setExecutiveEscalationTab] = useState<"fm" | "project" | "executive-escalation">("fm");
  
  // Assign Rule Resolution states
  const [assignResolutionMode, setAssignResolutionMode] = useState<"manual" | "automatic">("manual");
  const [selectedIssueType, setSelectedIssueType] = useState("");
  const [selectedCategoryType, setSelectedCategoryType] = useState("");
  const [selectedEngineer, setSelectedEngineer] = useState("");
  
  // Escalation Rule Response states
  const [escalationIssueType, setEscalationIssueType] = useState("");
  const [escalationCategoryType, setEscalationCategoryType] = useState("");
  const [escalationLevels, setEscalationLevels] = useState({
    e1: "",
    e2: "",
    e3: "",
    e4: "",
    e5: "",
  });

  // Executive Escalation Resolution states
  const [execEscalationIssueType, setExecEscalationIssueType] = useState("");
  const [execEscalationCategoryType, setExecEscalationCategoryType] = useState("");
  const [execEscalationLevels, setExecEscalationLevels] = useState({
    e0: "",
    e1: "",
    e2: "",
    e3: "",
    e4: "",
    e5: "",
  });
  const [execEscalationTimes, setExecEscalationTimes] = useState({
    p1: { days: "", hrs: "", min: "" },
  });

  // Project Escalation Rule states (for Resolution)
  const [projectEscalationIssueType, setProjectEscalationIssueType] = useState("");
  const [projectEscalationCategoryType, setProjectEscalationCategoryType] = useState("");
  const [projectEscalationLevels, setProjectEscalationLevels] = useState({
    e1: "",
    e2: "",
    e3: "",
    e4: "",
    e5: "",
  });
  const [projectEscalationTimes, setProjectEscalationTimes] = useState({
    p1: { days: "", hrs: "", min: "" },
    p2: { days: "", hrs: "", min: "" },
    p3: { days: "", hrs: "", min: "" },
    p4: { days: "", hrs: "", min: "" },
    p5: { days: "", hrs: "", min: "" },
  });

  // Sample Executive Escalation Rules data
  const [executiveEscalationRules] = useState([
    {
      id: "1",
      ruleNumber: "Rule",
      levels: [
        { level: "E0", escalationTo: "", p1: "" },
        { level: "E1", escalationTo: "", p1: "" },
        { level: "E2", escalationTo: "", p1: "" },
        { level: "E3", escalationTo: "", p1: "" },
      ],
    },
  ]);

  // FM Escalation Rule states
  const [fmEscalationIssueType, setFmEscalationIssueType] = useState("");
  const [fmEscalationCategoryType, setFmEscalationCategoryType] = useState("");
  const [fmEscalationLevels, setFmEscalationLevels] = useState({
    e1: "",
    e2: "",
    e3: "",
    e4: "",
    e5: "",
  });
  const [fmEscalationTimes, setFmEscalationTimes] = useState({
    p1: { days: "", hrs: "", min: "" },
    p2: { days: "", hrs: "", min: "" },
    p3: { days: "", hrs: "", min: "" },
    p4: { days: "", hrs: "", min: "" },
    p5: { days: "", hrs: "", min: "" },
  });

  // Sample FM Escalation Rules data
  const [fmEscalationRules] = useState([
    {
      id: "1",
      ruleNumber: "Rule 1",
      issueType: "Common Area",
      categoryType: "Civil",
      levels: [
        { level: "E1", escalationTo: "Property Manager", p1: "2 Day, 0 Hour, 0 Minute", p2: "", p3: "", p4: "", p5: "" },
        { level: "E2", escalationTo: "Sapna Chauhan , Suresh Adhe", p1: "2 Day, 0 Hour, 0 Minute", p2: "", p3: "", p4: "", p5: "" },
        { level: "E3", escalationTo: "Swapnil Patil , Lalit Patil", p1: "2 Day, 0 Hour, 0 Minute", p2: "", p3: "", p4: "", p5: "" },
        { level: "E4", escalationTo: "Arun Kumar", p1: "2 Day, 0 Hour, 0 Minute", p2: "", p3: "", p4: "", p5: "" },
      ],
    },
    {
      id: "2",
      ruleNumber: "Rule 2",
      issueType: "Common Area",
      categoryType: "Civil",
      levels: [
        { level: "E1", escalationTo: "Property Manager", p1: "2 Day, 0 Hour, 0 Minute", p2: "", p3: "", p4: "", p5: "" },
        { level: "E2", escalationTo: "Sapna Chauhan", p1: "2 Day, 0 Hour, 0 Minute", p2: "", p3: "", p4: "", p5: "" },
      ],
    },
  ]);

  // Vendor Setup states
  const [vendorData, setVendorData] = useState<any[]>([]);
  const [showVendorDialog, setShowVendorDialog] = useState(false);
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null);
  const [vendorName, setVendorName] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorMobile, setVendorMobile] = useState("");
  const [vendorCompanyName, setVendorCompanyName] = useState("");
  const [vendorGSTIN, setVendorGSTIN] = useState("");
  const [vendorPAN, setVendorPAN] = useState("");

  const getSubTabLabel = (tab: SetupSubTab): string => {
    const labels: Record<SetupSubTab, string> = {
      "related-to": "Related To",
      "category-type": "Category Type",
      "status": "Status",
      "operational-days": "Operational Days",
      "complaint-mode": "Complaint Mode",
      "location": "Location",
      "project-emails": "Project Emails",
      "aging-rule": "Aging Rule",
    };
    return labels[tab];
  };

  const handleAddItem = () => {
    setShowAddDialog(true);
  };

  const handleSubmitItem = () => {
    if (!itemName.trim()) {
      toast.error(`Please enter ${getSubTabLabel(activeSetupSubTab).toLowerCase()}`);
      return;
    }

    const newItem = {
      id: `item-${Date.now()}`,
      name: itemName,
      sNo: data[activeSetupSubTab].length + 1,
    };

    setData({
      ...data,
      [activeSetupSubTab]: [...data[activeSetupSubTab], newItem],
    });

    setItemName("");
    setShowAddDialog(false);
    toast.success(`${getSubTabLabel(activeSetupSubTab)} added successfully!`);
  };

  const handleDeleteItem = (itemId: string) => {
    setData({
      ...data,
      [activeSetupSubTab]: data[activeSetupSubTab].filter((item: any) => item.id !== itemId),
    });
    toast.success(`${getSubTabLabel(activeSetupSubTab)} deleted successfully!`);
  };

  const handleEditItem = (itemId: string) => {
    const itemToEdit = data[activeSetupSubTab].find((item: any) => item.id === itemId);
    if (itemToEdit) {
      setEditingItemId(itemId);
      if (activeSetupSubTab === "related-to") {
        setItemName(itemToEdit.issueType || "");
      } else {
        setItemName(itemToEdit.name || "");
      }
      setShowEditDialog(true);
    }
  };

  const handleUpdateItem = () => {
    if (!itemName.trim()) {
      toast.error(`Please enter ${getSubTabLabel(activeSetupSubTab).toLowerCase()}`);
      return;
    }

    setData({
      ...data,
      [activeSetupSubTab]: data[activeSetupSubTab].map((item: any) => {
        if (item.id === editingItemId) {
          if (activeSetupSubTab === "related-to") {
            return { ...item, issueType: itemName };
          }
          return { ...item, name: itemName };
        }
        return item;
      }),
    });

    setItemName("");
    setEditingItemId(null);
    setShowEditDialog(false);
    toast.success(`${getSubTabLabel(activeSetupSubTab)} updated successfully!`);
  };

  // Category handlers
  const handleEditCategory = (categoryId: string) => {
    const category = categoryData.find((cat) => cat.id === categoryId);
    if (category) {
      setEditingCategoryId(categoryId);
      setCategoryIssueType(category.issueType);
      setCategoryName(category.categoryType);
      setCategoryFmTime(category.fmResponseTime.toString());
      setCategoryProjectTime(category.projectResponseTime?.toString() || "");
      setShowCategoryDialog(true);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategoryData(categoryData.filter((cat) => cat.id !== categoryId));
    toast.success("Category deleted successfully!");
  };

  const handleSaveCategory = () => {
    if (!categoryIssueType || !categoryName || !categoryFmTime) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingCategoryId) {
      // Update existing category
      setCategoryData(
        categoryData.map((cat) =>
          cat.id === editingCategoryId
            ? {
                ...cat,
                issueType: categoryIssueType,
                categoryType: categoryName,
                fmResponseTime: parseInt(categoryFmTime),
                projectResponseTime: categoryProjectTime || "",
              }
            : cat
        )
      );
      toast.success("Category updated successfully!");
    } else {
      // Add new category
      const newCategory = {
        id: `cat-${Date.now()}`,
        sNo: categoryData.length + 1,
        issueType: categoryIssueType,
        categoryType: categoryName,
        fmResponseTime: parseInt(categoryFmTime),
        projectResponseTime: categoryProjectTime || "",
        priority: "",
        icon: "",
      };
      setCategoryData([...categoryData, newCategory]);
      toast.success("Category added successfully!");
    }

    // Reset form
    setCategoryIssueType("");
    setCategoryName("");
    setCategoryFmTime("");
    setCategoryProjectTime("");
    setEditingCategoryId(null);
    setShowCategoryDialog(false);
  };

  // Sub Category handlers
  const handleEditSubCategory = (subCategoryId: string) => {
    const subCategory = subCategoryData.find((sub) => sub.id === subCategoryId);
    if (subCategory) {
      setEditingSubCategoryId(subCategoryId);
      setSubCategoryIssueType(subCategory.issueType);
      setSubCategoryType(subCategory.categoryType);
      setSubCategoryName(subCategory.subCategory);
      setSubCategoryText(subCategory.helpdeskText || "");
      setShowSubCategoryDialog(true);
    }
  };

  const handleDeleteSubCategory = (subCategoryId: string) => {
    setSubCategoryData(subCategoryData.filter((sub) => sub.id !== subCategoryId));
    toast.success("Sub Category deleted successfully!");
  };

  const handleSaveSubCategory = () => {
    if (!subCategoryIssueType || !subCategoryType || !subCategoryName) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingSubCategoryId) {
      // Update existing sub category
      setSubCategoryData(
        subCategoryData.map((sub) =>
          sub.id === editingSubCategoryId
            ? {
                ...sub,
                issueType: subCategoryIssueType,
                categoryType: subCategoryType,
                subCategory: subCategoryName,
                helpdeskText: subCategoryText,
              }
            : sub
        )
      );
      toast.success("Sub Category updated successfully!");
    } else {
      // Add new sub category
      const newSubCategory = {
        id: `subcat-${Date.now()}`,
        sNo: subCategoryData.length + 1,
        issueType: subCategoryIssueType,
        categoryType: subCategoryType,
        subCategory: subCategoryName,
        helpdeskText: subCategoryText,
      };
      setSubCategoryData([...subCategoryData, newSubCategory]);
      toast.success("Sub Category added successfully!");
    }

    // Reset form
    setSubCategoryIssueType("");
    setSubCategoryType("");
    setSubCategoryName("");
    setSubCategoryText("");
    setEditingSubCategoryId(null);
    setShowSubCategoryDialog(false);
  };

  // Status handlers
  const handleEditStatus = (statusId: string) => {
    const statusToEdit = statusData.find((status) => status.id === statusId);
    if (statusToEdit) {
      setEditingStatusId(statusId);
      setStatusOrder(statusToEdit.order.toString());
      setStatusName(statusToEdit.status);
      setStatusFixedState(statusToEdit.fixedState);
      setStatusColor(statusToEdit.color);
      setShowStatusDialog(true);
    }
  };

  const handleDeleteStatus = (statusId: string) => {
    setStatusData(statusData.filter((status) => status.id !== statusId));
    toast.success("Status deleted successfully!");
  };

  const handleSaveStatus = () => {
    if (!statusName.trim()) {
      toast.error("Please enter status name");
      return;
    }
    if (!statusOrder.trim()) {
      toast.error("Please enter order");
      return;
    }

    if (editingStatusId) {
      // Update existing status
      setStatusData(
        statusData.map((status) =>
          status.id === editingStatusId
            ? {
                ...status,
                order: parseInt(statusOrder),
                status: statusName,
                fixedState: statusFixedState,
                color: statusColor,
              }
            : status
        )
      );
      toast.success("Status updated successfully!");
    } else {
      // Add new status
      const newStatus = {
        id: `status-${Date.now()}`,
        order: parseInt(statusOrder),
        status: statusName,
        fixedState: statusFixedState,
        color: statusColor,
      };
      setStatusData([...statusData, newStatus]);
      toast.success("Status added successfully!");
    }

    // Reset form
    setStatusOrder("");
    setStatusName("");
    setStatusFixedState("");
    setStatusColor("#000000");
    setEditingStatusId(null);
    setShowStatusDialog(false);
  };

  const handleUpdateStatusSettings = () => {
    toast.success("Status settings updated successfully!");
  };

  // Operational Days handlers
  const handleToggleOperationalDay = (dayId: string) => {
    setOperationalDaysData(
      operationalDaysData.map((day) =>
        day.id === dayId ? { ...day, isActive: !day.isActive } : day
      )
    );
  };

  const handleOperationalTimeChange = (
    dayId: string,
    field: "startHour" | "startMinute" | "endHour" | "endMinute",
    value: string
  ) => {
    setOperationalDaysData(
      operationalDaysData.map((day) =>
        day.id === dayId ? { ...day, [field]: value } : day
      )
    );
  };

  const handleSubmitOperationalDays = () => {
    toast.success("Operational days updated successfully!");
  };

  // Complaint Mode handlers
  const handleEditComplaintMode = (id: string) => {
    const item = complaintModeData.find((mode) => mode.id === id);
    if (item) {
      setEditingComplaintModeId(id);
      setComplaintModeName(item.complaintMode);
      setShowComplaintModeDialog(true);
    }
  };

  const handleDeleteComplaintMode = (id: string) => {
    setComplaintModeData(complaintModeData.filter((mode) => mode.id !== id));
    toast.success("Complaint mode deleted successfully!");
  };

  const handleSaveComplaintMode = () => {
    if (!complaintModeName.trim()) {
      toast.error("Please enter complaint mode");
      return;
    }

    if (editingComplaintModeId) {
      setComplaintModeData(
        complaintModeData.map((mode) =>
          mode.id === editingComplaintModeId
            ? { ...mode, complaintMode: complaintModeName }
            : mode
        )
      );
      toast.success("Complaint mode updated successfully!");
    } else {
      const newMode = {
        id: `mode-${Date.now()}`,
        sNo: complaintModeData.length + 1,
        complaintMode: complaintModeName,
      };
      setComplaintModeData([...complaintModeData, newMode]);
      toast.success("Complaint mode added successfully!");
    }

    setComplaintModeName("");
    setEditingComplaintModeId(null);
    setShowComplaintModeDialog(false);
  };

  // Location handlers
  const handleAddLocation = () => {
    if (!locationLevel1.trim()) {
      toast.error("Please enter level 1");
      return;
    }

    const newLocation = {
      id: `loc-${Date.now()}`,
      sNo: locationData.length + 1,
      level1: locationLevel1,
    };
    setLocationData([...locationData, newLocation]);
    setLocationLevel1("");
    toast.success("Location added successfully!");
  };

  const handleDeleteLocation = (id: string) => {
    setLocationData(locationData.filter((loc) => loc.id !== id));
    toast.success("Location deleted successfully!");
  };

  // Project Emails handlers
  const handleEditProjectEmail = (id: string) => {
    const item = projectEmailsData.find((email) => email.id === id);
    if (item) {
      setEditingProjectEmailId(id);
      setProjectEmail(item.emailId);
      setShowProjectEmailDialog(true);
    }
  };

  const handleDeleteProjectEmail = (id: string) => {
    setProjectEmailsData(projectEmailsData.filter((email) => email.id !== id));
    toast.success("Project email deleted successfully!");
  };

  const handleSaveProjectEmail = () => {
    if (!projectEmail.trim()) {
      toast.error("Please enter email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(projectEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (editingProjectEmailId) {
      setProjectEmailsData(
        projectEmailsData.map((email) =>
          email.id === editingProjectEmailId
            ? { ...email, emailId: projectEmail }
            : email
        )
      );
      toast.success("Project email updated successfully!");
    } else {
      const newEmail = {
        id: `email-${Date.now()}`,
        sNo: projectEmailsData.length + 1,
        emailId: projectEmail,
      };
      setProjectEmailsData([...projectEmailsData, newEmail]);
      toast.success("Project email added successfully!");
    }

    setProjectEmail("");
    setEditingProjectEmailId(null);
    setShowProjectEmailDialog(false);
  };

  // Aging Rule handlers
  const handleEditAgingRule = (id: string) => {
    const item = agingRuleData.find((rule) => rule.id === id);
    if (item) {
      setEditingAgingRuleId(id);
      setAgingRuleColor(item.color);
      setShowAgingRuleDialog(true);
    }
  };

  const handleDeleteAgingRule = (id: string) => {
    setAgingRuleData(agingRuleData.filter((rule) => rule.id !== id));
    toast.success("Aging rule deleted successfully!");
  };

  const handleSaveAgingRule = () => {
    if (!agingRuleType.trim() || !agingRuleUnit.trim()) {
      toast.error("Please select rule type and unit");
      return;
    }

    if (editingAgingRuleId) {
      setAgingRuleData(
        agingRuleData.map((rule) =>
          rule.id === editingAgingRuleId
            ? { ...rule, color: agingRuleColor }
            : rule
        )
      );
      toast.success("Aging rule updated successfully!");
    } else {
      const newRule = {
        id: `rule-${Date.now()}`,
        sNo: agingRuleData.length + 1,
        rule: `${agingRuleType} ${agingRuleUnit}`,
        color: agingRuleColor,
      };
      setAgingRuleData([...agingRuleData, newRule]);
      toast.success("Aging rule added successfully!");
    }

    setAgingRuleType("");
    setAgingRuleUnit("");
    setAgingRuleColor("#000000");
    setEditingAgingRuleId(null);
    setShowAgingRuleDialog(false);
  };

  const filteredData = data[activeSetupSubTab].filter((item: any) => {
    if (activeSetupSubTab === "related-to") {
      return item.issueType?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return item.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#fafafa] p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-[#1A1A1A]">Helpdesk Setup</h1>
          </div>
        </div>

        {/* Main Tabs Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white border-b border-gray-200 rounded-none h-auto p-0">
              <TabsTrigger
                value="setup"
                className="group flex items-center justify-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 border-none font-semibold rounded-none py-4 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-5 h-5 stroke-current" />
                SETUP
              </TabsTrigger>

              <TabsTrigger
                value="assign-escalation"
                className="group flex items-center justify-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 border-none font-semibold rounded-none py-4 hover:bg-gray-50 transition-colors"
              >
                <CheckSquare className="w-5 h-5 stroke-current" />
                ASSIGN & ESCALATION SETUP
              </TabsTrigger>

              <TabsTrigger
                value="vendor"
                className="group flex items-center justify-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 border-none font-semibold rounded-none py-4 hover:bg-gray-50 transition-colors"
              >
                <Users className="w-5 h-5 stroke-current" />
                VENDOR SETUP
              </TabsTrigger>
            </TabsList>

            {/* Setup Tab Content with Subtabs */}
            <TabsContent value="setup" className="mt-0">
              {/* Subtabs */}
              <div className="border-b border-gray-200 bg-gray-50">
                <div className="flex overflow-x-auto">
                  {(["related-to", "category-type", "status", "operational-days", "complaint-mode", "location", "project-emails", "aging-rule"] as SetupSubTab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveSetupSubTab(tab)}
                      className={`
                        px-6 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2
                        ${activeSetupSubTab === tab
                          ? "border-[#1E3A8A] text-[#1E3A8A] bg-white"
                          : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }
                      `}
                    >
                      {getSubTabLabel(tab)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6">
                {activeSetupSubTab === "category-type" ? (
                  // Category Type Tab - Special Layout with Category/Sub Category sections
                  <>
                    {/* Category/Sub Category Toggle Buttons */}
                    <div className="flex gap-0 mb-8">
                      <button
                        onClick={() => setCategoryTypeSection("category")}
                        className={`
                          px-10 py-3.5 text-sm font-semibold transition-all relative shadow-sm
                          ${categoryTypeSection === "category"
                            ? "bg-[#EDEAE3] text-[#C72030] z-10 shadow-md"
                            : "bg-[#E5E7EB] text-gray-700 hover:bg-gray-300"
                          }
                        `}
                        style={{
                          clipPath: categoryTypeSection === "category" 
                            ? "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)"
                            : "none"
                        }}
                      >
                        Category
                      </button>
                      <button
                        onClick={() => setCategoryTypeSection("sub-category")}
                        className={`
                          px-10 py-3.5 text-sm font-semibold transition-all -ml-5 shadow-sm
                          ${categoryTypeSection === "sub-category"
                            ? "bg-[#EDEAE3] text-[#C72030] z-10 shadow-md"
                            : "bg-[#E5E7EB] text-gray-700 hover:bg-gray-300"
                          }
                        `}
                      >
                        Sub Category
                      </button>
                    </div>

                    {categoryTypeSection === "category" ? (
                      // Category Section
                      <>
                        {/* Category Form */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                          <div className="grid grid-cols-12 gap-4 items-end">
                            <div className="col-span-2">
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">Select Issue Type</Label>
                              <select className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent transition-all">
                                <option>Select Issue Type</option>
                                <option>Flat</option>
                                <option>Common Area</option>
                              </select>
                            </div>
                            <div className="col-span-2">
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">Enter category</Label>
                              <input
                                type="text"
                                placeholder="Enter category"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent transition-all"
                              />
                            </div>
                            <div className="col-span-3">
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">Enter FM response time</Label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  placeholder="Enter time"
                                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent transition-all"
                                />
                                <span className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium text-gray-700 whitespace-nowrap">Min</span>
                              </div>
                            </div>
                            <div className="col-span-3">
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">Enter Project response time</Label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  placeholder="Enter time"
                                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent transition-all"
                                />
                                <span className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium text-gray-700 whitespace-nowrap">Min</span>
                              </div>
                            </div>
                            <div className="col-span-2 flex justify-end">
                              <Button className="bg-[#C72030] hover:bg-[#A61B28] text-white px-8 py-2.5 font-medium shadow-sm transition-all">
                                <Plus className="w-4 h-4 mr-2" />
                                Add
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Category Table */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">S.No.</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Issue Type</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category Type</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">FM Response Time (Min)</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Project Response Time (Min)</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Priority</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Icon</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-28">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {categoryData.map((item, index) => (
                                <tr key={item.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-50 transition-colors`}>
                                  <td className="px-6 py-4 text-sm text-gray-900">{item.sNo}</td>
                                  <td className="px-6 py-4 text-sm text-gray-900">{item.issueType}</td>
                                  <td className="px-6 py-4 text-sm text-gray-900">{item.categoryType}</td>
                                  <td className="px-6 py-4 text-sm text-gray-900">{item.fmResponseTime}</td>
                                  <td className="px-6 py-4 text-sm text-gray-900">{item.projectResponseTime || "-"}</td>
                                  <td className="px-6 py-4 text-sm text-gray-900">{item.priority || "-"}</td>
                                  <td className="px-6 py-4 text-sm text-gray-900">{item.icon || "-"}</td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-3">
                                      <button 
                                        onClick={() => handleEditCategory(item.id)}
                                        className="p-1.5 hover:bg-gray-200 rounded-md transition-colors" 
                                        title="Edit"
                                      >
                                        <Edit2 className="w-4 h-4 text-gray-600" />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteCategory(item.id)}
                                        className="p-1.5 hover:bg-red-50 rounded-md transition-colors" 
                                        title="Delete"
                                      >
                                        <X className="w-4 h-4 text-red-600" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      // Sub Category Section
                      <>
                        {/* Sub Category Form */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                          <div className="grid grid-cols-12 gap-4 items-end">
                            <div className="col-span-2">
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">Select Issue Type</Label>
                              <select className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent transition-all">
                                <option>Select Issue Type</option>
                                <option>Flat</option>
                                <option>Common Area</option>
                              </select>
                            </div>
                            <div className="col-span-2">
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">Select Category</Label>
                              <select className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent transition-all">
                                <option>Select Category</option>
                                <option>Carpentry</option>
                                <option>Housekeeping</option>
                                <option>Plumbing</option>
                              </select>
                            </div>
                            <div className="col-span-3">
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">Enter Sub-category</Label>
                              <input
                                type="text"
                                placeholder="Enter Sub-category"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent transition-all"
                              />
                            </div>
                            <div className="col-span-3">
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">Enter text</Label>
                              <input
                                type="text"
                                placeholder="Enter text"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-green-50 focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent transition-all"
                              />
                            </div>
                            <div className="col-span-2 flex justify-end">
                              <Button className="bg-[#C72030] hover:bg-[#A61B28] text-white px-8 py-2.5 font-medium shadow-sm transition-all">
                                <Plus className="w-4 h-4 mr-2" />
                                Add
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Sub Category Table */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">S.No.</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Issue Type</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category Type</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sub Category</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Helpdesk Text</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-28">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {subCategoryData.map((item, index) => (
                                <tr key={item.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-50 transition-colors`}>
                                  <td className="px-6 py-4 text-sm text-gray-900">{item.sNo}</td>
                                  <td className="px-6 py-4 text-sm text-gray-900">
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent transition-all">
                                      <option>{item.issueType}</option>
                                      <option>Flat</option>
                                      <option>Common Area</option>
                                    </select>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-900">
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent transition-all">
                                      <option>{item.categoryType}</option>
                                      <option>Carpentry</option>
                                      <option>Housekeeping</option>
                                      <option>Plumbing</option>
                                    </select>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-900">{item.subCategory}</td>
                                  <td className="px-6 py-4 text-sm text-gray-900">{item.helpdeskText || "-"}</td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-3">
                                      <button 
                                        onClick={() => handleEditSubCategory(item.id)}
                                        className="p-1.5 hover:bg-gray-200 rounded-md transition-colors" 
                                        title="Edit"
                                      >
                                        <Edit2 className="w-4 h-4 text-gray-600" />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteSubCategory(item.id)}
                                        className="p-1.5 hover:bg-red-50 rounded-md transition-colors" 
                                        title="Delete"
                                      >
                                        <X className="w-4 h-4 text-red-600" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </>
                ) : activeSetupSubTab === "status" ? (
                  // Status Tab - Special Layout
                  <>
                    {/* Status Form */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                      <div className="grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-3">
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Enter status</Label>
                          <input
                            type="text"
                            placeholder="Enter status"
                            value={statusName}
                            onChange={(e) => setStatusName(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent transition-all"
                          />
                        </div>
                        <div className="col-span-3">
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Select Fixed State</Label>
                          <select 
                            value={statusFixedState}
                            onChange={(e) => setStatusFixedState(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent transition-all"
                          >
                            <option value="">Select Fixed State</option>
                            <option value="Complete">Complete</option>
                            <option value="Closed">Closed</option>
                            <option value="Reopen">Reopen</option>
                            <option value="Customer Action Pending">Customer Action Pending</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Enter order</Label>
                          <input
                            type="number"
                            placeholder="Enter order"
                            value={statusOrder}
                            onChange={(e) => setStatusOrder(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent transition-all"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Color</Label>
                          <input
                            type="color"
                            value={statusColor}
                            onChange={(e) => setStatusColor(e.target.value)}
                            className="w-full h-[42px] border border-gray-300 rounded-md cursor-pointer"
                          />
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <Button 
                            onClick={() => {
                              setEditingStatusId(null);
                              handleSaveStatus();
                            }}
                            className="bg-[#C72030] hover:bg-[#A61B28] text-white px-8 py-2.5 font-medium shadow-sm transition-all"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Status Table */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fixed State</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Color</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-28">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {statusData.map((item, index) => (
                            <tr key={item.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-50 transition-colors`}>
                              <td className="px-6 py-4 text-sm text-gray-900">{item.order}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{item.status}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{item.fixedState || "-"}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-6 h-6 rounded border border-gray-300" 
                                    style={{ backgroundColor: item.color }}
                                  ></div>
                                  <span className="text-sm text-gray-900">{item.color}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-3">
                                  <button 
                                    onClick={() => handleEditStatus(item.id)}
                                    className="p-1.5 hover:bg-gray-200 rounded-md transition-colors" 
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4 text-gray-600" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteStatus(item.id)}
                                    className="p-1.5 hover:bg-red-50 rounded-md transition-colors" 
                                    title="Delete"
                                  >
                                    <X className="w-4 h-4 text-red-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Status Settings */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Status Settings</h3>
                      
                      <div className="space-y-4">
                        {/* Allow User to reopen ticket after closure */}
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            id="allowReopen"
                            checked={allowReopenAfterClosure}
                            onChange={(e) => setAllowReopenAfterClosure(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-[#C72030] focus:ring-[#C72030]"
                          />
                          <label htmlFor="allowReopen" className="text-sm font-medium text-gray-700">
                            Allow User to reopen ticket after closure
                          </label>
                          {allowReopenAfterClosure && (
                            <div className="flex items-center gap-2 ml-4">
                              <input
                                type="number"
                                placeholder="Days"
                                value={reopenDays}
                                onChange={(e) => setReopenDays(e.target.value)}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                              />
                              <span className="text-sm text-gray-600">days</span>
                            </div>
                          )}
                        </div>

                        {/* Auto Close Tickets */}
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            id="autoClose"
                            checked={autoCloseTickets}
                            onChange={(e) => setAutoCloseTickets(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-[#C72030] focus:ring-[#C72030]"
                          />
                          <label htmlFor="autoClose" className="text-sm font-medium text-gray-700">
                            Auto Close Tickets
                          </label>
                        </div>

                        {/* Close Tickets by User */}
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            id="closeByUser"
                            checked={closeTicketsByUser}
                            onChange={(e) => setCloseTicketsByUser(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-[#C72030] focus:ring-[#C72030]"
                          />
                          <label htmlFor="closeByUser" className="text-sm font-medium text-gray-700">
                            Close Tickets by User
                          </label>
                        </div>

                        {/* Update Button */}
                        <div className="pt-4">
                          <Button 
                            onClick={handleUpdateStatusSettings}
                            className="bg-[#C72030] hover:bg-[#A61B28] text-white px-8 py-2.5 font-medium shadow-sm transition-all"
                          >
                            Update
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : activeSetupSubTab === "operational-days" ? (
                  // Operational Days Tab - Special Layout
                  <>
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Operational Days</h3>
                        
                        {/* Header Row */}
                        <div className="grid grid-cols-12 gap-4 mb-4 pb-3 border-b border-gray-200">
                          <div className="col-span-3"></div>
                          <div className="col-span-4 text-center">
                            <span className="text-sm font-semibold text-gray-700">Start Time</span>
                          </div>
                          <div className="col-span-4 text-center">
                            <span className="text-sm font-semibold text-gray-700">End Time</span>
                          </div>
                        </div>

                        {/* Days Rows */}
                        <div className="space-y-4">
                          {operationalDaysData.map((day) => (
                            <div key={day.id} className="grid grid-cols-12 gap-4 items-center">
                              {/* Checkbox and Day Name */}
                              <div className="col-span-3 flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  id={`day-${day.id}`}
                                  checked={day.isActive}
                                  onChange={() => handleToggleOperationalDay(day.id)}
                                  className="w-4 h-4 rounded border-gray-300 text-[#C72030] focus:ring-[#C72030]"
                                />
                                <label htmlFor={`day-${day.id}`} className="text-sm font-medium text-gray-700">
                                  {day.day}
                                </label>
                              </div>

                              {/* Start Time */}
                              <div className="col-span-4 flex items-center justify-center gap-2">
                                <select
                                  value={day.startHour}
                                  onChange={(e) => handleOperationalTimeChange(day.id, "startHour", e.target.value)}
                                  className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                                  disabled={!day.isActive}
                                >
                                  {Array.from({ length: 24 }, (_, i) => {
                                    const hour = i.toString().padStart(2, '0');
                                    return <option key={hour} value={hour}>{hour}</option>;
                                  })}
                                </select>
                                <span className="text-gray-500">:</span>
                                <select
                                  value={day.startMinute}
                                  onChange={(e) => handleOperationalTimeChange(day.id, "startMinute", e.target.value)}
                                  className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                                  disabled={!day.isActive}
                                >
                                  {Array.from({ length: 60 }, (_, i) => {
                                    const minute = i.toString().padStart(2, '0');
                                    return <option key={minute} value={minute}>{minute}</option>;
                                  })}
                                </select>
                              </div>

                              {/* End Time */}
                              <div className="col-span-4 flex items-center justify-center gap-2">
                                <select
                                  value={day.endHour}
                                  onChange={(e) => handleOperationalTimeChange(day.id, "endHour", e.target.value)}
                                  className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                                  disabled={!day.isActive}
                                >
                                  {Array.from({ length: 24 }, (_, i) => {
                                    const hour = i.toString().padStart(2, '0');
                                    return <option key={hour} value={hour}>{hour}</option>;
                                  })}
                                </select>
                                <span className="text-gray-500">:</span>
                                <select
                                  value={day.endMinute}
                                  onChange={(e) => handleOperationalTimeChange(day.id, "endMinute", e.target.value)}
                                  className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                                  disabled={!day.isActive}
                                >
                                  {Array.from({ length: 60 }, (_, i) => {
                                    const minute = i.toString().padStart(2, '0');
                                    return <option key={minute} value={minute}>{minute}</option>;
                                  })}
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                          <Button 
                            onClick={handleSubmitOperationalDays}
                            className="bg-[#C72030] hover:bg-[#A61B28] text-white px-8 py-2.5 font-medium shadow-sm transition-all"
                          >
                            Submit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : activeSetupSubTab === "complaint-mode" ? (
                  // Complaint Mode Tab
                  <>
                    {/* Form Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Enter Complaint Mode"
                            value={complaintModeName}
                            onChange={(e) => setComplaintModeName(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent transition-all"
                          />
                        </div>
                        <Button 
                          onClick={() => {
                            setEditingComplaintModeId(null);
                            handleSaveComplaintMode();
                          }}
                          className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-2.5 font-medium shadow-sm transition-all"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sr.No</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Complaint Mode</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-28">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {complaintModeData.map((item, index) => (
                            <tr key={item.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-50 transition-colors`}>
                              <td className="px-6 py-4 text-sm text-gray-900">{item.sNo}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{item.complaintMode}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-3">
                                  <button 
                                    onClick={() => handleDeleteComplaintMode(item.id)}
                                    className="p-1.5 hover:bg-red-50 rounded-md transition-colors" 
                                    title="Delete"
                                  >
                                    <X className="w-4 h-4 text-red-600" />
                                  </button>
                                  <button 
                                    onClick={() => handleEditComplaintMode(item.id)}
                                    className="p-1.5 hover:bg-gray-200 rounded-md transition-colors" 
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4 text-gray-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : activeSetupSubTab === "location" ? (
                  // Location Tab - Special Layout with Level toggles
                  <>
                    {/* Level Toggle Buttons */}
                    <div className="flex gap-0 mb-8">
                      <button
                        onClick={() => setLocationSection("level1")}
                        className={`
                          px-10 py-3.5 text-sm font-semibold transition-all relative shadow-sm
                          ${locationSection === "level1"
                            ? "bg-[#00BCD4] text-white z-20 shadow-md"
                            : "bg-[#E5E7EB] text-gray-700 hover:bg-gray-300"
                          }
                        `}
                        style={{
                          clipPath: locationSection === "level1" 
                            ? "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)"
                            : "none"
                        }}
                      >
                        Level 1
                      </button>
                      <button
                        onClick={() => setLocationSection("level2")}
                        className={`
                          px-10 py-3.5 text-sm font-semibold transition-all -ml-5 relative shadow-sm
                          ${locationSection === "level2"
                            ? "bg-[#E5E7EB] text-gray-700 z-10"
                            : "bg-[#E5E7EB] text-gray-700 hover:bg-gray-300"
                          }
                        `}
                        style={{
                          clipPath: locationSection === "level2"
                            ? "polygon(20px 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 20px 100%, 0 50%)"
                            : "polygon(20px 0, 100% 0, 100% 100%, 20px 100%, 0 50%)"
                        }}
                      >
                        Level 2
                      </button>
                      <button
                        onClick={() => setLocationSection("level3")}
                        className={`
                          px-10 py-3.5 text-sm font-semibold transition-all -ml-5 shadow-sm
                          ${locationSection === "level3"
                            ? "bg-[#E5E7EB] text-gray-700"
                            : "bg-[#E5E7EB] text-gray-700 hover:bg-gray-300"
                          }
                        `}
                        style={{
                          clipPath: "polygon(20px 0, 100% 0, 100% 100%, 20px 100%, 0 50%)"
                        }}
                      >
                        Level 3
                      </button>
                    </div>

                    {/* Form Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Enter Level 1"
                            value={locationLevel1}
                            onChange={(e) => setLocationLevel1(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent transition-all"
                          />
                        </div>
                        <Button 
                          onClick={handleAddLocation}
                          className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-2.5 font-medium shadow-sm transition-all"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sr.No</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Level 1</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-28">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {locationData.map((item, index) => (
                            <tr key={item.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-50 transition-colors`}>
                              <td className="px-6 py-4 text-sm text-gray-900">{item.sNo}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{item.level1}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-3">
                                  <button 
                                    onClick={() => handleDeleteLocation(item.id)}
                                    className="p-1.5 hover:bg-red-50 rounded-md transition-colors" 
                                    title="Delete"
                                  >
                                    <X className="w-4 h-4 text-red-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : activeSetupSubTab === "project-emails" ? (
                  // Project Emails Tab
                  <>
                    {/* Form Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <input
                            type="email"
                            placeholder="Enter Email Id"
                            value={projectEmail}
                            onChange={(e) => setProjectEmail(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent transition-all"
                          />
                        </div>
                        <Button 
                          onClick={() => {
                            setEditingProjectEmailId(null);
                            handleSaveProjectEmail();
                          }}
                          className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-2.5 font-medium shadow-sm transition-all"
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sr.No</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email Id</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-28">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {projectEmailsData.map((item, index) => (
                            <tr key={item.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-50 transition-colors`}>
                              <td className="px-6 py-4 text-sm text-gray-900">{item.sNo}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{item.emailId}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-3">
                                  <button 
                                    onClick={() => handleDeleteProjectEmail(item.id)}
                                    className="p-1.5 hover:bg-red-50 rounded-md transition-colors" 
                                    title="Delete"
                                  >
                                    <X className="w-4 h-4 text-red-600" />
                                  </button>
                                  <button 
                                    onClick={() => handleEditProjectEmail(item.id)}
                                    className="p-1.5 hover:bg-gray-200 rounded-md transition-colors" 
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4 text-gray-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : activeSetupSubTab === "aging-rule" ? (
                  // Aging Rule Tab
                  <>
                    {/* Form Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <select
                            value={agingRuleType}
                            onChange={(e) => setAgingRuleType(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent transition-all"
                          >
                            <option value="">Select Rule Type</option>
                            <option value="0 - 3">0 - 3</option>
                            <option value="3 - 7">3 - 7</option>
                            <option value="7 - 14">7 - 14</option>
                            <option value="> 14">&gt; 14</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <select
                            value={agingRuleUnit}
                            onChange={(e) => setAgingRuleUnit(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent transition-all"
                          >
                            <option value="">Select Rule Unit</option>
                            <option value="Days">Days</option>
                            <option value="Hours">Hours</option>
                            <option value="Weeks">Weeks</option>
                          </select>
                        </div>
                        <div className="w-20">
                          <div 
                            className="w-full h-[42px] border-2 border-red-600 rounded-md cursor-pointer"
                            style={{ backgroundColor: agingRuleColor }}
                            onClick={() => document.getElementById('agingColorInput')?.click()}
                          />
                          <input
                            id="agingColorInput"
                            type="color"
                            value={agingRuleColor}
                            onChange={(e) => setAgingRuleColor(e.target.value)}
                            className="hidden"
                          />
                        </div>
                        <Button 
                          onClick={() => {
                            setEditingAgingRuleId(null);
                            handleSaveAgingRule();
                          }}
                          className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-2.5 font-medium shadow-sm transition-all"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sr.No</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rule</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Color</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-28">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {agingRuleData.map((item, index) => (
                            <tr key={item.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-50 transition-colors`}>
                              <td className="px-6 py-4 text-sm text-gray-900">{item.sNo}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{item.rule}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-6 h-6 rounded border border-gray-300" 
                                    style={{ backgroundColor: item.color }}
                                  ></div>
                                  <span className="text-sm text-gray-900">{item.color}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-3">
                                  <button 
                                    onClick={() => handleEditAgingRule(item.id)}
                                    className="p-1.5 hover:bg-gray-200 rounded-md transition-colors" 
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4 text-gray-600" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteAgingRule(item.id)}
                                    className="p-1.5 hover:bg-red-50 rounded-md transition-colors" 
                                    title="Delete"
                                  >
                                    <X className="w-5 h-5 text-red-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  // Other tabs - Normal Layout
                  <>
                    {/* Action Bar */}
                    <div className="flex justify-between items-center mb-6">
                      <Button
                        size="sm"
                        onClick={handleAddItem}
                        className="bg-[#C72030] hover:bg-[#A61B28] text-white font-medium shadow-sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>

                      <div className="relative">
                        <Input
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-64 focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                        />
                      </div>
                    </div>

                {/* Table */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
                  {activeSetupSubTab === "related-to" ? (
                    // Related To tab - Multi-column table
                    <table className="w-full min-w-max">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                            S.No.
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                            Issue Type
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-28">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredData.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                              No data available
                            </td>
                          </tr>
                        ) : (
                          filteredData.map((item: any, index: number) => (
                            <tr key={item.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-50 transition-colors`}>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {item.sNo}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 text-center">
                                {item.issueType}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-3">
                                  <button
                                    onClick={() => handleEditItem(item.id)}
                                    className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4 text-gray-600" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                                    title="Delete"
                                  >
                                    <X className="w-4 h-4 text-red-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  ) : (
                    // Other tabs - Simple 3-column table
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                            S.No.
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                            Issue Type
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 w-28">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredData.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                              No data available
                            </td>
                          </tr>
                        ) : (
                          filteredData.map((item: any, index: number) => (
                            <tr key={item.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-50 transition-colors`}>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {index + 1}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {item.name}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-3">
                                  <button
                                    onClick={() => handleEditItem(item.id)}
                                    className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4 text-gray-600" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                                    title="Delete"
                                  >
                                    <X className="w-4 h-4 text-red-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
                  </>
                )}
              </div>
            </TabsContent>

            {/* Assign & Escalation Setup Tab Content */}
            <TabsContent value="assign-escalation" className="p-6 mt-0">
              {/* Resolution/Response Toggle */}
              <div className="mb-6">
                <div className="flex gap-0 border-b border-gray-200">
                  <button
                    onClick={() => setAssignEscalationTab("resolution")}
                    className={`px-8 py-3 font-semibold transition-colors ${
                      assignEscalationTab === "resolution"
                        ? "border-b-2 border-[#C72030] text-[#C72030]"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Resolution
                  </button>
                  <button
                    onClick={() => setAssignEscalationTab("response")}
                    className={`px-8 py-3 font-semibold transition-colors ${
                      assignEscalationTab === "response"
                        ? "border-b-2 border-[#C72030] text-[#C72030]"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Response
                  </button>
                </div>
              </div>

              {/* Resolution Tab Content */}
              {assignEscalationTab === "resolution" && (
                <div>
                  {/* Assign Rule / Escalation Rule Toggle */}
                  <div className="mb-6">
                    <div className="flex gap-0 border-b border-gray-200">
                      <button
                        onClick={() => setAssignRuleTab("assign-rule")}
                        className={`px-8 py-3 font-medium transition-colors ${
                          assignRuleTab === "assign-rule"
                            ? "border-b-2 border-[#C72030] text-[#C72030]"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Assign Rule
                      </button>
                      <button
                        onClick={() => setAssignRuleTab("escalation-rule")}
                        className={`px-8 py-3 font-medium transition-colors ${
                          assignRuleTab === "escalation-rule"
                            ? "border-b-2 border-[#C72030] text-[#C72030]"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Escalation Rule
                      </button>
                    </div>
                  </div>

                  {/* Assign Rule Content */}
                  {assignRuleTab === "assign-rule" && (
                    <div>
                      {/* Manual/Automatic Toggle */}
                      <div className="mb-6 flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">Manual</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={assignResolutionMode === "automatic"}
                            onChange={(e) => setAssignResolutionMode(e.target.checked ? "automatic" : "manual")}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-7 bg-[#EF4444] rounded-full peer peer-checked:bg-gray-300 peer-focus:ring-2 peer-focus:ring-[#C72030] transition-all">
                            <div className={`absolute top-0.5 left-0.5 bg-white w-6 h-6 rounded-full transition-transform ${
                              assignResolutionMode === "automatic" ? "translate-x-7" : ""
                            }`}></div>
                          </div>
                        </label>
                        <span className="text-sm font-medium text-gray-700">Automatic</span>
                      </div>

                      {/* Form Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                        <div className="grid grid-cols-12 gap-4 items-end">
                          <div className="col-span-3">
                            <select 
                              value={selectedIssueType}
                              onChange={(e) => setSelectedIssueType(e.target.value)}
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                            >
                              <option value="">select</option>
                              <option value="Flat">Flat</option>
                              <option value="Common Area">Common Area</option>
                            </select>
                          </div>
                          <div className="col-span-3">
                            <select 
                              value={selectedCategoryType}
                              onChange={(e) => setSelectedCategoryType(e.target.value)}
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                            >
                              <option value="">select</option>
                              <option value="Carpentry">Carpentry</option>
                              <option value="Plumbing">Plumbing</option>
                              <option value="Electrical">Electrical</option>
                            </select>
                          </div>
                          <div className="col-span-4">
                            <select 
                              value={selectedEngineer}
                              onChange={(e) => setSelectedEngineer(e.target.value)}
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                            >
                              <option value="">select Engineer</option>
                              <option value="John Doe">John Doe</option>
                              <option value="Jane Smith">Jane Smith</option>
                              <option value="Mike Johnson">Mike Johnson</option>
                            </select>
                          </div>
                          <div className="col-span-2">
                            <Button 
                              onClick={() => toast.success("Rule submitted successfully!")}
                              className="w-full bg-[#C72030] hover:bg-[#A61C28] text-white px-6 py-2.5 font-medium shadow-sm transition-all"
                            >
                              Submit
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Filter Section */}
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-semibold text-gray-700">Filter</span>
                          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C72030]">
                            <option>Select Issue Type</option>
                            <option>Flat</option>
                            <option>Common Area</option>
                          </select>
                          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C72030]">
                            <option>Select Category Type</option>
                            <option>Carpentry</option>
                            <option>Plumbing</option>
                          </select>
                          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C72030]">
                            <option>Select Engineer</option>
                            <option>John Doe</option>
                            <option>Jane Smith</option>
                          </select>
                          <Button 
                            className="bg-[#C72030] hover:bg-[#A61C28] text-white px-6 py-2 font-medium shadow-sm"
                          >
                            Apply
                          </Button>
                          <Button 
                            className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white px-6 py-2 font-medium shadow-sm"
                          >
                            Reset
                          </Button>
                        </div>
                      </div>

                      {/* Table Section */}
                      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rule</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Issue Type</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category Type</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Service Engineer</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                No rules configured yet
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Escalation Rule Content */}
                  {assignRuleTab === "escalation-rule" && (
                    <div>
                      {/* FM/Project/Executive Escalation Toggle */}
                      <div className="mb-6">
                        <div className="flex gap-0 border-b border-gray-200">
                          <button
                            onClick={() => setExecutiveEscalationTab("fm")}
                            className={`px-8 py-3 font-medium transition-colors ${
                              executiveEscalationTab === "fm"
                                ? "border-b-2 border-[#C72030] text-[#C72030]"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            FM
                          </button>
                          <button
                            onClick={() => setExecutiveEscalationTab("project")}
                            className={`px-8 py-3 font-medium transition-colors ${
                              executiveEscalationTab === "project"
                                ? "border-b-2 border-[#C72030] text-[#C72030]"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            Project
                          </button>
                          <button
                            onClick={() => setExecutiveEscalationTab("executive-escalation")}
                            className={`px-8 py-3 font-medium transition-colors ${
                              executiveEscalationTab === "executive-escalation"
                                ? "border-b-2 border-[#C72030] text-[#C72030]"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            Executive Escalation
                          </button>
                        </div>
                      </div>

                      {/* Executive Escalation Content */}
                      {executiveEscalationTab === "executive-escalation" && (
                        <div>
                          {/* Escalation Form */}
                          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                            {/* Escalation Levels Table */}
                            <div className="overflow-x-auto">
                              <div className="min-w-[800px]">
                                {/* Table Header */}
                                <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: "120px 1fr 200px" }}>
                                  <div className="text-sm font-semibold text-gray-700">Levels</div>
                                  <div className="text-sm font-semibold text-gray-700">Escalation To</div>
                                  <div className="text-sm font-semibold text-gray-700 text-center">P1</div>
                                </div>

                                {/* Subheader for P1 time inputs */}
                                <div className="grid gap-4 mb-3" style={{ gridTemplateColumns: "120px 1fr 200px" }}>
                                  <div></div>
                                  <div></div>
                                  <div className="grid grid-cols-3 gap-2">
                                    <div className="text-xs font-medium text-gray-600 text-center">Days</div>
                                    <div className="text-xs font-medium text-gray-600 text-center">Hrs</div>
                                    <div className="text-xs font-medium text-gray-600 text-center">Min</div>
                                  </div>
                                </div>

                                {/* Table Rows - E0 to E3 */}
                                {["E0", "E1", "E2", "E3"].map((level) => (
                                  <div key={level} className="grid gap-4 mb-3" style={{ gridTemplateColumns: "120px 1fr 200px" }}>
                                    <div className="text-sm text-gray-900 font-medium flex items-center">
                                      {level}
                                    </div>
                                    <div className="flex items-center">
                                      <select 
                                        value={execEscalationLevels[level.toLowerCase() as keyof typeof execEscalationLevels]}
                                        onChange={(e) => setExecEscalationLevels({
                                          ...execEscalationLevels,
                                          [level.toLowerCase()]: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#C72030]"
                                      >
                                        <option value=""></option>
                                        <option value="Property Manager">Property Manager</option>
                                        <option value="Pravin Desai">Pravin Desai</option>
                                        <option value="Santosh Tripathi">Santosh Tripathi</option>
                                        <option value="Lalit Patil">Lalit Patil</option>
                                        <option value="Sapna Chauhan">Sapna Chauhan</option>
                                        <option value="Suresh Adhe">Suresh Adhe</option>
                                        <option value="Swapnil Patil">Swapnil Patil</option>
                                        <option value="Arun Kumar">Arun Kumar</option>
                                      </select>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                      <input
                                        type="text"
                                        placeholder="Days"
                                        value={execEscalationTimes.p1.days}
                                        onChange={(e) => setExecEscalationTimes({
                                          ...execEscalationTimes,
                                          p1: {
                                            ...execEscalationTimes.p1,
                                            days: e.target.value
                                          }
                                        })}
                                        className="w-full px-2 py-2 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#C72030]"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Hrs"
                                        value={execEscalationTimes.p1.hrs}
                                        onChange={(e) => setExecEscalationTimes({
                                          ...execEscalationTimes,
                                          p1: {
                                            ...execEscalationTimes.p1,
                                            hrs: e.target.value
                                          }
                                        })}
                                        className="w-full px-2 py-2 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#C72030]"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Min"
                                        value={execEscalationTimes.p1.min}
                                        onChange={(e) => setExecEscalationTimes({
                                          ...execEscalationTimes,
                                          p1: {
                                            ...execEscalationTimes.p1,
                                            min: e.target.value
                                          }
                                        })}
                                        className="w-full px-2 py-2 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#C72030]"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-6 text-center">
                              <Button 
                                onClick={() => toast.success("Executive escalation rule submitted successfully!")}
                                className="bg-[#C72030] hover:bg-[#A01B28] text-white px-8 py-2.5 font-medium shadow-sm transition-all"
                              >
                                Submit
                              </Button>
                            </div>
                          </div>

                          {/* Rules Display */}
                          <div className="space-y-4">
                            {executiveEscalationRules.map((rule) => (
                              <div key={rule.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="border-b border-gray-200 px-6 py-3 bg-gray-50">
                                  <h3 className="text-base font-semibold text-[#C72030]">{rule.ruleNumber}</h3>
                                </div>
                                <div className="p-6">
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="border-b border-gray-200">
                                          <th className="text-left py-3 px-4 font-semibold text-gray-700 w-32">Levels</th>
                                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Escalation To</th>
                                          <th className="text-left py-3 px-4 font-semibold text-gray-700 w-48">P1</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {rule.levels.map((levelData, idx) => (
                                          <tr key={idx} className="border-b border-gray-100 last:border-0">
                                            <td className="py-3 px-4 text-gray-900">{levelData.level}</td>
                                            <td className="py-3 px-4 text-gray-900">{levelData.escalationTo || "-"}</td>
                                            <td className="py-3 px-4 text-gray-900">{levelData.p1 || "-"}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* FM Tab Content */}
                      {executiveEscalationTab === "fm" && (
                        <div>
                          {/* Escalation Form */}
                          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div>
                                <select 
                                  value={fmEscalationIssueType}
                                  onChange={(e) => setFmEscalationIssueType(e.target.value)}
                                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                                >
                                  <option value="">Select Issue Type</option>
                                  <option value="Common Area">Common Area</option>
                                  <option value="Flat">Flat</option>
                                </select>
                              </div>
                              <div>
                                <select 
                                  value={fmEscalationCategoryType}
                                  onChange={(e) => setFmEscalationCategoryType(e.target.value)}
                                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                                >
                                  <option value="">Select Category Type</option>
                                  <option value="Civil">Civil</option>
                                  <option value="Pest Control">Pest Control</option>
                                  <option value="Horticulture">Horticulture</option>
                                  <option value="Leakage">Leakage</option>
                                </select>
                              </div>
                            </div>

                            {/* Escalation Levels Table */}
                            <div className="overflow-x-auto">
                              <div className="min-w-[1200px]">
                                {/* Table Header */}
                                <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: "80px 150px repeat(5, 1fr)" }}>
                                  <div className="text-sm font-semibold text-gray-700">Levels</div>
                                  <div className="text-sm font-semibold text-gray-700">Escalation To</div>
                                  {["P1", "P2", "P3", "P4", "P5"].map((priority) => (
                                    <div key={priority} className="text-sm font-semibold text-gray-700 text-center">
                                      {priority}
                                    </div>
                                  ))}
                                </div>

                                {/* Subheader for time inputs */}
                                <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: "80px 150px repeat(5, 1fr)" }}>
                                  <div></div>
                                  <div></div>
                                  {["P1", "P2", "P3", "P4", "P5"].map((priority) => (
                                    <div key={priority} className="grid grid-cols-3 gap-1">
                                      <div className="text-xs font-medium text-gray-600 text-center">Days</div>
                                      <div className="text-xs font-medium text-gray-600 text-center">Hrs</div>
                                      <div className="text-xs font-medium text-gray-600 text-center">Min</div>
                                    </div>
                                  ))}
                                </div>

                                {/* Table Rows */}
                                {["E1", "E2", "E3", "E4", "E5"].map((level) => (
                                  <div key={level} className="grid gap-2 mb-3" style={{ gridTemplateColumns: "80px 150px repeat(5, 1fr)" }}>
                                    <div className="text-sm text-gray-900 font-medium flex items-center">
                                      {level}
                                    </div>
                                    <div className="flex items-center">
                                      <select 
                                        value={fmEscalationLevels[level.toLowerCase() as keyof typeof fmEscalationLevels]}
                                        onChange={(e) => setFmEscalationLevels({
                                          ...fmEscalationLevels,
                                          [level.toLowerCase()]: e.target.value
                                        })}
                                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#C72030]"
                                      >
                                        <option value=""></option>
                                        <option value="Property Manager">Property Manager</option>
                                        <option value="Pravin Desai">Pravin Desai</option>
                                        <option value="Santosh Tripathi">Santosh Tripathi</option>
                                        <option value="Lalit Patil">Lalit Patil</option>
                                        <option value="Sapna Chauhan">Sapna Chauhan</option>
                                        <option value="Suresh Adhe">Suresh Adhe</option>
                                        <option value="Swapnil Patil">Swapnil Patil</option>
                                        <option value="Arun Kumar">Arun Kumar</option>
                                      </select>
                                    </div>
                                    {["p1", "p2", "p3", "p4", "p5"].map((priority) => (
                                      <div key={priority} className="grid grid-cols-3 gap-1">
                                        <input
                                          type="text"
                                          placeholder="Days"
                                          value={fmEscalationTimes[priority as keyof typeof fmEscalationTimes].days}
                                          onChange={(e) => setFmEscalationTimes({
                                            ...fmEscalationTimes,
                                            [priority]: {
                                              ...fmEscalationTimes[priority as keyof typeof fmEscalationTimes],
                                              days: e.target.value
                                            }
                                          })}
                                          className="w-full px-1 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#C72030]"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Hrs"
                                          value={fmEscalationTimes[priority as keyof typeof fmEscalationTimes].hrs}
                                          onChange={(e) => setFmEscalationTimes({
                                            ...fmEscalationTimes,
                                            [priority]: {
                                              ...fmEscalationTimes[priority as keyof typeof fmEscalationTimes],
                                              hrs: e.target.value
                                            }
                                          })}
                                          className="w-full px-1 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#C72030]"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Min"
                                          value={fmEscalationTimes[priority as keyof typeof fmEscalationTimes].min}
                                          onChange={(e) => setFmEscalationTimes({
                                            ...fmEscalationTimes,
                                            [priority]: {
                                              ...fmEscalationTimes[priority as keyof typeof fmEscalationTimes],
                                              min: e.target.value
                                            }
                                          })}
                                          className="w-full px-1 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#C72030]"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-6 text-center">
                              <Button 
                                onClick={() => toast.success("FM escalation rule submitted successfully!")}
                                className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-2.5 font-medium shadow-sm transition-all"
                              >
                                Submit
                              </Button>
                            </div>
                          </div>

                          {/* Filter Section */}
                          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6">
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-semibold text-gray-700">Filter</span>
                              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C72030]">
                                <option>Select Issue Type</option>
                                <option>Common Area</option>
                                <option>Flat</option>
                              </select>
                              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C72030]">
                                <option>Select Category Type</option>
                                <option>Civil</option>
                                <option>Pest Control</option>
                                <option>Horticulture</option>
                              </select>
                              <Button 
                                className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2 font-medium shadow-sm"
                              >
                                Apply
                              </Button>
                              <Button 
                                className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white px-6 py-2 font-medium shadow-sm"
                              >
                                Reset
                              </Button>
                            </div>
                          </div>

                          {/* Rules Display */}
                          <div className="space-y-4">
                            {fmEscalationRules.map((rule) => (
                              <div key={rule.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="border-b border-gray-200 px-6 py-3 flex justify-between items-center bg-gray-50">
                                  <h3 className="text-base font-semibold text-[#10B981]">{rule.ruleNumber}</h3>
                                  <div className="flex items-center gap-2">
                                    <button 
                                      className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                      onClick={() => toast.info("Edit functionality")}
                                    >
                                      <Edit2 className="w-4 h-4 text-[#EF6C00]" />
                                    </button>
                                    <button 
                                      className="p-1.5 hover:bg-red-50 rounded transition-colors"
                                      onClick={() => toast.error("Delete functionality")}
                                    >
                                      <X className="w-4 h-4 text-red-600" />
                                    </button>
                                  </div>
                                </div>
                                <div className="p-6">
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="border-b border-gray-200">
                                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Issue Type</th>
                                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Category Type</th>
                                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Levels</th>
                                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Escalation To</th>
                                          <th className="text-left py-3 px-4 font-semibold text-gray-700">P1</th>
                                          <th className="text-left py-3 px-4 font-semibold text-gray-700">P2</th>
                                          <th className="text-left py-3 px-4 font-semibold text-gray-700">P3</th>
                                          <th className="text-left py-3 px-4 font-semibold text-gray-700">P4</th>
                                          <th className="text-left py-3 px-4 font-semibold text-gray-700">P5</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {rule.levels.map((levelData, idx) => (
                                          <tr key={idx} className="border-b border-gray-100 last:border-0">
                                            {idx === 0 && (
                                              <>
                                                <td className="py-3 px-4 text-gray-900 align-top" rowSpan={rule.levels.length}>
                                                  {rule.issueType}
                                                </td>
                                                <td className="py-3 px-4 text-gray-900 align-top" rowSpan={rule.levels.length}>
                                                  {rule.categoryType}
                                                </td>
                                              </>
                                            )}
                                            <td className="py-3 px-4 text-gray-900">{levelData.level}</td>
                                            <td className="py-3 px-4 text-gray-900">{levelData.escalationTo}</td>
                                            <td className="py-3 px-4 text-gray-900">{levelData.p1}</td>
                                            <td className="py-3 px-4 text-gray-600">{levelData.p2 || "-"}</td>
                                            <td className="py-3 px-4 text-gray-600">{levelData.p3 || "-"}</td>
                                            <td className="py-3 px-4 text-gray-600">{levelData.p4 || "-"}</td>
                                            <td className="py-3 px-4 text-gray-600">{levelData.p5 || "-"}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Project Tab Content */}
                      {executiveEscalationTab === "project" && (
                        <div>
                          {/* Escalation Form */}
                          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div>
                                <select 
                                  value={projectEscalationIssueType}
                                  onChange={(e) => setProjectEscalationIssueType(e.target.value)}
                                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                                >
                                  <option value="">Select Issue Type</option>
                                  <option value="Common Area">Common Area</option>
                                  <option value="Flat">Flat</option>
                                </select>
                              </div>
                              <div>
                                <select 
                                  value={projectEscalationCategoryType}
                                  onChange={(e) => setProjectEscalationCategoryType(e.target.value)}
                                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                                >
                                  <option value="">Select Category Type</option>
                                  <option value="Pest Control">Pest Control</option>
                                  <option value="Horticulture">Horticulture</option>
                                  <option value="Leakage">Leakage</option>
                                </select>
                              </div>
                            </div>

                            {/* Escalation Levels Table */}
                            <div className="overflow-x-auto">
                              <div className="min-w-[1200px]">
                                {/* Table Header */}
                                <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: "80px 150px repeat(5, 1fr)" }}>
                                  <div className="text-sm font-semibold text-gray-700">Levels</div>
                                  <div className="text-sm font-semibold text-gray-700">Escalation To</div>
                                  {["P1", "P2", "P3", "P4", "P5"].map((priority) => (
                                    <div key={priority} className="text-sm font-semibold text-gray-700 text-center">
                                      {priority}
                                    </div>
                                  ))}
                                </div>

                                {/* Subheader for time inputs */}
                                <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: "80px 150px repeat(5, 1fr)" }}>
                                  <div></div>
                                  <div></div>
                                  {["P1", "P2", "P3", "P4", "P5"].map((priority) => (
                                    <div key={priority} className="grid grid-cols-3 gap-1">
                                      <div className="text-xs font-medium text-gray-600 text-center">Days</div>
                                      <div className="text-xs font-medium text-gray-600 text-center">Hrs</div>
                                      <div className="text-xs font-medium text-gray-600 text-center">Min</div>
                                    </div>
                                  ))}
                                </div>

                                {/* Table Rows */}
                                {["E1", "E2", "E3", "E4", "E5"].map((level) => (
                                  <div key={level} className="grid gap-2 mb-3" style={{ gridTemplateColumns: "80px 150px repeat(5, 1fr)" }}>
                                    <div className="text-sm text-gray-900 font-medium flex items-center">
                                      {level}
                                    </div>
                                    <div className="flex items-center">
                                      <select 
                                        value={projectEscalationLevels[level.toLowerCase() as keyof typeof projectEscalationLevels]}
                                        onChange={(e) => setProjectEscalationLevels({
                                          ...projectEscalationLevels,
                                          [level.toLowerCase()]: e.target.value
                                        })}
                                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#C72030]"
                                      >
                                        <option value=""></option>
                                        <option value="Property Manager">Property Manager</option>
                                        <option value="Pravin Desai">Pravin Desai</option>
                                        <option value="Santosh Tripathi">Santosh Tripathi</option>
                                        <option value="Lalit Patil">Lalit Patil</option>
                                        <option value="Imran Hashmi">Imran Hashmi</option>
                                        <option value="Swapnil Patil">Swapnil Patil</option>
                                      </select>
                                    </div>
                                    {["p1", "p2", "p3", "p4", "p5"].map((priority) => (
                                      <div key={priority} className="grid grid-cols-3 gap-1">
                                        <input
                                          type="text"
                                          placeholder="Days"
                                          value={projectEscalationTimes[priority as keyof typeof projectEscalationTimes].days}
                                          onChange={(e) => setProjectEscalationTimes({
                                            ...projectEscalationTimes,
                                            [priority]: {
                                              ...projectEscalationTimes[priority as keyof typeof projectEscalationTimes],
                                              days: e.target.value
                                            }
                                          })}
                                          className="w-full px-1 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#C72030]"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Hrs"
                                          value={projectEscalationTimes[priority as keyof typeof projectEscalationTimes].hrs}
                                          onChange={(e) => setProjectEscalationTimes({
                                            ...projectEscalationTimes,
                                            [priority]: {
                                              ...projectEscalationTimes[priority as keyof typeof projectEscalationTimes],
                                              hrs: e.target.value
                                            }
                                          })}
                                          className="w-full px-1 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#C72030]"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Min"
                                          value={projectEscalationTimes[priority as keyof typeof projectEscalationTimes].min}
                                          onChange={(e) => setProjectEscalationTimes({
                                            ...projectEscalationTimes,
                                            [priority]: {
                                              ...projectEscalationTimes[priority as keyof typeof projectEscalationTimes],
                                              min: e.target.value
                                            }
                                          })}
                                          className="w-full px-1 py-1.5 border border-gray-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#C72030]"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-6 text-center">
                              <Button 
                                onClick={() => toast.success("Project escalation rule submitted successfully!")}
                                className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-2.5 font-medium shadow-sm transition-all"
                              >
                                Submit
                              </Button>
                            </div>
                          </div>

                          {/* Filter Section */}
                          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6">
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-semibold text-gray-700">Filter</span>
                              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C72030]">
                                <option>Select Issue Type</option>
                                <option>Common Area</option>
                                <option>Flat</option>
                              </select>
                              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C72030]">
                                <option>Select Category Type</option>
                                <option>Pest Control</option>
                                <option>Horticulture</option>
                              </select>
                              <Button 
                                className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2 font-medium shadow-sm"
                              >
                                Apply
                              </Button>
                              <Button 
                                className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white px-6 py-2 font-medium shadow-sm"
                              >
                                Reset
                              </Button>
                            </div>
                          </div>

                          {/* No Result Found State */}
                          <div className="flex flex-col items-center justify-center py-12">
                            <div className="text-gray-400 mb-4">
                              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
                                <path d="M40 50 L50 60 L40 70" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3"/>
                                <rect x="55" y="45" width="30" height="30" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
                                <circle cx="85" cy="85" r="15" stroke="currentColor" strokeWidth="3" fill="none"/>
                                <line x1="96" y1="96" x2="110" y2="110" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                              </svg>
                            </div>
                            <p className="text-xl font-medium text-gray-600 mb-1">No Result Found</p>
                            <p className="text-sm text-gray-400">Powered by</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Response Tab Content */}
              {assignEscalationTab === "response" && (
                <div>
                  {/* FM/Project Toggle */}
                  <div className="mb-6">
                    <div className="flex gap-0 border-b border-gray-200">
                      <button
                        onClick={() => setResponseTab("fm")}
                        className={`px-8 py-3 font-medium transition-colors ${
                          responseTab === "fm"
                            ? "border-b-2 border-[#C72030] text-[#C72030]"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        FM
                      </button>
                      <button
                        onClick={() => setResponseTab("project")}
                        className={`px-8 py-3 font-medium transition-colors ${
                          responseTab === "project"
                            ? "border-b-2 border-[#C72030] text-[#C72030]"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Project
                      </button>
                    </div>
                  </div>

                  {/* FM Tab Content */}
                  {responseTab === "fm" && (
                    <div>
                      {/* Escalation Form */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <select 
                              value={escalationIssueType}
                              onChange={(e) => setEscalationIssueType(e.target.value)}
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                            >
                              <option value="">Select Issue Type</option>
                              <option value="Common Area">Common Area</option>
                              <option value="Flat">Flat</option>
                            </select>
                          </div>
                          <div>
                            <select 
                              value={escalationCategoryType}
                              onChange={(e) => setEscalationCategoryType(e.target.value)}
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                            >
                              <option value="">Select Category Type</option>
                              <option value="Pest Control">Pest Control</option>
                              <option value="Horticulture">Horticulture</option>
                            </select>
                          </div>
                        </div>

                        {/* Escalation Levels */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-6 gap-4 items-center">
                            <div className="col-span-1 text-sm font-semibold text-gray-700">Levels</div>
                            <div className="col-span-5 text-sm font-semibold text-gray-700">Escalation To</div>
                          </div>

                          {["e1", "e2", "e3", "e4", "e5"].map((level) => (
                            <div key={level} className="grid grid-cols-6 gap-4 items-center">
                              <div className="col-span-1 text-sm text-gray-900 font-medium">
                                {level.toUpperCase()}
                              </div>
                              <div className="col-span-5">
                                <select 
                                  value={escalationLevels[level as keyof typeof escalationLevels]}
                                  onChange={(e) => setEscalationLevels({
                                    ...escalationLevels,
                                    [level]: e.target.value
                                  })}
                                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                                >
                                  <option value=""></option>
                                  <option value="Property Manager">Property Manager</option>
                                  <option value="Pravin Desai">Pravin Desai</option>
                                  <option value="Santosh Tripathi">Santosh Tripathi</option>
                                  <option value="Lalit Patil">Lalit Patil</option>
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6 text-center">
                          <Button 
                            onClick={() => toast.success("Escalation rule submitted successfully!")}
                            className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-2.5 font-medium shadow-sm transition-all"
                          >
                            Submit
                          </Button>
                        </div>
                      </div>

                      {/* Filter Section */}
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-semibold text-gray-700">Filter</span>
                          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C72030]">
                            <option>Select Issue Type</option>
                            <option>Common Area</option>
                            <option>Flat</option>
                          </select>
                          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C72030]">
                            <option>Select Category Type</option>
                            <option>Pest Control</option>
                            <option>Horticulture</option>
                          </select>
                          <Button 
                            className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2 font-medium shadow-sm"
                          >
                            Apply
                          </Button>
                          <Button 
                            className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white px-6 py-2 font-medium shadow-sm"
                          >
                            Reset
                          </Button>
                        </div>
                      </div>

                      {/* No rules message for FM tab (empty state as shown in image 2) */}
                    </div>
                  )}

                  {/* Project Tab Content */}
                  {responseTab === "project" && (
                    <div>
                      {/* Escalation Form */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <select 
                              value={escalationIssueType}
                              onChange={(e) => setEscalationIssueType(e.target.value)}
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                            >
                              <option value="">Select Issue Type</option>
                              <option value="Common Area">Common Area</option>
                              <option value="Flat">Flat</option>
                            </select>
                          </div>
                          <div>
                            <select 
                              value={escalationCategoryType}
                              onChange={(e) => setEscalationCategoryType(e.target.value)}
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                            >
                              <option value="">Select Category Type</option>
                              <option value="Pest Control">Pest Control</option>
                              <option value="Horticulture">Horticulture</option>
                              <option value="Leakage">Leakage</option>
                            </select>
                          </div>
                        </div>

                        {/* Escalation Levels */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-6 gap-4 items-center">
                            <div className="col-span-1 text-sm font-semibold text-gray-700">Levels</div>
                            <div className="col-span-5 text-sm font-semibold text-gray-700">Escalation To</div>
                          </div>

                          {["e1", "e2", "e3", "e4", "e5"].map((level) => (
                            <div key={level} className="grid grid-cols-6 gap-4 items-center">
                              <div className="col-span-1 text-sm text-gray-900 font-medium">
                                {level.toUpperCase()}
                              </div>
                              <div className="col-span-5">
                                <select 
                                  value={escalationLevels[level as keyof typeof escalationLevels]}
                                  onChange={(e) => setEscalationLevels({
                                    ...escalationLevels,
                                    [level]: e.target.value
                                  })}
                                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                                >
                                  <option value=""></option>
                                  <option value="Property Manager">Property Manager</option>
                                  <option value="Pravin Desai">Pravin Desai</option>
                                  <option value="Santosh Tripathi">Santosh Tripathi</option>
                                  <option value="Lalit Patil">Lalit Patil</option>
                                  <option value="Imran Hashmi">Imran Hashmi</option>
                                  <option value="Swapnil Patil">Swapnil Patil</option>
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6 text-center">
                          <Button 
                            onClick={() => toast.success("Escalation rule submitted successfully!")}
                            className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-2.5 font-medium shadow-sm transition-all"
                          >
                            Submit
                          </Button>
                        </div>
                      </div>

                      {/* Filter Section */}
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-semibold text-gray-700">Filter</span>
                          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C72030]">
                            <option>Select Issue Type</option>
                            <option>Common Area</option>
                            <option>Flat</option>
                          </select>
                          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C72030]">
                            <option>Select Category Type</option>
                            <option>Pest Control</option>
                            <option>Horticulture</option>
                            <option>Leakage</option>
                          </select>
                          <Button 
                            className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2 font-medium shadow-sm"
                          >
                            Apply
                          </Button>
                          <Button 
                            className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white px-6 py-2 font-medium shadow-sm"
                          >
                            Reset
                          </Button>
                        </div>
                      </div>

                      {/* Rules Display for Project tab (as shown in image 1) */}
                      <div className="space-y-4">
                        {/* Rule 1 */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                          <div className="border-b border-gray-200 px-6 py-3 flex justify-between items-center">
                            <h3 className="text-base font-semibold text-[#C72030]">Rule 1</h3>
                            <div className="flex items-center gap-2">
                              <Button className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white px-4 py-1.5 text-sm font-medium">
                                Clone To Resolution
                              </Button>
                              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                                <Edit2 className="w-4 h-4 text-[#EF6C00]" />
                              </button>
                              <button className="p-1.5 hover:bg-red-50 rounded transition-colors">
                                <X className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="grid grid-cols-4 gap-6">
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Issue Type</h4>
                                <p className="text-sm text-gray-900">Common Area</p>
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Category Type</h4>
                                <p className="text-sm text-gray-900">Pest Control</p>
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Levels</h4>
                                <div className="text-sm text-gray-900 space-y-1">
                                  <p>E1</p>
                                  <p>E2</p>
                                  <p>E3</p>
                                  <p>E4</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Escalation To</h4>
                                <div className="text-sm text-gray-900 space-y-1">
                                  <p>Property Manager</p>
                                  <p>Pravin Desai</p>
                                  <p>Santosh Tripathi</p>
                                  <p>Lalit Patil</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Rule 2 */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                          <div className="border-b border-gray-200 px-6 py-3 flex justify-between items-center">
                            <h3 className="text-base font-semibold text-[#C72030]">Rule 2</h3>
                            <div className="flex items-center gap-2">
                              <Button className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white px-4 py-1.5 text-sm font-medium">
                                Clone To Resolution
                              </Button>
                              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                                <Edit2 className="w-4 h-4 text-[#EF6C00]" />
                              </button>
                              <button className="p-1.5 hover:bg-red-50 rounded transition-colors">
                                <X className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="grid grid-cols-4 gap-6">
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Issue Type</h4>
                                <p className="text-sm text-gray-900">Common Area</p>
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Category Type</h4>
                                <p className="text-sm text-gray-900">Horticulture</p>
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Levels</h4>
                                <div className="text-sm text-gray-900 space-y-1">
                                  <p>E1</p>
                                  <p>E2</p>
                                  <p>E3</p>
                                  <p>E4</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Escalation To</h4>
                                <div className="text-sm text-gray-900 space-y-1">
                                  <p>Property Manager</p>
                                  <p>Pravin Desai</p>
                                  <p>Santosh Tripathi</p>
                                  <p>Lalit Patil</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Rule 3 */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                          <div className="border-b border-gray-200 px-6 py-3 flex justify-between items-center">
                            <h3 className="text-base font-semibold text-[#C72030]">Rule 3</h3>
                            <div className="flex items-center gap-2">
                              <Button className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white px-4 py-1.5 text-sm font-medium">
                                Clone To Resolution
                              </Button>
                              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                                <Edit2 className="w-4 h-4 text-[#EF6C00]" />
                              </button>
                              <button className="p-1.5 hover:bg-red-50 rounded transition-colors">
                                <X className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="grid grid-cols-4 gap-6">
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Issue Type</h4>
                                <p className="text-sm text-gray-900">Common Area</p>
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Category Type</h4>
                                <p className="text-sm text-gray-900">Leakage</p>
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Levels</h4>
                                <div className="text-sm text-gray-900 space-y-1">
                                  <p>E1</p>
                                  <p>E2</p>
                                  <p>E3</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Escalation To</h4>
                                <div className="text-sm text-gray-900 space-y-1">
                                  <p>Property Manager</p>
                                  <p>Imran Hashmi</p>
                                  <p>Swapnil Patil</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Vendor Setup Tab Content */}
            <TabsContent value="vendor" className="p-6 mt-0">
              <div>
                {/* Header with Create Vendor Button */}
                <div className="flex justify-end mb-6">
                  <Button
                    onClick={() => {
                      setShowVendorDialog(true);
                      setEditingVendorId(null);
                      setVendorName("");
                      setVendorEmail("");
                      setVendorMobile("");
                      setVendorCompanyName("");
                      setVendorGSTIN("");
                      setVendorPAN("");
                    }}
                    className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-6 py-2.5 font-medium shadow-sm transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Vendor
                  </Button>
                </div>

                {/* Vendor Table */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sr.No.</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mobile</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Company Name</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">GSTIN Number</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">PAN Number</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendorData.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-6 py-16 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <Users className="w-16 h-16 text-gray-300 mb-4" />
                                <p className="text-lg font-medium text-gray-600 mb-1">No Vendors Added</p>
                                <p className="text-sm text-gray-400">Click "Create Vendor" to add your first vendor</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          vendorData.map((vendor, index) => (
                            <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{vendor.name}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{vendor.email}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{vendor.mobile}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{vendor.companyName}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{vendor.gstin}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{vendor.pan}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingVendorId(vendor.id);
                                      setVendorName(vendor.name);
                                      setVendorEmail(vendor.email);
                                      setVendorMobile(vendor.mobile);
                                      setVendorCompanyName(vendor.companyName);
                                      setVendorGSTIN(vendor.gstin);
                                      setVendorPAN(vendor.pan);
                                      setShowVendorDialog(true);
                                    }}
                                    className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4 text-[#EF6C00]" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm("Are you sure you want to delete this vendor?")) {
                                        setVendorData(vendorData.filter((v) => v.id !== vendor.id));
                                        toast.success("Vendor deleted successfully");
                                      }
                                    }}
                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                  >
                                    <X className="w-4 h-4 text-red-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Vendor Dialog */}
              <Dialog open={showVendorDialog} onOpenChange={setShowVendorDialog}>
                <DialogContent className="max-w-2xl bg-white rounded-lg shadow-xl">
                  <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                      {editingVendorId ? "Edit Vendor" : "Create Vendor"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vendorName" className="text-sm font-medium text-gray-700 mb-2 block">
                          Name *
                        </Label>
                        <Input
                          id="vendorName"
                          value={vendorName}
                          onChange={(e) => setVendorName(e.target.value)}
                          placeholder="Enter vendor name"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vendorEmail" className="text-sm font-medium text-gray-700 mb-2 block">
                          Email *
                        </Label>
                        <Input
                          id="vendorEmail"
                          type="email"
                          value={vendorEmail}
                          onChange={(e) => setVendorEmail(e.target.value)}
                          placeholder="Enter email address"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vendorMobile" className="text-sm font-medium text-gray-700 mb-2 block">
                          Mobile *
                        </Label>
                        <Input
                          id="vendorMobile"
                          value={vendorMobile}
                          onChange={(e) => setVendorMobile(e.target.value)}
                          placeholder="Enter mobile number"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vendorCompanyName" className="text-sm font-medium text-gray-700 mb-2 block">
                          Company Name *
                        </Label>
                        <Input
                          id="vendorCompanyName"
                          value={vendorCompanyName}
                          onChange={(e) => setVendorCompanyName(e.target.value)}
                          placeholder="Enter company name"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vendorGSTIN" className="text-sm font-medium text-gray-700 mb-2 block">
                          GSTIN Number
                        </Label>
                        <Input
                          id="vendorGSTIN"
                          value={vendorGSTIN}
                          onChange={(e) => setVendorGSTIN(e.target.value)}
                          placeholder="Enter GSTIN number"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vendorPAN" className="text-sm font-medium text-gray-700 mb-2 block">
                          PAN Number
                        </Label>
                        <Input
                          id="vendorPAN"
                          value={vendorPAN}
                          onChange={(e) => setVendorPAN(e.target.value)}
                          placeholder="Enter PAN number"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowVendorDialog(false);
                        setEditingVendorId(null);
                        setVendorName("");
                        setVendorEmail("");
                        setVendorMobile("");
                        setVendorCompanyName("");
                        setVendorGSTIN("");
                        setVendorPAN("");
                      }}
                      className="px-6"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        if (!vendorName.trim() || !vendorEmail.trim() || !vendorMobile.trim() || !vendorCompanyName.trim()) {
                          toast.error("Please fill all required fields");
                          return;
                        }

                        if (editingVendorId) {
                          setVendorData(
                            vendorData.map((vendor) =>
                              vendor.id === editingVendorId
                                ? {
                                    ...vendor,
                                    name: vendorName,
                                    email: vendorEmail,
                                    mobile: vendorMobile,
                                    companyName: vendorCompanyName,
                                    gstin: vendorGSTIN,
                                    pan: vendorPAN,
                                  }
                                : vendor
                            )
                          );
                          toast.success("Vendor updated successfully");
                        } else {
                          const newVendor = {
                            id: Date.now().toString(),
                            name: vendorName,
                            email: vendorEmail,
                            mobile: vendorMobile,
                            companyName: vendorCompanyName,
                            gstin: vendorGSTIN,
                            pan: vendorPAN,
                          };
                          setVendorData([...vendorData, newVendor]);
                          toast.success("Vendor created successfully");
                        }

                        setShowVendorDialog(false);
                        setEditingVendorId(null);
                        setVendorName("");
                        setVendorEmail("");
                        setVendorMobile("");
                        setVendorCompanyName("");
                        setVendorGSTIN("");
                        setVendorPAN("");
                      }}
                      className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-6"
                    >
                      {editingVendorId ? "Update" : "Create"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>
        </div>

        {/* Add Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-md bg-white rounded-lg shadow-xl">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Add {getSubTabLabel(activeSetupSubTab)}
                </DialogTitle>
                <button
                  onClick={() => setShowAddDialog(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="itemName" className="text-sm font-medium text-gray-700">
                  {getSubTabLabel(activeSetupSubTab)} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="itemName"
                  placeholder={`Enter ${getSubTabLabel(activeSetupSubTab)}`}
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setShowAddDialog(false);
                    setItemName("");
                  }}
                  variant="outline"
                  className="px-6 py-2 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitItem}
                  className="px-6 py-2 bg-[#C72030] hover:bg-[#A61B28] text-white"
                >
                  Add
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-md bg-white rounded-lg shadow-xl">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Edit {getSubTabLabel(activeSetupSubTab)}
                </DialogTitle>
                <button
                  onClick={() => {
                    setShowEditDialog(false);
                    setItemName("");
                    setEditingItemId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="editItemName" className="text-sm font-medium text-gray-700">
                  {getSubTabLabel(activeSetupSubTab)} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="editItemName"
                  placeholder={`Enter ${getSubTabLabel(activeSetupSubTab)}`}
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setShowEditDialog(false);
                    setItemName("");
                    setEditingItemId(null);
                  }}
                  variant="outline"
                  className="px-6 py-2 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateItem}
                  className="px-6 py-2 bg-[#C72030] hover:bg-[#A61B28] text-white"
                >
                  Update
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Category Edit/Add Dialog */}
        <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
          <DialogContent className="max-w-2xl bg-white rounded-lg shadow-xl">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {editingCategoryId ? "Edit Category" : "Add Category"}
                </DialogTitle>
                <button
                  onClick={() => {
                    setShowCategoryDialog(false);
                    setCategoryIssueType("");
                    setCategoryName("");
                    setCategoryFmTime("");
                    setCategoryProjectTime("");
                    setEditingCategoryId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="catIssueType" className="text-sm font-medium text-gray-700">
                    Issue Type <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="catIssueType"
                    value={categoryIssueType}
                    onChange={(e) => setCategoryIssueType(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  >
                    <option value="">Select Issue Type</option>
                    <option value="Flat">Flat</option>
                    <option value="Common Area">Common Area</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="catName" className="text-sm font-medium text-gray-700">
                    Category Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="catName"
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="catFmTime" className="text-sm font-medium text-gray-700">
                    FM Response Time (Min) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="catFmTime"
                    type="number"
                    placeholder="Enter time"
                    value={categoryFmTime}
                    onChange={(e) => setCategoryFmTime(e.target.value)}
                    className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="catProjectTime" className="text-sm font-medium text-gray-700">
                    Project Response Time (Min)
                  </Label>
                  <Input
                    id="catProjectTime"
                    type="number"
                    placeholder="Enter time"
                    value={categoryProjectTime}
                    onChange={(e) => setCategoryProjectTime(e.target.value)}
                    className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setShowCategoryDialog(false);
                    setCategoryIssueType("");
                    setCategoryName("");
                    setCategoryFmTime("");
                    setCategoryProjectTime("");
                    setEditingCategoryId(null);
                  }}
                  variant="outline"
                  className="px-6 py-2 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveCategory}
                  className="px-6 py-2 bg-[#C72030] hover:bg-[#A61B28] text-white"
                >
                  {editingCategoryId ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Sub Category Edit/Add Dialog */}
        <Dialog open={showSubCategoryDialog} onOpenChange={setShowSubCategoryDialog}>
          <DialogContent className="max-w-2xl bg-white rounded-lg shadow-xl">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {editingSubCategoryId ? "Edit Sub Category" : "Add Sub Category"}
                </DialogTitle>
                <button
                  onClick={() => {
                    setShowSubCategoryDialog(false);
                    setSubCategoryIssueType("");
                    setSubCategoryType("");
                    setSubCategoryName("");
                    setSubCategoryText("");
                    setEditingSubCategoryId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subCatIssueType" className="text-sm font-medium text-gray-700">
                    Issue Type <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="subCatIssueType"
                    value={subCategoryIssueType}
                    onChange={(e) => setSubCategoryIssueType(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  >
                    <option value="">Select Issue Type</option>
                    <option value="Flat">Flat</option>
                    <option value="Common Area">Common Area</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subCatType" className="text-sm font-medium text-gray-700">
                    Category Type <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="subCatType"
                    value={subCategoryType}
                    onChange={(e) => setSubCategoryType(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Civil">Civil</option>
                    <option value="Leakage">Leakage</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subCatName" className="text-sm font-medium text-gray-700">
                    Sub Category <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="subCatName"
                    placeholder="Enter sub category"
                    value={subCategoryName}
                    onChange={(e) => setSubCategoryName(e.target.value)}
                    className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subCatText" className="text-sm font-medium text-gray-700">
                    Helpdesk Text
                  </Label>
                  <Input
                    id="subCatText"
                    placeholder="Enter text"
                    value={subCategoryText}
                    onChange={(e) => setSubCategoryText(e.target.value)}
                    className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setShowSubCategoryDialog(false);
                    setSubCategoryIssueType("");
                    setSubCategoryType("");
                    setSubCategoryName("");
                    setSubCategoryText("");
                    setEditingSubCategoryId(null);
                  }}
                  variant="outline"
                  className="px-6 py-2 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveSubCategory}
                  className="px-6 py-2 bg-[#C72030] hover:bg-[#A61B28] text-white"
                >
                  {editingSubCategoryId ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Status Edit Dialog */}
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent className="max-w-2xl bg-white rounded-lg shadow-xl">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {editingStatusId ? "Edit Status" : "Add Status"}
                </DialogTitle>
                <button
                  onClick={() => {
                    setShowStatusDialog(false);
                    setStatusOrder("");
                    setStatusName("");
                    setStatusFixedState("");
                    setStatusColor("#000000");
                    setEditingStatusId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="statusName" className="text-sm font-medium text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="statusName"
                    placeholder="Enter status"
                    value={statusName}
                    onChange={(e) => setStatusName(e.target.value)}
                    className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statusFixedState" className="text-sm font-medium text-gray-700">
                    Fixed State
                  </Label>
                  <select
                    id="statusFixedState"
                    value={statusFixedState}
                    onChange={(e) => setStatusFixedState(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  >
                    <option value="">Select Fixed State</option>
                    <option value="Complete">Complete</option>
                    <option value="Closed">Closed</option>
                    <option value="Reopen">Reopen</option>
                    <option value="Customer Action Pending">Customer Action Pending</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statusOrder" className="text-sm font-medium text-gray-700">
                    Order <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="statusOrder"
                    type="number"
                    placeholder="Enter order"
                    value={statusOrder}
                    onChange={(e) => setStatusOrder(e.target.value)}
                    className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statusColor" className="text-sm font-medium text-gray-700">
                    Color <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="statusColor"
                      type="color"
                      value={statusColor}
                      onChange={(e) => setStatusColor(e.target.value)}
                      className="h-10 w-20 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <Input
                      value={statusColor}
                      onChange={(e) => setStatusColor(e.target.value)}
                      className="flex-1 focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setShowStatusDialog(false);
                    setStatusOrder("");
                    setStatusName("");
                    setStatusFixedState("");
                    setStatusColor("#000000");
                    setEditingStatusId(null);
                  }}
                  variant="outline"
                  className="px-6 py-2 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveStatus}
                  className="px-6 py-2 bg-[#C72030] hover:bg-[#A61B28] text-white"
                >
                  {editingStatusId ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Complaint Mode Edit Dialog */}
        <Dialog open={showComplaintModeDialog} onOpenChange={setShowComplaintModeDialog}>
          <DialogContent className="max-w-md bg-white rounded-lg shadow-xl">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {editingComplaintModeId ? "Edit Complaint Mode" : "Add Complaint Mode"}
                </DialogTitle>
                <button
                  onClick={() => {
                    setShowComplaintModeDialog(false);
                    setComplaintModeName("");
                    setEditingComplaintModeId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="complaintMode" className="text-sm font-medium text-gray-700">
                  Complaint Mode <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="complaintMode"
                  placeholder="Enter complaint mode"
                  value={complaintModeName}
                  onChange={(e) => setComplaintModeName(e.target.value)}
                  className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setShowComplaintModeDialog(false);
                    setComplaintModeName("");
                    setEditingComplaintModeId(null);
                  }}
                  variant="outline"
                  className="px-6 py-2 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveComplaintMode}
                  className="px-6 py-2 bg-[#C72030] hover:bg-[#A61B28] text-white"
                >
                  {editingComplaintModeId ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Project Email Edit Dialog */}
        <Dialog open={showProjectEmailDialog} onOpenChange={setShowProjectEmailDialog}>
          <DialogContent className="max-w-md bg-white rounded-lg shadow-xl">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {editingProjectEmailId ? "Edit Project Email" : "Add Project Email"}
                </DialogTitle>
                <button
                  onClick={() => {
                    setShowProjectEmailDialog(false);
                    setProjectEmail("");
                    setEditingProjectEmailId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectEmail" className="text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="projectEmail"
                  type="email"
                  placeholder="Enter email address"
                  value={projectEmail}
                  onChange={(e) => setProjectEmail(e.target.value)}
                  className="w-full focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setShowProjectEmailDialog(false);
                    setProjectEmail("");
                    setEditingProjectEmailId(null);
                  }}
                  variant="outline"
                  className="px-6 py-2 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProjectEmail}
                  className="px-6 py-2 bg-[#C72030] hover:bg-[#A61B28] text-white"
                >
                  {editingProjectEmailId ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Aging Rule Edit Dialog */}
        <Dialog open={showAgingRuleDialog} onOpenChange={setShowAgingRuleDialog}>
          <DialogContent className="max-w-md bg-white rounded-lg shadow-xl">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Edit Aging Rule Color
                </DialogTitle>
                <button
                  onClick={() => {
                    setShowAgingRuleDialog(false);
                    setAgingRuleColor("#000000");
                    setEditingAgingRuleId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agingColor" className="text-sm font-medium text-gray-700">
                  Color <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    id="agingColor"
                    type="color"
                    value={agingRuleColor}
                    onChange={(e) => setAgingRuleColor(e.target.value)}
                    className="h-10 w-20 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <Input
                    value={agingRuleColor}
                    onChange={(e) => setAgingRuleColor(e.target.value)}
                    className="flex-1 focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setShowAgingRuleDialog(false);
                    setAgingRuleColor("#000000");
                    setEditingAgingRuleId(null);
                  }}
                  variant="outline"
                  className="px-6 py-2 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveAgingRule}
                  className="px-6 py-2 bg-[#C72030] hover:bg-[#A61B28] text-white"
                >
                  Update
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default HelpdeskSetupDashboard;
