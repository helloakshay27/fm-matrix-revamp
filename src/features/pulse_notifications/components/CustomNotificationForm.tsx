import { PulseFormSection as FormSection } from "@/pages/pulse/components/PulseFormSection";
import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Share2,
  X,
  Building2,
  Users,
  User,
  AlertCircle,
} from "lucide-react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  TextField,
  SelectChangeEvent,
} from "@mui/material";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormActionBar, assetFieldStyles } from "@/components/common/FormSection";
import { NotificationSiteInlineList } from "./NotificationSiteInlineList";
import { NotificationCommunityInlineList } from "./NotificationCommunityInlineList";
import { NotificationUserInlineList } from "./NotificationUserInlineList";
import { useNotificationTypesQuery } from "../hooks/useNotificationTypesQuery";
import type {
  AudienceScope,
  CustomNotificationFormPayload,
  CustomNotificationTargetAttribute,
  NotificationTargetSelection,
} from "../types/customNotification";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const TITLE_MAX = 120;
const MESSAGE_MAX = 500;

const Required = () => <span className="text-brand-error">*</span>;

// Builds custom_notification_targets_attributes for one targetable type.
// The backend can have more than one target row for the same targetable_id
// (confirmed duplicates in practice), but the UI only tracks one selection
// per targetable entity — so for a kept selection with N existing record
// ids, one is reused (sent as `id`, so the backend updates it instead of
// creating a new row) and the rest are sent back with `_destroy: true`,
// cleaning up the duplicates on save. New selections have no record ids, so
// no `id` is sent and the backend creates a fresh row. Targets present in
// `original` but no longer in `current` have every one of their record ids
// sent back with `_destroy: true` so removing a chip during edit actually
// removes the association server-side.
function buildTargetAttributes(
  targetableType: CustomNotificationTargetAttribute["targetable_type"],
  current: NotificationTargetSelection[],
  original: NotificationTargetSelection[]
): CustomNotificationTargetAttribute[] {
  const currentIds = new Set(current.map((item) => item.id));

  const kept = current.flatMap((item) => {
    const [keepId, ...duplicateIds] = item.targetRecordIds ?? [];
    return [
      {
        targetable_type: targetableType,
        targetable_id: item.id,
        ...(keepId != null ? { id: keepId } : {}),
      },
      ...duplicateIds.map((id) => ({
        id,
        targetable_type: targetableType,
        targetable_id: item.id,
        _destroy: true as const,
      })),
    ];
  });

  const removed = original
    .filter((item) => !currentIds.has(item.id))
    .flatMap((item) =>
      (item.targetRecordIds ?? []).map((id) => ({
        id,
        targetable_type: targetableType,
        targetable_id: item.id,
        _destroy: true as const,
      }))
    );

  return [...kept, ...removed];
}

type AudienceKey = "sites" | "communities" | "users";

interface AudienceOption {
  key: AudienceKey;
  icon: typeof Building2;
  label: string;
  description: string;
  count: number;
}

export interface CustomNotificationFormInitialValues {
  title?: string;
  message?: string;
  ntype?: string;
  priority?: string;
  audienceScope?: AudienceScope;
  selectedSites?: NotificationTargetSelection[];
  selectedCommunities?: NotificationTargetSelection[];
  selectedUsers?: NotificationTargetSelection[];
}

interface CustomNotificationFormProps {
  submitLabel: string;
  submittingLabel: string;
  isSubmitting: boolean;
  initialValues?: CustomNotificationFormInitialValues;
  onSubmit: (payload: CustomNotificationFormPayload) => void | Promise<void>;
  onCancel: () => void;
}

export function CustomNotificationForm({
  submitLabel,
  isSubmitting,
  initialValues,
  onSubmit,
  onCancel,
}: CustomNotificationFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [message, setMessage] = useState(initialValues?.message ?? "");
  const [ntype, setNtype] = useState(initialValues?.ntype ?? "");
  const [priority, setPriority] = useState(initialValues?.priority ?? "low");
  const [audienceScope, setAudienceScope] = useState<AudienceScope>(
    initialValues?.audienceScope ?? "all"
  );

  const [selectedSites, setSelectedSites] = useState<NotificationTargetSelection[]>(
    initialValues?.selectedSites ?? []
  );
  const [selectedCommunities, setSelectedCommunities] = useState<NotificationTargetSelection[]>(
    initialValues?.selectedCommunities ?? []
  );
  const [selectedUsers, setSelectedUsers] = useState<NotificationTargetSelection[]>(
    initialValues?.selectedUsers ?? []
  );

  const [expandedPanel, setExpandedPanel] = useState<AudienceKey | null>(null);

  const { data: notificationTypesData, isLoading: isNotificationTypesLoading } =
    useNotificationTypesQuery();
  const notificationTypeOptions = notificationTypesData?.module_types ?? [];
  const hasUnknownNtype =
    ntype !== "" && !notificationTypeOptions.some((option) => option.value === ntype);

  const toggleInSelection = (
    setter: React.Dispatch<React.SetStateAction<NotificationTargetSelection[]>>,
    item: NotificationTargetSelection
  ) => {
    setter((prev) =>
      prev.some((existing) => existing.id === item.id)
        ? prev.filter((existing) => existing.id !== item.id)
        : [...prev, item]
    );
  };

  const totalCustomTargets =
    selectedSites.length + selectedCommunities.length + selectedUsers.length;

  const audienceOptions: AudienceOption[] = [
    {
      key: "sites",
      icon: Building2,
      label: "Sites",
      description: "Target specific tech parks / sites",
      count: selectedSites.length,
    },
    {
      key: "communities",
      icon: Users,
      label: "Community",
      description: "Target specific resident communities",
      count: selectedCommunities.length,
    },
    {
      key: "users",
      icon: User,
      label: "Users",
      description: "Target specific individual users",
      count: selectedUsers.length,
    },
  ];

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim() || !ntype.trim()) {
      toast.error("Title, message, and notification type are required");
      return;
    }

    const companyIdRaw = localStorage.getItem("selectedCompanyId");
    const companyId = companyIdRaw ? parseInt(companyIdRaw, 10) : NaN;
    if (!companyId || Number.isNaN(companyId)) {
      toast.error("No company selected — please re-select your company and try again");
      return;
    }

    const targets: CustomNotificationTargetAttribute[] = [
      ...buildTargetAttributes("PmsSite", selectedSites, initialValues?.selectedSites ?? []),
      ...buildTargetAttributes("Community", selectedCommunities, initialValues?.selectedCommunities ?? []),
      ...buildTargetAttributes("User", selectedUsers, initialValues?.selectedUsers ?? []),
    ];

    if (audienceScope === "custom" && totalCustomTargets === 0) {
      toast.error("Select at least one site, community, or user for a custom audience");
      return;
    }

    await onSubmit({
      title: title.trim(),
      message: message.trim(),
      ntype: ntype.trim(),
      priority,
      company_id: companyId,
      audience_scope: audienceScope,
      ...(audienceScope === "custom"
        ? { custom_notification_targets_attributes: targets }
        : {}),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-6">
      <div className="flex-1 w-full mx-auto px-6 pb-6 space-y-4 sm:space-y-6">
        {/* Details */}
        <FormSection title="Details" icon={Bell}>
          <div className="space-y-2">
            <div>
              <TextField
                label={<>Title <Required /></>}
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: assetFieldStyles }}
              />
              <p className="mt-1 text-right text-xs text-gray-400">
                {title.length}/{TITLE_MAX}
              </p>
            </div>

            <div>
              <TextField
                label={<>Message <Required /></>}
                placeholder="Enter Message"
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
                fullWidth
                multiline
                minRows={3}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "auto !important",
                    padding: "2px !important",
                    display: "flex",
                  },
                  "& .MuiInputBase-input[aria-hidden='true']": {
                    flex: 0,
                    width: 0,
                    height: 0,
                    padding: "0 !important",
                    margin: 0,
                    display: "none",
                  },
                  "& .MuiInputBase-input": {
                    resize: "none !important",
                  },
                }}
              />
              <p className="-mt-3 mb-4 text-right text-xs text-gray-400">
                {message.length}/{MESSAGE_MAX}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormControl fullWidth sx={{ "& .MuiInputBase-root": assetFieldStyles }}>
                <InputLabel id="notification-type-label" shrink>
                  Notification Type <Required />
                </InputLabel>
                <MuiSelect
                  labelId="notification-type-label"
                  value={ntype}
                  onChange={(e: SelectChangeEvent) => setNtype(e.target.value)}
                  displayEmpty
                  disabled={isNotificationTypesLoading}
                >
                  <MenuItem value="" disabled>
                    {isNotificationTypesLoading ? "Loading..." : "Select notification type"}
                  </MenuItem>
                  {notificationTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth sx={{ "& .MuiInputBase-root": assetFieldStyles }}>
                <InputLabel id="notification-priority-label" shrink>
                  Priority <Required />
                </InputLabel>
                <MuiSelect
                  labelId="notification-priority-label"
                  value={priority}
                  onChange={(e: SelectChangeEvent) => setPriority(e.target.value)}
                  displayEmpty
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          </div>
        </FormSection>

        {/* Audience */}
        <FormSection title="Audience" icon={Share2}>
          <div className="space-y-6">
            <RadioGroup
              name="audienceScope"
              value={audienceScope}
              onValueChange={(raw) => {
                const value = raw as AudienceScope;
                setAudienceScope(value);
                if (value === "all") setExpandedPanel(null);
              }}
              className="flex flex-row flex-wrap gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="all" id="audience-scope-all" />
                <Label htmlFor="audience-scope-all" className="text-sm font-normal text-gray-700 cursor-pointer">
                  All Users
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="custom" id="audience-scope-custom" />
                <Label htmlFor="audience-scope-custom" className="text-sm font-normal text-gray-700 cursor-pointer">
                  Custom Audience
                </Label>
              </div>
            </RadioGroup>

            {audienceScope === "custom" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {audienceOptions.map((option) => {
                    const isExpanded = expandedPanel === option.key;
                    return (
                      <button
                        key={option.key}
                        aria-expanded={isExpanded}
                        aria-controls={`pulse-audience-${option.key}`}
                        type="button"
                        onClick={() =>
                          setExpandedPanel((prev) => (prev === option.key ? null : option.key))
                        }
                        className={`pulse-audience-disclosure flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${isExpanded
                          ? "border-brand bg-brand-selected"
                          : "border-gray-200 hover:border-brand hover:bg-brand-selected"
                          }`}
                      >
                        <div className="w-9 h-9 flex-shrink-0 rounded-full bg-brand-light flex items-center justify-center">
                          <option.icon className="w-4 h-4 text-brand" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {option.label}
                            </span>
                            <ChevronDown size={18} aria-hidden="true" className="pulse-section-chevron" data-open={isExpanded} />
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {option.count > 0 && (
                                <span className="bg-brand text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                                  {option.count}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {expandedPanel && (
                  <div id={`pulse-audience-${expandedPanel}`} className="rounded-lg border border-gray-200 overflow-hidden">
                    {expandedPanel === "sites" && (
                      <NotificationSiteInlineList
                        selectedIds={selectedSites.map((s) => s.id)}
                        onToggle={(site) => toggleInSelection(setSelectedSites, site)}
                      />
                    )}
                    {expandedPanel === "communities" && (
                      <NotificationCommunityInlineList
                        selectedIds={selectedCommunities.map((c) => c.id)}
                        onToggle={(community) =>
                          toggleInSelection(setSelectedCommunities, community)
                        }
                      />
                    )}
                    {expandedPanel === "users" && (
                      <NotificationUserInlineList
                        selectedIds={selectedUsers.map((u) => u.id)}
                        onToggle={(user) => toggleInSelection(setSelectedUsers, user)}
                      />
                    )}
                  </div>
                )}

                {selectedSites.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Sites
                    </span>
                    {selectedSites.map((site) => (
                      <Badge
                        key={site.id}
                        variant="outline"
                        className="gap-1 border-brand/30 bg-brand-selected text-brand"
                      >
                        {site.name}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedSites((prev) => prev.filter((s) => s.id !== site.id))
                          }
                          className="ml-1 hover:opacity-70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {selectedCommunities.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Community
                    </span>
                    {selectedCommunities.map((community) => (
                      <Badge
                        key={community.id}
                        variant="outline"
                        className="gap-1 border-brand/30 bg-brand-selected text-brand"
                      >
                        {community.name}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCommunities((prev) =>
                              prev.filter((c) => c.id !== community.id)
                            )
                          }
                          className="ml-1 hover:opacity-70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {selectedUsers.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Users
                    </span>
                    {selectedUsers.map((user) => (
                      <Badge
                        key={user.id}
                        variant="outline"
                        className="gap-1 border-brand/30 bg-brand-selected text-brand"
                      >
                        {user.name}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id))
                          }
                          className="ml-1 hover:opacity-70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {totalCustomTargets === 0 && (
                  <div className="flex items-center gap-2 rounded-lg bg-brand-warning/10 px-3 py-2 text-sm text-brand-warning">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    Select at least one site, community, or user before submitting.
                  </div>
                )}
              </div>
            )}
          </div>
        </FormSection>

        <FormActionBar
          onCancel={onCancel}
          onSubmit={handleSubmit}
          submitLabel={submitLabel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
