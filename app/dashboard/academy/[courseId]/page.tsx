"use client"

import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { NotFound } from "../components/NotFound"
import { CourseHero } from "../components/CourseHero"
import { VideoList } from "../components/VideoList"
import { coursesData } from "../components/data"
import { Video } from "../components/types"

export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const router = useRouter();

  const course = coursesData["react-fundamentals"];

  if (!course) {
    return (
      <NotFound
        title="Course not found"
        message="The course you're looking for doesn't exist."
        backLink="/dashboard/academy"
        backLinkText="Back to Academy"
      />
    );
  }

  // Function to handle continue learning button click
  const handleContinueLearning = () => {
    // If videos is a number, we can't navigate to a specific video
    if (typeof course.videos === 'number') {
      return;
    }

    // Find the first incomplete video, or the first video if all are completed
    const nextVideo = course.videos.find((v: Video) => !v.completed) || course.videos[0];
    if (nextVideo) {
      router.push(`/dashboard/academy/${courseId}/${nextVideo.id}`);
    }
  };

  return (
    <div className="space-y-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/dashboard/academy">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Academy
        </Link>
      </Button>

      {/* Hero Section */}
      <CourseHero course={course} onContinue={handleContinueLearning} />

      {/* Course Content */}
      <Tabs defaultValue="content" className="w-full">
        <div className="border-b mb-4">
          <TabsList className="w-fit">
            <TabsTrigger value="content">
              Course Content
            </TabsTrigger>
            <TabsTrigger value="overview">
              Overview
            </TabsTrigger>
            <TabsTrigger value="resources">
              Resources
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="content" className="space-y-3">
          <VideoList videos={course.videos} courseId={courseId} />
        </TabsContent>

        <TabsContent value="overview" className="space-y-3">
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-3">About this course</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {course.description} This comprehensive course is designed to take you from beginner to advanced level.
                You&apos;ll learn through practical examples and real-world projects.
              </p>

              <h4 className="font-semibold mt-5 mb-2 text-sm">What you&apos;ll learn</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Fundamentals and core concepts</li>
                <li>Building interactive user interfaces</li>
                <li>State management techniques</li>
                <li>Performance optimization</li>
                <li>Best practices and design patterns</li>
              </ul>

              <h4 className="font-semibold mt-5 mb-2 text-sm">Requirements</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Basic understanding of HTML, CSS, and JavaScript</li>
                <li>A computer with a code editor installed</li>
                <li>No prior experience with {course.title.split(' ')[0]} is required</li>
              </ul>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-3">
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-3">Course Resources</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Download the resources below to enhance your learning experience.
              </p>

              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between rounded-lg border p-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Course Slides</p>
                      <p className="text-xs text-muted-foreground">PDF, 2.4 MB</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs">Download</Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Source Code</p>
                      <p className="text-xs text-muted-foreground">ZIP, 1.8 MB</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs">Download</Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Cheat Sheet</p>
                      <p className="text-xs text-muted-foreground">PDF, 0.5 MB</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs">Download</Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
