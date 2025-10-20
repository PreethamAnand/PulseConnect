import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Phone, Building, Heart, Navigation, X } from "lucide-react";

interface MapMarker {
  id: string;
  name: string;
  address: string;
  contact: string;
  lat: number;
  lng: number;
  type: 'hospital' | 'blood_bank' | 'donation_center';
  available_blood_types?: string[];
  hours?: string;
}

// Custom marker component
const MapMarker = ({ 
  marker, 
  onClick, 
  isSelected 
}: { 
  marker: MapMarker; 
  onClick: () => void; 
  isSelected: boolean;
}) => {
  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'hospital': return 'bg-blue-500';
      case 'blood_bank': return 'bg-red-500';
      case 'donation_center': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'hospital': return '🏥';
      case 'blood_bank': return '🩸';
      case 'donation_center': return '❤️';
      default: return '📍';
    }
  };

  return (
    <div
      className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white text-sm cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-all duration-200 shadow-lg ${
        isSelected ? 'ring-4 ring-yellow-300 scale-110' : ''
      } ${getMarkerColor(marker.type)}`}
      style={{
        left: `${marker.lat}%`,
        top: `${marker.lng}%`,
      }}
      onClick={onClick}
      title={marker.name}
    >
      {getMarkerIcon(marker.type)}
    </div>
  );
};

export default function InteractiveMap() {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Sample data for hospitals and blood banks with percentage-based positioning
  const sampleMarkers: MapMarker[] = [
    {
      id: 'hosp-001',
      name: 'City General Hospital',
      address: '123 Medical Center Dr, Downtown',
      contact: '+1-555-0123',
      lat: 25, // Percentage from left
      lng: 30, // Percentage from top
      type: 'hospital',
      available_blood_types: ['A+', 'A-', 'B+', 'O+'],
      hours: '24/7 Emergency'
    },
    {
      id: 'hosp-002',
      name: 'Memorial Medical Center',
      address: '456 Health Plaza, North District',
      contact: '+1-555-0456',
      lat: 60,
      lng: 20,
      type: 'hospital',
      available_blood_types: ['A+', 'B+', 'AB+', 'O+', 'O-'],
      hours: '6 AM - 10 PM'
    },
    {
      id: 'hosp-003',
      name: 'St. Mary\'s Hospital',
      address: '789 Care Avenue, East Side',
      contact: '+1-555-0789',
      lat: 75,
      lng: 40,
      type: 'hospital',
      available_blood_types: ['A+', 'A-', 'B+', 'B-', 'AB+', 'O+'],
      hours: '24/7 Emergency'
    },
    {
      id: 'bb-001',
      name: 'Central Blood Bank',
      address: '321 Life Street, Central',
      contact: '+1-555-1001',
      lat: 40,
      lng: 50,
      type: 'blood_bank',
      available_blood_types: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      hours: '8 AM - 6 PM'
    },
    {
      id: 'dc-001',
      name: 'Community Donation Center',
      address: '654 Hope Avenue, West Side',
      contact: '+1-555-2002',
      lat: 20,
      lng: 60,
      type: 'donation_center',
      available_blood_types: ['A+', 'B+', 'O+'],
      hours: '9 AM - 5 PM'
    },
    {
      id: 'bb-002',
      name: 'Regional Blood Services',
      address: '987 Vital Way, South District',
      contact: '+1-555-3003',
      lat: 80,
      lng: 70,
      type: 'blood_bank',
      available_blood_types: ['A+', 'A-', 'B+', 'B-', 'AB+', 'O+', 'O-'],
      hours: '7 AM - 7 PM'
    }
  ];

  useEffect(() => {
    setMarkers(sampleMarkers);
  }, []);

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default location
          setUserLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    } else {
      // Default location
      setUserLocation({ lat: 40.7128, lng: -74.0060 });
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const filteredMarkers = markers.filter(marker =>
    marker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    marker.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    marker.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'hospital':
        return 'bg-blue-500';
      case 'blood_bank':
        return 'bg-red-500';
      case 'donation_center':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
    setShowPopup(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Interactive Map</h1>
        <p className="text-gray-500">Find hospitals, blood banks, and donation centers near you</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search and Filters */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Location Types</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Hospitals ({markers.filter(m => m.type === 'hospital').length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Blood Banks ({markers.filter(m => m.type === 'blood_bank').length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Donation Centers ({markers.filter(m => m.type === 'donation_center').length})</span>
                  </div>
                </div>
              </div>

              <Button onClick={getUserLocation} className="w-full">
                <Navigation className="h-4 w-4 mr-2" />
                Get My Location
              </Button>
            </CardContent>
          </Card>

          {/* Location List */}
          <Card>
            <CardHeader>
              <CardTitle>Nearby Locations</CardTitle>
              <CardDescription>
                {filteredMarkers.length} locations found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredMarkers.map((marker) => (
                  <div
                    key={marker.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedMarker?.id === marker.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleMarkerClick(marker)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${getMarkerColor(marker.type)}`}>
                        {marker.type === 'hospital' ? '🏥' : marker.type === 'blood_bank' ? '🩸' : '❤️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{marker.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{marker.address}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{marker.contact}</span>
                        </div>
                        {marker.hours && (
                          <p className="text-xs text-gray-500 mt-1">{marker.hours}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Interactive Map
              </CardTitle>
              <CardDescription>
                Click on markers to view details
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[500px] relative overflow-hidden">
              <div 
                ref={mapRef}
                className="w-full h-full relative bg-gradient-to-br from-blue-100 via-green-50 to-blue-100"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 40% 60%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)
                  `
                }}
              >
                {/* Map grid pattern */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}
                />
                
                {/* User location marker */}
                {userLocation && (
                  <div
                    className="absolute w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs cursor-pointer transform -translate-x-1/2 -translate-y-1/2 animate-pulse shadow-lg"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                    title="Your Location"
                  >
                    👤
                  </div>
                )}

                {/* Location markers */}
                {filteredMarkers.map((marker) => (
                  <MapMarker
                    key={marker.id}
                    marker={marker}
                    onClick={() => handleMarkerClick(marker)}
                    isSelected={selectedMarker?.id === marker.id}
                  />
                ))}

                {/* Map overlay with instructions */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="h-4 w-4" />
                    <span>Click markers to view details</span>
                  </div>
                </div>

                {/* Map legend */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Hospitals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Blood Banks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Donation Centers</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Popup Modal for Marker Details */}
      {showPopup && selectedMarker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {selectedMarker.name}
                </CardTitle>
                <CardDescription>{selectedMarker.address}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPopup(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Contact Information</h4>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{selectedMarker.contact}</span>
                </div>
                {selectedMarker.hours && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedMarker.hours}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Location Type</h4>
                <Badge className={getMarkerColor(selectedMarker.type)}>
                  {selectedMarker.type.replace('_', ' ').toUpperCase()}
                </Badge>
                {selectedMarker.available_blood_types && (
                  <div>
                    <h5 className="text-sm font-medium mb-1">Available Blood Types:</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedMarker.available_blood_types.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  Directions
                </Button>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 flex-1">
                  <Heart className="h-4 w-4 mr-1" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selected Location Details */}
      {selectedMarker && !showPopup && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {selectedMarker.name}
            </CardTitle>
            <CardDescription>{selectedMarker.address}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Contact Information</h4>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{selectedMarker.contact}</span>
                </div>
                {selectedMarker.hours && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedMarker.hours}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Location Type</h4>
                <Badge className={getMarkerColor(selectedMarker.type)}>
                  {selectedMarker.type.replace('_', ' ').toUpperCase()}
                </Badge>
                {selectedMarker.available_blood_types && (
                  <div>
                    <h5 className="text-sm font-medium mb-1">Available Blood Types:</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedMarker.available_blood_types.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Actions</h4>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <MapPin className="h-4 w-4 mr-1" />
                    Directions
                  </Button>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <Heart className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
