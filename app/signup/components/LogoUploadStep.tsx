"use client"

import { motion } from "framer-motion"
import { Building2, Upload } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface LogoUploadStepProps {
  logoPreview: string | null
  setLogoPreview: (logo: string | null) => void
}

export function LogoUploadStep({ logoPreview, setLogoPreview }: LogoUploadStepProps) {
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
          description: "Your logo has been uploaded successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      key="step2-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-2"
    >
      <div className="flex flex-col sm:flex-row items-start gap-3">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-shrink-0 h-32 w-32 bg-muted/20 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/20 hover:border-primary/30 transition-colors"
        >
          {logoPreview ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={logoPreview}
                alt="Company Logo"
                width={120}
                height={120}
                className="p-2 aspect-square object-contain"
              />
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Building2 className="h-6 w-6 mb-1" />
              <span className="text-xs">No logo</span>
            </div>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full sm:w-auto space-y-2"
        >
          <div className="relative w-full sm:w-48">
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-10 h-full w-full"
              style={{ cursor: 'pointer' }}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 h-9 border-dashed hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all pointer-events-none"
            >
              <Upload className="h-4 w-4" />
              Upload Logo
            </Button>
          </div>
          <div className="bg-muted/30 p-2 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Logo requirements:</span>
              300x200px, max 2MB (PNG, JPG, SVG)
            </p>
          </div>
        </motion.div>
      </div>
      <p className="text-xs text-slate-500 italic">
        Optional: You can add or change your logo later.
      </p>
    </motion.div>
  )
}

export function LogoUploadStepHeader() {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2"
    >
      <Upload className="h-5 w-5 text-primary" />
      Upload Logo
    </motion.div>
  )
}

export function LogoUploadStepDescription() {
  return (
    <motion.span
      key="desc2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      Upload your company logo (optional)
    </motion.span>
  )
}
