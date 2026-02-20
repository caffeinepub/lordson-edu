import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetStudent } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import StudentDetailView from '../components/StudentDetailView';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

export default function StudentDetailPage() {
  const { studentId } = useParams({ from: '/students/$studentId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: student, isLoading, error } = useGetStudent(studentId);

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please log in to view student details.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Student not found or failed to load.</AlertDescription>
        </Alert>
        <Button onClick={() => navigate({ to: '/students' })} className="mt-4" variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button onClick={() => navigate({ to: '/students' })} variant="ghost" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Students
      </Button>
      <StudentDetailView student={student} />
    </div>
  );
}
