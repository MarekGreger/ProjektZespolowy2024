import { createRoot } from "react-dom/client";
import MockForms from "./components/layout/MockForms";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pl";
import theme from "./styles/theme";
import { Route, Router, Switch } from "wouter";

import { Login } from "./firebaseAuth";
import Klienci from "./components/pages/Klienci";
import NotFound from "./components/pages/NotFound";
import Zgloszenia from "./components/pages/Zgloszenia";
import MaterialToaster from "./components/MaterialToaster";
import Uprawnienia from "./components/pages/Uprawnienia";
import Pracownicy from "./components/pages/Pracownicy";
import Grafik from "./components/pages/Grafik";
import Auta from "./components/pages/Auta";
import Umowy from "./components/pages/Umowy";
import Uslugi from "./components/pages/Uslugi";
import Modele from "./components/pages/Modele";
import AutoDetails from "./components/pages/AutoDetails";
import GrafikDetails from "./components/pages/GrafikDetails";
import KlientDetails from "./components/pages/KlientDetails";
import PracownikDetails from "./components/pages/PracownikDetails";
import UmowaDetails from "./components/pages/UmowaDetails";
import ZgloszenieDetails from "./components/pages/ZgloszenieDetails";

const reactContainer = document.getElementById("react-app")!;

const root = createRoot(reactContainer);
root.render(
    <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
            <CssBaseline />
            <MaterialToaster />
            <Router>
                <Switch>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/panel/auta" component={Auta}></Route>
                    <Route path="/panel/auta/:id" component={AutoDetails}></Route>
                    <Route path="/panel/grafik" component={Grafik}></Route>
                    <Route path="/panel/grafik/:id" component={GrafikDetails}></Route>
                    <Route path="/panel/klienci" component={Klienci}></Route>
                    <Route path="/panel/klienci/:id" component={KlientDetails}></Route>
                    <Route path="/panel/modele" component={Modele}></Route>
                    <Route path="/panel/pracownicy" component={Pracownicy}></Route>
                    <Route path="/panel/pracownicy/:id" component={PracownikDetails}></Route>
                    <Route path="/panel/umowy" component={Umowy}></Route>
                    <Route path="/panel/umowy/:id" component={UmowaDetails}></Route>
                    <Route path="/panel/uslugi" component={Uslugi}></Route>
                    <Route path="/panel/zgloszenia" component={Zgloszenia}></Route>
                    <Route path="/panel/zgloszenia/:id" component={ZgloszenieDetails}></Route>
                    <Route path="/panel/uprawnienia" component={Uprawnienia}></Route>
                    <Route path="/" component={MockForms}></Route>
                    <Route component={NotFound}></Route>
                </Switch>
            </Router>
        </LocalizationProvider>
    </ThemeProvider>
);
