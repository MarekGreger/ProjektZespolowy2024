import { z } from "zod";
import { defaultMessage } from "./zodHelpers";

export const wersja_umowySchema = z.object(
    {
        Usluga_IdUsluga: z.number(defaultMessage("Usługa jest wymagana.")).min(1,"ID uslugi musi być większe od 0."),
        Umowa_IdUmowa: z.number(defaultMessage("Umowa jest wymagana.")).min(1,"ID umowy musi być większe od 0."),
        Cena: z.number(defaultMessage("Cena jest wymagana.")).min(0.01,"Cena musi być większa od 0."),
    },
    defaultMessage("Niepoprawny format")
);

export type Wersja_umowyPayload = z.infer<typeof wersja_umowySchema>;
export type Wersja_umowy= {
    Usluga_IdUsluga: number;
    Umowa_IdUmowa: number;
    Cena: number;
}