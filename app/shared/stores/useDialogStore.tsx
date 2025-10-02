import { create } from "zustand";

interface DialogState {
    isOpenLogin: boolean;
    isOpenWishlist: boolean;
    isOpenProfile: boolean;
    isOpenAddressDialog: boolean;
    setOpenLogin: (open: boolean) => void;
    setOpenWishlist: (open: boolean) => void;
    setOpenProfile: (open: boolean) => void;
    setOpenAddressDialog: (open: boolean) => void;
}

export const useDialogStore = create<DialogState>((set, get) => ({
    isOpenLogin: false,
    setOpenLogin: (open) => set({ isOpenLogin: open }),
    isOpenWishlist: false,
    isOpenProfile: false,
    setOpenWishlist: (open) => set({ isOpenWishlist: open }),
    setOpenProfile: (open) => set({ isOpenProfile: open }),
    setOpenAddressDialog: (open) => set({ isOpenAddressDialog: open }),
    isOpenAddressDialog: false,
}));
