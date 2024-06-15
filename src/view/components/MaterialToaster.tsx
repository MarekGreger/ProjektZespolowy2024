import { Alert, AlertColor, CircularProgress } from "@mui/material";
import { ToastType, Toaster, resolveValue } from "react-hot-toast";

const toastTypeToAlertSeverity: Record<ToastType, AlertColor> = {
    success: "success",
    error: "error",
    loading: "info",
    blank: "warning",
    custom: "warning",
};

const MaterialToaster: React.FC = () => {
    return (
        <Toaster position="bottom-left">
            {(toast) => (
                <Alert
                    variant="filled"
                    severity={toastTypeToAlertSeverity[toast.type]}
                    icon={toast.type === "loading" ? <CircularProgress size={20} color="inherit" /> : undefined}
                >
                    {resolveValue(toast.message, toast)}
                </Alert>
            )}
        </Toaster>
    );
};

export default MaterialToaster;
