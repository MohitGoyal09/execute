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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Loader2,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AgreementAnalysisPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [previousAnalyses, setPreviousAnalyses] = useState<any[]>([]);

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

        // Fetch previous analyses
        fetchPreviousAnalyses(data.user.id);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/auth/login");
      }
    }

    getUser();
  }, [router]);

  const fetchPreviousAnalyses = async (userId: string) => {
    try {
      // This would be replaced with actual API call to fetch previous analyses
      // For demo purposes, we're using mock data
      setPreviousAnalyses([
        {
          id: "1",
          fileName: "Rental_Agreement_123.pdf",
          createdAt: "2023-03-15T10:30:00Z",
          summary:
            "This is a standard 12-month lease agreement with typical terms and conditions. Some clauses favor the landlord, particularly regarding maintenance responsibilities and early termination fees.",
          riskLevel: "medium",
          keyPoints: [
            {
              point: "Rent increases limited to 5% annually",
              type: "positive",
            },
            {
              point:
                "Security deposit is 2x monthly rent (higher than average)",
              type: "negative",
            },
            {
              point: "Tenant responsible for all minor repairs",
              type: "negative",
            },
            {
              point: "60-day notice required for non-renewal",
              type: "neutral",
            },
          ],
        },
        {
          id: "2",
          fileName: "Apartment_Lease_2023.pdf",
          createdAt: "2023-03-10T14:45:00Z",
          summary:
            "This agreement contains several tenant-friendly provisions, including reasonable notice periods and fair maintenance terms. The rent increase clause is well-defined and reasonable.",
          riskLevel: "low",
          keyPoints: [
            { point: "Rent increases capped at 3% annually", type: "positive" },
            {
              point:
                "Landlord responsible for all repairs except tenant damage",
              type: "positive",
            },
            {
              point: "30-day notice for entry (exceeds legal minimum)",
              type: "positive",
            },
            { point: "Pet deposit is refundable", type: "positive" },
          ],
        },
      ]);
    } catch (error) {
      console.error("Error fetching previous analyses:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load previous analyses.",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Check file type
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF, Word document, or text file.",
        });
        return;
      }

      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Maximum file size is 10MB.",
        });
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a file to upload.",
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      // Simulate file upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);

      // Start analysis
      await analyzeAgreement();
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description:
          "There was an error uploading your file. Please try again.",
      });
    }
  };

  const analyzeAgreement = async () => {
    try {
      setIsAnalyzing(true);

      // Simulate AI analysis delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock analysis result
      const mockAnalysis = {
        summary:
          "This rental agreement is generally balanced but contains some clauses that may be unfavorable to the tenant. The agreement is for a 12-month term with automatic renewal unless notice is given 60 days prior to expiration.",
        riskLevel: "medium",
        keyPoints: [
          { point: "Rent increases limited to 5% annually", type: "positive" },
          {
            point: "Security deposit is 2x monthly rent (higher than average)",
            type: "negative",
          },
          {
            point: "Tenant responsible for all minor repairs",
            type: "negative",
          },
          { point: "60-day notice required for non-renewal", type: "neutral" },
          {
            point: "Landlord can enter with 24-hour notice (legal minimum)",
            type: "neutral",
          },
        ],
        recommendations: [
          "Negotiate the security deposit amount down to 1-1.5x monthly rent",
          "Request clarification on what constitutes 'minor repairs' and set a dollar limit",
          "Consider requesting a more specific definition of 'normal wear and tear'",
          "The late fee structure may be excessive - consider negotiating this point",
        ],
        legalConcerns: [
          "The clause restricting all subletting without exception may not be enforceable in some jurisdictions",
          "The requirement for tenant to pay all legal fees regardless of outcome may be unenforceable",
        ],
      };

      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);

      // Add to previous analyses
      setPreviousAnalyses((prev) => [
        {
          id: Date.now().toString(),
          fileName: file?.name || "Unknown file",
          createdAt: new Date().toISOString(),
          ...mockAnalysis,
        },
        ...prev,
      ]);

      toast({
        title: "Analysis complete",
        description: "Your agreement has been analyzed successfully.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      setIsAnalyzing(false);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description:
          "There was an error analyzing your agreement. Please try again.",
      });
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return <Badge className="bg-green-500">Low Risk</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium Risk</Badge>;
      case "high":
        return <Badge className="bg-red-500">High Risk</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Agreement Analysis
        </h1>
        <p className="text-muted-foreground">
          Upload your rental agreement to get an AI-powered analysis and
          insights.
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Agreement</TabsTrigger>
          <TabsTrigger value="history">Analysis History</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Agreement</CardTitle>
              <CardDescription>
                Upload a rental agreement document (PDF, Word, or text) for AI
                analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="agreement">Agreement Document</Label>
                <Input
                  id="agreement"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  disabled={isUploading || isAnalyzing}
                />
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {file.name} (
                    {(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uploading...</span>
                    <span className="text-sm">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!file || isUploading || isAnalyzing}
                className="w-full sm:w-auto"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading
                  </>
                ) : isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload & Analyze
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {analysis && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Analysis Results</CardTitle>
                  {getRiskBadge(analysis.riskLevel)}
                </div>
                <CardDescription>Analysis of {file?.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    {analysis.summary}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Key Points</h3>
                  <ul className="space-y-2">
                    {analysis.keyPoints.map((point: any, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        {point.type === "positive" ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : point.type === "negative" ? (
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        )}
                        <span>{point.point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Recommendations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysis.recommendations.map(
                      (rec: string, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground"
                        >
                          {rec}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {analysis.legalConcerns &&
                  analysis.legalConcerns.length > 0 && (
                    <>
                      <Separator />

                      <div>
                        <h3 className="font-medium mb-2">
                          Potential Legal Concerns
                        </h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {analysis.legalConcerns.map(
                            (concern: string, index: number) => (
                              <li
                                key={index}
                                className="text-sm text-muted-foreground"
                              >
                                {concern}
                              </li>
                            )
                          )}
                        </ul>
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          Note: This is not legal advice. Consult with a
                          qualified attorney for legal guidance.
                        </p>
                      </div>
                    </>
                  )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {previousAnalyses.length > 0 ? (
            previousAnalyses.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{item.fileName}</CardTitle>
                    {getRiskBadge(item.riskLevel)}
                  </div>
                  <CardDescription>
                    Analyzed on {new Date(item.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.summary}
                  </p>

                  <h3 className="font-medium text-sm mb-2">Key Points</h3>
                  <ul className="space-y-2 mb-4">
                    {item.keyPoints.map((point: any, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        {point.type === "positive" ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : point.type === "negative" ? (
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        )}
                        <span>{point.point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">
                    View Full Analysis
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No previous analyses found
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    const uploadTab = document.querySelector('[data-value="upload"]');
                    if (uploadTab && uploadTab instanceof HTMLElement) {
                      uploadTab.click();
                    }
                  }}
                >
                  Upload an Agreement
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
