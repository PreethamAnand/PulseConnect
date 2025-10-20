// Sample data for demonstration purposes
export const sampleHospitals = [
  {
    id: "hosp-001",
    name: "City General Hospital",
    address: "123 Medical Center Dr, Downtown",
    contact: "+1-555-0123",
    verified: true,
    created_at: "2024-01-15T08:00:00Z"
  },
  {
    id: "hosp-002", 
    name: "Memorial Medical Center",
    address: "456 Health Plaza, North District",
    contact: "+1-555-0456",
    verified: true,
    created_at: "2024-01-20T10:30:00Z"
  },
  {
    id: "hosp-003",
    name: "St. Mary's Hospital",
    address: "789 Care Avenue, East Side",
    contact: "+1-555-0789",
    verified: true,
    created_at: "2024-02-01T14:15:00Z"
  }
];

export const sampleBloodRequests = [
  {
    id: "req-001",
    patient_name: "John Smith",
    blood_group: "A+",
    hospital_name: "City General Hospital",
    urgency: "Emergency",
    location: "Downtown Medical District",
    quantity_ml: 500,
    created_at: "2024-01-15T09:30:00Z",
    status: "Pending",
    description: "Emergency surgery patient needs blood transfusion",
    hospital_id: "hosp-001"
  },
  {
    id: "req-002",
    patient_name: "Sarah Johnson",
    blood_group: "O-",
    hospital_name: "Memorial Medical Center", 
    urgency: "High",
    location: "North District",
    quantity_ml: 300,
    created_at: "2024-01-16T11:45:00Z",
    status: "In Progress",
    description: "Cancer patient requiring blood during treatment",
    hospital_id: "hosp-002"
  },
  {
    id: "req-003",
    patient_name: "Michael Brown",
    blood_group: "B+",
    hospital_name: "St. Mary's Hospital",
    urgency: "Medium",
    location: "East Side",
    quantity_ml: 250,
    created_at: "2024-01-17T08:20:00Z",
    status: "Pending",
    description: "Scheduled surgery next week",
    hospital_id: "hosp-003"
  },
  {
    id: "req-004",
    patient_name: "Emily Davis",
    blood_group: "AB+",
    hospital_name: "City General Hospital",
    urgency: "Low",
    location: "Downtown",
    quantity_ml: 200,
    created_at: "2024-01-18T15:10:00Z",
    status: "Fulfilled",
    description: "Regular blood transfusion for chronic condition",
    hospital_id: "hosp-001"
  }
];

export const samplePlasmaRequests = [
  {
    id: "plasma-001",
    patient_name: "Robert Wilson",
    plasma_type: "Convalescent",
    component_type: "Platelets",
    hospital_name: "City General Hospital",
    urgency: "High",
    location: "Downtown",
    quantity_ml: 400,
    condition: "Post-COVID Recovery",
    created_at: "2024-01-15T10:00:00Z",
    status: "Pending",
    hospital_id: "hosp-001"
  },
  {
    id: "plasma-002",
    patient_name: "Lisa Anderson",
    plasma_type: "Fresh Frozen",
    component_type: "RBC",
    hospital_name: "Memorial Medical Center",
    urgency: "Emergency",
    location: "North District",
    quantity_ml: 600,
    condition: "Dengue Fever",
    created_at: "2024-01-16T12:30:00Z",
    status: "In Progress",
    hospital_id: "hosp-002"
  }
];

export const sampleDonors = [
  {
    id: "donor-001",
    first_name: "David",
    last_name: "Miller",
    blood_type: "A+",
    is_available: true,
    location_sharing: true,
    last_donation_date: "2024-01-01T00:00:00Z",
    next_eligible_date: "2024-02-26T00:00:00Z"
  },
  {
    id: "donor-002",
    first_name: "Jennifer",
    last_name: "Garcia",
    blood_type: "O-",
    is_available: true,
    location_sharing: true,
    last_donation_date: "2024-01-10T00:00:00Z",
    next_eligible_date: "2024-03-06T00:00:00Z"
  },
  {
    id: "donor-003",
    first_name: "Christopher",
    last_name: "Lee",
    blood_type: "B+",
    is_available: false,
    location_sharing: false,
    last_donation_date: "2024-01-20T00:00:00Z",
    next_eligible_date: "2024-03-16T00:00:00Z"
  },
  {
    id: "donor-004",
    first_name: "Amanda",
    last_name: "Taylor",
    blood_type: "AB+",
    is_available: true,
    location_sharing: true,
    last_donation_date: "2024-01-05T00:00:00Z",
    next_eligible_date: "2024-03-01T00:00:00Z"
  }
];

export const sampleAppointments = [
  {
    id: "appt-001",
    donor_id: "donor-001",
    donor_name: "David Miller",
    hospital_id: "hosp-001",
    hospital_name: "City General Hospital",
    request_id: "req-001",
    donation_type: "blood",
    appointment_date: "2024-01-20T10:00:00Z",
    status: "pending",
    created_at: "2024-01-15T09:45:00Z"
  },
  {
    id: "appt-002",
    donor_id: "donor-002",
    donor_name: "Jennifer Garcia",
    hospital_id: "hosp-002",
    hospital_name: "Memorial Medical Center",
    request_id: "req-002",
    donation_type: "blood",
    appointment_date: "2024-01-21T14:30:00Z",
    status: "accepted",
    created_at: "2024-01-16T12:00:00Z"
  }
];

export const samplePlasmaInventory = [
  { plasma_type: "Convalescent", units: 15 },
  { plasma_type: "Fresh Frozen", units: 8 },
  { plasma_type: "Platelets", units: 12 },
  { plasma_type: "RBC", units: 6 }
];

export const sampleBloodInventory = [
  { type: "A+", units: 25 },
  { type: "A-", units: 8 },
  { type: "B+", units: 15 },
  { type: "B-", units: 5 },
  { type: "AB+", units: 12 },
  { type: "AB-", units: 3 },
  { type: "O+", units: 30 },
  { type: "O-", units: 10 }
];

export const sampleBlockchainTransactions = [
  {
    id: "tx-001",
    donor_id: "donor-001",
    hospital_id: "hosp-001",
    donation_type: "blood",
    tx_hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    network: "polygon",
    status: "recorded",
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "tx-002",
    donor_id: "donor-002",
    hospital_id: "hosp-002",
    donation_type: "plasma",
    tx_hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    network: "polygon",
    status: "recorded",
    created_at: "2024-01-16T15:45:00Z"
  }
];

export const sampleProfiles = [
  {
    id: "profile-001",
    first_name: "David",
    last_name: "Miller",
    blood_type: "A+",
    phone: "+1-555-1001",
    is_available: true,
    last_donation_date: "2024-01-01T00:00:00Z",
    next_eligible_date: "2024-02-26T00:00:00Z",
    donation_type: "blood",
    is_mobile_verified: true,
    two_factor_enabled: true
  },
  {
    id: "profile-002",
    first_name: "Jennifer",
    last_name: "Garcia",
    blood_type: "O-",
    phone: "+1-555-1002",
    is_available: true,
    last_donation_date: "2024-01-10T00:00:00Z",
    next_eligible_date: "2024-03-06T00:00:00Z",
    donation_type: "plasma",
    is_mobile_verified: true,
    two_factor_enabled: false
  }
];

export const sampleStats = {
  totalDonors: 1247,
  availableDonors: 892,
  totalHospitals: 23,
  totalRequests: 156,
  pendingRequests: 23,
  criticalRequests: 8,
  totalDonations: 2341,
  blockchainTransactions: 1892
};
