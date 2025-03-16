"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Home,
  Calendar,
  MessageSquare,
  FileText,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          return;
        }

        setUser(data.user);
        setUserType(data.user.user_metadata?.user_type || "");
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }

    getUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.user_metadata?.full_name || "User"}!
        </p>
      </div>

      {userType === "landlord" ? <LandlordDashboard /> : <TenantDashboard />}
    </div>
  );
}

function LandlordDashboard() {
  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Add a Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                List a new property for potential tenants to discover.
              </p>
              <Button asChild>
                <Link href="/dashboard/properties/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Create Agreement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Draft a new rental agreement using our templates.
              </p>
              <Button asChild>
                <Link href="/dashboard/agreements/new">
                  <FileText className="h-4 w-4 mr-2" />
                  New Agreement
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">View Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Check viewing requests and messages from potential tenants.
              </p>
              <Button variant="outline" asChild>
                <Link href="/dashboard/viewings">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Requests
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Property Overview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Property Overview</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/properties">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-gray-50 dark:bg-slate-800 border-dashed border-2">
            <CardContent className="pt-6 flex flex-col items-center justify-center h-[200px]">
              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Add a new property</p>
              <Button variant="ghost" className="mt-4" asChild>
                <Link href="/dashboard/properties/new">Add Property</Link>
              </Button>
            </CardContent>
          </Card>
          {/* Sample properties would be mapped here from real data */}
          <PropertyCard
            title="2 Bedroom Apartment"
            address="123 Main St, Anytown"
            status="Available"
            imageUrl="/images/property-sample-1.jpg"
          />
          <PropertyCard
            title="3 Bedroom House"
            address="456 Oak Ave, Somewhere"
            status="Rented"
            imageUrl="/images/property-sample-2.jpg"
          />
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">New viewing request</p>
                  <p className="text-sm text-muted-foreground">
                    John Doe requested to view 2 Bedroom Apartment
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    2 hours ago
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border-b">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium">New message</p>
                  <p className="text-sm text-muted-foreground">
                    Sarah Smith sent you a message about 3 Bedroom House
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Yesterday
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium">Agreement signed</p>
                  <p className="text-sm text-muted-foreground">
                    Michael Johnson signed the rental agreement for 3 Bedroom
                    House
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 days ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function TenantDashboard() {
  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Find Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Browse available properties that match your criteria.
              </p>
              <Button asChild>
                <Link href="/dashboard/properties">
                  <Home className="h-4 w-4 mr-2" />
                  Browse Properties
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">My Viewings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Check your scheduled property viewings.
              </p>
              <Button variant="outline" asChild>
                <Link href="/dashboard/viewings">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedule
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">My Agreements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Access your rental agreements and documents.
              </p>
              <Button variant="outline" asChild>
                <Link href="/dashboard/agreements">
                  <FileText className="h-4 w-4 mr-2" />
                  View Agreements
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Property Search */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Find Your Next Home</h2>
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Properties</TabsTrigger>
                <TabsTrigger value="apartments">Apartments</TabsTrigger>
                <TabsTrigger value="houses">Houses</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <PropertyCard
                    title="2 Bedroom Apartment"
                    address="123 Main St, Anytown"
                    status="Available"
                    imageUrl="/images/property-sample-1.jpg"
                  />
                  <PropertyCard
                    title="3 Bedroom House"
                    address="456 Oak Ave, Somewhere"
                    status="Available"
                    imageUrl="/images/property-sample-2.jpg"
                  />
                  <PropertyCard
                    title="Studio Apartment"
                    address="789 Pine St, Elsewhere"
                    status="Available"
                    imageUrl="/images/property-sample-3.jpg"
                  />
                </div>
                <div className="text-center mt-4">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/properties">
                      View All Properties
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="apartments">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <PropertyCard
                    title="2 Bedroom Apartment"
                    address="123 Main St, Anytown"
                    status="Available"
                    imageUrl="/images/property-sample-1.jpg"
                  />
                  <PropertyCard
                    title="Studio Apartment"
                    address="789 Pine St, Elsewhere"
                    status="Available"
                    imageUrl="/images/property-sample-3.jpg"
                  />
                </div>
              </TabsContent>
              <TabsContent value="houses">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <PropertyCard
                    title="3 Bedroom House"
                    address="456 Oak Ave, Somewhere"
                    status="Available"
                    imageUrl="/images/property-sample-2.jpg"
                  />
                </div>
              </TabsContent>
              <TabsContent value="favorites">
                <div className="text-center py-8 text-muted-foreground">
                  <p>You haven&apos;t saved any favorites yet.</p>
                  <Button variant="link" asChild>
                    <Link href="/dashboard/properties">Browse properties</Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">Viewing confirmed</p>
                  <p className="text-sm text-muted-foreground">
                    Your viewing for 2 Bedroom Apartment has been confirmed
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    1 day ago
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border-b">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium">New message</p>
                  <p className="text-sm text-muted-foreground">
                    You received a message from landlord about 3 Bedroom House
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    2 days ago
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                  <Home className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium">Property viewed</p>
                  <p className="text-sm text-muted-foreground">
                    You viewed details for Studio Apartment
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 days ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

interface PropertyCardProps {
  title: string;
  address: string;
  status: string;
  imageUrl: string;
}

function PropertyCard({ title, address, status, imageUrl }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <div className="absolute top-2 right-2 bg-white dark:bg-slate-800 text-xs font-medium px-2 py-1 rounded-full">
          {status}
        </div>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="pt-4">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{address}</p>
        <div className="flex justify-between items-center mt-4">
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/dashboard/properties/${encodeURIComponent(
                title.toLowerCase().replace(/ /g, "-")
              )}`}
            >
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
