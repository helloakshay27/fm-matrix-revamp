// The backend answers a refused request with { errors: ["message", ...] } (validation failures) or
// { error: "message" } (rules such as an expired club membership). Show that text rather than a generic failure.
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const data = (error as { response?: { data?: any } } | undefined)?.response?.data;
  const errors = data?.errors;
  // Some endpoints answer with a bare message string; an HTML error page is not a message.
  const text = typeof data === "string" ? data.trim() : "";
  const detail =
    (text && text.length <= 300 && !text.startsWith("<") ? text : undefined) ??
    (Array.isArray(errors) && errors.length > 0 ? errors.map(String).join("; ") : undefined) ??
    (typeof errors === "string" && errors ? errors : undefined) ??
    (typeof data?.error === "string" && data.error ? data.error : undefined) ??
    (typeof data?.message === "string" && data.message ? data.message : undefined);
  return detail ? `${fallback}: ${detail}` : fallback;
};
