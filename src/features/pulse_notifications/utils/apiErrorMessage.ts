interface ApiErrorShape {
  response?: {
    data?: {
      message?: string;
      error?: string;
      errors?: string[] | Record<string, string[]>;
    };
  };
  message?: string;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const err = error as ApiErrorShape;
  const errors = err?.response?.data?.errors;

  if (Array.isArray(errors) && errors.length > 0) {
    return errors.join(", ");
  }
  if (errors && typeof errors === "object") {
    const flattened = Object.entries(errors).map(
      ([field, messages]) => `${field} ${messages.join(", ")}`
    );
    if (flattened.length > 0) return flattened.join("; ");
  }

  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}
