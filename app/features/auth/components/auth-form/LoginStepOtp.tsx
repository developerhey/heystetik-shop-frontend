import { DialogHeader } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "~/components/ui/input-otp";
import { ArrowLeft } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export function LoginStepOtp({
    onBackClick,
    onCompleteOtp,
    onOtpChange,
    loading,
}: {
    onBackClick: () => void;
    onCompleteOtp: () => void;
    onOtpChange: (newValue: string) => void;
    loading: boolean;
}) {
    return (
        <div className="relative p-4">
            <ArrowLeft
                size={16}
                className="cursor-pointer"
                onClick={loading ? undefined : onBackClick}
            />
            <div className="flex flex-col items-center mt-2 pb-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold mb-6">
                        Masukkan Kata Sandi
                    </DialogTitle>
                </DialogHeader>
                <InputOTP
                    maxLength={6}
                    onComplete={onCompleteOtp}
                    onChange={onOtpChange}
                    pattern={REGEXP_ONLY_DIGITS}
                    disabled={loading}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                <Button variant={"link"} className="mt-6" disabled={loading}>
                    Lupa kata sandi?
                </Button>
            </div>
        </div>
    );
}