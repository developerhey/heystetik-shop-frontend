import { redirect } from "react-router";
import { getSession } from "~/sessions.server";

export async function requireAuth(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));
    const accessToken = session.get("access_token");

    if (!accessToken) {
        const url = new URL(request.url);
        throw redirect(`/login?redirectTo=${encodeURIComponent(url.pathname)}`);
    }

    return {
        accessToken,
        user: session.get("user"),
    };
}

export async function optionalAuth(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));
    const accessToken = session.get("access_token");

    return {
        isAuthenticated: !!accessToken,
        accessToken,
        user: session.get("user"),
    };
}