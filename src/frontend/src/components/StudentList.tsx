import { useGetAllStudents } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Users, Loader2 } from 'lucide-react';
import { useState } from 'react';
import AddStudentDialog from './AddStudentDialog';
import { StudentStatus, type StudentProfile } from '../backend';

export default function StudentList() {
  const { data: students, isLoading } = useGetAllStudents();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRowClick = (studentId: string) => {
    navigate({ to: '/students/$studentId', params: { studentId } });
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
              <img src="/assets/generated/graduation-cap.dim_64x64.png" alt="" className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">Students</CardTitle>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </CardHeader>
        <CardContent>
          {students && students.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Grade Level</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student: StudentProfile) => (
                    <TableRow
                      key={student.studentId}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(student.studentId)}
                    >
                      <TableCell className="font-medium">{student.studentId}</TableCell>
                      <TableCell>{student.fullName}</TableCell>
                      <TableCell>Grade {student.gradeLevel.toString()}</TableCell>
                      <TableCell>
                        <Badge variant={student.status === StudentStatus.active ? 'default' : 'secondary'}>
                          {student.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No students yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Get started by adding your first student.</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddStudentDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
