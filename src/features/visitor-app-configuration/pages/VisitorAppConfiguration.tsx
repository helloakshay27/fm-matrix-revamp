import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Layers, ListChecks, Loader2, RefreshCw, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useVisitorAppConfigQuery } from "../hooks/useVisitorAppConfigQuery";
import { useUpdateVisitorAppConfigMutation } from "../hooks/useUpdateVisitorAppConfigMutation";
import {
  HOST_MODE_OPTIONS,
  MODULE_LABELS,
  VISITOR_STEP_LABELS,
  formatConfigCode,
} from "../const/visitorAppConfigConstants";
import { getApiErrorMessage } from "../utils/apiErrorMessage";
import type {
  ConfigToggle,
  HostMode,
  UpdateVisitorAppConfigPayload,
} from "../types/visitorAppConfig";

const SectionCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="rounded-2xl shadow-sm border border-gray-200">
    <div className="flex items-center gap-3 px-6 pt-6 pb-3">
      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-gray-100 text-gray-500 shrink-0">
        <Icon className="w-[18px] h-[18px]" />
      </div>
      <h3 className="text-sm font-semibold uppercase text-[#1A1A1A]">{title}</h3>
    </div>
    <CardContent>{children}</CardContent>
  </Card>
);

const ToggleList = ({
  idPrefix,
  items,
  labels,
  disabled,
  onToggle,
}: {
  idPrefix: string;
  items: ConfigToggle[];
  labels: Record<string, string>;
  disabled?: boolean;
  onToggle: (code: string, active: boolean) => void;
}) =>
  items.length === 0 ? (
    <div className="py-6 text-center text-sm text-gray-400">No items configured</div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {items.map((item) => {
        const id = `${idPrefix}-${item.code}`;
        return (
          <div
            key={item.code}
            className="flex items-center justify-between gap-3 rounded-xl bg-[#F6F4EE] px-4 py-3"
          >
            <Label htmlFor={id} className="text-sm font-medium text-gray-900 cursor-pointer">
              {formatConfigCode(item.code, labels)}
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12 text-right">
                {item.active ? "Active" : "Inactive"}
              </span>
              <Switch
                id={id}
                checked={item.active}
                disabled={disabled}
                onCheckedChange={(checked) => onToggle(item.code, checked)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );

const toPayload = (config: UpdateVisitorAppConfigPayload): UpdateVisitorAppConfigPayload => ({
  hostMode: config.hostMode,
  visitorSteps: config.visitorSteps.map(({ code, active }) => ({ code, active })),
  modules: config.modules.map(({ code, active }) => ({ code, active })),
});

const VisitorAppConfiguration = () => {
  const siteId = localStorage.getItem("selectedSiteId");
  const { data, isLoading, isError, error, refetch, isFetching } = useVisitorAppConfigQuery(siteId);
  const updateMutation = useUpdateVisitorAppConfigMutation();

  const [draft, setDraft] = useState<UpdateVisitorAppConfigPayload | null>(null);

  // Re-seed the editable copy whenever fresh server data arrives (initial load,
  // refetch after save, or site switch).
  useEffect(() => {
    if (data) setDraft(toPayload(data));
  }, [data]);

  const isDirty = useMemo(
    () => !!data && !!draft && JSON.stringify(toPayload(data)) !== JSON.stringify(draft),
    [data, draft]
  );

  const setHostMode = (hostMode: string) =>
    setDraft((prev) => (prev ? { ...prev, hostMode: hostMode as HostMode } : prev));

  const toggleItem =
    (key: "visitorSteps" | "modules") => (code: string, active: boolean) =>
      setDraft((prev) =>
        prev
          ? {
              ...prev,
              [key]: prev[key].map((item) => (item.code === code ? { ...item, active } : item)),
            }
          : prev
      );

  const handleReset = () => {
    if (data) setDraft(toPayload(data));
  };

  const handleSave = () => {
    if (!siteId || !draft) return;
    updateMutation.mutate(
      { siteId, payload: draft },
      {
        onSuccess: () => toast.success("App configuration updated successfully"),
        onError: (err) =>
          toast.error(getApiErrorMessage(err, "Failed to update app configuration")),
      }
    );
  };

  const isSaving = updateMutation.isPending;

  return (
    <div className="p-6 mx-auto bg-white min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">App Configuration</h1>
          <p className="mt-1 text-sm text-gray-500">
            Control which steps and modules are available in the visitor app for this site
          </p>
        </div>
        {data?.updatedAt && (
          <p className="text-xs text-gray-500">
            Last updated{" "}
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(data.updatedAt))}
          </p>
        )}
      </div>

      {!siteId ? (
        <div className="rounded-xl bg-brand-warning-light px-4 py-3 text-sm text-gray-800">
          Select a site to view its app configuration.
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-20 text-sm text-gray-500">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Loading configuration…
        </div>
      ) : isError ? (
        <div className="flex items-center justify-between rounded-xl bg-brand-error-bg px-4 py-3 text-sm text-gray-800">
          <span>{getApiErrorMessage(error, "Failed to load app configuration")}</span>
          <Button variant="outline" size="sm" className="rounded-[8px]" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      ) : draft ? (
        <div className="space-y-6">
          <SectionCard icon={UserRound} title="Host Mode">
            <RadioGroup
              value={draft.hostMode}
              onValueChange={setHostMode}
              disabled={isSaving}
              className="flex flex-wrap gap-x-10 gap-y-3"
            >
              {HOST_MODE_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-start gap-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`host-mode-${option.value}`}
                    className="mt-0.5"
                  />
                  <Label htmlFor={`host-mode-${option.value}`} className="cursor-pointer">
                    <span className="block text-sm font-medium text-gray-900">{option.label}</span>
                    <span className="block text-xs font-normal text-gray-500">
                      {option.description}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </SectionCard>

          <SectionCard icon={ListChecks} title="Visitor Steps">
            <ToggleList
              idPrefix="visitor-step"
              items={draft.visitorSteps}
              labels={VISITOR_STEP_LABELS}
              disabled={isSaving}
              onToggle={toggleItem("visitorSteps")}
            />
          </SectionCard>

          <SectionCard icon={Layers} title="Modules">
            <ToggleList
              idPrefix="module"
              items={draft.modules}
              labels={MODULE_LABELS}
              disabled={isSaving}
              onToggle={toggleItem("modules")}
            />
          </SectionCard>

          <div className="fm-action-bar pb-8">
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty || isSaving}
              className="fm-action-secondary"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || isSaving || isFetching}
              className="fm-action-primary"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default VisitorAppConfiguration;
