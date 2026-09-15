import { useEffect, useRef } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { Button } from "@/components/ui/button";
import { addGateSchema, type AddGateFormData } from "../schemas/addGateSchema";
import { useSitesQuery } from "../hooks/useSitesQuery";
import { useSecurityUsersQuery } from "../hooks/useSecurityUsersQuery";
import { useBuildingsQuery } from "../hooks/useBuildingsQuery";

// Mirrors the field styling used across the app's other MUI-based add pages
// (e.g. AddVisitorGatePage.tsx), pointed at the brand color token instead of
// the legacy hardcoded red.
const fieldStyles = {
  backgroundColor: "#fff",
  borderRadius: "4px",
  "& .MuiOutlinedInput-root": {
    height: "45px",
    "& fieldset": { borderColor: "#ddd" },
    "&:hover fieldset": { borderColor: "#999696ff" },
    "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" },
  },
  "& .MuiInputLabel-root": {
    color: "#000000",
    "&.Mui-focused": { color: "var(--color-primary)" },
    "& .MuiInputLabel-asterisk": { color: "#ff0000 !important" },
  },
  "& .MuiFormLabel-asterisk": { color: "#ff0000 !important" },
};

interface GateFormProps {
  defaultValues?: Partial<AddGateFormData>;
  onSubmit: (values: AddGateFormData) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  submittingLabel?: string;
}

export const GateForm = ({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Submit",
  submittingLabel = "Submitting...",
}: GateFormProps) => {
  const { data: sites = [], isLoading: isLoadingSites } = useSitesQuery();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddGateFormData>({
    resolver: zodResolver(addGateSchema),
    defaultValues: {
      site: "",
      user: "",
      tower: "",
      gateName: "",
      gateDevice: "",
      ...defaultValues,
    },
  });

  const selectedSite = useWatch({ control, name: "site" });
  const selectedSiteId = selectedSite ? Number(selectedSite) : null;

  // User and Tower options are scoped to the chosen site, so clear any
  // previously selected values whenever it changes — but not on the very
  // first render, which would otherwise wipe out an edit form's prefilled
  // values before the user has touched anything.
  const isFirstSiteChange = useRef(true);
  useEffect(() => {
    if (isFirstSiteChange.current) {
      isFirstSiteChange.current = false;
      return;
    }
    setValue("user", "");
    setValue("tower", "");
  }, [selectedSiteId, setValue]);

  const { data: users = [], isLoading: isLoadingUsers } = useSecurityUsersQuery(selectedSiteId);

  const {
    data: buildingsPages,
    isLoading: isLoadingBuildings,
    fetchNextPage: fetchNextBuildingsPage,
    hasNextPage: hasNextBuildingsPage,
    isFetchingNextPage: isFetchingNextBuildingsPage,
  } = useBuildingsQuery(selectedSiteId);

  const buildings = buildingsPages?.pages.flatMap((page) => page.pms_buildings) ?? [];

  const handleTowerMenuScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const nearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 40;
    if (nearBottom && hasNextBuildingsPage && !isFetchingNextBuildingsPage) {
      fetchNextBuildingsPage();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-[#F2EEE9] border-b border-gray-200 flex items-center">
          <div className="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
            1
          </div>
          <h2 className="text-lg font-semibold text-gray-900">GATE CONFIGURATION</h2>
        </div>

        <div className="p-6 space-y-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Site</InputLabel>
                <Controller
                  name="site"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Site"
                      notched
                      displayEmpty
                      disabled={isLoadingSites}
                    >
                      <MenuItem value="" disabled>
                        {isLoadingSites ? "Loading sites..." : "Select Site"}
                      </MenuItem>
                      {sites.map((site) => (
                        <MenuItem key={site.id} value={String(site.id)}>
                          {site.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </div>

            <div>
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Tower</InputLabel>
                <Controller
                  name="tower"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Tower"
                      notched
                      displayEmpty
                      disabled={!selectedSiteId || isLoadingBuildings}
                      MenuProps={{
                        PaperProps: {
                          onScroll: handleTowerMenuScroll,
                          style: { maxHeight: 300 },
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        {!selectedSiteId
                          ? "Select a site first"
                          : isLoadingBuildings
                            ? "Loading towers..."
                            : "Select Tower"}
                      </MenuItem>
                      {buildings.map((building) => (
                        <MenuItem key={building.id} value={String(building.id)}>
                          {building.name}
                        </MenuItem>
                      ))}
                      {isFetchingNextBuildingsPage && (
                        <MenuItem disabled>Loading more...</MenuItem>
                      )}
                    </Select>
                  )}
                />
              </FormControl>
            </div>

            <div>
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>User</InputLabel>
                <Controller
                  name="user"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="User"
                      notched
                      displayEmpty
                      disabled={!selectedSiteId || isLoadingUsers}
                    >
                      <MenuItem value="" disabled>
                        {!selectedSiteId
                          ? "Select a site first"
                          : isLoadingUsers
                            ? "Loading users..."
                            : "Select User"}
                      </MenuItem>
                      {users.map((user) => (
                        <MenuItem key={user.id} value={String(user.id)}>
                          {user.full_name || user.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <TextField
                label="Gate Name"
                placeholder="Enter gate name"
                {...register("gateName")}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true, required: true }}
                sx={fieldStyles}
              />
              {errors.gateName && (
                <p className="mt-1 text-xs text-red-600">{errors.gateName.message}</p>
              )}
            </div>

            <div>
              <TextField
                label="Gate Device"
                placeholder="Enter gate device"
                {...register("gateDevice")}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true, required: true }}
                sx={fieldStyles}
              />
              {errors.gateDevice && (
                <p className="mt-1 text-xs text-red-600">{errors.gateDevice.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <Button
          type="submit"
          className="px-12 py-3 bg-brand hover:bg-brand-hover text-white font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default GateForm;
