import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";

export default function Header({ isMobile, user }: { isMobile: boolean, user: any }) {
    return isMobile ? <HeaderMobile /> : <HeaderDesktop user={user} />
}