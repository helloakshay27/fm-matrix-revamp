/** Pulls a readable message out of an axios error from the Rails API. */
export const errorMessage = (error: unknown, fallback: string) => {
  const data = (error as { response?: { data?: unknown } })?.response?.data as
    | {
        error?: string;
        message?: string;
        errors?: string[] | Record<string, string[]>;
      }
    | undefined;
  if (!data) return fallback;
  if (data.error) return data.error;
  if (data.message) return data.message;
  if (Array.isArray(data.errors)) return data.errors.join(", ");
  if (data.errors && typeof data.errors === "object") {
    return Object.entries(data.errors)
      .map(([field, msgs]) => `${field} ${[].concat(msgs as never).join(", ")}`)
      .join("; ");
  }
  return fallback;
};

export const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

export const parsePage = (value: string | null) => {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
};

/** MUI input sizing shared by the master dialogs (matches MaterialPRFilterDialog). */
export const muiFieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

/** MUI multiline TextField styles — auto height, no resize handle, hidden autosize mirror. */
export const muiTextareaStyles = {
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
};
