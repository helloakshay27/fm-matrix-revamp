import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Pencil,
  UploadCloud,
  Image as ImageIcon,
  Share2,
  Type,
  Leaf,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { getFullUrl } from "@/config/apiConfig";
import { getToken, getUser } from "@/utils/auth";

interface SocialMediaAttachment {
  id: string;
  label: string;
  file: File | null;
  existingUrl?: string;
}

interface FormState {
  business_card_logo: File | null;
  business_card_bg_image: File | null;
  social_media: SocialMediaAttachment[];
  font_color: string;
  font_size: string;
  font_style: string;
  font_family: string;
  paper_per_card_g: string;
  co2_per_card_g: string;
  cards_per_tree: string;
  print_cost_per_card: string;
}

interface FontOption {
  value: string;
  label: string;
}

interface BusinessCardConfigData {
  company_id?: number | string;
  business_card_logo_url?: string;
  business_card_bg_image_url?: string;
  social_media?: Record<string, string>;
  text_style?: {
    font_color?: string;
    font_size?: string | number;
    font_style?: string;
    font_family?: string;
  };
  impact_rates?: {
    paper_per_card_g?: string | number;
    co2_per_card_g?: string | number;
    cards_per_tree?: string | number;
    print_cost_per_card?: string | number;
  };
}

const createSocialMediaAttachment = (): SocialMediaAttachment => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  label: "",
  file: null,
});

const emptyForm: FormState = {
  business_card_logo: null,
  business_card_bg_image: null,
  social_media: [createSocialMediaAttachment()],
  font_color: "",
  font_size: "",
  font_style: "",
  font_family: "",
  paper_per_card_g: "",
  co2_per_card_g: "",
  cards_per_tree: "",
  print_cost_per_card: "",
};

const normalizeOptionList = (raw: unknown): FontOption[] => {
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : Object.values(raw as Record<string, unknown>);
  return arr
    .map((item) => {
      if (typeof item === "string" || typeof item === "number") {
        return { value: String(item), label: String(item) };
      }
      if (item && typeof item === "object") {
        const obj = item as Record<string, unknown>;
        const value = obj.value ?? obj.name ?? obj.font_family ?? obj.font_style ?? obj.id;
        const label = obj.label ?? obj.name ?? obj.font_family ?? obj.font_style ?? value;
        if (value !== undefined && value !== null) {
          return { value: String(value), label: String(label) };
        }
      }
      return null;
    })
    .filter((item): item is FontOption => item !== null);
};

const hasConfigData = (data: BusinessCardConfigData | null): boolean =>
  Boolean(
    data &&
      (data.business_card_logo_url ||
        data.business_card_bg_image_url ||
        (data.social_media && Object.keys(data.social_media).length > 0) ||
        data.text_style ||
        data.impact_rates)
  );

// Single-image upload field with a preview/thumbnail once a file (or an existing server url) is available.
const ImageUploadField = ({
  id,
  label,
  file,
  existingUrl,
  onChange,
  onRemove,
}: {
  id: string;
  label: string;
  file: File | null;
  existingUrl?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) => {
  const previewSrc = file ? URL.createObjectURL(file) : existingUrl;

  return (
    <div>
      <Label htmlFor={id} className="mb-2 block">
        {label} <span className="text-[#C72030]">*</span>
      </Label>
      <input id={id} type="file" accept="image/*" className="hidden" onChange={onChange} />
      {previewSrc ? (
        <div className="flex items-center gap-3 rounded-lg border border-gray-300 p-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded bg-gray-100">
            <img src={previewSrc} alt={label} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            {file ? (
              <>
                <p className="truncate text-sm font-medium text-gray-700">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Current image</p>
            )}
          </div>
          <label
            htmlFor={id}
            className="cursor-pointer whitespace-nowrap text-xs font-medium text-[#C72030] hover:underline"
          >
            Replace
          </label>
          {file ? (
            <button
              type="button"
              onClick={onRemove}
              className="rounded p-1 transition-colors hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          ) : null}
        </div>
      ) : (
        <label
          htmlFor={id}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 text-center transition-colors hover:border-[#C72030]"
        >
          <UploadCloud className="h-6 w-6 text-gray-400" />
          <span className="text-sm text-gray-500">Choose an image or drag &amp; drop it here</span>
        </label>
      )}
    </div>
  );
};

const BusinessCardSetupPage = () => {
  const user = getUser();
  const token = getToken();
  const companyId = user?.lock_role?.company_id ?? user?.id ?? "";

  const [formState, setFormState] = useState<FormState>({ ...emptyForm });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingRecord, setExistingRecord] = useState<BusinessCardConfigData | null>(null);
  const [viewMode, setViewMode] = useState<"view" | "edit">("edit");
  const [fontFamilyOptions, setFontFamilyOptions] = useState<FontOption[]>([]);
  const [fontStyleOptions, setFontStyleOptions] = useState<FontOption[]>([]);

  const applyRecordToForm = (data: BusinessCardConfigData) => {
    setFormState((prev) => ({
      ...prev,
      font_color: data.text_style?.font_color ?? prev.font_color,
      font_size: data.text_style?.font_size !== undefined ? String(data.text_style.font_size) : prev.font_size,
      font_style: data.text_style?.font_style ?? prev.font_style,
      font_family: data.text_style?.font_family ?? prev.font_family,
      paper_per_card_g:
        data.impact_rates?.paper_per_card_g !== undefined ? String(data.impact_rates.paper_per_card_g) : prev.paper_per_card_g,
      co2_per_card_g:
        data.impact_rates?.co2_per_card_g !== undefined ? String(data.impact_rates.co2_per_card_g) : prev.co2_per_card_g,
      cards_per_tree:
        data.impact_rates?.cards_per_tree !== undefined ? String(data.impact_rates.cards_per_tree) : prev.cards_per_tree,
      print_cost_per_card:
        data.impact_rates?.print_cost_per_card !== undefined
          ? String(data.impact_rates.print_cost_per_card)
          : prev.print_cost_per_card,
      social_media:
        data.social_media && Object.keys(data.social_media).length > 0
          ? Object.entries(data.social_media).map(([label, url]) => ({
              id: label,
              label,
              file: null,
              existingUrl: url,
            }))
          : prev.social_media,
    }));
  };

  useEffect(() => {
    const loadExistingRecord = async () => {
      if (!companyId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${getFullUrl("/pms/company_setups/get_business_card_config.json")}?company_id=${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            mode: "cors",
          }
        );

        if (response.ok) {
          const payload = await response.json();
          const data = (payload?.data ?? null) as BusinessCardConfigData | null;

          if (hasConfigData(data)) {
            setExistingRecord(data);
            applyRecordToForm(data as BusinessCardConfigData);
            setViewMode("view");
          } else {
            setViewMode("edit");
          }
        }
      } catch (error) {
        console.error("Unable to fetch business card config", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, token]);

  useEffect(() => {
    const loadFontOptions = async () => {
      try {
        const response = await fetch(getFullUrl("/pms/company_setups/get_business_card_font_options.json"), {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          mode: "cors",
        });

        if (response.ok) {
          const payload = await response.json();
          const data = (payload?.data ?? payload ?? {}) as Record<string, unknown>;

          setFontFamilyOptions(
            normalizeOptionList(data.font_families ?? data.fontFamilies ?? data.families ?? data.font_family)
          );
          setFontStyleOptions(
            normalizeOptionList(data.font_styles ?? data.fontStyles ?? data.styles ?? data.font_style)
          );
        }
      } catch (error) {
        console.error("Unable to fetch business card font options", error);
      }
    };

    loadFontOptions();
  }, [token]);

  const modeLabel = useMemo(() => (hasConfigData(existingRecord) ? "Update" : "Add"), [existingRecord]);

  const updateField = (key: keyof Omit<FormState, "social_media">, value: string | File | null) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, key: "business_card_logo" | "business_card_bg_image") => {
    const file = event.target.files?.[0] ?? null;
    updateField(key, file);
  };

  const addSocialMediaAttachment = () => {
    setFormState((prev) => ({
      ...prev,
      social_media: [...prev.social_media, createSocialMediaAttachment()],
    }));
  };

  const removeSocialMediaAttachment = (id: string) => {
    setFormState((prev) => ({
      ...prev,
      social_media: prev.social_media.length > 1
        ? prev.social_media.filter((item) => item.id !== id)
        : prev.social_media,
    }));
  };

  const updateSocialMediaLabel = (id: string, label: string) => {
    const sanitizedLabel = label.replace(/\s/g, "");
    setFormState((prev) => ({
      ...prev,
      social_media: prev.social_media.map((item) => (item.id === id ? { ...item, label: sanitizedLabel } : item)),
    }));
  };

  const updateSocialMediaFile = (id: string, file: File | null) => {
    setFormState((prev) => ({
      ...prev,
      social_media: prev.social_media.map((item) => (item.id === id ? { ...item, file } : item)),
    }));
  };

  const handleCancelEdit = () => {
    if (existingRecord) {
      applyRecordToForm(existingRecord);
      setFormState((prev) => ({ ...prev, business_card_logo: null, business_card_bg_image: null }));
      setViewMode("view");
    }
  };

  const validateForm = (): string | null => {
    if (!formState.business_card_logo && !existingRecord?.business_card_logo_url) {
      return "Business card logo is required.";
    }
    if (!formState.business_card_bg_image && !existingRecord?.business_card_bg_image_url) {
      return "Business card background image is required.";
    }

    for (let index = 0; index < formState.social_media.length; index += 1) {
      const item = formState.social_media[index];
      if (!item.label.trim()) {
        return `Platform / label is required for attachment ${index + 1}.`;
      }
      if (!item.file && !item.existingUrl) {
        return `Icon is required for attachment ${index + 1}.`;
      }
    }

    if (!formState.font_color.trim()) return "Font color is required.";
    if (!formState.font_size.trim()) return "Font size is required.";
    if (!formState.font_style.trim()) return "Font style is required.";
    if (!formState.font_family.trim()) return "Font family is required.";
    if (!formState.paper_per_card_g.trim()) return "Paper per card is required.";
    if (!formState.co2_per_card_g.trim()) return "CO2 per card is required.";
    if (!formState.cards_per_tree.trim()) return "Cards per tree is required.";
    if (!formState.print_cost_per_card.trim()) return "Print cost per card is required.";

    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!companyId) {
      toast.error("Company id is required to save the business card setup.");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("company_id", String(companyId));

      if (formState.business_card_logo) {
        payload.append("business_card_logo", formState.business_card_logo);
      }
      if (formState.business_card_bg_image) {
        payload.append("business_card_bg_image", formState.business_card_bg_image);
      }

      formState.social_media
        .filter((item) => item.file && item.label.trim())
        .forEach((item) => {
          payload.append(`social_media[${item.label.trim()}]`, item.file as File);
        });

      payload.append("text_style[font_color]", formState.font_color);
      payload.append("text_style[font_size]", formState.font_size);
      payload.append("text_style[font_style]", formState.font_style);
      payload.append("text_style[font_family]", formState.font_family);
      payload.append("impact_rates[paper_per_card_g]", formState.paper_per_card_g);
      payload.append("impact_rates[co2_per_card_g]", formState.co2_per_card_g);
      payload.append("impact_rates[cards_per_tree]", formState.cards_per_tree);
      payload.append("impact_rates[print_cost_per_card]", formState.print_cost_per_card);

      const response = await fetch(getFullUrl("/pms/company_setups/update_business_card_config.json"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        mode: "cors",
        body: payload,
      });

      const responseText = await response.text();
      let parsedResponse: { message?: string; data?: BusinessCardConfigData } | null = null;

      try {
        parsedResponse = responseText ? JSON.parse(responseText) : null;
      } catch {
        parsedResponse = null;
      }

      if (!response.ok) {
        toast.error(parsedResponse?.message ? String(parsedResponse.message) : "Unable to save business card config.");
        return;
      }

      const normalized = (parsedResponse?.data ?? null) as BusinessCardConfigData | null;
      if (hasConfigData(normalized)) {
        setExistingRecord(normalized);
        applyRecordToForm(normalized as BusinessCardConfigData);
      }
      setFormState((prev) => ({ ...prev, business_card_logo: null, business_card_bg_image: null }));
      setViewMode("view");

      toast.success("Business card setup saved successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while saving the business card setup.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">Business Card Setup</h1>
          <p className="mt-1 text-sm text-gray-600">Create or update the company business card configuration.</p>
        </div>
        <span className="rounded-full bg-[#f7e7e8] px-3 py-1 text-sm font-medium text-[#C72030]">
          {modeLabel}
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading existing configuration...
        </div>
      ) : null}

      {!isLoading && viewMode === "view" && existingRecord ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon className="h-5 w-5 text-[#C72030]" />
                  Basic details
                </CardTitle>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setViewMode("edit")}
                  className="bg-[#C72030] hover:bg-[#a6161d]"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">Business Card Logo</p>
                {existingRecord.business_card_logo_url ? (
                  <img
                    src={existingRecord.business_card_logo_url}
                    alt="Business card logo"
                    className="h-24 w-24 rounded-lg border border-gray-200 object-cover"
                  />
                ) : (
                  <p className="text-sm text-gray-400">Not uploaded</p>
                )}
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">Business Card Background Image</p>
                {existingRecord.business_card_bg_image_url ? (
                  <img
                    src={existingRecord.business_card_bg_image_url}
                    alt="Business card background"
                    className="h-24 w-40 rounded-lg border border-gray-200 object-cover"
                  />
                ) : (
                  <p className="text-sm text-gray-400">Not uploaded</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Share2 className="h-5 w-5 text-[#C72030]" />
                Social media
              </CardTitle>
            </CardHeader>
            <CardContent>
              {existingRecord.social_media && Object.keys(existingRecord.social_media).length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {Object.entries(existingRecord.social_media).map(([label, url]) => (
                    <div key={label} className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-3">
                      <img src={url} alt={label} className="h-10 w-10 rounded object-contain" />
                      <span className="text-xs font-medium capitalize text-gray-600">{label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No social media attachments added</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Type className="h-5 w-5 text-[#C72030]" />
                Text style
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs uppercase text-gray-500">Font color</p>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: existingRecord.text_style?.font_color }}
                  />
                  <span className="text-sm text-gray-800">{existingRecord.text_style?.font_color ?? "-"}</span>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Font size</p>
                <p className="text-sm text-gray-800">{existingRecord.text_style?.font_size ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Font style</p>
                <p className="text-sm text-gray-800">{existingRecord.text_style?.font_style ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Font family</p>
                <p className="text-sm text-gray-800">{existingRecord.text_style?.font_family ?? "-"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Leaf className="h-5 w-5 text-[#C72030]" />
                Print metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs uppercase text-gray-500">Paper per card (g)</p>
                <p className="text-sm text-gray-800">{existingRecord.impact_rates?.paper_per_card_g ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">CO2 per card (g)</p>
                <p className="text-sm text-gray-800">{existingRecord.impact_rates?.co2_per_card_g ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Cards per tree</p>
                <p className="text-sm text-gray-800">{existingRecord.impact_rates?.cards_per_tree ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Print cost per card</p>
                <p className="text-sm text-gray-800">{existingRecord.impact_rates?.print_cost_per_card ?? "-"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {!isLoading && viewMode === "edit" ? (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ImageIcon className="h-5 w-5 text-[#C72030]" />
                Basic details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUploadField
                id="business_card_logo"
                label="Business Card Logo"
                file={formState.business_card_logo}
                existingUrl={existingRecord?.business_card_logo_url}
                onChange={(e) => handleFileChange(e, "business_card_logo")}
                onRemove={() => updateField("business_card_logo", null)}
              />

              <ImageUploadField
                id="business_card_bg_image"
                label="Business Card Background Image"
                file={formState.business_card_bg_image}
                existingUrl={existingRecord?.business_card_bg_image_url}
                onChange={(e) => handleFileChange(e, "business_card_bg_image")}
                onRemove={() => updateField("business_card_bg_image", null)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Share2 className="h-5 w-5 text-[#C72030]" />
                Social media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                Add any number of social media icons to appear on the business card — not limited to a fixed set of platforms.
              </p>

              {formState.social_media.map((item, index) => (
                <div key={item.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Attachment {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeSocialMediaAttachment(item.id)}
                      disabled={formState.social_media.length === 1}
                      className="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-[#C72030] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <Label htmlFor={`social-label-${item.id}`}>
                        Platform / label <span className="text-[#C72030]">*</span>
                      </Label>
                      <Input
                        id={`social-label-${item.id}`}
                        placeholder="e.g. facebook, twitter, portfolio"
                        value={item.label}
                        onChange={(e) => updateSocialMediaLabel(item.id, e.target.value)}
                        required
                      />
                      <p className="mt-1 text-xs text-gray-400">Spaces are not allowed.</p>
                    </div>
                    <ImageUploadField
                      id={`social-file-${item.id}`}
                      label="Icon"
                      file={item.file}
                      existingUrl={item.existingUrl}
                      onChange={(e) => updateSocialMediaFile(item.id, e.target.files?.[0] ?? null)}
                      onRemove={() => updateSocialMediaFile(item.id, null)}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addSocialMediaAttachment}
                className="w-full border-dashed border-[#C72030] text-[#C72030] hover:bg-red-50 hover:text-[#C72030]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add attachment
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Type className="h-5 w-5 text-[#C72030]" />
                Text style
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="font_color">
                  Font color <span className="text-[#C72030]">*</span>
                </Label>
                <Input
                  id="font_color"
                  value={formState.font_color}
                  onChange={(e) => updateField("font_color", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="font_size">
                  Font size <span className="text-[#C72030]">*</span>
                </Label>
                <Input
                  id="font_size"
                  value={formState.font_size}
                  onChange={(e) => updateField("font_size", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="font_style">
                  Font style <span className="text-[#C72030]">*</span>
                </Label>
                <Select value={formState.font_style} onValueChange={(value) => updateField("font_style", value)}>
                  <SelectTrigger id="font_style">
                    <SelectValue placeholder="Select font style" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontStyleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="font_family">
                  Font family <span className="text-[#C72030]">*</span>
                </Label>
                <Select value={formState.font_family} onValueChange={(value) => updateField("font_family", value)}>
                  <SelectTrigger id="font_family">
                    <SelectValue placeholder="Select font family" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Leaf className="h-5 w-5 text-[#C72030]" />
                Print metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="paper_per_card_g">
                  Paper per card (g) <span className="text-[#C72030]">*</span>
                </Label>
                <Input
                  id="paper_per_card_g"
                  value={formState.paper_per_card_g}
                  onChange={(e) => updateField("paper_per_card_g", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="co2_per_card_g">
                  CO2 per card (g) <span className="text-[#C72030]">*</span>
                </Label>
                <Input
                  id="co2_per_card_g"
                  value={formState.co2_per_card_g}
                  onChange={(e) => updateField("co2_per_card_g", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cards_per_tree">
                  Cards per tree <span className="text-[#C72030]">*</span>
                </Label>
                <Input
                  id="cards_per_tree"
                  value={formState.cards_per_tree}
                  onChange={(e) => updateField("cards_per_tree", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="print_cost_per_card">
                  Print cost per card <span className="text-[#C72030]">*</span>
                </Label>
                <Input
                  id="print_cost_per_card"
                  value={formState.print_cost_per_card}
                  onChange={(e) => updateField("print_cost_per_card", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 xl:col-span-2">
            {existingRecord ? (
              <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isSubmitting}>
                Cancel
              </Button>
            ) : null}
            <Button type="submit" className="bg-[#C72030] hover:bg-[#a6161d]" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Pencil className="mr-2 h-4 w-4" />
                  {modeLabel}
                </>
              )}
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
};

export default BusinessCardSetupPage;
