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

interface AgreementDetailsProps {
  agreement: any;
}

export function AgreementDetails({ agreement: initialAgreement }: AgreementDetailsProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [agreement, setAgreement] = useState<any>(initialAgreement);

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
            <Home className="h-4 w-4 mr-1" />
            <Link
              href={`/dashboard/properties/${agreement.property.id}`}
              className="hover:underline"
            >
              {agreement.property.address}
            </Link>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadAgreement}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrintAgreement}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          {userType === "landlord" && agreement.status === "draft" && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/agreements/${agreement.id}/edit`}>
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
              <CardTitle>Agreement Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Start Date</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(agreement.terms.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">End Date</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(agreement.terms.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Monthly Rent</h3>
                  <p className="text-sm text-muted-foreground">
                    £{agreement.terms.rentAmount}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Security Deposit</h3>
                  <p className="text-sm text-muted-foreground">
                    £{agreement.terms.securityDeposit}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Payment Due Day</h3>
                  <p className="text-sm text-muted-foreground">
                    {agreement.terms.paymentDueDay}
                    {agreement.terms.paymentDueDay === 1
                      ? "st"
                      : agreement.terms.paymentDueDay === 2
                      ? "nd"
                      : agreement.terms.paymentDueDay === 3
                      ? "rd"
                      : "th"}{" "}
                    of each month
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Late Payment Fee</h3>
                  <p className="text-sm text-muted-foreground">
                    £{agreement.terms.latePaymentFee}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">Utilities Included</h3>
                <div className="flex flex-wrap gap-2">
                  {agreement.terms.utilities.map((utility: string) => (
                    <Badge
                      key={utility}
                      variant="outline"
                      className="bg-slate-100 dark:bg-slate-800"
                    >
                      {utility}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-1">Pet Policy</h3>
                <p className="text-sm text-muted-foreground">
                  {agreement.terms.petPolicy}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Maintenance Terms</h3>
                <p className="text-sm text-muted-foreground">
                  {agreement.terms.maintenanceTerms}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Special Terms</h3>
                <p className="text-sm text-muted-foreground">
                  {agreement.terms.specialTerms}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Full Agreement Document (Placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle>Full Agreement Document</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Full agreement document preview would appear here
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={handleDownloadAgreement}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Full Document
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Signing Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Signing Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Signing Progress</span>
                  <span>{getSigningProgress()}%</span>
                </div>
                <Progress value={getSigningProgress()} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  {agreement.signingStatus.landlordSigned ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium">Landlord</p>
                    <p className="text-xs text-muted-foreground">
                      {agreement.landlord.name}
                    </p>
                    {agreement.signingStatus.landlordSigned && (
                      <p className="text-xs text-muted-foreground">
                        Signed on{" "}
                        {new Date(
                          agreement.signingStatus.landlordSignedDate
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  {agreement.signingStatus.tenantSigned ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium">Tenant</p>
                    <p className="text-xs text-muted-foreground">
                      {agreement.tenant.name}
                    </p>
                    {agreement.signingStatus.tenantSigned && (
                      <p className="text-xs text-muted-foreground">
                        Signed on{" "}
                        {new Date(
                          agreement.signingStatus.tenantSignedDate
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {agreement.status === "pending" &&
                ((userType === "landlord" &&
                  !agreement.signingStatus.landlordSigned) ||
                  (userType === "tenant" &&
                    !agreement.signingStatus.tenantSigned)) && (
                  <Button
                    className="w-full"
                    onClick={handleSignAgreement}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Sign Agreement
                  </Button>
                )}
            </CardContent>
          </Card>

          {/* Agreement Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Agreement Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span>
                    {new Date(agreement.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>
                    {new Date(agreement.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Agreement ID</span>
                  <span className="font-mono text-xs">
                    {agreement.id.padStart(8, "0")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Landlord</h3>
                <p className="text-sm">{agreement.landlord.name}</p>
                <p className="text-xs text-muted-foreground">
                  {agreement.landlord.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {agreement.landlord.phone}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-1">Tenant</h3>
                <p className="text-sm">{agreement.tenant.name}</p>
                <p className="text-xs text-muted-foreground">
                  {agreement.tenant.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {agreement.tenant.phone}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 