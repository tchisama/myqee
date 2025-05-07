import { CoursesData } from "./types";

// Sample courses data
export const coursesData: CoursesData = {
  "react-fundamentals": {
    id: "react-fundamentals",
    title: "React Fundamentals",
    description: "Learn the basics of React including components, props, and state management.",
    image: "https://placehold.co/1200x600/3435FF/FFFFFF/png?text=React+Fundamentals",
    progress: 40, // percentage of course completed
    videos: [
      {
        id: "introduction",
        title: "Introduction to React",
        description: "An overview of React and its core concepts.",
        duration: "12:30",
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Intro+to+React",
        videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8",
        completed: true,
        resources: [
          { name: "React Documentation", url: "#", type: "documentation" },
          { name: "Starter Code", url: "#", type: "code" }
        ]
      },
      {
        id: "components",
        title: "Components and Props",
        description: "Understanding React components and how to pass data with props.",
        duration: "18:45",
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Components",
        videoUrl: "https://www.youtube.com/embed/4UZrsTqkcW4",
        completed: true,
        resources: [
          { name: "Component Examples", url: "#", type: "code" }
        ]
      },
      {
        id: "state",
        title: "State and Lifecycle",
        description: "Managing state and component lifecycle methods.",
        duration: "22:15",
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=State",
        videoUrl: "https://www.youtube.com/embed/4UZrsTqkcW4",
        completed: false,
        resources: []
      },
      {
        id: "hooks",
        title: "Introduction to Hooks",
        description: "Using useState, useEffect, and other built-in hooks.",
        duration: "25:10",
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Hooks",
        videoUrl: "https://www.youtube.com/embed/4UZrsTqkcW4",
        completed: false,
        resources: []
      },
      {
        id: "forms",
        title: "Forms and Controlled Components",
        description: "Working with forms and controlled components in React.",
        duration: "20:30",
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Forms",
        videoUrl: "https://www.youtube.com/embed/4UZrsTqkcW4",
        completed: false,
        resources: []
      },
    ],
  },
  "nextjs-masterclass": {
    id: "nextjs-masterclass",
    title: "Next.js Masterclass",
    description: "Master Next.js with server components, routing, and data fetching strategies.",
    image: "https://placehold.co/1200x600/3435FF/FFFFFF/png?text=Next.js+Masterclass",
    progress: 25, // percentage of course completed
    videos: [
      {
        id: "introduction",
        title: "Introduction to Next.js",
        description: "An overview of Next.js and its advantages.",
        duration: "15:20",
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Intro+to+Next.js",
        videoUrl: "https://www.youtube.com/embed/4UZrsTqkcW4",
        completed: true,
        resources: [
          { name: "Next.js Documentation", url: "#", type: "documentation" }
        ]
      },
      {
        id: "routing",
        title: "App Router",
        description: "Understanding the Next.js App Router.",
        duration: "23:45",
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=App+Router",
        videoUrl: "https://www.youtube.com/embed/4UZrsTqkcW4",
        completed: false,
        resources: []
      },
      {
        id: "server-components",
        title: "Server Components",
        description: "Working with React Server Components in Next.js.",
        duration: "28:10",
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Server+Components",
        videoUrl: "https://www.youtube.com/embed/4UZrsTqkcW4",
        completed: false,
        resources: []
      },
      {
        id: "data-fetching",
        title: "Data Fetching",
        description: "Different data fetching strategies in Next.js.",
        duration: "24:30",
        thumbnail: "https://placehold.co/600x400/3435FF/FFFFFF/png?text=Data+Fetching",
        videoUrl: "https://www.youtube.com/embed/4UZrsTqkcW4",
        completed: false,
        resources: []
      },
    ],
  },
  // Add more courses as needed
};
