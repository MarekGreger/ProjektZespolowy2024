import { Link, Stack, Typography } from "@mui/material";
import CommonLayout from "../layout/CommonLayout";
import { Zgloszenie, zgloszenieSchema } from "../../../common/zgloszenieSchema";
import {
    deleteFromEndpoint,
    patchEndpoint,
    putToEndpoint,
    useGetEndpoint,
} from "../../backendAccess";
import { useLocation } from "wouter";
import ActionRow from "../layout/ActionRow";
import FormButton from "../layout/FormButton";
import { ZgloszeniaFormFields } from "./Zgloszenia";
import DeleteButton from "../layout/DeleteButton";
import DetailsCard from "../layout/DetailsCard";
import { AcceptanceActions, statusStyles } from "../layout/AcceptanceActions";

interface Props {
    params: {
        id: string;
    };
}
const ZgloszenieDetails: React.FC<Props> = ({ params: { id } }) => {
    const endpoint = `/Zgloszenie/${id}` as const;
    const { data, isLoading } = useGetEndpoint<Zgloszenie>(endpoint);
    const [_, navigate] = useLocation();
    return (
        <CommonLayout subpageTitle={`Zgłoszenie do salonu ${data?.Klient_IdKlient}`} center>
            <Stack alignItems={"center"} gap={3}>
                <ActionRow>
                    <FormButton
                        variant="edit"
                        onSubmit={patchEndpoint(endpoint)}
                        schema={zgloszenieSchema}
                        title="Edytuj zgłoszenie"
                        isLoading={isLoading}
                        defaultValues={data}
                    >
                        {ZgloszeniaFormFields}
                    </FormButton>
                    <DeleteButton
                        onClick={() => {
                            deleteFromEndpoint(endpoint)().then(() => {
                                navigate("/panel/zgloszenia");
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
                            onAccept={() => putToEndpoint(`/Zgloszenie/${id}/acceptance`)()}
                            onReject={() => deleteFromEndpoint(`/Zgloszenie/${id}/acceptance`)()}
                        />
                    </Stack>
                </DetailsCard>
                <DetailsCard title="Dane klienta">
                    <Link onClick={() => navigate(`/panel/klienci/${data?.Klient_IdKlient}`)}>
                        {data?.NazwaKlienta}
                    </Link>
                </DetailsCard>
                <DetailsCard title="Pracownik odpowiedzialny">
                    <Link
                        onClick={() => navigate(`/panel/pracownicy/${data?.Pracownik_IdPracownik}`)}
                    >
                        {data?.Imie} {data?.Nazwisko}
                    </Link>
                </DetailsCard>
                <DetailsCard title="Opis">{data?.Opis}</DetailsCard>
            </Stack>
        </CommonLayout>
    );
};

export default ZgloszenieDetails;
