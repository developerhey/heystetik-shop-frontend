import { X } from "lucide-react";
import { useDialogStore } from "~/shared/stores/useDialogStore";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Link } from "react-router";

export default function ProfileSidebar() {
    const { isOpenProfile, setOpenProfile } = useDialogStore();

    return (
        <>
            {/* Overlay */}
            {isOpenProfile && (
                <div
                    className="fixed inset-0 bg-black/30 z-999"
                    onClick={() => setOpenProfile(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-999 transform transition-transform duration-300 
        ${isOpenProfile ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <Link
                        to={"/user"}
                        className="flex flex-row cursor-pointer hover:bg-gray-100 gap-x-2 items-center"
                    >
                        <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm">Test</span>
                            <span className="text-xs text-muted-foreground">
                                +628980123
                            </span>
                        </div>
                    </Link>
                    <button
                        className="cursor-pointer"
                        onClick={() => setOpenProfile(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex flex-col overflow-y-auto h-[calc(100%-64px)]">
                    <Link
                        to={"/user/address"}
                        className="text-sm px-4 py-2 cursor-pointer hover:bg-gray-100 text-foreground"
                    >
                        Daftar Alamat
                    </Link>
                    <Link
                        to={"/user/transaction-history"}
                        className="text-sm px-4 py-2 cursor-pointer hover:bg-gray-100 text-foreground"
                    >
                        Riwayat Transaksi
                    </Link>
                    <hr />
                    <div className="text-sm px-4 py-2 cursor-pointer hover:bg-gray-100 text-foreground">
                        Keluar
                    </div>
                </div>
            </div>
        </>
    );
}
