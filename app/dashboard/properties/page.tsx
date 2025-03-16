"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Home,
  Plus,
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
} from "lucide-react";

export default function PropertiesPage() {
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
            {userType === "landlord" ? "My Properties" : "Find Properties"}
          </h1>
          <p className="text-muted-foreground">
            {userType === "landlord"
              ? "Manage your rental properties"
              : "Browse available properties for rent"}
          </p>
        </div>
        {userType === "landlord" && (
          <Button asChild>
            <Link href="/dashboard/properties/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </Button>
        )}
      </div>

      {userType === "landlord" ? (
        <LandlordProperties />
      ) : (
        <TenantPropertySearch />
      )}
    </div>
  );
}

function LandlordProperties() {
  // Sample property data - would come from API in real app
  const properties = [
    {
      id: "1",
      title: "2 Bedroom Apartment",
      address: "123 Main St, Anytown",
      status: "Available",
      bedrooms: 2,
      bathrooms: 1,
      area: 850,
      rent: 1200,
      imageUrl: "/images/property-sample-1.jpg",
    },
    {
      id: "2",
      title: "3 Bedroom House",
      address: "456 Oak Ave, Somewhere",
      status: "Rented",
      bedrooms: 3,
      bathrooms: 2,
      area: 1500,
      rent: 2000,
      imageUrl: "/images/property-sample-2.jpg",
    },
    {
      id: "3",
      title: "Studio Apartment",
      address: "789 Pine St, Elsewhere",
      status: "Maintenance",
      bedrooms: 0,
      bathrooms: 1,
      area: 500,
      rent: 800,
      imageUrl: "/images/property-sample-3.jpg",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search properties..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="rented">Rented</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-50 dark:bg-slate-800 border-dashed border-2">
          <CardContent className="pt-6 flex flex-col items-center justify-center h-[300px]">
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Add a new property</p>
            <Button variant="ghost" className="mt-4" asChild>
              <Link href="/dashboard/properties/new">Add Property</Link>
            </Button>
          </CardContent>
        </Card>

        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <div
                className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full ${
                  property.status === "Available"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    : property.status === "Rented"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                }`}
              >
                {property.status}
              </div>
              <img
                src={property.imageUrl}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{property.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {property.address}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/properties/${property.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/properties/${property.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>
                    {property.bedrooms}{" "}
                    {property.bedrooms === 1 ? "Bed" : "Beds"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>
                    {property.bathrooms}{" "}
                    {property.bathrooms === 1 ? "Bath" : "Baths"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  <span>{property.area} sq ft</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="font-semibold">${property.rent}/month</div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/properties/${property.id}`}>
                    Manage
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TenantPropertySearch() {
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([500, 3000]);

  // Sample property data - would come from API in real app
  const properties = [
    {
      id: "1",
      title: "2 Bedroom Apartment",
      address: "123 Main St, Anytown",
      type: "apartment",
      bedrooms: 2,
      bathrooms: 1,
      area: 850,
      rent: 1200,
      imageUrl: "/images/property-sample-1.jpg",
      features: ["Parking", "Dishwasher", "Air Conditioning"],
    },
    {
      id: "2",
      title: "3 Bedroom House",
      address: "456 Oak Ave, Somewhere",
      type: "house",
      bedrooms: 3,
      bathrooms: 2,
      area: 1500,
      rent: 2000,
      imageUrl: "/images/property-sample-2.jpg",
      features: ["Garden", "Garage", "Fireplace"],
    },
    {
      id: "3",
      title: "Studio Apartment",
      address: "789 Pine St, Elsewhere",
      type: "apartment",
      bedrooms: 0,
      bathrooms: 1,
      area: 500,
      rent: 800,
      imageUrl: "/images/property-sample-3.jpg",
      features: ["Elevator", "Laundry", "Pets Allowed"],
    },
    {
      id: "4",
      title: "1 Bedroom Apartment",
      address: "101 Elm St, Somewhere",
      type: "apartment",
      bedrooms: 1,
      bathrooms: 1,
      area: 650,
      rent: 950,
      imageUrl: "/images/property-sample-4.jpg",
      features: ["Balcony", "Gym", "Pool"],
    },
    {
      id: "5",
      title: "4 Bedroom House",
      address: "202 Maple Ave, Anytown",
      type: "house",
      bedrooms: 4,
      bathrooms: 3,
      area: 2200,
      rent: 2800,
      imageUrl: "/images/property-sample-5.jpg",
      features: ["Backyard", "Basement", "Deck"],
    },
    {
      id: "6",
      title: "2 Bedroom Townhouse",
      address: "303 Cedar Blvd, Elsewhere",
      type: "townhouse",
      bedrooms: 2,
      bathrooms: 1.5,
      area: 1100,
      rent: 1500,
      imageUrl: "/images/property-sample-6.jpg",
      features: ["Patio", "Storage", "Washer/Dryer"],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by location, property type..."
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2">Property Type</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="apartment" />
                  <Label htmlFor="apartment">Apartment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="house" />
                  <Label htmlFor="house">House</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="townhouse" />
                  <Label htmlFor="townhouse">Townhouse</Label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Bedrooms</h3>
              <Select defaultValue="any">
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4+">4+</SelectItem>
                </SelectContent>
              </Select>

              <h3 className="font-medium mb-2 mt-4">Bathrooms</h3>
              <Select defaultValue="any">
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="1.5">1.5</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="2.5">2.5</SelectItem>
                  <SelectItem value="3+">3+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-medium mb-2">Price Range</h3>
              <div className="px-2">
                <Slider
                  defaultValue={priceRange}
                  min={0}
                  max={5000}
                  step={100}
                  onValueChange={(value) => setPriceRange(value as number[])}
                />
                <div className="flex justify-between mt-2 text-sm">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              <h3 className="font-medium mb-2 mt-4">Features</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="parking" />
                  <Label htmlFor="parking">Parking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="pets" />
                  <Label htmlFor="pets">Pets Allowed</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-2">
            <Button variant="outline">Reset</Button>
            <Button>Apply Filters</Button>
          </div>
        </Card>
      )}

      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {properties.length} properties
          </p>
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 dark:bg-slate-800/80 rounded-full z-10 hover:bg-white dark:hover:bg-slate-800"
                  >
                    <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                  </Button>
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-4">
                  <div>
                    <h3 className="font-semibold">{property.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {property.address}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 text-sm">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>
                        {property.bedrooms}{" "}
                        {property.bedrooms === 1 ? "Bed" : "Beds"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>
                        {property.bathrooms}{" "}
                        {property.bathrooms === 1 ? "Bath" : "Baths"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      <span>{property.area} sq ft</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="font-semibold">${property.rent}/month</div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/properties/${property.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <div className="space-y-4">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 dark:bg-slate-800/80 rounded-full z-10 hover:bg-white dark:hover:bg-slate-800"
                    >
                      <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                    </Button>
                    <img
                      src={property.imageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      style={{ height: "200px" }}
                    />
                  </div>
                  <CardContent className="p-4 md:p-6 md:w-2/3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {property.title}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {property.address}
                        </p>
                      </div>
                      <div className="font-semibold">
                        ${property.rent}/month
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 text-sm">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>
                          {property.bedrooms}{" "}
                          {property.bedrooms === 1 ? "Bed" : "Beds"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>
                          {property.bathrooms}{" "}
                          {property.bathrooms === 1 ? "Bath" : "Baths"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        <span>{property.area} sq ft</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-1">Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {property.features.map((feature, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button asChild>
                        <Link href={`/dashboard/properties/${property.id}`}>
                          View Details
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
