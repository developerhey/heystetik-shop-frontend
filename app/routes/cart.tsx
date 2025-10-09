import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { CartPageDesktop, CartPageMobile } from "~/features/cart/pages";
import { getCartList } from "~/shared/services/cart-service";
import type { Route } from "./+types/cart";
import { mapCartListResponseToUI } from "~/shared/schemas/cart-mapper";
import { getSession } from "~/sessions.server";
import { getUserAddress } from "~/features/address/services/address-services";
import { type AddressResponse } from "~/features/address/schemas/address-response.schema";
import { getPaymentMethod } from "~/features/cart/services/payment-method-service";
import { getAvailableVoucher } from "~/features/cart/services/voucher-service";
export async function loader({ request }: Route.LoaderArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const accessToken = session.get("access_token") ?? "";
    const carts = await getCartList(accessToken);
    const userAddress = await getUserAddress(accessToken);
    const paymentMethods = await getPaymentMethod(accessToken);
    const vouchers = await getAvailableVoucher(accessToken);
    return {
        token: accessToken,
        carts: mapCartListResponseToUI(carts),
        paymentMethods: paymentMethods.data ?? [],
        userAddress:
            userAddress.data?.filter((address) => address.main_address)[0] ??
            {},
        vouchers: vouchers?.data?.data ?? [],
    };
}

export function meta() {
  return [
    { title: "Keranjang" },
    {
      property: "og:title",
      content: "Keranjang",
    },
  ];
}

export default function Cart({ loaderData }: Route.ComponentProps) {
    const { carts, userAddress, token, paymentMethods, vouchers } = loaderData;
    const { isMobile } = useOutletContext<ContextType>();
    return isMobile ? (
        <CartPageMobile
            carts={carts}
            userAddress={userAddress as AddressResponse}
            token={token}
            paymentMethods={paymentMethods}
            vouchers={vouchers}
        />
    ) : (
        <CartPageDesktop
            carts={carts}
            userAddress={userAddress as AddressResponse}
            token={token}
            paymentMethods={paymentMethods}
            vouchers={vouchers}
        />
    );
}
