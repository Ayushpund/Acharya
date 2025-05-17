
import Link from 'next/link';
import { RegisterForm } from '@/components/register-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="flex items-center mb-8">
          <GraduationCap className="h-10 w-10 text-primary mr-3" />
          <h1 className="text-4xl font-bold text-primary">CourseCompass</h1>
        </div>
        <Card className="w-full max-w-md shadow-2xl rounded-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-center font-semibold">Create Your Account</CardTitle>
            <CardDescription className="text-center pt-1">
              Join CourseCompass to start your learning adventure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </main>
      <footer className="py-6 text-center text-xs text-muted-foreground w-full border-t border-border/40">
        &copy; {new Date().getFullYear()} CourseCompass. All rights reserved.
      </footer>
    </div>
  );
}
