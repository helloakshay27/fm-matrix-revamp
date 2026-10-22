import { toNestErrors } from "@hookform/resolvers";
import type { FieldError, FieldValues, Resolver } from "react-hook-form";
import type { z } from "zod";

// @hookform/resolvers 3.x only recognises Zod 3 errors (`error.errors`), so with
// Zod 4 (`error.issues`) its zodResolver rethrows instead of returning field
// errors. This resolver reads Zod 4 issues directly via safeParseAsync.
export const zodResolver =
    <TFieldValues extends FieldValues>(
        schema: z.ZodType<TFieldValues, unknown>
    ): Resolver<TFieldValues> =>
    async (values, _context, options) => {
        const result = await schema.safeParseAsync(values);

        if (result.success) {
            return { values: result.data, errors: {} };
        }

        // Keep only the first issue per field, matching the stock resolver.
        const errors: Record<string, FieldError> = {};
        for (const issue of result.error.issues) {
            const path = issue.path.join(".");
            if (!errors[path]) {
                errors[path] = { type: issue.code, message: issue.message };
            }
        }

        return { values: {}, errors: toNestErrors(errors, options) };
    };
