import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface StudentProfile {
    status: StudentStatus;
    studentId: string;
    dateOfBirth: string;
    fullName: string;
    gradeLevel: bigint;
    enrollmentDate: Time;
}
export type Time = bigint;
export interface Enrollment {
    enrollmentId: string;
    studentId: string;
    grade?: string;
    enrollmentDate: Time;
    courseId: string;
}
export interface UserProfile {
    name: string;
}
export interface Course {
    professor: string;
    creditHours: bigint;
    description: string;
    courseCode: string;
    courseName: string;
    courseId: string;
}
export enum StudentStatus {
    active = "active",
    inactive = "inactive"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCourse(course: Course): Promise<void>;
    createStudent(profile: StudentProfile): Promise<void>;
    deleteCourse(courseId: string): Promise<void>;
    deleteStudent(studentId: string): Promise<void>;
    enrollStudent(enrollment: Enrollment): Promise<void>;
    getAllCourses(): Promise<Array<Course>>;
    getAllStudents(): Promise<Array<StudentProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCourse(courseId: string): Promise<Course | null>;
    getEnrollmentsByCourse(courseId: string): Promise<Array<Enrollment>>;
    getEnrollmentsByStudent(studentId: string): Promise<Array<Enrollment>>;
    getStudent(studentId: string): Promise<StudentProfile | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeEnrollment(enrollmentId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCourse(course: Course): Promise<void>;
    updateGrade(enrollmentId: string, grade: string): Promise<void>;
    updateStudent(profile: StudentProfile): Promise<void>;
}
