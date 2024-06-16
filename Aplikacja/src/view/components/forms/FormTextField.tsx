import { TextField, TextFieldProps } from "@mui/material";
import React, { useContext } from "react";
import { useController } from "react-hook-form";
import { formContext } from "./FormDialog";

type Props = TextFieldProps & { name: string };
const FormTextField: React.FC<Props> = ({ name, ...textFieldProps }) => {
    const formControl = useContext(formContext);
    const { field, fieldState } = useController({ name, control: formControl! });
    
    return (
        <TextField
            {...field}
            value={field.value ?? ""}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message ?? textFieldProps.helperText}
            {...textFieldProps}
        />
    );
};

export default FormTextField;
