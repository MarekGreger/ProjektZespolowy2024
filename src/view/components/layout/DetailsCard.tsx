import { Paper, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
    title?: string;
}
const DetailsCard: React.FC<Props> = ({ title, children }) => {
    return (
        <Paper component="section" elevation={3} sx={{ p: 2, width: "100%", maxWidth: 800, "& dt": {fontWeight: 500, fontSize: "1.07em"} }}>
            {title && <Typography variant="h6" component="h3">
                {title}
            </Typography>}
            {children}
        </Paper>
    );
};

export default DetailsCard;
