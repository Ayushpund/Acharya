
"use client";

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CourseList } from '@/components/course-list';
import { AiRecommendations } from '@/components/ai-recommendations';
import { ProgressOverview } from '@/components/progress-overview';
import { Separator } from '@/components/ui/separator';
import type { Course, LearningMaterial } from '@/types';
import { PlusCircle, BookOpen, Lightbulb, GraduationCap, User, Loader2, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';


export default function StudentDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentStudentName, setCurrentStudentName] = useState<string>('');
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [videoTimers, setVideoTimers] = useState<Record<string, NodeJS.Timeout>>({});
  const [toastInfo, setToastInfo] = useState<{ title: string; description: string } | null>(null);

  useEffect(() => {
    const studentNameFromStorage = localStorage.getItem('studentName');
    if (!studentNameFromStorage) {
      router.push('/register');
      return; 
    }
    setCurrentStudentName(studentNameFromStorage);
    setCurrentYear(new Date().getFullYear());

    const storedCoursesString = localStorage.getItem('enrolledCourses');
    let initialCourses: Course[] = [];
    if (storedCoursesString) {
      try {
        const parsedCourses: Course[] = JSON.parse(storedCoursesString);
        initialCourses = (Array.isArray(parsedCourses) ? parsedCourses : []).map(course => ({
          ...course,
          learningMaterials: (course.learningMaterials || []).map(lm => ({
            ...lm,
            completed: lm.completed || false, 
          })),
          progress: course.progress || 0,
        }));
      } catch (error) {
        console.error("Failed to parse courses from localStorage", error);
        initialCourses = [];
      }
    }
    setCourses(initialCourses);
    setIsLoadingCourses(false);

  }, [router]);

  const stableToast = useCallback(toast, []); // Ensure toast function is stable for useEffect dependency

  useEffect(() => {
    if (toastInfo) {
      stableToast(toastInfo);
      setToastInfo(null); // Reset after showing
    }
  }, [toastInfo, stableToast]);


  const handleLogout = () => {
    localStorage.removeItem('studentName');
    localStorage.removeItem('studentAge');
    localStorage.removeItem('interestedCourse');
    localStorage.removeItem('enrolledCourses'); 
    localStorage.removeItem('completedAiRecommendedMaterials');
    Object.values(videoTimers).forEach(clearTimeout); // Clear any active timers
    setVideoTimers({});
    router.push('/register');
  };

  const handleVideoMaterialClick = (courseId: string, materialUrl: string) => {
    const course = courses.find(c => c.id === courseId);
    const material = course?.learningMaterials?.find(m => m.url === materialUrl);

    if (material && material.type === 'video' && !material.completed && !videoTimers[materialUrl]) {
      toast({
        title: "Video Material Started",
        description: `"${material.title}" for course "${course?.title || 'the course'}" has started. Progress will update in 15 seconds.`,
      });

      const timerId = setTimeout(() => {
        let courseTitleForToast: string | undefined;
        let progressForToast: number | undefined;
        // let materialTitleForToast: string | undefined; // Not strictly needed if description is constructed carefully

        setCourses(prevCourses => {
          const newCourses = prevCourses.map(c => {
            if (c.id === courseId) {
              let completedCount = 0;
              const originalCourseForTitle = prevCourses.find(pc => pc.id === courseId); // Use this for consistent title

              const updatedMaterials = c.learningMaterials?.map(m => {
                let newMaterial = { ...m };
                if (m.url === materialUrl) {
                  newMaterial.completed = true;
                }
                if (newMaterial.completed) completedCount++;
                return newMaterial;
              }) || [];
              
              const totalMaterials = updatedMaterials.length;
              const newProgress = totalMaterials > 0 ? Math.round((completedCount / totalMaterials) * 100) : (c.progress || 0);
              
              courseTitleForToast = originalCourseForTitle?.title || "The course";
              progressForToast = newProgress;
              
              return { ...c, learningMaterials: updatedMaterials, progress: newProgress };
            }
            return c;
          });
          localStorage.setItem('enrolledCourses', JSON.stringify(newCourses));
          return newCourses;
        });
        
        setVideoTimers(prev => {
          const newTimers = {...prev};
          delete newTimers[materialUrl];
          return newTimers;
        });

        if (courseTitleForToast && progressForToast !== undefined) {
            setToastInfo({ // Set state for useEffect to pick up
                title: "Video Material Completed!",
                description: `Progress for "${courseTitleForToast}" updated to ${progressForToast}%.`,
            });
        }
      }, 15000); 

      setVideoTimers(prev => ({...prev, [materialUrl]: timerId}));
    }
  };

  useEffect(() => {
    return () => {
      Object.values(videoTimers).forEach(clearTimeout);
    };
  }, [videoTimers]);


  if (!currentStudentName && !isLoadingCourses) {
    return (
       <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-xl text-muted-foreground mt-4">Redirecting...</p>
      </div>
    );
  }


  if (isLoadingCourses || !currentStudentName) { 
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">CourseCompass</h1>
            </div>
             {currentStudentName && (
              <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                <User className="h-5 w-5 text-primary" />
                <span>{currentStudentName}</span>
              </div>
            )}
          </div>
        </header>
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-xl text-muted-foreground">Loading your dashboard...</p>
          </div>
        </main>
         <footer className="py-8 border-t border-border bg-card">
            <div className="container mx-auto text-center text-sm text-muted-foreground">
              &copy; {currentYear} CourseCompass. All rights reserved.
            </div>
          </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">CourseCompass</h1>
          </div>
          {currentStudentName && (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:bg-accent/10">
                  <User className="h-5 w-5 text-primary" />
                  <span>{currentStudentName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Future items: Profile, Settings */}
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/20 focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 space-y-10">
        <section aria-labelledby="welcome-heading" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-6 bg-card rounded-lg shadow-md">
          <div>
            <h1 id="welcome-heading" className="text-3xl font-semibold text-primary">
              {`Welcome back, ${currentStudentName}!`}
            </h1>
            <p className="text-muted-foreground mt-1">Let's continue your learning journey and reach new heights.</p>
          </div>
          <Link href="/enroll-courses" passHref>
            <Button
              size="lg"
              className="shadow-lg hover:shadow-xl transition-shadow bg-accent hover:bg-accent/90 text-accent-foreground flex-shrink-0"
              aria-label="Enroll in new courses"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Join New Courses
            </Button>
          </Link>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ProgressOverview courses={courses} />
          </div>
          <div className="lg:col-span-2">
            <section id="my-courses-section" aria-labelledby="my-courses-heading">
              <div className="flex items-center mb-6">
                <BookOpen className="h-8 w-8 text-primary mr-3" />
                <h2 id="my-courses-heading" className="text-3xl font-semibold">My Courses</h2>
              </div>
              <CourseList courses={courses} onVideoMaterialClick={handleVideoMaterialClick} />
            </section>
          </div>
        </div>

        <Separator className="my-10" />

        <section id="recommendations-section" aria-labelledby="recommendations-heading">
          <div className="flex items-center mb-8">
            <Lightbulb className="h-8 w-8 text-primary mr-3" />
            <h2 id="recommendations-heading" className="text-3xl font-semibold">Personalized Recommendations</h2>
          </div>
          <AiRecommendations />
        </section>
      </main>

      <footer className="py-8 border-t border-border mt-12 bg-card">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {currentYear} CourseCompass. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

