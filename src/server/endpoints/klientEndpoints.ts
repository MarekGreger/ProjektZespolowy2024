import app from "../app";
import {connection} from "../app";
import { Request, Response } from "express";
import { validateBody } from "../middleware/zodValidation";
import { KlientPayload, klientSchema } from "../../common/klientSchema";
import { authenticate, authorize, getUserData } from "../middleware/firebaseAuth";
import { roleGreaterOrEqual } from "../../common/userRoles";
import {ResultSetHeader, RowDataPacket } from "mysql2/promise";

const getErrorMessage = (error: unknown, defaultMessage: string) => {
    if (typeof error === "object" && error !== null && "message" in error) {
        return error.message as string
    }
    return defaultMessage
}

app.post(
    "/Klient",
    authenticate,
    authorize((user) => roleGreaterOrEqual(user["role"], "kierownik")),
    validateBody(klientSchema),
    async (req: Request, res: Response) => {
        const klientData = req.body as KlientPayload;
        const user = getUserData(res);
        console.log("user:", user);
        try {
            const dbConnection = await connection;
            await dbConnection.query("INSERT INTO Klient ( Adres, Email, Nazwa, NIP, Telefon) VALUES ( ?, ?, ?, ?, ?)", 
            [ klientData.Adres, klientData.Email, klientData.Nazwa, klientData.NIP , klientData.Telefon]);

            res.status(200).send("Pomyślnie zapisano dane klienta");
        } catch (error) {
            console.error(error);
            res.status(500).send(
                getErrorMessage(error, "Wystąpił błąd podczas zapisywania klienta")
            );
        }
    }
);

app.get('/Klient',authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "kierownik")), async (req: Request, res: Response) => {
    try {
        const [results] = await connection.query<RowDataPacket[]>("SELECT * FROM Klient");
        if (results.length === 0) {
            return res.status(200).send('Nie znaleziono klientów');
        }
        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Wystąpił błąd podczas pobierania danych klientów');
    }
});

app.get('/Klient/:id', authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "kierownik")), async (req: Request, res: Response) => {
    const klientId = req.params["id"];

    const [results] = await connection.query<RowDataPacket[]>("SELECT * FROM Klient WHERE IdKlient = ?", [klientId]);
   try {
      console.log(results);
       if (results.length === 0) {
           return res.status(404).send('Klient nie został znaleziony');
       }
      return res.json(results[0]);
   } catch (error) {
       console.error(error);
       return res.status(500).send('Wystąpił błąd podczas pobierania danych klienta');
   }
});

app.get('/Klient/:email', authenticate, async (req: Request, res: Response) => {                           //tylko swoje dane
    const emailParam = req.params["email"];

    if (!emailParam) {
        return res.status(400).send("Email jest wymagany");
    }

    const email = decodeURIComponent(emailParam);
    const user = getUserData(res);

    if (!user || !user.email) {
        return res.status(403).send("Brak uprawnień lub błąd autentykacji");
    }

    if (user.email !== email) {
        return res.status(403).send("Brak uprawnień do przeglądania danych tego klienta");
    }

    try {
        const [pracownikResults] = await connection.query<RowDataPacket[]>("SELECT IdKlient FROM Klient WHERE Email = ?", [email]);

        if (pracownikResults.length === 0 || !pracownikResults[0]) {
            return res.status(404).send('Klient o podanym emailu nie został znaleziony');
        }

        const klientId = pracownikResults[0]['IdPracownik'];

        const [pracownikResult] = await connection.query<RowDataPacket[]>("SELECT * FROM Klient WHERE IdKlient = ?", [klientId]);

        return res.json(pracownikResult);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Wystąpił błąd podczas pobierania danych klienta');
    }
});

app.get('/Klient/:email/auto', authenticate, async (req: Request, res: Response) => {
    const emailParam = req.params["email"];

    if (!emailParam) {
        return res.status(400).send("Email jest wymagany");
    }

    const email = decodeURIComponent(emailParam);
    const user = getUserData(res);

    if (!user || !user.email) {
        return res.status(403).send("Brak uprawnień lub błąd autentykacji");
    }

    if (user.email !== email) {
        return res.status(403).send("Brak uprawnień do przeglądania aut");
    }

    try {
        const [klientResults] = await connection.query<RowDataPacket[]>("SELECT IdKlient FROM Klient WHERE Email = ?", [email]);

        if (klientResults.length === 0 || !klientResults[0]) {
            return res.status(404).send('Klient o podanym emailu nie został znaleziony');
        }

        const klientID = klientResults[0]['IdKlient'];

        const [autoResults] = await connection.query<RowDataPacket[]>(
           `WITH A AS (
            SELECT A.IdAuto AS IdAuto,
                A.Klient_IdKlient AS IdKlient,
                A.Model_IdModel AS IdModel,
                A.Rejestracja AS Rejestracja,
                M.Marka AS Marka, 
                M.Model AS Model,
                A.Czas_rozpoczecia AS Czas_rozpoczecia,
                IFNULL(A.Czas_zakonczenia, 'W trakcie') AS Czas_zakonczenia,
                K.Nazwa AS Klient_nazwa,
                GROUP_CONCAT(P.Imie, ' ', P.Nazwisko SEPARATOR ', ') AS Pracownicy,
                A.Dodatkowe_informacje AS Dodatkowe_informacje
            FROM db_main.Auto A
            LEFT JOIN db_main.Klient K ON A.Klient_IdKlient = K.IdKlient
            LEFT JOIN db_main.Model M ON A.Model_IdModel = M.IdModel
            LEFT JOIN db_main.Auto_Pracownik AP ON A.IdAuto = AP.Auto_IdAuto
            LEFT JOIN db_main.Pracownik P ON AP.Pracownik_IdPracownik = P.IdPracownik
            WHERE A.Klient_IdKlient = ?
            GROUP BY A.IdAuto, A.Klient_IdKlient
        )
        SELECT DISTINCT A.IdAuto,
            A.IdKlient,
            A.IdModel,
            A.Rejestracja,
            A.Marka, 
            A.Model,
            A.Czas_rozpoczecia,
            A.Czas_zakonczenia,
            A.Klient_nazwa,
            A.Pracownicy,
            A.Dodatkowe_informacje,
            GROUP_CONCAT(U.Nazwa SEPARATOR ', ') AS Uslugi
        FROM A
        LEFT JOIN db_main.Auto_Usluga AU ON A.IdAuto = AU.Auto_IdAuto
        LEFT JOIN db_main.Usluga U ON AU.Usluga_IdUsluga = U.IdUsluga
        WHERE A.IdKlient = ?
        GROUP BY A.IdAuto, A.IdKlient;`, [klientID, klientID]
        );

        return res.json(autoResults);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Wystąpił błąd podczas pobierania aut');
    }
});

app.get('/Klient/:email/umowa', authenticate, async (req: Request, res: Response) => {
    const emailParam = req.params["email"];

    if (!emailParam) {
        return res.status(400).send("Email jest wymagany");
    }

    const email = decodeURIComponent(emailParam);
    const user = getUserData(res);

    if (!user || !user.email) {
        return res.status(403).send("Brak uprawnień lub błąd autentykacji");
    }

    if (user.email !== email) {
        return res.status(403).send("Brak uprawnień do przeglądania umów danego klienta");
    }

    try {
        const [klientResults] = await connection.query<RowDataPacket[]>("SELECT IdKlient FROM Klient WHERE Email = ?", [email]);

        if (klientResults.length === 0 || !klientResults[0]) {
            return res.status(404).send('Klient o podanym emailu nie został znaleziony');
        }

        const klientID = klientResults[0]['IdKlient'];

        const [autoResults] = await connection.query<RowDataPacket[]>(`
        SELECT 
            U.IdUmowa,
            U.Klient_IdKlient, 
            K.Nazwa,
            U.Data_rozpoczecia,
            U.Data_zakonczenia
        FROM db_main.Umowa U LEFT JOIN db_main.Klient K ON U.Klient_IdKlient = K.IdKlient
        WHERE U.Klient_IdKlient = ?;`, [klientID]
        );

        return res.json(autoResults);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Wystąpił błąd podczas pobierania danych umów klienta');
    }
});

app.get('/Klient/:email/usluga', authenticate, async (req: Request, res: Response) => {
    const emailParam = req.params["email"];

    if (!emailParam) {
        return res.status(400).send("Email jest wymagany");
    }

    const email = decodeURIComponent(emailParam);
    const user = getUserData(res);

    if (!user || !user.email) {
        return res.status(403).send("Brak uprawnień lub błąd autentykacji");
    }

    if (user.email !== email) {
        return res.status(403).send("Brak uprawnień do przeglądania usług danego klienta");
    }

    try {
        const [klientResults] = await connection.query<RowDataPacket[]>("SELECT IdKlient FROM Klient WHERE Email = ?", [email]);

        if (klientResults.length === 0 || !klientResults[0]) {
            return res.status(404).send('Klient o podanym emailu nie został znaleziony');
        }

        const klientID = klientResults[0]['IdKlient'];

        const [autoResults] = await connection.query<RowDataPacket[]>(
        `SELECT 
            U.IdUmowa,
            U.Klient_IdKlient, 
            K.Nazwa AS NazwaKlienta,
            UM.Nazwa AS NazwaUslugi,
            UM.Opis,
            WU.Cena
        FROM db_main.Umowa U
        LEFT JOIN db_main.Klient K ON U.Klient_IdKlient = K.IdKlient
        LEFT JOIN db_main.Wersja_umowy WU ON U.IdUmowa = WU.Umowa_IdUmowa
        LEFT JOIN db_main.Usluga UM ON WU.Usluga_IdUsluga = UM.IdUsluga
        WHERE U.Klient_IdKlient = ?`, [klientID]
        );

        return res.json(autoResults);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Wystąpił błąd podczas pobierania usług danego klienta');
    }
});

app.get('/Klient/:email/wersja_umowy', authenticate, async (req: Request, res: Response) => {
    const emailParam = req.params["email"];

    if (!emailParam) {
        return res.status(400).send("Email jest wymagany");
    }

    const email = decodeURIComponent(emailParam);
    const user = getUserData(res);

    if (!user || !user.email) {
        return res.status(403).send("Brak uprawnień lub błąd autentykacji");
    }

    if (user.email !== email) {
        return res.status(403).send("Brak uprawnień do przeglądania wersji umowy danego klienta");
    }

    try {
        const [klientResults] = await connection.query<RowDataPacket[]>("SELECT IdKlient FROM Klient WHERE Email = ?", [email]);

        if (klientResults.length === 0 || !klientResults[0]) {
            return res.status(404).send('Klient o podanym emailu nie został znaleziony');
        }

        const klientID = klientResults[0]['IdKlient'];

        const [autoResults] = await connection.query<RowDataPacket[]>(
        `SELECT 
            U.IdUmowa,
            U.Klient_IdKlient, 
            K.Nazwa AS NazwaKlienta,
            U.Data_rozpoczecia,
            U.Data_zakonczenia,
            WU.Usluga_IdUsluga,
            WU.Cena
        FROM db_main.Umowa U
        LEFT JOIN db_main.Klient K ON U.Klient_IdKlient = K.IdKlient
        LEFT JOIN db_main.Wersja_umowy WU ON U.IdUmowa = WU.Umowa_IdUmowa
        WHERE U.Klient_IdKlient = ?;`, [klientID]
        );

        return res.json(autoResults);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Wystąpił błąd podczas pobierania wersji umowy danego klienta');
    }
});

app.delete('/Klient/:id', authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "admin")), async (req: Request, res: Response) => {
    const klientId = req.params["id"];

    const [results] = await connection.query<ResultSetHeader>("DELETE FROM Klient WHERE IdKlient = ?", [klientId]);
   try {
      console.log(results);
       if (results.affectedRows === 0) {
           return res.status(404).send('Klient nie został znaleziony');
       }
       return res.status(200).send("Klient został usunięty");
   } catch (error) {
       console.error(error);
       return res.status(500).send('Wystąpił błąd podczas usuwania danych klienta');
   }
});

app.patch(
    "/Klient/:id",
    authenticate,
    authorize((user) => roleGreaterOrEqual(user["role"], "kierownik")),
    validateBody(klientSchema.partial()), 
    async (req: Request, res: Response) => {
        const klientId = req.params["id"];
        const klientData = req.body as Partial<KlientPayload>; 

        const updates = [];
        const values = [];
        for (const [key, value] of Object.entries(klientData)) {
            if (value !== undefined) {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (updates.length === 0) {
            return res.status(400).send("Brak danych do aktualizacji");
        }

        const query = `UPDATE Klient SET ${updates.join(", ")} WHERE IdKlient = ?`;
        values.push(klientId);

        try {
            const [results] = await connection.query<ResultSetHeader>(query, values);

            if (results.affectedRows === 0) {
                return res.status(404).send("Klient nie został znaleziony");
            }

            return res.status(200).send("Klient został zaktualizowany");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Wystąpił błąd podczas aktualizacji klienta");
        }
    }
);

app.patch(                                                                                       //tylko swoje dane
    "/Klient/:email",
    authenticate,
    validateBody(klientSchema.partial()), 
    async (req: Request, res: Response) => {
        const emailParam = req.params["email"];
        const klientData = req.body as Partial<KlientPayload>;

        if (!emailParam) {
            return res.status(400).send("Email jest wymagany");
        }

        const email = decodeURIComponent(emailParam);
        const user = getUserData(res);

        if (!user || user.email !== email) {
            return res.status(403).send("Brak uprawnień do edycji danych klienta");
        }

        const updates = [];
        const values = [];
        for (const [key, value] of Object.entries(klientData)) {
            if (value !== undefined) {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (updates.length === 0) {
            return res.status(400).send("Brak danych do aktualizacji");
        }

        const query = `UPDATE Klient SET ${updates.join(", ")} WHERE Email = ?`;
        values.push(email);

        try {
            const [results] = await connection.query<ResultSetHeader>(query, values);

            if (results.affectedRows === 0) {
                return res.status(404).send("Klient nie został znaleziony lub dane są niezmienione");
            }

            return res.status(200).send("Dane klienta zostały zaktualizowane");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Wystąpił błąd podczas aktualizacji danych klienta");
        }
    }
);