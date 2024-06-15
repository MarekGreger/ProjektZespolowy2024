import app from "../app";
import {connection} from "../app";
import { Request, Response } from "express";
import { validateBody } from "../middleware/zodValidation";
import {AutoPayload, autoSchema } from "../../common/autoSchema";
import { authenticate, authorize, getUserData } from "../middleware/firebaseAuth";
import {ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { roleGreaterOrEqual } from "../../common/userRoles";

app.post(
    "/Auto",
    authenticate,
    validateBody(autoSchema),
    authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")),
    async (req: Request, res: Response) => {
        const autoData = req.body as AutoPayload;
        const user = getUserData(res);
        console.log("user:", user);
        try {
            const dbConnection = await connection;
            await dbConnection.query("INSERT INTO Auto ( Model_IdModel, Klient_IdKlient, Rejestracja, Czas_rozpoczecia, Czas_zakonczenia, Dodatkowe_informacje) VALUES ( ?, ?, ?, ?, ?, ?)",
             [ autoData.Model_IdModel, autoData.Klient_IdKlient, autoData.Rejestracja, autoData.Czas_rozpoczecia , autoData.Czas_zakonczenia, autoData.Dodatkowe_informacje]);

            res.status(200).send("Auto zostało dodane pomyślnie");
        } catch (error) {
            console.error(error);
            res.status(500).send("Wystąpił błąd podczas zapisywania auta");
        }
    }
);

app.get('/Auto',authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")), async (req: Request, res: Response) => {
    try {
        const [results] = await connection.query<RowDataPacket[]>(`
        WITH A AS (
            SELECT A.IdAuto AS IdAuto,
                A.Klient_IdKlient AS IdKlient,
                A.Model_IdModel AS IdModel,
                A.Rejestracja AS Rejestracja,
                M.Marka AS Marka, 
                M.Model AS Model,
                A.Czas_rozpoczecia AS Czas_rozpoczecia,
                A.Czas_zakonczenia AS Czas_zakonczenia,
                K.Nazwa AS Klient_nazwa,
                GROUP_CONCAT(P.Imie, ' ', P.Nazwisko SEPARATOR ', ') AS Pracownicy,
                A.Dodatkowe_informacje AS Dodatkowe_informacje
            FROM db_main.Auto A 
                LEFT JOIN db_main.Klient K ON A.Klient_IdKlient = K.IdKlient
                LEFT JOIN db_main.Model M ON A.Model_IdModel = M.IdModel
                LEFT JOIN db_main.Auto_Pracownik AP ON A.IdAuto = AP.Auto_IdAuto
                LEFT JOIN db_main.Pracownik P ON AP.Pracownik_IdPracownik = P.IdPracownik
            GROUP BY A.IdAuto, A.Klient_IdKlient
        )
        SELECT DISTINCT A.IdAuto,
            A.IdKlient,
            A.IdModel,
            A.Rejestracja,
            A.Marka, 
            A.Model,
            A.Czas_rozpoczecia,
            IFNULL(A.Czas_zakonczenia, 'W trakcie') AS Czas_zakonczenia,
            A.Klient_nazwa,
            A.Pracownicy,
            A.Dodatkowe_informacje,
            GROUP_CONCAT(U.Nazwa SEPARATOR ', ') AS Uslugi
        FROM A
            LEFT JOIN db_main.Auto_Usluga AU ON A.IdAuto = AU.Auto_IdAuto
            LEFT JOIN db_main.Usluga U ON AU.Usluga_IdUsluga = U.IdUsluga
        GROUP BY A.IdAuto, A.IdKlient;
    `);
        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Wystąpił błąd podczas pobierania danych aut');
    }
});

app.get('/Auto/:id',authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")), async (req: Request, res: Response) => {
    const autoId = req.params["id"];

    const [results] = await connection.query<RowDataPacket[]>(`
    WITH A AS (
        SELECT A.IdAuto AS IdAuto,
            A.Klient_IdKlient AS IdKlient,
            A.Model_IdModel AS IdModel,
            A.Rejestracja AS Rejestracja,
            M.Marka AS Marka, 
            M.Model AS Model,
            A.Czas_rozpoczecia AS Czas_rozpoczecia,
            A.Czas_zakonczenia AS Czas_zakonczenia,
            K.Nazwa AS Klient_nazwa,
            GROUP_CONCAT(P.Imie, ' ', P.Nazwisko SEPARATOR ', ') AS Pracownicy,
            A.Dodatkowe_informacje AS Dodatkowe_informacje
        FROM db_main.Auto A 
            LEFT JOIN db_main.Klient K ON A.Klient_IdKlient = K.IdKlient
            LEFT JOIN db_main.Model M ON A.Model_IdModel = M.IdModel
            LEFT JOIN db_main.Auto_Pracownik AP ON A.IdAuto = AP.Auto_IdAuto
            LEFT JOIN db_main.Pracownik P ON AP.Pracownik_IdPracownik = P.IdPracownik
        GROUP BY A.IdAuto, A.Klient_IdKlient
    )
    SELECT DISTINCT A.IdAuto,
        A.IdKlient,
        A.IdModel,
        A.Rejestracja,
        A.Marka, 
        A.Model,
        A.Czas_rozpoczecia,
        IFNULL(A.Czas_zakonczenia, 'W trakcie') AS Czas_zakonczenia,
        A.Klient_nazwa,
        A.Pracownicy,
        A.Dodatkowe_informacje,
        GROUP_CONCAT(U.Nazwa SEPARATOR ', ') AS Uslugi
    FROM A
        LEFT JOIN db_main.Auto_Usluga AU ON A.IdAuto = AU.Auto_IdAuto
        LEFT JOIN db_main.Usluga U ON AU.Usluga_IdUsluga = U.IdUsluga
    WHERE A.IdAuto = ?
    GROUP BY A.IdAuto, A.IdKlient;`, [autoId]);
   try {
      console.log(results);
       if (results.length === 0) {
           return res.status(404).send('Auto nie został znalezione');
       }
      return res.json(results[0]);
   } catch (error) {
       console.error(error);
       return res.status(500).send('Wystąpił błąd podczas pobierania danych auta');
   }
});

app.delete('/Auto/:id',authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "admin")), async (req: Request, res: Response) => {
    const autoId = req.params["id"];

    const [results] = await connection.query<ResultSetHeader>("DELETE FROM Auto WHERE IdAuto = ?", [autoId]);
   try {
      console.log(results);
       if (results.affectedRows === 0) {
           return res.status(404).send('Auto nie został znalezione');
       }
       return res.status(200).send("Auto zostało usunięte");
   } catch (error) {
       console.error(error);
       return res.status(500).send('Wystąpił błąd podczas usuwania danych auta');
   }
});

app.patch(
    "/Auto/:id",
    authenticate,
    authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")),
    validateBody(autoSchema.partial()), 
    async (req: Request, res: Response) => {
        const autoId = req.params["id"];
        const autoData = req.body as Partial<AutoPayload>; 

        const updates = [];
        const values = [];
        for (const [key, value] of Object.entries(autoData)) {
            if (value !== undefined) {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (updates.length === 0) {
            return res.status(400).send("Brak danych do aktualizacji");
        }

        const query = `UPDATE Auto SET ${updates.join(", ")} WHERE IdAuto = ?`;
        values.push(autoId);

        try {
            const [results] = await connection.query<ResultSetHeader>(query, values);

            if (results.affectedRows === 0) {
                return res.status(404).send("Auto nie został znalezione");
            }

            return res.status(200).send("Auto zostało zaktualizowane");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Wystąpił błąd podczas aktualizacji auta");
        }
    }
);