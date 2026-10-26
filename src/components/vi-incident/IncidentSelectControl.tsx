import { useRef, useState } from "react";
import { MenuItem, TextField, type MenuProps } from "@mui/material";
import { auditFieldSx } from "@/components/vi-audit/ViAuditUi";
import { requiredLabel } from "@/components/vi-audit/AuditFormFields";
import type { MasterOption } from "@/components/vi-audit/useViAuditMasters";

// Incident-only select control: opening hooks do not change Audit dropdown behavior.
export function IncidentSelectControl({
  label,
  required,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  loading,
  menuProps,
  onOpen,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: (string | MasterOption)[];
  placeholder: string;
  disabled?: boolean;
  loading?: boolean;
  /** Extra MUI Menu props (e.g. anchorOrigin) merged over the defaults. */
  menuProps?: Partial<MenuProps>;
  /** Measure or prepare the menu when MUI opens it. */
  onOpen?: () => void;
}) {
  const normalized: MasterOption[] = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option
  );
  const labelFor = (selected: string) =>
    normalized.find((option) => option.value === selected)?.label ?? selected;
  // The menu matches the field's width and opens right under it (the global search box
  // injected into every menu otherwise stretches it across the whole row).
  const fieldRef = useRef<HTMLDivElement>(null);
  const [menuWidth, setMenuWidth] = useState<number>();

  return (
    <TextField
      ref={fieldRef}
      select
      fullWidth
      label={required ? requiredLabel(label) : label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || loading}
      sx={auditFieldSx}
      InputLabelProps={{ shrink: true }}
      SelectProps={{
        displayEmpty: true,
        onOpen: () => {
          setMenuWidth(fieldRef.current?.offsetWidth);
          onOpen?.();
        },
        MenuProps: {
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
          transformOrigin: { vertical: "top", horizontal: "left" },
          ...menuProps,
          PaperProps: {
            ...menuProps?.PaperProps,
            style: { maxHeight: 320, width: menuWidth, maxWidth: menuWidth, ...menuProps?.PaperProps?.style },
          },
        },
        renderValue: (selected) =>
          selected ? (
            labelFor(selected as string)
          ) : (
            <span className="text-[rgba(26,26,24,0.3)]">
              {loading ? "Loading..." : placeholder}
            </span>
          ),
      }}
    >
      {normalized.length ? (
        normalized.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{ whiteSpace: "normal" }}
          >
            {option.label}
          </MenuItem>
        ))
      ) : (
        // An empty list would open as a blank box — say so instead.
        <MenuItem
          disabled
          value="__no_options__"
          sx={{ fontSize: 14, fontStyle: "italic" }}
        >
          No options available
        </MenuItem>
      )}
    </TextField>
  );
}

