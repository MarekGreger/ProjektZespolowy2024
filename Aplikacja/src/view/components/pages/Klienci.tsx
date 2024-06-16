import { Klient, klientSchema } from "../../../common/klientSchema";
import { postToEndpoint } from "../../backendAccess";
import FormButton from "../layout/FormButton";
import FormTextField from "../forms/FormTextField";
import CommonLayout from "../layout/CommonLayout";

import DataTable from "../DataTable";
import { Stack } from "@mui/material";
import { useLocation } from "wouter";
import { GridActionsCellItem } from "@mui/x-data-grid";

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Klienci: React.FC = () => {
    const [_, navigate] = useLocation();
    return(
    <CommonLayout pageTitle="MOXLY" subpageTitle="Klienci">
        <Stack alignItems={"normal"} gap={2}>
            <div>
                <FormButton
                    minimalRole="kierownik"
                    schema={klientSchema}
                    onSubmit={postToEndpoint("/Klient")}
                    title="Dodaj klienta"
                >{KlienciFormFields}</FormButton>
            </div>
            <DataTable<Klient>
                dataEndpoint="/Klient"
                getRowId={(row) => row.IdKlient}
                onRowDoubleClick={({row}) => navigate(`/panel/klienci/${row.IdKlient}`)}
                schema={[
                    { field: "Nazwa", flex: 1, minWidth: 200 },
                    { field: "Email", flex: 1, minWidth: 250 },
                    { field: "Adres", flex: 1, minWidth: 250 },
                    { field: "NIP", flex: 0.5, minWidth: 110 },
                    { field: "Telefon", flex: 1, minWidth: 140 },
                    {
                        field: "opcje",
                        width: 50,
                        type: "actions",
                        getActions({ id }) {
                            return [
                                      <GridActionsCellItem
                                          label="wyświetl"
                                          icon={<MoreHorizIcon />}
                                          onClick={() => navigate(`/panel/klienci/${id}`)}
                                          key="display"
                                      ></GridActionsCellItem>,
                                  ];
                        },
                    },
                ]}
            />
        </Stack>
    </CommonLayout>
)};

export const KlienciFormFields = (
    <>
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
    </>
);

export default Klienci;
