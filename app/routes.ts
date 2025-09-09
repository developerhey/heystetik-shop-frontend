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
    ...prefix("api", [
        route("login", "routes/api/login.ts"),
        route("add-to-cart", "routes/api/cart.ts"),
    ]),
] satisfies RouteConfig;
