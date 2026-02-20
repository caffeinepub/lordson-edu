import { useGetAllCourses } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Loader2 } from 'lucide-react';
import { useState } from 'react';
import AddCourseDialog from './AddCourseDialog';
import type { Course } from '../backend';

export default function CourseList() {
  const { data: courses, isLoading } = useGetAllCourses();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRowClick = (courseId: string) => {
    navigate({ to: '/courses/$courseId', params: { courseId } });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <img src="/assets/generated/book-icon.dim_64x64.png" alt="" className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">Courses</CardTitle>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </CardHeader>
        <CardContent>
          {courses && courses.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Professor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course: Course) => (
                    <TableRow
                      key={course.courseId}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(course.courseId)}
                    >
                      <TableCell className="font-medium">{course.courseCode}</TableCell>
                      <TableCell>{course.courseName}</TableCell>
                      <TableCell>{course.creditHours.toString()}</TableCell>
                      <TableCell>{course.professor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Get started by adding your first course.</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddCourseDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
