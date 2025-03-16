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
  FileText,
  Calendar,
  DollarSign,
  User,
  Home,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Printer,
  Edit,
  ArrowLeft,
  Send,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

// This function is required for static site generation with "output: export"
export function generateStaticParams() {
  // For demo purposes, we're pre-rendering pages for agreements with IDs 1, 2, and 3
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
  ];
}

export default function AgreementDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [agreement, setAgreement] = useState<any>(null);

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

        // Fetch agreement data
        fetchAgreement(params.id);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/auth/login");
      }
    }

    getUser();
  }, [router, params.id]);

  const fetchAgreement = async (id: string) => {
    setIsLoading(true);

    // For demo purposes, we're using mock data
    // In a real app, you would fetch from Supabase
    setTimeout(() => {
      const mockAgreement = {
        id,
        title: `Rental Agreement - ${
          id === "1"
            ? "2 Bedroom Apartment"
            : id === "2"
            ? "3 Bedroom House"
            : "Studio Apartment"
        }`,
        status: id === "1" ? "active" : id === "2" ? "pending" : "draft",
        property: {
          id: id === "1" ? "1" : id === "2" ? "2" : "3",
          title:
            id === "1"
              ? "2 Bedroom Apartment"
              : id === "2"
              ? "3 Bedroom House"
              : "Studio Apartment",
          address:
            id === "1"
              ? "123 Main St, Anytown"
              : id === "2"
              ? "456 Oak Ave, Somewhere"
              : "789 Pine St, Elsewhere",
        },
        landlord: {
          id: "landlord-1",
          name: "John Smith",
          email: "john.smith@example.com",
          phone: "555-123-4567",
        },
        tenant: {
          id: "tenant-1",
          name: "Sarah Johnson",
          email: "sarah.johnson@example.com",
          phone: "555-987-6543",
        },
        terms: {
          startDate: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          endDate: new Date(
            Date.now() + 367 * 24 * 60 * 60 * 1000
          ).toISOString(),
          rentAmount: id === "1" ? 1200 : id === "2" ? 1800 : 850,
          securityDeposit: id === "1" ? 1200 : id === "2" ? 1800 : 850,
          paymentDueDay: 1,
          latePaymentFee: 50,
          utilities: ["Water", "Electricity", "Internet"],
          petPolicy:
            id === "2" ? "Allowed with $200 deposit" : "No pets allowed",
          maintenanceTerms: "Tenant responsible for minor repairs under $100",
          specialTerms:
            id === "1"
              ? "No smoking on premises"
              : id === "2"
              ? "Lawn care included"
              : "Quiet hours after 10pm",
        },
        signingStatus: {
          landlordSigned: id === "1",
          tenantSigned: id === "1",
          landlordSignedDate:
            id === "1"
              ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
              : null,
          tenantSignedDate:
            id === "1"
              ? new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
              : null,
        },
        createdAt: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      };

      setAgreement(mockAgreement);
      setIsLoading(false);
    }, 1000);
  };

  const handleSignAgreement = () => {
    toast({
      title: "Agreement Signed",
      description: "You have successfully signed the agreement.",
    });

    // Update local state to reflect signing
    setAgreement((prev: any) => ({
      ...prev,
      signingStatus: {
        ...prev.signingStatus,
        [userType === "landlord" ? "landlordSigned" : "tenantSigned"]: true,
        [userType === "landlord" ? "landlordSignedDate" : "tenantSignedDate"]:
          new Date().toISOString(),
      },
      status: prev.signingStatus[
        userType === "landlord" ? "tenantSigned" : "landlordSigned"
      ]
        ? "active"
        : "pending",
    }));
  };

  const handleDownloadAgreement = () => {
    toast({
      title: "Download Started",
      description: "Your agreement is being downloaded.",
    });
  };

  const handlePrintAgreement = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "pending":
        return <Badge className="bg-amber-500">Pending Signature</Badge>;
      case "draft":
        return <Badge className="bg-slate-500">Draft</Badge>;
      case "expired":
        return <Badge className="bg-red-500">Expired</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getSigningProgress = () => {
    const { landlordSigned, tenantSigned } = agreement.signingStatus;
    if (landlordSigned && tenantSigned) return 100;
    if (landlordSigned || tenantSigned) return 50;
    return 0;
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
              <Link href="/dashboard/agreements">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            {getStatusBadge(agreement.status)}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {agreement.title}
          </h1>
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              Created on {new Date(agreement.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleDownloadAgreement}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrintAgreement}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          {userType === "landlord" && agreement.status === "draft" && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/agreements/${params.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Agreement Details */}
          <Card>
            <CardHeader>
              <CardTitle>Agreement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Property</h3>
                  <Card className="bg-slate-50 dark:bg-slate-900">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Home className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium">
                            {agreement.property.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {agreement.property.address}
                          </p>
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto mt-1"
                            asChild
                          >
                            <Link
                              href={`/dashboard/properties/${agreement.property.id}`}
                            >
                              View Property
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Parties</h3>
                  <Card className="bg-slate-50 dark:bg-slate-900">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start space-x-3">
                        <User className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Landlord</p>
                          <p className="text-sm">{agreement.landlord.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {agreement.landlord.email}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-start space-x-3">
                        <User className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Tenant</p>
                          <p className="text-sm">{agreement.tenant.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {agreement.tenant.email}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">Lease Terms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Lease Period</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          agreement.terms.startDate
                        ).toLocaleDateString()}{" "}
                        to{" "}
                        {new Date(agreement.terms.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Monthly Rent</p>
                      <p className="text-sm text-muted-foreground">
                        ${agreement.terms.rentAmount}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Security Deposit</p>
                      <p className="text-sm text-muted-foreground">
                        ${agreement.terms.securityDeposit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Payment Due</p>
                      <p className="text-sm text-muted-foreground">
                        Day {agreement.terms.paymentDueDay} of each month
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">Additional Terms</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Utilities Included</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {agreement.terms.utilities.map(
                        (utility: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          >
                            {utility}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Pet Policy</p>
                    <p className="text-sm text-muted-foreground">
                      {agreement.terms.petPolicy}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Maintenance</p>
                    <p className="text-sm text-muted-foreground">
                      {agreement.terms.maintenanceTerms}
                    </p>
                  </div>

                  {agreement.terms.specialTerms && (
                    <div>
                      <p className="text-sm font-medium">Special Terms</p>
                      <p className="text-sm text-muted-foreground">
                        {agreement.terms.specialTerms}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Signing Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Signing Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion</span>
                  <span>{getSigningProgress()}%</span>
                </div>
                <Progress value={getSigningProgress()} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Landlord</span>
                  </div>
                  <div className="flex items-center">
                    {agreement.signingStatus.landlordSigned ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500">Signed</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                        <span className="text-sm text-amber-500">Pending</span>
                      </>
                    )}
                  </div>
                </div>

                {agreement.signingStatus.landlordSignedDate && (
                  <p className="text-xs text-muted-foreground">
                    Signed on{" "}
                    {new Date(
                      agreement.signingStatus.landlordSignedDate
                    ).toLocaleDateString()}
                  </p>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Tenant</span>
                  </div>
                  <div className="flex items-center">
                    {agreement.signingStatus.tenantSigned ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500">Signed</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                        <span className="text-sm text-amber-500">Pending</span>
                      </>
                    )}
                  </div>
                </div>

                {agreement.signingStatus.tenantSignedDate && (
                  <p className="text-xs text-muted-foreground">
                    Signed on{" "}
                    {new Date(
                      agreement.signingStatus.tenantSignedDate
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Sign button for the current user if they haven't signed yet */}
              {((userType === "landlord" &&
                !agreement.signingStatus.landlordSigned) ||
                (userType === "tenant" &&
                  !agreement.signingStatus.tenantSigned)) && (
                <Button className="w-full" onClick={handleSignAgreement}>
                  <Send className="mr-2 h-4 w-4" />
                  Sign Agreement
                </Button>
              )}

              {/* If both parties have signed */}
              {agreement.signingStatus.landlordSigned &&
                agreement.signingStatus.tenantSigned && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-200 dark:border-green-800">
                    <div className="flex items-center text-green-700 dark:text-green-400">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <p className="text-sm font-medium">
                        Agreement fully executed
                      </p>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                      This agreement has been signed by all parties and is now
                      legally binding.
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Important Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Important Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Start Date</span>
                </div>
                <span className="text-sm font-medium">
                  {new Date(agreement.terms.startDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-red-500" />
                  <span className="text-sm">End Date</span>
                </div>
                <span className="text-sm font-medium">
                  {new Date(agreement.terms.endDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="text-sm">First Payment Due</span>
                </div>
                <span className="text-sm font-medium">
                  {new Date(agreement.terms.startDate).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
