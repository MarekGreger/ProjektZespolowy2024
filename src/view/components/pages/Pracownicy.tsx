import { Stack } from "@mui/material";
import CommonLayout from "../layout/CommonLayout";
import FormButton from "../layout/FormButton";
import { postToEndpoint } from "../../backendAccess";
import { Pracownik, pracownikSchema } from "../../../common/pracownikSchema";
import FormTextField from "../forms/FormTextField";
import DataTable from "../DataTable";
import { useLocation } from "wouter";
import { GridActionsCellItem } from "@mui/x-data-grid";

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Pracownicy: React.FC = () => {
    const [_, navigate] = useLocation();
    return (
        <CommonLayout subpageTitle="Pracownicy">
            <Stack alignItems={"normal"} gap={2}>
                <div>
                    <FormButton
                        minimalRole="kierownik"
                        onSubmit={postToEndpoint("/Pracownik")}
                        schema={pracownikSchema}
                        title="Dodaj Pracownika"
                    >{PracownicyFormFields}</FormButton>
                </div>
                <DataTable<Pracownik>
                    dataEndpoint="/Pracownik"
                    getRowId={(row) => row.IdPracownik}
                    onRowDoubleClick={({row}) => navigate(`/panel/pracownicy/${row.IdPracownik}`)}
                    schema={[
                        { field: "Email", flex: 1, minWidth: 200 },
                        { field: "Imie", flex: 1, minWidth: 100 },
                        { field: "Nazwisko", flex: 1, minWidth: 150 },
                        { field: "Telefon", flex: 1, minWidth: 100 },
                        {
                            field: "opcje",
                            width: 50,
                            type: "actions",
                            getActions({ id }) {
                                return [
                                          <GridActionsCellItem
                                              label="wyświetl"
                                              icon={<MoreHorizIcon />}
                                              onClick={() => navigate(`/panel/pracownicy/${id}`)}
                                              key="display"
                                          ></GridActionsCellItem>,
                                      ];
                            },
                        }
                    ]}
                />
            </Stack>
        </CommonLayout>
    );
};

export const PracownicyFormFields = (
    <>
        <FormTextField name="Email" label="E-mail" type="email" required />
        <FormTextField name="Imie" label="Imię" />
        <FormTextField name="Nazwisko" label="Nazwisko" />
        <FormTextField name="Telefon" label="Telefon" type="tel" />
    </>
);

export default Pracownicy;
