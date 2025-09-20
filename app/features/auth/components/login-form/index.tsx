// import LoginDialogMobile from "./LoginDialogMobile";
import LoginDialogDesktop from "./LoginDialogDesktop";

export default function LoginDialog({ isMobile }: { isMobile: boolean }) {
    return isMobile ? <LoginDialogDesktop /> : <LoginDialogDesktop />;
}
