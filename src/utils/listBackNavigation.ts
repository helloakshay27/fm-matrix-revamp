export type ReturnToState = {
  returnTo?: string;
};

const isSafeInternalPath = (value: unknown): value is string =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//");

export const buildReturnToPath = (pathname: string, search = "", hash = "") =>
  `${pathname}${search}${hash}`;

export const getReturnToFromState = (state: unknown): string | null => {
  if (!state || typeof state !== "object") return null;
  const returnTo = (state as ReturnToState).returnTo;
  return isSafeInternalPath(returnTo) ? returnTo : null;
};
