import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from "react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { Route } from "./+types/root";
import "./app.css";
import Header from "~/components/template/header";
import Footer from "~/components/template/footer";
import { UAParser } from "ua-parser-js";
import LoginDialog from "~/features/auth/components/login-form";
import { Toaster } from "sonner";
import { getSession } from "./sessions.server";
import {
    RequireLoginMobile,
    RequireLoginDesktop,
} from "./components/template/require-login";
import { type ApiError, isApiError } from "./lib/api";

export const links: Route.LinksFunction = () => [];

export async function loader({ request }: Route.LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    const user = session.get("user");
    let userAgent = request.headers.get("user-agent");
    const ua = new UAParser(userAgent || "");
    const isMobile = ua.getDevice().type === "mobile";
    return { request, isMobile, user };
}

export function Layout({ children }: { children: React.ReactNode }) {
    const { isMobile, user } = useLoaderData<typeof loader>();
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <GoogleOAuthProvider
                    clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}
                >
                    <Header isMobile={isMobile} user={user} />
                    {children}
                    <LoginDialog isMobile={isMobile} />
                    <Toaster richColors position="top-center" />
                    <Footer isMobile={isMobile} />
                </GoogleOAuthProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export type ContextType = { isMobile: boolean | false };

export default function App() {
    const { isMobile } = useLoaderData<typeof loader>();
    return <Outlet context={{ isMobile } satisfies ContextType} />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    const { isMobile } = useLoaderData<typeof loader>();
    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let stack: string | undefined;

    if (isApiError(error)) {
        if (
            error.status == 401 ||
            (error.status == 500 &&
                error?.data?.error ==
                    "Cannot read properties of null (reading 'sub')")
        ) {
            return isMobile ? <RequireLoginMobile /> : <RequireLoginDesktop />;
        }
    }

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details =
            error.status === 404
                ? "The requested page could not be found."
                : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="pt-16 p-4 container mx-auto">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full p-4 overflow-x-auto">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}
