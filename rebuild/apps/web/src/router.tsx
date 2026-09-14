import { Navigate, createBrowserRouter, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { ErrorPanel } from "@/components/common";
import { Landing } from "@/pages/Landing";
import { ManagerDetail } from "@/pages/ManagerDetail";
import { Overview } from "@/pages/Overview";
import { PlayerDetail } from "@/pages/PlayerDetail";
import { Standings } from "@/pages/Standings";
import { Transfers } from "@/pages/Transfers";
import { Values } from "@/pages/Values";

function RouteError() { const error = useRouteError(); const value = isRouteErrorResponse(error) ? new Error(error.status === 404 ? "This page does not exist." : error.statusText) : error instanceof Error ? error : new Error("Something went wrong"); return <main className="mx-auto grid min-h-screen max-w-xl place-items-center px-5"><ErrorPanel error={value} /></main>; }
export const router = createBrowserRouter([{ path: "/", element: <Landing />, errorElement: <RouteError /> }, { path: "/league/:leagueId", element: <AppShell />, errorElement: <RouteError />, children: [{ index: true, element: <Navigate to="overview" replace /> }, { path: "overview", element: <Overview /> }, { path: "transfers", element: <Transfers /> }, { path: "standings", element: <Standings /> }, { path: "values", element: <Values /> }, { path: "managers/:managerId", element: <ManagerDetail /> }, { path: "players/:playerId", element: <PlayerDetail /> }] }, { path: "*", element: <RouteError /> }]);
