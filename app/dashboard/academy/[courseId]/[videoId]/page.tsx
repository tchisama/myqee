"use client"

import { useParams } from "next/navigation"

import { NotFound } from "../../components/NotFound"
import { CourseHeader } from "../../components/CourseHeader"
import { VideoPlayer } from "../../components/VideoPlayer"
import { CourseContentSidebar } from "../../components/CourseContentSidebar"
import { coursesData } from "../../components/data"
import { Video } from "../../components/types"

export default function VideoPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const videoId = params.videoId as string

  const course = coursesData["react-fundamentals"]

  if (!course) {
    return (
      <NotFound
        title="Course not found"
        message="The course you're looking for doesn't exist."
        backLink="/dashboard/academy"
        backLinkText="Back to Academy"
      />
    )
  }

  // If videos is a number, we can't display the video
  if (typeof course.videos === 'number') {
    return (
      <NotFound
        title="Video not available"
        message="Please enroll in this course to access the videos."
        backLink={`/dashboard/academy/${courseId}`}
        backLinkText="Back to Course"
      />
    )
  }

  const videoIndex = course.videos.findIndex((v: Video) => v.id === videoId)

  if (videoIndex === -1) {
    return (
      <NotFound
        title="Video not found"
        message="The video you're looking for doesn't exist."
        backLink={`/dashboard/academy/${courseId}`}
        backLinkText="Back to Course"
      />
    )
  }

  const video = course.videos[videoIndex]
  const prevVideo = videoIndex > 0 ? course.videos[videoIndex - 1] : null
  const nextVideo = videoIndex < course.videos.length - 1 ? course.videos[videoIndex + 1] : null

  // Calculate progress
  const completedVideos = course.videos.filter((v: Video) => v.completed).length
  const totalVideos = course.videos.length
  const progressPercentage = Math.round((completedVideos / totalVideos) * 100)

  return (
    <div className="space-y-8">
      <CourseHeader
        course={course}
        courseId={courseId}
        progressPercentage={progressPercentage}
        prevVideo={prevVideo}
        nextVideo={nextVideo}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <VideoPlayer video={video} />
        </div>

        <div>
          <CourseContentSidebar
            course={course}
            courseId={courseId}
            currentVideoId={videoId}
            completedVideos={completedVideos}
            totalVideos={totalVideos}
            progressPercentage={progressPercentage}
          />
        </div>
      </div>
    </div>
  )
}
