import { Stack } from "@mui/material";
import CommonLayout from "../layout/CommonLayout";
import AddFormButton from "../layout/AddFormButton";
import { deleteFromEndpoint, patchEndpoint, postToEndpoint } from "../../backendAccess";
import { Model, modelSchema } from "../../../common/modelSchema";
import FormTextField from "../forms/FormTextField";
import DataTable, { EditableColumnHeader } from "../DataTable";
import { GridActionsCellItem } from "@mui/x-data-grid";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

interface Props {}
const Modele: React.FC<Props> = () => {
    return (
        <CommonLayout subpageTitle="Modele">
            <Stack alignItems={"normal"} gap={2}>
                <div>
                    <AddFormButton
                        minimalRole="kierownik"
                        onSubmit={postToEndpoint("/Model")}
                        schema={modelSchema}
                        title="Dodaj model"
                    >
                        <FormTextField name="Marka" label="Marka" />
                        <FormTextField name="Model" label="Model" />
                    </AddFormButton>
                </div>
                <DataTable<Model>
                    dataEndpoint="/Model"
                    editMode="cell"
                    processRowUpdate={({ IdModel, ...rest }) => {
                        patchEndpoint(`/Model/${IdModel}`)(rest);
                        return { IdModel, ...rest };
                    }}
                    getRowId={(row) => row.IdModel}
                    schema={[
                        {
                            field: "Marka",
                            flex: 1,
                            editable: true,
                            renderHeader: EditableColumnHeader,
                        },
                        {
                            field: "Model",
                            flex: 1,
                            editable: true,
                            renderHeader: EditableColumnHeader,
                        },
                        {
                            field: "opcje",
                            width: 50,
                            type: "actions",
                            getActions({ id }) {
                                return [
                                    <GridActionsCellItem
                                        label="usuń"
                                        icon={<DeleteForeverIcon />}
                                        color="error"
                                        onClick={deleteFromEndpoint(`/Model/${id}`)}
                                        key="delete"
                                    ></GridActionsCellItem>,
                                ];
                            },
                        },
                    ]}
                />
            </Stack>
        </CommonLayout>
    );
};

export default Modele;
