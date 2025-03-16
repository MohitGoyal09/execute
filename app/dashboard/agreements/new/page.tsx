"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  ArrowLeft,
  Plus,
  Save,
  Loader2,
  FileText,
  User,
  Home,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

const agreementFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  propertyId: z.string().min(1, "Property is required"),
  tenantEmail: z.string().email("Valid email is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  rentAmount: z.coerce.number().positive("Rent amount must be positive"),
  securityDeposit: z.coerce
    .number()
    .positive("Security deposit must be positive"),
  paymentDueDay: z.coerce
    .number()
    .min(1, "Payment due day must be between 1 and 31")
    .max(31, "Payment due day must be between 1 and 31"),
  latePaymentFee: z.coerce
    .number()
    .min(0, "Late payment fee cannot be negative"),
  utilities: z.array(z.string()).optional(),
  petPolicy: z.string(),
  maintenanceTerms: z.string(),
  specialTerms: z.string().optional(),
});

type AgreementFormValues = z.infer<typeof agreementFormSchema>;

const utilitiesList = [
  { id: "water", label: "Water" },
  { id: "electricity", label: "Electricity" },
  { id: "gas", label: "Gas" },
  { id: "internet", label: "Internet" },
  { id: "cable", label: "Cable TV" },
  { id: "trash", label: "Trash Collection" },
  { id: "sewer", label: "Sewer" },
];

export default function NewAgreementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUtilities, setSelectedUtilities] = useState<string[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const form = useForm<AgreementFormValues>({
    resolver: zodResolver(agreementFormSchema),
    defaultValues: {
      title: "",
      propertyId: "",
      tenantEmail: "",
      startDate: format(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd"
      ),
      endDate: format(
        new Date(Date.now() + 367 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd"
      ),
      rentAmount: 0,
      securityDeposit: 0,
      paymentDueDay: 1,
      latePaymentFee: 50,
      utilities: [],
      petPolicy: "No pets allowed",
      maintenanceTerms: "Tenant responsible for minor repairs under $100",
      specialTerms: "",
    },
  });

  useEffect(() => {
    async function getUser() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          router.push("/auth/login");
          return;
        }

        // Only landlords can create agreements
        if (data.user.user_metadata?.user_type !== "landlord") {
          router.push("/dashboard");
          return;
        }

        setUser(data.user);

        // Fetch properties
        fetchProperties();

        // Check if propertyId is in URL params
        const propertyId = searchParams.get("propertyId");
        if (propertyId) {
          form.setValue("propertyId", propertyId);
          fetchPropertyDetails(propertyId);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/auth/login");
      }
    }

    getUser();
  }, [router, searchParams, form]);

  const fetchProperties = async () => {
    // For demo purposes, we're using mock data
    // In a real app, you would fetch from Supabase
    const mockProperties = [
      {
        id: "1",
        title: "2 Bedroom Apartment",
        address: "123 Main St, Anytown",
        price: 1200,
      },
      {
        id: "2",
        title: "3 Bedroom House",
        address: "456 Oak Ave, Somewhere",
        price: 1800,
      },
      {
        id: "3",
        title: "Studio Apartment",
        address: "789 Pine St, Elsewhere",
        price: 850,
      },
    ];

    setProperties(mockProperties);
    setIsLoading(false);
  };

  const fetchPropertyDetails = async (propertyId: string) => {
    // For demo purposes, we're using mock data
    // In a real app, you would fetch from Supabase
    setTimeout(() => {
      const property = properties.find((p) => p.id === propertyId);
      if (property) {
        setSelectedProperty(property);
        form.setValue("title", `Rental Agreement - ${property.title}`);
        form.setValue("rentAmount", property.price);
        form.setValue("securityDeposit", property.price);
      }
    }, 500);
  };

  const handleUtilityToggle = (utilityId: string) => {
    setSelectedUtilities((prev) =>
      prev.includes(utilityId)
        ? prev.filter((id) => id !== utilityId)
        : [...prev, utilityId]
    );
  };

  const onSubmit = async (data: AgreementFormValues) => {
    try {
      setIsSubmitting(true);

      // Include selected utilities
      data.utilities = selectedUtilities;

      // In a real app, you would save to Supabase
      console.log("Agreement data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Agreement Created",
        description: "Your rental agreement has been created successfully.",
      });

      router.push("/dashboard/agreements");
    } catch (error) {
      console.error("Error creating agreement:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create agreement. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePropertyChange = (propertyId: string) => {
    form.setValue("propertyId", propertyId);
    fetchPropertyDetails(propertyId);
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
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link href="/dashboard/agreements">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create New Agreement
          </h1>
          <p className="text-muted-foreground">
            Create a rental agreement for your property.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide the basic details for this rental agreement.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agreement Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Rental Agreement - 2 Bedroom Apartment"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A clear title helps identify this agreement.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="propertyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property</FormLabel>
                      <Select
                        onValueChange={(value) => handlePropertyChange(value)}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {properties.map((property) => (
                            <SelectItem key={property.id} value={property.id}>
                              {property.title} - {property.address}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tenantEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tenant Email</FormLabel>
                      <FormControl>
                        <Input placeholder="tenant@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        The tenant will be notified to sign the agreement.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {selectedProperty && (
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                  <div className="flex items-start space-x-3">
                    <Home className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{selectedProperty.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedProperty.address}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Suggested Rent: ${selectedProperty.price}/month
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lease Terms</CardTitle>
              <CardDescription>
                Define the terms of the rental agreement.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Rent ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="securityDeposit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Deposit ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="paymentDueDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Due Day</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="31" {...field} />
                      </FormControl>
                      <FormDescription>
                        Day of the month when rent is due (1-31).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="latePaymentFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Late Payment Fee ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-4" />

              <div>
                <Label className="text-base">Utilities Included</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Select all utilities that are included in the rent.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {utilitiesList.map((utility) => (
                    <div
                      key={utility.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={utility.id}
                        checked={selectedUtilities.includes(utility.id)}
                        onCheckedChange={() => handleUtilityToggle(utility.id)}
                      />
                      <label
                        htmlFor={utility.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {utility.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Terms</CardTitle>
              <CardDescription>
                Define additional terms and policies for the rental agreement.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="petPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pet Policy</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pet policy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="No pets allowed">
                          No pets allowed
                        </SelectItem>
                        <SelectItem value="Pets allowed with deposit">
                          Pets allowed with deposit
                        </SelectItem>
                        <SelectItem value="Pets allowed with monthly fee">
                          Pets allowed with monthly fee
                        </SelectItem>
                        <SelectItem value="Pets allowed">
                          Pets allowed (no restrictions)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maintenanceTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maintenance Terms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Define maintenance responsibilities..."
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Specify who is responsible for maintenance and repairs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Terms (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional terms or conditions..."
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add any additional terms or conditions specific to this
                      agreement.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard/agreements">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Create Agreement
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
