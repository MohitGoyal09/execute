import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Home, Users, FileCheck, Info } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 dark:text-blue-100">
                Simplified Rental Agreements for Everyone
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300">
                DealBroker transforms the rental process with a user-friendly,
                secure platform that serves both landlords and tenants.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#how-it-works">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg blur opacity-25"></div>
                <div className="relative bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl">
                  <img
                    src="/images/hero-illustration.svg"
                    alt="RentSmart Platform Illustration"
                    className="w-full h-auto"
                    width={500}
                    height={400}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Role Selection */}
      <section className="py-16 px-4 bg-white dark:bg-slate-800">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900 dark:text-blue-100">
            Choose Your Path
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 hover:border-blue-500 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-6 w-6 text-blue-600" />
                  <span>For Tenants</span>
                </CardTitle>
                <CardDescription>
                  Find and secure your next home with ease
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Discover available rental properties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Schedule property viewings online</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Review plain-language rental agreements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Securely sign documents electronically</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/auth/signup?role=tenant">Sign Up as Tenant</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <span>For Landlords</span>
                </CardTitle>
                <CardDescription>
                  Manage your properties and tenants efficiently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>List and manage rental properties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Schedule and track viewing appointments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Create legally-sound rental agreements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Track signed documents and tenant status</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/auth/signup?role=landlord">
                    Sign Up as Landlord
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section
        className="py-16 px-4 bg-blue-50 dark:bg-slate-900"
        id="how-it-works"
      >
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900 dark:text-blue-100">
            Why Choose RentSmart?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span>Secure & Trusted</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  End-to-end encryption for all communications and documents.
                  Your data is always protected.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-6 w-6 text-blue-600" />
                  <span>Legally Sound</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  All agreements are verified for completeness and compliance
                  with local housing regulations.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-6 w-6 text-blue-600" />
                  <span>Easy to Understand</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Complex legal terms explained in plain language, making
                  agreements accessible to everyone.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/tutorial">Take a Quick Tutorial</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white dark:bg-slate-800">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900 dark:text-blue-100">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <p className="italic">
                  &quot;DealBroker made finding and securing my apartment so much
                  easier. The plain language explanations helped me understand
                  exactly what I was signing.&quot;
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    JD
                  </div>
                  <div>
                    <p className="font-medium">Jane Doe</p>
                    <p className="text-sm text-slate-500">Tenant</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="italic">
                  &quot;As a landlord with multiple properties, DealBroker has
                  streamlined my entire rental process. The AI verification
                  gives me confidence that my agreements are complete&quot;
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    JS
                  </div>
                  <div>
                    <p className="font-medium">John Smith</p>
                    <p className="text-sm text-slate-500">Landlord</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="italic">
                  &quot;The accessibility features made it possible for my
                  elderly father to navigate the platform and sign his rental
                  agreement without any assistance.&quot;
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    MC
                  </div>
                  <div>
                    <p className="font-medium">Maria Chen</p>
                    <p className="text-sm text-slate-500">Family Member</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
