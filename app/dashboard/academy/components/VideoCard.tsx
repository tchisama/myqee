import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Play } from "lucide-react";
import { Video } from "./types";

interface VideoCardProps {
  video: Video;
  index: number;
  courseId: string;
  isActive: boolean;
}

export function VideoCard({ video, index, courseId, isActive }: VideoCardProps) {
  return (
    <Link
      href={`/dashboard/academy/${courseId}/${video.id}`}
      className="block"
    >
      <div
        className={`rounded-lg border p-2 transition-all ${
          isActive
            ? 'border-[#3435FF] bg-[#3435FF]/5 shadow-sm'
            : video.completed
              ? 'border-green-500/30 bg-green-50/30'
              : 'hover:border-[#3435FF]/30 hover:bg-[#3435FF]/5'
        }`}
      >
        <div className="flex gap-3 group">
          {/* Thumbnail image */}
          <div className="relative h-12 w-16 flex-shrink-0 rounded-md overflow-hidden">
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center  justify-center">
              {/* {video.completed && (
                <div className="absolute top-0.5 right-0.5 bg-green-500 rounded-full p-0.5">
                  <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                </div>
              )} */}
              <Play className="h-7 w-7 p-1 bg-white/90 rounded-full duration-200 scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 text-primary " />
            </div>
          </div>

          {/* Video info */}
          <div className="flex flex-1 min-w-0">
            <div className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium mr-2 mt-0.5
              ${isActive
                ? 'bg-[#3435FF] text-white'
                : video.completed
                  ? 'bg-green-500 text-white'
                  : 'bg-[#3435FF]/10 text-[#3435FF]'
              }`}
            >
              {video.completed ? <CheckCircle2 className="h-3 w-3" /> : index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col">
                <span className={`font-medium truncate text-sm ${isActive ? 'text-[#3435FF]' : ''}`}>
                  {video.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {video.duration}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
