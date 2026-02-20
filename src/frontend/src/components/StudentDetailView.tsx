import { useGetEnrollmentsByStudent, useGetAllCourses } from '../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Loader2 } from 'lucide-react';
import { useState } from 'react';
import EnrollStudentDialog from './EnrollStudentDialog';
import { StudentStatus, type StudentProfile, type Course } from '../backend';

interface StudentDetailViewProps {
  student: StudentProfile;
}

export default function StudentDetailView({ student }: StudentDetailViewProps) {
  const { data: enrollments, isLoading: enrollmentsLoading } = useGetEnrollmentsByStudent(student.studentId);
  const { data: courses } = useGetAllCourses();
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);

  const getCourseById = (courseId: string): Course | undefined => {
    return courses?.find((c) => c.courseId === courseId);
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString();
  };

  return (
    <>
      <div className="space-y-6">
        {/* Student Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Student ID</p>
                <p className="font-medium">{student.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{student.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{student.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Grade Level</p>
                <p className="font-medium">Grade {student.gradeLevel.toString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Enrollment Date</p>
                <p className="font-medium">{formatDate(student.enrollmentDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={student.status === StudentStatus.active ? 'default' : 'secondary'}>
                  {student.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enrolled Courses Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Enrolled Courses</CardTitle>
            <Button onClick={() => setEnrollDialogOpen(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Enroll in Course
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
                      <TableHead>Course Code</TableHead>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Professor</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((enrollment) => {
                      const course = getCourseById(enrollment.courseId);
                      return (
                        <TableRow key={enrollment.enrollmentId}>
                          <TableCell className="font-medium">{course?.courseCode || 'N/A'}</TableCell>
                          <TableCell>{course?.courseName || 'Unknown Course'}</TableCell>
                          <TableCell>{course?.professor || 'N/A'}</TableCell>
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
                <BookOpen className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-1">No courses enrolled</h3>
                <p className="text-sm text-muted-foreground mb-4">This student is not enrolled in any courses yet.</p>
                <Button onClick={() => setEnrollDialogOpen(true)} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Enroll in Course
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <EnrollStudentDialog
        open={enrollDialogOpen}
        onOpenChange={setEnrollDialogOpen}
        preSelectedStudentId={student.studentId}
      />
    </>
  );
}
