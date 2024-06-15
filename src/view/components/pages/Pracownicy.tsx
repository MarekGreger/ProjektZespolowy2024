import { Stack } from "@mui/material";
import CommonLayout from "../layout/CommonLayout";
import AddFormButton from "../layout/AddFormButton";
import { postToEndpoint } from "../../backendAccess";
import { Pracownik, pracownikSchema } from "../../../common/pracownikSchema";
import FormTextField from "../forms/FormTextField";
import DataTable from "../DataTable";

const Pracownicy: React.FC = () => {
    return (
        <CommonLayout subpageTitle="Pracownicy">
            <Stack alignItems={"normal"} gap={2}>
                <div>
                    <AddFormButton
                        minimalRole="kierownik"
                        onSubmit={postToEndpoint("/Pracownik")}
                        schema={pracownikSchema}
                        title="Dodaj Pracownika"
                    >
                        <FormTextField name="email" label="E-mail" type="email" required />
                        <FormTextField name="imie" label="Imię" />
                        <FormTextField name="nazwisko" label="Nazwisko" />
                        <FormTextField name="telefon" label="Telefon" type="tel" />
                    </AddFormButton>
                </div>
                <DataTable<Pracownik>
                    dataEndpoint="/Pracownik"
                    getRowId={(row) => row.IdPracownik}
                    schema={[
                        { field: "Email", flex: 1, minWidth: 200 },
                        { field: "Imie", flex: 1, minWidth: 100 },
                        { field: "Nazwisko", flex: 1, minWidth: 150 },
                        { field: "Telefon", flex: 1, minWidth: 100 },
                    ]}
                />
            </Stack>
        </CommonLayout>
    );
};

export default Pracownicy;
