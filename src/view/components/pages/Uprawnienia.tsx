import { Stack } from "@mui/material";
import CommonLayout from "../layout/CommonLayout";
import AddFormButton from "../layout/AddFormButton";
import { deleteFromEndpoint, patchEndpoint, postToEndpoint } from "../../backendAccess";
import { uprawnienieSchema } from "../../../common/uprawnienieSchema";
import FormTextField from "../forms/FormTextField";
import FormAutocomplete from "../forms/FormAutocomplete";
import { roles } from "../../../common/userRoles";
import DataTable, { EditableColumnHeader } from "../DataTable";
import { GridActionsCellItem } from "@mui/x-data-grid";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useUser } from "../../firebaseAuth";

const Uprawnienia: React.FC = () => {
    const [user] = useUser();
    return (
        <CommonLayout subpageTitle="Uprawnienia">
            <Stack alignItems="normal" gap={2}>
                <div>
                    <AddFormButton
                        minimalRole="admin"
                        title="Dodaj autoryzowany email"
                        onSubmit={postToEndpoint("/Uprawnienia")}
                        schema={uprawnienieSchema}
                    >
                        <FormTextField type="email" name="email" label="E-mail" required />
                        <FormTextField name="nazwa" label="Nazwa" />
                        <FormAutocomplete label="Rola" name="rola" options={roles} />
                    </AddFormButton>
                </div>
                <DataTable
                    dataEndpoint="/Uprawnienia"
                    editMode="row"
                    processRowUpdate={({ id, ...rest }) => {
                        patchEndpoint(`/Uprawnienia/${id}`)(rest);
                        return { id, ...rest };
                    }}
                    onProcessRowUpdateError={console.error}
                    schema={[
                        { field: "email", flex: 1, minWidth: 220 },
                        {
                            field: "nazwa",
                            flex: 1,
                            minWidth: 150,
                            editable: true,
                            renderHeader: EditableColumnHeader,
                        },
                        {
                            field: "rola",
                            flex: 1,
                            minWidth: 100,
                            editable: true,
                            renderHeader: EditableColumnHeader,
                            type: "singleSelect",
                            valueOptions: [...roles],
                        },
                        {
                            field: "opcje",
                            width: 50,
                            type: "actions",
                            getActions({ id }) {
                                return user?.uid === id
                                    ? []
                                    : [
                                          <GridActionsCellItem
                                              label="usuń"
                                              icon={<DeleteForeverIcon />}
                                              color="error"
                                              onClick={deleteFromEndpoint(`/Uprawnienia/${id}`)}
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

export default Uprawnienia;
