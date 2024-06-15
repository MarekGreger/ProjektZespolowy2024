import { createRoot } from "react-dom/client";
import HelloWorld from "./components/HelloWorld";

const reactContainer = document.getElementById("react-app")!;
const root = createRoot(reactContainer);
root.render(HelloWorld);
