import { useContext } from "react";
import { formContext } from "./FormDialog";
import { useController } from "react-hook-form";
import { Autocomplete, AutocompleteProps, TextField } from "@mui/material";

interface Props<T> extends Partial<AutocompleteProps<T, false, false, false>> {
    name: string;
    label: string;
    options: readonly T[];
    optionToValue?: (option: T | null) => unknown;
}
const FormAutocomplete = <T,>({
    name,
    label,
    options,
    optionToValue = (x) => x,
    ...autocompleteProps
}: Props<T>) => {
    const formControl = useContext(formContext);
    const { field, fieldState } = useController({ name, control: formControl! });
    return (
        <Autocomplete<T>
            {...autocompleteProps}
            {...field}
            value={options.find(option => optionToValue(option) === field)}
            onChange={(_, v) => field.onChange(optionToValue(v))}
            
            renderInput={(props) => (
                <TextField
                    {...props}
                    label={label}
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                />
            )}
            options={options}
        />
    );
};

export default FormAutocomplete;
