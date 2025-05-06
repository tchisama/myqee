import { FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ModernTemplate } from "./ModernTemplate"
import { ClassicTemplate } from "./ClassicTemplate"
import { MinimalTemplate } from "./MinimalTemplate"
import { SpaceTemplate } from "./SpaceTemplate"

interface TemplatePreviewProps {
  companyName: string;
  logo: string | null;
  primaryColor: string;
  template: string;
  showOrderLineImages: boolean;
}

export function TemplatePreview({
  companyName,
  logo,
  primaryColor,
  template,
  showOrderLineImages,
}: TemplatePreviewProps) {
  return (
    <div className="rounded-xl border shadow-md overflow-hidden min-h-[600px] flex flex-col bg-white">
      <div className="p-4 border-b bg-card flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-sm">Template Preview</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-medium border-primary/20 text-primary bg-primary/5">
            {template.charAt(0).toUpperCase() + template.slice(1)} Template
          </Badge>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto bg-foreground/5 relative">
        {/* Decorative elements */}
        <div className="absolute top-2 right-2 h-24 w-24 rounded-full bg-primary/5 blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-2 left-2 h-16 w-16 rounded-full bg-primary/5 blur-xl pointer-events-none"></div>

        {/* Template content */}
        <div className="relative z-10 ">
          {template === "modern" && (
            <ModernTemplate
              companyName={companyName}
              logo={logo}
              primaryColor={primaryColor}
              showOrderLineImages={showOrderLineImages}
            />
          )}

          {template === "classic" && (
            <ClassicTemplate
              companyName={companyName}
              logo={logo}
              primaryColor={primaryColor}
              showOrderLineImages={showOrderLineImages}
            />
          )}

          {template === "minimal" && (
            <MinimalTemplate
              companyName={companyName}
              logo={logo}
              primaryColor={primaryColor}
              showOrderLineImages={showOrderLineImages}
            />
          )}

          {template === "space" && (
            <SpaceTemplate
              companyName={companyName}
              logo={logo}
              primaryColor={primaryColor}
              showOrderLineImages={showOrderLineImages}
            />
          )}
        </div>
      </div>
    </div>
  );
}
