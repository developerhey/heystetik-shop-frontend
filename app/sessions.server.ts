import { createCookieSessionStorage } from "react-router";

type SessionData = {
    access_token: string;
    user: {
        email: string;
        name: string;
    };
};

const { getSession, commitSession, destroySession } =
    createCookieSessionStorage<SessionData>({
        cookie: {
            name: "__session",
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
            sameSite: "lax",
            secrets: [import.meta.env.VITE_SESSION_SECRET || "fallback-secret"],
            secure: process.env.NODE_ENV === "production",
        },
    });

export { getSession, commitSession, destroySession };
export type { SessionData };