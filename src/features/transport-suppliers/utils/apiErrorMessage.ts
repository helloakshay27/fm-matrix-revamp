import { isAxiosError } from "axios";

// Pulls a readable message out of a Rails-style error response
// ({ error }, { message }, { errors: { field: [...] } } or { errors: [...] }).
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError(error)) return fallback;
  const data = error.response?.data as Record<string, unknown> | undefined;
  if (!data) return fallback;

  if (typeof data.error === "string") return data.error;
  if (typeof data.message === "string") return data.message;

  const errors = data.errors;
  if (Array.isArray(errors) && errors.length) return errors.map(String).join(", ");
  if (errors && typeof errors === "object") {
    const messages = Object.entries(errors as Record<string, unknown>).map(
      ([field, value]) =>
        `${field.replace(/_/g, " ")} ${Array.isArray(value) ? value.join(", ") : String(value)}`
    );
    if (messages.length) return messages.join("; ");
  }
  return fallback;
}
