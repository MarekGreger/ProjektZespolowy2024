import { z } from "zod";
import { defaultMessage } from "./zodHelpers";

export const uslugaSchema = z.object(
    {
        Opis: z.string(defaultMessage("Opis jest wymagany.")).min(1, "Opis jest wymagany.").default(""),
        Nazwa: z.string(defaultMessage("Nazwa jest wymagana.")).min(1, "Nazwa jest wymagana.").default(""),
    },
    defaultMessage("Niepoprawny format")
);

export type UslugaPayload = z.infer<typeof uslugaSchema>;
export type Usluga = {
    IdUsluga: number;
    Opis: string;
    Nazwa: string;
};
