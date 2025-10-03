import { User, ShoppingCart, Heart, Search, ArrowLeft } from "lucide-react";
import { InputWithIcon } from "~/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useLocation } from "react-router";
import { useDialogStore } from "~/shared/stores/useDialogStore";
import IconWrapper from "../IconWrapper";
import { useRouteLoaderData } from "react-router";
export default function HeaderMobile() {
    const navigate = useNavigate();
    const { setOpenLogin, setOpenWishlist, isOpenProfile, setOpenProfile } =
        useDialogStore();
    const {
        wishlist = [],
        totalCart,
        isLoggedIn = false,
    } = useRouteLoaderData("root") ?? {};
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const pathname = location.pathname;
    const iconStroke = 1.5;
    const iconSize = 16;

    return (
        <header className="sticky top-0 w-full z-50 bg-white border-b-2 border-primary p-4 flex flex-col">
            <div className="flex items-center justify-between gap-4">
                {pathname == "/" && (
                    <Link to="/">
                        <img
                            src="/images/logo.svg"
                            alt="Logo"
                            className="h-4 cursor-pointer"
                            loading="lazy"
                        />
                    </Link>
                )}
                {pathname != "/" && (
                    <div
                        className="flex flex-row gap-x-2 justify-center items-center cursor-pointer"
                        onClick={() => {
                            window.history.back();
                        }}
                    >
                        <ArrowLeft size={iconSize} />
                        <span className="text-sm">
                            {pathname == "/search" ? "Skincare" : ""}
                        </span>
                    </div>
                )}
                <div className="flex items-center">
                    <IconWrapper
                        badgeCount={wishlist.length}
                        onClick={() => setOpenWishlist(true)}
                    >
                        <Heart size={iconSize} strokeWidth={iconStroke} />
                    </IconWrapper>
                    <Link to="cart">
                        <IconWrapper badgeCount={totalCart}>
                            <ShoppingCart
                                size={iconSize}
                                strokeWidth={iconStroke}
                            />
                        </IconWrapper>
                    </Link>
                    <IconWrapper
                        onClick={() => {
                            if (!isLoggedIn) setOpenLogin(true);
                            else setOpenProfile(true)
                        }}
                    >
                        <User size={iconSize} strokeWidth={iconStroke} />
                    </IconWrapper>
                </div>
            </div>
            <InputWithIcon
                icon={Search}
                sizeIcon={16}
                placeholder="Kamu butuh apa? Cari disini yuk"
                className="rounded-sm mt-2 text-sm"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        const params = new URLSearchParams(searchParams);
                        params.set("q", e.currentTarget.value);
                        navigate(
                            {
                                pathname: "/search",
                                search: `?${params.toString()}`,
                            },
                            {
                                replace: true,
                                preventScrollReset: false,
                            }
                        );
                    }
                }}
            />
        </header>
    );
}
