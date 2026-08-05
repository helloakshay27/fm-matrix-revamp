import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  ticketManagementAPI,
  TicketFilters,
  CategoryOption,
  SubcategoryOption,
  DepartmentOption,
  SiteOption,
  UnitOption,
  StatusOption,
  UserOption,
} from "@/services/ticketManagementAPI";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  TextField,
} from "@mui/material";

interface TicketsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: TicketFilters) => void;
}

const priorityOptions = [
  { value: "p1", label: "P1 - Critical" },
  { value: "p2", label: "P2 - Very High" },
  { value: "p3", label: "P3 - High" },
  { value: "p4", label: "P4 - Medium" },
  { value: "p5", label: "P5 - Low" },
];

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px 12px", sm: "10px 14px", md: "12px 14px" },
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

export const TicketsFilterDialog = ({
  isOpen,
  onClose,
  onApplyFilters,
}: TicketsFilterDialogProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [department, setDepartment] = useState("");
  const [site, setSite] = useState("");
  const [unit, setUnit] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [filtersCleared, setFiltersCleared] = useState(false);

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryOption[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [sites, setSites] = useState<SiteOption[]>([]);
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [statuses, setStatuses] = useState<StatusOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadFilterData();
      setFiltersCleared(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const allFiltersEmpty =
      !dateFrom &&
      !dateTo &&
      !category &&
      !subCategory &&
      !department &&
      !site &&
      !unit &&
      !status &&
      !priority &&
      !assignedUser &&
      !userSearch;

    setFiltersCleared(allFiltersEmpty);
  }, [
    dateFrom,
    dateTo,
    category,
    subCategory,
    department,
    site,
    unit,
    status,
    priority,
    assignedUser,
    userSearch,
  ]);

  useEffect(() => {
    const loadSubCategories = async () => {
      if (category) {
        try {
          const subcategoriesData =
            await ticketManagementAPI.getSubCategoriesByCategory(
              Number(category)
            );
          setSubcategories(
            subcategoriesData.map((sub) => ({
              id: sub.id,
              name: sub.name,
              category_id: sub.helpdesk_category_id,
            }))
          );
        } catch (error) {
          console.error("Error loading subcategories:", error);
          toast({
            title: "Error",
            description: "Failed to load subcategories.",
            variant: "destructive",
          });
        }
      } else {
        setSubcategories([]);
      }
    };

    loadSubCategories();
  }, [category]);

  const loadFilterData = async () => {
    try {
      const [
        categoriesData,
        departmentsData,
        sitesData,
        unitsData,
        statusesData,
        usersData,
      ] = await Promise.all([
        ticketManagementAPI.getHelpdeskCategories(),
        ticketManagementAPI.getDepartments(),
        ticketManagementAPI.getAllSites(),
        ticketManagementAPI.getUnits(),
        ticketManagementAPI.getComplaintStatuses(),
        ticketManagementAPI.getFMUsers(),
      ]);

      setCategories(categoriesData);
      setDepartments(departmentsData);
      setSites(sitesData);
      setUnits(unitsData);
      setStatuses(statusesData);
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading filter data:", error);
      toast({
        title: "Error",
        description: "Failed to load filter options.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = () => {
    if ((dateFrom && !dateTo) || (!dateFrom && dateTo)) {
      toast({
        title: "Validation Error",
        description:
          "Please select both 'Date From' and 'Date To' for the date range.",
        variant: "destructive",
      });
      return;
    }

    const filters: TicketFilters = {};

    if (dateFrom && dateTo) {
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
      };

      filters.date_range = `${formatDate(dateFrom)} - ${formatDate(dateTo)}`;
    }

    if (category) filters.category_type_id_eq = Number(category);
    if (subCategory) filters.sub_category_id_eq = Number(subCategory);
    if (department) filters.dept_id_eq = Number(department);
    if (site) filters.site_id_eq = Number(site);
    if (unit) filters.unit_id_eq = Number(unit);
    if (status) filters.issue_status_in = [Number(status)];
    if (priority) filters.priority_eq = priority;
    if (assignedUser) filters.assigned_to_in = [Number(assignedUser)];
    if (userSearch) filters.user_firstname_or_user_lastname_cont = userSearch;

    onApplyFilters(filters);
    toast({
      title: "Success",
      description: "Filters applied successfully!",
    });
    onClose();
  };

  const handleReset = () => {
    if (filtersCleared) {
      toast({
        title: "Redirecting",
        description: "Navigating to tickets list page...",
      });
      onClose();
      navigate("/maintenance/ticket");
      return;
    }

    setDateFrom("");
    setDateTo("");
    setCategory("");
    setSubCategory("");
    setDepartment("");
    setSite("");
    setUnit("");
    setStatus("");
    setPriority("");
    setAssignedUser("");
    setUserSearch("");
    onApplyFilters({});

    toast({
      title: "Filters Cleared",
      description: "All filters have been cleared.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent
        className="w-full sm:max-w-[700px] bg-white overflow-visible max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => {
          if (
            (e.target as HTMLElement).closest(
              ".MuiPopover-root, .MuiModal-root, .MuiMenu-root"
            )
          ) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if (
            (e.target as HTMLElement).closest(
              ".MuiPopover-root, .MuiModal-root, .MuiMenu-root"
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Filters</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <TextField
            label="Date From"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            fullWidth
            variant="outlined"
            sx={fieldStyles}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Date To"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            fullWidth
            variant="outlined"
            sx={fieldStyles}
            InputLabelProps={{ shrink: true }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-2">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="ticket-filter-category-label">Category</InputLabel>
            <MuiSelect
              labelId="ticket-filter-category-label"
              label="Category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as string);
                setSubCategory("");
              }}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="">
                <em>Select Category</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="ticket-filter-subcategory-label">
              Sub Category
            </InputLabel>
            <MuiSelect
              labelId="ticket-filter-subcategory-label"
              label="Sub Category"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value as string)}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
              disabled={!category}
            >
              <MenuItem value="">
                <em>Select Sub Category</em>
              </MenuItem>
              {subcategories.map((subcat) => (
                <MenuItem key={subcat.id} value={subcat.id.toString()}>
                  {subcat.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="ticket-filter-department-label">
              Department
            </InputLabel>
            <MuiSelect
              labelId="ticket-filter-department-label"
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value as string)}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="">
                <em>Select Department</em>
              </MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id.toString()}>
                  {dept.department_name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="ticket-filter-site-label">Site</InputLabel>
            <MuiSelect
              labelId="ticket-filter-site-label"
              label="Site"
              value={site}
              onChange={(e) => setSite(e.target.value as string)}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="">
                <em>Select Site</em>
              </MenuItem>
              {sites.map((siteItem) => (
                <MenuItem key={siteItem.id} value={siteItem.id.toString()}>
                  {siteItem.name || siteItem.site_name || `Site ${siteItem.id}`}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="ticket-filter-unit-label">Unit</InputLabel>
            <MuiSelect
              labelId="ticket-filter-unit-label"
              label="Unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value as string)}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="">
                <em>Select Unit</em>
              </MenuItem>
              {units.map((unitItem) => (
                <MenuItem key={unitItem.id} value={unitItem.id.toString()}>
                  {unitItem.unit_name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="ticket-filter-status-label">Status</InputLabel>
            <MuiSelect
              labelId="ticket-filter-status-label"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as string)}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="">
                <em>Select Status</em>
              </MenuItem>
              {statuses.map((statusItem) => (
                <MenuItem key={statusItem.id} value={statusItem.id.toString()}>
                  {statusItem.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="ticket-filter-priority-label">Priority</InputLabel>
            <MuiSelect
              labelId="ticket-filter-priority-label"
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as string)}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="">
                <em>Select Priority</em>
              </MenuItem>
              {priorityOptions.map((priorityItem) => (
                <MenuItem key={priorityItem.value} value={priorityItem.value}>
                  {priorityItem.label}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="ticket-filter-assigned-label">
              Assigned User
            </InputLabel>
            <MuiSelect
              labelId="ticket-filter-assigned-label"
              label="Assigned User"
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value as string)}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="">
                <em>Select Assigned User</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <TextField
            label="Search User"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            fullWidth
            variant="outlined"
            sx={fieldStyles}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            className="bg-brand hover:bg-brand-hover text-white px-8 w-full sm:w-auto"
          >
            APPLY
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-brand text-brand px-8 w-full sm:w-auto"
          >
            {filtersCleared ? "GO TO LIST" : "RESET"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
