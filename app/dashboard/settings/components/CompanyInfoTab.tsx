"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, Save, Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { formSchema, SettingsFormValues } from "./schema"

interface CompanyInfoTabProps {
  defaultValues: {
    companyName: string;
    logo: string | null;
  };
  onSubmit: (values: SettingsFormValues) => void;
  isSaving: boolean;
}

export function CompanyInfoTab({ defaultValues, onSubmit, isSaving }: CompanyInfoTabProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(defaultValues.logo);

  // Initialize form with default values
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: defaultValues.companyName,
      template: "modern", // This will be overwritten by the parent component
      primaryColor: "#3435FF", // This will be overwritten by the parent component
    },
  });

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Please upload an image smaller than 2MB.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
        toast.success("Logo uploaded", {
          description: "Your logo has been updated. Don't forget to save your changes.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="border shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="bg-card border-b">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          Company Information
        </CardTitle>
        <CardDescription>
          Update your company details and branding to personalize your experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-base font-medium">Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your company name"
                      {...field}
                      className="h-11 px-4 transition-all focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    This will be displayed throughout your dashboard and on all your documents.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3 pt-2">
              <FormLabel className="text-base font-medium">Company Logo</FormLabel>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="flex-shrink-0 h-48 w-48 bg-muted/20 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/20 hover:border-primary/30 transition-colors">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Company Logo"
                      width={180}
                      height={180}
                      className="p-3 aspect-square object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Building2 className="h-10 w-10 mb-2" />
                      <span className="text-sm">No logo uploaded</span>
                    </div>
                  )}
                </div>
                <div className="w-full sm:w-auto space-y-4">
                  <div className="relative w-full sm:w-48">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <Button
                      variant="outline"
                      className="w-full gap-2 h-11 border-dashed hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </Button>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium block mb-1">Logo requirements:</span>
                      • Recommended size: 300x200px<br />
                      • Max file size: 2MB<br />
                      • Supported formats: PNG, JPG, SVG
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="gap-2 h-11 px-6 transition-all hover:bg-primary/90 shadow-sm hover:shadow-md"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
