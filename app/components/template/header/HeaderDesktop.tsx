import { User, ShoppingCart, Heart, Search } from "lucide-react";
import { InputWithIcon } from "~/components/ui/input";
import {
    Link,
    useFetcher,
    useNavigate,
    useRouteError,
    useRouteLoaderData,
    useSearchParams,
} from "react-router";
import { useDialogStore } from "~/shared/stores/useDialogStore";
import IconWrapper from "../IconWrapper";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";

export default function HeaderDesktop() {
    const error = useRouteError();
    const fetcher = useFetcher();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setOpenLogin, setOpenWishlist } = useDialogStore();
    const {
        wishlist = [],
        totalCart,
        isLoggedIn,
        profile,
    } = useRouteLoaderData("root") ?? {};
    const iconStroke = 1.5;
    const iconSize = 25;

    return (
        <header className="sticky top-0 w-full z-50 bg-white border-b-2 border-primary px-16 py-4 flex items-center justify-between gap-4">
            <Link to="/">
                <img
                    src="/images/logo.svg"
                    alt="Logo"
                    className="w-24 h-8 cursor-pointer"
                    loading="lazy"
                />
            </Link>
            {!error && (
                <InputWithIcon
                    icon={Search}
                    sizeIcon={20}
                    placeholder="Kamu butuh apa? Cari disini yuk"
                    className="rounded-sm"
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
            )}
            {!error && (
                <div className="flex items-center">
                    <IconWrapper
                        onClick={() => setOpenWishlist(true)}
                        badgeCount={wishlist.length}
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
                        }}
                        className="group flex"
                    >
                        <User size={iconSize} strokeWidth={iconStroke} />
                        <p className="ml-2 line-clamp-1">
                            {isLoggedIn ? profile.fullname : "LOGIN"}
                        </p>

                        {/* Dropdown on hover */}
                        {profile && (
                            <div className="absolute right-0 top-10 py-2  hidden w-auto min-w-[13.438rem] group-hover:block z-40">
                                <div className="flex flex-col rounded-md border border-border-subtle bg-white shadow-md mt-sm">
                                    <div className="flex flex-row p-2 cursor-pointer hover:bg-gray-100 gap-x-2 items-center">
                                        <Avatar>
                                            <AvatarImage
                                                src={
                                                    import.meta.env
                                                        .VITE_API_URL_FILES +
                                                    profile
                                                        ?.media_user_profile_picture
                                                        ?.media?.path
                                                }
                                            />
                                            <AvatarFallback>
                                                {profile?.fullname[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-semibold">
                                                {profile?.fullname}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {profile?.no_phone}
                                            </span>
                                        </div>
                                    </div>
                                    <hr />
                                    <Link
                                        to={"/user/address"}
                                        className="p-2 cursor-pointer hover:bg-gray-100 text-foreground"
                                    >
                                        Daftar Alamat
                                    </Link>
                                    <Link
                                        to={"/user/transaction-history"}
                                        className="p-2 cursor-pointer hover:bg-gray-100 text-foreground"
                                    >
                                        Riwayat Transaksi
                                    </Link>
                                    <hr />
                                    <div
                                        className="p-2 cursor-pointer hover:bg-gray-100 text-foreground"
                                        onClick={() => {
                                            fetcher.submit(null, {
                                                method: "post",
                                                action: "/api/logout",
                                            });
                                        }}
                                    >
                                        Keluar
                                    </div>
                                </div>
                            </div>
                        )}
                    </IconWrapper>
                </div>
            )}
        </header>
    );
}
