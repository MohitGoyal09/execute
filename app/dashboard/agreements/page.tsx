"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import {
  FileText,
  Download,
  Share2,
  Printer,
  Eye,
  Edit,
  MoreHorizontal,
  Search,
  Plus,
  Home,
  User,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileSignature,
  Filter,
} from "lucide-react";

export default function AgreementsPage() {
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {userType === "landlord" ? "Rental Agreements" : "My Agreements"}
          </h1>
          <p className="text-muted-foreground">
            {userType === "landlord"
              ? "Create and manage rental agreements for your properties"
              : "View and manage your rental agreements"}
          </p>
        </div>
        {userType === "landlord" && (
          <Button asChild>
            <Link href="/dashboard/agreements/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Agreement
            </Link>
          </Button>
        )}
      </div>

      <AgreementsList userType={userType} />
    </div>
  );
}

function AgreementsList({ userType }: { userType: string }) {
  // Sample agreement data - would come from API in real app
  const agreements = [
    {
      id: "1",
      title: "Rental Agreement - 2 Bedroom Apartment",
      propertyId: "1",
      propertyTitle: "2 Bedroom Apartment",
      propertyAddress: "123 Main St, Anytown",
      landlordId: "landlord-1",
      landlordName: "Robert Brown",
      tenantId: "tenant-1",
      tenantName: "John Doe",
      status: "draft",
      createdAt: new Date(2023, 5, 14), // June 14, 2023
      updatedAt: new Date(2023, 5, 15), // June 15, 2023
      startDate: new Date(2023, 6, 1), // July 1, 2023
      endDate: new Date(2024, 6, 1), // July 1, 2024
      rent: 1200,
      securityDeposit: 1200,
      completeness: 75,
    },
    {
      id: "2",
      title: "Rental Agreement - 3 Bedroom House",
      propertyId: "2",
      propertyTitle: "3 Bedroom House",
      propertyAddress: "456 Oak Ave, Somewhere",
      landlordId: "landlord-2",
      landlordName: "Mary Johnson",
      tenantId: "tenant-2",
      tenantName: "Jane Smith",
      status: "pending_signature",
      createdAt: new Date(2023, 5, 10), // June 10, 2023
      updatedAt: new Date(2023, 5, 12), // June 12, 2023
      startDate: new Date(2023, 7, 15), // August 15, 2023
      endDate: new Date(2024, 7, 15), // August 15, 2024
      rent: 2000,
      securityDeposit: 2000,
      completeness: 100,
    },
    {
      id: "3",
      title: "Rental Agreement - Studio Apartment",
      propertyId: "3",
      propertyTitle: "Studio Apartment",
      propertyAddress: "789 Pine St, Elsewhere",
      landlordId: "landlord-3",
      landlordName: "David Wilson",
      tenantId: "tenant-3",
      tenantName: "Michael Johnson",
      status: "signed",
      createdAt: new Date(2023, 5, 5), // June 5, 2023
      updatedAt: new Date(2023, 5, 8), // June 8, 2023
      startDate: new Date(2023, 6, 15), // July 15, 2023
      endDate: new Date(2024, 6, 15), // July 15, 2024
      rent: 800,
      securityDeposit: 800,
      completeness: 100,
      signedAt: new Date(2023, 5, 8), // June 8, 2023
    },
    {
      id: "4",
      title: "Rental Agreement - 1 Bedroom Apartment",
      propertyId: "4",
      propertyTitle: "1 Bedroom Apartment",
      propertyAddress: "101 Elm St, Somewhere",
      landlordId: "landlord-1",
      landlordName: "Robert Brown",
      tenantId: "tenant-4",
      tenantName: "Sarah Williams",
      status: "expired",
      createdAt: new Date(2022, 5, 1), // June 1, 2022
      updatedAt: new Date(2022, 5, 3), // June 3, 2022
      startDate: new Date(2022, 6, 1), // July 1, 2022
      endDate: new Date(2023, 6, 1), // July 1, 2023
      rent: 950,
      securityDeposit: 950,
      completeness: 100,
      signedAt: new Date(2022, 5, 3), // June 3, 2022
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Filter agreements based on search, status, and tab
  const filteredAgreements = agreements.filter((agreement) => {
    // Filter by search query
    const matchesSearch =
      agreement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agreement.propertyTitle
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      agreement.propertyAddress
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (userType === "landlord"
        ? agreement.tenantName.toLowerCase().includes(searchQuery.toLowerCase())
        : agreement.landlordName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

    // Filter by status
    const matchesStatus =
      statusFilter === "all" || agreement.status === statusFilter;

    // Filter by tab
    const isDraft = agreement.status === "draft";
    const isPending = agreement.status === "pending_signature";
    const isActive =
      agreement.status === "signed" && new Date() < agreement.endDate;
    const isExpired =
      agreement.status === "expired" ||
      (agreement.status === "signed" && new Date() >= agreement.endDate);

    if (activeTab === "all") {
      return matchesSearch && matchesStatus;
    } else if (activeTab === "draft") {
      return matchesSearch && matchesStatus && isDraft;
    } else if (activeTab === "pending") {
      return matchesSearch && matchesStatus && isPending;
    } else if (activeTab === "active") {
      return matchesSearch && matchesStatus && isActive;
    } else if (activeTab === "expired") {
      return matchesSearch && matchesStatus && isExpired;
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search agreements..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all" onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending_signature">
                Pending Signature
              </SelectItem>
              <SelectItem value="signed">Signed</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <AgreementsTable
            agreements={filteredAgreements}
            userType={userType}
          />
        </TabsContent>

        <TabsContent value="draft" className="mt-6">
          <AgreementsTable
            agreements={filteredAgreements}
            userType={userType}
          />
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <AgreementsTable
            agreements={filteredAgreements}
            userType={userType}
          />
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <AgreementsTable
            agreements={filteredAgreements}
            userType={userType}
          />
        </TabsContent>

        <TabsContent value="expired" className="mt-6">
          <AgreementsTable
            agreements={filteredAgreements}
            userType={userType}
          />
        </TabsContent>
      </Tabs>

      {userType === "landlord" && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Agreement Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Standard Residential Lease</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  A comprehensive residential lease agreement suitable for most
                  rental properties.
                </p>
                <div className="flex items-center mt-4 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  <span>AI-verified for legal compliance</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/agreements/new?template=standard">
                    Use Template
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Month-to-Month Rental</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  A flexible month-to-month rental agreement with automatic
                  renewal terms.
                </p>
                <div className="flex items-center mt-4 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  <span>AI-verified for legal compliance</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/agreements/new?template=month-to-month">
                    Use Template
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vacation Rental Agreement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  A short-term rental agreement designed for vacation
                  properties.
                </p>
                <div className="flex items-center mt-4 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  <span>AI-verified for legal compliance</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/agreements/new?template=vacation">
                    Use Template
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function AgreementsTable({
  agreements,
  userType,
}: {
  agreements: any[];
  userType: string;
}) {
  if (agreements.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Agreements Found</h3>
        <p className="text-muted-foreground mb-6">
          {userType === "landlord"
            ? "Create a new rental agreement to get started."
            : "You don't have any rental agreements yet."}
        </p>
        {userType === "landlord" && (
          <Button asChild>
            <Link href="/dashboard/agreements/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Agreement
            </Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agreement</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>
              {userType === "landlord" ? "Tenant" : "Landlord"}
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Rent</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agreements.map((agreement) => (
            <TableRow key={agreement.id}>
              <TableCell>
                <div className="font-medium">{agreement.title}</div>
                <div className="text-xs text-muted-foreground">
                  Created: {format(agreement.createdAt, "MMM d, yyyy")}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-start gap-2">
                  <Home className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <div>{agreement.propertyTitle}</div>
                    <div className="text-xs text-muted-foreground">
                      {agreement.propertyAddress}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    {userType === "landlord"
                      ? agreement.tenantName
                      : agreement.landlordName}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <AgreementStatusBadge status={agreement.status} />
                {agreement.status === "draft" && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {agreement.completeness}% complete
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <div>{format(agreement.startDate, "MMM d, yyyy")}</div>
                    <div className="text-xs text-muted-foreground">
                      to {format(agreement.endDate, "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>${agreement.rent}/month</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/agreements/${agreement.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </DropdownMenuItem>

                    {agreement.status === "draft" && (
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/agreements/${agreement.id}/edit`}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {agreement.status === "pending_signature" &&
                      userType === "tenant" && (
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/agreements/${agreement.id}/sign`}
                          >
                            <FileSignature className="h-4 w-4 mr-2" />
                            Sign
                          </Link>
                        </DropdownMenuItem>
                      )}

                    {(agreement.status === "signed" ||
                      agreement.status === "expired") && (
                      <>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="h-4 w-4 mr-2" />
                          Print
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function AgreementStatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "outline" | "destructive" = "default";
  let label = "";
  let icon = null;

  switch (status) {
    case "draft":
      variant = "outline";
      label = "Draft";
      icon = <Edit className="h-3 w-3 mr-1" />;
      break;
    case "pending_signature":
      variant = "secondary";
      label = "Pending Signature";
      icon = <Clock className="h-3 w-3 mr-1" />;
      break;
    case "signed":
      variant = "default";
      label = "Signed";
      icon = <CheckCircle2 className="h-3 w-3 mr-1" />;
      break;
    case "expired":
      variant = "destructive";
      label = "Expired";
      icon = <AlertCircle className="h-3 w-3 mr-1" />;
      break;
    default:
      variant = "outline";
      label = status.charAt(0).toUpperCase() + status.slice(1);
  }

  return (
    <Badge variant={variant} className="flex items-center w-fit">
      {icon}
      {label}
    </Badge>
  );
}
