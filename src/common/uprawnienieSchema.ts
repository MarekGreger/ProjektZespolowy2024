import { z } from "zod";
import { roles } from "./userRoles";
import { defaultMessage } from "./zodHelpers";

export const uprawnienieSchema = z.object(
    {
        email: z.string(defaultMessage("Email jest wymagany.")).email("Niepoprawny format adresu e-mail").default(""),
        nazwa: z.string(defaultMessage("Nazwa jest wymagana.")).default(""),
        rola: z.enum(roles).default("brak"),
    },
    defaultMessage("niepoprawny format")
);

export type UprawnieniePayload = z.infer<typeof uprawnienieSchema>;
export type Uprawnienie = {
    email: string;
    nazwa: string;
    rola: string;
    id: number;
};