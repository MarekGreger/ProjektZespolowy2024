import { Button } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useUser } from "../../firebaseAuth";

import CommonLayout from "./CommonLayout";


interface Props {}
const MockForms: React.FC<Props> = () => {
    const [activeFormId, setActiveFormId] = useState<1 | 2 | 3 | null>(null);
    const closeDialog = useCallback(() => setActiveFormId(null), []);
    const [user] = useUser();
    return (
        <CommonLayout pageTitle="MOXLY" subpageTitle="Panel">
            <Button onClick={() => setActiveFormId(1)} variant="outlined">
                Dodaj klienta
            </Button>
            <Button onClick={() => setActiveFormId(2)} variant="outlined">
                Dodaj pracownika
            </Button>
            <Button onClick={() => setActiveFormId(3)} variant="outlined">
                Dodaj żądanie
            </Button>

            {/* <FormDialog
                open={activeFormId === 2}
                onClose={closeDialog}
                submitEndpoint="Pracownik"
                title="formularz 2"
            >
                <TextField type="email" name="email" label="E-mail" />
                <TextField 
                    type="password" 
                    label="Hasło" 
                    required 
                    inputProps={{
                        pattern: "^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}[]:;<>,.?~\\/-]).{8,}$"
                    }}
                    helperText="Hasło musi zawierać co najmniej jedną dużą literę, jeden znak specjalny i mieć co najmniej 8 znaków długości."
                />
                <TextField name="imie" label="Imię" />
                <TextField name="nazwisko" label="Nazwisko" />
                <TextField 
                    type="tel" 
                    name="telefon" 
                    label="Telefon" 
                    required 
                    inputProps={{
                        pattern: "^[0-9]{9}$"
                    }}
                    helperText="Numer musi mieć dokładnie 9 cyfr" />
            </FormDialog> */}

            {/* <FormDialog
                open={activeFormId === 3}
                onClose={closeDialog}
                onSubmit={postToEndpoint("Zgloszenie")}
                title="formularz 3"
            >
                <TextField 
                    type="number" 
                    name="pracownikID" 
                    label="Pracownik ID" 
                    inputProps={{
                        min: "1"
                    }}
                />
                <TextField 
                    type="number" 
                    name="klientID" 
                    label="Klient ID" 
                    inputProps={{
                        min: "1"
                    }}
                />
                <TextField name="opis" label="Opis" multiline minRows={2} />
                <TextField name="status" label="Status" />
            </FormDialog> */}

        </CommonLayout>
    );
};

export default MockForms;
