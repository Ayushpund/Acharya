
import type { AvailableCourse } from '@/types';
import { AvailableCourseCard } from './available-course-card';

interface AvailableCourseListProps {
  courses: AvailableCourse[];
}

export function AvailableCourseList({ courses }: AvailableCourseListProps) {
  if (courses.length === 0) {
    return <p className="text-center text-muted-foreground">No courses available for enrollment at this time.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <AvailableCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
