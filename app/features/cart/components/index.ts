export * from "./CartDesktop";
export * from "./CartMobile";

import { type ProductUI } from "~/shared/schemas/product-ui-schema";
export interface CartProps {
    onDelete: () => void;
    onIncrement: () => void;
    onDecrement: () => void;
    onUpdateNotes: (text: string) => void;
    notes: string;
    qty: number;
    cart: ProductUI;
}
