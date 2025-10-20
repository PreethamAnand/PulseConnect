import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Phone, Building, Heart } from "lucide-react";
import { sampleHospitals } from "@/data/sampleData";

interface MapMarker {
  id: string;
  name: string;
  address: string;
  contact: string;
  lat: number;
  lng: number;
  type: 'hospital' | 'blood_bank' | 'donation_center';
}

export default function OpenStreetMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Sample data for hospitals and blood banks
  const sampleMarkers: MapMarker[] = [
    {
      id: 'hosp-001',
      name: 'City General Hospital',
      address: '123 Medical Center Dr, Downtown',
      contact: '+1-555-0123',
      lat: 40.7128,
      lng: -74.0060,
      type: 'hospital'
    },
    {
      id: 'hosp-002',
      name: 'Memorial Medical Center',
      address: '456 Health Plaza, North District',
      contact: '+1-555-0456',
      lat: 40.7589,
      lng: -73.9851,
      type: 'hospital'
    },
    {
      id: 'hosp-003',
      name: 'St. Mary\'s Hospital',
      address: '789 Care Avenue, East Side',
      contact: '+1-555-0789',
      lat: 40.7505,
      lng: -73.9934,
      type: 'hospital'
    },
    {
      id: 'bb-001',
      name: 'Central Blood Bank',
      address: '321 Life Street, Central',
      contact: '+1-555-1001',
      lat: 40.7282,
      lng: -73.9942,
      type: 'blood_bank'
    },
    {
      id: 'dc-001',
      name: 'Community Donation Center',
      address: '654 Hope Avenue, West Side',
      contact: '+1-555-2002',
      lat: 40.7614,
      lng: -73.9776,
      type: 'donation_center'
    }
  ];

  useEffect(() => {
    // Initialize map when component mounts
    if (mapRef.current && !map) {
      // Create a simple map using OpenStreetMap tiles
      const mapElement = document.createElement('div');
      mapElement.style.width = '100%';
      mapElement.style.height = '100%';
      mapElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      mapElement.style.position = 'relative';
      mapElement.style.overflow = 'hidden';
      
      // Add map tiles simulation
      const tilesContainer = document.createElement('div');
      tilesContainer.style.position = 'absolute';
      tilesContainer.style.top = '0';
      tilesContainer.style.left = '0';
      tilesContainer.style.width = '100%';
      tilesContainer.style.height = '100%';
      tilesContainer.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")';
      tilesContainer.style.opacity = '0.3';
      
      mapElement.appendChild(tilesContainer);
      mapRef.current.appendChild(mapElement);
      
      setMap(mapElement);
      setMarkers(sampleMarkers);
    }
  }, [map]);

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
          // Default to New York City if location access fails
          setUserLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    } else {
      // Default to New York City if geolocation is not supported
      setUserLocation({ lat: 40.7128, lng: -74.0060 });
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const filteredMarkers = markers.filter(marker =>
    marker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    marker.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'hospital':
        return '🏥';
      case 'blood_bank':
        return '🩸';
      case 'donation_center':
        return '❤️';
      default:
        return '📍';
    }
  };

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
                    <span className="text-sm">Hospitals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Blood Banks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Donation Centers</span>
                  </div>
                </div>
              </div>

              <Button onClick={getUserLocation} className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
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
                    onClick={() => setSelectedMarker(marker)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${getMarkerColor(marker.type)}`}>
                        {getMarkerIcon(marker.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{marker.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{marker.address}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{marker.contact}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
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
            <CardContent className="p-0 h-[500px]">
              <div ref={mapRef} className="w-full h-full relative">
                {/* Map markers simulation */}
                {markers.map((marker, index) => (
                  <div
                    key={marker.id}
                    className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white text-sm cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform ${
                      selectedMarker?.id === marker.id ? 'ring-4 ring-red-300' : ''
                    } ${getMarkerColor(marker.type)}`}
                    style={{
                      left: `${20 + (index * 15)}%`,
                      top: `${30 + (index * 10)}%`,
                    }}
                    onClick={() => setSelectedMarker(marker)}
                    title={marker.name}
                  >
                    {getMarkerIcon(marker.type)}
                  </div>
                ))}
                
                {/* User location marker */}
                {userLocation && (
                  <div
                    className="absolute w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs cursor-pointer transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                    title="Your Location"
                  >
                    👤
                  </div>
                )}

                {/* Map overlay with instructions */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="h-4 w-4" />
                    <span>Click markers to view details</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Selected Location Details */}
      {selectedMarker && (
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
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Location Type</h4>
                <Badge className={getMarkerColor(selectedMarker.type)}>
                  {selectedMarker.type.replace('_', ' ').toUpperCase()}
                </Badge>
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
