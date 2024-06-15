import { Klient, klientSchema } from "../../../common/klientSchema";
import { postToEndpoint } from "../../backendAccess";
import AddFormButton from "../layout/AddFormButton";
import FormTextField from "../forms/FormTextField";
import CommonLayout from "../layout/CommonLayout";

import DataTable from "../DataTable";
import { Stack } from "@mui/material";

const Klienci: React.FC = () => (
    <CommonLayout pageTitle="MOXLY" subpageTitle="Klienci">
        <Stack alignItems={"normal"} gap={2}>
            <div>
                <AddFormButton
                    minimalRole="kierownik"
                    schema={klientSchema}
                    onSubmit={postToEndpoint("/Klient")}
                    title="Dodaj klienta"
                >
                    <FormTextField name="Nazwa" label="Nazwa" required />
                    <FormTextField type="email" name="Email" label="E-mail" required />
                    <FormTextField name="Adres" label="Adres" required />
                    <FormTextField
                        name="NIP"
                        label="NIP"
                        required
                        // helperText="Numer musi mieć dokładnie 10 cyfr"
                    />
                    <FormTextField
                        type="tel"
                        name="Telefon"
                        label="Telefon"
                        required
                        // helperText="Numer musi mieć dokładnie 9 cyfr"
                    />
                </AddFormButton>
            </div>
            <DataTable<Klient>
                dataEndpoint="/Klient"
                getRowId={(row) => row.IdKlient}
                schema={[
                    { field: "Nazwa", flex: 1, minWidth: 200 },
                    { field: "Email", flex: 1, minWidth: 250 },
                    { field: "Adres", flex: 1, minWidth: 250 },
                    { field: "NIP", flex: 0.5, minWidth: 110 },
                    { field: "Telefon", flex: 1, minWidth: 140 },
                ]}
            />
        </Stack>
    </CommonLayout>
);

export default Klienci;
