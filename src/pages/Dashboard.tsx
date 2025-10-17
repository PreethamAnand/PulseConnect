
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Live data replaces mockData
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
// duplicate imports removed
import { AreaChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, Bar, ResponsiveContainer, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Droplet, User, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyDonationOnChain } from "@/lib/blockchain";

// Format data for charts
const useLiveDashboardData = () => {
  const [bloodTypeData, setBloodTypeData] = useState<{ name: string; available: number; required: number }[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [totals, setTotals] = useState({ totalDonors: 0, availableDonors: 0 });

  useEffect(() => {
    const load = async () => {
      const [{ data: profiles }, { data: reqs }, { data: hospitals }] = await Promise.all([
        supabase.from('profiles').select('id, is_available'),
        supabase.from('requests').select('id, urgency, request_type, patient_name, hospital_name, blood_group, quantity_ml, status, created_at'),
        supabase.from('hospitals').select('id, name'),
      ]);
      
      // Filter requests to only show those from registered hospitals
      const hospitalNames = new Set((hospitals || []).map((h: any) => h.name));
      const filteredRequests = (reqs || []).filter((req: any) => 
        !req.hospital_name || hospitalNames.has(req.hospital_name)
      );
      
      setTotals({
        totalDonors: profiles?.length || 0,
        availableDonors: (profiles || []).filter((p: any) => p.is_available).length,
      });
      setRequests(filteredRequests);
      // Placeholder for blood availability aggregation (requires an inventory table)
      setBloodTypeData([]);
    };
    load();
  }, []);

  const urgencyData = useMemo(() => {
    const count: Record<string, number> = { Low: 0, Medium: 0, High: 0, Emergency: 0 };
    for (const r of requests) count[r.urgency] = (count[r.urgency] || 0) + 1;
    return Object.keys(count).map((k) => ({ name: k, count: count[k] }));
  }, [requests]);

  const pendingRequests = useMemo(() => requests.length, [requests]);
  const criticalRequests = useMemo(() => requests.filter((r) => r.urgency === 'Emergency').length, [requests]);

  return { bloodTypeData, urgencyData, totals, pendingRequests, criticalRequests, requests };
};

export default function Dashboard() {
  const { bloodTypeData, urgencyData, totals, pendingRequests, criticalRequests, requests } = useLiveDashboardData();
  const [plasmaInventory, setPlasmaInventory] = useState<{ plasma_type: string; units: number }[]>([]);

  useEffect(() => {
    const loadPlasma = async () => {
      const { data } = await supabase.from("plasma_inventory").select("plasma_type, units");
      setPlasmaInventory(data || []);
    };
    loadPlasma();
  }, []);

  const plasmaChartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    for (const row of plasmaInventory) {
      grouped[row.plasma_type] = (grouped[row.plasma_type] || 0) + row.units;
    }
    return Object.keys(grouped).map((k) => ({ type: k, units: grouped[k] }));
  }, [plasmaInventory]);
  
  // Calculate total counts
  const totalDonors = totals.totalDonors;
  const availableDonors = totals.availableDonors;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Blood Connect Dashboard</h1>
        <p className="text-gray-500">Overview of blood donation and requests</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalDonors}</div>
              <Users className="text-medical" />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {availableDonors} currently available
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{pendingRequests}</div>
              <Droplet className="text-blood" />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Last 24 hours
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Critical Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{criticalRequests}</div>
              <AlertCircle className="text-blood-dark" />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Needs immediate attention
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Blood Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">48</div>
              <User className="text-medical-dark" />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              This month
            </div>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  // Demo call: in real flow, pass actual donor/hospital IDs
                  const tx = await verifyDonationOnChain(
                    { donorId: null, hospitalId: null, donationType: "blood", status: "completed" },
                    { rpcUrl: (import.meta as any).env.VITE_POLYGON_RPC_URL || "", privateKey: (import.meta as any).env.VITE_POLYGON_PRIVATE_KEY || "" }
                  );
                  console.log("Recorded on-chain:", tx);
                  alert(`Recorded on Polygon: ${tx}`);
                }}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" /> Verify on Blockchain
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="bloodAvailability">
        <TabsList className="mb-4">
          <TabsTrigger value="bloodAvailability">Blood Availability</TabsTrigger>
          <TabsTrigger value="requestUrgency">Request Urgency</TabsTrigger>
          <TabsTrigger value="recentRequests">Recent Requests</TabsTrigger>
          <TabsTrigger value="plasmaAvailability">Plasma Availability</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bloodAvailability">
          <Card>
            <CardHeader>
              <CardTitle>Blood Type Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={bloodTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="available" name="Available Units" fill="#3182CE" />
                  <Bar dataKey="required" name="Required Units" fill="#E53E3E" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requestUrgency">
          <Card>
            <CardHeader>
              <CardTitle>Request Urgency Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={urgencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" name="Number of Requests" stroke="#E53E3E" fill="#FEB2B2" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recentRequests">
          <Card>
            <CardHeader>
              <CardTitle>Recent Blood Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="font-medium">{request.patient_name ?? 'Patient'}</div>
                      <div className="text-sm text-gray-500">
                        {request.hospital ?? 'Hospital'} • {request.blood_group ?? request.request_type?.toUpperCase()} • {request.quantity_ml ?? '-'} ml
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plasmaAvailability">
          <Card>
            <CardHeader>
              <CardTitle>Plasma Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={plasmaChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="units" name="Units" fill="#805AD5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Live Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">This pulls from the unified requests table.</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
