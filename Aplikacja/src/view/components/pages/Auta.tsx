import { Link, Stack } from "@mui/material";
import CommonLayout from "../layout/CommonLayout";
import FormButton from "../layout/FormButton";
import { postToEndpoint } from "../../backendAccess";
import { Auto, autoSchema } from "../../../common/autoSchema";
import FormTextField from "../forms/FormTextField";
import FormAutocompleteFromEndpoint from "../forms/FormAutocompleteFromEndpoint";
import { Klient } from "../../../common/klientSchema";
import FormDateTimePicker from "../forms/FormDateTimeField";
import { Model } from "../../../common/modelSchema";
import DataTable, { DateTimeFormatToView } from "../DataTable";
import dayjs from "dayjs";
import { useLocation } from "wouter";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { DateTimeFormatFromServer } from "../../../common/DateTime";

export const adHockDateFormat = "YYYY-MM-DD HH-mm-ss";

const Auta: React.FC = () => {
    const [_, navigate] = useLocation();
    return (
        <CommonLayout subpageTitle="Auta">
            <Stack alignItems={"normal"} gap={2}>
                <div>
                    <FormButton
                        minimalRole="pracownik"
                        title="Dodaj Auto"
                        onSubmit={postToEndpoint("/Auto")}
                        schema={autoSchema}
                        defaultValues={{
                            Czas_rozpoczecia: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                        }}
                    >
                        {AutaFormFields}
                    </FormButton>
                </div>
                <DataTable<Auto>
                    dataEndpoint={"/Auto"}
                    getRowId={(row) => row.IdAuto}
                    onRowDoubleClick={({ row }) => navigate(`/panel/auta/${row.IdAuto}`)}
                    schema={autaTableSchema(navigate)}
                />
            </Stack>
        </CommonLayout>
    );
};

export const AutaFormFields = (
    <>
        <FormTextField name="Rejestracja" label="Rejestracja" required />
        <FormAutocompleteFromEndpoint<Model>
            endpoint="/Model"
            name="Model_IdModel"
            label="Model"
            getOptionId={(model) => model?.IdModel ?? 0}
            getOptionLabel={(model) => `${model?.Marka} ${model?.Model}`}
        />
        <FormAutocompleteFromEndpoint<Klient>
            endpoint="/Klient"
            label="Klient"
            name="Klient_IdKlient"
            getOptionId={(option) => option?.IdKlient ?? 0}
            getOptionLabel={(option) => `${option.Nazwa}\n${option.NIP} ${option.IdKlient}`}
        />
        <FormDateTimePicker name="Czas_rozpoczecia" label="Czas rozpoczęcia" />
        <FormDateTimePicker name="Czas_zakonczenia" label="Czas zakończenia" />
        <FormTextField
            name="Dodatkowe_informacje"
            label="Dodatkowe informacje"
            multiline
            minRows={3}
        />
    </>
);

export const autaTableSchema: (navigator: (to: string) => void) => GridColDef<Auto>[] = (
    navigate
) => [
    {
        field: "Klient_nazwa",
        flex: 1,
        renderCell: ({ row }) => (
            <Link onClick={() => navigate(`/panel/klienci/${row.IdKlient}`)}>
                {row.Klient_nazwa}
            </Link>
        ),
    },
    { field: "Rejestracja", flex: 1, minWidth: 100 },
    {
        field: "Czas_rozpoczecia",
        flex: 1,
        minWidth: 150,
        headerName: "Czas rozpoczęcia",
        type: "dateTime",
        valueGetter: (row) => dayjs(row.value, DateTimeFormatFromServer).toDate(),
        valueFormatter: (row) => dayjs(row.value).format(DateTimeFormatToView),
    },
    {
        field: "Czas_zakonczenia",
        flex: 1,
        minWidth: 150,
        headerName: "Czas zakończenia",
        type: "dateTime",

        valueGetter: (row) => dayjs(row.value, adHockDateFormat).toDate(),
        valueFormatter: (row) =>
            isNaN(row.value) ? "w trakcie" : dayjs(row.value).format(DateTimeFormatToView),
    },
    {
        field: "Dodatkowe_informacje",
        flex: 1,
        headerName: "Dodatkowe informacje",
        minWidth: 300,
    },
    {
        field: "opcje",
        width: 50,
        type: "actions",
        getActions({ id }) {
            return [
                <GridActionsCellItem
                    label="wyświetl"
                    icon={<MoreHorizIcon />}
                    onClick={() => navigate(`/panel/auta/${id}`)}
                    key="display"
                ></GridActionsCellItem>,
            ];
        },
    },
];

export default Auta;
