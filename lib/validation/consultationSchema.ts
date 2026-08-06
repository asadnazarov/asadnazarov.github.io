import { z } from "zod";

export const consultationSchema = z.object({
  name: z.string().trim().min(2, "nameRequired"),
  contact: z.string().trim().min(3, "contactRequired"),
  company: z.string().trim().optional().or(z.literal("")),
  need: z.enum(["implementation", "training", "consultation", "other"], {
    message: "needRequired",
  }),
  budget: z.string().trim().min(1, "budgetRequired"),
  message: z.string().trim().min(10, "messageRequired"),
  locale: z.enum(["ru", "uz"]),
});

export type ConsultationSchema = z.infer<typeof consultationSchema>;
