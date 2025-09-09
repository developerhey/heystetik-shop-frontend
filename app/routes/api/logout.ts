// import type { Route } from "./+types/api.logout";
// import { redirect } from "react-router";
// import { destroySession } from "~/sessions.server";

// export async function action({ request }: Route.ActionArgs) {
//     const session = await getSession(request.headers.get("Cookie"));

//     return redirect("/login", {
//         headers: {
//             "Set-Cookie": await destroySession(session),
//         },
//     });
// }