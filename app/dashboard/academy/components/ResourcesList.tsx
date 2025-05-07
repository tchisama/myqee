import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Resource } from "./types";

interface ResourcesListProps {
  resources: Resource[];
}

export function ResourcesList({ resources }: ResourcesListProps) {
  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="mb-3 font-medium">Resources</h3>
      <div className="space-y-2">
        {resources.map((resource, i) => (
          <Button key={i} variant="outline" size="sm" asChild className="w-full justify-start">
            <Link href={resource.url} className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              <span>{resource.name}</span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
