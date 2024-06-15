import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FormDialog from "../forms/FormDialog";
import { ComponentProps, useState } from "react";
import { Role, roleGreaterOrEqual } from "../../../common/userRoles";
import { useRole } from "../../firebaseAuth";
import { FieldValues } from "react-hook-form";

type Props<T extends FieldValues> = Omit<ComponentProps<typeof FormDialog<T>>, "open" | "onClose"> & {
    minimalRole?: Role;
};
const AddFormButton = <T extends FieldValues>({ minimalRole = "brak", ...formProps }: Props<T>) => {
    const [isOpen, setOpen] = useState<boolean>(false);

    const [role] = useRole();
    if (!role || !roleGreaterOrEqual(role, minimalRole)) {
        return <></>;
    }

    return (
        <>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                Dodaj
            </Button>
            <FormDialog {...formProps} open={isOpen} onClose={() => setOpen(false)} />
        </>
    );
};

export default AddFormButton;
