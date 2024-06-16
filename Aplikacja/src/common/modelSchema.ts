import { z } from "zod";
import { defaultMessage } from "./zodHelpers";

export const modelSchema = z.object(
    {
        Marka: z.string(defaultMessage("Marka jest wymagana.")).min(1, "Marka jest wymagana.").default(""),
        Model: z.string(defaultMessage("Model jest wymagany.")).min(1, "Model jest wymagany.").default(""),
    },
    defaultMessage("Niepoprawny format")
);

export type ModelPayload = z.infer<typeof modelSchema>;
export type Model = {
    IdModel: number;
    Marka: string;
    Model: string;
}