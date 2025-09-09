import z from "zod";

const ConcernUISchema = z.strictObject({
    id: z.string(),
    text: z.string(),
    segment: z.string(),
});

const ConcernsListUISchema = z.array(ConcernUISchema);
export type ConcernListUI = z.infer<typeof ConcernsListUISchema>;
export type ConcernUI = z.infer<typeof ConcernUISchema>;
