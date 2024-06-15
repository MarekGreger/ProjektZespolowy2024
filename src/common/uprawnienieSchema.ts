import { z } from "zod";
import { roles } from "./userRoles";
import { defaultMessage } from "./zodHelpers";

export const uprawnienieSchema = z.object(
    {
        email: z.string().email().default("Niepoprawny format adresu e-mail"),
        nazwa: z.string().default(""),
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