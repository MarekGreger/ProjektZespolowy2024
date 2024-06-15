import { useContext } from "react";
import { formContext } from "./FormDialog";
import { useFormState } from "react-hook-form";

interface Props {}
const FormErrors: React.FC<Props> = () => {
    const formControl = useContext(formContext);
    const state = useFormState({control: formControl!});
    console.log("state", state)
    return <>
        {JSON.stringify(state.errors)}
    </>;
};

export default FormErrors;