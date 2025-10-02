import { DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { type Value } from "react-phone-number-input";
import { PhoneInput } from "~/components/ui/phone-input";
import { ArrowLeft } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";
export function RegisterStepPhone({
    onBackClick,
    value,
    error,
    onChange,
    onNextClick,
    loading,
}: {
    onBackClick: () => void;
    value: string;
    error?: string;
    onChange: (e: string) => void;
    onNextClick: () => void;
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
                <DialogHeader className="mb-6 gap-0">
                    <DialogTitle className="text-2xl font-semibold text-center">
                        Daftar
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm font-medium">
                        Jadilah bagian dari heystetik sekarang!
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full space-y-2">
                    <label htmlFor="login" className="text-sm font-medium">
                        Nomor HP
                    </label>
                    <PhoneInput
                        international={true}
                        defaultCountry="ID"
                        id="phone_number"
                        placeholder="8xxxxxxxxxx"
                        value={value}
                        onChange={(value: Value) => onChange(value.toString())}
                        className={error ? "border-destructive" : ""}
                    />
                </div>
                <Button
                    disabled={!value || !!error}
                    className="w-full mt-4"
                    size={"lg"}
                    onClick={onNextClick}
                >
                    Selanjutnya
                </Button>
            </div>
        </div>
    );
}
