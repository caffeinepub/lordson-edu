import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { StudentProfile, Course, Enrollment, UserProfile } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Student Queries
export function useGetAllStudents() {
  const { actor, isFetching } = useActor();

  return useQuery<StudentProfile[]>({
    queryKey: ['students'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStudents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStudent(studentId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<StudentProfile | null>({
    queryKey: ['student', studentId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStudent(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useCreateStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: StudentProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createStudent(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

export function useUpdateStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: StudentProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateStudent(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student'] });
    },
  });
}

export function useDeleteStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteStudent(studentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

// Course Queries
export function useGetAllCourses() {
  const { actor, isFetching } = useActor();

  return useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCourses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCourse(courseId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Course | null>({
    queryKey: ['course', courseId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCourse(courseId);
    },
    enabled: !!actor && !isFetching && !!courseId,
  });
}

export function useCreateCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (course: Course) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCourse(course);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useUpdateCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (course: Course) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCourse(course);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course'] });
    },
  });
}

export function useDeleteCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCourse(courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

// Enrollment Queries
export function useGetEnrollmentsByStudent(studentId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Enrollment[]>({
    queryKey: ['enrollments', 'student', studentId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEnrollmentsByStudent(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useGetEnrollmentsByCourse(courseId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Enrollment[]>({
    queryKey: ['enrollments', 'course', courseId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEnrollmentsByCourse(courseId);
    },
    enabled: !!actor && !isFetching && !!courseId,
  });
}

export function useEnrollStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enrollment: Enrollment) => {
      if (!actor) throw new Error('Actor not available');
      return actor.enrollStudent(enrollment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
}

export function useUpdateGrade() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ enrollmentId, grade }: { enrollmentId: string; grade: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateGrade(enrollmentId, grade);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
}

export function useRemoveEnrollment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enrollmentId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeEnrollment(enrollmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
}
