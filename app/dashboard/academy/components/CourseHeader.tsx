import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Course, Video } from "./types";

interface CourseHeaderProps {
  course: Course;
  courseId: string;
  progressPercentage: number;
  prevVideo: Video | null;
  nextVideo: Video | null;
}

export function CourseHeader({
  course,
  courseId,
  progressPercentage,
  prevVideo,
  nextVideo,
}: CourseHeaderProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full">
              <Link href={`/dashboard/academy/${courseId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-xl font-semibold">{course.title}</h2>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Progress value={progressPercentage} className="h-2 w-32" />
            <span className="text-xs text-muted-foreground">{progressPercentage}% complete</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild disabled={!prevVideo}>
            <Link
              href={prevVideo ? `/dashboard/academy/${courseId}/${prevVideo.id}` : '#'}
              className={!prevVideo ? 'pointer-events-none opacity-50' : ''}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Link>
          </Button>

          <Button variant="outline" size="sm" asChild disabled={!nextVideo}>
            <Link
              href={nextVideo ? `/dashboard/academy/${courseId}/${nextVideo.id}` : '#'}
              className={!nextVideo ? 'pointer-events-none opacity-50' : ''}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
