import { z } from "zod";

export const MetaSchema = z.object({
    page: z.number().int().nonnegative().nullish(),
    take: z.number().int().nonnegative().nullish(),
    itemCount: z.number().int().nonnegative().nullish(),
    pageCount: z.number().int().nonnegative().nullish(),
    hasPreviousPage: z.boolean().nullish(),
    hasNextPage: z.boolean().nullish(),
});

export const DataSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        data: dataSchema.nullish(),
        meta: MetaSchema.nullish(),
    });

export const BaseResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        status: z.number().nullish(),
        message: z.string().nullish(),
        data: DataSchema(dataSchema).nullish(),
    });

export const BaseResponseDataSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        status: z.number().nullish(),
        message: z.string().nullish(),
        data: dataSchema.nullish(),
    });
