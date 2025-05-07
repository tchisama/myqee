import { List } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { VideoCard } from "./VideoCard";
import { Course, Video } from "./types";

interface CourseContentSidebarProps {
  course: Course;
  courseId: string;
  currentVideoId: string;
  completedVideos: number;
  totalVideos: number;
  progressPercentage: number;
}

export function CourseContentSidebar({
  course,
  courseId,
  currentVideoId,
  completedVideos,
  totalVideos,
  progressPercentage,
}: CourseContentSidebarProps) {
  // If videos is a number, we can't render the list
  if (typeof course.videos === 'number') {
    return (
      <Card className="sticky top-20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <List className="mr-2 h-5 w-5 text-[#3435FF]" />
            Course Content
          </CardTitle>
          <CardDescription className="flex items-center justify-between">
            <span>{course.videos} videos</span>
            <span className="text-xs font-medium">Enroll to view content</span>
          </CardDescription>
          <Progress value={0} className="h-1" />
        </CardHeader>
        <CardContent className="px-2 pb-6">
          <div className="space-y-3">
            {/* Placeholder videos */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-2 bg-muted/5">
                <div className="flex gap-3">
                  {/* Placeholder thumbnail */}
                  <div className="h-12 w-16 flex-shrink-0 rounded-md bg-muted/20"></div>

                  {/* Placeholder content */}
                  <div className="flex flex-1 min-w-0">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted/20 mr-2 mt-0.5"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col">
                        <div className="h-4 w-24 bg-muted/20 rounded mb-1"></div>
                        <div className="h-3 w-12 bg-muted/20 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-center text-xs text-muted-foreground mt-4">
              Please enroll in this course to access the content.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <List className="mr-2 h-5 w-5 text-[#3435FF]" />
          Course Content
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>{totalVideos} videos</span>
          <span className="text-xs font-medium">{completedVideos}/{totalVideos} completed</span>
        </CardDescription>
        <Progress value={progressPercentage} className="h-1" />
      </CardHeader>
      <CardContent className="max-h-[500px] overflow-y-auto px-2 pb-6">
        <div className="space-y-3">
          {course.videos.map((video: Video, index: number) => (
            <VideoCard
              key={video.id}
              video={video}
              index={index}
              courseId={courseId}
              isActive={video.id === currentVideoId}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
