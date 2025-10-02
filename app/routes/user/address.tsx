import type { Route } from "./+types/address";
import { getSession } from "~/sessions.server";
import UserAddressPage from "~/features/address/pages/UserAddressPage";
import { getUserAddress } from "~/features/address/services/address-services";
export async function loader({ request, params }: Route.LoaderArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const accessToken = session.get("access_token") ?? "";
    const userAddress = await getUserAddress(accessToken);
    return {
        userAddress: userAddress.data ?? [],
    };
}

export default function Address({ loaderData }: Route.ComponentProps) {
    return <UserAddressPage userAddress={loaderData.userAddress} />;
}
