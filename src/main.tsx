import { createRoot } from 'react-dom/client'
import "primereact/resources/themes/soho-light/theme.css";
import "./index.css";
import App from './App.tsx'

createRoot(document.getElementById("root")!).render(<App />);
