"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { BookOpen, Clock, GraduationCap, Search, Video } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

// ERP learning course data
const courses = [
  {
    id: "erp-fundamentals",
    title: "ERP Fundamentals",
    description: "Learn the basics of Enterprise Resource Planning systems and their business applications.",
    image: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=ERP+Fundamentals",
    videos: 10,
    duration: "3h 45m",
    level: "Beginner",
    category: "Core",
    lastUpdated: "2 weeks ago"
  },
  {
    id: "financial-management",
    title: "Financial Management in ERP",
    description: "Master financial modules including general ledger, accounts payable/receivable, and reporting.",
    image: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Financial+Management",
    videos: 12,
    duration: "4h 30m",
    level: "Intermediate",
    category: "Finance",
    lastUpdated: "1 month ago"
  },
  {
    id: "supply-chain-management",
    title: "Supply Chain Management",
    description: "Learn inventory management, procurement, and logistics in ERP systems.",
    image: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Supply+Chain+Management",
    videos: 14,
    duration: "5h 15m",
    level: "Advanced",
    category: "Operations",
    lastUpdated: "3 weeks ago"
  },
  {
    id: "human-resources-erp",
    title: "Human Resources in ERP",
    description: "Explore HR modules including employee management, payroll, and talent acquisition.",
    image: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=HR+Management",
    videos: 8,
    duration: "3h 20m",
    level: "Intermediate",
    category: "HR",
    lastUpdated: "2 months ago"
  },
  {
    id: "erp-implementation",
    title: "ERP Implementation",
    description: "Step-by-step guide to successfully implementing ERP systems in organizations.",
    image: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=ERP+Implementation",
    videos: 15,
    duration: "6h 10m",
    level: "Advanced",
    category: "Implementation",
    lastUpdated: "1 week ago"
  },
  {
    id: "erp-customization",
    title: "ERP Customization & Development",
    description: "Learn to customize and extend ERP systems to meet specific business requirements.",
    image: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=ERP+Customization",
    videos: 18,
    duration: "7h 30m",
    level: "Expert",
    category: "Development",
    lastUpdated: "3 days ago"
  },
]

export default function AcademyPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true)
    setSearchQuery(e.target.value)
    // Simulate loading state for better UX
    setTimeout(() => setIsLoading(false), 300)
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="overflow-hidden rounded-xl border bg-card ">
        <div className="relative aspect-[5/1] w-full overflow-hidden bg-gradient-to-r from-[#3435FF] to-[#3435FF]/70">
          <div className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay">
            <Image
              src="https://placehold.co/1200x400/3435FF/FFFFFF/png?text=ERP+Academy"
              alt="ERP Academy"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-1 bg-white rounded-full"></div>
              <span className="text-white/90 font-medium tracking-wide">QEE ACADEMY</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">ERP Learning Academy</h1>
            <p className="text-white/80 max-w-2xl">
              Master enterprise resource planning with our comprehensive courses designed to help you implement and manage ERP systems effectively.
            </p>
          </div>
        </div>

        <div className="p-4 md:p-6 bg-card">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#3435FF]" />
                <span className="text-sm font-medium">{courses.length} Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-[#3435FF]" />
                <span className="text-sm font-medium">{courses.reduce((acc, course) => acc + course.videos, 0)} Videos</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#3435FF]" />
                <span className="text-sm font-medium">77+ Hours of Content</span>
              </div>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search ERP courses..."
                className="w-full pl-8 rounded-full"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">All Courses</h2>
          <Button variant="outline" size="sm" className="gap-1">
            <GraduationCap className="h-4 w-4" />
            <span>My Learning</span>
          </Button>
        </div>
        <Separator className="my-1" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Skeleton loading state
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="h-full pt-0 overflow-hidden transition-all hover:shadow-md">
              <div className="aspect-video w-full bg-muted animate-pulse"></div>
              <CardHeader>
                <div className="h-6 w-2/3 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse mt-1"></div>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse"></div>
              </CardFooter>
            </Card>
          ))
        ) : (
          filteredCourses.map((course) => (
            <Link key={course.id} href={`/dashboard/academy/${course.id}`} className="block group">
              <Card className="h-full pt-0 overflow-hidden transition-all hover:shadow-lg border-[#3435FF]/0 hover:border-[#3435FF]/20">
                <div className="aspect-video w-full overflow-hidden bg-[#3435FF] relative">
                  <Image
                    src={course.image}
                    alt={course.title}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Badge variant="default" className="text-xs bg-[#3435FF]">{course.level}</Badge>
                    <Badge variant="secondary" className="text-xs">{course.category}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-[#3435FF] transition-colors">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Video className="h-3.5 w-3.5" />
                    <span>{course.videos} videos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{course.duration}</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))
        )}
      </div>

      {filteredCourses.length === 0 && !isLoading && (
        <div className="flex h-[300px] w-full items-center justify-center rounded-xl border border-dashed bg-muted/10">
          <div className="text-center max-w-md p-6">
            <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">No courses found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We couldn&apos;t find any courses matching your search criteria. Try adjusting your search or browse all courses.
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
