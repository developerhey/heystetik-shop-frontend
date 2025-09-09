import z from "zod";

const CategoryProductUISchema = z.strictObject({
    id: z.string(),
    text: z.string(),
    alt: z.string(),
    image: z.string(),
});

const CategoryProductListUISchema = z.array(CategoryProductUISchema);
export type CategoryProductListUI = z.infer<typeof CategoryProductListUISchema>;
export type CategoryProductUI = z.infer<typeof CategoryProductUISchema>;
