import { createHashRouter } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Deals from "./pages/Deals";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";

export const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "deals", element: <Deals /> },
      { path: "team", element: <Team /> },
      { path: "statistics", element: <Statistics /> }, // <-- ВАЖНО
      { path: "settings", element: <Settings /> },
      { path: "*", element: <Home /> },
    ],
  },
]);
