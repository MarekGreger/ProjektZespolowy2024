import app from "../app";
import {connection} from "../app";
import { Request, Response } from "express";
import { validateBody } from "../middleware/zodValidation";
import { Auto_pracownikPayload, auto_pracownikSchema } from "../../common/auto_pracownikSchema";
import { authenticate, authorize, getUserData } from "../middleware/firebaseAuth";
import {ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { roleGreaterOrEqual } from "../../common/userRoles";

app.post(
    "/Auto_pracownik",
    authenticate,
    authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")),
    validateBody(auto_pracownikSchema),
    async (req: Request, res: Response) => {
        const auto_pracownikData = req.body as Auto_pracownikPayload;
        const user = getUserData(res);
        console.log("user:", user);
        try {
            const dbConnection = await connection;
            await dbConnection.query("INSERT INTO Auto_Pracownik ( Auto_IdAuto, Pracownik_IdPracownik) VALUES ( ?, ? )",
             [ auto_pracownikData.Auto_IdAuto, auto_pracownikData.Pracownik_IdPracownik ]);
            res.status(200).send("Dane dla Auto_pracownik zostały dodane pomyślnie");
        } catch (error) {
            console.error(error);
            res.status(500).send("Wystąpił błąd podczas zapisywania danych dla Auto_pracownik");
        }
    }
);

app.get('/Auto_pracownik',authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")), async (req: Request, res: Response) => {
    try {
        const [results] = await connection.query<RowDataPacket[]>("SELECT * FROM Auto_Pracownik");
        if (results.length === 0) {
            return res.status(200).send('Nie znaleziono danych dla Auto_pracownik');
        }
        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Wystąpił błąd podczas pobierania danych dla Auto_pracownik');
    }
});

app.get('/Auto_pracownik/auto/:id', authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")), async (req: Request, res: Response) => {
    const idAuto = req.params["id"];

    try {
        const [results] = await connection.query<RowDataPacket[]>(
            "SELECT AP.Auto_IdAuto, AP.Pracownik_IdPracownik, P.Imie, P.Nazwisko, P.Email FROM Auto_Pracownik AP LEFT JOIN Pracownik P ON AP.Pracownik_IdPracownik = P.IdPracownik WHERE AP.Auto_IdAuto = ?",
            [idAuto]
        );

        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).send(`Wystąpił błąd podczas pobierania pracowników dla auta o ID: ${idAuto}`);
    }
});


app.get('/Auto_pracownik/pracownik/:id', authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")), async (req: Request, res: Response) => {
    const idPracownik = req.params["id"];

    try {
        const [results] = await connection.query<RowDataPacket[]>(
            "SELECT AP.Auto_IdAuto, AP.Pracownik_IdPracownik, A.Rejestracja, A.Model_IdModel FROM Auto_Pracownik AP LEFT JOIN Auto A ON AP.Auto_IdAuto = A.IdAuto WHERE AP.Pracownik_IdPracownik = ?",
            [idPracownik]
        );

        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).send(`Wystąpił błąd podczas pobierania aut przypisanych do pracownika o ID: ${idPracownik}`);
    }
});


app.delete('/Auto_pracownik/:idAuto/:idPracownik', 
    authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "admin")), 
    async (req: Request, res: Response) => {
        const idAuto = req.params["idAuto"];
        const idPracownik = req.params["idPracownik"];

        try {
            const dbConnection = await connection;
            const [results] = await dbConnection.query<ResultSetHeader>(
                "DELETE FROM Auto_Pracownik WHERE Auto_IdAuto = ? AND Pracownik_IdPracownik = ?",
                [idAuto, idPracownik]
            );

            if (results.affectedRows === 0) {
                return res.status(404).send("Nie znaleziono powiązania do usunięcia");
            }

            return res.status(200).send("Powiązanie między autem a pracownikiem zostało usunięte");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Wystąpił błąd podczas usuwania powiązania");
        }
    }
);

app.patch('/Auto_pracownik/:idAuto/:idPracownik', 
    authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")), 
    validateBody(auto_pracownikSchema.partial()), 
    async (req: Request, res: Response) => {
        const idAuto = req.params["idAuto"];
        const idPracownik = req.params["idPracownik"];
        const { Auto_IdAuto, Pracownik_IdPracownik } = req.body as Partial<Auto_pracownikPayload>;

        if (!Auto_IdAuto && !Pracownik_IdPracownik) {
            return res.status(400).send("Brak danych do aktualizacji");
        }

        let query = "UPDATE Auto_Pracownik SET ";
        const values = [];

        if (Auto_IdAuto) {
            query += "Auto_IdAuto = ?";
            values.push(Auto_IdAuto);
        }

        if (Pracownik_IdPracownik) {
            if (values.length > 0) query += ", ";
            query += "Pracownik_IdPracownik = ?";
            values.push(Pracownik_IdPracownik);
        }

        query += " WHERE Auto_IdAuto = ? AND Pracownik_IdPracownik = ?";
        values.push(idAuto, idPracownik);

        try {
            const dbConnection = await connection;
            const [results] = await dbConnection.query<ResultSetHeader>(query, values);

            if (results.affectedRows === 0) {
                return res.status(404).send("Nie znaleziono powiązania do zaktualizowania");
            }

            return res.status(200).send("Powiązanie między autem a pracownikiem zostało zaktualizowane");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Wystąpił błąd podczas aktualizacji powiązania");
        }
    }
);
