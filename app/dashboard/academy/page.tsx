"use client"

import Link from "next/link"
import { useState } from "react"
import { Search } from "lucide-react"

import { Card,  CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// ERP learning course data
const courses = [
  {
    id: "erp-fundamentals",
    title: "ERP Fundamentals",
    description: "Learn the basics of Enterprise Resource Planning systems and their business applications.",
    image: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=ERP+Fundamentals",
    videos: 10,
    duration: "3h 45m",
  },
  {
    id: "financial-management",
    title: "Financial Management in ERP",
    description: "Master financial modules including general ledger, accounts payable/receivable, and reporting.",
    image: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Financial+Management",
    videos: 12,
    duration: "4h 30m",
  },
  {
    id: "supply-chain-management",
    title: "Supply Chain Management",
    description: "Learn inventory management, procurement, and logistics in ERP systems.",
    image: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Supply+Chain+Management",
    videos: 14,
    duration: "5h 15m",
  },
  {
    id: "human-resources-erp",
    title: "Human Resources in ERP",
    description: "Explore HR modules including employee management, payroll, and talent acquisition.",
    image: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=HR+Management",
    videos: 8,
    duration: "3h 20m",
  },
  {
    id: "erp-implementation",
    title: "ERP Implementation",
    description: "Step-by-step guide to successfully implementing ERP systems in organizations.",
    image: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=ERP+Implementation",
    videos: 15,
    duration: "6h 10m",
  },
  {
    id: "erp-customization",
    title: "ERP Customization & Development",
    description: "Learn to customize and extend ERP systems to meet specific business requirements.",
    image: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=ERP+Customization",
    videos: 18,
    duration: "7h 30m",
  },
]

export default function AcademyPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">ERP Learning Academy</h2>
          <p className="text-muted-foreground">
            Master enterprise resource planning with our comprehensive courses
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search ERP courses..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <Link key={course.id} href={`/dashboard/academy/${course.id}`} className="block">
            <Card className="h-full pt-0 overflow-hidden transition-all hover:shadow-md">
              <div className="aspect-video w-full overflow-hidden bg-[#3435FF]">
                <img
                  src={course.image}
                  alt={course.title}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <div>{course.videos} videos</div>
                <div>{course.duration}</div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="flex h-[200px] w-full items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No courses found</p>
          </div>
        </div>
      )}
    </div>
  )
}
