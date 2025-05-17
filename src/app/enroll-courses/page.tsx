
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AvailableCourseList } from '@/components/available-course-list';
import type { AvailableCourse, LearningMaterial } from '@/types';
import { GraduationCap, ArrowLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const sampleLearningMaterials: LearningMaterial[] = [
  { type: 'video', title: 'Module 1: Introduction', url: 'https://www.youtube.com/watch?v=example1', completed: false },
  { type: 'article', title: 'Core Concepts Explained', url: 'https://example.com/core-concepts', completed: false },
  { type: 'video', title: 'Practical Applications', url: 'https://www.youtube.com/watch?v=example2', completed: false },
];

// Mock data for available courses
const mockAvailableCourses: AvailableCourse[] = [
  {
    id: 'av101',
    title: 'Blockchain Fundamentals',
    description: 'Explore the core concepts of blockchain technology, cryptocurrencies, and smart contracts, building a solid foundation for decentralized applications.',
    instructor: 'Dr. Rohan Gupta',
    category: 'Technology',
    duration: '8 Weeks',
    imageUrl: 'https://picsum.photos/seed/blockchaintech/600/400',
    dataAiHint: 'blockchain network',
    learningMaterials: sampleLearningMaterials.slice(0,2),
  },
  {
    id: 'av102',
    title: 'Ethical Hacking & Cybersecurity',
    description: 'Learn to identify and mitigate security vulnerabilities in web applications, networks, and systems through hands-on labs and real-world scenarios.',
    instructor: 'Ms. Priya Sharma',
    category: 'Technology',
    duration: '12 Weeks',
    imageUrl: 'https://picsum.photos/seed/cybersecurity/600/400',
    dataAiHint: 'cyber security',
    learningMaterials: sampleLearningMaterials,
  },
  {
    id: 'av201',
    title: 'Introduction to Graphic Design',
    description: 'Master the fundamentals of visual communication, typography, color theory, and layout design using industry-standard tools like Adobe Photoshop and Illustrator.',
    instructor: 'Prof. Aarav Patel',
    category: 'Arts & Design',
    duration: '6 Weeks',
    imageUrl: 'https://picsum.photos/seed/graphicdesign/600/400',
    dataAiHint: 'graphic design',
    learningMaterials: sampleLearningMaterials.slice(1,3),
  },
  {
    id: 'av301',
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile applications for iOS and Android using JavaScript and React Native, from basic UI to complex features and API integration.',
    instructor: 'Mr. Vikram Singh',
    category: 'Development',
    duration: '10 Weeks',
    imageUrl: 'https://picsum.photos/seed/appdevelopment/600/400',
    dataAiHint: 'app development',
  },
  {
    id: 'av401',
    title: 'The Science of Well-being',
    description: 'Learn about the psychological research behind happiness, resilience, and mindfulness. Implement practical strategies to improve your own well-being.',
    instructor: 'Dr. Ananya Reddy',
    category: 'Health & Science',
    duration: '4 Weeks',
    imageUrl: 'https://picsum.photos/seed/wellbeing/600/400',
    dataAiHint: 'wellbeing meditation',
    learningMaterials: [sampleLearningMaterials[0]],
  },
  {
    id: 'av501',
    title: 'Advanced JavaScript Concepts',
    description: 'Deep dive into closures, prototypes, async/await, and other advanced JavaScript features to write more efficient and maintainable code.',
    instructor: 'Dr. Ishaan Mehra',
    category: 'Development',
    duration: '8 Weeks',
    imageUrl: 'https://picsum.photos/seed/javascriptcode/600/400',
    dataAiHint: 'javascript code'
  },
  {
    id: 'av601',
    title: 'Data Visualization with D3.js',
    description: 'Learn to create interactive and compelling data visualizations for the web using the powerful D3.js library.',
    instructor: 'Prof. Meera Iyer',
    category: 'Data Science',
    duration: '7 Weeks',
    imageUrl: 'https://picsum.photos/seed/datacharts/600/400',
    dataAiHint: 'data charts'
  },
  {
    id: 'av701',
    title: 'Introduction to Artificial Intelligence',
    description: 'Gain a foundational understanding of AI concepts, machine learning algorithms, and their real-world applications.',
    instructor: 'Dr. Arjun Kumar',
    category: 'Technology',
    duration: '9 Weeks',
    imageUrl: 'https://picsum.photos/seed/ai/600/400',
    dataAiHint: 'artificial intelligence',
    learningMaterials: sampleLearningMaterials,
  }
];


export default function EnrollCoursesPage() {
  // In a real app, you might fetch courses or implement search/filter functionality here
  // For now, we'll just display all mock courses.

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">CourseCompass</h1>
          </div>
          <Link href="/" passHref>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <section aria-labelledby="enroll-courses-heading" className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 id="enroll-courses-heading" className="text-3xl font-semibold text-primary">
              Discover New Courses
            </h1>
            <div className="relative w-full sm:w-auto sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search courses..." 
                className="pl-9 w-full" 
              />
            </div>
          </div>
          <p className="text-muted-foreground">
            Expand your knowledge and skills. Browse our catalog and enroll in courses that spark your interest.
          </p>
          
          <AvailableCourseList courses={mockAvailableCourses} />
        </section>
      </main>

      <footer className="py-8 border-t border-border mt-12 bg-card">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CourseCompass. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

