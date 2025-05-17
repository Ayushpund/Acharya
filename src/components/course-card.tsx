
import Image from 'next/image';
import Link from 'next/link';
import type { Course, LearningMaterial } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { User, BookOpen, Film, BookText, ChevronDown, CheckCircle2 } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onVideoMaterialClick?: (courseId: string, materialUrl: string) => void;
}

export function CourseCard({ course, onVideoMaterialClick }: CourseCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl">
      <div className="relative w-full h-48">
        <Image
          src={course.imageUrl}
          alt={course.title}
          layout="fill"
          objectFit="cover"
          data-ai-hint={course.dataAiHint || "online course"}
          className="rounded-t-lg"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl lg:text-2xl font-semibold text-primary">{course.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3 h-[3.75rem] pt-1">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="w-4 h-4 mr-2 text-primary" />
          <span>{course.instructor}</span>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-medium text-foreground">Progress</span>
            <span className="text-accent font-semibold">{course.progress}%</span>
          </div>
          <Progress value={course.progress} aria-label={`${course.title} progress: ${course.progress}%`} className="h-2 [&>div]:bg-accent" />
        </div>
        {course.learningMaterials && course.learningMaterials.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-sm font-medium hover:no-underline py-2 group">
                <div className="flex items-center">
                 <ChevronDown className="h-4 w-4 mr-2 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  View Learning Materials ({course.learningMaterials.length})
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pl-2 pr-0 pb-0">
                <ul className="space-y-2">
                  {course.learningMaterials.map((material, index) => {
                    const materialIsCompleted = material.completed;
                    return (
                      <li key={index} className={`flex items-center p-2 rounded-md ${materialIsCompleted ? 'bg-green-100 dark:bg-green-800/30' : 'bg-secondary/30'}`}>
                        {materialIsCompleted ? <CheckCircle2 className="w-4 h-4 mr-2 text-accent flex-shrink-0" /> : (material.type === 'video' ? <Film className="w-4 h-4 mr-2 text-primary flex-shrink-0" /> : <BookText className="w-4 h-4 mr-2 text-primary flex-shrink-0" />)}
                        <Link
                          href={material.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-sm hover:underline truncate ${materialIsCompleted ? 'line-through text-muted-foreground decoration-muted-foreground/50' : 'text-primary'}`}
                          title={material.title}
                          onClick={() => {
                            if (material.type === 'video' && !materialIsCompleted && onVideoMaterialClick) {
                              onVideoMaterialClick(course.id, material.url);
                            }
                          }}
                        >
                          {material.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
      <CardFooter>
        <BookOpen className="w-4 h-4 mr-2 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Enrolled {course.category ? `| ${course.category}` : ''}</span>
      </CardFooter>
    </Card>
  );
}

