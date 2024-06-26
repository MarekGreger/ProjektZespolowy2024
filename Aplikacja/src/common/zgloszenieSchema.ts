import { z } from "zod";
import { defaultMessage } from "./zodHelpers";
import { AcceptanceStatus } from "./AcceptanceStatus";

export const zgloszenieSchema = z.object(
    {
        Pracownik_IdPracownik: z.number(defaultMessage("Pracownik jest wymagany.")).min(1,"ID pracownika musi być większe od 0."),
        Klient_IdKlient: z.number(defaultMessage("Klient jest wymagany.")).min(1,"ID klienta musi być większe od 0."),
        Opis: z.string(defaultMessage("Opis jest wymagany.")).min(1, "Opis jest wymagany.").default(""),
        //Status: z.enum(["przesłane", "zaakceptowane", "odrzucone"]).default("przesłane"),
    },
    defaultMessage("Niepoprawny format")
);

export type ZgloszeniePayload = z.infer<typeof zgloszenieSchema>;

export type Zgloszenie = {
    IdZgloszenie: number;
    Opis: string;
    Status: AcceptanceStatus;
    Pracownik_IdPracownik: number;
    Imie: string;
    Nazwisko: string;
    Klient_IdKlient: number;
    NazwaKlienta: string;
}
