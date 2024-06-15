import { IconButton, Stack, SxProps, Theme } from "@mui/material";
import { Role, roleGreaterOrEqual } from "../../../common/userRoles";
import { useRole } from "../../firebaseAuth";

import DoneIcon from "@mui/icons-material/Done";
import BlockIcon from "@mui/icons-material/Block";
import { AcceptanceStatus } from "../../../common/AcceptanceStatus";

interface Props {
    onAccept: () => void;
    onReject: () => void;
    minimalRole: Role;
}
export const AcceptanceActions: React.FC<Props> = ({ onAccept, onReject, minimalRole }) => {
    return (
        <Stack direction="row" gap={1}>
            <AcceptButton onClick={onAccept} minimalRole={minimalRole} />
            <RejectButton onClick={onReject} minimalRole={minimalRole} />
        </Stack>
    );
};

interface ButtonProps {
    onClick: () => void;
    minimalRole: Role;
}

export const AcceptButton: React.FC<ButtonProps> = ({ onClick, minimalRole }) => {
    const [role] = useRole();
    if (minimalRole && !roleGreaterOrEqual(role ?? "brak", minimalRole)) {
        return <></>;
    }
    return (
        <IconButton aria-label="akceptuj" color="success" onClick={onClick}>
            <DoneIcon />
        </IconButton>
    );
};

export const RejectButton: React.FC<ButtonProps> = ({ onClick, minimalRole }) => {
    const [role] = useRole();
    if (minimalRole && !roleGreaterOrEqual(role ?? "brak", minimalRole)) {
        return <></>;
    }
    return (
        <IconButton aria-label="odrzuć" color="error" onClick={onClick}>
            <BlockIcon />
        </IconButton>
    );
};

export const statusStyles =
    (status?: AcceptanceStatus): SxProps<Theme> =>
    (t) => {
        const statusToColor: Record<AcceptanceStatus, string> = {
            przesłane: t.palette.info.main,
            odrzucone: t.palette.error.main,
            zaakceptowane: t.palette.success.main,
        };
        return {
            color: statusToColor[status ?? "przesłane"],
        } ;
    };
