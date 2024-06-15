import { useLocation } from "wouter";
import { Grafik, grafikSchema } from "../../../common/grafikSchema";
import {
    deleteFromEndpoint,
    formDateTime,
    patchEndpoint,
    putToEndpoint,
    showDateTime,
    useGetEndpoint,
} from "../../backendAccess";
import CommonLayout from "../layout/CommonLayout";
import { Link, Stack, Typography } from "@mui/material";
import ActionRow from "../layout/ActionRow";
import FormButton from "../layout/FormButton";
import { GrafikFormFields } from "./Grafik";
import DeleteButton from "../layout/DeleteButton";
import DetailsCard from "../layout/DetailsCard";
import { AcceptanceActions, statusStyles } from "../layout/AcceptanceActions";

interface Props {
    params: {
        id: string;
    };
}
const GrafikDetails: React.FC<Props> = ({ params: { id } }) => {
    const endpoint = `/Grafik/${id}` as const;
    const { data, isLoading } = useGetEndpoint<Grafik>(endpoint);
    const [_, navigate] = useLocation();
    return (
        <CommonLayout subpageTitle={`Wpis w grafiku ${data?.Imie} ${data?.Nazwisko}`} center>
            <Stack alignItems={"center"} gap={3}>
                <ActionRow>
                    <FormButton
                        variant="edit"
                        onSubmit={patchEndpoint(endpoint)}
                        schema={grafikSchema}
                        title="Edytuj wpis w grafiku"
                        isLoading={isLoading}
                        defaultValues={{
                            ...data,
                            Czas_rozpoczecia: formDateTime(data?.Czas_rozpoczecia),
                            Czas_zakonczenia: formDateTime(data?.Czas_zakonczenia),
                        }}
                    >
                        {GrafikFormFields}
                    </FormButton>
                    <DeleteButton
                        onClick={() => {
                            deleteFromEndpoint(endpoint)().then(() => {
                                navigate("/panel/grafik");
                            });
                        }}
                    />
                </ActionRow>
                <DetailsCard title="Status">
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="h6" component="div" sx={statusStyles(data?.Status)}>
                            {data?.Status}
                        </Typography>
                        <AcceptanceActions
                            minimalRole="kierownik"
                            onAccept={() => putToEndpoint(`/Grafik/${id}/acceptance`)()}
                            onReject={() => deleteFromEndpoint(`/Grafik/${id}/acceptance`)()}
                        />
                    </Stack>
                </DetailsCard>
                <DetailsCard title="Pracownik odpowiedzialny">
                    <Link
                        onClick={() => navigate(`/panel/pracownicy/${data?.Pracownik_IdPracownik}`)}
                    >
                        {data?.Imie} {data?.Nazwisko}
                    </Link>
                </DetailsCard>
                <DetailsCard title="Dla klienta">
                    <Link onClick={() => navigate(`/panel/klienci/${data?.Klient_IdKlient}`)}>
                        {data?.Nazwa}
                    </Link>
                </DetailsCard>
                <DetailsCard title="Przedział czasowy">
                    <dl>
                        <dt>Od</dt>
                        <dd>{showDateTime(data?.Czas_rozpoczecia)}</dd>
                        <dt>Do</dt>
                        <dd>{showDateTime(data?.Czas_zakonczenia)}</dd>
                    </dl>
                </DetailsCard>
            </Stack>
        </CommonLayout>
    );
};

export default GrafikDetails;
