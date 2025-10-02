import { DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function RegisterStepEmail({
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
                <DialogTitle className="flex flex-col items-center mt-2 pb-6">
                    Lengkapi Email
                </DialogTitle>
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
                {/* {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )} */}
            </div>
            <Button
                // disabled={!value || !!error}
                className="w-full mt-4"
                size={"lg"}
                onClick={onNextClick}
            >
                Selanjutnya
            </Button>
        </div>
    );
}
