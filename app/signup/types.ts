import * as z from "zod"

// Define the form schema with Zod
export const signupSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  // We'll handle the logo separately as it's a file
  // No credit card fields as we're using CMI payment button
});

export type SignupFormValues = z.infer<typeof signupSchema>;
export type FormFieldName = keyof SignupFormValues;
