import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  ticketManagementAPI, 
  TicketFilters, 
  CategoryOption, 
  SubcategoryOption, 
  DepartmentOption, 
  SiteOption, 
  UnitOption, 
  StatusOption, 
  UserOption 
} from '@/services/ticketManagementAPI';

interface TicketsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: TicketFilters) => void;
}

const priorityOptions = [
  { value: 'p1', label: 'P1 - Critical' },
  { value: 'p2', label: 'P2 - Very High' },
  { value: 'p3', label: 'P3 - High' },
  { value: 'p4', label: 'P4 - Medium' },
  { value: 'p5', label: 'P5 - Low' }
];

export const TicketsFilterDialog = ({ isOpen, onClose, onApplyFilters }: TicketsFilterDialogProps) => {
  const { toast } = useToast();
  
  // Filter state
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [site, setSite] = useState('');
  const [unit, setUnit] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Data state
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryOption[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [sites, setSites] = useState<SiteOption[]>([]);
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [statuses, setStatuses] = useState<StatusOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);

  // Common field styles
  const commonFieldStyles = "h-10 rounded-md border border-[hsl(var(--analytics-border))] bg-white";

  // Load data when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadFilterData();
    }
  }, [isOpen]);

  const loadFilterData = async () => {
    try {
      const [
        categoriesData,
        subcategoriesData,
        departmentsData,
        sitesData,
        unitsData,
        statusesData,
        usersData
      ] = await Promise.all([
        ticketManagementAPI.getHelpdeskCategories(),
        ticketManagementAPI.getHelpdeskSubcategories(),
        ticketManagementAPI.getDepartments(),
        ticketManagementAPI.getAllSites(),
        ticketManagementAPI.getUnits(),
        ticketManagementAPI.getComplaintStatuses(),
        ticketManagementAPI.getFMUsers(),
      ]);

      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
      setDepartments(departmentsData);
      setSites(sitesData);
      setUnits(unitsData);
      setStatuses(statusesData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading filter data:', error);
      toast({
        title: "Error",
        description: "Failed to load filter options.",
        variant: "destructive",
      });
    }
  };

  // Filter subcategories based on selected category
  const filteredSubcategories = subcategories.filter(sub => 
    !category || sub.category_id === Number(category)
  );

  const handleSubmit = () => {
    const filters: TicketFilters = {};

    // Build date range
    if (dateFrom && dateTo) {
      filters.date_range = `${dateFrom}+-+${dateTo}`;
    }

    // Add other filters
    if (category) filters.category_type_id_eq = Number(category);
    if (subCategory) filters.sub_category_id_eq = Number(subCategory);
    if (department) filters.dept_id_eq = Number(department);
    if (site) filters.site_id_eq = Number(site);
    if (unit) filters.unit_id_eq = Number(unit);
    if (status) filters.issue_status_in = [Number(status)];
    if (priority) filters.priority_eq = priority;
    if (assignedUser) filters.assigned_to_in = [Number(assignedUser)];
    if (userSearch) filters.user_firstname_or_user_lastname_cont = userSearch;

    console.log('Applying filters:', filters);
    onApplyFilters(filters);
    toast({
      title: "Success",
      description: "Filters applied successfully!",
    });
    onClose();
  };

  const handleReset = () => {
    setDateFrom('');
    setDateTo('');
    setCategory('');
    setSubCategory('');
    setDepartment('');
    setSite('');
    setUnit('');
    setStatus('');
    setPriority('');
    setAssignedUser('');
    setUserSearch('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-xl font-bold text-[hsl(var(--analytics-text))]">FILTER BY</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Range Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[hsl(var(--analytics-text))]">Date Range</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateFrom" className="text-sm font-medium text-[hsl(var(--analytics-text))]">
                  Date From
                </Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className={commonFieldStyles}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo" className="text-sm font-medium text-[hsl(var(--analytics-text))]">
                  Date To
                </Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className={commonFieldStyles}
                />
              </div>
            </div>
          </div>

          {/* Filter Options Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[hsl(var(--analytics-text))]">Filter Options</h3>
            <div className="grid grid-cols-3 gap-4">
              {/* Category */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[hsl(var(--analytics-text))]">Category</Label>
                <Select value={category} onValueChange={(value) => {
                  setCategory(value);
                  setSubCategory(''); // Reset subcategory when category changes
                }}>
                  <SelectTrigger className={commonFieldStyles}>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[hsl(var(--analytics-border))] max-h-60">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sub Category */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[hsl(var(--analytics-text))]">Sub Category</Label>
                <Select value={subCategory} onValueChange={setSubCategory} disabled={!category}>
                  <SelectTrigger className={commonFieldStyles}>
                    <SelectValue placeholder="Select Sub Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[hsl(var(--analytics-border))] max-h-60">
                    {filteredSubcategories.map((subcat) => (
                      <SelectItem key={subcat.id} value={subcat.id.toString()}>
                        {subcat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[hsl(var(--analytics-text))]">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className={commonFieldStyles}>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[hsl(var(--analytics-border))] max-h-60">
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.department_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Site */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[hsl(var(--analytics-text))]">Site</Label>
                <Select value={site} onValueChange={setSite}>
                  <SelectTrigger className={commonFieldStyles}>
                    <SelectValue placeholder="Select Site" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[hsl(var(--analytics-border))] max-h-60">
                    {sites.map((siteItem) => (
                      <SelectItem key={siteItem.id} value={siteItem.id.toString()}>
                        {siteItem.site_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Unit */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[hsl(var(--analytics-text))]">Unit</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className={commonFieldStyles}>
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[hsl(var(--analytics-border))] max-h-60">
                    {units.map((unitItem) => (
                      <SelectItem key={unitItem.id} value={unitItem.id.toString()}>
                        {unitItem.unit_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[hsl(var(--analytics-text))]">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className={commonFieldStyles}>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[hsl(var(--analytics-border))] max-h-60">
                    {statuses.map((statusItem) => (
                      <SelectItem key={statusItem.id} value={statusItem.id.toString()}>
                        {statusItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[hsl(var(--analytics-text))]">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className={commonFieldStyles}>
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[hsl(var(--analytics-border))] max-h-60">
                    {priorityOptions.map((priorityItem) => (
                      <SelectItem key={priorityItem.value} value={priorityItem.value}>
                        {priorityItem.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Assigned User */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[hsl(var(--analytics-text))]">Assigned User</Label>
                <Select value={assignedUser} onValueChange={setAssignedUser}>
                  <SelectTrigger className={commonFieldStyles}>
                    <SelectValue placeholder="Select Assigned User" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-[hsl(var(--analytics-border))] max-h-60">
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* User Search */}
              <div className="space-y-2">
                <Label htmlFor="userSearch" className="text-sm font-medium text-[hsl(var(--analytics-text))]">
                  Search User
                </Label>
                <Input
                  id="userSearch"
                  type="text"
                  placeholder="Search by user name"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className={commonFieldStyles}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="text-[hsl(var(--analytics-text))] border-[hsl(var(--analytics-border))]"
            >
              Reset
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-[hsl(var(--analytics-primary))] hover:bg-[hsl(var(--analytics-primary))]/90 text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
