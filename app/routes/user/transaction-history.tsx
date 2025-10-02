import type { Route } from "./+types/transaction-history";
import { getSession } from "~/sessions.server";
import { TransactionHistoryPage } from "~/features/history/pages/TransactionHistoryPage";
import { getTransactionHistory } from "~/shared/services/transaction-service";
export async function loader({ request }: Route.LoaderArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const accessToken = session.get("access_token") ?? "";
    const transactionHistory = await getTransactionHistory(accessToken);
    return {
        transactionHistory: transactionHistory?.data?.data ?? []
    };
}

export default function Cart({ loaderData }: Route.ComponentProps) {
    return <TransactionHistoryPage transactionHistory={loaderData.transactionHistory} />;
}
