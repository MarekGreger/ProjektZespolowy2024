import app from "../app";
import {connection} from "../app";
import { Request, Response } from "express";
import { validateBody } from "../middleware/zodValidation";
import { UmowaPayload, umowaSchema } from "../../common/umowaSchema";
import { authenticate, authorize, getUserData } from "../middleware/firebaseAuth";
import {ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { roleGreaterOrEqual } from "../../common/userRoles";

app.post(
    "/Umowa",
    authenticate,
    authorize((user) => roleGreaterOrEqual(user["role"], "admin")),
    validateBody(umowaSchema),
    async (req: Request, res: Response) => {
        const umowaData = req.body as UmowaPayload;
        const user = getUserData(res);
        console.log("user:", user);
        try {
            const dbConnection = await connection;
            await dbConnection.query("INSERT INTO Umowa ( Klient_IdKlient, Data_rozpoczecia, Data_zakonczenia) VALUES ( ?, ?, ?)",
             [ umowaData.Klient_IdKlient, umowaData.Data_rozpoczecia , umowaData.Data_zakonczenia ]);

            res.status(200).send("Umowa została pomyślnie dodana");
        } catch (error) {
            console.error(error);
            res.status(500).send("Wystąpił błąd podczas zapisywania umowy");
        }
    }
);

app.get('/Umowa', authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "kierownik")), async (req: Request, res: Response) => {
    try {
        const [results] = await connection.query<RowDataPacket[]>(`
        SELECT 
            U.IdUmowa,
            U.Klient_IdKlient,
            K.Nazwa,
            U.Data_rozpoczecia,
            U.Data_zakonczenia
        FROM db_main.Umowa U LEFT JOIN db_main.Klient K ON U.Klient_IdKlient = K.IdKlient;`);
        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Wystąpił błąd podczas pobierania danych umów');
    }
});

app.get('/Umowa/:id', authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "kierownik")), async (req: Request, res: Response) => {
    const umowaId = req.params["id"];

    const [results] = await connection.query<RowDataPacket[]>(`
    SELECT U.IdUmowa,
        U.Klient_IdKlient,
        UU.IdUsluga,
        K.Nazwa,
        UU.Nazwa_uslugi,
        WU.Cena,
        U.Data_rozpoczecia,
        U.Data_zakonczenia
    FROM db_main.Umowa U LEFT JOIN db_main.Klient K ON U.Klient_IdKlient = K.IdKlient
    JOIN db_main.Wersja_umowy WU ON U.IdUmowa = WU.Umowa_IdUmowa
    LEFT JOIN db_main.Usluga UU ON WU.Usluga_IdUsluga = UU.IdUsluga 
    WHERE U.IdUmowa = ?`, [umowaId]);
   try {
      console.log(results);
       if (results.length === 0) {
           return res.status(404).send('Umowa nie została znaleziona');
       }
      return res.json(results[0]);
   } catch (error) {
       console.error(error);
       return res.status(500).send('Wystąpił błąd podczas pobierania danych umowy');
   }
});

app.delete('/Umowa/:id', authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "admin")), async (req: Request, res: Response) => {
    const umowaId = req.params["id"];

    const [results] = await connection.query<ResultSetHeader>("DELETE FROM Umowa WHERE IdUmowa = ?", [umowaId]);
   try {
      console.log(results);
       if (results.affectedRows === 0) {
           return res.status(404).send('Umowa nie został znaleziona');
       }
       return res.status(200).send("Umowa została usunięta");
   } catch (error) {
       console.error(error);
       return res.status(500).send('Wystąpił błąd podczas usuwania danych umowy');
   }
});

app.patch(
    "/Umowa/:id",
    authenticate,
    authorize((user) => roleGreaterOrEqual(user["role"], "admin")),
    validateBody(umowaSchema.partial()), 
    async (req: Request, res: Response) => {
        const umowaId = req.params["id"];
        const umowaData = req.body as Partial<UmowaPayload>; 

        const updates = [];
        const values = [];
        for (const [key, value] of Object.entries(umowaData)) {
            if (value !== undefined) {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (updates.length === 0) {
            return res.status(400).send("Brak danych do aktualizacji");
        }

        const query = `UPDATE Umowa SET ${updates.join(", ")} WHERE IdUmowa= ?`;
        values.push(umowaId);

        try {
            const [results] = await connection.query<ResultSetHeader>(query, values);

            if (results.affectedRows === 0) {
                return res.status(404).send("Umowa nie została znaleziona");
            }

            return res.status(200).send("Umowa została zaktualizowana");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Wystąpił błąd podczas aktualizacji umowy");
        }
    }
);