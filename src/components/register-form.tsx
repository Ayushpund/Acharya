
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

const registerFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.coerce.number().min(10, { message: "Age must be at least 10." }).max(100, { message: "Age must be less than 100."}),
  interestedCourse: z.string().min(3, { message: "Please specify an interest (min 3 chars)."}).optional(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      age: undefined, 
      interestedCourse: "",
      password: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    console.log("Registration submitted:", values);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    localStorage.setItem('studentName', values.name);
    if (values.age !== undefined && !Number.isNaN(values.age)) {
      localStorage.setItem('studentAge', String(values.age));
    } else {
      localStorage.removeItem('studentAge');
    }
    
    if (values.interestedCourse) {
      localStorage.setItem('interestedCourse', values.interestedCourse);
    } else {
      localStorage.removeItem('interestedCourse');
    }
    // Clear enrolled courses for a new registration
    localStorage.removeItem('enrolledCourses');


    toast({
      title: "Registration Successful!",
      description: `Welcome, ${values.name}! Your account has been created.`,
      variant: "default",
    });

    router.push("/");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Alex Johnson" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 21"
                  {...field}
                  value={field.value === undefined || field.value === null || Number.isNaN(field.value as number) ? '' : String(field.value)}
                  onChange={(e) => {
                    const strVal = e.target.value;
                    if (strVal === "") {
                      field.onChange(undefined);
                    } else {
                      const num = parseFloat(strVal);
                      field.onChange(Number.isNaN(num) ? undefined : num); 
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interestedCourse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interested Course Topic (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. Artificial Intelligence, Graphic Design" 
                  {...field} 
                  value={field.value ?? ''} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Choose a strong password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            "Creating Account..."
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" /> Create Account
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
