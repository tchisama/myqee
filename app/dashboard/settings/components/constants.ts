import { LayoutTemplate, FileText, Rocket } from "lucide-react"

// Available templates
export const templates = [
  { id: "modern", name: "Modern", icon: LayoutTemplate, description: "Clean and modern design with colored headers and footers" },
  { id: "classic", name: "Classic", icon: FileText, description: "Traditional invoice layout with detailed sections and borders" },
  // { id: "minimal", name: "Minimal", icon: Minimize, description: "Simplified design with essential elements and minimal styling" },
  { id: "space", name: "Space", icon: Rocket, description: "Futuristic space-themed design with starry background and modern layout" },
];

// Predefined color options
export const colorOptions = [
  { id: "#3435FF", name: "Blue" },
  { id: "#10B981", name: "Green" },
  { id: "#F43F5E", name: "Red" },
  { id: "#8B5CF6", name: "Purple" },
  { id: "#F59E0B", name: "Orange" },
  { id: "#06B6D4", name: "Cyan" },
  { id: "#EC4899", name: "Pink" },
  { id: "#111827", name: "Dark" },
];
