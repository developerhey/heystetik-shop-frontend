import { Input } from "~/components/ui/input"
import { type FooterLinkProps } from "."


export default function FooterDesktop() {
    function FooterLink({ to, text }: FooterLinkProps) {
        return (
            <a href={to} className="text-white cursor-pointer hover:underline">{text}</a>
        )
    }
    return (
        <footer className="w-full bg-black px-[11.25rem] py-[4.063rem] flex flex-col justify-between gap-8">
            <p className="text-white text-[1.125rem] font-bold">Get interesting updates and special offer</p>
            {/* ToDo create input to subscribe email & sosmed */}
            {/* <Input className="bg-white" placeholder="Enter your email here"/> */}
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row gap-4">
                    <FooterLink to="https://www.heystetik.com/" text="Home" />
                    <FooterLink to="https://www.heystetik.com/treatment" text="Treatment" />
                    <FooterLink to="https://www.heystetik.com/concern" text="Concern" />
                    <FooterLink to="https://www.heystetik.com/skincare" text="Skincare" />
                    <FooterLink to="https://www.heystetik.com/clinic" text="Clinic" />
                    <FooterLink to="https://www.heystetik.com/doctor" text="Doctor" />
                    <FooterLink to="https://www.heystetik.com/news" text="News" />
                </div>
                <div className="flex flex-row gap-4">
                    <FooterLink to="https://www.heystetik.com/about" text="About Us" />
                    <FooterLink to="https://www.heystetik.com/contact" text="Contact Us" />
                    <FooterLink to="https://www.heystetik.com/contact?type=claimprofile" text="Claim your profile" />
                </div>
            </div>
            <hr className="text-white" />
            <div className="flex flex-row items-center justify-between">
                <p className="text-white">©2025. Heystetik. All Rights Reserved. Owned by PT Neosains Medika Teknologi </p>
                <div className="flex flex-row gap-4">
                    <FooterLink to="https://www.heystetik.com/term-and-condition" text="Terms & Conditions" />
                    <FooterLink to="https://www.heystetik.com/privacy-policy" text="Privacy Policy" />
                </div>
            </div>

        </footer>
    )
}