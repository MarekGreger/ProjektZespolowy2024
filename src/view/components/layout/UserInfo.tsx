import { Avatar, ButtonBase, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

import React, { ElementRef, useRef, useState } from "react";
import { signOut, useUser } from "../../firebaseAuth";


interface Props {}
const UserInfo: React.FC<Props> = () => {
    const [user] = useUser();
    const name = user?.displayName?.split(" ")[0];

    const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
    const menuAnchor = useRef<ElementRef<"button">>(null);

    return (
        <>
            <ButtonBase
                onClick={() => setMenuOpen(true)}
                ref={menuAnchor}
                aria-controls={isMenuOpen ? "user menu" : undefined}
                aria-haspopup="menu"
                aria-expanded={isMenuOpen ? "true" : undefined}
                sx={{px: 1}}
            >
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                        variant="h5"
                        noWrap
                        component="div"
                        sx={{ display: ["none", "block"] }}
                    >
                        {name ?? "Gość"}
                    </Typography>
                    <Avatar
                        alt={user?.displayName ?? "user avatar"}
                        src={user?.photoURL ?? undefined}
                        sx={(theme) => ({ boxShadow: theme.shadows[10], bgcolor: blueGrey[200] })}
                    />
                </Stack>
            </ButtonBase>
            <Menu
                open={isMenuOpen}
                anchorEl={menuAnchor.current}
                onClose={() => setMenuOpen(false)}
                anchorPosition={{
                    top: 15,
                    left: 10,
                }}
                slotProps={{
                    paper: { sx: { width: "130px" } },
                }}
            >
                <MenuItem onClick={signOut}>Wyloguj</MenuItem>
            </Menu>
        </>
    );
};

export default UserInfo;
