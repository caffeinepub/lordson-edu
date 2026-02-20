import { useState } from 'react';
import { useCreateCourse } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { Course } from '../backend';

interface AddCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddCourseDialog({ open, onOpenChange }: AddCourseDialogProps) {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [description, setDescription] = useState('');
  const [creditHours, setCreditHours] = useState('');
  const [professor, setProfessor] = useState('');
  const createCourse = useCreateCourse();

  const resetForm = () => {
    setCourseName('');
    setCourseCode('');
    setDescription('');
    setCreditHours('');
    setProfessor('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseName.trim() || !courseCode.trim() || !description.trim() || !creditHours || !professor.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const courseId = `CRS-${Date.now()}`;
    const course: Course = {
      courseId,
      courseName: courseName.trim(),
      courseCode: courseCode.trim().toUpperCase(),
      description: description.trim(),
      creditHours: BigInt(creditHours),
      professor: professor.trim(),
    };

    try {
      await createCourse.mutateAsync(course);
      toast.success('Course added successfully!');
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add course');
      console.error('Course creation error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>Enter the course information below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="courseName">Course Name</Label>
            <Input
              id="courseName"
              placeholder="Introduction to Computer Science"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              disabled={createCourse.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="courseCode">Course Code</Label>
            <Input
              id="courseCode"
              placeholder="CS101"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              disabled={createCourse.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Course description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={createCourse.isPending}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="creditHours">Credit Hours</Label>
            <Input
              id="creditHours"
              type="number"
              min="1"
              max="10"
              placeholder="3"
              value={creditHours}
              onChange={(e) => setCreditHours(e.target.value)}
              disabled={createCourse.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="professor">Professor</Label>
            <Input
              id="professor"
              placeholder="Dr. Jane Smith"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              disabled={createCourse.isPending}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={createCourse.isPending}>
              {createCourse.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Course'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
