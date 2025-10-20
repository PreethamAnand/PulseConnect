
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { User, Heart, Shield, Clock, CalendarDays, Camera, Droplet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

export default function Profile() {
  const { profile, loading, updateProfile } = useProfile();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91');
  const [address, setAddress] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [lastDonation, setLastDonation] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [medications, setMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [availability, setAvailability] = useState(true);
  const [scheduleType, setScheduleType] = useState<'blood' | 'plasma'>('blood');
  const [scheduleDate, setScheduleDate] = useState('');
  const [eligibility, setEligibility] = useState<'green' | 'yellow' | 'red'>('green');
  const [nextEligible, setNextEligible] = useState<string | null>(null);

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '+91');
      setAddress(profile.address || '');
      setBloodType(profile.blood_type || '');
      setLastDonation(profile.last_donation_date || '');
      setMedicalConditions(profile.medical_conditions || '');
      setMedications(profile.medications || '');
      setAllergies(profile.allergies || '');
      setEmailNotifications(profile.email_notifications ?? true);
      setSmsNotifications(profile.sms_notifications ?? true);
      setLocationSharing(profile.location_sharing ?? true);
      setAvailability(profile.is_available ?? true);
    }
  }, [profile]);

  const handleSave = () => {
    updateProfile({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address,
      blood_type: bloodType,
      last_donation_date: lastDonation,
      medical_conditions: medicalConditions,
      medications,
      allergies,
      email_notifications: emailNotifications,
      sms_notifications: smsNotifications,
      location_sharing: locationSharing,
      is_available: availability,
    });
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    try {
      // Delete user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Delete user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (authError) {
        // If admin delete fails, try user delete
        const { error: userDeleteError } = await supabase.rpc('delete_user');
        if (userDeleteError) throw userDeleteError;
      }

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
        variant: "default",
      });

      // Sign out and redirect
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please contact support.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Simple heuristic for plasma eligibility demo
    // If user has medical condition flagged 'pref_plasma', treat as eligible; otherwise neutral
    if (medicalConditions?.toLowerCase().includes('pref_plasma')) {
      setEligibility('green');
    } else if (medicalConditions) {
      setEligibility('yellow');
    } else {
      setEligibility('green');
    }
  }, [medicalConditions]);

  useEffect(() => {
    const loadCooldown = async () => {
      if (!user?.id) return;
      const { data } = await supabase.from('donors').select('next_eligible_date').eq('user_id', user.id).single();
      setNextEligible(data?.next_eligible_date ?? null);
    };
    loadCooldown();
  }, [user?.id]);

  const scheduleDonation = async () => {
    if (!scheduleDate) {
      toast({ title: 'Select a date', variant: 'destructive' });
      return;
    }
    // For demo: insert into plasma_donations when plasma, otherwise just toast
    if (scheduleType === 'plasma') {
      const { error } = await supabase.from('plasma_donations').insert({
        donor_id: user?.id || null,
        hospital_id: user?.id || null, // placeholder; wire your hospital selection
        plasma_type: 'AB',
        donation_volume_ml: 500,
        extracted_date: scheduleDate,
        expiry_date: new Date(new Date(scheduleDate).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        component_status: 'reserved',
      } as any);
      if (error) {
        toast({ title: 'Failed to schedule plasma donation', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Plasma donation scheduled' });
      }
    } else {
      toast({ title: 'Blood donation scheduled' });
    }
    setScheduleDate('');
  };

  const handlePhoneChange = (value: string) => {
    // Ensure +91 prefix is always present
    if (!value.startsWith('+91')) {
      setPhone('+91' + value.replace(/^\+91/, ''));
    } else {
      // Limit to 13 characters (+91 + 10 digits)
      if (value.length <= 13) {
        setPhone(value);
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-500">Manage your personal information and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 relative group cursor-pointer">
              <User className="h-12 w-12 text-gray-500" />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold">{firstName} {lastName}</h3>
            <p className="text-gray-500">Blood Type: {bloodType || 'Not specified'}</p>
            <div className="mt-4 w-full">
              <div className="flex justify-between text-sm py-2 border-b">
                <span className="font-medium">Member Since</span>
                <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b">
                <span className="font-medium">Last Donation</span>
                <span>{lastDonation ? new Date(lastDonation).toLocaleDateString() : 'Never'}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b">
                <span className="font-medium">Total Donations</span>
                <span>5 times</span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="font-medium">Status</span>
                <span className={availability ? "text-green-500" : "text-red-500"}>
                  {availability ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Edit Profile Picture</Button>
          </CardFooter>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal">
              <TabsList className="mb-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="medical">Medical</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+91XXXXXXXXXX"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="medical" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Select value={bloodType} onValueChange={setBloodType}>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastDonation">Last Donation Date</Label>
                    <Input 
                      id="lastDonation" 
                      type="date" 
                      value={lastDonation}
                      onChange={(e) => setLastDonation(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medicalConditions">Medical Conditions</Label>
                  <Input 
                    id="medicalConditions" 
                    placeholder="List any medical conditions"
                    value={medicalConditions}
                    onChange={(e) => setMedicalConditions(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Input 
                    id="medications" 
                    placeholder="List any medications you're taking"
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Input 
                    id="allergies" 
                    placeholder="List any allergies"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="preferences" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive email notifications for new blood requests</p>
                    </div>
                    <Switch 
                      id="notifications" 
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms">SMS Alerts</Label>
                      <p className="text-sm text-gray-500">Receive text messages for urgent blood requests</p>
                    </div>
                    <Switch 
                      id="sms" 
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="location">Share Location</Label>
                      <p className="text-sm text-gray-500">Allow the app to access your location</p>
                    </div>
                    <Switch 
                      id="location" 
                      checked={locationSharing}
                      onCheckedChange={setLocationSharing}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="availability">Available for Donation</Label>
                      <p className="text-sm text-gray-500">Mark yourself as available for blood donation</p>
                    </div>
                    <Switch 
                      id="availability" 
                      checked={availability}
                      onCheckedChange={setAvailability}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div>
                      <Label>Schedule Type</Label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="radio" name="scheduleType" checked={scheduleType==='blood'} onChange={() => setScheduleType('blood')} /> Blood
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="radio" name="scheduleType" checked={scheduleType==='plasma'} onChange={() => setScheduleType('plasma')} /> Plasma
                        </label>
                      </div>
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input type="date" value={scheduleDate} onChange={(e)=>setScheduleDate(e.target.value)} />
                    </div>
                    <div className="flex items-end">
                      <Button className="blood-btn w-full" onClick={scheduleDonation}>
                        <CalendarDays className="mr-2 h-4 w-4" /> Schedule Donation
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button className="blood-btn" onClick={handleSave}>Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-blood" /> Donation History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-3">
                <div className="flex justify-between">
                  <span className="font-medium">City General Hospital</span>
                  <span className="text-sm text-gray-500">March 15, 2023</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Donated 1 unit of A+ blood</p>
              </div>
              <div className="border-b pb-3">
                <div className="flex justify-between">
                  <span className="font-medium">Blood Drive Event</span>
                  <span className="text-sm text-gray-500">December 10, 2022</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Donated 1 unit of A+ blood</p>
              </div>
              <div className="border-b pb-3">
                <div className="flex justify-between">
                  <span className="font-medium">Memorial Hospital</span>
                  <span className="text-sm text-gray-500">September 5, 2022</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Donated 1 unit of A+ blood</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="w-full">View Complete History</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-medical" /> Health Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Eligibility Status</span>
                <span className={`text-sm ${eligibility==='green'?'text-green-500':eligibility==='yellow'?'text-yellow-500':'text-red-500'}`}>
                  {eligibility==='green'?'Eligible':eligibility==='yellow'?'Borderline':'Not Eligible'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Next Donation Date</span>
                <span className="text-sm">After June 15, 2023</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Blood Pressure</span>
                <span className="text-sm">120/80 (Normal)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Hemoglobin Level</span>
                <span className="text-sm">14.2 g/dL (Normal)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Health Check</span>
                <span className="text-sm">March 15, 2023</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="w-full">Update Health Information</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blood" /> Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 border-b pb-3">
                <div className="bg-gray-100 p-2 rounded-md text-center min-w-14">
                  <div className="text-xs text-gray-500">JUN</div>
                  <div className="text-lg font-bold">15</div>
                </div>
                <div>
                  <p className="font-medium">Scheduled Donation</p>
                  <p className="text-sm text-gray-500">City General Hospital, 10:00 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-2 rounded-md text-center min-w-14">
                  <div className="text-xs text-gray-500">JUL</div>
                  <div className="text-lg font-bold">05</div>
                </div>
                <div>
                  <p className="font-medium">Health Check-up</p>
                  <p className="text-sm text-gray-500">Community Clinic, 2:30 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="flex-1">Cancel</Button>
            <Button className="medical-btn flex-1">
              <CalendarDays className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
