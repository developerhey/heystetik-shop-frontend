import {
    type RouteConfig,
    index,
    route,
    prefix,
} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("search", "routes/search.tsx"),
    route("product/:id", "routes/product-detail.tsx"),
    route("cart", "routes/cart.tsx"),
    ...prefix("user", [
        route("address", "routes/user/address.tsx"),
        route(
            "transaction-history/:id",
            "routes/user/transaction-history-detail.tsx"
        ),
        route("transaction-history", "routes/user/transaction-history.tsx"),
        route("payment/:id", "routes/user/transaction-history-payment.tsx"),
    ]),
    ...prefix("api", [
        route("login", "routes/api/login.ts"),
        route("google-login", "routes/api/google-login.ts"),
        route("facebook-login", "routes/api/facebook-login.ts"),
        route("forgot-password", "routes/api/forgot-password.ts"),
        route("logout", "routes/api/logout.ts"),
        route("add-to-cart", "routes/api/add-cart.ts"),
        route("update-cart", "routes/api/update-cart.ts"),
        route("delete-from-cart", "routes/api/delete-cart.ts"),
        route("delete-from-wishlist", "routes/api/delete-wishlist.ts"),
        route("add-to-wishlist", "routes/api/add-wishlist.ts"),
        route("register-phone", "routes/api/register-phone.ts"),
        route("register-phone-otp", "routes/api/register-phone-otp.ts"),
        route("register-email-otp", "routes/api/register-email-otp.ts"),
        route("register-email", "routes/api/register-email.ts"),
        route("register-personal-info", "routes/api/register-personal-info.ts"),
        route("add-address", "routes/api/add-address.ts"),
        route("update-address", "routes/api/update-address.ts"),
        route("update-phone", "routes/api/update-phone.tsx"),
        route("delete-address", "routes/api/delete-address.ts"),
        route("set-main-address", "routes/api/set-main-address.ts"),
        route("order-product", "routes/api/order-product.ts"),
    ]),
    // route("*", "routes/404.tsx"),
] satisfies RouteConfig;
