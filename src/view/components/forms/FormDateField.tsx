import { DatePicker, DatePickerProps } from "@mui/x-date-pickers";
import { useContext } from "react";
import { ControllerRenderProps, FieldValues, Path, useController } from "react-hook-form";
import { formContext } from "./FormDialog";
import dayjs from "dayjs";

type Props<T extends FieldValues> = { name: Path<T>; label: string } & Partial<
    Omit<DatePickerProps<unknown>, keyof ControllerRenderProps<T>>
>;

export default function FormDateField<T extends FieldValues>({
    name,
    label,
    ...dateProps
}: Props<T>) {
    const formControl = useContext(formContext);
    const { field, fieldState } = useController({ name, control: formControl! });
    return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <DatePicker<any>
            {...field}
            label={label}
            value={dayjs(field.value ?? null, "YYYY-MM-DD")}
            onChange={(v) => field.onChange(v?.format("YYYY-MM-DD"))}
            slotProps={{
                textField: {
                    helperText: fieldState.error?.message,
                    error: Boolean(fieldState.error),
                },
            }}
            {...dateProps}
        />
    );
}
