import Image from "next/image";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Course, Video } from "./types";

interface CourseHeroProps {
  course: Course;
  onContinue: () => void;
}

export function CourseHero({ course, onContinue }: CourseHeroProps) {
  // Helper function to get video stats
  const getVideoStats = () => {
    if (typeof course.videos === 'number') {
      return { completed: 0, total: course.videos };
    }

    const completed = course.videos.filter((v: Video) => v.completed).length;
    const total = course.videos.length;
    return { completed, total };
  };

  const { completed: completedVideos, total: totalVideos } = getVideoStats();

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="relative aspect-[3/1] md:aspect-[5/1] w-full overflow-hidden bg-[#3435FF]">
        <div className="absolute inset-0 z-10"></div>
        <Image
          src={course.image}
          alt={course.title}
          width={1200}
          height={400}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {course.level && (
                <Badge variant="default" className="text-xs">{course.level}</Badge>
              )}
              {course.category && (
                <Badge variant="secondary" className="text-xs">{course.category}</Badge>
              )}
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {course.totalDuration || `${Math.round(course.videos.reduce((acc, video) => {
                  const [min, sec] = video.duration.split(':').map(Number);
                  return acc + min + sec / 60;
                }, 0))}h`}
              </Badge>
            </div>

            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-sm text-muted-foreground">{course.description}</p>
          </div>

          <div className="rounded-lg border bg-card p-3 shadow-sm w-full md:w-56">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Course Progress</p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>{course.progress}% complete</span>
                    <span>{completedVideos}/{totalVideos} videos</span>
                  </div>
                  <Progress value={course.progress} className="h-1.5" />
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full" size="sm" onClick={onContinue}>
                  Continue Learning
                </Button>
                {course.lastUpdated && (
                  <p className="text-center text-xs text-muted-foreground">
                    Last updated: {course.lastUpdated}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
