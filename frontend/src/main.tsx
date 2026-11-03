import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AccesoApp from "./AccesoApp";
import "./estilos/global.css";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AccesoApp />
  </StrictMode>,
);
