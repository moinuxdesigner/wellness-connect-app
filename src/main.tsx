
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { initializeThemeMode } from "./app/features/theme/useThemeMode.ts";
  import "./styles/index.css";

  initializeThemeMode();
  createRoot(document.getElementById("root")!).render(<App />);
  
