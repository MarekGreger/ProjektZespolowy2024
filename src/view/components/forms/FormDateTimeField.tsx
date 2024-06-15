import { DateTimePicker, DateTimePickerProps, renderTimeViewClock } from "@mui/x-date-pickers";
import { useContext } from "react";
import { ControllerRenderProps, FieldValues, Path, useController } from "react-hook-form";
import { formContext } from "./FormDialog";
import dayjs from "dayjs";

type Props<T extends FieldValues> = { name: Path<T>; label: string } & Partial<
    Omit<DateTimePickerProps<unknown>, keyof ControllerRenderProps<T>>
>;

export default function FormDateTimePicker<T extends FieldValues>({
    label,
    name,
    ...dateTimeProps
}: Props<T>) {
    const formControl = useContext(formContext);
    const { field, fieldState } = useController({ name, control: formControl! });
    return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <DateTimePicker<any>
            {...field}
            label={label}
            value={dayjs(field.value ?? null, "YYYY-MM-DD HH:mm:ss")}
            onChange={(v) => field.onChange(v?.format("YYYY-MM-DD HH:mm:ss"))}
            ampm={false}
            ampmInClock={false}
            viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
            }}
            slotProps={{
                textField: {
                    helperText: fieldState.error?.message,
                    error: Boolean(fieldState.error),
                },
            }}
            {...dateTimeProps}
        />
    );
}
