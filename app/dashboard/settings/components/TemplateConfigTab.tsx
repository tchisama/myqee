"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Layout, LayoutTemplate, Palette, Save, Loader2, Check, Image } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"

import { formSchema, SettingsFormValues } from "./schema"
import { templates, colorOptions } from "./constants"
import { TemplatePreview } from "./templates/TemplatePreview"

interface TemplateConfigTabProps {
  defaultValues: {
    companyName: string;
    template: string;
    primaryColor: string;
    logo: string | null;
    showOrderLineImages: boolean;
  };
  onSubmit: (values: SettingsFormValues) => void;
  isSaving: boolean;
}

export function TemplateConfigTab({ defaultValues, onSubmit, isSaving }: TemplateConfigTabProps) {
  // Initialize form with default values
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: defaultValues.companyName,
      template: defaultValues.template,
      primaryColor: defaultValues.primaryColor,
      showOrderLineImages: defaultValues.showOrderLineImages,
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Settings Panel - Takes 3/5 of the space on large screens */}
      <div className="lg:col-span-3">
        <Card className="border shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="bg-card border-b">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-primary/10">
                <Layout className="h-5 w-5 text-primary" />
              </div>
              Template Configuration
            </CardTitle>
            <CardDescription>
              Customize the appearance of your invoices and documents to match your brand identity.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="template"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium flex items-center gap-2">
                        <LayoutTemplate className="h-4 w-4 text-primary" />
                        Invoice Template
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          {templates.map((template) => {
                            const isSelected = field.value === template.id;
                            const Icon = template.icon;

                            return (
                              <div
                                key={template.id}
                                className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all hover:border-primary hover:shadow-md ${
                                  isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-muted"
                                }`}
                                onClick={() => {
                                  field.onChange(template.id);
                                }}
                              >
                                {isSelected && (
                                  <div className="absolute right-3 top-3 h-6 w-6 text-primary bg-white rounded-full shadow-sm flex items-center justify-center">
                                    <Check className="h-4 w-4" />
                                  </div>
                                )}
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                                  <Icon className="h-7 w-7 text-primary" />
                                </div>
                                <div className="font-medium text-base">{template.name}</div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                  {template.description}
                                </div>

                                {/* Template mini preview */}
                                <div className="mt-4 h-28 w-full overflow-hidden rounded-lg border bg-white p-2 shadow-sm">
                                  {template.id === "modern" && (
                                    <div className="h-full w-full">
                                      <div className="h-1/3 w-full rounded-t" style={{ backgroundColor: form.watch("primaryColor") }}></div>
                                      <div className="flex h-1/3 justify-between px-1 py-1">
                                        <div className="h-2 w-1/3 rounded bg-gray-200"></div>
                                        <div className="h-2 w-1/4 rounded bg-gray-200"></div>
                                      </div>
                                      <div className="h-1/3 w-full rounded-b" style={{ backgroundColor: form.watch("primaryColor") }}></div>
                                    </div>
                                  )}

                                  {template.id === "classic" && (
                                    <div className="h-full w-full">
                                      <div className="mb-1 h-1/4 w-full rounded bg-gray-100"></div>
                                      <div className="mb-1 flex justify-between">
                                        <div className="h-2 w-1/3 rounded bg-gray-200"></div>
                                        <div className="h-2 w-1/4 rounded bg-gray-200"></div>
                                      </div>
                                      <div className="mb-1 flex justify-between border-b border-t py-1">
                                        <div className="h-2 w-1/5 rounded bg-gray-200"></div>
                                        <div className="h-2 w-1/5 rounded bg-gray-200"></div>
                                        <div className="h-2 w-1/5 rounded bg-gray-200"></div>
                                      </div>
                                      <div className="flex justify-end">
                                        <div className="h-2 w-1/4 rounded" style={{ backgroundColor: form.watch("primaryColor") }}></div>
                                      </div>
                                    </div>
                                  )}

                                  {template.id === "minimal" && (
                                    <div className="h-full w-full">
                                      <div className="mb-2 flex items-center justify-between">
                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: form.watch("primaryColor") }}></div>
                                        <div className="h-2 w-1/3 rounded bg-gray-200"></div>
                                      </div>
                                      <div className="mb-2 h-px w-full bg-gray-200"></div>
                                      <div className="mb-1 flex justify-between">
                                        <div className="h-2 w-2/3 rounded bg-gray-200"></div>
                                        <div className="h-2 w-1/5 rounded bg-gray-200"></div>
                                      </div>
                                      <div className="mb-1 flex justify-between">
                                        <div className="h-2 w-1/2 rounded bg-gray-200"></div>
                                        <div className="h-2 w-1/5 rounded" style={{ backgroundColor: form.watch("primaryColor") }}></div>
                                      </div>
                                    </div>
                                  )}

                                  {template.id === "space" && (
                                    <div className="h-full w-full">
                                      <div className="h-1/3 w-full rounded-t bg-black relative overflow-hidden">
                                        <div className="absolute h-1 w-1 rounded-full bg-white top-1 left-2"></div>
                                        <div className="absolute h-1 w-1 rounded-full bg-white top-3 right-4"></div>
                                        <div className="h-2 w-1/4 rounded bg-white/20 absolute bottom-1 left-1"></div>
                                      </div>
                                      <div className="h-1/3 bg-white p-1">
                                        <div className="flex justify-between">
                                          <div className="h-2 w-1/3 rounded bg-gray-200"></div>
                                          <div className="h-2 w-1/4 rounded bg-gray-200"></div>
                                        </div>
                                      </div>
                                      <div className="h-1/3 w-full rounded-b bg-black"></div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        Choose a template style for your invoices and documents. Each template has a unique layout and design.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control }
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium flex items-center gap-2">
                        <Palette className="h-4 w-4 text-primary" />
                        Brand Color
                      </FormLabel>
                      <div className="grid max-w-[500px] grid-cols-4 gap-3">
                        {colorOptions.map((color) => (
                          <div
                            key={color.id}
                            className={`h-14 w-full rounded-lg border cursor-pointer transition-all flex flex-col items-center justify-center  ${
                              field.value === color.id
                                ? 'ring-2 ring-primary ring-offset-2 shadow-md scale-105'
                                : 'hover:scale-105 hover:shadow-sm'
                            }`}
                            style={{ backgroundColor: color.id }}
                            onClick={() => {
                              field.onChange(color.id);
                            }}
                          >
                            {field.value === color.id && (
                              <div className="h-5 w-5 rounded-full bg-white/30 flex items-center justify-center">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            )}
                            <span className="text-[10px] font-medium text-white/90 mt-1">{color.name}</span>
                          </div>
                        ))}
                      </div>
                      <FormDescription className="text-xs">
                        Choose a primary color that will be used throughout your invoices and documents to match your brand identity.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="showOrderLineImages"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium flex items-center gap-2">
                          <Image className="h-4 w-4 text-primary" aria-hidden="true" />
                          Show Order Line Images
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Display product images in the invoice line items.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

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
      </div>

      {/* Preview Panel - Takes 2/5 of the space on large screens */}
      <div className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-1 rounded-xl shadow-sm">
          <TemplatePreview
            companyName={defaultValues.companyName}
            logo={defaultValues.logo}
            primaryColor={form.watch("primaryColor")}
            template={form.watch("template")}
            showOrderLineImages={form.watch("showOrderLineImages")}
          />
        </div>
        <div className="mt-3 text-center">
          <p className="text-xs text-muted-foreground">
            This is a preview of how your {form.watch("template")} template will look with your current settings.
          </p>
        </div>
      </div>
    </div>
  );
}
