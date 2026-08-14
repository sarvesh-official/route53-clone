import { z } from "zod";

export const recordCreateSchema = z.object({
  name: z.string().min(1, "Record name is required"),
  type: z.enum([
    "A",
    "AAAA",
    "CNAME",
    "TXT",
    "MX",
    "NS",
    "PTR",
    "SRV",
    "CAA",
  ]),
  ttl: z.number().int().min(0, "TTL must be at least 0").max(604800, "TTL must be at most 604800 (1 week)"),
  value: z.string().min(1, "Value is required"),
  routing_policy: z.enum(["SIMPLE"]).default("SIMPLE"),
});

export const recordEditSchema = z.object({
  ttl: z
    .number()
    .int()
    .min(0, "TTL must be at least 0")
    .max(604800, "TTL must be at most 604800 (1 week)")
    .optional(),
  value: z.string().min(1, "Value is required").optional(),
});

export type RecordCreateForm = z.infer<typeof recordCreateSchema>;
export type RecordEditForm = z.infer<typeof recordEditSchema>;
