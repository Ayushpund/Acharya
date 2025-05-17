
'use server';

/**
 * @fileOverview An AI agent that provides personalized course recommendations based on a student's enrollment history, performance, age, and interests.
 *
 * - getCourseRecommendations - A function that returns a list of recommended courses with learning materials.
 * - CourseRecommendationsInput - The input type for the getCourseRecommendations function.
 * - CourseRecommendationsOutput - The return type for the getCourseRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CourseRecommendationsInputSchema = z.object({
  enrollmentHistory: z
    .string()
    .describe(
      'A list of course names the student has previously enrolled in, separated by commas.'
    ),
  performanceSummary: z
    .string()
    .describe(
      'A summary of the student’s performance in past courses, including grades and feedback.'
    ),
  age: z.number().optional().describe('The age of the student.'),
  interestedCourse: z.string().optional().describe('A course topic or area the student is interested in.'),
});
export type CourseRecommendationsInput = z.infer<typeof CourseRecommendationsInputSchema>;

const LearningMaterialSchema = z.object({
  type: z.enum(['video', 'article']).describe('Type of learning material.'),
  title: z.string().describe('Title of the learning material.'),
  url: z.string().describe('URL to the learning material. Should be a plausible placeholder URL e.g. https://www.youtube.com/watch?v=example or https://example.com/article-title'),
});

const RecommendedCourseSchema = z.object({
    name: z.string().describe('Recommended course name.'),
    reason: z.string().describe('A brief explanation of why this course is recommended.'),
    learningMaterials: z.array(LearningMaterialSchema)
      .min(1)
      .max(3)
      .describe('A list of 1 to 3 learning materials (videos or articles) with titles and placeholder URLs (e.g., youtube.com or example.com).')
});

const CourseRecommendationsOutputSchema = z.object({
  recommendedCourses: z.array(RecommendedCourseSchema)
    // .min(1) // Removed .min(1) to allow empty array
    .max(3)
    .describe(
      'A list of 0 to 3 recommended courses. Each course should include a name, a reason for recommendation, and associated learning materials.'
    ),
});
export type CourseRecommendationsOutput = z.infer<typeof CourseRecommendationsOutputSchema>;

export async function getCourseRecommendations(
  input: CourseRecommendationsInput
): Promise<CourseRecommendationsOutput> {
  return courseRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'courseRecommendationsPrompt',
  input: {schema: CourseRecommendationsInputSchema},
  output: {schema: CourseRecommendationsOutputSchema},
  prompt: `You are a course recommendation expert for students. Provide personalized course recommendations.

Student Profile:
Enrollment History: {{{enrollmentHistory}}}
Performance Summary: {{{performanceSummary}}}
{{#if age}}Age: {{{age}}}{{/if}}
{{#if interestedCourse}}Stated Interest: {{{interestedCourse}}}{{/if}}

Based on this profile, recommend 0 to 3 courses. If no specific courses fit well, you can return an empty list for recommendedCourses. For each recommended course:
1.  Provide the course "name".
2.  Provide a concise "reason" for the recommendation.
3.  Suggest 1 to 3 "learningMaterials" (mix of video and article). For each material:
    a.  Specify its "type" ('video' or 'article').
    b.  Provide a concise "title".
    c.  Provide a plausible placeholder "url" (e.g., for videos use https://www.youtube.com/watch?v=example, for articles use https://example.com/article-title-slug).

Ensure your entire output strictly adheres to the 'CourseRecommendationsOutputSchema' JSON format, including an empty array for recommendedCourses if no recommendations are suitable.
Example for one recommended course's learning material:
{ "type": "video", "title": "Introduction to Python", "url": "https://www.youtube.com/watch?v=xyz123" }
`,
});

const courseRecommendationsFlow = ai.defineFlow(
  {
    name: 'courseRecommendationsFlow',
    inputSchema: CourseRecommendationsInputSchema,
    outputSchema: CourseRecommendationsOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      // The AI model might return null or an undefined recommendedCourses if it cannot find recommendations
      // or if its output doesn't perfectly match the schema.
      // We ensure recommendedCourses is at least an empty array to match the (now relaxed) schema.
      if (!output || !output.recommendedCourses) {
          console.warn("AI did not return expected recommendedCourses structure or returned null/undefined. Returning empty array.");
          return { recommendedCourses: [] };
      }
      return output;
    } catch (error) {
      console.error("Error in courseRecommendationsFlow while calling AI prompt:", error);
      // In case of any error during the AI call, return an empty list of recommendations.
      // This conforms to the updated schema allowing zero recommendations.
      return { recommendedCourses: [] };
    }
  }
);

