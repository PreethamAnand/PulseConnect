
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map as MapIcon } from "lucide-react";

export default function Map() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Interactive Map</h1>
        <p className="text-gray-500">Find donors, hospitals, and blood banks near you</p>
      </div>
      
      <Card className="w-full h-[600px] flex items-center justify-center">
        <CardContent className="text-center p-6">
          <MapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <CardTitle className="mb-2">Interactive Map View</CardTitle>
          <CardDescription>
            This map would display donors, hospitals, and blood banks near your location.
          </CardDescription>
          <p className="text-sm text-gray-500 mt-4">
            In a real implementation, this would integrate with Google Maps or OpenStreetMap API
            to show real-time locations and directions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
