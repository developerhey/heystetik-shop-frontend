import { Input } from "~/components/ui/input"
import { type FooterLinkProps } from "."


export default function FooterMobile() {
    function FooterLink({ to, text }: FooterLinkProps) {
        return (
            <a href={to} className="text-white cursor-pointer hover:underline text-sm">{text}</a>
        )
    }
    return (
        <footer className="w-full bg-black p-4 flex flex-col py-16">
            {/* <p className="text-white text-[1rem] font-medium">Get interesting updates and special offer</p> */}
            {/* ToDo create input to subscribe email & sosmed */}
            {/* <Input className="bg-white" placeholder="Enter your email here"/> */}
            <div className="flex flex-col mt-16 gap-y-1">
                <FooterLink to="https://www.heystetik.com/" text="Home" />
                <FooterLink to="https://www.heystetik.com/treatment" text="Treatment" />
                <FooterLink to="https://www.heystetik.com/concern" text="Concern" />
                <FooterLink to="https://www.heystetik.com/skincare" text="Skincare" />
                <FooterLink to="https://www.heystetik.com/clinic" text="Clinic" />
                <FooterLink to="https://www.heystetik.com/doctor" text="Doctor" />
                <FooterLink to="https://www.heystetik.com/news" text="News" />
            </div>
            <div className="flex flex-col mt-[1.25rem]">
                <FooterLink to="https://www.heystetik.com/about" text="About Us" />
                <FooterLink to="https://www.heystetik.com/contact" text="Contact Us" />
                <FooterLink to="https://www.heystetik.com/contact?type=claimprofile" text="Claim your profile" />

            </div>
            <hr className="text-white my-[1.563rem]" />
            <p className="text-white font-medium text-sm">©2025. Heystetik. All Rights Reserved. Owned by PT Neosains Medika Teknologi </p>
            <div className="flex flex-col gap-1 mt-[1.25rem]">
                <FooterLink to="https://www.heystetik.com/term-and-condition" text="Terms & Conditions" />
                <FooterLink to="https://www.heystetik.com/privacy-policy" text="Privacy Policy" />
            </div>

        </footer>
    )
}