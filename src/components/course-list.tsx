import type { Course } from '@/types';
import { CourseCard } from './course-card';

interface CourseListProps {
  courses: Course[];
  onVideoMaterialClick?: (courseId: string, materialUrl: string) => void;
}

export function CourseList({ courses, onVideoMaterialClick }: CourseListProps) {
  if (courses.length === 0) {
    return <p className="text-center text-muted-foreground">You are not enrolled in any courses yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} onVideoMaterialClick={onVideoMaterialClick} />
      ))}
    </div>
  );
}

