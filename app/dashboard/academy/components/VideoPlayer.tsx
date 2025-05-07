import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResourcesList } from "./ResourcesList";
import { Video } from "./types";

interface VideoPlayerProps {
  video: Video;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  return (
    <Card className="overflow-hidden pt-0">
      <div className="aspect-video w-full overflow-hidden bg-black">
        <iframe
          src={video.videoUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{video.title}</CardTitle>
          <Badge variant={video.completed ? "default" : "outline"} className={video.completed ? "bg-green-500" : ""}>
            {video.completed ? "Completed" : "Not Completed"}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          {video.duration}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{video.description}</p>
        <ResourcesList resources={video.resources} />
      </CardContent>
    </Card>
  );
}
