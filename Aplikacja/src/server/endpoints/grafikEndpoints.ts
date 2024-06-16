import app from "../app";
import {connection} from "../app";
import { Request, Response } from "express";
import { validateBody } from "../middleware/zodValidation";
import { GrafikPayload, grafikSchema } from "../../common/grafikSchema";
import { authenticate, authorize, getUserData } from "../middleware/firebaseAuth";
import {ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { roleGreaterOrEqual } from "../../common/userRoles";
import { AcceptanceStatus } from "../../common/AcceptanceStatus";

app.post(
    "/Grafik",
    authenticate,
    authorize((user) => roleGreaterOrEqual(user["role"], "kierownik")),
    validateBody(grafikSchema),
    async (req: Request, res: Response) => {
        const grafikData = req.body as GrafikPayload;
        const user = getUserData(res);
        console.log("user:", user);
        try {
            const dbConnection = await connection;
            await dbConnection.query("INSERT INTO Grafik ( Pracownik_IdPracownik, Klient_IdKlient, Czas_rozpoczecia, Czas_zakonczenia, Status) VALUES ( ?, ?, ?, ?, ?)",
             [ grafikData.Pracownik_IdPracownik, grafikData.Klient_IdKlient, grafikData.Czas_rozpoczecia , grafikData.Czas_zakonczenia, "przesłane"]);

            res.status(200).send("Grafik został dodany pomyślnie");
        } catch (error) {
            console.error(error);
            res.status(500).send("Wystąpił błąd podczas zapisywania grafiku");
        }
    }
);

app.get('/Grafik',authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "kierownik")), async (req: Request, res: Response) => {
    try {
        const [results] = await connection.query<RowDataPacket[]>(`
            SELECT
                G.IdGrafik,
                G.Pracownik_IdPracownik,
                G.Klient_IdKlient,
                P.Imie, 
                P.Nazwisko,
                K.Nazwa,
                G.Czas_rozpoczecia,
                G.Czas_zakonczenia,
                G.Status
            FROM db_main.Grafik G LEFT JOIN db_main.Pracownik P ON G.Pracownik_IdPracownik = P.IdPracownik
            LEFT JOIN db_main.Klient K ON G.Klient_IdKlient = K.IdKlient;
        `);
        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Wystąpił błąd podczas pobierania danych grafików');
    }
});

app.get('/Grafik/:id',authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "kierownik")), async (req: Request, res: Response) => {
    const grafikId = req.params["id"];

    const [results] = await connection.query<RowDataPacket[]>(`
    SELECT
        G.IdGrafik,
        G.Pracownik_IdPracownik,
        G.Klient_IdKlient,
        P.Imie, 
        P.Nazwisko,
        K.Nazwa,
        G.Czas_rozpoczecia,
        G.Czas_zakonczenia,
        G.Status
    FROM db_main.Grafik G LEFT JOIN db_main.Pracownik P ON G.Pracownik_IdPracownik = P.IdPracownik
    LEFT JOIN db_main.Klient K ON G.Klient_IdKlient = K.IdKlient
    WHERE G.IdGrafik = ?;`,[grafikId]);
   try {
      console.log(results);
       if (results.length === 0) {
           return res.status(404).send('Grafik nie został znaleziony');
       }
      return res.json(results[0]);
   } catch (error) {
       console.error(error);
       return res.status(500).send('Wystąpił błąd podczas pobierania danych grafiku');
   }
});

app.delete('/Grafik/:id',authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "admin")), async (req: Request, res: Response) => {
    const grafikId = req.params["id"];

    const [results] = await connection.query<ResultSetHeader>("DELETE FROM Grafik WHERE IdGrafik = ?", [grafikId]);
   try {
      console.log(results);
       if (results.affectedRows === 0) {
           return res.status(404).send('Grafik nie został znaleziony');
       }
       return res.status(200).send("Grafik został usunięty");
   } catch (error) {
       console.error(error);
       return res.status(500).send('Wystąpił błąd podczas usuwania danych grafiku');
   }
});

app.patch(
    "/Grafik/:id",
    authenticate,
    authorize((user) => roleGreaterOrEqual(user["role"], "kierownik")),
    validateBody(grafikSchema.innerType().partial()), 
    async (req: Request, res: Response) => {
        const grafikId = req.params["id"];
        const grafikData = req.body as Partial<GrafikPayload> & {Status: AcceptanceStatus}; 
        grafikData.Status = "przesłane";

        const updates = [];
        const values = [];
        for (const [key, value] of Object.entries(grafikData)) {
            if (value !== undefined) {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (updates.length === 0) {
            return res.status(400).send("Brak danych do aktualizacji");
        }

        const query = `UPDATE Grafik SET ${updates.join(", ")} WHERE IdGrafik = ?`;
        values.push(grafikId);

        try {
            const [results] = await connection.query<ResultSetHeader>(query, values);

            if (results.affectedRows === 0) {
                return res.status(404).send("Grafik nie został znaleziony");
            }

            return res.status(200).send("Grafik został zaktualizowany");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Wystąpił błąd podczas aktualizacji grafiku");
        }
    }
);

app.put(
    "/Grafik/:id/acceptance",
    authenticate,
    authorize("kierownik"),
    async (req: Request, res: Response) => {
        const grafikId = req.params["id"];

        try {
            const dbConnection = await connection;
            await dbConnection.query("UPDATE Grafik SET Status = 'zaakceptowane' WHERE IdGrafik = ?", [grafikId]);

            res.status(200).send("Grafik został zaakceptowany");
        } catch (error) {
            console.error(error);
            res.status(500).send("Wystąpił błąd podczas aktualizacji grafiku");
        }
    }
);

app.delete(
    "/Grafik/:id/acceptance",
    authenticate,
    authorize("kierownik"),
    async (req: Request, res: Response) => {
        const grafikId = req.params["id"];

        try {
            const dbConnection = await connection;
            await dbConnection.query("UPDATE Grafik SET Status = 'odrzucone' WHERE IdGrafik = ?", [grafikId]);

            res.status(200).send("Grafik został odrzucony");
        } catch (error) {
            console.error(error);
            res.status(500).send("Wystąpił błąd podczas aktualizacji grafiku");
        }
    }
);
