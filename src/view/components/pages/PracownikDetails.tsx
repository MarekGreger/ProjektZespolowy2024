import { useLocation } from "wouter";
import { Pracownik, pracownikSchema } from "../../../common/pracownikSchema";
import { deleteFromEndpoint, patchEndpoint, useGetEndpoint } from "../../backendAccess";
import CommonLayout from "../layout/CommonLayout";
import { Stack } from "@mui/material";
import ActionRow from "../layout/ActionRow";
import FormButton from "../layout/FormButton";
import { PracownicyFormFields } from "./Pracownicy";
import DeleteButton from "../layout/DeleteButton";
import DetailsCard from "../layout/DetailsCard";
import DataTable from "../DataTable";
import { grafikTableSchema } from "./Grafik";
import { Grafik } from "../../../common/grafikSchema";

interface Props {
    params: {
        id: string;
    };
}
const PracownikDetails: React.FC<Props> = ({ params: { id } }) => {
    const endpoint = `/Pracownik/${id}` as const;
    const { data, isLoading } = useGetEndpoint<Pracownik>(endpoint);
    const [_, navigate] = useLocation();
    return (
        <CommonLayout subpageTitle={`Pracownik ${data?.Imie} ${data?.Nazwisko}`} center>
            <Stack alignItems={"center"} gap={3}>
                <ActionRow>
                    <FormButton
                        variant="edit"
                        title="Edytuj dane pracownika"
                        onSubmit={patchEndpoint(endpoint)}
                        schema={pracownikSchema}
                        isLoading={isLoading}
                        defaultValues={data}
                    >
                        {PracownicyFormFields}
                    </FormButton>
                    <DeleteButton
                        onClick={() => {
                            deleteFromEndpoint(endpoint)().then(() => {
                                navigate("/panel/pracownicy");
                            });
                        }}
                    />
                </ActionRow>
                <DetailsCard title="Dane kontaktowe">
                    <dl>
                        <dt>E-mail</dt>
                        <dd><a href={`mailto:${data?.Email}`}>{data?.Email}</a></dd>
                        <dt>Telefon</dt>
                        <dd><a href={`tel:${data?.Telefon}`}>{data?.Telefon}</a></dd>
                    </dl>
                </DetailsCard>
                <DetailsCard title="Grafik">
                        <DataTable<Grafik>
                            getRowId={(row) => row.IdGrafik}
                            dataEndpoint={`/Pracownik/${id}/grafik`}
                            schema={grafikTableSchema(navigate)}
                            onRowDoubleClick={({ row }) => navigate(`/panel/grafik/${row.IdGrafik}`)}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        Pracownik: false
                                    }
                                }
                            }}
                        />
                </DetailsCard>
            </Stack>
        </CommonLayout>
    );
};

export default PracownikDetails;
