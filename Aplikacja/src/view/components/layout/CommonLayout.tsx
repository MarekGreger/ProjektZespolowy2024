import {
    AppBar,
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    Stack,
    Theme,
    Toolbar,
    Typography,
    useMediaQuery,
} from "@mui/material";
import React, { PropsWithChildren } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import UserInfo from "./UserInfo";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import contentMovedByDrawer from "../../styles/contentMovedByDrawer";
import { useUser } from "../../firebaseAuth";
import { useLocation } from "wouter";
import NavigationListItem from "./NavigationListItem";
import { useSessionStorage } from "../../hooks/useSessionStorage";

interface Props extends PropsWithChildren {
    pageTitle?: string;
    subpageTitle: string;
    center?: boolean;
}
const CommonLayout: React.FC<Props> = ({ children, pageTitle = "MOXLY", subpageTitle, center = false }) => {
    const isDesktop = useMediaQuery((t: Theme) => t.breakpoints.up("md"));
    const [_isDrawerOpen, setDrawerOpen] = useSessionStorage<"true" | "false">(
        "isDrawerOpen",
        isDesktop ? "true" : "false"
    );
    const isDrawerOpen = _isDrawerOpen === "true";

    const [user] = useUser();
    const [_, navigate] = useLocation();
    const loggedIn = Boolean(user);
    const SignIn = (
        <Button variant="contained" color="secondary" onClick={() => navigate("/login")}>
            Zaloguj
        </Button>
    );

    return (
        <>
            <AppBar position="sticky">
                <Toolbar
                    sx={[
                        { display: "flex", justifyContent: "space-between" },
                        contentMovedByDrawer(isDrawerOpen && isDesktop),
                    ]}
                >
                    <IconButton
                        aria-label="Open menu"
                        color="inherit"
                        hidden={isDrawerOpen}
                        sx={{ visibility: isDrawerOpen ? "hidden" : "visible" }}
                        onClick={() => setDrawerOpen("true")}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h4" component="h1">
                        {pageTitle}
                    </Typography>
                    {loggedIn ? <UserInfo /> : SignIn}
                </Toolbar>
            </AppBar>
            <Drawer
                open={isDrawerOpen}
                variant={isDesktop ? "persistent" : "temporary"}
                anchor="left"
                onClose={() => setDrawerOpen("false")}
                PaperProps={{ sx: (t) => ({ width: t.dimensions["drawerWidth"] }) }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "end" }}>
                    <IconButton aria-label="Close menu" onClick={() => setDrawerOpen("false")}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List disablePadding>
                    <NavigationListItem href="/panel/auta" minimalRole="pracownik">
                        Auta
                    </NavigationListItem>
                    <NavigationListItem href="/panel/grafik" minimalRole="kierownik">
                        Grafik
                    </NavigationListItem>
                    <NavigationListItem href="/panel/klienci" minimalRole="kierownik">
                        Klienci
                    </NavigationListItem>
                    <NavigationListItem href="/panel/modele" minimalRole="kierownik">
                        Modele
                    </NavigationListItem>
                    <NavigationListItem href="/panel/pracownicy" minimalRole="kierownik">
                        Pracownicy
                    </NavigationListItem>
                    <NavigationListItem href="/panel/umowy" minimalRole="kierownik">
                        Umowy
                    </NavigationListItem>
                    <NavigationListItem href="/panel/uslugi" minimalRole="klient">
                        Usługi
                    </NavigationListItem>
                    <NavigationListItem href="/panel/zgloszenia" minimalRole="pracownik">
                        Zgłoszenia
                    </NavigationListItem>
                    <NavigationListItem href="/panel/uprawnienia" minimalRole="admin">
                        Uprawnienia
                    </NavigationListItem>
                </List>
            </Drawer>
            <Box component="main" sx={[{ p: 2 }, contentMovedByDrawer(isDrawerOpen && isDesktop)]}>
                <Stack alignItems={center ? "center" : "start"} gap={3}>
                    <Stack direction="row" gap={2} sx={{ width: "100%", maxWidth: 800, pb: 2 }}>
                        <Typography variant="h5" component="h2">
                            {subpageTitle}
                        </Typography>
                    </Stack>
                </Stack>
                {children}
            </Box>
        </>
    );
};

export default CommonLayout;
