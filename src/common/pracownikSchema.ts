import { z } from "zod";
import { defaultMessage, numeric } from "./zodHelpers";

export const pracownikSchema = z.object(
    {
        Email: z.string().email("Niepoprawny format adresu e-mail").default(""),
        Telefon: z.string().regex(numeric).length(9, "Telefon musi mieć 9 cyfr").default(""),
        Imie: z.string().min(1, "Imie jest wymagane.").default(""),
        Nazwisko: z.string().min(1, "Nazwisko jest wymagane.").default(""),
    },
    defaultMessage("Niepoprawny format")
);

export type PracownikPayload = z.infer<typeof pracownikSchema>;
export type Pracownik = {
    Imie: string;
    Nazwisko: string;
    Telefon: string;
    Email: string;
    IdPracownik: number
}