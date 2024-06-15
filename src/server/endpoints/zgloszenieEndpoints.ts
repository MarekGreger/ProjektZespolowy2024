import {Zgloszenie, ZgloszeniePayload, zgloszenieSchema } from "../../common/zgloszenieSchema";
import { Request, Response } from "express";
import app from "../app";
import {connection} from "../app";
import { validateBody } from "../middleware/zodValidation";
import {ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { authenticate, authorize, getUserData } from "../middleware/firebaseAuth";
import { roleGreaterOrEqual } from "../../common/userRoles";
import { z } from "zod";

app.post(
    "/Zgloszenie",
    authenticate,
    validateBody(zgloszenieSchema),
    authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")),
    async (req: Request, res: Response) => {
        const zgloszenieData = req.body as ZgloszeniePayload;

        try {
            const dbConnection = await connection;
            await dbConnection.query("INSERT INTO Zgloszenie ( Pracownik_IdPracownik, Klient_IdKlient, Opis, Status) VALUES ( ?, ?, ?, ?)",
             [ zgloszenieData.Pracownik_IdPracownik, zgloszenieData.Klient_IdKlient, zgloszenieData.Opis, zgloszenieData.Status]);

            res.status(200).send("Zgłoszenie zostało pomyślnie dodane");
        } catch (error) {
            console.error(error);
            res.status(500).send("Wystąpił błąd podczas zapisywania zgłoszenia");
        }
    }
);

app.get(
    '/Zgloszenie/:id',
    authenticate, 
    authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")),
    async (req: Request, res: Response) => {
    const zgloszenieID = req.params["id"];

        const [results] = await connection.query<RowDataPacket[]>(`
        SELECT 
            Z.IdZgloszenie,
            Z.Klient_IdKlient,
            Z.Pracownik_IdPracownik, 
            P.Imie, 
            P.Nazwisko,
            K.Nazwa AS NazwaKlienta,
            Z.Opis,
            Z.Status
        FROM db_main.Zgloszenie Z 
        LEFT JOIN db_main.Klient K ON Z.Klient_IdKlient = K.IdKlient
        LEFT JOIN db_main.Pracownik P ON Z.Pracownik_IdPracownik = P.IdPracownik
        WHERE Z.IdZgloszenie = ?`, [zgloszenieID]
    );
        try {
            console.log(results);
            if (results.length === 0) {
                return res.status(404).send('Zgłoszenie nie zostało znalezione');
            }
            return res.json(results[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Wystąpił błąd podczas pobierania danych zgłoszenia');
        }
    }
);

app.delete(
    '/Zgloszenie/:id',
     authenticate, 
     authorize((user) => roleGreaterOrEqual(user["role"], "admin")),  
     async (req: Request, res: Response) => {
    const zgloszenieID = req.params["id"];

        const [results] = await connection.query<ResultSetHeader>("DELETE FROM Zgloszenie WHERE IdZgloszenie = ?", [zgloszenieID]);
        try {
            console.log(results);
            if (results.affectedRows === 0) {
                return res.status(404).send('Zgłoszenie nie zostało znalezione');
            }
            return res.status(200).send("Zgłoszenie zostało usunięte");
        } catch (error) {
            console.error(error);
            return res.status(500).send('Wystąpił błąd podczas usuwania danych zgloszenia');
        }
    }
);

app.get(
    '/Zgloszenie',
     authenticate, 
     authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")), 
     async (req: Request, res: Response) => {
        try {
            const [results] = await connection.query<RowDataPacket[]>(`
            SELECT 
                Z.IdZgloszenie,
                Z.Klient_IdKlient,
                Z.Pracownik_IdPracownik, 
                P.Imie, 
                P.Nazwisko,
                K.Nazwa AS NazwaKlienta,
                Z.Opis,
                Z.Status
            FROM db_main.Zgloszenie Z 
            LEFT JOIN db_main.Klient K ON Z.Klient_IdKlient = K.IdKlient
            LEFT JOIN db_main.Pracownik P ON Z.Pracownik_IdPracownik = P.IdPracownik;
        `);
            if (results.length === 0) {
                return res.status(200).send('Nie znaleziono zgloszen');
            }
            return res.json(results);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Wystąpił błąd podczas pobierania zgłoszenia');
        }
    }
);

app.patch(
    "/Zgloszenie/:id",
    authenticate,
    authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")), 
    validateBody(zgloszenieSchema.partial()), 
    async (req: Request, res: Response) => {

        const user = getUserData(res);
        const zgloszenieId = req.params["id"];
        const zgloszenieData = req.body as Partial<ZgloszeniePayload>; 

        if(user &&user['role'] === "pracownik")
        {
            const [zgloszenieResult] = await connection.query<RowDataPacket[]>("SELECT Status FROM Zgloszenie WHERE IdZgloszenie = ? AND Status <> 'zaakceptowane'", [zgloszenieId]);

            if (zgloszenieResult.length === 0 || !zgloszenieResult[0]) {
                return res.status(404).send('Pracownik nie może modyfikować zaakceptowanych zgłoszeń');
            }
        }


        const updates = [];
        const values = [];
        for (const [key, value] of Object.entries(zgloszenieData)) {
            if (value !== undefined) {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (updates.length === 0) {
            return res.status(400).send("Brak danych do aktualizacji");
        }

        const query = `UPDATE Zgloszenie SET ${updates.join(", ")} WHERE IdZgloszenie = ?`;
        values.push(zgloszenieId);

        try {
            const [results] = await connection.query<ResultSetHeader>(query, values);

            if (results.affectedRows === 0) {
                return res.status(404).send("Zgłoszenie nie zostało znalezione");
            }

            return res.status(200).send("Zgłoszenie zostało zaktualizowane");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Wystąpił błąd podczas aktualizacji zgłoszenia");
        }
    }
);

app.put(
    "/Zgloszenie/:id/acceptance",
    authenticate,
    authorize("kierownik"),
    async (req: Request, res: Response) => {
        const zgloszeniekId = req.params["id"];

        try {
            const dbConnection = await connection;
            await dbConnection.query("UPDATE Zgloszenie SET Status = 'Zaakceptowane' WHERE IdZgloszenie = ?", [zgloszeniekId]);

            res.status(200).send("Zgłoszenie zostało zaakceptowane");
        } catch (error) {
            console.error(error);
            res.status(500).send("Wystąpił błąd podczas aktualizacji zgłoszenia");
        }
    }
);

app.delete(
    "/Zgloszenie/:id/acceptance",
    authenticate,
    authorize("kierownik"),
    async (req: Request, res: Response) => {
        const zgloszenieId = req.params["id"];

        try {
            const dbConnection = await connection;
            await dbConnection.query("UPDATE Zgloszenie SET Status = 'Odrzucone' WHERE IdZgloszenie = ?", [zgloszenieId]);

            res.status(200).send("Zgłoszenie zostało odrzucone");
        } catch (error) {
            console.error(error);
            res.status(500).send("Wystąpił błąd podczas aktualizacji zgłoszenia");
        }
    }
);
