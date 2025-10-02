import { DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "~/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState, useEffect } from "react";

export function RegisterStepPhoneOtp({
    phoneNumber,
    onBackClick,
    onCompleteOtp,
    onOtpChange,
    loading,
    onResendOtp,
}: {
    phoneNumber: string;
    onBackClick: () => void;
    onCompleteOtp: () => void;
    onOtpChange: (newValue: string) => void;
    loading: boolean;
    onResendOtp: () => void;
}) {
    const [countdown, setCountdown] = useState(0);

    const formatCountdown = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handleResendOtp = () => {
        if (countdown > 0 || loading) return;

        onResendOtp();

        setCountdown(300); // 5 minutes
    };

    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    return (
        <div className="relative p-4">
            <ArrowLeft
                size={16}
                className="cursor-pointer"
                onClick={loading ? undefined : onBackClick}
            />
            <div className="flex flex-col items-center mt-2 pb-6">
                <DialogHeader className="mb-6 gap-0">
                    <DialogTitle className="text-2xl font-semibold text-center">
                        Verifikasi OTP
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm font-medium text-center">
                        Masukkan 5 digit kode yang telah dikirim ke nomor
                        whatsapp
                        <br />
                        <span className="font-bold">{phoneNumber}</span>
                    </DialogDescription>
                </DialogHeader>

                <InputOTP
                    maxLength={5}
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
                    </InputOTPGroup>
                </InputOTP>

                <div className="text-xs mt-4 text-muted-foreground text-center">
                    {countdown > 0 ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                                Dapat kirim ulang dalam:{" "}
                                <span className="font-mono font-medium">
                                    {formatCountdown(countdown)}
                                </span>
                            </div>
                            <span className="text-gray-500">
                                Tunggu hingga waktu habis untuk kirim ulang
                            </span>
                        </div>
                    ) : (
                        <div className="text-center">
                            Kode OTP tidak masuk?{" "}
                            <button
                                type="button"
                                className="text-primary underline hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleResendOtp}
                                disabled={loading}
                            >
                                Kirim ulang
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
