
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCourseRecommendations, type CourseRecommendationsInput } from '@/ai/flows/course-recommendations';
import type { RecommendedCourse, LearningMaterial, Course } from '@/types'; // Added Course type
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ThumbsUp, AlertTriangle, ListChecks, Film, BookText, CheckSquare, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CompletedRecommendedMaterial {
  materialUrl: string;
}

export function AiRecommendations() {
  const [recommendations, setRecommendations] = useState<RecommendedCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedRecMaterials, setCompletedRecMaterials] = useState<CompletedRecommendedMaterial[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedCompleted = localStorage.getItem('completedAiRecommendedMaterials');
    if (storedCompleted) {
      try {
        setCompletedRecMaterials(JSON.parse(storedCompleted));
      } catch (e) {
        console.error("Failed to parse completed AI recommended materials from localStorage", e);
        localStorage.removeItem('completedAiRecommendedMaterials'); // Clear corrupted data
      }
    }

    async function fetchRecommendations() {
      try {
        setIsLoading(true);
        setError(null);

        const storedCoursesString = localStorage.getItem('enrolledCourses');
        const enrolledCourses: Course[] = storedCoursesString ? JSON.parse(storedCoursesString) : [];
        
        const studentAgeString = localStorage.getItem('studentAge');
        const studentAge = studentAgeString ? parseInt(studentAgeString, 10) : undefined;
        const interestedCourse = localStorage.getItem('interestedCourse') || undefined;

        let enrollmentHistory = "No courses enrolled yet.";
        let performanceSummary = "Student has not started any courses or shown progress.";

        if (enrolledCourses.length > 0) {
          enrollmentHistory = enrolledCourses.map(c => c.title).join(', ');
          
          const coursesWithProgress = enrolledCourses.filter(c => c.progress > 0);
          if (coursesWithProgress.length > 0) {
            const totalProgress = coursesWithProgress.reduce((sum, c) => sum + c.progress, 0);
            const avgProgress = Math.round(totalProgress / coursesWithProgress.length);
            
            let summaryParts = [`Enrolled in ${enrolledCourses.length} course(s).`];
            summaryParts.push(`Actively progressing in ${coursesWithProgress.length} course(s) like ${coursesWithProgress.slice(0,2).map(c => `"${c.title}" (at ${c.progress}%)`).join(', ')}.`);
            summaryParts.push(`Average progress in active courses: ${avgProgress}%.`);
            
            const completedCourses = enrolledCourses.filter(c => c.progress === 100);
            if (completedCourses.length > 0) {
              summaryParts.push(`Completed ${completedCourses.length} course(s), including "${completedCourses[0].title}".`);
            }

            const categories = [...new Set(enrolledCourses.map(c => c.category).filter(Boolean))];
            if (categories.length > 0) {
              summaryParts.push(`Shows interest in categories such as: ${categories.join(', ')}.`);
            }
            performanceSummary = summaryParts.join(' ');

          } else {
            performanceSummary = `Enrolled in ${enrolledCourses.length} course(s) (e.g., "${enrolledCourses[0].title}") but has not made progress yet.`;
            const categories = [...new Set(enrolledCourses.map(c => c.category).filter(Boolean))];
            if (categories.length > 0) {
              performanceSummary += ` Initial interests appear to be in: ${categories.join(', ')}.`;
            }
          }
        }

        const input: CourseRecommendationsInput = {
          enrollmentHistory,
          performanceSummary,
          age: studentAge,
          interestedCourse,
        };
        
        const result = await getCourseRecommendations(input);
        setRecommendations(result.recommendedCourses || []);
      } catch (err) {
        console.error("Failed to fetch AI recommendations:", err);
        setError("We couldn't fetch your personalized recommendations at this time. Please try again later.");
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    const timer = setTimeout(() => {
        fetchRecommendations();
    }, 100); 
    
    return () => clearTimeout(timer);
  }, []);

  const handleMarkAsComplete = (courseName: string, materialTitle: string, materialUrl: string) => {
    if (completedRecMaterials.some(m => m.materialUrl === materialUrl)) return;

    const newCompletedItems = [...completedRecMaterials, { materialUrl }];
    setCompletedRecMaterials(newCompletedItems);
    localStorage.setItem('completedAiRecommendedMaterials', JSON.stringify(newCompletedItems));
    
    toast({
      title: "Material Marked Complete",
      description: `"${materialTitle}" from recommendations marked as complete.`,
    });
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
           <div className="flex items-center">
             <ListChecks className="mr-2 h-6 w-6 text-primary" />
            <Skeleton className="h-6 w-3/4" />
           </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-3 p-4 border rounded-md bg-secondary/30">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
              <div className="mt-2 space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="shadow-md rounded-lg">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (recommendations.length === 0 && !isLoading) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <ListChecks className="mr-2 h-6 w-6" />
            <span>Suggestions For You</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No specific recommendations available right now. As you enroll and progress, or update your interests, we'll tailor suggestions for you! Explore our <Link href="/enroll-courses" className="text-primary hover:underline">course catalog</Link> to find something new.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
           <ListChecks className="mr-2 h-6 w-6" />
           <span>Suggestions For You</span>
        </CardTitle>
        <CardDescription>Based on your profile and interests, here are some courses you might like.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-6">
          {recommendations.map((rec, index) => (
            <li key={index} className="p-4 border rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors shadow-sm">
              <h3 className="font-semibold text-xl text-foreground mb-1">{rec.name}</h3>
              <p className="text-sm text-muted-foreground flex items-start mb-3">
                <ThumbsUp className="w-4 h-4 mr-2 mt-0.5 text-accent flex-shrink-0" />
                {rec.reason}
              </p>
              {rec.learningMaterials && rec.learningMaterials.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Learning Materials:</h4>
                  <ul className="space-y-2">
                    {rec.learningMaterials.map((material, matIndex) => {
                      const isCompleted = completedRecMaterials.some(cm => cm.materialUrl === material.url);
                      return (
                        <li key={matIndex} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-background rounded-md border hover:shadow-md transition-shadow">
                          <div className="flex items-center mb-2 sm:mb-0">
                            {isCompleted ? <CheckCircle2 className="w-5 h-5 mr-2 text-accent" /> : (material.type === 'video' ? <Film className="w-5 h-5 mr-2 text-primary" /> : <BookText className="w-5 h-5 mr-2 text-primary" />)}
                            <Link href={material.url} target="_blank" rel="noopener noreferrer" className={`font-medium hover:underline ${isCompleted ? 'text-muted-foreground line-through' : 'text-primary'}`}>
                              {material.title}
                            </Link>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleMarkAsComplete(rec.name, material.title, material.url)}
                            disabled={isCompleted}
                            className="w-full sm:w-auto"
                          >
                            {isCompleted ? <CheckSquare className="mr-2 h-4 w-4 text-accent"/> : <CheckSquare className="mr-2 h-4 w-4"/>}
                            {isCompleted ? "Completed" : "Mark as Complete"}
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

