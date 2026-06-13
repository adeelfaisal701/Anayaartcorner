import { z } from "zod";

export const portraitRequestSchema = z.object({
  clientName: z.string().min(2, "Name must be at least 2 characters"),
  clientEmail: z.email("Please enter a valid email address"),
  description: z.string().min(10, "Please provide more detail about your portrait"),
  referenceUrl: z.url("Please enter a valid URL").optional().or(z.literal("")),
});

export type PortraitRequestInput = z.infer<typeof portraitRequestSchema>;
