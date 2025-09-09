import { Dialog, DialogContent, DialogHeader } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "~/components/ui/input-otp"
import { ArrowLeft } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { LoadingOverlay } from "~/components/ui/loading";
import { useLogin } from "./useLogin";
import { useDialogStore } from "~/shared/stores/useDialogStore";

function EmailOrPhoneField({ value, error, onChange, onNextClick, onGoogleLoginClick }: {
    value: string;
    error?: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNextClick: () => void;
    onGoogleLoginClick: () => void;
}) {
    return (
        <div className="relative p-6">
            <DialogHeader>
                <DialogTitle className="text-2xl font-semibold mb-6">Masuk</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
                <label htmlFor="login" className="text-sm font-medium">
                    Nomor HP atau Email
                </label>
                <Input
                    id="login"
                    placeholder="08xxxxxxxxxx / email"
                    value={value}
                    onChange={onChange}
                    className={error ? "border-destructive" : ""}
                />
                {/* {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )} */}
            </div>
            <Button
                disabled={!value || !!error}
                className="w-full mt-4"
                size={"lg"}
                onClick={onNextClick}
            >
                Selanjutnya
            </Button>

            <div className="flex items-center my-4">
                <div className="flex-1 border-t" />
                <span className="px-2 text-xs text-muted-foreground">atau masuk dengan</span>
                <div className="flex-1 border-t" />
            </div>
            <Button variant={"outline"} size="lg" className="w-full" onClick={onGoogleLoginClick}>
                <img src="/icons/google.svg" loading="lazy" className="size-4" alt="Google" />
                Google
            </Button>
        </div>
    );
}

function OtpField({ onBackClick, onCompleteOtp, onOtpChange, loading }: {
    onBackClick: () => void,
    onCompleteOtp: () => void,
    onOtpChange: (newValue: string) => void,
    loading: boolean
}) {
    return (
        <div className="relative p-4">
            <ArrowLeft size={16} className="cursor-pointer" onClick={loading ? undefined : onBackClick} />
            <div className="flex flex-col items-center mt-2 pb-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold mb-6">Masukkan Kata Sandi</DialogTitle>
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

export default function LoginDialogDesktop() {
    const { isOpenLogin, setOpenLogin } = useDialogStore();
    const {
        step,
        values,
        errors,
        loading,
        setStep,
        setValue,
        validateField,
        handleLogin,
        handleGoogleLogin
    } = useLogin();

    return (
        <Dialog open={isOpenLogin} onOpenChange={setOpenLogin}>
            <DialogContent className="max-w-xs rounded-md p-0 overflow-hidden">
                {step === "emailOrPhoneNumber" && (
                    <EmailOrPhoneField
                        value={values.emailOrPhoneNumber}
                        error={errors.emailOrPhoneNumber}
                        onChange={(e) => {
                            setValue("emailOrPhoneNumber", e.target.value);
                            validateField("emailOrPhoneNumber");
                        }}
                        onGoogleLoginClick={handleGoogleLogin}
                        onNextClick={() => setStep("otp")}
                    />
                )}
                {step === "otp" && (
                    <OtpField
                        onCompleteOtp={handleLogin}
                        onOtpChange={(newValue) => setValue("otp", newValue)}
                        onBackClick={() => setStep("emailOrPhoneNumber")}
                        loading={loading}
                    />
                )}
                <LoadingOverlay show={loading} />
            </DialogContent>
        </Dialog>
    );
}