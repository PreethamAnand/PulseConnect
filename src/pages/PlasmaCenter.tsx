import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PlasmaInventoryRow {
  hospital_id: string;
  plasma_type: string;
  units: number;
}

interface PlasmaRequestRow {
  id: string;
  patient_name: string;
  hospital_id: string;
  diagnosis: string | null;
  plasma_type: string;
  required_units: number;
  status: string;
  created_at: string;
}

export default function PlasmaCenter() {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<PlasmaInventoryRow[]>([]);
  const [requests, setRequests] = useState<PlasmaRequestRow[]>([]);
  const [newRequest, setNewRequest] = useState({
    patient_name: "",
    diagnosis: "",
    plasma_type: "AB",
    required_units: 1,
  });

  const loadData = async () => {
    const [{ data: inv }, { data: reqs }] = await Promise.all([
      supabase.from("plasma_inventory").select("hospital_id, plasma_type, units"),
      supabase.from("plasma_requests").select("id, patient_name, hospital_id, diagnosis, plasma_type, required_units, status, created_at").order("created_at", { ascending: false }),
    ]);
    setInventory(inv || []);
    setRequests(reqs || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    for (const row of inventory) {
      grouped[row.plasma_type] = (grouped[row.plasma_type] || 0) + row.units;
    }
    return Object.keys(grouped).map((k) => ({ type: k, units: grouped[k] }));
  }, [inventory]);

  const createRequest = async () => {
    if (!newRequest.patient_name) {
      toast({ title: "Missing patient name", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("plasma_requests").insert({
      patient_name: newRequest.patient_name,
      diagnosis: newRequest.diagnosis || null,
      plasma_type: newRequest.plasma_type,
      required_units: newRequest.required_units,
      hospital_id: null,
    });
    if (error) {
      toast({ title: "Failed to create request", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Plasma request created" });
      setNewRequest({ patient_name: "", diagnosis: "", plasma_type: "AB", required_units: 1 });
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Plasma Center</h1>
        <p className="text-gray-500">Manage plasma donors, requests, inventory, and blockchain status</p>
      </div>

      <Tabs defaultValue="inventory">
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">Plasma Inventory</TabsTrigger>
          <TabsTrigger value="requests">Plasma Requests</TabsTrigger>
          <TabsTrigger value="therapy">Plasma Therapy Tracker</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain Status</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Overall Plasma Inventory</CardTitle>
              <CardDescription>Aggregated by plasma type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="units" name="Units" fill="#3182CE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Plasma Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Label>Patient Name</Label>
                    <Input value={newRequest.patient_name} onChange={(e) => setNewRequest({ ...newRequest, patient_name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Diagnosis</Label>
                    <Input value={newRequest.diagnosis} onChange={(e) => setNewRequest({ ...newRequest, diagnosis: e.target.value })} />
                  </div>
                  <div>
                    <Label>Plasma Type</Label>
                    <Input value={newRequest.plasma_type} onChange={(e) => setNewRequest({ ...newRequest, plasma_type: e.target.value })} />
                  </div>
                  <div>
                    <Label>Required Units</Label>
                    <Input type="number" value={newRequest.required_units} onChange={(e) => setNewRequest({ ...newRequest, required_units: Number(e.target.value) })} />
                  </div>
                  <Button className="blood-btn" onClick={createRequest}>Create Request</Button>
                </div>

                <div className="space-y-4">
                  {requests.map((r) => (
                    <div key={r.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <div className="font-medium">{r.patient_name}</div>
                        <div className="text-sm text-gray-500">{r.diagnosis || "Unknown"} • {r.plasma_type} • {r.required_units} units</div>
                      </div>
                      <div className="text-sm text-gray-500">{r.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="therapy">
          <Card>
            <CardHeader>
              <CardTitle>Plasma Therapy Tracker</CardTitle>
              <CardDescription>Track assignment and transfusion progress</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for therapy flow; can be expanded with joins */}
              <p className="text-sm text-gray-600">Assign donations to requests and update therapy status.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockchain">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Verification</CardTitle>
              <CardDescription>Review recent donation transactions and verify on-chain</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">Verify on Blockchain</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


