import { DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export function LoginStepEmailOrPhone({
    value,
    error,
    onChange,
    onNextClick,
    onGoogleLoginClick,
    onRegisterClick,
}: {
    value: string;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNextClick: () => void;
    onGoogleLoginClick: () => void;
    onRegisterClick: () => void;
}) {
    return (
        <div className="relative p-6">
            <DialogHeader>
                <DialogTitle className="text-2xl font-semibold mb-6">
                    Masuk
                </DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
                <label htmlFor="login" className="text-sm font-medium">
                    Nomor HP atau Email
                </label>
                <Input
                    id="login"
                    placeholder="8xxxxxxxxxx / email"
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

            {/* <div className="flex items-center my-4">
                <div className="flex-1 border-t" />
                <span className="px-2 text-xs text-muted-foreground">
                    atau masuk dengan
                </span>
                <div className="flex-1 border-t" />
            </div>
            <Button
                variant={"outline"}
                size="lg"
                className="w-full"
                onClick={onGoogleLoginClick}
            >
                <img
                    src="/icons/google.svg"
                    loading="lazy"
                    className="size-4"
                    alt="Google"
                />
                Google
            </Button> */}
            <div className="text-center mt-4 text-xs text-muted-foreground">
                Belum punya akun Heystetik?{" "}
                <span
                    className="text-primary cursor-pointer"
                    onClick={onRegisterClick}
                >
                    Daftar
                </span>
            </div>
        </div>
    );
}
