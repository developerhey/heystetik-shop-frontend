import z from "zod";

const ProductImageUISchema = z.strictObject({
    path: z.string(),
});

const ProductUISchema = z.strictObject({
    id: z.int().nonnegative(),
    cartId: z.int().nonnegative(),
    wishlishId: z.int().nonnegative(),
    brand: z.string(),
    title: z.string(),
    description: z.string(),
    formattedPrice: z.string(),
    formattedPriceWithDiscount: z.string(),
    totalFormattedPrice: z.string(),
    price: z.number().int().nonnegative(),
    discountedPrice: z.number().int().nonnegative(),
    images: z.array(ProductImageUISchema),
    type: z.string(),
    howTo: z.string(),
    ingredients: z.string(),
    display: z.string(),
    category: z.string(),
    texture: z.string(),
    sachet: z.string(),
    bpom: z.string(),
    stock: z.number().int().nonnegative(),
    minOrder: z.number().int().nonnegative(),
    qty: z.number().int().nonnegative(),
    notes: z.string(),
    needConsult: z.boolean(),
});

const ProductListUISchema = z.array(ProductUISchema);
export type ProductListUI = z.infer<typeof ProductListUISchema>;
export type ProductUI = z.infer<typeof ProductUISchema>;
