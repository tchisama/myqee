import * as z from "zod"

// Define the form schema with Zod
export const signupSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  // We'll handle the logo separately as it's a file
  cardNumber: z.string().min(16, {
    message: "Please enter a valid card number.",
  }),
  cardExpiry: z.string().min(5, {
    message: "Please enter a valid expiry date (MM/YY).",
  }),
  cardCvc: z.string().min(3, {
    message: "Please enter a valid CVC code.",
  }),
  cardName: z.string().min(2, {
    message: "Please enter the name on your card.",
  }),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
export type FormFieldName = keyof SignupFormValues;
