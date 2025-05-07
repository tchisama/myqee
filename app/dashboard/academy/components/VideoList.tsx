import Link from "next/link";
import Image from "next/image";
import { Clock, Play, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video } from "./types";

interface VideoListProps {
  videos: Video[] | number;
  courseId: string;
}

export function VideoList({ videos, courseId }: VideoListProps) {
  // If videos is a number, we can't render the list
  if (typeof videos === 'number') {
    return (
      <div className="p-6 text-center border rounded-lg bg-muted/10">
        <p className="text-muted-foreground">
          This course has {videos} videos. Please enroll to view the content.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {videos.map((video, index) => (
        <Link
          key={video.id}
          href={`/dashboard/academy/${courseId}/${video.id}`}
          className="block"
        >
          <Card className={`overflow-hidden py-0 transition-all hover:shadow-md ${video.completed ? 'border-[#3435FF55] bg-green-50/30' : ''}`}>
            <div className="flex flex-col md:flex-row">
              <div className="relative aspect-video w-full md:w-[160px]">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3435FF] shadow-lg">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
                {video.completed && (
                  <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-white" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between p-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3435FF]/10 text-xs font-medium text-[#3435FF]">
                      {index + 1}
                    </span>
                    <h3 className="font-medium text-sm">{video.title}</h3>
                    <Badge variant={video.completed ? "default" : "outline"} className={`ml-auto text-[10px] ${video.completed ? "bg-green-500" : ""}`}>
                      {video.completed ? "Completed" : "Not Started"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{video.description}</p>
                </div>
                <div className="mt-2 flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {video.duration}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
