import app from "../app";
import {connection} from "../app";
import { Request, Response } from "express";
import { validateBody } from "../middleware/zodValidation";
import { UslugaPayload, uslugaSchema } from "../../common/uslugaSchema";
import { authenticate, authorize, getUserData } from "../middleware/firebaseAuth";
import {ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { roleGreaterOrEqual } from "../../common/userRoles";

app.post(
    "/Usluga",
    authenticate,
    authorize("kierownik"),
    validateBody(uslugaSchema),
    async (req: Request, res: Response) => {
        const uslugaData = req.body as UslugaPayload;
        const user = getUserData(res);
        console.log("user:", user);
        try {
            const dbConnection = await connection;
            await dbConnection.query("INSERT INTO Usluga ( Opis, Nazwa) VALUES ( ?, ?)",
             [ uslugaData.Opis, uslugaData.Nazwa ]);

            res.status(200).send("Usługa została dodana pomyślnie");
        } catch (error) {
            console.error(error);
            res.status(500).send("Wystąpił błąd podczas zapisywania usługi");
        }
    }
);

app.get('/Usluga', authenticate, authorize("klient"), async (req: Request, res: Response) => {
    try {
        const [results] = await connection.query<RowDataPacket[]>("SELECT * FROM Usluga");
        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Wystąpił błąd podczas pobierania danych usług');
    }
});

app.get('/Usluga/:id', authenticate, authorize("klient"), async (req: Request, res: Response) => {
    const uslugaId = req.params["id"];

    const [results] = await connection.query<RowDataPacket[]>("SELECT * FROM Usluga WHERE IdUsluga = ?", [uslugaId]);
   try {
      console.log(results);
       if (results.length === 0) {
           return res.status(404).send('Usługa nie została znaleziona');
       }
      return res.json(results[0]);
   } catch (error) {
       console.error(error);
       return res.status(500).send('Wystąpił błąd podczas pobierania danych usługi');
   }
});

app.delete('/Usluga/:id', authenticate, authorize("admin"), async (req: Request, res: Response) => {
    const uslugaId = req.params["id"];

    const [results] = await connection.query<ResultSetHeader>("DELETE FROM Usluga WHERE IdUsluga = ?", [uslugaId]);
   try {
      console.log(results);
       if (results.affectedRows === 0) {
           return res.status(404).send('Usługa nie została znaleziona');
       }
       return res.status(200).send("Usługa została usunięta");
   } catch (error) {
       console.error(error);
       return res.status(500).send('Wystąpił błąd podczas usuwania danych usługi');
   }
});

app.patch(
    "/Usluga/:id",
    authenticate,
    authorize("kierownik"),
    validateBody(uslugaSchema.partial()), 
    async (req: Request, res: Response) => {
        const uslugaId = req.params["id"];
        const uslugaData = req.body as Partial<UslugaPayload>; 

        const updates = [];
        const values = [];
        for (const [key, value] of Object.entries(uslugaData)) {
            if (value !== undefined) {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (updates.length === 0) {
            return res.status(400).send("Brak danych do aktualizacji");
        }

        const query = `UPDATE Usluga SET ${updates.join(", ")} WHERE IdUsluga= ?`;
        values.push(uslugaId);

        try {
            const [results] = await connection.query<ResultSetHeader>(query, values);

            if (results.affectedRows === 0) {
                return res.status(404).send("Usługa nie została znaleziona");
            }

            return res.status(200).send("Usługa została zaktualizowana");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Wystąpił błąd podczas aktualizacji usługi");
        }
    }
);