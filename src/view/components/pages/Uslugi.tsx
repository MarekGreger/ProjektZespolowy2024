import { Stack } from "@mui/material";
import CommonLayout from "../layout/CommonLayout";
import AddFormButton from "../layout/AddFormButton";
import { postToEndpoint } from "../../backendAccess";
import { Usluga, uslugaSchema } from "../../../common/uslugaSchema";
import FormTextField from "../forms/FormTextField";
import DataTable from "../DataTable";

interface Props {}
const Uslugi: React.FC<Props> = () => {
    return (
        <CommonLayout subpageTitle="Usługi">
            <Stack alignItems={"normal"} gap={2}>
                <div>
                    <AddFormButton
                        minimalRole="kierownik"
                        onSubmit={postToEndpoint("/Usluga")}
                        schema={uslugaSchema}
                        title="Dodaj usługę"
                    >
                        <FormTextField name="Nazwa" label="Nazwa" />
                        <FormTextField name="Opis" label="Opis" multiline minRows={3} />
                    </AddFormButton>
                </div>

                <DataTable<Usluga>
                    dataEndpoint="/Usluga"
                    getRowId={row => row.IdUsluga}
                    schema={[
                        { field: "Nazwa", flex: 1, minWidth: 200 },
                        { field: "Opis", flex: 3, minWidth: 300 },
                    ]}
                />
            </Stack>
        </CommonLayout>
    );
};

export default Uslugi;
