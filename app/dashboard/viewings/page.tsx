"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Check,
  X,
  MessageSquare,
  Home,
  User,
  Phone,
  Mail,
  Plus,
} from "lucide-react";

export default function ViewingsPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">
          {userType === "landlord" ? "Viewing Requests" : "Schedule Viewings"}
        </h1>
        <p className="text-muted-foreground">
          {userType === "landlord"
            ? "Manage property viewing requests from potential tenants"
            : "Schedule and manage your property viewings"}
        </p>
      </div>

      {userType === "landlord" ? <LandlordViewings /> : <TenantViewings />}
    </div>
  );
}

function LandlordViewings() {
  // Sample viewing request data - would come from API in real app
  const viewingRequests = [
    {
      id: "1",
      propertyId: "1",
      propertyTitle: "2 Bedroom Apartment",
      propertyAddress: "123 Main St, Anytown",
      tenantName: "John Doe",
      tenantEmail: "john.doe@example.com",
      tenantPhone: "+1 (555) 123-4567",
      requestedDate: new Date(2023, 5, 15, 14, 0), // June 15, 2023, 2:00 PM
      status: "pending",
      message:
        "I'm interested in viewing this property. I'm looking for a place to move in by the end of the month.",
    },
    {
      id: "2",
      propertyId: "1",
      propertyTitle: "2 Bedroom Apartment",
      propertyAddress: "123 Main St, Anytown",
      tenantName: "Jane Smith",
      tenantEmail: "jane.smith@example.com",
      tenantPhone: "+1 (555) 987-6543",
      requestedDate: new Date(2023, 5, 16, 10, 30), // June 16, 2023, 10:30 AM
      status: "confirmed",
      message:
        "I'd like to see this apartment. I'm particularly interested in the kitchen space and storage options.",
    },
    {
      id: "3",
      propertyId: "2",
      propertyTitle: "3 Bedroom House",
      propertyAddress: "456 Oak Ave, Somewhere",
      tenantName: "Michael Johnson",
      tenantEmail: "michael.j@example.com",
      tenantPhone: "+1 (555) 456-7890",
      requestedDate: new Date(2023, 5, 17, 16, 0), // June 17, 2023, 4:00 PM
      status: "completed",
      message:
        "I'm looking for a family home and this property seems to fit our needs. Would like to check it out.",
    },
    {
      id: "4",
      propertyId: "3",
      propertyTitle: "Studio Apartment",
      propertyAddress: "789 Pine St, Elsewhere",
      tenantName: "Sarah Williams",
      tenantEmail: "sarah.w@example.com",
      tenantPhone: "+1 (555) 234-5678",
      requestedDate: new Date(2023, 5, 18, 11, 0), // June 18, 2023, 11:00 AM
      status: "cancelled",
      message:
        "I'm a student looking for a place close to campus. This studio looks perfect for my needs.",
    },
  ];

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState("upcoming");

  // Filter viewings based on selected date and tab
  const filteredViewings = viewingRequests.filter((viewing) => {
    const isOnSelectedDate = date
      ? viewing.requestedDate.getDate() === date.getDate() &&
        viewing.requestedDate.getMonth() === date.getMonth() &&
        viewing.requestedDate.getFullYear() === date.getFullYear()
      : true;

    if (selectedTab === "upcoming") {
      return (
        isOnSelectedDate &&
        (viewing.status === "pending" || viewing.status === "confirmed")
      );
    } else if (selectedTab === "completed") {
      return isOnSelectedDate && viewing.status === "completed";
    } else if (selectedTab === "cancelled") {
      return isOnSelectedDate && viewing.status === "cancelled";
    }
    return isOnSelectedDate;
  });

  // Get dates with viewings for calendar highlighting
  const datesWithViewings = viewingRequests.map(
    (viewing) => viewing.requestedDate
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                viewing: datesWithViewings,
              }}
              modifiersStyles={{
                viewing: {
                  fontWeight: "bold",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  color: "#3b82f6",
                },
              }}
            />
            <div className="mt-4">
              <p className="text-sm font-medium">Legend:</p>
              <div className="flex items-center mt-2">
                <div className="w-4 h-4 rounded-full bg-blue-100 mr-2"></div>
                <span className="text-sm">Date with viewings</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Viewing Requests</CardTitle>
              <Tabs defaultValue="upcoming" onValueChange={setSelectedTab}>
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {filteredViewings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No viewing requests for the selected date and status.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredViewings.map((viewing) => (
                  <ViewingRequestCard key={viewing.id} viewing={viewing} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ViewingRequestCard({ viewing }: { viewing: any }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">{viewing.propertyTitle}</h3>
                <p className="text-sm text-muted-foreground flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {viewing.propertyAddress}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {format(viewing.requestedDate, "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {format(viewing.requestedDate, "h:mm a")}
                </span>
              </div>
              <div>
                <Badge
                  variant={
                    viewing.status === "pending"
                      ? "outline"
                      : viewing.status === "confirmed"
                      ? "default"
                      : viewing.status === "completed"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {viewing.status.charAt(0).toUpperCase() +
                    viewing.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Viewing Request Details</DialogTitle>
                <DialogDescription>
                  Details for the viewing request of {viewing.propertyTitle}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Property</h4>
                  <p className="text-sm">{viewing.propertyTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {viewing.propertyAddress}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Tenant Information</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{viewing.tenantName}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{viewing.tenantEmail}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{viewing.tenantPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Viewing Time</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {format(viewing.requestedDate, "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {format(viewing.requestedDate, "h:mm a")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Message</h4>
                  <p className="text-sm">{viewing.message}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Status</h4>
                  <Badge
                    variant={
                      viewing.status === "pending"
                        ? "outline"
                        : viewing.status === "confirmed"
                        ? "default"
                        : viewing.status === "completed"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {viewing.status.charAt(0).toUpperCase() +
                      viewing.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {viewing.status === "pending" && (
                  <>
                    <Button variant="outline" className="flex-1">
                      <X className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                    <Button className="flex-1">
                      <Check className="h-4 w-4 mr-2" />
                      Confirm
                    </Button>
                  </>
                )}
                {viewing.status === "confirmed" && (
                  <>
                    <Button variant="outline" className="flex-1">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message Tenant
                    </Button>
                  </>
                )}
                {(viewing.status === "completed" ||
                  viewing.status === "cancelled") && (
                  <Button className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Tenant
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

function TenantViewings() {
  // Sample viewing data - would come from API in real app
  const myViewings = [
    {
      id: "1",
      propertyId: "1",
      propertyTitle: "2 Bedroom Apartment",
      propertyAddress: "123 Main St, Anytown",
      landlordName: "Robert Brown",
      requestedDate: new Date(2023, 5, 15, 14, 0), // June 15, 2023, 2:00 PM
      status: "confirmed",
      imageUrl: "/images/property-sample-1.jpg",
    },
    {
      id: "2",
      propertyId: "2",
      propertyTitle: "3 Bedroom House",
      propertyAddress: "456 Oak Ave, Somewhere",
      landlordName: "Mary Johnson",
      requestedDate: new Date(2023, 5, 18, 11, 0), // June 18, 2023, 11:00 AM
      status: "pending",
      imageUrl: "/images/property-sample-2.jpg",
    },
    {
      id: "3",
      propertyId: "3",
      propertyTitle: "Studio Apartment",
      propertyAddress: "789 Pine St, Elsewhere",
      landlordName: "David Wilson",
      requestedDate: new Date(2023, 5, 10, 15, 30), // June 10, 2023, 3:30 PM
      status: "completed",
      imageUrl: "/images/property-sample-3.jpg",
    },
  ];

  // Sample available properties for scheduling
  const availableProperties = [
    {
      id: "4",
      title: "1 Bedroom Apartment",
      address: "101 Elm St, Somewhere",
      imageUrl: "/images/property-sample-4.jpg",
      availableTimes: [
        { date: new Date(2023, 5, 20, 10, 0), available: true }, // June 20, 2023, 10:00 AM
        { date: new Date(2023, 5, 20, 14, 0), available: true }, // June 20, 2023, 2:00 PM
        { date: new Date(2023, 5, 21, 11, 0), available: true }, // June 21, 2023, 11:00 AM
        { date: new Date(2023, 5, 21, 16, 0), available: true }, // June 21, 2023, 4:00 PM
      ],
    },
    {
      id: "5",
      title: "4 Bedroom House",
      address: "202 Maple Ave, Anytown",
      imageUrl: "/images/property-sample-5.jpg",
      availableTimes: [
        { date: new Date(2023, 5, 22, 9, 0), available: true }, // June 22, 2023, 9:00 AM
        { date: new Date(2023, 5, 22, 13, 0), available: true }, // June 22, 2023, 1:00 PM
        { date: new Date(2023, 5, 23, 10, 0), available: true }, // June 23, 2023, 10:00 AM
        { date: new Date(2023, 5, 23, 15, 0), available: true }, // June 23, 2023, 3:00 PM
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">My Viewings</TabsTrigger>
          <TabsTrigger value="schedule">Schedule New</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myViewings.map((viewing) => (
              <Card key={viewing.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <div
                    className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full ${
                      viewing.status === "confirmed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : viewing.status === "pending"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    }`}
                  >
                    {viewing.status.charAt(0).toUpperCase() +
                      viewing.status.slice(1)}
                  </div>
                  <img
                    src={viewing.imageUrl}
                    alt={viewing.propertyTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{viewing.propertyTitle}</h3>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {viewing.propertyAddress}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {format(viewing.requestedDate, "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {format(viewing.requestedDate, "h:mm a")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        Landlord: {viewing.landlordName}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    {viewing.status === "confirmed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500"
                      >
                        Cancel
                      </Button>
                    )}
                    {viewing.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500"
                      >
                        Cancel
                      </Button>
                    )}
                    {viewing.status === "completed" && (
                      <Button variant="outline" size="sm">
                        View Property
                      </Button>
                    )}
                    <Button size="sm" asChild>
                      <Link
                        href={`/dashboard/properties/${viewing.propertyId}`}
                      >
                        Property Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img
                      src={property.imageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      style={{ height: "100%" }}
                    />
                  </div>
                  <CardContent className="p-4 md:p-6 md:w-2/3">
                    <h3 className="font-semibold">{property.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {property.address}
                    </p>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">
                        Available Viewing Times
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {property.availableTimes.map((slot, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {format(slot.date, "MMMM d, yyyy")}
                              </TableCell>
                              <TableCell>
                                {format(slot.date, "h:mm a")}
                              </TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm">
                                      <Plus className="h-3 w-3 mr-1" />
                                      Schedule
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Schedule Viewing
                                      </DialogTitle>
                                      <DialogDescription>
                                        Schedule a viewing for {property.title}{" "}
                                        on {format(slot.date, "MMMM d, yyyy")}{" "}
                                        at {format(slot.date, "h:mm a")}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                      <p className="text-sm">
                                        Would you like to add a message for the
                                        landlord?
                                      </p>
                                      <textarea
                                        className="w-full mt-2 p-2 border rounded-md"
                                        rows={4}
                                        placeholder="I'm interested in viewing this property..."
                                      ></textarea>
                                    </div>
                                    <DialogFooter>
                                      <Button variant="outline">Cancel</Button>
                                      <Button>Confirm Viewing</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-4">
                      <Button asChild>
                        <Link href={`/dashboard/properties/${property.id}`}>
                          View Property Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
