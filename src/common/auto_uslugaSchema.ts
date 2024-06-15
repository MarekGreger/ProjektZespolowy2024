import { z } from "zod";
import { defaultMessage } from "./zodHelpers";

export const auto_uslugaSchema = z.object(
    {
        Auto_IdAuto: z.number().min(1,"ID auta musi być większe od 0."),
        Usluga_IdUsluga: z.number(defaultMessage("Usługa jest wymagana.")).min(1,"ID uslugi musi być większe od 0."),
    },
    defaultMessage("Niepoprawny format")
);

export type Auto_uslugaPayload = z.infer<typeof auto_uslugaSchema>;
export type Auto_usluga = {
    Auto_IdAuto: number,
    Usluga_IdUsluga: number
}