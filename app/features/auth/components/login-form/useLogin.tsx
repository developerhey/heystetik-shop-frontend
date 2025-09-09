import { useState, useCallback, useEffect } from "react";
import { useFetcher } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import {
    LoginParamSchema,
    type LoginParam,
    type LoginField,
} from "~/features/auth/schemas/login-param-schema";
import { useDialogStore } from "~/shared/stores/useDialogStore";
import { useRevalidator } from "react-router";

interface LoginState {
    step: LoginField;
    values: LoginParam;
    errors: Partial<Record<LoginField, string>>;
    loading: boolean;
    success?: boolean;
}

type UseLoginReturn = LoginState & {
    setStep: (step: LoginField) => void;
    setValue: (field: LoginField, value: string) => void;
    setError: (field: LoginField, msg?: string) => void;
    clearErrors: () => void;
    validateField: (field: LoginField) => boolean;
    handleLogin: () => void;
    handleGoogleLogin: () => void;
};

const initialState: LoginState = {
    step: "emailOrPhoneNumber",
    values: {
        emailOrPhoneNumber: "",
        otp: "",
    },
    loading: false,
    errors: {},
    success: false,
};

export const useLogin = (): UseLoginReturn => {
    const [state, setState] = useState<LoginState>(initialState);
    const fetcher = useFetcher();
    const { setOpenLogin } = useDialogStore();
    const revalidator = useRevalidator();

    const loading =
        fetcher.state === "submitting" || fetcher.state === "loading";

    useEffect(() => {
        if (fetcher.data?.error && !loading) {
            toast.error(fetcher.data.error, { duration: 1500 });
        }

        if (fetcher.data?.success && !loading) {
            setOpenLogin(false);
            revalidator.revalidate();
        }
    }, [fetcher.data, loading]);

    const setStep = useCallback((step: LoginField) => {
        setState((prev) => ({ ...prev, step }));
    }, []);

    const setValue = useCallback((field: LoginField, value: string) => {
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

    const setError = useCallback((field: LoginField, msg?: string) => {
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

    const validateField = useCallback(
        (field: LoginField): boolean => {
            const partialSchema = LoginParamSchema.pick({ [field]: true });
            const result = partialSchema.safeParse({
                [field]: state.values[field],
            });

            if (!result.success) {
                setError(field, result.error.message);
                return false;
            }

            setError(field, undefined);
            return true;
        },
        [state.values, setError]
    );

    const handleLogin = useCallback(() => {
        // Validate all required fields based on current step
        if (state.step === "otp") {
            const isEmailValid = validateField("emailOrPhoneNumber");
            const isOtpValid = validateField("otp");
            if (!isEmailValid || !isOtpValid) return;
        } else {
            const isEmailValid = validateField("emailOrPhoneNumber");
            if (!isEmailValid) return;
            setStep("otp");
            return; // Don't submit, just move to next step
        }

        const formData = new FormData();
        formData.append(
            "emailOrPhoneNumber",
            state.values.emailOrPhoneNumber.trim()
        );
        formData.append("otp", state.values.otp);

        fetcher.submit(formData, {
            method: "post",
            action: "/api/login",
        });
    }, [state.values, state.step, validateField, fetcher, setStep]);

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

    // Update loading state in render
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
    };
};
