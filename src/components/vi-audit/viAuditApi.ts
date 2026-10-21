// Shared helpers for the Vi Audit API calls.

/** Best-effort message from an API error body ({ message } / { error } / { errors }). */
export const apiErrorMessage = (body: unknown): string => {
  if (!body || typeof body !== "object") return "";
  const b = body as Record<string, unknown>;
  if (typeof b.message === "string") return b.message;
  if (typeof b.error === "string") return b.error;
  if (Array.isArray(b.errors)) return b.errors.filter((e) => typeof e === "string").join(", ");
  if (b.errors && typeof b.errors === "object") {
    return Object.entries(b.errors as Record<string, unknown>)
      .map(([field, msgs]) => `${field} ${Array.isArray(msgs) ? msgs.join(", ") : String(msgs)}`)
      .join("; ");
  }
  return "";
};
