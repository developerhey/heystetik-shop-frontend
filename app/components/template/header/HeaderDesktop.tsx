import { User, ShoppingCart, Heart, Search } from "lucide-react";
import { InputWithIcon } from "~/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useDialogStore } from "~/shared/stores/useDialogStore";

export default function HeaderDesktop({ user }: { user: any }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setOpenLogin } = useDialogStore();
    const iconStroke = 1.5;
    const iconSize = 25;
    const IconWrapper = ({
        children,
        onClick,
    }: {
        children: React.ReactNode;
        onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    }) => (
        <div
            className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer transition flex"
            onClick={onClick}
        >
            {children}
        </div>
    );

    return (
        <header className="sticky top-0 w-full z-[999] bg-white border-b-2 border-primary px-16 py-4 flex items-center justify-between gap-4">
            <Link to="/">
                <img
                    src="/images/logo.svg"
                    alt="Logo"
                    className="h-8 cursor-pointer"
                    loading="lazy"
                />
            </Link>
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
            <div className="flex items-center">
                <IconWrapper>
                    <Heart size={iconSize} strokeWidth={iconStroke} />
                </IconWrapper>
                <Link to="cart">
                    <IconWrapper>
                        <ShoppingCart
                            size={iconSize}
                            strokeWidth={iconStroke}
                        />
                    </IconWrapper>
                </Link>
                <IconWrapper
                    onClick={() => {
                        setOpenLogin(true);
                    }}
                >
                    <User size={iconSize} strokeWidth={iconStroke} />
                    <p className="ml-2">{user ? user.name : "LOGIN"}</p>
                </IconWrapper>
            </div>
        </header>
    );
}
