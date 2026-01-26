import { createHashRouter } from "react-router-dom";
import { Home } from "@/app/pages/Home";
import { Deals } from "@/app/pages/Deals";
import { Team } from "@/app/pages/Team";
import { Statistics } from "@/app/pages/Statistics";
import { Settings } from "@/app/pages/Settings";
import { Layout } from "@/app/components/Layout";

// Hash router is the most reliable option for Telegram Mini Apps and static hosting
// (no server-side route rewriting required).
export const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "deals", element: <Deals /> },
      { path: "team", element: <Team /> },
      { path: "statistics", element: <Statistics /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);
