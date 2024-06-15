import { z } from "zod";

import { defaultMessage } from "./zodHelpers";
import dayjs from "dayjs";
import { DateTimeFormFormat } from "./DateTime";

const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

const datetimeSchema = z.string(defaultMessage("Podanie czasu jest wymagane.")).refine(
    (value) => {
        return datetimeRegex.test(value);
    },
    {
        message: "Nieprawidłowy format daty i czasu (oczekiwano 'DD-MM-RRRR GG:MM:SS')",
    }
);

export const autoSchema = z
    .object({
        Model_IdModel: z
            .number(defaultMessage("Model jest wymagany."))
            .min(1, "ID modelu musi być większe od 0."),
        Klient_IdKlient: z
            .number(defaultMessage("Klient jest wymagany."))
            .min(1, "ID klienta musi być większe od 0."),
        Rejestracja: z.string().min(1, "Rejestracja jest wymagana.").default(""),
        Czas_rozpoczecia: datetimeSchema,
        Czas_zakonczenia: datetimeSchema.optional(),
        Dodatkowe_informacje: z.string().default(""),
    })
    .refine(
        (obj) => {
            const pred = dayjs(obj.Czas_rozpoczecia, DateTimeFormFormat).isBefore(
                dayjs(obj.Czas_zakonczenia, DateTimeFormFormat)
            );
            console.log("refinement", pred);
            return pred;
        },
        {
            message: "Czas zakończenia nie może być przed czasem rozpoczęcia",
            path: ["Czas_zakonczenia"],
        }
    );

export type AutoPayload = z.infer<typeof autoSchema>;
export type Auto = {
    IdAuto: number;
    IdModel: number;
    Marka: string;
    Model: string;
    IdKlient: number;
    Klient_nazwa: string;
    Rejestracja: string;
    Czas_rozpoczecia: string;
    Czas_zakonczenia: string;
    Dodatkowe_informacje: string;
    Pracownicy: string;
    Uslugi: string;
};
