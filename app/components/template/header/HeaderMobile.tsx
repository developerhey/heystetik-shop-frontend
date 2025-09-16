import { User, ShoppingCart, Heart, Search, ArrowLeft } from "lucide-react";
import { InputWithIcon } from "~/components/ui/input";
import { Link } from "react-router";
import { useLocation } from "react-router";
export default function HeaderMobile({ user }: { user: any }) {
    const location = useLocation();
    const pathname = location.pathname;
    const iconStroke = 1.5;
    const iconSize = 16;
    const IconWrapper = ({
        children,
        onClick,
    }: {
        children: React.ReactNode;
        onClick?: () => void;
    }) => (
        <div
            className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer transition flex"
            onClick={onClick}
        >
            {children}
        </div>
    );

    return (
        <header className="sticky top-0 w-full z-[999] bg-white border-b-2 border-primary p-4 flex flex-col">
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
                            {pathname == "/search"
                                ? "Skincare"
                                : ""}
                        </span>
                    </div>
                )}
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
                            // onLoginClicked?.();
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
            />
        </header>
    );
}
