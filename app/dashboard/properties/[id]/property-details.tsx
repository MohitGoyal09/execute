"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Home,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Maximize2,
  BedDouble,
  Bath,
  Car,
  Wifi,
  Tv,
  Thermometer,
  Droplets,
  Utensils,
  Trash2,
  Edit,
  MessageSquare,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

interface PropertyDetailsProps {
  property: any;
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          router.push("/auth/login");
          return;
        }

        setUser(data.user);
        setUserType(data.user.user_metadata?.user_type || "");
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/auth/login");
      }
    }

    getUser();
  }, [router]);

  const handleScheduleViewing = () => {
    toast({
      title: "Viewing Request Sent",
      description: "The landlord will be notified of your request.",
    });
  };

  const handleStartNegotiation = () => {
    router.push(`/dashboard/negotiations/new?propertyId=${property.id}`);
  };

  const handleCreateAgreement = () => {
    router.push(`/dashboard/agreements/new?propertyId=${property.id}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">Available</Badge>;
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>;
      case "rented":
        return <Badge className="bg-red-500">Rented</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link href="/dashboard/properties">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            {getStatusBadge(property.status)}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {property.title}
          </h1>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{property.address}</span>
          </div>
        </div>

        {userType === "landlord" && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/properties/${property.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Property Images */}
          <Card className="overflow-hidden">
            <div className="h-80 bg-gradient-to-r from-blue-400 to-indigo-500 relative">
              {/* In a real app, you would display actual images here */}
            </div>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{property.description}</p>

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <BedDouble className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Bedrooms</p>
                    <p className="text-sm text-muted-foreground">
                      {property.bedrooms}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Bath className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Bathrooms</p>
                    <p className="text-sm text-muted-foreground">
                      {property.bathrooms}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Maximize2 className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Area</p>
                    <p className="text-sm text-muted-foreground">
                      {property.area} sq ft
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Car className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Parking</p>
                    <p className="text-sm text-muted-foreground">
                      {property.parking}{" "}
                      {property.parking === 1 ? "space" : "spaces"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Max Occupants</p>
                    <p className="text-sm text-muted-foreground">
                      {property.maxOccupants}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Price</p>
                    <p className="text-sm text-muted-foreground">
                      £{property.price}/month
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {property.amenities.map((amenity: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-muted-foreground"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Price Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                £{property.price}
                <span className="text-muted-foreground text-sm">/month</span>
              </CardTitle>
              {property.availableFrom && (
                <CardDescription>
                  Available from{" "}
                  {new Date(property.availableFrom).toLocaleDateString()}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {userType === "tenant" && property.status === "available" && (
                <>
                  <Button className="w-full" onClick={handleScheduleViewing}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Viewing
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleStartNegotiation}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start Negotiation
                  </Button>
                </>
              )}

              {userType === "landlord" && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCreateAgreement}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Create Agreement
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Landlord Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About the Landlord</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <Users className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">John Smith</p>
                  <p className="text-xs text-muted-foreground">
                    Member since 2021
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Stats */}
          {userType === "landlord" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Property Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Views</span>
                  <span>{property.views}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Viewing Requests
                  </span>
                  <span>{property.viewings}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Inquiries</span>
                  <span>{property.inquiries}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
