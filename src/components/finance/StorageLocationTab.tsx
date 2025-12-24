import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/utils/apiClient";

export const StorageLocationTab = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  /** =============================
   *       GET STORAGE LOCATIONS
   * ============================= */
  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(
        "/pms/purchase_orders/get_additional_fields.json?q[fields_for_eq]=storage_location"
      );

      setLocations(response.data.additional_fields || []);
    } catch (e) {
      toast.error("Failed to load storage locations");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  /** =============================
   *          CREATE
   * ============================= */
  const handleCreate = async () => {
    try {
      if (!formData.code || !formData.name) {
        toast.error("Code and Name are required");
        return;
      }

      setIsLoading(true);

      const payload = {
        content: { ...formData },
        fields_for: "storage_location",
      };

      await apiClient.post(
        "/pms/purchase_orders/create_additional_fields.json",
        payload
      );

      toast.success("Storage Location created");

      setFormData({ code: "", name: "", description: "" });
      setIsCreateModalOpen(false);
      fetchLocations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create location");
    } finally {
      setIsLoading(false);
    }
  };

  /** =============================
   *          UPDATE
   * ============================= */
  const handleEdit = async () => {
    try {
      if (!formData.code || !formData.name) {
        toast.error("Code and Name are required");
        return;
      }

      setIsLoading(true);

      const payload = {
        content: { ...formData },
        fields_for: "storage_location",
      };

      await apiClient.put(
        `/pms/purchase_orders/create_additional_fields.json?id=${selectedLocation.id}`,
        payload
      );

      toast.success("Storage Location updated");

      setFormData({ code: "", name: "", description: "" });
      setSelectedLocation(null);
      setIsEditModalOpen(false);
      fetchLocations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update");
    } finally {
      setIsLoading(false);
    }
  };

  /** =============================
   *          DELETE
   * ============================= */
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this storage location?")) return;

    try {
      setIsLoading(true);
      await apiClient.delete(
        `/pms/purchase_orders/create_additional_fields.json?id=${id}&fields_for=storage_location`
      );
      toast.success("Deleted successfully");
      fetchLocations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete");
    } finally {
      setIsLoading(false);
    }
  };

  /** =============================
   *       OPEN EDIT MODAL
   * ============================= */
  const openEditModal = (loc: any) => {
    setSelectedLocation(loc);
    setFormData({
      code: loc.content?.code,
      name: loc.content?.name,
      description: loc.content?.description || "",
    });
    setIsEditModalOpen(true);
  };

  const filtered = locations.filter(
    (l) =>
      l.content?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.content?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Search + Add */}
      <div className="flex gap-3 items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search Storage Location..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#BF213E] hover:bg-[#A01830] text-white gap-2"
        >
          <Plus className="w-4 h-4" /> Add Location
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading && paginated.length === 0 ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex justify-center p-8 text-gray-500">
            No Storage Locations Found
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>{location.content?.code}</TableCell>
                    <TableCell>{location.content?.name}</TableCell>
                    <TableCell>{location.content?.description || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between p-4 border-t">
                <span>
                  Page {currentPage} of {totalPages}
                </span>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Storage Location</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Label>Code *</Label>
            <Input
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
            />

            <Label>Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <Label>Description</Label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>

              <Button className="bg-[#BF213E] text-white" onClick={handleCreate}>
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Storage Location</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Label>Code *</Label>
            <Input
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
            />

            <Label>Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <Label>Description</Label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>

              <Button className="bg-[#BF213E] text-white" onClick={handleEdit}>
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StorageLocationTab;
