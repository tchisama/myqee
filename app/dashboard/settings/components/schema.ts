import * as z from "zod"

// Define the form schema with Zod
export const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  template: z.string(),
  primaryColor: z.string(),
  showOrderLineImages: z.boolean().optional().default(false),
});

export type SettingsFormValues = z.infer<typeof formSchema>;
