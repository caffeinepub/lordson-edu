import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetCourse, useGetEnrollmentsByCourse, useGetAllStudents } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, Loader2, Plus, Users } from 'lucide-react';
import { useState } from 'react';
import EnrollStudentDialog from '../components/EnrollStudentDialog';
import type { StudentProfile } from '../backend';

export default function CourseDetailPage() {
  const { courseId } = useParams({ from: '/courses/$courseId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: course, isLoading: courseLoading, error } = useGetCourse(courseId);
  const { data: enrollments, isLoading: enrollmentsLoading } = useGetEnrollmentsByCourse(courseId);
  const { data: students } = useGetAllStudents();
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);

  const isAuthenticated = !!identity;

  const getStudentById = (studentId: string): StudentProfile | undefined => {
    return students?.find((s) => s.studentId === studentId);
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please log in to view course details.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (courseLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Course not found or failed to load.</AlertDescription>
        </Alert>
        <Button onClick={() => navigate({ to: '/courses' })} className="mt-4" variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button onClick={() => navigate({ to: '/courses' })} variant="ghost" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Courses
      </Button>

      <div className="space-y-6">
        {/* Course Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Course Code</p>
                <p className="font-medium">{course.courseCode}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Course Name</p>
                <p className="font-medium">{course.courseName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Professor</p>
                <p className="font-medium">{course.professor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Credit Hours</p>
                <p className="font-medium">{course.creditHours.toString()}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{course.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enrolled Students Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Enrolled Students</CardTitle>
            <Button onClick={() => setEnrollDialogOpen(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Enroll Student
            </Button>
          </CardHeader>
          <CardContent>
            {enrollmentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : enrollments && enrollments.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Grade Level</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((enrollment) => {
                      const student = getStudentById(enrollment.studentId);
                      return (
                        <TableRow key={enrollment.enrollmentId}>
                          <TableCell className="font-medium">{enrollment.studentId}</TableCell>
                          <TableCell>{student?.fullName || 'Unknown Student'}</TableCell>
                          <TableCell>Grade {student?.gradeLevel.toString() || 'N/A'}</TableCell>
                          <TableCell>
                            {enrollment.grade ? (
                              <Badge variant="outline">{enrollment.grade}</Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">Not yet graded</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-1">No students enrolled</h3>
                <p className="text-sm text-muted-foreground mb-4">No students are enrolled in this course yet.</p>
                <Button onClick={() => setEnrollDialogOpen(true)} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Enroll Student
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <EnrollStudentDialog
        open={enrollDialogOpen}
        onOpenChange={setEnrollDialogOpen}
        preSelectedCourseId={course.courseId}
      />
    </div>
  );
}
