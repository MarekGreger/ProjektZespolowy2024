import { z } from "zod";
import { defaultMessage } from "./zodHelpers";
import { AcceptanceStatus } from "./AcceptanceStatus";
import dayjs from "dayjs";
import { DateTimeFormFormat } from "./DateTime";

const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

const datetimeSchema = z.string(defaultMessage("Podanie czasu jest wymagane.")).refine((value) => {
    return datetimeRegex.test(value);
}, {
    message: "Nieprawidłowy format daty i czasu (oczekiwano 'DD-MM-RRRR GG:MM:SS')",
});

export const grafikSchema = z.object(
    {
        Pracownik_IdPracownik: z.number(defaultMessage("Pracownink jest wymagany.")).min(1,"ID pracownika musi być większe od 0."),
        Klient_IdKlient: z.number(defaultMessage("Podany klient jest wymagany.")).min(1,"ID klienta musi być większe od 0."),
        Czas_rozpoczecia: datetimeSchema,
        Czas_zakonczenia: datetimeSchema,
        Status: z.enum(["przesłane", "zaakceptowane", "odrzucone"]).default("przesłane"),
    }
).refine(
    (obj) => {
        const pred = dayjs(obj.Czas_rozpoczecia, DateTimeFormFormat).isBefore(
            dayjs(obj.Czas_zakonczenia, DateTimeFormFormat)
        );
        console.log("refinement", pred)
        return pred;
    },
    {
        message: "Czas zakończenia nie może być przed czasem rozpoczęcia",
        path: ["Czas_zakonczenia"],
    }
)

export type GrafikPayload = z.infer<typeof grafikSchema>;
export type Grafik = {
    IdGrafik: number,
    Pracownik_IdPracownik: number,
    Klient_IdKlient: number,
    Czas_rozpoczecia: string,
    Czas_zakonczenia: string,
    Imie: string,
    Nazwisko: string,
    Nazwa: string,
    Status: AcceptanceStatus
}
