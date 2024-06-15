import app from "../app";
import {connection} from "../app";
import { Request, Response } from "express";
import { validateBody } from "../middleware/zodValidation";
import {PracownikPayload, pracownikSchema } from "../../common/pracownikSchema";
import { authenticate, authorize, getUserData } from "../middleware/firebaseAuth";
import {ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { roleGreaterOrEqual } from "../../common/userRoles";
import { GrafikPayload, grafikSchema } from "../../common/grafikSchema";

app.post(
    "/Pracownik",
    authenticate,
    authorize((user) => roleGreaterOrEqual(user["role"], "kierownik")),
    validateBody(pracownikSchema),
    async (req: Request, res: Response) => {
        const pracownikData = req.body as PracownikPayload;

        try {
            const dbConnection = await connection;
            await dbConnection.query("INSERT INTO Pracownik ( Email, Imie, Nazwisko, Telefon) VALUES ( ?, ?, ?, ?)", 
            [ pracownikData.Email, pracownikData.Imie, pracownikData.Nazwisko, pracownikData.Telefon]);

            res.status(200).send("Pracownik został pomyślnie dodany");
        } catch (error) {
            console.error(error);
            res.status(500).send("Wystąpił błąd podczas zapisywania pracownika");
        }
    }
);

app.get('/Pracownik/:id', authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "kierownik")), async (req: Request, res: Response) => {
    const pracownikID = req.params["id"];

    const [results] = await connection.query<RowDataPacket[]>("SELECT * FROM Pracownik WHERE IdPracownik = ?", [pracownikID]);
   try {
      console.log(results);
       if (results.length === 0) {
           return res.status(404).send('Pracownik nie został znaleziony');
       }
      return res.json(results[0]);
   } catch (error) {
       console.error(error);
       return res.status(500).send('Wystąpił błąd podczas pobierania danych pracownika');
   }
});

app.get('/Pracownik/:email', authenticate, async (req: Request, res: Response) => {                                //tylko swoj grafik
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
        return res.status(403).send("Brak uprawnień do przeglądania danych tego pracownika");
    }

    try {
        const [pracownikResults] = await connection.query<RowDataPacket[]>("SELECT IdPracownik FROM Pracownik WHERE Email = ?", [email]);

        if (pracownikResults.length === 0 || !pracownikResults[0]) {
            return res.status(404).send('Pracownik o podanym emailu nie został znaleziony');
        }

        const pracownikID = pracownikResults[0]['IdPracownik'];

        const [grafikResults] = await connection.query<RowDataPacket[]>("SELECT * FROM Pracownik WHERE IdPracownik = ?", [pracownikID]);

        return res.json(grafikResults);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Wystąpił błąd podczas pobierania danych pracownika');
    }
});

const getWorkersSchedule = async (id: string| undefined, res: Response) => {
    try {
        const [pracownikResult] = await connection.query<RowDataPacket[]>(
            `SELECT G.IdGrafik, G.Pracownik_IdPracownik, G.Klient_IdKlient, P.Imie, P.Nazwisko, K.Nazwa, G.Czas_rozpoczecia, G.Czas_zakonczenia, G.Status 
             FROM Grafik G 
             LEFT JOIN Pracownik P ON G.Pracownik_IdPracownik = P.IdPracownik 
             LEFT JOIN Klient K ON G.Klient_IdKlient = K.IdKlient 
             WHERE G.Pracownik_IdPracownik = ?`, [id]
        );

        return res.json(pracownikResult);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Wystąpił błąd podczas pobierania grafiku pracownika');
    }
}

app.get('/Pracownik/:id/grafik', authenticate, authorize("kierownik"), (req, res) => getWorkersSchedule(req.params["id"], res))

app.get('/profil/Pracownik/:email/grafik', authenticate, async (req: Request, res: Response) => {                           //tylko swoje dane
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
        return res.status(403).send("Brak uprawnień do przeglądania tego grafiku");
    }

    try {
        const [pracownikResults] = await connection.query<RowDataPacket[]>("SELECT IdPracownik FROM Pracownik WHERE Email = ?", [email]);

        if (pracownikResults.length === 0 || !pracownikResults[0]) {
            return res.status(404).send('Pracownik o podanym emailu nie został znaleziony');
        }

        const pracownikID = pracownikResults[0]['IdPracownik'];

        return await getWorkersSchedule(pracownikID, res);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Wystąpił błąd podczas pobierania grafiku pracownika');
    }
});

app.delete('/Pracownik/:id', authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "admin")), async (req: Request, res: Response) => {
    const pracownikID = req.params["id"];

    const [results] = await connection.query<ResultSetHeader>("DELETE FROM Pracownik WHERE IdPracownik = ?", [pracownikID]);
   try {
      console.log(results);
       if (results.affectedRows === 0) {
           return res.status(404).send('Pracownik nie został znaleziony');
       }
       return res.status(200).send("Pracownik został usunięty");
   } catch (error) {
       console.error(error);
       return res.status(500).send('Wystąpił błąd podczas usuwania danych pracownika');
   }
});

app.get('/Pracownik', authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "kierownik")), async (req: Request, res: Response) => {
    try {
        const [results] = await connection.query<RowDataPacket[]>("SELECT * FROM Pracownik");
        if (results.length === 0) {
            return res.status(200).send('Nie znaleziono pracownikow');
        }
        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Wystąpił błąd podczas pobierania danych pracownika');
    }
});

app.patch(
    "/Pracownik/:id",
    authenticate,
    authorize((user) => roleGreaterOrEqual(user["role"], "kierownik")),
    validateBody(pracownikSchema.partial()), 
    async (req: Request, res: Response) => {
        const pracownikId = req.params["id"];
        const pracownikData = req.body as Partial<PracownikPayload>; 

        const updates = [];
        const values = [];
        for (const [key, value] of Object.entries(pracownikData)) {
            if (value !== undefined) {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (updates.length === 0) {
            return res.status(400).send("Brak danych do aktualizacji");
        }

        const query = `UPDATE Pracownik SET ${updates.join(", ")} WHERE IdPracownik = ?`;
        values.push(pracownikId);

        try {
            const [results] = await connection.query<ResultSetHeader>(query, values);

            if (results.affectedRows === 0) {
                return res.status(404).send("Pracownik nie został znaleziony");
            }

            return res.status(200).send("Pracownik został zaktualizowany");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Wystąpił błąd podczas aktualizacji pracownika");
        }
    }
);

app.patch(
    "/Pracownik/:email/Grafik/:id",                                                                //tylko swoj grafik
    authenticate,
    validateBody(grafikSchema.innerType().partial()), 
    async (req: Request, res: Response) => {
        const grafikId = req.params["id"];
        const emailParam = req.params["email"];
        const { Czas_rozpoczecia, Czas_zakonczenia } = req.body as Partial<GrafikPayload>;

        if (!emailParam) {
            return res.status(400).send("Email jest wymagany");
        }

        const email = decodeURIComponent(emailParam);
        const user = getUserData(res);

        if (!user || user.email !== email) {
            return res.status(403).send("Brak uprawnień do edycji tego grafiku");
        }

        if (!Czas_rozpoczecia && !Czas_zakonczenia) {
            return res.status(400).send("Brak danych do aktualizacji");
        }

        const values = [];
        let updateQuery = "UPDATE Grafik SET ";
        
        if (Czas_rozpoczecia) {
            updateQuery += "Czas_rozpoczecia = ?, ";
            values.push(Czas_rozpoczecia);
        }

        if (Czas_zakonczenia) {
            updateQuery += "Czas_zakonczenia = ?, ";
            values.push(Czas_zakonczenia);
        }

        updateQuery = updateQuery.slice(0, -2); 
        updateQuery += " WHERE IdGrafik = ? AND Pracownik_IdPracownik = (SELECT IdPracownik FROM Pracownik WHERE Email = ?) AND Status <> 'zaakceptowane'";
        
        values.push(grafikId, email);

        try {
            const [results] = await connection.query<ResultSetHeader>(updateQuery, values);

            if (results.affectedRows === 0) {
                return res.status(404).send("Grafik nie został znaleziony lub już jest zatwierdzony");
            }

            return res.status(200).send("Grafik został zaktualizowany");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Wystąpił błąd podczas aktualizacji grafiku");
        }
    }
);


app.patch(                                                                                       //tylko swoje dane
    "/Pracownik/:email",
    authenticate,
    validateBody(pracownikSchema.partial()), 
    async (req: Request, res: Response) => {
        const emailParam = req.params["email"];
        const pracownikData = req.body as Partial<PracownikPayload>;

        if (!emailParam) {
            return res.status(400).send("Email jest wymagany");
        }

        const email = decodeURIComponent(emailParam);
        const user = getUserData(res);

        if (!user || user.email !== email) {
            return res.status(403).send("Brak uprawnień do edycji danych pracownika");
        }

        const updates = [];
        const values = [];
        for (const [key, value] of Object.entries(pracownikData)) {
            if (value !== undefined) {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (updates.length === 0) {
            return res.status(400).send("Brak danych do aktualizacji");
        }

        const query = `UPDATE Pracownik SET ${updates.join(", ")} WHERE Email = ?`;
        values.push(email);

        try {
            const [results] = await connection.query<ResultSetHeader>(query, values);

            if (results.affectedRows === 0) {
                return res.status(404).send("Pracownik nie został znaleziony lub dane są niezmienione");
            }

            return res.status(200).send("Dane pracownika zostały zaktualizowane");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Wystąpił błąd podczas aktualizacji danych pracownika");
        }
    }
);


