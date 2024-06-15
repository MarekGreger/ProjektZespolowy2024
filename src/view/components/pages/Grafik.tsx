import { Stack } from "@mui/material";
import CommonLayout from "../layout/CommonLayout";
import AddFormButton from "../layout/AddFormButton";
import { DateTimeFormatFromServer, postToEndpoint } from "../../backendAccess";
import { Grafik, grafikSchema } from "../../../common/grafikSchema";
import FormAutocompleteFromEndpoint from "../forms/FormAutocompleteFromEndpoint";
import { Pracownik } from "../../../common/pracownikSchema";
import { Klient } from "../../../common/klientSchema";
import FormDateTimePicker from "../forms/FormDateTimeField";
import DataTable, { DateTimeFormatToView } from "../DataTable";
import dayjs from "dayjs";

interface Props {}
const Grafik: React.FC<Props> = () => {
    return (
        <CommonLayout subpageTitle="Grafik">
            <Stack alignItems={"normal"} gap={2}>
                <div>
                    <AddFormButton
                        minimalRole="kierownik"
                        onSubmit={postToEndpoint("/Grafik")}
                        schema={grafikSchema}
                        title="Dodaj wpis w grafiku"
                    >
                        <FormAutocompleteFromEndpoint<Pracownik>
                            endpoint="/Pracownik"
                            label="Pracownik"
                            name="Pracownik_IdPracownik"
                            getOptionId={(option) => option?.IdPracownik ?? 0}
                            getOptionLabel={(option) =>
                                `${option.Imie} ${option.Nazwisko}\n${option.Email} ${option.IdPracownik}`
                            }
                        />
                        <FormAutocompleteFromEndpoint<Klient>
                            endpoint="/Klient"
                            label="Klient"
                            name="Klient_IdKlient"
                            getOptionId={(option) => option?.IdKlient ?? 0}
                            getOptionLabel={(option) =>
                                `${option.Nazwa}\n${option.NIP} ${option.IdKlient}`
                            }
                        />
                        <FormDateTimePicker name="Czas_rozpoczecia" label="Czas rozpoczęcia" />
                        <FormDateTimePicker name="Czas_zakonczenia" label="Czas zakończenia" />
                    </AddFormButton>
                </div>
                <DataTable<Grafik>
                    dataEndpoint="/Grafik"
                    getRowId={(row) => row.IdGrafik}
                    schema={[
                        {
                            field: "Czas_rozpoczecia",
                            flex: 1,
                            minWidth: 140,
                            headerName: "Czas rozpoczęcia",
                            type: "dateTime",
                            valueGetter: (row) => dayjs(row.value, DateTimeFormatFromServer).toDate(),
                            valueFormatter: (row) => dayjs(row.value).format(DateTimeFormatToView)
                        },
                        {
                            field: "Czas_zakonczenia",
                            flex: 1,
                            minWidth: 140,
                            headerName: "Czas zakończenia",
                            type: "dateTime",
                            valueGetter: (row) => dayjs(row.value, DateTimeFormatFromServer).toDate(),
                            valueFormatter: (row) => dayjs(row.value).format(DateTimeFormatToView)
                        },
                        {
                            field: "Status",
                            flex: 0.5,
                            minWidth: 100,
                            type: "singleSelect",
                            valueOptions: grafikSchema.shape.Status.removeDefault().options,
                        },
                    ]}
                />
            </Stack>
        </CommonLayout>
    );
};

export default Grafik;
