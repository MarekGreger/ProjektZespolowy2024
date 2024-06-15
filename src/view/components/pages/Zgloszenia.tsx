import { Link, Stack } from "@mui/material";
import { Klient } from "../../../common/klientSchema";
import { Pracownik } from "../../../common/pracownikSchema";
import { Zgloszenie, zgloszenieSchema } from "../../../common/zgloszenieSchema";
import { postToEndpoint } from "../../backendAccess";
import DataTable from "../DataTable";
import FormAutocompleteFromEndpoint from "../forms/FormAutocompleteFromEndpoint";
import FormTextField from "../forms/FormTextField";
import FormButton from "../layout/FormButton";
import CommonLayout from "../layout/CommonLayout";
import { useLocation } from "wouter";
import { acceptanceOptions } from "../../../common/AcceptanceStatus";
import { GridActionsCellItem } from "@mui/x-data-grid";

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface Props {}
const Zgloszenia: React.FC<Props> = () => {
    const [_, navigate] = useLocation();
    return (
        <CommonLayout subpageTitle="Zgłoszenia">
            <Stack alignItems={"normal"} gap={2}>
                <div>
                    <FormButton
                        minimalRole="pracownik"
                        schema={zgloszenieSchema}
                        title="Dodaj Zgłoszenie"
                        onSubmit={postToEndpoint("/Zgloszenie")}
                    >
                        {ZgloszeniaFormFields}
                    </FormButton>
                </div>
                <DataTable<Zgloszenie>
                    dataEndpoint="/Zgloszenie"
                    getRowId={(row) => row.IdZgloszenie}
                    onRowDoubleClick={({ row }) =>
                        navigate(`/panel/zgloszenia/${row.IdZgloszenie}`)
                    }
                    schema={[
                        {
                            field: "Klient",
                            headerName: "Klient",
                            flex: 1,
                            valueGetter: ({row}) => row.NazwaKlienta,
                            renderCell: ({ row, value }) => (
                                <Link
                                    onClick={() =>
                                        navigate(`/panel/klienci/${row.Klient_IdKlient}`)
                                    }
                                >
                                    {value}
                                </Link>
                            ),
                        },
                        {
                            field: "Pracownik",
                            flex: 1,
                            valueGetter: ({row}) => `${row.Imie} ${row.Nazwisko}`,
                            renderCell: ({ row, value }) => (
                                <Link
                                    onClick={() =>
                                        navigate(`/panel/pracownicy/${row.Pracownik_IdPracownik}`)
                                    }
                                    >
                                    {value}
                                </Link>
                            ),
                        },
                        { field: "Opis", flex: 1 },
                        {
                            field: "Status",
                            flex: 1,
                            type: "singleSelect",
                            valueOptions: acceptanceOptions,
                        },
                        // TODO: add missing fields
                        {
                            field: "opcje",
                            width: 50,
                            type: "actions",
                            getActions({ id }) {
                                return [
                                          <GridActionsCellItem
                                              label="wyświetl"
                                              icon={<MoreHorizIcon />}
                                              onClick={() => navigate(`/panel/zgloszenia/${id}`)}
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

export const ZgloszeniaFormFields = (
    <>
        <FormAutocompleteFromEndpoint<Pracownik>
            endpoint="/Pracownik"
            label="Pracownik"
            name="Pracownik_IdPracownik"
            getOptionId={(option) => option?.IdPracownik ?? null}
            getOptionLabel={(option) =>
                `${option.Imie} ${option.Nazwisko}\n${option.Email} ${option.IdPracownik}`
            }
        />
        <FormAutocompleteFromEndpoint<Klient>
            endpoint="/Klient"
            label="Klient"
            name="Klient_IdKlient"
            getOptionId={(option) => option?.IdKlient ?? null}
            getOptionLabel={(option) => `${option.Nazwa}\n${option.NIP} ${option.IdKlient}`}
        />
        <FormTextField name="Opis" label="Opis" multiline minRows={3} />
    </>
);
export default Zgloszenia;
