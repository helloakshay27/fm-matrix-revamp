import { isAxiosError } from "axios";

// Pulls a readable message out of a Rails-style error response
// ({ error }, { message } or { errors: [...] }).
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError(error)) return fallback;
  const data = error.response?.data as Record<string, unknown> | undefined;
  if (!data) return fallback;

  if (typeof data.error === "string") return data.error;
  if (typeof data.message === "string") return data.message;
  if (Array.isArray(data.errors) && data.errors.length) return data.errors.map(String).join(", ");
  return fallback;
}
