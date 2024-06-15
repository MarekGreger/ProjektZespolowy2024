import { Stack } from "@mui/material";
import { Auto, autoSchema } from "../../../common/autoSchema";
import {
    formDateTime,
    deleteFromEndpoint,
    patchEndpoint,
    useGetEndpoint,
    showDateTime,
    postToEndpoint,
} from "../../backendAccess";
import CommonLayout from "../layout/CommonLayout";
import DetailsCard from "../layout/DetailsCard";
import DataTable, { DateTimeFormatToView } from "../DataTable";
import ActionRow from "../layout/ActionRow";
import FormButton from "../layout/FormButton";
import { AutaFormFields, adHockDateFormat } from "./Auta";

import { useLocation } from "wouter";
import DeleteButton from "../layout/DeleteButton";
import { GridActionsCellItem } from "@mui/x-data-grid";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Auto_pracownik, auto_pracownikSchema } from "../../../common/auto_pracownikSchema";
import { Auto_usluga, auto_uslugaSchema } from "../../../common/auto_uslugaSchema";
import dayjs from "dayjs";
import FormAutocompleteFromEndpoint from "../forms/FormAutocompleteFromEndpoint";
import { Pracownik } from "../../../common/pracownikSchema";
import { Usluga } from "../../../common/uslugaSchema";

interface Props {
    params: {
        id: string;
    };
}
const AutoDetails: React.FC<Props> = ({ params: { id } }) => {
    const { data, isLoading } = useGetEndpoint<Auto>(`/Auto/${id}`);
    const [_, navigate] = useLocation();
    return (
        <CommonLayout subpageTitle={data?.Rejestracja ?? ""} center>
            <Stack alignItems={"center"} gap={3}>
                <ActionRow>
                    <FormButton
                        variant="edit"
                        onSubmit={patchEndpoint(`/Auto/${id}`)}
                        title="Edytuj auto"
                        schema={autoSchema}
                        isLoading={isLoading}
                        defaultValues={{
                            ...data,
                            Czas_rozpoczecia: formDateTime(data?.Czas_rozpoczecia),
                            Czas_zakonczenia: formDateTime(data?.Czas_zakonczenia),
                        }}
                    >
                        {AutaFormFields}
                    </FormButton>
                    <DeleteButton
                        onClick={() => {
                            deleteFromEndpoint(`/Auto/${id}`)().then(() => {
                                navigate("/panel/auta");
                            });
                        }}
                    />
                </ActionRow>
                <DetailsCard title="Specyfikacja">
                    <dl>
                        <dt>Marka</dt>
                        <dd>{data?.Marka}</dd>
                        <dt>Model</dt>
                        <dd>{data?.Model}</dd>
                    </dl>
                </DetailsCard>
                <DetailsCard title="Przedział pracy">
                    <dl>
                        <dt>Czas rozpoczęcia</dt>
                        <dd>{showDateTime(data?.Czas_rozpoczecia)}</dd>
                        <dt>Czas zakończenia</dt>
                        <dd>
                            {dayjs(data?.Czas_zakonczenia, adHockDateFormat).format(
                                DateTimeFormatToView
                            )}
                        </dd>
                    </dl>
                </DetailsCard>
                <DetailsCard title="Klient">{data?.Klient_nazwa}</DetailsCard>
                <DetailsCard title="Dodatkowe informacje">{data?.Dodatkowe_informacje}</DetailsCard>
                <DetailsCard title="Wykonywane usługi">
                    <FormButton
                        onSubmit={postToEndpoint("/Auto_usluga")}
                        schema={auto_uslugaSchema}
                        title="Dodaj wykonywaną usługę"
                    >
                        <input type="hidden" name="Auto_IdAuto" value={id} />
                        <FormAutocompleteFromEndpoint<Usluga>
                            name="Usluga_IdUsluga"
                            endpoint="/Usluga"
                            label="Usługa"
                            getOptionId={(x) => x?.IdUsluga ?? 0}
                            getOptionLabel={(x) => x.Nazwa}
                        />
                    </FormButton>
                    <DataTable<Auto_usluga>
                        dataEndpoint={`/Auto_usluga/auto/${id}`}
                        getRowId={(row) => row.Usluga_IdUsluga}
                        schema={[
                            { field: "Nazwa", flex: 1 },
                            { field: "Opis", flex: 3 },
                        ]}
                    />
                </DetailsCard>
                <DetailsCard title="Pracownicy odpowiedzialni">
                    <FormButton
                        onSubmit={postToEndpoint("/Auto_pracownik")}
                        schema={auto_pracownikSchema}
                        title="Przydziel pracownika"
                    >
                        <input type="hidden" name="Auto_IdAuto" value={id} />
                        <FormAutocompleteFromEndpoint<Pracownik>
                            endpoint="/Pracownik"
                            label="Pracownik"
                            name="Pracownik_IdPracownik"
                            getOptionId={(option) => option?.IdPracownik ?? null}
                            getOptionLabel={(option) =>
                                `${option.Imie} ${option.Nazwisko}\n${option.Email} ${option.IdPracownik}`
                            }
                        />
                    </FormButton>
                    <DataTable<Auto_pracownik>
                        dataEndpoint={`/Auto_pracownik/auto/:id`}
                        getRowId={(row) => row.Pracownik_IdPracownik}
                        onRowDoubleClick={({ row }) =>
                            navigate(`/panel/pracownicy/${row.Pracownik_IdPracownik}`)
                        }
                        schema={[
                            { field: "Email", flex: 1 },
                            { field: "Imie", flex: 1 },
                            { field: "Nazwisko", flex: 1 },
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
                            },
                        ]}
                    />
                </DetailsCard>
            </Stack>
        </CommonLayout>
    );
};

export default AutoDetails;
