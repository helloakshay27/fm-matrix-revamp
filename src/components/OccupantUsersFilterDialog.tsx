import {
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Select as MuiSelect,
} from "@mui/material";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useEffect } from "react";
import { fetchEntities } from "@/store/slices/entitiesSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

interface Filters {
  name?: string;
  email?: string;
  mobile?: string;
  status?: string;
  entity?: string;
}

interface FilterDialogProps {
  filterDialogOpen: boolean;
  setFilterDialogOpen: (open: boolean) => void;
  filters: Filters;
  setFilters: (filters: Filters | ((prev: Filters) => Filters)) => void;
  handleApplyFilters: (filters: Filters) => void;
}

export const OccupantUsersFilterDialog = ({
  filterDialogOpen,
  setFilterDialogOpen,
  filters,
  setFilters,
  handleApplyFilters,
}: FilterDialogProps) => {
  const { data: entitiesData, loading: entitiesLoading, error: entitiesError } = useAppSelector((state) => state.entities);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchEntities());
  }, [dispatch]);

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      name: "",
      email: "",
      mobile: "",
      status: "",
      entity: "",
    });
  };

  return (
    <Dialog
      open={filterDialogOpen}
      onClose={setFilterDialogOpen}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent className="p-0 bg-white">
        <div className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">FILTER</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterDialogOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <TextField
                label="Name"
                placeholder="Name"
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />
            </div>

            <div>
              <TextField
                label="Email"
                placeholder="Email"
                value={filters.email}
                onChange={(e) => handleFilterChange("email", e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />
            </div>

            <div>
              <TextField
                fullWidth
                label="Mobile Number"
                placeholder="Mobile Number"
                variant="outlined"
                value={filters.mobile}
                onChange={(e) => handleFilterChange("mobile", e.target.value)}
                required
                inputProps={{
                  maxLength: 10,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                InputLabelProps={{
                  classes: {
                    asterisk: "text-red-500",
                  },
                  shrink: true,
                }}
              />
            </div>

            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Approval Status</InputLabel>
                <MuiSelect
                  label="Approval Status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="" disabled>
                    <em>Select Status</em>
                  </MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div className="md:col-span-1">
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Entity</InputLabel>
                <MuiSelect
                  label="Entity"
                  value={filters.entity}
                  onChange={(e) => handleFilterChange("entity", e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value="">Select Entity</MenuItem>
                  {entitiesLoading && (
                    <MenuItem value="" disabled>Loading...</MenuItem>
                  )}
                  {entitiesError && (
                    <MenuItem value="" disabled>Error loading entities</MenuItem>
                  )}
                  {entitiesData?.entities?.map((entity) => (
                    <MenuItem key={entity.id} value={String(entity.id)}>
                      {entity.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="bg-white text-gray-700 hover:bg-gray-50 border-gray-300 px-6 py-2"
            >
              Reset
            </Button>
            <Button
              onClick={() => handleApplyFilters(filters)}
              className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
