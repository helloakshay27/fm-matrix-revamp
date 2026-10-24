import { useEffect, useMemo, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { SelectField } from "@/components/vi-audit/AuditFormFields";
import { toast } from "sonner";
import { FileText, Paperclip, X } from "lucide-react";
import { AutocompleteLabel, UserAutocomplete } from "@/components/vi-audit/ViUserPicker";
import { rememberViUsers, type ViActiveUserOption } from "@/components/vi-audit/useViActiveUsers";
import type { ViIncidentAttachment } from "./viIncidentData";

// Shared fields of the incident forms (Reporter add/edit, SPOC action plan, Action Owner action taken).

const MENU_MAX_HEIGHT = 320;
const MENU_MIN_HEIGHT = 160;
const VIEWPORT_GAP = 16;

/**
 * SelectField whose menu sits right against the input: below it (above only when there is clearly
 * more room there), exactly as wide as the field (long options wrap) and as tall as the free space
 * allows. Measured when the field is clicked / opened from the keyboard.
 */
export function IncidentSelectField(props: ComponentProps<typeof SelectField>) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState({ width: 0, maxHeight: MENU_MAX_HEIGHT, above: false });

  const measure = () => {
    const input = wrapperRef.current?.querySelector(".MuiInputBase-root");
    if (!input) return;
    const rect = input.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_GAP;
    const spaceAbove = rect.top - VIEWPORT_GAP;
    const above = spaceBelow < 200 && spaceAbove > spaceBelow;
    setMenu({
      width: rect.width,
      maxHeight: Math.max(MENU_MIN_HEIGHT, Math.min(MENU_MAX_HEIGHT, above ? spaceAbove : spaceBelow)),
      above,
    });
  };

  return (
    <div ref={wrapperRef} onMouseDownCapture={measure} onKeyDownCapture={measure}>
      <SelectField
        {...props}
        menuProps={{
          // Keep the menu inside the dialog/page subtree: a portalled menu counts as an outside click
          // for Radix dialogs (closing them on select). Matches the global MUI theme default.
          disablePortal: true,
          anchorOrigin: { vertical: menu.above ? "top" : "bottom", horizontal: "left" },
          transformOrigin: { vertical: menu.above ? "bottom" : "top", horizontal: "left" },
          PaperProps: {
            sx: {
              // "&&&" + !important beats the global 200px menu cap (src/styles/enhanced-select.css, index.css).
              "&&&": {
                maxHeight: `${menu.maxHeight}px !important`,
                ...(menu.width ? { width: `${menu.width}px`, maxWidth: `${menu.width}px` } : {}),
              },
            },
          },
          ...props.menuProps,
        }}
      />
    </div>
  );
}

// The API accepts PDF / JPEG / JPG / PNG, up to 10 MB each.
const ALLOWED_EXTENSIONS = ["pdf", "jpeg", "jpg", "png"];
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ATTACHMENT_ACCEPT = ".pdf,.jpeg,.jpg,.png,application/pdf,image/jpeg,image/png";

const isAllowedType = (file: File) => ALLOWED_EXTENSIONS.includes(file.name.split(".").pop()?.toLowerCase() ?? "");

/** Reads a file as a `data:<mime>;base64,...` URL (the JSON attachment format of the incident API). */
export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });

const Chip = ({ children, onRemove, label }: { children: ReactNode; onRemove: () => void; label: string }) => (
  <span className="inline-flex max-w-[220px] items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-900">
    <span className="truncate">{children}</span>
    <button
      type="button"
      onClick={onRemove}
      className="text-gray-500 hover:text-gray-900"
      aria-label={`Remove ${label}`}
    >
      <X className="w-3 h-3" />
    </button>
  </span>
);

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png"];
const isImageName = (name: string) =>
  IMAGE_EXTENSIONS.includes(name.split("?")[0].split(".").pop()?.toLowerCase() ?? "");

const isImageAttachment = (attachment: ViIncidentAttachment) =>
  isImageName(attachment.url || attachment.name) ||
  isImageName(attachment.name) ||
  attachment.url.startsWith("data:image/");

/**
 * Thumbnail for an image attachment (file card for PDFs, or when the image can't load) — same as
 * the inspection form. With `onRemove` it gets the corner × button.
 */
const AttachmentThumb = ({
  name,
  src,
  isImage,
  onRemove,
  cardTone = "muted",
}: {
  name: string;
  src: string;
  isImage: boolean;
  onRemove?: () => void;
  cardTone?: "muted" | "white";
}) => {
  const [broken, setBroken] = useState(false);
  return (
    <div className="relative" title={name}>
      {isImage && src && !broken ? (
        <img
          src={src}
          alt={name}
          onError={() => setBroken(true)}
          className="h-20 w-24 rounded-[10px] object-cover border border-gray-200"
        />
      ) : (
        <div
          className={`flex h-20 w-24 flex-col items-center justify-center gap-1 rounded-[10px] px-1 text-gray-500 ${
            cardTone === "white" ? "bg-white" : "bg-gray-100"
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="w-full truncate text-center text-[10px]">{name}</span>
        </div>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-gray-600 shadow hover:text-gray-900"
          aria-label={`Remove ${name}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

/** A file picked in this session, previewed from a local object URL. */
const NewFileThumb = ({ file, onRemove }: { file: File; onRemove: () => void }) => {
  const isImage = file.type.startsWith("image/");
  const url = useMemo(() => (isImage ? URL.createObjectURL(file) : ""), [file, isImage]);
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url],
  );
  return <AttachmentThumb name={file.name} src={url} isImage={isImage} onRemove={onRemove} />;
};

/** Upload button + thumbnails for new files and (removable) attachments already saved on the server. */
export function AttachmentPicker({
  label = "Upload Attachments",
  files,
  onFilesChange,
  existing = [],
  onRemoveExisting,
}: {
  label?: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  existing?: ViIncidentAttachment[];
  onRemoveExisting?: (attachment: ViIncidentAttachment) => void;
}) {
  return (
    <div>
      <label className="inline-flex items-center justify-center gap-2 h-9 px-4 text-sm border-dashed border-2 border-gray-300 hover:border-gray-400 text-gray-600 bg-white hover:bg-gray-50 cursor-pointer">
        <Paperclip className="w-4 h-4" />
        {label}
        <input
          type="file"
          multiple
          accept={ATTACHMENT_ACCEPT}
          className="hidden"
          onChange={(e) => {
            const picked = Array.from(e.target.files || []);
            const badType = picked.filter((f) => !isAllowedType(f));
            const tooBig = picked.filter((f) => isAllowedType(f) && f.size > MAX_FILE_BYTES);
            if (badType.length) {
              toast.error(
                `${badType.map((f) => f.name).join(", ")} not allowed. Only PDF, JPEG, JPG and PNG files are accepted.`,
              );
            }
            if (tooBig.length) toast.error(`${tooBig.map((f) => f.name).join(", ")} exceeds the 10 MB limit.`);
            onFilesChange([...files, ...picked.filter((f) => isAllowedType(f) && f.size <= MAX_FILE_BYTES)]);
            e.target.value = "";
          }}
        />
      </label>
      {(existing.length > 0 || files.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-3">
          {existing.map((attachment) => (
            <AttachmentThumb
              key={`saved-${attachment.id || attachment.url}`}
              name={attachment.name}
              src={attachment.url}
              isImage={isImageAttachment(attachment)}
              onRemove={() => onRemoveExisting?.(attachment)}
            />
          ))}
          {files.map((file, i) => (
            <NewFileThumb
              key={`${file.name}-${i}`}
              file={file}
              onRemove={() => onFilesChange(files.filter((_, idx) => idx !== i))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Several users (e.g. a plan's responsible persons): chips + a search box that adds one at a time. */
export function MultiUserSelectField({
  label,
  required,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: ViActiveUserOption[];
  onChange: (users: ViActiveUserOption[]) => void;
  placeholder: string;
}) {
  // Users picked here (or loaded from a draft) become findable by name in the other pickers.
  useEffect(() => {
    if (value.length) rememberViUsers(value, "internal");
  }, [value]);

  return (
    <div>
      <AutocompleteLabel required={required}>{label}</AutocompleteLabel>
      <UserAutocomplete
        value={null}
        onChange={(user) => user && onChange([...value, user])}
        clearOnSelect
        employeeType="internal"
        // Logged-in user on top (marked "You"), like the reporter's SPOC / Functional Head pickers.
        includeCurrentUser
        // Internal users are listed as soon as the box opens (one shared request for every picker);
        // typing filters them / searches the server.
        preload
        excludeIds={value.map((user) => user.id)}
        placeholder={placeholder}
        ariaLabel={label}
      />
      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {value.map((user) => (
            <Chip key={user.id} label={user.name} onRemove={() => onChange(value.filter((u) => u.id !== user.id))}>
              {user.name}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}

/** Read-only attachments as thumbnails (same tiles as the upload preview); each opens the file in a new tab. */
export const AttachmentLinks = ({ attachments, tone = "muted" }: { attachments: ViIncidentAttachment[]; tone?: "muted" | "white" }) => (
  <div className="flex flex-wrap gap-3">
    {attachments.map((attachment, i) => {
      const thumb = (
        <AttachmentThumb
          name={attachment.name}
          src={attachment.url}
          isImage={isImageAttachment(attachment)}
          cardTone={tone}
        />
      );
      return attachment.url ? (
        <a
          key={`${attachment.id || attachment.url}-${i}`}
          href={attachment.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-[10px] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30"
          aria-label={`Open ${attachment.name}`}
        >
          {thumb}
        </a>
      ) : (
        <div key={`${attachment.id || attachment.name}-${i}`}>{thumb}</div>
      );
    })}
  </div>
);
