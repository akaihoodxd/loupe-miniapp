import { RouterProvider } from "react-router-dom";
import { router } from "@/app/routes";
import { ThemeProvider } from "@/app/contexts/ThemeContext";
import "@/styles/index.css";

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}