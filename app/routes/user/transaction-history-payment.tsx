import type { Route } from "./+types/transaction-history-payment";
import { getSession } from "~/sessions.server";
import { getTransactionHistoryById } from "~/shared/services/transaction-service";
import { PaymentPage } from "~/features/history/pages/TransactionHistoryPaymentPage";
import { redirect } from "react-router"; // Import redirect function
import { getPaymentMethodById } from "~/features/cart/services/payment-method-service";

export async function loader({ request, params }: Route.LoaderArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const accessToken = session.get("access_token") ?? "";
    const transactionHistory = await getTransactionHistoryById(
        accessToken,
        params.id
    );
    const paymentMethod = await getPaymentMethodById(
        accessToken,
        transactionHistory?.data?.payment_method_id?.toString() ?? ""
    );

    const detail = transactionHistory?.data ?? {};
    const howToPay = paymentMethod?.data?.how_to_pays ?? [];

    const transactionStatus = detail?.status;

    if (transactionStatus !== "MENUNGGU_PEMBAYARAN") {
        throw redirect(`/user/transaction-history/${params.id}`);
    }

    return {
        detail: detail,
        howToPays: howToPay
    };
}

export function meta({ data }: Route.MetaArgs) {
    return [
        { title: data?.detail?.invoice_number ?? "Detil Transaksi" },
        {
            property: "og:title",
            content: data?.detail?.invoice_number ?? "Detil Transaksi",
        },
    ];
}

export default function TransactionHistoryPayment({
    loaderData,
}: Route.ComponentProps) {
    return <PaymentPage transaction={loaderData.detail} howToPays={loaderData.howToPays} />;
}
