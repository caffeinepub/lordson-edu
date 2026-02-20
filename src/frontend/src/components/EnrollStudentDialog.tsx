import { useState, useEffect } from 'react';
import { useEnrollStudent, useGetAllStudents, useGetAllCourses, useGetEnrollmentsByStudent } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { Enrollment } from '../backend';

interface EnrollStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preSelectedStudentId?: string;
  preSelectedCourseId?: string;
}

export default function EnrollStudentDialog({
  open,
  onOpenChange,
  preSelectedStudentId,
  preSelectedCourseId,
}: EnrollStudentDialogProps) {
  const [studentId, setStudentId] = useState(preSelectedStudentId || '');
  const [courseId, setCourseId] = useState(preSelectedCourseId || '');
  const { data: students } = useGetAllStudents();
  const { data: courses } = useGetAllCourses();
  const { data: existingEnrollments } = useGetEnrollmentsByStudent(studentId);
  const enrollStudent = useEnrollStudent();

  useEffect(() => {
    if (preSelectedStudentId) setStudentId(preSelectedStudentId);
    if (preSelectedCourseId) setCourseId(preSelectedCourseId);
  }, [preSelectedStudentId, preSelectedCourseId]);

  const resetForm = () => {
    if (!preSelectedStudentId) setStudentId('');
    if (!preSelectedCourseId) setCourseId('');
  };

  const isAlreadyEnrolled = () => {
    if (!existingEnrollments || !courseId) return false;
    return existingEnrollments.some((e) => e.courseId === courseId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId || !courseId) {
      toast.error('Please select both student and course');
      return;
    }

    if (isAlreadyEnrolled()) {
      toast.error('Student is already enrolled in this course');
      return;
    }

    const enrollmentId = `ENR-${Date.now()}`;
    const enrollment: Enrollment = {
      enrollmentId,
      studentId,
      courseId,
      enrollmentDate: BigInt(Date.now() * 1000000),
      grade: undefined,
    };

    try {
      await enrollStudent.mutateAsync(enrollment);
      toast.success('Student enrolled successfully!');
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to enroll student');
      console.error('Enrollment error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enroll Student in Course</DialogTitle>
          <DialogDescription>Select a student and course to create an enrollment.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student">Student</Label>
            <Select
              value={studentId}
              onValueChange={setStudentId}
              disabled={enrollStudent.isPending || !!preSelectedStudentId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students?.map((student) => (
                  <SelectItem key={student.studentId} value={student.studentId}>
                    {student.fullName} ({student.studentId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select
              value={courseId}
              onValueChange={setCourseId}
              disabled={enrollStudent.isPending || !!preSelectedCourseId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses?.map((course) => (
                  <SelectItem key={course.courseId} value={course.courseId}>
                    {course.courseCode} - {course.courseName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isAlreadyEnrolled() && (
            <p className="text-sm text-destructive">This student is already enrolled in the selected course.</p>
          )}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={enrollStudent.isPending || isAlreadyEnrolled()}>
              {enrollStudent.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enrolling...
                </>
              ) : (
                'Enroll Student'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
