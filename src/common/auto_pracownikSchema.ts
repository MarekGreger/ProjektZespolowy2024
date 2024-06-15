import { z } from "zod";
import { defaultMessage } from "./zodHelpers";

export const auto_pracownikSchema = z.object(
    {
        Auto_IdAuto: z.number().min(1,"ID auta musi być większe od 0."),
        Pracownik_IdPracownik: z.number().min(1,"ID pracownika musi być większe od 0."),
    },
    defaultMessage("Niepoprawny format")
);

export type Auto_pracownikPayload = z.infer<typeof auto_pracownikSchema>;
export type Auto_pracownik = {
    Pracownik_IdPracownik: number,
    Auto_IdAuto: number
}