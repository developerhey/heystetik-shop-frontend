import { Dialog, DialogContent } from "~/components/ui/dialog";
import { LoadingOverlay } from "~/components/ui/loading";
import { useAuth } from "./useAuth";
import { useDialogStore } from "~/shared/stores/useDialogStore";
import { LoginStepEmailOrPhone } from "./LoginStepEmailOrPhone";
import { LoginStepOtp } from "./LoginStepOtp";
import { RegisterStepPhone } from "./RegisterStepPhone";
import { RegisterStepPhoneOtp } from "./RegisterStepPhoneOtp";
import { RegisterStepEmail } from "./RegisterStepEmail";
import { RegisterStepEmailOtp } from "./RegisterStepEmailOtp";
import { RegisterStepPersonalInfo } from "./RegisterStepPersonalInfo";
export default function AuthForm() {
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
        handleGoogleLogin,
        handleRegisterStep,
    } = useAuth();

    return (
        <Dialog open={isOpenLogin} onOpenChange={setOpenLogin}>
            <DialogContent
                className="xs:max-w-xs rounded-md p-0 overflow-hidden"
                onInteractOutside={(e) => e.preventDefault()}
            >
                {step === "emailOrPhoneNumber" && (
                    <LoginStepEmailOrPhone
                        value={values.emailOrPhoneNumber as string}
                        error={errors.emailOrPhoneNumber}
                        onChange={(e) => {
                            setValue("emailOrPhoneNumber", e.target.value);
                            validateField("emailOrPhoneNumber");
                        }}
                        onGoogleLoginClick={handleGoogleLogin}
                        onNextClick={() => setStep("otp")}
                        onRegisterClick={() => setStep("register-phone")}
                    />
                )}
                {step === "otp" && (
                    <LoginStepOtp
                        onCompleteOtp={handleLogin}
                        onOtpChange={(newValue) => setValue("otp", newValue)}
                        onBackClick={() => setStep("emailOrPhoneNumber")}
                        loading={loading}
                    />
                )}
                {step === "register-phone" && (
                    <RegisterStepPhone
                        loading={loading}
                        onBackClick={() => setStep("emailOrPhoneNumber")}
                        value={values.phoneNumber as string}
                        error={errors.phoneNumber}
                        onChange={(value) => {
                            setValue("phoneNumber", value);
                            validateField("phoneNumber");
                        }}
                        onNextClick={() => handleRegisterStep(false)}
                    />
                )}
                {step === "register-phone-otp" && (
                    <RegisterStepPhoneOtp
                        phoneNumber={values.phoneNumber as string}
                        onResendOtp={() => handleRegisterStep(true)}
                        onCompleteOtp={() => handleRegisterStep(false)}
                        onOtpChange={(newValue) =>
                            setValue("otpPhone", newValue)
                        }
                        onBackClick={() => setStep("register-phone")}
                        loading={loading}
                    />
                )}
                {step === "register-email" && (
                    <RegisterStepEmail
                        loading={loading}
                        onBackClick={() => setStep("register-phone")}
                        value={values.email as string}
                        error={errors.email}
                        onChange={(e) => {
                            setValue("email", e.target.value);
                            validateField("email");
                        }}
                        onNextClick={handleRegisterStep}
                    />
                )}
                {step === "register-email-otp" && (
                    <RegisterStepEmailOtp
                        email={values.email as string}
                        onResendOtp={() => setStep("register-phone-otp")}
                        onCompleteOtp={() => handleRegisterStep(false)}
                        onOtpChange={(newValue) =>
                            setValue("otpEmail", newValue)
                        }
                        onBackClick={() => setStep("register-email")}
                        loading={loading}
                    />
                )}
                {step === "register-personal-info" && (
                    <RegisterStepPersonalInfo
                        loading={loading}
                        onBackClick={() => setStep("register-email-otp")}
                        values={{
                            fullName: values.fullName as string,
                            gender: values.gender as string,
                            province: values.province as string,
                            city: values.city as string,
                            pin: values.pin as string,
                            avatarUrl: values.avatarUrl as string,
                        }}
                        errors={{
                            fullName: errors.fullName,
                            gender: errors.gender,
                            province: errors.province,
                            city: errors.city,
                            pin: errors.pin,
                            avatarUrl: errors.avatarUrl,
                        }}
                        onChange={(field, value) => {
                            setValue(field as any, value);
                            validateField(field as any);
                        }}
                        onNextClick={handleRegisterStep}
                    />
                )}
                <LoadingOverlay show={loading} />
            </DialogContent>
        </Dialog>
    );
}
