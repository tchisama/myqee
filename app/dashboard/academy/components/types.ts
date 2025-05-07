// Define types for academy data
export interface Resource {
  name: string;
  url: string;
  type: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  completed: boolean;
  resources: Resource[];
}

export interface Instructor {
  name: string;
  avatar: string;
  title: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  progress?: number;
  videos: Video[] | number;
  level?: string;
  category?: string;
  totalDuration?: string;
  duration?: string;
  lastUpdated?: string;
  instructor?: Instructor;
}

export type CoursesData = {
  [key: string]: Course;
};
