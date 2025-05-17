import type React from 'react';

export interface LearningMaterial {
  type: 'video' | 'article';
  title: string;
  url: string;
  completed?: boolean; // Added to track completion status
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  progress: number; // 0-100
  imageUrl: string;
  dataAiHint?: string;
  category: string;
  learningMaterials?: LearningMaterial[];
}

export interface RecommendedCourse {
  name: string;
  reason: string;
  learningMaterials: LearningMaterial[]; // Will also benefit from completed status for UI consistency
}

// New type for courses available for enrollment
export interface AvailableCourse {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string; // e.g., "Technology", "Arts", "Science"
  duration: string; // e.g., "6 Weeks", "3 Months"
  imageUrl: string;
  dataAiHint?: string;
  learningMaterials?: LearningMaterial[];
}

export interface UserProfile {
  name: string;
  age?: number;
  interestedCourse?: string;
}
