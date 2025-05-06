"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, Download, List } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Sample courses data
const coursesData = {
  "react-fundamentals": {
    id: "react-fundamentals",
    title: "React Fundamentals",
    description: "Learn the basics of React including components, props, and state management.",
    image: "https://placehold.co/1200x600/3435FF/FFFFFF/png?text=React+Fundamentals",
    videos: [
      {
        id: "introduction",
        title: "Introduction to React",
        description: "An overview of React and its core concepts.",
        duration: "12:30",
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Intro+to+React",
        videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8",
      },
      {
        id: "components",
        title: "Components and Props",
        description: "Understanding React components and how to pass data with props.",
        duration: "18:45",
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Components",
        videoUrl: "https://www.youtube.com/embed/4UZrsTqkcW4",
      },
      {
        id: "state",
        title: "State and Lifecycle",
        description: "Managing state and component lifecycle methods.",
        duration: "22:15",
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=State",
        videoUrl: "https://www.youtube.com/embed/4UZrsTqkcW4",
      },
      {
        id: "hooks",
        title: "Introduction to Hooks",
        description: "Using useState, useEffect, and other built-in hooks.",
        duration: "25:10",
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Hooks",
        videoUrl: "https://www.youtube.com/embed/4UZrsTqkcW4",
      },
      {
        id: "forms",
        title: "Forms and Controlled Components",
        description: "Working with forms and controlled components in React.",
        duration: "20:30",
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Forms",
        videoUrl: "https://www.youtube.com/embed/4UZrsTqkcW4",
      },
    ],
  },
  "nextjs-masterclass": {
    id: "nextjs-masterclass",
    title: "Next.js Masterclass",
    description: "Master Next.js with server components, routing, and data fetching strategies.",
    image: "https://placehold.co/1200x600/3435FF/FFFFFF/png?text=Next.js+Masterclass",
    videos: [
      {
        id: "introduction",
        title: "Introduction to Next.js",
        description: "An overview of Next.js and its advantages.",
        duration: "15:20",
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Intro+to+Next.js",
        videoUrl: "https://www.youtube.com/embed/4UZrsTqkcW4",
      },
      {
        id: "routing",
        title: "App Router",
        description: "Understanding the Next.js App Router.",
        duration: "23:45",
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=App+Router",
        videoUrl: "https://www.youtube.com/embed/4UZrsTqkcW4",
      },
      {
        id: "server-components",
        title: "Server Components",
        description: "Working with React Server Components in Next.js.",
        duration: "28:10",
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Server+Components",
        videoUrl: "https://www.youtube.com/embed/4UZrsTqkcW4",
      },
      {
        id: "data-fetching",
        title: "Data Fetching",
        description: "Different data fetching strategies in Next.js.",
        duration: "24:30",
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Data+Fetching",
        videoUrl: "https://www.youtube.com/embed/4UZrsTqkcW4",
      },
    ],
  },
  // Add more courses as needed
}

export default function VideoPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const videoId = params.videoId as string
  
  const course = coursesData[courseId]
  
  if (!course) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Course not found</h2>
          <p className="text-muted-foreground">The course you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/academy">Back to Academy</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  const videoIndex = course.videos.findIndex(v => v.id === videoId)
  
  if (videoIndex === -1) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Video not found</h2>
          <p className="text-muted-foreground">The video you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href={`/dashboard/academy/${courseId}`}>Back to Course</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  const video = course.videos[videoIndex]
  const prevVideo = videoIndex > 0 ? course.videos[videoIndex - 1] : null
  const nextVideo = videoIndex < course.videos.length - 1 ? course.videos[videoIndex + 1] : null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Button variant="ghost" asChild>
          <Link href={`/dashboard/academy/${courseId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Link>
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild disabled={!prevVideo}>
            <Link 
              href={prevVideo ? `/dashboard/academy/${courseId}/${prevVideo.id}` : '#'}
              className={!prevVideo ? 'pointer-events-none opacity-50' : ''}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Link>
          </Button>
          
          <Button variant="outline" asChild disabled={!nextVideo}>
            <Link 
              href={nextVideo ? `/dashboard/academy/${courseId}/${nextVideo.id}` : '#'}
              className={!nextVideo ? 'pointer-events-none opacity-50' : ''}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <div className="aspect-video w-full overflow-hidden bg-black">
              <iframe
                src={video.videoUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <CardHeader>
              <CardTitle>{video.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                {video.duration}
              </div>
            </CardHeader>
            <CardContent>
              <p>{video.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Resources
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <List className="mr-2 h-5 w-5" />
                Course Content
              </CardTitle>
              <CardDescription>
                {course.videos.length} videos
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
              <div className="space-y-2">
                {course.videos.map((v, i) => (
                  <Link 
                    key={v.id} 
                    href={`/dashboard/academy/${courseId}/${v.id}`}
                    className="block"
                  >
                    <div 
                      className={`rounded-md p-3 transition-colors ${
                        v.id === videoId 
                          ? 'bg-[#3435FF] text-white' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{i + 1}. {v.title}</span>
                        <span className={`text-xs ${v.id === videoId ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {v.duration}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
