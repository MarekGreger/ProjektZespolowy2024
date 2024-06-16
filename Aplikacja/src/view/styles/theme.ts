import { createTheme } from "@mui/material";
import { deepPurple, green } from "@mui/material/colors";
import { plPL } from "@mui/material/locale";
import { plPL as gridPlPL } from "@mui/x-data-grid";

declare module "@mui/material/styles" {
    interface Theme {
        dimensions: Record<string, string | number>;
    }
    interface ThemeOptions {
        dimensions: Record<string, string | number>;
    }
}

const theme = createTheme(
    {
        palette: {
            // mode: 'dark',
            primary: {
                main: green[800],
            },
            secondary: {
                main: deepPurple[400],
            },
            text: {
                primary: "rgba(0,0,0,0.97)",
            },
        },
        dimensions: {
            drawerWidth: "230px",
        },
        components: {
            MuiLink: {
                defaultProps: {
                    color: "#0000FF",
                },
                styleOverrides: {
                    root: "cursor: pointer",
                },
            },
        },
    },
    plPL,
    gridPlPL
);

export default theme;
