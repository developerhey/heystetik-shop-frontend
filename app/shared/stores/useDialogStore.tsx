import { create } from "zustand"

interface DialogState {
    isOpenLogin: boolean,
    setOpenLogin: (open: boolean) => void
}

export const useDialogStore = create<DialogState>((set, get) => ({
    isOpenLogin: false,
    setOpenLogin: (open) => set({ isOpenLogin: open }),
}))
