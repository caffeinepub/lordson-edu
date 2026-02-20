import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  public type StudentStatus = { #active; #inactive };

  public type StudentProfile = {
    studentId : Text;
    fullName : Text;
    dateOfBirth : Text;
    enrollmentDate : Time.Time;
    gradeLevel : Nat;
    status : StudentStatus;
  };

  public type Course = {
    courseId : Text;
    courseName : Text;
    courseCode : Text;
    description : Text;
    creditHours : Nat;
    professor : Text;
  };

  public type Enrollment = {
    enrollmentId : Text;
    studentId : Text;
    courseId : Text;
    enrollmentDate : Time.Time;
    grade : ?Text;
  };

  public type UserProfile = {
    name : Text;
  };

  module Enrollment {
    public func compare(a : Enrollment, b : Enrollment) : Order.Order {
      Text.compare(a.enrollmentId, b.enrollmentId);
    };
  };

  // State
  let students = Map.empty<Text, StudentProfile>();
  let courses = Map.empty<Text, Course>();
  let enrollments = Map.empty<Text, Enrollment>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Student CRUD - Admin only for modifications
  public shared ({ caller }) func createStudent(profile : StudentProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create students");
    };
    if (students.containsKey(profile.studentId)) {
      Runtime.trap("Student already exists");
    };
    students.add(profile.studentId, profile);
  };

  public query ({ caller }) func getStudent(studentId : Text) : async ?StudentProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view student profiles");
    };
    students.get(studentId);
  };

  public query ({ caller }) func getAllStudents() : async [StudentProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view student profiles");
    };
    students.values().toArray();
  };

  public shared ({ caller }) func updateStudent(profile : StudentProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update students");
    };
    if (not students.containsKey(profile.studentId)) {
      Runtime.trap("Student does not exist");
    };
    students.add(profile.studentId, profile);
  };

  public shared ({ caller }) func deleteStudent(studentId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete students");
    };
    if (not students.containsKey(studentId)) {
      Runtime.trap("Student does not exist");
    };
    students.remove(studentId);
  };

  // Course CRUD - Admin only for modifications, users can view
  public shared ({ caller }) func createCourse(course : Course) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create courses");
    };
    if (courses.containsKey(course.courseId)) {
      Runtime.trap("Course already exists");
    };
    courses.add(course.courseId, course);
  };

  public query ({ caller }) func getCourse(courseId : Text) : async ?Course {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view courses");
    };
    courses.get(courseId);
  };

  public query ({ caller }) func getAllCourses() : async [Course] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view courses");
    };
    courses.values().toArray();
  };

  public shared ({ caller }) func updateCourse(course : Course) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update courses");
    };
    if (not courses.containsKey(course.courseId)) {
      Runtime.trap("Course does not exist");
    };
    courses.add(course.courseId, course);
  };

  public shared ({ caller }) func deleteCourse(courseId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete courses");
    };
    if (not courses.containsKey(courseId)) {
      Runtime.trap("Course does not exist");
    };
    courses.remove(courseId);
  };

  // Enrollment - Admin only for modifications, users can view
  public shared ({ caller }) func enrollStudent(enrollment : Enrollment) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can enroll students");
    };
    if (enrollments.containsKey(enrollment.enrollmentId)) {
      Runtime.trap("Enrollment already exists");
    };
    if (not students.containsKey(enrollment.studentId)) {
      Runtime.trap("Student does not exist");
    };
    if (not courses.containsKey(enrollment.courseId)) {
      Runtime.trap("Course does not exist");
    };
    enrollments.add(enrollment.enrollmentId, enrollment);
  };

  public query ({ caller }) func getEnrollmentsByStudent(studentId : Text) : async [Enrollment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view enrollments");
    };
    enrollments.values().toArray().filter(func(e) { e.studentId == studentId }).sort();
  };

  public query ({ caller }) func getEnrollmentsByCourse(courseId : Text) : async [Enrollment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view enrollments");
    };
    enrollments.values().toArray().filter(func(e) { e.courseId == courseId }).sort();
  };

  public shared ({ caller }) func updateGrade(enrollmentId : Text, grade : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update grades");
    };
    switch (enrollments.get(enrollmentId)) {
      case (null) { Runtime.trap("Enrollment not found") };
      case (?enrollment) {
        let updatedEnrollment = {
          enrollment with
          grade = ?grade;
        };
        enrollments.add(enrollmentId, updatedEnrollment);
      };
    };
  };

  public shared ({ caller }) func removeEnrollment(enrollmentId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove enrollments");
    };
    if (not enrollments.containsKey(enrollmentId)) {
      Runtime.trap("Enrollment does not exist");
    };
    enrollments.remove(enrollmentId);
  };
};
