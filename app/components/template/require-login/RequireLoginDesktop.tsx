import { Lock } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useDialogStore } from "~/shared/stores/useDialogStore";
export function RequireLoginDesktop() {
    const { setOpenLogin } = useDialogStore();
    return (
        <main className="w-full h-[90vh] flex flex-col items-center justify-center gap-y-6 p-9">
            <Lock size={32} />
            <h1 className="text-lg font-semibold text-foreground">
                Silahkan login terlebih dahulu untuk lanjut
            </h1>
            <Button
                onClick={() => {
                    setOpenLogin(true);
                }}
            >
                Login
            </Button>
        </main>
    );
}
