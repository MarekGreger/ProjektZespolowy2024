import { ListItem, ListItemButton, ListItemText, SxProps, Theme } from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { PropsWithChildren } from "react";
import { useLocation, useRoute } from "wouter";
import { Role, roleGreaterOrEqual } from "../../../common/userRoles";
import { useRole } from "../../firebaseAuth";
interface Props extends PropsWithChildren {
    href: string;
    minimalRole: Role;
}
const NavigationListItem: React.FC<Props> = ({ children, href, minimalRole }) => {
    
    const [location, navigate] = useLocation();
    const isActive = location.startsWith(href);
    const activeStyles: SxProps<Theme> = (t) => ({
        color: t.palette.secondary.dark,
        fontWeight: "bolder",
        bgcolor: grey["200"]
    });

    const [role] = useRole()
    if (!role || !roleGreaterOrEqual(role, minimalRole)) {
        return <></>
    }

    return (
        <ListItem disablePadding onClick={() => navigate(href)} sx={isActive ? activeStyles : {}}>
            <ListItemButton>
                <ListItemText disableTypography >
                    {children}
                </ListItemText>
            </ListItemButton>
        </ListItem>
    );
};

export default NavigationListItem;
