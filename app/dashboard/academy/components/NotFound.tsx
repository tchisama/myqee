import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NotFoundProps {
  title: string;
  message: string;
  backLink: string;
  backLinkText: string;
}

export function NotFound({ title, message, backLink, backLinkText }: NotFoundProps) {
  return (
    <div className="flex h-[400px] w-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{message}</p>
        <Button asChild className="mt-4">
          <Link href={backLink}>{backLinkText}</Link>
        </Button>
      </div>
    </div>
  );
}
