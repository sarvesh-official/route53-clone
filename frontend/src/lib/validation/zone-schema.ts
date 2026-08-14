import { z } from "zod";

const DOMAIN_REGEX = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\.?$/;

export const zoneCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Domain name is required")
    .regex(DOMAIN_REGEX, "Enter a valid domain name (e.g. example.com.)"),
  type: z.enum(["PUBLIC", "PRIVATE"]),
  comment: z.string().max(256, "Comment must be at most 256 characters").optional(),
});

export const zoneEditSchema = z.object({
  comment: z
    .string()
    .max(256, "Comment must be at most 256 characters")
    .optional(),
});

export type ZoneCreateForm = z.infer<typeof zoneCreateSchema>;
export type ZoneEditForm = z.infer<typeof zoneEditSchema>;
