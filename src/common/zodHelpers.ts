import type { ZodIssueOptionalMessage } from "zod";

export const numeric = /^\d+$/;
export const defaultMessage = (message: string) => ({
    errorMap: (i: ZodIssueOptionalMessage) => ({
        message: i.message ?? message,
    }),
});