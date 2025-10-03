import { DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";

export function ForgotPasswordStepEmail({
    loading,
    value,
    error,
    onChange,
    onNextClick,
    onBackClick,
}: {
    value: string;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNextClick: () => void;
    onBackClick: () => void;
    loading: boolean;
}) {
    return (
        <div className="relative p-4">
            <ArrowLeft
                size={16}
                className="cursor-pointer"
                onClick={loading ? undefined : onBackClick}
            />
            <DialogHeader>
                <DialogTitle className="flex flex-col items-center mt-2 ">
                    Lupa Password
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-sm pb-6 text-center">
                    Link akan dikirim ke email kamu
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                    Email
                </label>
                <Input
                    id="email"
                    placeholder="Masukkan email kamu"
                    value={value}
                    onChange={onChange}
                    className={error ? "border-destructive" : ""}
                />
            </div>
            <Button
                disabled={!value || !!error}
                className="w-full mt-4"
                size={"lg"}
                onClick={onNextClick}
            >
                Kirim
            </Button>
        </div>
    );
}
