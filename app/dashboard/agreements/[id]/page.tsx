import { getAgreementById } from "@/lib/supabase/api";
import { AgreementDetails } from "./agreement-details";

// This function is required for static site generation with "output: export"
export function generateStaticParams() {
  // For demo purposes, we're pre-rendering pages for agreements with IDs 1, 2, and 3
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default async function AgreementDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // For demo purposes, we're using mock data
  // In a real app, you would fetch from the database
  const mockAgreement = {
    id: params.id,
    title: `Rental Agreement - ${
      params.id === "1"
        ? "2 Bedroom Apartment"
        : params.id === "2"
        ? "3 Bedroom House"
        : "Studio Apartment"
    }`,
    status:
      params.id === "1" ? "active" : params.id === "2" ? "pending" : "draft",
    property: {
      id: params.id === "1" ? "1" : params.id === "2" ? "2" : "3",
      title:
        params.id === "1"
          ? "2 Bedroom Apartment"
          : params.id === "2"
          ? "3 Bedroom House"
          : "Studio Apartment",
      address:
        params.id === "1"
          ? "123 Main St, Anytown"
          : params.id === "2"
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
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 367 * 24 * 60 * 60 * 1000).toISOString(),
      rentAmount: params.id === "1" ? 1200 : params.id === "2" ? 1800 : 850,
      securityDeposit:
        params.id === "1" ? 1200 : params.id === "2" ? 1800 : 850,
      paymentDueDay: 1,
      latePaymentFee: 50,
      utilities: ["Water", "Electricity", "Internet"],
      petPolicy:
        params.id === "2" ? "Allowed with $200 deposit" : "No pets allowed",
      maintenanceTerms: "Tenant responsible for minor repairs under $100",
      specialTerms:
        params.id === "1"
          ? "No smoking on premises"
          : params.id === "2"
          ? "Lawn care included"
          : "Quiet hours after 10pm",
    },
    signingStatus: {
      landlordSigned: params.id === "1",
      tenantSigned: params.id === "1",
      landlordSignedDate:
        params.id === "1"
          ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          : null,
      tenantSignedDate:
        params.id === "1"
          ? new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          : null,
    },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  };

  // In a real implementation, you would use:
  // const agreement = await getAgreementById(params.id);

  return <AgreementDetails agreement={mockAgreement} />;
}
