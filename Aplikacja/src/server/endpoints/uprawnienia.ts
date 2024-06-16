import { UprawnieniePayload, uprawnienieSchema } from "../../common/uprawnienieSchema";
import app from "../app";
import firebaseAdmin from "firebase-admin";
import { authenticate, authorize } from "../middleware/firebaseAuth";
import { validateBody } from "../middleware/zodValidation";
import { z } from "zod";

const auth = firebaseAdmin.auth();

app.get("/Uprawnienia", authenticate, authorize("admin"), async (_, res) => {
    const { users } = await auth.listUsers(1000);
    res.status(200).json(
        users.map((user) => ({
            id: user.uid,
            email: user.email!,
            nazwa: user.displayName!,
            rola: user.customClaims?.["role"] ?? "brak",
        })) satisfies UprawnieniePayload[]
    );
});

app.post(
    "/Uprawnienia",
    authenticate,
    authorize("admin"),
    validateBody(uprawnienieSchema),
    async (req, res) => {
        const body = req.body as UprawnieniePayload;
        const newUser = await auth.createUser({
            email: body.email,
            displayName: body.nazwa,
        });
        await auth.setCustomUserClaims(newUser.uid, {
            role: body.rola,
        });
        res.status(200).send("Dodano email do listy autoryzowanych");
    }
);

const uprawnieniaPatchSchema = uprawnienieSchema.partial().omit({ email: true });
app.patch(
    "/Uprawnienia/:id",
    authenticate,
    authorize("admin"),
    validateBody(uprawnieniaPatchSchema),
    async (req, res) => {
        const id = req.params["id"];
        if (!id) {
            res.status(404).send("Nieprawidłowe id");
            return;
        }
        const body = req.body as z.infer<typeof uprawnieniaPatchSchema>;

        if (body.nazwa) {
            await auth.updateUser(id, {
                displayName: body.nazwa,
            });
        }
        if (body.rola) {
            await auth.setCustomUserClaims(id, {
                role: body.rola,
            });
        }
        res.status(200).send("Zaktualizowano dane uzytkownika");
    }
);

app.delete("/Uprawnienia/:id", authenticate, authorize("admin"), async (req, res) => {
    try {
        await auth.deleteUser(req.params["id"]!);
        res.status(200).send("pomyslnie usunieto uzytkownika");
    } catch {
        res.status(404).send("nie usunieto uzytkownika");
    }
});
