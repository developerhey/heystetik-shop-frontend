import { useState, useCallback, useEffect } from "react";
import { useFetcher } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import {
    LoginParamSchema,
    RegisterStepPhoneParam,
    RegisterStepEmailParam,
    RegisterStepPersonalInfoParam,
    type AuthStep,
    type LoginField,
    type RegisterStepPhoneField,
    type RegisterStepEmailField,
    type RegisterStepEmailPersonalInfo,
    ForgotPasswordParam,
} from "~/features/auth/schemas/login-param-schema";
import { useDialogStore } from "~/shared/stores/useDialogStore";
import { useRevalidator } from "react-router";
import { ForgotPasswordStepEmail } from "./ForgotPasswordStepEmail";

// Union type for all possible fields across all steps
type AllFields =
    | LoginField
    | RegisterStepPhoneField
    | RegisterStepEmailField
    | RegisterStepEmailPersonalInfo
    | "emailForgotPassword";

// Extended state interface to handle all auth flows
interface AuthState {
    step: AuthStep;
    values: {
        userId?: string;
        emailOrPhoneNumber?: string;
        otp?: string;
        otpPhone?: string;
        otpEmail?: string;
        phoneNumber?: string;
        email?: string;
        fullName?: string;
        gender?: string;
        province?: string;
        city?: string;
        pin?: string;
        avatarUrl?: string;
        emailForgotPassword?: string;
    };
    errors: Partial<Record<AllFields, string>>;
    loading: boolean;
    success?: boolean;
}

type UseAuthReturn = AuthState & {
    setStep: (step: AuthStep) => void;
    setValue: (field: AllFields, value: string) => void;
    setError: (field: AllFields, msg?: string) => void;
    validateField: (field: AllFields) => boolean;
    clearErrors: () => void;
    handleLogin: () => void;
    handleGoogleLogin: () => void;
    handleRegisterStep: (isResendOtp?: boolean) => void;
    handleForgotPassword: () => void;
};

const initialState: AuthState = {
    step: "emailOrPhoneNumber",
    values: {
        emailOrPhoneNumber: "",
        otp: "",
    },
    loading: false,
    errors: {},
    success: false,
};

export const useAuth = (): UseAuthReturn => {
    const [state, setState] = useState<AuthState>(initialState);
    const fetcher = useFetcher();
    const { setOpenLogin } = useDialogStore();
    const revalidator = useRevalidator();

    const loading =
        fetcher.state === "submitting" || fetcher.state === "loading";

    // Define step transitions
    const getNextStep = (currentStep: AuthStep): AuthStep => {
        const stepTransitions: Record<AuthStep, AuthStep> = {
            emailOrPhoneNumber: "otp",
            otp: "emailOrPhoneNumber",
            "forgot-password": "emailOrPhoneNumber",
            "register-phone": "register-phone-otp",
            "register-phone-otp": "register-email",
            "register-email": "register-email-otp",
            "register-email-otp": "register-personal-info",
            "register-personal-info": "emailOrPhoneNumber", // Registration complete, go to login
        };
        return stepTransitions[currentStep] || currentStep;
    };
    useEffect(() => {
        if (fetcher.data?.error && !loading) {
            toast.error(fetcher.data.error, { duration: 1500 });
        }

        if (fetcher.data?.success && !loading) {
            // Handle successful response
            toast.success(fetcher.data.message || "Success!", {
                duration: 1500,
            });

            if (state.step === "otp") {
                // Login successful, close dialog
                setOpenLogin(false);
                revalidator.revalidate();
            } else {
                // Move to next step for registration flow
                if (state.step === "register-phone-otp") {
                    setState((prev) => ({
                        ...prev,
                        values: {
                            ...prev.values,
                            userId: fetcher.data.userId,
                        },
                    }));
                }

                const nextStep = getNextStep(state.step);
                if (!fetcher.data.isResendOtp) {
                    setStep(nextStep);
                }

                // Clear OTP fields when moving to next step (except for personal info)
                if (nextStep !== "register-personal-info") {
                    setState((prev) => ({
                        ...prev,
                        values: {
                            ...prev.values,
                            otp: "",
                            otpPhone: "",
                            otpEmail: "",
                        },
                    }));
                }
            }
        }
    }, [fetcher.data, loading]);

    const setStep = useCallback((step: AuthStep) => {
        setState((prev) => ({ ...prev, step }));
    }, []);

    const setValue = useCallback((field: AllFields, value: string) => {
        setState((prev) => ({
            ...prev,
            values: {
                ...prev.values,
                [field]: value,
            },
            errors: {
                ...prev.errors,
                [field]: undefined,
            },
        }));
    }, []);

    const setError = useCallback((field: AllFields, msg?: string) => {
        setState((prev) => ({
            ...prev,
            errors: {
                ...prev.errors,
                [field]: msg,
            },
        }));
    }, []);

    const clearErrors = useCallback(() => {
        setState((prev) => ({ ...prev, errors: {} }));
    }, []);

    const getSchemaForStep = useCallback((step: AuthStep) => {
        switch (step) {
            case "forgot-password":
                return ForgotPasswordParam;
            case "emailOrPhoneNumber":
            case "otp":
                return LoginParamSchema;
            case "register-phone":
            case "register-phone-otp":
                return RegisterStepPhoneParam;
            case "register-email":
            case "register-email-otp":
                return RegisterStepEmailParam;
            case "register-personal-info":
                return RegisterStepPersonalInfoParam;
            default:
                return LoginParamSchema;
        }
    }, []);

    const getFieldValidator = (step: AuthStep, field: AllFields) => {
        const schema = getSchemaForStep(step);
        const schemaShape = schema.shape as Record<string, any>;

        if (field in schemaShape) {
            return schemaShape[field];
        }
        return null;
    };

    const validateField = useCallback(
        (field: AllFields): boolean => {
            const validator = getFieldValidator(state.step, field);

            if (!validator) {
                setError(field, `Field ${field} is not valid for current step`);
                return false;
            }

            const fieldValue = state.values[field as keyof typeof state.values];

            try {
                const result = validator.safeParse(fieldValue);

                if (!result.success) {
                    const errorMessage =
                        result.error.errors[0]?.message || `Invalid ${field}`;
                    setError(field, errorMessage);
                    return false;
                }

                setError(field, undefined);
                return true;
            } catch (error) {
                setError(field, `Validation error for ${field}`);
                return false;
            }
        },
        [state.step, state.values, setError, getSchemaForStep]
    );

    const handleForgotPassword = useCallback(() => {
        const isEmailValid = validateField("emailForgotPassword");
        if (!isEmailValid) return;

        const formData = new FormData();
        formData.append("email", state.values.emailForgotPassword || "");

        fetcher.submit(formData, {
            method: "post",
            action: "/api/forgot-password",
        });
    }, [state.values, state.step, validateField, fetcher, setStep]);

    const handleLogin = useCallback(() => {
        // Handle login flow steps
        if (state.step === "emailOrPhoneNumber") {
            const isValid = validateField("emailOrPhoneNumber");
            if (!isValid) return;
            setStep("otp");
            return;
        }

        if (state.step === "otp") {
            const isEmailValid = validateField("emailOrPhoneNumber");
            const isOtpValid = validateField("otp");
            if (!isEmailValid || !isOtpValid) return;

            const formData = new FormData();
            formData.append(
                "emailOrPhoneNumber",
                state.values.emailOrPhoneNumber?.trim() || ""
            );
            formData.append("otp", state.values.otp || "");

            fetcher.submit(formData, {
                method: "post",
                action: "/api/login",
            });
        }
    }, [state.values, state.step, validateField, fetcher, setStep]);

    function sendOtpPhone(isResendOtp: boolean) {
        const isPhoneValid = validateField("phoneNumber");
        if (!isPhoneValid) return;
        const phoneFormData = new FormData();
        phoneFormData.append(
            "phoneNumber",
            state.values.phoneNumber?.trim() || ""
        );
        phoneFormData.append("isResendOtp", isResendOtp.toString());

        fetcher.submit(phoneFormData, {
            method: "post",
            action: "/api/register-phone",
        });
    }

    function sendOtpEmail(isResendOtp: boolean) {
        const isEmailValid = validateField("email");
        if (!isEmailValid) return;
        const emailFormData = new FormData();
        emailFormData.append("email", state.values.email?.trim() || "");
        emailFormData.append("isResendOtp", isResendOtp.toString());
        fetcher.submit(emailFormData, {
            method: "post",
            action: "/api/register-email",
        });
    }

    const handleRegisterStep = useCallback(
        (isResendOtp?: boolean) => {
            // Handle registration flow steps
            switch (state.step) {
                case "register-phone":
                    sendOtpPhone(false);
                    break;

                case "register-phone-otp":
                    if (isResendOtp) {
                        sendOtpPhone(true);
                        break;
                    }
                    const isPhoneValidForOtp = validateField("phoneNumber");
                    const isPhoneOtpValid = validateField("otpPhone");
                    if (!isPhoneValidForOtp || !isPhoneOtpValid) return;

                    const phoneOtpFormData = new FormData();
                    phoneOtpFormData.append(
                        "phoneNumber",
                        state.values.phoneNumber?.trim() || ""
                    );
                    phoneOtpFormData.append("otp", state.values.otpPhone || "");

                    fetcher.submit(phoneOtpFormData, {
                        method: "post",
                        action: "/api/register-phone-otp",
                    });
                    break;

                case "register-email":
                    sendOtpEmail(false);
                    break;

                case "register-email-otp":
                    if (isResendOtp) {
                        sendOtpEmail(true);
                        break;
                    }
                    const isEmailValidForOtp = validateField("email");
                    const isEmailOtpValid = validateField("otpEmail");
                    if (!isEmailValidForOtp || !isEmailOtpValid) return;

                    const emailOtpFormData = new FormData();
                    emailOtpFormData.append(
                        "email",
                        state.values.email?.trim() || ""
                    );
                    emailOtpFormData.append("otp", state.values.otpEmail || "");
                    emailOtpFormData.append(
                        "userId",
                        state.values.userId || ""
                    );
                    fetcher.submit(emailOtpFormData, {
                        method: "post",
                        action: "/api/register-email-otp",
                    });
                    break;

                // In the handleRegisterStep function, update the register-personal-info case:
                case "register-personal-info":
                    const isFullNameValid = validateField("fullName");
                    const isGenderValid = validateField("gender");
                    const isProvinceValid = validateField("province");
                    const isCityValid = validateField("city");
                    const isPinValid = validateField("pin");

                    if (
                        !isFullNameValid ||
                        !isGenderValid ||
                        !isProvinceValid ||
                        !isCityValid ||
                        !isPinValid
                    )
                        return;

                    const personalInfoFormData = new FormData();
                    personalInfoFormData.append(
                        "userId",
                        state.values.userId || ""
                    );
                    personalInfoFormData.append(
                        "fullName",
                        state.values.fullName || ""
                    );
                    personalInfoFormData.append(
                        "gender",
                        state.values.gender || ""
                    );
                    personalInfoFormData.append(
                        "province",
                        state.values.province || ""
                    );
                    personalInfoFormData.append(
                        "city",
                        state.values.city || ""
                    );
                    personalInfoFormData.append("pin", state.values.pin || "");

                    // Append avatarUrl if it exists (base64 string)
                    if (state.values.avatarUrl) {
                        personalInfoFormData.append(
                            "avatarUrl",
                            state.values.avatarUrl
                        );
                    }

                    fetcher.submit(personalInfoFormData, {
                        method: "post",
                        action: "/api/register-personal-info",
                        encType: "multipart/form-data", // Important for file uploads
                    });
                    break;

                default:
                    console.warn("Unhandled registration step:", state.step);
            }
        },
        [state.values, state.step, validateField, fetcher, setStep]
    );

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            const formData = new FormData();
            formData.append("googleToken", tokenResponse.access_token);
            fetcher.submit(formData, {
                method: "post",
                action: "/api/google-login",
            });
        },
        onError: (error) => {
            // toast.error("Google login failed");
        },
    });

    if (state.loading !== loading) {
        setState((prev) => ({ ...prev, loading }));
    }

    return {
        ...state,
        setStep,
        setValue,
        setError,
        clearErrors,
        validateField,
        handleLogin,
        handleGoogleLogin,
        handleRegisterStep,
        handleForgotPassword,
    };
};
