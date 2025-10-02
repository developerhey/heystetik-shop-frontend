import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";

export default function Header({ isMobile }: { isMobile: boolean }) {
    return isMobile ? <HeaderMobile /> : <HeaderDesktop />;
}
