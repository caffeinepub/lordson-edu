import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="container py-8 space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-chart-1/10 to-chart-2/10 p-8 md:p-12">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              LORDSON Edu
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            A comprehensive education management platform for schools. Manage students, courses, and academic records all
            in one place.
          </p>
          {!isAuthenticated && (
            <p className="text-sm text-muted-foreground mb-6">Please log in to access the platform.</p>
          )}
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
          <img
            src="/assets/generated/hero-banner.dim_1200x400.png"
            alt=""
            className="w-full h-full object-cover rounded-r-2xl"
          />
        </div>
      </section>

      {/* Features Section */}
      {isAuthenticated && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Student Management</CardTitle>
              </div>
              <CardDescription>
                Manage student profiles, track academic progress, and maintain comprehensive student records.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/students">
                <Button className="w-full">
                  View Students
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-chart-1/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-chart-1" />
                </div>
                <CardTitle>Course Management</CardTitle>
              </div>
              <CardDescription>
                Create and manage courses, assign professors, and track course enrollments and grades.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/courses">
                <Button className="w-full">
                  View Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Info Section */}
      <section className="bg-muted/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              Student Profiles
            </h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive student information including personal details, enrollment dates, and academic status.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-chart-1" />
              Course Catalog
            </h3>
            <p className="text-sm text-muted-foreground">
              Detailed course information with descriptions, credit hours, and assigned professors.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-chart-2" />
              Grade Tracking
            </h3>
            <p className="text-sm text-muted-foreground">
              Track student enrollments and grades across all courses for comprehensive academic records.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
