import type { Route } from "./+types/transaction-history-detail";
import { getSession } from "~/sessions.server";
import { getTransactionHistoryById } from "~/shared/services/transaction-service";
import { TransactionHistoryDetailPage } from "~/features/history/pages/TransactionHistoryDetailPage";
export async function loader({ request, params }: Route.LoaderArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const accessToken = session.get("access_token") ?? "";
    const transactionHistory = await getTransactionHistoryById(
        accessToken,
        params.id
    );
    console.log(transactionHistory)
    return {
        detail: transactionHistory?.data ?? {},
    };
}

export default function Cart({ loaderData }: Route.ComponentProps) {
    return <TransactionHistoryDetailPage detail={loaderData.detail} />;
}
