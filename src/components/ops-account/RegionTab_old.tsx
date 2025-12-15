import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useApiConfig } from "@/hooks/useApiConfig";
import { getUser } from "@/utils/auth";

interface RegionTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  entriesPerPage: string;
  setEntriesPerPage: (entries: string) => void;
}

export const RegionTab: React.FC<RegionTabProps> = ({
  searchQuery,
  setSearchQuery,
  entriesPerPage,
  setEntriesPerPage,
}) => {
  const { getFullUrl, getAuthHeader } = useApiConfig();

  // Region state
  const [regions, setRegions] = useState<any[]>([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [isAddRegionOpen, setIsAddRegionOpen] = useState(false);
  const [isEditRegionOpen, setIsEditRegionOpen] = useState(false);
  const [newRegionData, setNewRegionData] = useState({
    name: "",
    company_id: "",
    headquarter_id: "",
  });
  const [editRegionData, setEditRegionData] = useState({
    id: "",
    name: "",
    company_id: "",
    headquarter_id: "",
  });

  // Maps for displaying related data
  const [companiesMap, setCompaniesMap] = useState<Map<number, string>>(
    new Map()
  );
  const [headquartersMap, setHeadquartersMap] = useState<Map<number, string>>(
    new Map()
  );
  const [companiesDropdown, setCompaniesDropdown] = useState<any[]>([]);
  const [headquartersDropdown, setHeadquartersDropdown] = useState<any[]>([]);
  const [canEditRegion, setCanEditRegion] = useState(false);

  const user = getUser() || {
    id: 0,
    firstname: "Guest",
    lastname: "",
    email: "",
  };

  const checkEditPermission = () => {
    const userEmail = user.email || "";
    const allowedEmails = [
      "abhishek.sharma@lockated.com",
      "adhip.shetty@lockated.com",
      "helloakshay27@gmail.com",
    ];
    setCanEditRegion(allowedEmails.includes(userEmail));
  };

  useEffect(() => {
    fetchRegions();
    fetchCompanies();
    fetchHeadquarters();
    checkEditPermission();
  }, []);

  // Separate filtered companies for add and edit modes
  const [filteredCompaniesAdd, setFilteredCompaniesAdd] = useState<any[]>([]);
  const [filteredCompaniesEdit, setFilteredCompaniesEdit] = useState<any[]>([]);

  // Filter companies based on selected headquarter (country) for ADD mode
  useEffect(() => {
    if (newRegionData.headquarter_id) {
      const filtered = companiesDropdown.filter(
        (company) =>
          company.country_id === parseInt(newRegionData.headquarter_id)
      );
      setFilteredCompaniesAdd(filtered);

      // Reset company if current selection is not valid
      if (
        newRegionData.company_id &&
        !filtered.find((c) => c.id.toString() === newRegionData.company_id)
      ) {
        setNewRegionData((prev) => ({ ...prev, company_id: "" }));
      }
    } else {
      setFilteredCompaniesAdd(companiesDropdown);
    }
  }, [newRegionData.headquarter_id, companiesDropdown]);

  // Filter companies based on selected headquarter (country) for EDIT mode
  useEffect(() => {
    if (editRegionData.headquarter_id) {
      const filtered = companiesDropdown.filter(
        (company) =>
          company.country_id === parseInt(editRegionData.headquarter_id)
      );
      setFilteredCompaniesEdit(filtered);

      // Reset company if current selection is not valid
      if (
        editRegionData.company_id &&
        !filtered.find((c) => c.id.toString() === editRegionData.company_id)
      ) {
        setEditRegionData((prev) => ({ ...prev, company_id: "" }));
      }
    } else {
      setFilteredCompaniesEdit(companiesDropdown);
    }
  }, [editRegionData.headquarter_id, companiesDropdown]);

  const fetchRegions = async () => {
    setIsLoadingRegions(true);
    try {
      const response = await fetch(getFullUrl("/pms/regions.json"), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Regions API response:", data);

        if (Array.isArray(data)) {
          setRegions(data);
        } else if (data && data.regions && Array.isArray(data.regions)) {
          setRegions(data.regions);
        } else if (data && data.data && Array.isArray(data.data)) {
          setRegions(data.data);
        } else {
          console.error("Regions data format unexpected:", data);
          setRegions([]);
          toast.error("Invalid regions data format");
        }
      } else {
        toast.error("Failed to fetch regions");
        setRegions([]);
      }
    } catch (error) {
      console.error("Error fetching regions:", error);
      toast.error("Error fetching regions");
      setRegions([]);
    } finally {
      setIsLoadingRegions(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch(
        getFullUrl("/pms/company_setups/company_index.json"),
        {
          method: "GET",
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        if (
          responseData &&
          responseData.code === 200 &&
          Array.isArray(responseData.data)
        ) {
          setCompaniesDropdown(responseData.data);
          const compMap = new Map();
          responseData.data.forEach((company: any) => {
            compMap.set(company.id, company.name);
          });
          setCompaniesMap(compMap);
        } else if (responseData && Array.isArray(responseData.companies)) {
          setCompaniesDropdown(responseData.companies);
          const compMap = new Map();
          responseData.companies.forEach((company: any) => {
            compMap.set(company.id, company.name);
          });
          setCompaniesMap(compMap);
        } else if (Array.isArray(responseData)) {
          setCompaniesDropdown(responseData);
          const compMap = new Map();
          responseData.forEach((company: any) => {
            compMap.set(company.id, company.name);
          });
          setCompaniesMap(compMap);
        }
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchHeadquarters = async () => {
    try {
      const response = await fetch(getFullUrl("/headquarters.json"), {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setHeadquartersDropdown(data);
          const hqMap = new Map();
          data.forEach((hq: any) => {
            if (hq.id && hq.country_name) {
              hqMap.set(hq.id, hq.country_name);
            }
          });
          setHeadquartersMap(hqMap);
        } else if (
          data &&
          data.headquarters &&
          Array.isArray(data.headquarters)
        ) {
          setHeadquartersDropdown(data.headquarters);
          const hqMap = new Map();
          data.headquarters.forEach((hq: any) => {
            if (hq.id && hq.country_name) {
              hqMap.set(hq.id, hq.country_name);
            }
          });
          setHeadquartersMap(hqMap);
        } else if (data && data.data && Array.isArray(data.data)) {
          setHeadquartersDropdown(data.data);
          const hqMap = new Map();
          data.data.forEach((hq: any) => {
            if (hq.id && hq.country_name) {
              hqMap.set(hq.id, hq.country_name);
            }
          });
          setHeadquartersMap(hqMap);
        }
      }
    } catch (error) {
      console.error("Error fetching headquarters:", error);
    }
  };

  const handleAddRegion = async () => {
    if (
      !newRegionData.name.trim() ||
      !newRegionData.company_id ||
      !newRegionData.headquarter_id
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(getFullUrl("/pms/regions.json"), {
        method: "POST",
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pms_region: {
            name: newRegionData.name,
            company_id: parseInt(newRegionData.company_id),
            headquarter_id: parseInt(newRegionData.headquarter_id),
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Region created successfully:", result);
        toast.success(`Region "${newRegionData.name}" added successfully`);

        await fetchRegions();

        setNewRegionData({ name: "", company_id: "", headquarter_id: "" });
        setIsAddRegionOpen(false);
      } else {
        const errorData = await response.json();
        console.error("Failed to create region:", errorData);
        toast.error("Failed to create region");
      }
    } catch (error) {
      console.error("Error creating region:", error);
      toast.error("Error creating region");
    }
  };

  const handleEditRegion = (region: any) => {
    setEditRegionData({
      id: region.id,
      name: region.name || region.region || "",
      company_id: region.company_id || "",
      headquarter_id: region.headquarter_id || "",
    });
    setIsEditRegionOpen(true);
  };

  const handleUpdateRegion = async () => {
    if (
      !editRegionData.name.trim() ||
      !editRegionData.company_id ||
      !editRegionData.headquarter_id
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(
        getFullUrl(`/pms/regions/${editRegionData.id}.json`),
        {
          method: "PATCH",
          headers: {
            Authorization: getAuthHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pms_region: {
              name: editRegionData.name,
              company_id: parseInt(editRegionData.company_id),
              headquarter_id: parseInt(editRegionData.headquarter_id),
            },
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Region updated successfully:", result);
        toast.success(`Region "${editRegionData.name}" updated successfully`);

        await fetchRegions();

        setEditRegionData({
          id: "",
          name: "",
          company_id: "",
          headquarter_id: "",
        });
        setIsEditRegionOpen(false);
      } else {
        const errorData = await response.json();
        console.error("Failed to update region:", errorData);
        toast.error("Failed to update region");
      }
    } catch (error) {
      console.error("Error updating region:", error);
      toast.error("Error updating region");
    }
  };

  const filteredRegions = regions.filter(
    (region) =>
      region.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      companiesMap
        .get(region.company_id)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      headquartersMap
        .get(region.headquarter_id)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Dialog open={isAddRegionOpen} onOpenChange={setIsAddRegionOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#C72030] hover:bg-[#A01020] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Region
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Region</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setIsAddRegionOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="region_name">Region Name *</Label>
                <Input
                  id="region_name"
                  value={newRegionData.name}
                  onChange={(e) =>
                    setNewRegionData({ ...newRegionData, name: e.target.value })
                  }
                  placeholder="Enter region name"
                />
              </div>
              <div>
                <Label htmlFor="headquarter">Country *</Label>
                <Select
                  value={newRegionData.headquarter_id}
                  onValueChange={(value) => {
                    setNewRegionData({
                      ...newRegionData,
                      headquarter_id: value,
                      company_id: "", // Reset company when country changes
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {headquartersDropdown.map((hq) => (
                      <SelectItem key={hq.id} value={hq.id.toString()}>
                        {hq.country_name || `HQ ${hq.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="company">Company *</Label>
                <Select
                  value={newRegionData.company_id}
                  onValueChange={(value) =>
                    setNewRegionData({ ...newRegionData, company_id: value })
                  }
                  disabled={!newRegionData.headquarter_id}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !newRegionData.headquarter_id
                          ? "Select country first"
                          : filteredCompaniesAdd.length === 0
                            ? "No companies available for selected country"
                            : "Select company"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCompaniesAdd.length === 0 ? (
                      <SelectItem value="no-data" disabled>
                        {!newRegionData.headquarter_id
                          ? "Please select a country first"
                          : "No companies available for selected country"}
                      </SelectItem>
                    ) : (
                      filteredCompaniesAdd.map((company) => (
                        <SelectItem
                          key={company.id}
                          value={company.id.toString()}
                        >
                          {company.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {newRegionData.headquarter_id && (
                  <p className="text-xs text-gray-400 mt-1">
                    {filteredCompaniesAdd.length} companies available for
                    selected country
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddRegionOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddRegion}
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
              >
                Add Region
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex items-center gap-4">
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="text-sm text-gray-600">entries per page</span>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search regions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#C72030]"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Region</TableHead>
                <TableHead className="font-semibold">Company</TableHead>
                <TableHead className="font-semibold">Headquarter</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingRegions ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading regions...
                  </TableCell>
                </TableRow>
              ) : filteredRegions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No regions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRegions.map((region) => (
                  <TableRow key={region.id}>
                    <TableCell>{region.id}</TableCell>
                    <TableCell>{region.name}</TableCell>
                    <TableCell>
                      {companiesMap.get(region.company_id) ||
                        region.company_name ||
                        "-"}
                    </TableCell>
                    <TableCell>
                      {headquartersMap.get(region.headquarter_id) ||
                        region.headquarter_name ||
                        "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRegion(region)}
                          className="hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Region Dialog */}
      <Dialog open={isEditRegionOpen} onOpenChange={setIsEditRegionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Region</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setIsEditRegionOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_region_name">Region Name *</Label>
              <Input
                id="edit_region_name"
                value={editRegionData.name}
                onChange={(e) =>
                  setEditRegionData({ ...editRegionData, name: e.target.value })
                }
                placeholder="Enter region name"
              />
            </div>
            <div>
              <Label htmlFor="edit_headquarter">Country *</Label>
              <Select
                value={editRegionData.headquarter_id}
                onValueChange={(value) => {
                  setEditRegionData({
                    ...editRegionData,
                    headquarter_id: value,
                    company_id: "", // Reset company when country changes
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {headquartersDropdown.map((hq) => (
                    <SelectItem key={hq.id} value={hq.id.toString()}>
                      {hq.country_name || `HQ ${hq.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit_company">Company *</Label>
              <Select
                value={editRegionData.company_id}
                onValueChange={(value) =>
                  setEditRegionData({ ...editRegionData, company_id: value })
                }
                disabled={!editRegionData.headquarter_id}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !editRegionData.headquarter_id
                        ? "Select country first"
                        : filteredCompaniesEdit.length === 0
                          ? "No companies available for selected country"
                          : "Select company"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredCompaniesEdit.length === 0 ? (
                    <SelectItem value="no-data" disabled>
                      {!editRegionData.headquarter_id
                        ? "Please select a country first"
                        : "No companies available for selected country"}
                    </SelectItem>
                  ) : (
                    filteredCompaniesEdit.map((company) => (
                      <SelectItem
                        key={company.id}
                        value={company.id.toString()}
                      >
                        {company.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {editRegionData.headquarter_id && (
                <p className="text-xs text-gray-400 mt-1">
                  {filteredCompaniesEdit.length} companies available for
                  selected country
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditRegionOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateRegion}
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
            >
              Update Region
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
