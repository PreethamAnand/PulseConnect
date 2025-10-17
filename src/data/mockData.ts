
export interface BloodRequest {
  id: string;
  patientName: string;
  bloodType: string;
  hospital: string;
  urgency: "Low" | "Medium" | "High" | "Critical";
  location: string;
  requiredUnits: number;
  createdAt: string;
  status: "Pending" | "In Progress" | "Fulfilled" | "Cancelled";
  description?: string;
}

export interface Donor {
  id: string;
  name: string;
  bloodType: string;
  location: string;
  lastDonation: string;
  contactNumber: string;
  status: "Available" | "Unavailable" | "Recently Donated";
  distance: number;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  contactNumber: string;
  availableBloodTypes: { type: string; units: number }[];
}

export interface BloodStatistics {
  type: string;
  available: number;
  required: number;
}

export const bloodRequests: BloodRequest[] = [
  {
    id: "BR001",
    patientName: "John Doe",
    bloodType: "A+",
    hospital: "City General Hospital",
    urgency: "High",
    location: "Downtown, City",
    requiredUnits: 3,
    createdAt: "2023-04-10T08:30:00Z",
    status: "Pending",
    description: "Patient needs blood for surgery scheduled tomorrow",
  },
  {
    id: "BR002",
    patientName: "Jane Smith",
    bloodType: "O-",
    hospital: "Memorial Hospital",
    urgency: "Critical",
    location: "North District, City",
    requiredUnits: 2,
    createdAt: "2023-04-10T09:15:00Z",
    status: "In Progress",
    description: "Emergency case, accident victim",
  },
  {
    id: "BR003",
    patientName: "Robert Johnson",
    bloodType: "B+",
    hospital: "St. Mary's Hospital",
    urgency: "Medium",
    location: "East Side, City",
    requiredUnits: 1,
    createdAt: "2023-04-09T14:20:00Z",
    status: "Fulfilled",
  },
  {
    id: "BR004",
    patientName: "Emily Williams",
    bloodType: "AB+",
    hospital: "City General Hospital",
    urgency: "Low",
    location: "Downtown, City",
    requiredUnits: 2,
    createdAt: "2023-04-08T11:45:00Z",
    status: "Pending",
  },
  {
    id: "BR005",
    patientName: "Michael Brown",
    bloodType: "A-",
    hospital: "Community Hospital",
    urgency: "High",
    location: "West End, City",
    requiredUnits: 3,
    createdAt: "2023-04-10T10:30:00Z",
    status: "In Progress",
    description: "Patient needs blood for major surgery",
  },
];

export const donors: Donor[] = [
  {
    id: "D001",
    name: "David Anderson",
    bloodType: "A+",
    location: "Downtown, City",
    lastDonation: "2023-01-15",
    contactNumber: "+1-123-456-7890",
    status: "Available",
    distance: 2.5,
  },
  {
    id: "D002",
    name: "Sarah Miller",
    bloodType: "O-",
    location: "North District, City",
    lastDonation: "2023-03-20",
    contactNumber: "+1-234-567-8901",
    status: "Recently Donated",
    distance: 5.2,
  },
  {
    id: "D003",
    name: "James Wilson",
    bloodType: "B+",
    location: "East Side, City",
    lastDonation: "2022-12-10",
    contactNumber: "+1-345-678-9012",
    status: "Available",
    distance: 3.7,
  },
  {
    id: "D004",
    name: "Lisa Taylor",
    bloodType: "AB+",
    location: "South Area, City",
    lastDonation: "2023-02-05",
    contactNumber: "+1-456-789-0123",
    status: "Available",
    distance: 7.1,
  },
  {
    id: "D005",
    name: "Daniel Martinez",
    bloodType: "A-",
    location: "West End, City",
    lastDonation: "2023-03-25",
    contactNumber: "+1-567-890-1234",
    status: "Unavailable",
    distance: 4.3,
  },
  {
    id: "D006",
    name: "Jennifer Garcia",
    bloodType: "O+",
    location: "Central District, City",
    lastDonation: "2023-01-30",
    contactNumber: "+1-678-901-2345",
    status: "Available",
    distance: 1.8,
  },
  {
    id: "D007",
    name: "Thomas Brown",
    bloodType: "B-",
    location: "University Area, City",
    lastDonation: "2022-11-15",
    contactNumber: "+1-789-012-3456",
    status: "Available",
    distance: 6.4,
  },
];

export const hospitals: Hospital[] = [
  {
    id: "H001",
    name: "City General Hospital",
    location: "123 Main St, Downtown, City",
    contactNumber: "+1-123-456-7000",
    availableBloodTypes: [
      { type: "A+", units: 15 },
      { type: "A-", units: 8 },
      { type: "B+", units: 12 },
      { type: "B-", units: 6 },
      { type: "AB+", units: 4 },
      { type: "AB-", units: 2 },
      { type: "O+", units: 20 },
      { type: "O-", units: 10 },
    ],
  },
  {
    id: "H002",
    name: "Memorial Hospital",
    location: "456 Oak Ave, North District, City",
    contactNumber: "+1-234-567-8000",
    availableBloodTypes: [
      { type: "A+", units: 10 },
      { type: "A-", units: 5 },
      { type: "B+", units: 8 },
      { type: "B-", units: 3 },
      { type: "AB+", units: 2 },
      { type: "AB-", units: 1 },
      { type: "O+", units: 15 },
      { type: "O-", units: 7 },
    ],
  },
  {
    id: "H003",
    name: "St. Mary's Hospital",
    location: "789 Pine Rd, East Side, City",
    contactNumber: "+1-345-678-9000",
    availableBloodTypes: [
      { type: "A+", units: 12 },
      { type: "A-", units: 6 },
      { type: "B+", units: 9 },
      { type: "B-", units: 4 },
      { type: "AB+", units: 3 },
      { type: "AB-", units: 2 },
      { type: "O+", units: 18 },
      { type: "O-", units: 8 },
    ],
  },
  {
    id: "H004",
    name: "Community Hospital",
    location: "321 Maple Dr, West End, City",
    contactNumber: "+1-456-789-0000",
    availableBloodTypes: [
      { type: "A+", units: 8 },
      { type: "A-", units: 4 },
      { type: "B+", units: 7 },
      { type: "B-", units: 3 },
      { type: "AB+", units: 2 },
      { type: "AB-", units: 1 },
      { type: "O+", units: 13 },
      { type: "O-", units: 6 },
    ],
  },
];

export const bloodStatistics: BloodStatistics[] = [
  { type: "A+", available: 45, required: 35 },
  { type: "A-", available: 23, required: 20 },
  { type: "B+", available: 36, required: 28 },
  { type: "B-", available: 16, required: 15 },
  { type: "AB+", available: 11, required: 8 },
  { type: "AB-", available: 6, required: 4 },
  { type: "O+", available: 66, required: 58 },
  { type: "O-", available: 31, required: 40 },
];

export const emergencyContacts = [
  { id: 1, name: "Emergency Services", number: "911" },
  { id: 2, name: "City General Hospital", number: "+1-123-456-7000" },
  { id: 3, name: "Blood Bank Hotline", number: "+1-800-RED-CROSS" },
  { id: 4, name: "Ambulance Services", number: "+1-800-AMBULANCE" },
  { id: 5, name: "Poison Control", number: "+1-800-222-1222" },
];
