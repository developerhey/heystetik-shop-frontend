import type { Route } from "./+types/logout";
import { redirect } from "react-router";
import { destroySession } from "~/sessions.server";
import { getSession } from "~/sessions.server";

export async function action({ request }: Route.ActionArgs) {
    const session = await getSession(request.headers.get("Cookie"));

    return redirect("/", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
}
