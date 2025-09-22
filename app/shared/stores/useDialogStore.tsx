import { create } from "zustand";

interface DialogState {
    isOpenLogin: boolean;
    isOpenWishlist: boolean;
    setOpenLogin: (open: boolean) => void;
    setOpenWishlist: (open: boolean) => void;
}

export const useDialogStore = create<DialogState>((set, get) => ({
    isOpenLogin: false,
    setOpenLogin: (open) => set({ isOpenLogin: open }),
    isOpenWishlist: false,
    setOpenWishlist: (open) => set({ isOpenWishlist: open }),
}));
