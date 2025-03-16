"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getCurrentUser,
  getProperties,
  getViewings,
  getNegotiations,
  getAgreements,
} from "@/lib/supabase/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Home,
  Calendar,
  MessageSquare,
  FileText,
  Plus,
  ArrowRight,
  Loader2,
  User,
  Building,
  Key,
  FileSearch,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [viewings, setViewings] = useState<any[]>([]);
  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [agreements, setAgreements] = useState<any[]>([]);
  const [stats, setStats] = useState({
    properties: 0,
    viewings: 0,
    negotiations: 0,
    agreements: 0,
  });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Get current user
        const userData = await getCurrentUser();
        if (!userData) {
          router.push("/auth/login");
          return;
        }

        setUser(userData);
        const userTypeValue = userData.user_metadata?.user_type || "";
        setUserType(userTypeValue);

        // Fetch data in parallel
        const [propertiesData, viewingsData, negotiationsData, agreementsData] =
          await Promise.all([
            getProperties(userData.id, userTypeValue),
            getViewings(userData.id, userTypeValue),
            getNegotiations(userData.id, userTypeValue),
            getAgreements(userData.id, userTypeValue),
          ]);

        setProperties(propertiesData || []);
        setViewings(viewingsData || []);
        setNegotiations(negotiationsData || []);
        setAgreements(agreementsData || []);

        // Set stats
        setStats({
          properties: propertiesData?.length || 0,
          viewings: viewingsData?.length || 0,
          negotiations: negotiationsData?.length || 0,
          agreements: agreementsData?.length || 0,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
        });
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {user?.user_metadata?.name || user?.email}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your{" "}
          {userType === "landlord" ? "rental properties" : "rental journey"}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-blue-100 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {userType === "landlord" ? "Properties" : "Saved Properties"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.properties}</div>
              <Home className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 border-purple-100 dark:border-purple-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Viewings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.viewings}</div>
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-amber-100 dark:border-amber-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Negotiations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.negotiations}</div>
              <MessageSquare className="h-5 w-5 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border-green-100 dark:border-green-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Agreements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.agreements}</div>
              <FileText className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {userType === "landlord" ? (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Add Property</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    List a new property for rent
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/dashboard/properties/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Property
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Manage Viewings</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    Review and respond to viewing requests
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard/viewings">
                      <Calendar className="mr-2 h-4 w-4" />
                      View Requests
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Create Agreement</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    Draft a new rental agreement
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard/agreements/new">
                      <FileText className="mr-2 h-4 w-4" />
                      Create Agreement
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Analyze Agreement</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    Get AI insights on a rental agreement
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard/agreement-analysis">
                      <FileSearch className="mr-2 h-4 w-4" />
                      Analyze
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Find Properties</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    Browse available rental properties
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/dashboard/properties">
                      <Home className="mr-2 h-4 w-4" />
                      Browse Properties
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Schedule Viewing</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    Request a property viewing
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard/viewings">
                      <Calendar className="mr-2 h-4 w-4" />
                      My Viewings
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">My Agreements</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    View and manage your rental agreements
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard/agreements">
                      <FileText className="mr-2 h-4 w-4" />
                      View Agreements
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Analyze Agreement</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    Get AI insights on a rental agreement
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard/agreement-analysis">
                      <FileSearch className="mr-2 h-4 w-4" />
                      Analyze
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          {userType === "landlord" ? (
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/properties">
                View All Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/viewings">
                View All Viewings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {userType === "landlord" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {properties.length > 0 ? (
              properties.slice(0, 3).map((property) => (
                <Card key={property.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {property.title}
                    </CardTitle>
                    <CardDescription>{property.address}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between text-sm">
                      <span>£{property.price_per_month}/month</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          property.status === "available"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                        }`}
                      >
                        {property.status === "available"
                          ? "Available"
                          : "Pending"}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/dashboard/properties/${property.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Building className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No properties listed yet
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/properties/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Property
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {viewings.length > 0 ? (
              viewings.slice(0, 3).map((viewing) => (
                <Card key={viewing.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {viewing.properties?.title || "Property Viewing"}
                    </CardTitle>
                    <CardDescription>
                      {viewing.properties?.address || "Address not available"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {new Date(viewing.viewing_date).toLocaleDateString()}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          viewing.status === "confirmed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : viewing.status === "pending"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        }`}
                      >
                        {viewing.status.charAt(0).toUpperCase() +
                          viewing.status.slice(1)}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dashboard/viewings">View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No viewings scheduled yet
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/properties">
                      <Home className="mr-2 h-4 w-4" />
                      Browse Properties
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
