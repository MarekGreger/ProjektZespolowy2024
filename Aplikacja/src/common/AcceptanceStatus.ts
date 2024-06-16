import { z } from "zod";

export const statusSchema = z.enum(["przesłane", "zaakceptowane", "odrzucone"]).default("przesłane");
export const acceptanceOptions = statusSchema.removeDefault().options;
export type AcceptanceStatus = z.infer<typeof statusSchema>