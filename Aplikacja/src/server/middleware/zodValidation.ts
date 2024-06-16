import type { RequestHandler } from "express";
import type { ZodIssueCode, ZodSchema } from "zod";

export const validateBody =
    (schema: ZodSchema): RequestHandler =>
    (req, res, next) => {
        console.log("body", req.body);
        const parsed = schema.safeParse(req.body);
        if (parsed.success) {
            next();
        } else {
            console.error("blad walidacji", req.path, parsed.error.message);
            const errorObject = parsed.error.errors.map((error) => ({
                type: error.code,
                msg: error.message,
                path: error.path.join("/"),
            }));
            res.status(400).json({ errors: errorObject } satisfies ValidationErrorBody);
        }
    };

export interface ValidationErrorBody {
    errors: FieldValidationError[];
}

export interface FieldValidationError {
    type: ZodIssueCode;
    msg: string;
    path: string;
}
