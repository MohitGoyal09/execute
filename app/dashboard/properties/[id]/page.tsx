import { getPropertyById } from "@/lib/supabase/api";
import { PropertyDetails } from "./property-details";

// This function is required for static site generation with "output: export"
export function generateStaticParams() {
  // For demo purposes, we're pre-rendering pages for properties with IDs 1, 2, and 3
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default async function PropertyDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // For demo purposes, we're using mock data
  // In a real app, you would fetch from the database
  const mockProperty = {
    id: params.id,
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
    description:
      "This beautiful property offers modern living in a convenient location. Recently renovated with high-quality finishes and appliances. The neighborhood offers excellent amenities including parks, shops, and restaurants within walking distance.",
    price: params.id === "1" ? 1200 : params.id === "2" ? 1800 : 850,
    status:
      params.id === "1"
        ? "available"
        : params.id === "2"
        ? "pending"
        : "rented",
    bedrooms: params.id === "1" ? 2 : params.id === "2" ? 3 : 1,
    bathrooms: params.id === "1" ? 1 : params.id === "2" ? 2 : 1,
    area: params.id === "1" ? 850 : params.id === "2" ? 1500 : 500,
    parking: params.id === "1" ? 1 : params.id === "2" ? 2 : 0,
    maxOccupants: params.id === "1" ? 4 : params.id === "2" ? 6 : 2,
    amenities: [
      "High-speed internet",
      "Central heating/cooling",
      "In-unit laundry",
      "Modern kitchen appliances",
      "Hardwood floors",
      params.id === "2" ? "Backyard" : null,
      params.id === "2" ? "Garage" : null,
    ].filter(Boolean),
    images: [
      `/properties/property-${params.id}-1.jpg`,
      `/properties/property-${params.id}-2.jpg`,
      `/properties/property-${params.id}-3.jpg`,
    ],
    availableFrom:
      params.id === "3"
        ? null
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    leaseEnd:
      params.id === "3"
        ? new Date(Date.now() + 8 * 30 * 24 * 60 * 60 * 1000).toISOString()
        : null,
    views: params.id === "1" ? 12 : params.id === "2" ? 8 : 5,
    viewings: params.id === "1" ? 3 : params.id === "2" ? 2 : 0,
    inquiries: params.id === "1" ? 5 : params.id === "2" ? 3 : 1,
  };

  // In a real implementation, you would use:
  // const property = await getPropertyById(params.id);

  return <PropertyDetails property={mockProperty} />;
}
