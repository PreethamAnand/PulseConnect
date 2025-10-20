
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sampleHospitals } from "@/data/sampleData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Search, Building } from "lucide-react";
type DbHospital = { id: string; name: string; address: string | null; contact: string | null };

export default function Hospitals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hospitals, setHospitals] = useState<DbHospital[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("hospitals").select("id, name, address, contact");
        // Use sample data if no real data available
        setHospitals((data && data.length > 0 ? data : sampleHospitals) as any);
      } catch (error) {
        console.error('Error loading hospitals:', error);
        // Fallback to sample data
        setHospitals(sampleHospitals as any);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (hospital.address || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hospitals & Blood Banks</h1>
        <p className="text-gray-500">Find information about hospitals and blood banks</p>
      </div>
      
      <div className="flex gap-2">
        <Input
          placeholder="Search by name or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Button className="medical-btn gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
      
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hospital) => (
              <Card key={hospital.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{hospital.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {hospital.address || "Address unavailable"}
                      </CardDescription>
                    </div>
                    <Building className="text-medical h-5 w-5" />
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center gap-1 text-sm mb-4">
                    <Phone className="h-3 w-3" />
                    <a href={`tel:${hospital.contact || ""}`} className="text-blue-500 hover:underline">
                      {hospital.contact || "N/A"}
                    </a>
                  </div>
                  <CardDescription>No inventory summary available</CardDescription>
                </CardContent>
                
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1">Get Directions</Button>
                  <Button className="medical-btn flex-1">Contact</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {loading && (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading hospitals...</p>
            </div>
          )}

          {!loading && filteredHospitals.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No hospitals matching your search.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="map">
          <Card className="w-full h-[500px] flex items-center justify-center">
            <CardContent className="text-center p-6">
              <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <CardTitle className="mb-2">Map View</CardTitle>
              <CardDescription>
                The interactive map will display hospitals and blood banks in this area.
              </CardDescription>
              <p className="text-sm text-gray-500 mt-4">
                In a real implementation, this would integrate with Google Maps or OpenStreetMap.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Removed fake Blood Availability Overview; can be re-enabled with real inventory */}
    </div>
  );
}
