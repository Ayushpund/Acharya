
"use client";

import Image from 'next/image';
import type { AvailableCourse, Course } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Clock, Tag, User, PlusCircle } from 'lucide-react';

interface AvailableCourseCardProps {
  course: AvailableCourse;
}

export function AvailableCourseCard({ course }: AvailableCourseCardProps) {
  const { toast } = useToast();

  const handleEnroll = () => {
    const enrolledCoursesString = localStorage.getItem('enrolledCourses');
    let enrolledCourses: Course[] = enrolledCoursesString ? JSON.parse(enrolledCoursesString) : [];

    const isAlreadyEnrolled = enrolledCourses.some(ec => ec.id === course.id);

    if (isAlreadyEnrolled) {
      toast({
        title: "Already Enrolled",
        description: `You are already enrolled in "${course.title}".`,
        variant: "destructive", 
      });
      return;
    }

    const newEnrolledCourse: Course = {
      id: course.id,
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      progress: 0, // Initial progress
      imageUrl: course.imageUrl,
      dataAiHint: course.dataAiHint,
      category: course.category,
      learningMaterials: course.learningMaterials || [], // Persist learning materials
    };

    enrolledCourses.push(newEnrolledCourse);
    localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));

    toast({
      title: "Enrollment Successful!",
      description: `You have successfully enrolled in "${course.title}".`,
      variant: "default",
    });
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl">
      <div className="relative w-full h-48">
        <Image
          src={course.imageUrl}
          alt={course.title}
          layout="fill"
          objectFit="cover"
          data-ai-hint={course.dataAiHint || "education course"}
          className="rounded-t-lg"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl lg:text-2xl font-semibold text-primary">{course.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3 h-[3.75rem] pt-1">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="w-4 h-4 mr-2 text-primary" />
          <span>{course.instructor}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Tag className="w-4 h-4 mr-2 text-primary" />
          <span>{course.category}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-2 text-primary" />
          <span>{course.duration}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleEnroll} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Enroll Now
        </Button>
      </CardFooter>
    </Card>
  );
}
