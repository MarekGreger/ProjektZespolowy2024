import { z } from "zod";
import { defaultMessage } from "./zodHelpers";
import { DateTimeFormFormat } from "./DateTime";
import dayjs from "dayjs";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const dateSchema = z.string(defaultMessage("Podanie daty jest wymagane.")).refine((value) => {
    return dateRegex.test(value);
}, {
    message: "Nieprawidłowy format daty (oczekiwano 'DD-MM-RRRR').",
});

export const umowaSchema = z.object(
    {
        Klient_IdKlient: z.number(defaultMessage("Klient jest wymagany.")).min(1,"ID klienta musi być większe od 0."),
        Data_rozpoczecia: dateSchema,
        Data_zakonczenia: dateSchema,
    },
    defaultMessage("Niepoprawny format")
).refine(
    (obj) => {
        const pred = dayjs(obj.Data_rozpoczecia, DateTimeFormFormat).isBefore(
            dayjs(obj.Data_zakonczenia, DateTimeFormFormat)
        );
        console.log("refinement", pred)
        return pred;
    },
    {
        message: "Czas zakończenia nie może być przed czasem rozpoczęcia",
        path: ["Czas_zakonczenia"],
    }
);

export type UmowaPayload = z.infer<typeof umowaSchema>;
export type Umowa = {
    IdUmowa: number;
    Klient_IdKlient: number;
    Data_rozpoczecia: string;
    Data_zakonczenia: string;
    Nazwa: string;
}