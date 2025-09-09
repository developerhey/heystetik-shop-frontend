import FooterDesktop from "./FooterDesktop"
import FooterMobile from "./FooterMobile"

export interface FooterLinkProps {
    to: string,
    text: string
}

export default function Footer({ isMobile }: { isMobile: boolean }) {
    return (
        isMobile ? <FooterMobile /> : <FooterDesktop />
    )
}