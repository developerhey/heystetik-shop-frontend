import { Lock } from "lucide-react";
import { Button } from "~/components/ui/button";

export function RequireLoginMobile() {
    return (
        <main className="w-full h-[90vh] flex flex-col items-center justify-center gap-y-6 p-4">
            <Lock size={32} />
            <h1 className="text-md font-semibold text-foreground">
                Silahkan login terlebih dahulu untuk lanjut
            </h1>
            <Button>Login</Button>
        </main>
    );
}
