"use client"

import { useState  } from "react"
import { Building2, Palette } from "lucide-react"
import { toast } from "sonner"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { CompanyInfoTab } from "./CompanyInfoTab"
import { TemplateConfigTab } from "./TemplateConfigTab"
import { SettingsFormValues } from "./schema"

export function SettingsForm() {
  const [logoPreview, ] = useState<string | null>("/qee-nano.png");
  const [primaryColor, setPrimaryColor] = useState("#3435FF");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("company");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [companyName, setCompanyName] = useState("QEE");
  const [showOrderLineImages, setShowOrderLineImages] = useState(false);

  // Handle form submission
  function onSubmit(values: SettingsFormValues) {
    setIsSaving(true);

    // Update state with form values
    if (values.companyName) setCompanyName(values.companyName);
    if (values.template) setSelectedTemplate(values.template);
    if (values.primaryColor) setPrimaryColor(values.primaryColor);
    if (values.showOrderLineImages !== undefined) setShowOrderLineImages(values.showOrderLineImages);

    // Simulate API call
    setTimeout(() => {
      console.log(values);
      // Here you would typically save the settings to your backend
      setIsSaving(false);
      toast.success("Settings saved successfully!", {
        description: "Your changes have been applied.",
        action: {
          label: "Dismiss",
          onClick: () => console.log("Dismissed"),
        },
      });
    }, 1000);
  }

  return (
    <div className="pb-8">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-muted p-1 mb-8 text-muted-foreground shadow-sm">
          <TabsTrigger
            value="company"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-5 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2"
          >
            <Building2 className="h-4 w-4" />
            Company Information
          </TabsTrigger>
          <TabsTrigger
            value="template"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-5 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2"
          >
            <Palette className="h-4 w-4" />
            Report Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6 animate-in fade-in-50 duration-300">
          <CompanyInfoTab
            defaultValues={{
              companyName,
              logo: logoPreview
            }}
            onSubmit={onSubmit}
            isSaving={isSaving}
          />
        </TabsContent>

        <TabsContent value="template" className="space-y-6 animate-in fade-in-50 duration-300">
          <TemplateConfigTab
            defaultValues={{
              companyName,
              template: selectedTemplate,
              primaryColor,
              logo: logoPreview,
              showOrderLineImages
            }}
            onSubmit={onSubmit}
            isSaving={isSaving}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
