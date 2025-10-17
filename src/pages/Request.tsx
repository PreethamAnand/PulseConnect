import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function RequestPage() {
  const { toast } = useToast();
  const query = new URLSearchParams(useLocation().search);
  const presetType = query.get("type") as "blood" | "plasma" | null;
  const [requestType, setRequestType] = useState<"blood" | "plasma">(presetType || "blood");
  const [groupType, setGroupType] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [urgency, setUrgency] = useState("Normal");
  const [patientName, setPatientName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [componentType, setComponentType] = useState("");
  const [condition, setCondition] = useState("");

  useEffect(() => {
    // TODO: auto-fill via maps API
  }, []);

  const submitRequest = async () => {
    if (!patientName || !groupType || !quantity) {
      toast({ title: "Missing fields", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("requests").insert({
      request_type: requestType,
      group_type: groupType,
      quantity_ml: quantity,
      urgency,
      patient_name: patientName,
      hospital_name: hospitalName,
      location,
      notes,
      component_type: requestType === "plasma" ? componentType : null,
      condition: requestType === "plasma" ? condition : null,
    });
    if (error) {
      toast({ title: "Failed to create request", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Request created" });
      setPatientName("");
      setHospitalName("");
      setLocation("");
      setNotes("");
      setQuantity(0);
      setComponentType("");
      setCondition("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-3">
        <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">← Back to Home</Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Request Type</Label>
              <Select value={requestType} onValueChange={(v: any)=>setRequestType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blood">Blood</SelectItem>
                  <SelectItem value="plasma">Plasma</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Group</Label>
              <Input value={groupType} onChange={(e)=>setGroupType(e.target.value)} placeholder="e.g., A+, AB" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quantity (ml)</Label>
              <Input type="number" value={quantity} onChange={(e)=>setQuantity(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Urgency</Label>
              <Select value={urgency} onValueChange={setUrgency as any}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Patient Name</Label>
              <Input value={patientName} onChange={(e)=>setPatientName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Hospital / Clinic</Label>
              <Input value={hospitalName} onChange={(e)=>setHospitalName(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="Auto-fill coming soon" />
          </div>

          {requestType === "plasma" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plasma Component Type</Label>
                <Select value={componentType} onValueChange={setComponentType as any}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Platelets">Platelets</SelectItem>
                    <SelectItem value="RBC">RBC</SelectItem>
                    <SelectItem value="Plasma Cells">Plasma Cells</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Condition (optional)</Label>
                <Input value={condition} onChange={(e)=>setCondition(e.target.value)} placeholder="e.g., Dengue, Post-COVID" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <Textarea value={notes} onChange={(e)=>setNotes(e.target.value)} />
          </div>

          <div className="pt-2">
            <Button className="blood-btn" onClick={submitRequest}>Create Request</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


