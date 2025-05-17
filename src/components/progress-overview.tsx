
"use client"

import * as React from "react";
import type { Course } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart as LucidePieChart, TrendingUp, CheckCircle2, ListChecks, Target } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";


interface ProgressOverviewProps {
  courses: Course[];
}

const chartConfig = {
  completed: { label: "Completed", color: "hsl(var(--chart-2))" }, // Greenish (using existing chart colors)
  inProgress: { label: "In Progress", color: "hsl(var(--chart-1))" }, // Orangish
  notStarted: { label: "Not Started", color: "hsl(var(--muted))" }, // Muted gray
} satisfies ChartConfig;


export function ProgressOverview({ courses }: ProgressOverviewProps) {
  const totalCourses = courses.length;
  const completedCourses = courses.filter(c => c.progress === 100).length;
  const inProgressCoursesCount = courses.filter(c => c.progress > 0 && c.progress < 100).length;
  const notStartedCourses = courses.filter(c => c.progress === 0).length;

  const averageProgress = totalCourses > 0
    ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / totalCourses)
    : 0;

  const pieData = [
    { name: "Completed", value: completedCourses, fill: chartConfig.completed.color, nameKey: "completed" },
    { name: "In Progress", value: inProgressCoursesCount, fill: chartConfig.inProgress.color, nameKey: "inProgress" },
    { name: "Not Started", value: notStartedCourses, fill: chartConfig.notStarted.color, nameKey: "notStarted" },
  ].filter(item => item.value > 0); // Only include segments with value > 0

  return (
    <section aria-labelledby="progress-overview-heading" className="space-y-6">
      <div className="flex items-center">
        <TrendingUp className="h-8 w-8 text-primary mr-3" />
        <h2 id="progress-overview-heading" className="text-3xl font-semibold">Progress Overview</h2>
      </div>

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Target className="mr-2 h-5 w-5 text-primary" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-1 flex justify-between text-sm font-medium">
              <span>Average Progress</span>
              <span className="text-primary font-semibold">{averageProgress}%</span>
            </div>
            <Progress value={averageProgress} aria-label={`Average course progress: ${averageProgress}%`} className="h-3 [&>div]:bg-primary" />
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 mr-2 text-accent" />
            <span>{completedCourses} Course{completedCourses === 1 ? "" : "s"} Completed</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <ListChecks className="w-4 h-4 mr-2 text-primary" />
            <span>{inProgressCoursesCount} Course{inProgressCoursesCount === 1 ? "" : "s"} In Progress</span>
          </div>
        </CardContent>
      </Card>

      {pieData.length > 0 ? (
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <LucidePieChart className="mr-2 h-5 w-5 text-primary" />
              Course Status Distribution
            </CardTitle>
            <CardDescription>
              A breakdown of your courses by their current status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel nameKey="name" />}
                  />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return ( (percent * 100) > 5 ? // only show label if percent > 5%
                            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                {`${(percent * 100).toFixed(0)}%`}
                            </text> : null
                        );
                    }}
                  >
                    {pieData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                    ))}
                  </Pie>
                   <ChartLegend content={<ChartLegendContent nameKey="nameKey" />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg rounded-lg">
           <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <LucidePieChart className="mr-2 h-5 w-5 text-primary" />
              Course Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No course data available to display distribution.</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

