import type { Route } from "./+types/order-product";
import { data, redirect } from "react-router";
import { orderProduct } from "~/shared/services/transaction-service";
import { getSession } from "~/sessions.server";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const accessToken = session.get("access_token") ?? "";

    try {
        // Extract order data from formData
        const orderData = {
            product_item: JSON.parse(formData.get("product_item") as string),
            payment_method: formData.get("payment_method") as string,
            payment_type: formData.get("payment_type") as string,
            shipping_method_id: parseInt(
                formData.get("shipping_method_id") as string
            ),
            user_address_id: parseInt(
                formData.get("user_address_id") as string
            ),
            voucher_id: formData.get("voucher_id")
                ? parseInt(formData.get("voucher_id") as string)
                : null,
            total_price: Math.round(
                parseFloat(formData.get("total_price") as string)
            ),
            delivery_fee: parseFloat(formData.get("delivery_fee") as string),
            total_discount: Math.round(
                Math.abs(parseFloat(formData.get("total_discount") as string))
            ),
            tax: parseFloat(formData.get("tax") as string),
            transaction_fee: parseFloat(
                formData.get("transaction_fee") as string
            ),
            total_paid: Math.max(
                0,
                Math.round(parseFloat(formData.get("total_paid") as string))
            ),
        };

        const result = await orderProduct(accessToken, orderData);

        return redirect(`/user/payment/${result.data?.transaction?.id}`);
    } catch (error: any) {
        console.log(error.data.data);
        return data(
            {
                error: error.message || "Gagal beli, silahkan coba lagi",
            },
            { status: error.status || 500 }
        );
    }
}
