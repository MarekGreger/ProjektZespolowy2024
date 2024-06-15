import app from "../app";
import {connection} from "../app";
import { Request, Response } from "express";
import { validateBody } from "../middleware/zodValidation";
import { Wersja_umowyPayload, wersja_umowySchema } from "../../common/wersja_umowySchema";
import { authenticate, authorize, getUserData } from "../middleware/firebaseAuth";
import {ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { roleGreaterOrEqual } from "../../common/userRoles";

app.post(
    "/Wersja_umowy",
    authenticate,
    authorize((user) => roleGreaterOrEqual(user["role"], "admin")),
    validateBody(wersja_umowySchema),
    async (req: Request, res: Response) => {
        const wersja_umowyData = req.body as Wersja_umowyPayload;
        const user = getUserData(res);
        console.log("user:", user);
        try {
            const dbConnection = await connection;
            await dbConnection.query("INSERT INTO Wersja_umowy ( Usluga_IdUsluga, Umowa_IdUmowa, Cena) VALUES ( ?, ?, ?)",
             [ wersja_umowyData.Usluga_IdUsluga, wersja_umowyData.Umowa_IdUmowa , wersja_umowyData.Cena ]);

            res.status(200).send("Wersja umowy została pomyślnie dodana");
        } catch (error) {
            console.error(error);
            res.status(500).send("Wystąpił błąd podczas zapisywania wersji umowy");
        }
    }
);

app.get(
    '/Wersja_umowy',
    authenticate,
    authorize((user) => roleGreaterOrEqual(user["role"], "kierownik")),
    async (req: Request, res: Response) => {
        try {
            const [results] = await connection.query<RowDataPacket[]>("SELECT * FROM Wersja_umowy");
            if (results.length === 0) {
                return res.status(200).send('Nie znaleziono wersji umowy');
            }
            return res.json(results);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Wystąpił błąd podczas pobierania danych wersji umowy');
        }
    }
);

app.get('/Wersja_umowy/usluga/:idUslugi', authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")), async (req: Request, res: Response) => {
    const idUslugi = req.params["idUslugi"];

    try {
        const [results] = await connection.query<RowDataPacket[]>(
            "SELECT WU.Usluga_IdUsluga, WU.Umowa_IdUmowa, WU.Cena, U.Nazwa FROM Wersja_umowy WU LEFT JOIN Usluga U ON WU.Usluga_IdUsluga = U.IdUsluga WHERE WU.Usluga_IdUsluga = ?",
            [idUslugi]
        );

        if (results.length === 0) {
            return res.status(200).send(`Nie znaleziono wersji umów dla usługi o ID: ${idUslugi}`);
        }

        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).send(`Wystąpił błąd podczas pobierania wersji umów dla usługi o ID: ${idUslugi}`);
    }
});

app.get('/Wersja_umowy/umowa/:idUmowy', authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")), async (req: Request, res: Response) => {
    const idUmowy = req.params["idUmowy"];

    try {
        const [results] = await connection.query<RowDataPacket[]>(
            "SELECT WU.Usluga_IdUsluga, WU.Umowa_IdUmowa, WU.Cena, UM.Data_rozpoczecia, UM.Data_zakonczenia FROM Wersja_umowy WU LEFT JOIN Umowa UM ON WU.Umowa_IdUmowa = UM.IdUmowa WHERE WU.Umowa_IdUmowa = ?",
            [idUmowy]
        );

        if (results.length === 0) {
            return res.status(200).send(`Nie znaleziono wersji umów dla umowy o ID: ${idUmowy}`);
        }

        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).send(`Wystąpił błąd podczas pobierania wersji umów dla umowy o ID: ${idUmowy}`);
    }
});



app.delete('/Wersja_umowy/:idUslugi/:idUmowy', 
    authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "admin")), 
    async (req: Request, res: Response) => {
        const idUslugi = req.params["idUslugi"];
        const idUmowy = req.params["idUmowy"];

        try {
            const dbConnection = await connection;
            const [results] = await dbConnection.query<ResultSetHeader>(
                "DELETE FROM Wersja_umowy WHERE Usluga_IdUsluga = ? AND Umowa_IdUmowa = ?",
                [idUslugi, idUmowy]
            );

            if (results.affectedRows === 0) {
                return res.status(404).send("Nie znaleziono wersji umowy do usunięcia");
            }
            return res.status(200).send("Wersja umowy została usunięta");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Wystąpił błąd podczas usuwania wersji umowy");
        }
    }
);

app.delete(
    "/Umowa/:idumowy/wersja_umowy/:iduslugi",
    authenticate,
    authorize("admin"),
    async (req: Request, res: Response) => {
        const idumowy = req.params["idumowy"];
        const iduslugi = req.params["iduslugi"];
        try {
            const dbConnection = await connection;
            const [results] = await dbConnection.query<ResultSetHeader>("DELETE FROM Wersja_umowy WHERE Umowa_IdUmowa = ? AND Usluga_IdUsluga = ?", [idumowy, iduslugi]);
            if (results.affectedRows === 0) {
                return res.status(404).send("Nie znaleziono wersji umowy");
            }
            return res.status(200).send("Wersja umowy została usunięta");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Wystąpił błąd podczas usuwania wersji umowy");
        }
    }
);

app.patch('/Wersja_umowy/:idUslugi/:idUmowy', 
    authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "admin")), 
    validateBody(wersja_umowySchema.partial()), 
    async (req: Request, res: Response) => {
        const idUslugi = req.params["idUslugi"];
        const idUmowy = req.params["idUmowy"];
        const { Usluga_IdUsluga, Umowa_IdUmowa, Cena } = req.body as Partial<Wersja_umowyPayload>;

        if (Usluga_IdUsluga === undefined && Umowa_IdUmowa === undefined && Cena === undefined) {
            return res.status(400).send("Brak danych do aktualizacji");
        }

        let query = "UPDATE Wersja_umowy SET ";
        const values = [];

        if (Usluga_IdUsluga !== undefined) {
            query += "Usluga_IdUsluga = ?";
            values.push(Usluga_IdUsluga);
        }

        if (Umowa_IdUmowa !== undefined) {
            if (values.length > 0) query += ", ";
            query += "Umowa_IdUmowa = ?";
            values.push(Umowa_IdUmowa);
        }

        if (Cena !== undefined) {
            if (values.length > 0) query += ", ";
            query += "Cena = ?";
            values.push(Cena);
        }

        query += " WHERE Usluga_IdUsluga = ? AND Umowa_IdUmowa = ?";
        values.push(idUslugi, idUmowy);

        try {
            const dbConnection = await connection;
            const [results] = await dbConnection.query<ResultSetHeader>(query, values);

            if (results.affectedRows === 0) {
                return res.status(404).send("Nie znaleziono wersji umowy do zaktualizowania");
            }

            return res.status(200).send("Wersja umowy została zaktualizowana");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Wystąpił błąd podczas aktualizacji wersji umowy");
        }
    }
);
app.patch(
    "/Umowa/:idumowy/wersja_umowy/:iduslugi",
    authenticate,
    authorize("admin"),
    validateBody(wersja_umowySchema.partial()),
    async (req: Request, res: Response) => {
        const idumowy = req.params["idumowy"];
        const iduslugi = req.params["iduslugi"];
        const wersja_umowyData = req.body as Wersja_umowyPayload;
        try {
            const dbConnection = await connection;
            const [results] = await dbConnection.query<ResultSetHeader>("UPDATE Wersja_umowy SET ? WHERE Umowa_IdUmowa = ? AND Usluga_IdUsluga = ?", [wersja_umowyData, idumowy, iduslugi]);
            if (results.affectedRows === 0) {
                return res.status(404).send("Nie znaleziono wersji umowy");
            }
            return res.status(200).send("Wersja umowy została zaktualizowana");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Wystąpił błąd podczas aktualizowania wersji umowy");
        }
    }
);

app.get(
    '/Umowa/:idumowy/wersja_umowy',
    authenticate,
    authorize("kierownik"),
    async (req: Request, res: Response) => {
        const idumowy = req.params["idumowy"];
        try {
            const [results] = await connection.query<RowDataPacket[]>("SELECT * FROM Wersja_umowy WHERE Umowa_IdUmowa = ?", [idumowy]);
            return res.json(results);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Wystąpił błąd podczas pobierania danych wersji umowy');
        }
    }
);
