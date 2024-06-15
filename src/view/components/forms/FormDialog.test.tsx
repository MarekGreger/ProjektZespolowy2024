/**
 * @jest-environment jsdom
 */
import React, { ComponentProps } from "react";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { userEvent } from "@testing-library/user-event";

import FormDialog from "./FormDialog";
import { TextField } from "@mui/material";
import { z } from "zod";

const FormDialogWithTestProps: React.FC<Partial<ComponentProps<typeof FormDialog>>> = ({
    children,
    onClose,
    open,
    onSubmit,
    title,
    schema,
}) => (
    <FormDialog
        title={title ?? ""}
        onSubmit={onSubmit ?? (() => {})}
        schema={schema ?? z.object({})}
        open={open ?? true}
        onClose={onClose ?? (() => {})}
    >
        {children}
    </FormDialog>
);

describe("FormDialog - generic form in modal dialog", () => {
    it("should not mount when closed", () => {
        const { queryByRole } = render(<FormDialogWithTestProps open={false} />);

        expect(queryByRole("form")).toBeNull();
    });

    it("should be visible when opened", () => {
        const formTitle = "my title";
        const { getByRole } = render(<FormDialogWithTestProps title={formTitle} />);

        expect(getByRole("form", { name: formTitle })).toBeVisible();
    });

    it("should include accessible header", () => {
        const exampleTitle = "my title";
        const { getByRole } = render(<FormDialogWithTestProps title={exampleTitle} />);

        expect(getByRole("heading", { name: exampleTitle })).toBeVisible();
    });

    it("should include submit button", () => {
        const { getByRole } = render(<FormDialogWithTestProps />);

        expect(getByRole("button", { name: /zapisz/i })).toBeEnabled();
    });

    it("should manage form values", async () => {
        const user = userEvent.setup();
        const { getByRole } = render(
            <FormDialogWithTestProps>
                <TextField name="name" defaultValue="Jan" label="name" />
                <TextField name="surname" defaultValue="X" label="surname" />
            </FormDialogWithTestProps>
        );

        await user.type(getByRole("textbox", { name: "surname" }), "iński");

        expect(getByRole("form")).toHaveFormValues({
            name: "Jan",
            surname: "Xiński",
        });
    });

    const exampleValidationMessage = "please provide a valid email"
    const exampleSchema = z.object({
        name: z.string(),
        email: z.string().email(exampleValidationMessage),
    });

    it("should submit valid values", async () => {
        const user = userEvent.setup();
        const onSubmitCallback = jest.fn();
        const { getByRole } = render(
            <FormDialogWithTestProps onSubmit={onSubmitCallback} schema={exampleSchema}>
                <TextField name="name" defaultValue="Jan" label="name" />
                <TextField name="email" defaultValue="Jan.Xinski@gmail.com" label="email" />
            </FormDialogWithTestProps>
        );

        await user.click(getByRole("button", { name: /zapisz/i }));

        waitFor(() => {
            expect(onSubmitCallback).toHaveBeenCalledWith({
                name: "Jan",
                email: "Jan.Xinski@gmail.com",
            });
        });
    });

    it("should not submit invalid values", async () => {
        const user = userEvent.setup();
        const onSubmitCallback = jest.fn();
        const { getByRole } = render(
            <FormDialogWithTestProps onSubmit={onSubmitCallback} schema={exampleSchema}>
                <TextField name="name" defaultValue="Jan" label="name" />
                <TextField name="email" defaultValue="Jan.Xinski@gmail.com" label="email" />
            </FormDialogWithTestProps>
        );

        await user.click(getByRole("button", { name: /zapisz/i }));

        waitFor(() => {
            expect(onSubmitCallback).not.toHaveBeenCalled();
        });
    });

    it("should show helper text with message from schema when invalid", async () => {
        const user = userEvent.setup();
        const onSubmitCallback = jest.fn();
        const { getByText, getByRole } = render(
            <FormDialogWithTestProps onSubmit={onSubmitCallback} schema={exampleSchema}>
                <TextField name="name" defaultValue="Jan" label="name" />
                <TextField name="email" defaultValue="Jan.Xinski" label="email" />
            </FormDialogWithTestProps>
        );

        await user.click(getByRole("button", { name: /zapisz/i }));

        waitFor(() => {
            expect(getByText(exampleValidationMessage)).toBeVisible();
        })
    });

    it("should close dialog when submitted", async () => {
        const user = userEvent.setup();
        const onCloseCallback = jest.fn();
        const { getByRole } = render(<FormDialogWithTestProps onClose={onCloseCallback} />);
        const submitButton = getByRole("button", { name: /zapisz/i });

        await user.click(submitButton);

        expect(onCloseCallback).toHaveBeenCalledTimes(1);
    });

    //TODO: move to mutation manager
    it.todo("should show success message when submit succeeded");
    it.todo("should show error message when submit failed");
});
