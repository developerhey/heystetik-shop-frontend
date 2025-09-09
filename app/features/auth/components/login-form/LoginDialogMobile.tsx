import { Dialog, DialogContent } from "~/components/ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";
import { useDialogStore } from "~/shared/stores/useDialogStore";
import { useLogin } from "./useLogin";
import { set } from "zod";
export default function LoginDialogMobile() {
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
    } = useLogin();
    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => console.log(tokenResponse),
    });

    return (
        <Dialog open={isOpenLogin} onOpenChange={setOpenLogin}>
            {/* <DialogContent className="max-w-[90%] rounded-xl p-0 overflow-hidden">
                <div className="relative p-6">
                    <h2 className="text-xl font-semibold mb-6">Masuk</h2>

                    <div className="space-y-2" >
                        <label htmlFor="login" className="text-sm font-medium">Nomor HP atau Email</label>
                        <Input
                            id="login"
                            placeholder="08xxxxxxxxxx / email"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                    </div>

                    <Button disabled={!value} className="w-full mt-4" size={"lg"}>Selanjutnya</Button>

                    <div className="flex items-center my-4" >
                        <div className="flex-1 border-t" />
                        <span className="px-2 text-xs text-muted-foreground">atau masuk dengan</span>
                        <div className="flex-1 border-t" />
                    </div>
                    <Button variant={"outline"} size="lg" className="w-full" onClick={() => {
                        login()
                    }}>
                        <img src="/icons/google.svg" loading="lazy" className="size-4" />
                        Google
                    </Button>
                </div>
            </DialogContent> */}
        </Dialog>
    );
}
