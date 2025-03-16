"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import {
  Home,
  User,
  MessageSquare,
  Send,
  Paperclip,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  MapPin,
  ChevronRight,
  Plus,
} from "lucide-react";

export default function NegotiationsPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Negotiations</h1>
        <p className="text-muted-foreground">
          {userType === "landlord"
            ? "Negotiate terms with potential tenants"
            : "Negotiate terms with landlords"}
        </p>
      </div>

      <NegotiationInterface userType={userType} userId={user.id} />
    </div>
  );
}

function NegotiationInterface({
  userType,
  userId,
}: {
  userType: string;
  userId: string;
}) {
  // Sample negotiation data - would come from API in real app
  const negotiations = [
    {
      id: "1",
      propertyId: "1",
      propertyTitle: "2 Bedroom Apartment",
      propertyAddress: "123 Main St, Anytown",
      landlordId: "landlord-1",
      landlordName: "Robert Brown",
      tenantId: "tenant-1",
      tenantName: "John Doe",
      status: "active",
      lastMessageTime: new Date(2023, 5, 15, 14, 30), // June 15, 2023, 2:30 PM
      unreadCount: 2,
      terms: [
        {
          id: "term-1",
          title: "Monthly Rent",
          value: "$1,200",
          status: "proposed",
        },
        {
          id: "term-2",
          title: "Security Deposit",
          value: "$1,200",
          status: "agreed",
        },
        {
          id: "term-3",
          title: "Lease Duration",
          value: "12 months",
          status: "proposed",
        },
        {
          id: "term-4",
          title: "Move-in Date",
          value: "July 1, 2023",
          status: "proposed",
        },
      ],
    },
    {
      id: "2",
      propertyId: "2",
      propertyTitle: "3 Bedroom House",
      propertyAddress: "456 Oak Ave, Somewhere",
      landlordId: "landlord-2",
      landlordName: "Mary Johnson",
      tenantId: "tenant-2",
      tenantName: "Jane Smith",
      status: "active",
      lastMessageTime: new Date(2023, 5, 14, 10, 15), // June 14, 2023, 10:15 AM
      unreadCount: 0,
      terms: [
        {
          id: "term-5",
          title: "Monthly Rent",
          value: "$2,000",
          status: "agreed",
        },
        {
          id: "term-6",
          title: "Security Deposit",
          value: "$2,000",
          status: "agreed",
        },
        {
          id: "term-7",
          title: "Lease Duration",
          value: "24 months",
          status: "disagreed",
        },
        {
          id: "term-8",
          title: "Move-in Date",
          value: "August 15, 2023",
          status: "proposed",
        },
      ],
    },
    {
      id: "3",
      propertyId: "3",
      propertyTitle: "Studio Apartment",
      propertyAddress: "789 Pine St, Elsewhere",
      landlordId: "landlord-3",
      landlordName: "David Wilson",
      tenantId: "tenant-3",
      tenantName: "Michael Johnson",
      status: "completed",
      lastMessageTime: new Date(2023, 5, 10, 16, 45), // June 10, 2023, 4:45 PM
      unreadCount: 0,
      terms: [
        {
          id: "term-9",
          title: "Monthly Rent",
          value: "$800",
          status: "agreed",
        },
        {
          id: "term-10",
          title: "Security Deposit",
          value: "$800",
          status: "agreed",
        },
        {
          id: "term-11",
          title: "Lease Duration",
          value: "12 months",
          status: "agreed",
        },
        {
          id: "term-12",
          title: "Move-in Date",
          value: "July 15, 2023",
          status: "agreed",
        },
      ],
    },
  ];

  // Sample messages for a negotiation
  const messages = [
    {
      id: "msg-1",
      negotiationId: "1",
      senderId: "landlord-1",
      senderName: "Robert Brown",
      senderType: "landlord",
      content:
        "Hello John, thank you for your interest in the 2 Bedroom Apartment. I've proposed some initial terms for the lease. Please let me know if they work for you.",
      timestamp: new Date(2023, 5, 14, 9, 0), // June 14, 2023, 9:00 AM
      isRead: true,
    },
    {
      id: "msg-2",
      negotiationId: "1",
      senderId: "tenant-1",
      senderName: "John Doe",
      senderType: "tenant",
      content:
        "Hi Robert, thanks for the proposal. The monthly rent and security deposit look good, but I was hoping for a shorter lease duration, maybe 6 months with an option to extend?",
      timestamp: new Date(2023, 5, 14, 10, 30), // June 14, 2023, 10:30 AM
      isRead: true,
    },
    {
      id: "msg-3",
      negotiationId: "1",
      senderId: "landlord-1",
      senderName: "Robert Brown",
      senderType: "landlord",
      content:
        "I typically prefer a 12-month lease for stability, but I could consider a 9-month lease as a compromise. Would that work for you?",
      timestamp: new Date(2023, 5, 14, 14, 15), // June 14, 2023, 2:15 PM
      isRead: true,
    },
    {
      id: "msg-4",
      negotiationId: "1",
      senderId: "tenant-1",
      senderName: "John Doe",
      senderType: "tenant",
      content:
        "A 9-month lease would work for me. Also, is the move-in date flexible? I was hoping to move in by June 25th if possible.",
      timestamp: new Date(2023, 5, 15, 11, 45), // June 15, 2023, 11:45 AM
      isRead: true,
    },
    {
      id: "msg-5",
      negotiationId: "1",
      senderId: "landlord-1",
      senderName: "Robert Brown",
      senderType: "landlord",
      content:
        "I can make June 25th work for the move-in date. I'll update the terms accordingly. Is there anything else you'd like to discuss?",
      timestamp: new Date(2023, 5, 15, 14, 30), // June 15, 2023, 2:30 PM
      isRead: false,
    },
  ];

  const [selectedNegotiation, setSelectedNegotiation] = useState<string | null>(
    null
  );
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  // Filter negotiations based on tab and user type
  const filteredNegotiations = negotiations.filter((negotiation) => {
    const isActive = negotiation.status === "active";
    const isCompleted = negotiation.status === "completed";

    if (activeTab === "active") {
      return isActive;
    } else if (activeTab === "completed") {
      return isCompleted;
    }
    return true;
  });

  // Get the selected negotiation details
  const currentNegotiation = negotiations.find(
    (n) => n.id === selectedNegotiation
  );

  // Get messages for the selected negotiation
  const negotiationMessages = messages.filter(
    (m) => m.negotiationId === selectedNegotiation
  );

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedNegotiation) return;

    // In a real app, this would send the message to the API
    console.log(
      "Sending message:",
      newMessage,
      "to negotiation:",
      selectedNegotiation
    );

    // Clear the input
    setNewMessage("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Negotiations List */}
      <Card className="md:col-span-1">
        <CardHeader className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Conversations</CardTitle>
            <Tabs defaultValue="active" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredNegotiations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No {activeTab} negotiations found.
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-300px)]">
              {filteredNegotiations.map((negotiation) => (
                <div
                  key={negotiation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${
                    selectedNegotiation === negotiation.id
                      ? "bg-gray-50 dark:bg-slate-800"
                      : ""
                  }`}
                  onClick={() => setSelectedNegotiation(negotiation.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                      <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">
                          {negotiation.propertyTitle}
                        </h3>
                        {negotiation.unreadCount > 0 && (
                          <Badge variant="default" className="ml-2">
                            {negotiation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {userType === "landlord"
                          ? negotiation.tenantName
                          : negotiation.landlordName}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {format(negotiation.lastMessageTime, "MMM d, h:mm a")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Chat and Terms */}
      {selectedNegotiation && currentNegotiation ? (
        <Card className="md:col-span-2">
          <CardHeader className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">
                  {currentNegotiation.propertyTitle}
                </CardTitle>
                <Badge
                  variant={
                    currentNegotiation.status === "active"
                      ? "default"
                      : "secondary"
                  }
                >
                  {currentNegotiation.status.charAt(0).toUpperCase() +
                    currentNegotiation.status.slice(1)}
                </Badge>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/dashboard/properties/${currentNegotiation.propertyId}`}
                >
                  View Property
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {currentNegotiation.propertyAddress}
            </p>
          </CardHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-300px)]">
            {/* Chat Area */}
            <div className="lg:col-span-2 border-r flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {negotiationMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderType === userType
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.senderType === userType
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 dark:bg-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {message.senderName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">
                            {message.senderName}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                        <div className="flex justify-end mt-1">
                          <span className="text-xs opacity-70">
                            {format(message.timestamp, "h:mm a")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {currentNegotiation.status === "active" && (
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" type="button">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Terms Area */}
            <div className="hidden lg:block">
              <div className="p-4 border-b">
                <h3 className="font-medium">Negotiated Terms</h3>
              </div>
              <ScrollArea className="h-[calc(100vh-400px)] p-4">
                <div className="space-y-4">
                  {currentNegotiation.terms.map((term) => (
                    <div key={term.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {term.title}
                        </span>
                        <Badge
                          variant={
                            term.status === "agreed"
                              ? "default"
                              : term.status === "disagreed"
                              ? "destructive"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {term.status.charAt(0).toUpperCase() +
                            term.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{term.value}</span>
                        {currentNegotiation.status === "active" && (
                          <div className="flex gap-1">
                            {term.status !== "agreed" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                              >
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
                            {term.status !== "disagreed" &&
                              term.status !== "agreed" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                >
                                  <XCircle className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                          </div>
                        )}
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>

                {currentNegotiation.status === "active" && (
                  <div className="mt-6">
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Propose New Term
                    </Button>
                  </div>
                )}

                {currentNegotiation.status === "active" && (
                  <div className="mt-6">
                    <Button className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Create Agreement
                    </Button>
                  </div>
                )}

                {currentNegotiation.status === "completed" && (
                  <div className="mt-6">
                    <Button asChild>
                      <Link href="/dashboard/agreements">
                        View Agreement
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="md:col-span-2 flex items-center justify-center">
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No Conversation Selected
            </h3>
            <p className="text-muted-foreground">
              Select a conversation from the list to view messages and negotiate
              terms.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
