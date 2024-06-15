import { Stack } from "@mui/material";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}
const ActionRow: React.FC<Props> = ({children}) => {
    return <Stack direction="row" gap={2} sx={{ width: "100%", maxWidth: 800 }}>{children}</Stack>;
};

export default ActionRow;
