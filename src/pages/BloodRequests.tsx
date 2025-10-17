
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { createAppointment } from "@/lib/appointments";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Droplet, Filter, MapPin, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BloodRequest {
  id: string;
  patient_name: string;
  blood_group: string;
  hospital_name: string;
  urgency: string;
  location: string;
  quantity_ml: number;
  created_at: string;
  status: string;
  description?: string;
  hospital_id?: string;
}

export default function BloodRequests() {
  const { user, isGuest } = useAuth();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<BloodRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bloodTypeFilter, setBloodTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load requests from Supabase
  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      try {
        const { data: reqs, error } = await supabase
          .from('requests')
          .select('*')
          .eq('request_type', 'blood')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Filter to only show requests from registered hospitals
        const { data: hospitals } = await supabase
          .from('hospitals')
          .select('id, name');

        const hospitalNames = new Set((hospitals || []).map((h: any) => h.name));
        const hospitalIds = new Map((hospitals || []).map((h: any) => [h.name, h.id]));

        const filteredReqs = (reqs || []).filter((req: any) => 
          !req.hospital_name || hospitalNames.has(req.hospital_name)
        ).map((req: any) => ({
          ...req,
          hospital_id: hospitalIds.get(req.hospital_name) || req.hospital_id
        }));

        setRequests(filteredReqs);
        setFilteredRequests(filteredReqs);
      } catch (error) {
        console.error('Error loading requests:', error);
        toast({
          title: "Error",
          description: "Failed to load blood requests",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [toast]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterRequests(value, statusFilter, bloodTypeFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    filterRequests(searchTerm, value, bloodTypeFilter);
  };

  const handleBloodTypeFilter = (value: string) => {
    setBloodTypeFilter(value);
    filterRequests(searchTerm, statusFilter, value);
  };

  const filterRequests = (search: string, status: string, bloodType: string) => {
    let filtered = requests;

    if (search) {
      filtered = filtered.filter(
        (request) =>
          request.patient_name.toLowerCase().includes(search.toLowerCase()) ||
          request.hospital_name.toLowerCase().includes(search.toLowerCase()) ||
          request.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      filtered = filtered.filter((request) => request.status === status);
    }

    if (bloodType !== "all") {
      filtered = filtered.filter((request) => request.blood_group === bloodType);
    }

    setFilteredRequests(filtered);
  };

  const handleSubmitRequest = async () => {
    // This would create a new blood request
    // For now, just show a toast
    toast({
      title: "Blood request submitted",
      description: "Your request has been sent to nearby donors.",
      variant: "default",
    });
  };

  const handleDonate = async (request: BloodRequest) => {
    if (!user || isGuest) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to donate blood.",
        variant: "destructive",
      });
      return;
    }

    if (!request.hospital_id) {
      toast({
        title: "Error",
        description: "Hospital information not available for this request.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createAppointment({
        donorId: user.id,
        hospitalId: request.hospital_id,
        requestId: request.id,
        donationType: 'blood'
      });

      toast({
        title: "Donation Request Sent",
        description: `Your donation request has been sent to ${request.hospital_name}. They will contact you soon.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to send donation request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blood Requests</h1>
          <p className="text-gray-500">Manage and track blood donation requests</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="blood-btn">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Blood Request</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new blood donation request
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input id="patientName" placeholder="Enter patient name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select>
                    <SelectTrigger id="bloodType">
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="units">Required Units</Label>
                  <Input id="units" type="number" min="1" placeholder="Units" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hospital">Hospital</Label>
                <Input id="hospital" placeholder="Hospital name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Location" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select>
                  <SelectTrigger id="urgency">
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Additional Description</Label>
                <Textarea id="description" placeholder="Provide additional details" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button className="blood-btn" onClick={handleSubmitRequest}>Submit Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by patient, hospital, or location"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Status</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Fulfilled">Fulfilled</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={handleBloodTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Droplet className="h-4 w-4" />
                <span>Blood Type</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading blood requests...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <Card key={request.id} className={request.urgency === "Emergency" ? "border-red-500" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>{request.patient_name}</CardTitle>
                      <CardDescription>{request.hospital_name}</CardDescription>
                    </div>
                    <Badge
                      className={
                        request.urgency === "Emergency" ? "bg-red-500" :
                        request.urgency === "High" ? "bg-orange-500" :
                        request.urgency === "Medium" ? "bg-yellow-500" :
                        "bg-green-500"
                      }
                    >
                      {request.urgency}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Blood Type:</span>
                      <span className="text-sm font-bold text-red-600">{request.blood_group}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Required Units:</span>
                      <span className="text-sm">{request.quantity_ml}ml</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-1 mt-0.5 text-gray-500" />
                      <span className="text-sm text-gray-500">{request.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Date:</span>
                      <span className="text-sm text-gray-500">
                        {new Date(request.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {request.description && (
                      <div className="text-sm text-gray-600 border-t pt-2 mt-2">
                        {request.description}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="justify-between border-t pt-4">
                  <Badge variant="outline" className={
                    request.status === "Pending" ? "text-blue-500 border-blue-500" :
                    request.status === "In Progress" ? "text-orange-500 border-orange-500" :
                    request.status === "Fulfilled" ? "text-green-500 border-green-500" :
                    "text-gray-500 border-gray-500"
                  }>
                    {request.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Details</Button>
                    <Button 
                      size="sm" 
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleDonate(request)}
                    >
                      Donate
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No blood requests matching your filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
