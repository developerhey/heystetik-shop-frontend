import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useNavigation,
    useRouteError,
    useFetcher,
    useRevalidator,
} from "react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { Route } from "./+types/root";
import "./app.css";
import Header from "~/components/template/header";
import Footer from "~/components/template/footer";
import { UAParser } from "ua-parser-js";
import AuthForm from "~/features/auth/components/auth-form/AuthDialog";
import { Toaster } from "sonner";
import { getSession } from "./sessions.server";
import {
    RequireLoginMobile,
    RequireLoginDesktop,
} from "./components/template/require-login";
import { type ApiError, isApiError } from "./lib/api";
import WishlistSidebar from "./components/template/SidebarWishlist";
import ProfileSidebar from "./components/template/SidebarProfile";
import { getWishlistList } from "./shared/services/wishlist-service";
import { mapWishlistListResponseToUI } from "./shared/schemas/wishlist-mapper";
import { getTotalCartList } from "./shared/services/cart-service";
import { getProfile } from "./shared/services/profile-service";
import { LoadingOverlay } from "./components/ui/loading";
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { Button } from "~/components/ui/button";
import { PhoneInput } from "~/components/ui/phone-input";
import { type Value } from "react-phone-number-input";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "~/components/ui/input-otp";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import { useDialogStore } from "./shared/stores/useDialogStore";

export const links: Route.LinksFunction = () => [];

export async function loader({ request }: Route.LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("access_token") ?? "";
    const user = session.get("user");

    const userAgent = request.headers.get("user-agent") || "";
    const ua = new UAParser(userAgent);
    const isMobile = ua.getDevice().type === "mobile" || false;

    const baseReturn = {
        isLoggedIn: !!token,
        request,
        isMobile,
        user,
        wishlist: [],
        totalCart: 0,
        profile: null,
    };
    if (!token) return baseReturn;

    try {
        const [wishlist, cart, profile] = await Promise.all([
            getWishlistList(token),
            getTotalCartList(token),
            getProfile(token),
        ]);

        return {
            ...baseReturn,
            wishlist: mapWishlistListResponseToUI(wishlist),
            totalCart: cart?.data?.meta?.itemCount ?? 0,
            profile: profile?.data ?? null,
        };
    } catch (error: any) {
        throw {
            ...error,
            isMobile,
            id: user?.id ?? "",
        };
    }
}

export function Layout({ children }: { children: React.ReactNode }) {
    const navigation = useNavigation();
    const isLoading = navigation.state === "loading";
    const data = useLoaderData<typeof loader>() ?? {};
    const error = useRouteError();
    let isMobile: boolean;
    if (error && !data.isMobile) {
        if (isRouteErrorResponse(error)) {
            isMobile = error.data?.isMobile ?? false;
        } else {
            isMobile = (error as any)?.isMobile ?? false;
        }
    } else {
        isMobile = data.isMobile ?? false;
    }
    const { user, wishlist = [] } = data;
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <GoogleOAuthProvider
                    clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}
                >
                    <Header isMobile={isMobile} />
                    {children}
                    <AuthForm />
                    <WishlistSidebar wishlist={wishlist} />
                    <ProfileSidebar />
                    <Toaster richColors position="top-center" />
                    <Footer isMobile={isMobile} />
                    <LoadingOverlay show={isLoading} />
                </GoogleOAuthProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export type ContextType = { isMobile: boolean | false };

export default function App() {
    const data = useLoaderData<typeof loader>() ?? {};
    const { isMobile = false } = data;

    return <Outlet context={{ isMobile } satisfies ContextType} />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"phoneNumber" | "otp">("phoneNumber");
    const [countdown, setCountdown] = useState(0);
    const errorData: any = useRouteError();
    const { setOpenLogin } = useDialogStore();
    const fetcher = useFetcher();
    const loading =
        fetcher.state === "submitting" || fetcher.state === "loading";
    const revalidator = useRevalidator();

    // Add phone number validation state
    const [phoneError, setPhoneError] = useState<string | undefined>();

    // for tracking crash only
    const firebaseConfig = {
        apiKey: "AIzaSyDTfpPKAEEHP7ovl3ig8m_1VVFHHzUReRo",
        authDomain: "heystetik-c5f3f.firebaseapp.com",
        projectId: "heystetik-c5f3f",
        storageBucket: "heystetik-c5f3f.firebasestorage.app",
        messagingSenderId: "110425577691",
        appId: "1:110425577691:web:9331e3ad64b40b3e3e54fe",
        measurementId: "G-FSBKL45TJ9",
    };

    const formatCountdown = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handleResendOtp = () => {
        if (countdown > 0 || loading) return;
        const phoneFormData = new FormData();
        phoneFormData.append("phoneNumber", phoneNumber);
        phoneFormData.append("isResendOtp", true.toString());

        fetcher.submit(phoneFormData, {
            method: "post",
            action: "/api/register-phone",
        });
        setCountdown(300);
    };

    const handleBackClick = () => {
        if (loading) return;
        setStep("phoneNumber");
        setCountdown(0);
    };

    const validatePhoneNumber = (phone: string) => {
        if (!phone) {
            setPhoneError(undefined);
            return false;
        }

        if (!isPossiblePhoneNumber(phone)) {
            setPhoneError("Nomor HP tidak valid");
            return false;
        }

        setPhoneError(undefined);
        return true;
    };

    const handlePhoneChange = (value: string) => {
        setPhoneNumber(value);
        validatePhoneNumber(value);
    };

    const handlePhoneNextClick = () => {
        if (!validatePhoneNumber(phoneNumber)) {
            return;
        }

        const phoneFormData = new FormData();
        phoneFormData.append("phoneNumber", phoneNumber);
        phoneFormData.append("isResendOtp", false.toString());

        fetcher.submit(phoneFormData, {
            method: "post",
            action: "/api/register-phone",
        });
    };

    const handleOtpComplete = () => {
        const phoneFormData = new FormData();
        phoneFormData.append("phoneNumber", phoneNumber);
        phoneFormData.append("otp", otp);
        phoneFormData.append("userId", errorData?.id ?? "");

        fetcher.submit(phoneFormData, {
            method: "post",
            action: "/api/update-phone",
        });
    };

    useEffect(() => {
        setOpenLogin(false);
    }, []);

    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    useEffect(() => {
        if (fetcher.data?.error && !loading) {
            toast.error(fetcher.data.error, { duration: 1500 });
        }

        if (fetcher.data?.success && !loading) {
            if (step == "otp" && fetcher.data?.userId) {
                revalidator.revalidate();
                setStep("phoneNumber");
                setPhoneNumber("");
                setOtp("");
                setCountdown(0)
            } else if (!fetcher.data.isResendOtp) {
                setStep("otp");
            } else {
                toast.success(fetcher.data.message || "Success!", {
                    duration: 1500,
                });
            }
        }
    }, [fetcher.data, loading]);

    let message = "Oops!";
    let details = "An error occurred.";
    let stack: string | undefined;

    if (isApiError(error)) {
        if (
            error.status == 401 ||
            (error.status == 500 &&
                error?.data?.error ==
                    "Cannot read properties of null (reading 'sub')")
        ) {
            return errorData.isMobile ? (
                <RequireLoginMobile />
            ) : (
                <RequireLoginDesktop />
            );
        } else if (
            error.status == 400 &&
            error?.data?.data?.error_code == "PHONE_NUMBER_REQUIRED"
        ) {
            return (
                <div className="my-8 min-h-screen max-w-6xl mx-auto">
                    <div className="flex flex-col items-center mt-2 pb-6">
                        {step === "phoneNumber" && (
                            <div className="relative p-4 w-full max-w-md">
                                <div className="flex flex-col items-center mt-2 pb-6">
                                    <div className="mb-6 gap-0 text-center">
                                        <div className="text-2xl font-semibold text-center">
                                            Registrasi Nomor HP
                                        </div>
                                        <div className="text-muted-foreground text-sm font-medium">
                                            Daftarkan nomor hp kamu untuk lanjut
                                        </div>
                                    </div>
                                    <div className="w-full space-y-2">
                                        <label
                                            htmlFor="phone_number"
                                            className="text-sm font-medium"
                                        >
                                            Nomor HP
                                        </label>
                                        <PhoneInput
                                            international={true}
                                            defaultCountry="ID"
                                            id="phone_number"
                                            placeholder="8xxxxxxxxxx"
                                            value={phoneNumber}
                                            onChange={(value: Value) =>
                                                handlePhoneChange(
                                                    value?.toString() || ""
                                                )
                                            }
                                            className={
                                                phoneError
                                                    ? "border-destructive"
                                                    : ""
                                            }
                                        />
                                        {/* {phoneError && (
                                            <p className="text-destructive text-xs mt-1">
                                                {phoneError}
                                            </p>
                                        )} */}
                                    </div>
                                    <Button
                                        disabled={
                                            !phoneNumber ||
                                            !!phoneError ||
                                            loading
                                        }
                                        className="w-full mt-4"
                                        size={"lg"}
                                        onClick={handlePhoneNextClick}
                                    >
                                        {loading
                                            ? "Memproses..."
                                            : "Selanjutnya"}
                                    </Button>
                                    <Button
                                        className="w-full mt-4"
                                        size={"lg"}
                                        variant={"outline"}
                                        onClick={() => {
                                            fetcher.submit(null, {
                                                method: "post",
                                                action: "/api/logout",
                                            });
                                        }}
                                    >
                                        Keluar
                                    </Button>
                                </div>
                            </div>
                        )}
                        {step === "otp" && (
                            <div className="relative p-4 w-full max-w-md">
                                <ArrowLeft
                                    size={16}
                                    className="cursor-pointer"
                                    onClick={
                                        loading ? undefined : handleBackClick
                                    }
                                />
                                <div className="flex flex-col items-center mt-2 pb-6">
                                    <div className="mb-6 gap-0 text-center">
                                        <div className="text-2xl font-semibold text-center">
                                            Verifikasi OTP
                                        </div>
                                        <div className="text-muted-foreground text-sm font-medium text-center">
                                            Masukkan 5 digit kode yang telah
                                            dikirim ke nomor whatsapp
                                            <br />
                                            <span className="font-bold">
                                                {phoneNumber}
                                            </span>
                                        </div>
                                    </div>

                                    <InputOTP
                                        maxLength={5}
                                        onComplete={handleOtpComplete}
                                        onChange={setOtp}
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
                                                        {formatCountdown(
                                                            countdown
                                                        )}
                                                    </span>
                                                </div>
                                                <span className="text-gray-500">
                                                    Tunggu hingga waktu habis
                                                    untuk kirim ulang
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
                        )}
                    </div>
                </div>
            );
        }
    }

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details =
            error.status === 404
                ? "The requested page could not be found."
                : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
        console.log(error);
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        logEvent(analytics, "error", {
            details: error.message,
            stack: error.stack,
        });
    }

    return (
        <main className="pt-16 p-4 container mx-auto min-h-screen">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full p-4 overflow-x-auto">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}
