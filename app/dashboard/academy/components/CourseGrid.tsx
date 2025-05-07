import { CourseCard } from "./CourseCard";
import { Course } from "./types";

interface CourseGridProps {
  courses: Course[];
  title?: string;
  description?: string;
}

export function CourseGrid({ courses, title, description }: CourseGridProps) {
  return (
    <div className="space-y-4">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      {description && <p className="text-muted-foreground">{description}</p>}
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
