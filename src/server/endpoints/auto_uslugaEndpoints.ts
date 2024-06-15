import app from "../app";
import {connection} from "../app";
import { Request, Response } from "express";
import { validateBody } from "../middleware/zodValidation";
import { Auto_uslugaPayload, auto_uslugaSchema } from "../../common/auto_uslugaSchema";
import { authenticate, authorize, getUserData } from "../middleware/firebaseAuth";
import {ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { roleGreaterOrEqual } from "../../common/userRoles";

app.post(
    "/Auto_usluga",
    authenticate,
    authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")),
    validateBody(auto_uslugaSchema),
    async (req: Request, res: Response) => {
        const auto_uslugaData = req.body as Auto_uslugaPayload;
        const user = getUserData(res);
        console.log("user:", user);
        try {
            const dbConnection = await connection;
            await dbConnection.query("INSERT INTO Auto_Usluga ( Auto_IdAuto, Usluga_IdUsluga) VALUES ( ?, ? )",
             [ auto_uslugaData.Auto_IdAuto, auto_uslugaData.Usluga_IdUsluga ]);

            res.status(200).send("Dane dla Auto_usluga zostały dodane pomyślnie");
        } catch (error) {
            console.error(error);
            res.status(500).send("Wystąpił błąd podczas zapisywania danych dla Auto_usluga");
        }
    }
);

app.get('/Auto_usluga',authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")), async (req: Request, res: Response) => {
    try {
        const [results] = await connection.query<RowDataPacket[]>("SELECT * FROM Auto_Usluga");
        if (results.length === 0) {
            return res.status(200).send('Nie znaleziono danych dla Auto_usluga');
        }
        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Wystąpił błąd podczas pobierania danych dla Auto_usluga');
    }
});

//FIXME: endpoint path completely breaking restful
app.get('/Auto_usluga/auto/:id', authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")), async (req: Request, res: Response) => {
    const idAuto = req.params["id"];

    try {
        const [results] = await connection.query<RowDataPacket[]>(
            "SELECT AU.Auto_IdAuto, AU.Usluga_IdUsluga, U.Nazwa, U.Opis FROM Auto_Usluga AU LEFT JOIN Usluga U ON AU.Usluga_IdUsluga = U.IdUsluga WHERE AU.Auto_IdAuto = ?",
            [idAuto]
        );

        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).send(`Wystąpił błąd podczas pobierania usług dla auta o ID: ${idAuto}`);
    }
});

app.get('/Auto_usluga/usluga/:id', authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")), async (req: Request, res: Response) => {
    const idUslugi = req.params["id"];

    try {
        const [results] = await connection.query<RowDataPacket[]>(
            "SELECT AU.Auto_IdAuto, AU.Usluga_IdUsluga, A.Rejestracja, A.Model_IdModel FROM Auto_Usluga AU LEFT JOIN Auto A ON AU.Auto_IdAuto = A.IdAuto WHERE AU.Usluga_IdUsluga = ?",
            [idUslugi]
        );

        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).send(`Wystąpił błąd podczas pobierania aut powiązanych z usługą o ID: ${idUslugi}`);
    }
});

app.patch('/Auto_usluga/:idAuto/:idUslugi', 
    authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "pracownik")), 
    validateBody(auto_uslugaSchema.partial()), 
    async (req: Request, res: Response) => {
        const idAuto = req.params["idAuto"];
        const idUslugi = req.params["idUslugi"];
        const { Auto_IdAuto, Usluga_IdUsluga } = req.body as Partial<Auto_uslugaPayload>;

        if (!Auto_IdAuto && !Usluga_IdUsluga) {
            return res.status(400).send("Brak danych do aktualizacji");
        }

        let query = "UPDATE Auto_Usluga SET ";
        const values = [];

        if (Auto_IdAuto) {
            query += "Auto_IdAuto = ?";
            values.push(Auto_IdAuto);
        }

        if (Usluga_IdUsluga) {
            if (values.length > 0) query += ", ";
            query += "Usluga_IdUsluga = ?";
            values.push(Usluga_IdUsluga);
        }

        query += " WHERE Auto_IdAuto = ? AND Usluga_IdUsluga = ?";
        values.push(idAuto, idUslugi);

        try {
            const [results] = await connection.query<ResultSetHeader>(query, values);

            if (results.affectedRows === 0) {
                return res.status(404).send("Nie znaleziono powiązania do zaktualizowania");
            }

            return res.status(200).send("Powiązanie zostało zaktualizowane");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Wystąpił błąd podczas aktualizacji powiązania");
        }
    }
);

app.delete('/Auto_usluga/:idAuto/:idUslugi', 
    authenticate, authorize((user) => roleGreaterOrEqual(user["role"], "admin")), 
    async (req: Request, res: Response) => {
        const idAuto = req.params["idAuto"];
        const idUslugi = req.params["idUslugi"];

        try {
            const [results] = await connection.query<ResultSetHeader>(
                "DELETE FROM Auto_Usluga WHERE Auto_IdAuto = ? AND Usluga_IdUsluga = ?",
                [idAuto, idUslugi]
            );

            if (results.affectedRows === 0) {
                return res.status(404).send("Nie znaleziono powiązania do usunięcia");
            }

            return res.status(200).send("Powiązanie zostało usunięte");
        } catch (error) {
            console.error(error);
            return res.status(500).send("Wystąpił błąd podczas usuwania powiązania");
        }
    }
);


