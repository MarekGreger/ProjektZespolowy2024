import React, { PropsWithChildren, createContext, useId } from "react";
import { Dialog, DialogTitle, DialogContent, Stack, Button } from "@mui/material";
import { ZodType } from "zod";
import { Control, DefaultValues, FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Consumer<T> = (arg: T) => void;
export const formContext = createContext<Control<FieldValues> | null>(null);

interface Props<T> extends PropsWithChildren {
    open: boolean;
    onClose: () => void;
    title: string;
    schema: ZodType<T>;
    onSubmit: Consumer<T>;
    defaultValues?: DefaultValues<T>;
}
const FormDialog = <T extends FieldValues>({
    onClose,
    open,
    onSubmit,
    title,
    children,
    schema,
    defaultValues,
}: Props<T>) => {
    const titleId = useId();
    const { handleSubmit, control } = useForm<T>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues,
    });
    const formSubmit = handleSubmit((data) => {
        onSubmit(data);
        onClose();
    });

    return (
        <Dialog
            open={open}
            PaperProps={{ elevation: 18, sx: { minWidth: "50%", mx: 2 } }}
            onClose={onClose}
        >
            <DialogTitle variant="h5" component="h2" id={titleId}>
                {title}
            </DialogTitle>
            <DialogContent>
                <form onSubmit={formSubmit} aria-labelledby={titleId}>
                    <Stack direction="column" gap={1} py={2}>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <formContext.Provider value={control as any}>
                            {children}
                            {/* <FormErrors /> */}
                        </formContext.Provider>
                    </Stack>
                    <Button
                        // disabled={!formState.isValid}
                        type="submit"
                        variant="contained"
                        fullWidth
                    >
                        Zapisz
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FormDialog;
