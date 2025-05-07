import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Course, Video } from "./types";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  // Helper function to get video count
  const getVideoCount = () => {
    if (typeof course.videos === 'number') {
      return course.videos;
    }
    return course.videos.length;
  };

  // Helper function to get progress
  const getProgress = () => {
    if (course.progress !== undefined) {
      return course.progress;
    }

    if (Array.isArray(course.videos)) {
      const completed = course.videos.filter((v: Video) => v.completed).length;
      const total = course.videos.length;
      return Math.round((completed / total) * 100);
    }

    return 0;
  };

  return (
    <Link href={`/dashboard/academy/${course.id}`} className="block">
      <Card className="overflow-hidden py-0 transition-all hover:shadow-md">
        <div className="relative aspect-video w-full">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
          />
          {course.level && (
            <div className="absolute top-2 right-2">
              <Badge variant="default" className="text-xs">{course.level}</Badge>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-semibold text-white">{course.title}</h3>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {course.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <BookOpen className="mr-1 h-4 w-4" />
              <span>{getVideoCount()} videos</span>
            </div>
            {course.duration && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                <span>{course.duration}</span>
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs font-medium">
              {getProgress()}% complete
            </div>
            {course.category && (
              <Badge variant="outline" className="text-xs">{course.category}</Badge>
            )}
          </div>
          <Progress value={getProgress()} className="mt-2 h-1" />
        </CardContent>
      </Card>
    </Link>
  );
}
