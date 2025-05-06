"use client"

import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Clock,
  Play,
  BookOpen,
  CheckCircle2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// Sample courses data
const coursesData = {
  "react-fundamentals": {
    id: "react-fundamentals",
    title: "React Fundamentals",
    description: "Learn the basics of React including components, props, and state management.",
    image: "https://placehold.co/1200x600/3435FF/FFFFFF/png?text=React+Fundamentals",
    level: "Beginner",
    category: "Frontend",
    instructor: {
      name: "Sarah Johnson",
      avatar: "https://placehold.co/200x200/3435FF/FFFFFF/png?text=SJ",
      title: "Senior React Developer"
    },
    totalDuration: "4h 30m",
    lastUpdated: "March 2023",
    progress: 35,
    videos: [
      {
        id: "introduction",
        title: "Introduction to React",
        description: "An overview of React and its core concepts.",
        duration: "12:30",
        completed: true,
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Intro+to+React",
      },
      {
        id: "components",
        title: "Components and Props",
        description: "Understanding React components and how to pass data with props.",
        duration: "18:45",
        completed: true,
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Components",
      },
      {
        id: "state",
        title: "State and Lifecycle",
        description: "Managing state and component lifecycle methods.",
        duration: "22:15",
        completed: true,
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=State",
      },
      {
        id: "hooks",
        title: "Introduction to Hooks",
        description: "Using useState, useEffect, and other built-in hooks.",
        duration: "25:10",
        completed: false,
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Hooks",
      },
      {
        id: "forms",
        title: "Forms and Controlled Components",
        description: "Working with forms and controlled components in React.",
        duration: "20:30",
        completed: false,
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Forms",
      },
    ],
  },
  "nextjs-masterclass": {
    id: "nextjs-masterclass",
    title: "Next.js Masterclass",
    description: "Master Next.js with server components, routing, and data fetching strategies.",
    image: "https://placehold.co/1200x600/3435FF/FFFFFF/png?text=Next.js+Masterclass",
    level: "Intermediate",
    category: "Frontend",
    instructor: {
      name: "Michael Chen",
      avatar: "https://placehold.co/200x200/3435FF/FFFFFF/png?text=MC",
      title: "Next.js Specialist"
    },
    totalDuration: "6h 15m",
    lastUpdated: "May 2023",
    progress: 10,
    videos: [
      {
        id: "introduction",
        title: "Introduction to Next.js",
        description: "An overview of Next.js and its advantages.",
        duration: "15:20",
        completed: true,
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Intro+to+Next.js",
      },
      {
        id: "routing",
        title: "App Router",
        description: "Understanding the Next.js App Router.",
        duration: "23:45",
        completed: false,
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=App+Router",
      },
      {
        id: "server-components",
        title: "Server Components",
        description: "Working with React Server Components in Next.js.",
        duration: "28:10",
        completed: false,
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Server+Components",
      },
      {
        id: "data-fetching",
        title: "Data Fetching",
        description: "Different data fetching strategies in Next.js.",
        duration: "24:30",
        completed: false,
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Data+Fetching",
      },
    ],
  },
  // Add more courses as needed
}

export default function CoursePage() {
  // const params = useParams()
  const courseId = "nextjs-masterclass"
  // params.courseId as string

  const course = coursesData[courseId as keyof typeof coursesData]

  if (!course) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Course not found</h2>
          <p className="text-muted-foreground">The course you{"'"}re looking for doesn{"'"}t exist.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/academy">Back to Academy</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/dashboard/academy">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Academy
        </Link>
      </Button>

      {/* Hero Section */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="relative aspect-[3/1] md:aspect-[5/1] w-full overflow-hidden bg-[#3435FF]">
          <div className="absolute inset-0  z-10"></div>
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
                <Badge variant="default" className="text-xs">{course.level}</Badge>
                <Badge variant="secondary" className="text-xs">{course.category}</Badge>
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {course.totalDuration}
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
                      <span>{course.videos.filter(v => v.completed).length}/{course.videos.length} videos</span>
                    </div>
                    <Progress value={course.progress} className="h-1.5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" size="sm">
                    Continue Learning
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Last updated: {course.lastUpdated}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <Tabs defaultValue="content" className="w-full">
        <div className="border-b mb-4">
          <TabsList className="">
            <TabsTrigger value="content" className="">
              Course Content
            </TabsTrigger>
            <TabsTrigger value="overview" className="">
              Overview
            </TabsTrigger>
            <TabsTrigger value="resources" className="">
              Resources
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="content" className="space-y-3">
          <div className="space-y-3">
            {course.videos.map((video, index) => (
              <Link
                key={video.id}
                href={`/dashboard/academy/${courseId}/${video.id}`}
                className="block"
              >
                <Card className={`overflow-hidden py-0  transition-all hover:shadow-md ${video.completed ? 'border-[#3435FF55] bg-green-50/30' : ''}`}>
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
  )
}
