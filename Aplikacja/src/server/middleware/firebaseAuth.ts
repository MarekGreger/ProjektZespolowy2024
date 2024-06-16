import { RequestHandler, Response } from "express";
import firebaseAdmin from "firebase-admin";
import { ServiceAccount, initializeApp } from "firebase-admin/app";

import adminCredentials from "../../../firebase-admin.private.json";
import { Role, roleGreaterOrEqual } from "../../common/userRoles";

initializeApp({
    credential: firebaseAdmin.credential.cert(adminCredentials as ServiceAccount),
});

export const authenticate: RequestHandler = async (req, res, next) => {
    const headerToken = req.headers.authorization;
    if (!headerToken) {
        res.status(401).send("Brak tokenu uwierzytelniajacego");
        console.log("brak tokenu");
        return;
    }

    const headerParts = headerToken.split(" ");
    if (headerParts.length < 2 || headerParts[0] !== "Bearer" || !headerParts[1]) {
        res.status(401).send("Nieprawidlowy format tokenu uwierzytelniajacego");
        console.log("nieprawidłowy token");
        return;
    }

    const token = headerParts[1].trim();

    try {
        const userData = await firebaseAdmin.auth().verifyIdToken(token);
        res.locals["user"] = userData;
        next();
    } catch (e) {
        console.log("nieuwierzytelniony token", e);
        res.status(401).send("Blad uwierzytelnienia: Brak dostepu do serwisu");
    }
};

export type AuthorizationRule = (user: DecodedIdToken) => boolean;
export const authorize: (rule: AuthorizationRule | Role) => RequestHandler =
    (rule) => (req, res, next) => {
        const userData = getUserData(res)!;
        const authorized =
            typeof rule === "string"
                ? roleGreaterOrEqual(userData["role"], rule)
                : rule(userData);
        if (!authorized) {
            res.status(403).send("Twoje konto nie posiada odpowiednich zezwolen");
            console.log("unauthorized: ", userData);
            return;
        }
        next();
    };

export const getUserData = (res: Response): DecodedIdToken | null => res.locals["user"] ?? null;

export interface DecodedIdToken {
    aud: string;
    auth_time: number;
    email?: string;
    email_verified?: boolean;
    exp: number;
    firebase: {
        identities: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: any;
        };
        sign_in_provider: string;
        sign_in_second_factor?: string;
        second_factor_identifier?: string;
        tenant?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    };
    iat: number;
    iss: string;
    phone_number?: string;
    picture?: string;
    sub: string;
    uid: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}
